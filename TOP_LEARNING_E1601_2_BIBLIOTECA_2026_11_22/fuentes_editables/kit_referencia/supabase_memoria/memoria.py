"""
memoria.py - Memoria de conversaciones con Supabase (backend de referencia).
Puerto A&M (restaurante ficticio) - SIMULACION ACADEMICA - Top Learning E1601.2.
Elaborado y probado el 23/11/2026 (ver test_memoria.py). Etiqueta: RECONSTRUCCION PEDAGOGICA.

IDEA CENTRAL
    El LLM no "recuerda": cada llamada empieza de cero. La memoria es un historial que
    TU backend guarda en la base de datos y vuelve a enviar al modelo en cada turno.

SEGURIDAD (leer antes de usar)
    * Este modulo usa el cliente con la clave PUBLISHABLE + el JWT del usuario. Asi las
      politicas RLS (sql/02_rls_politicas.sql) siguen aplicando: aunque el backend tenga un
      bug, la base de datos no entrega filas de otro usuario.
      Doc: https://supabase.com/docs/guides/database/postgres/row-level-security
    * La clave SECRET (sb_secret_...) usa el rol service_role, que SALTA todas las politicas
      RLS. Solo debe vivir en servidor; si se usa, TU codigo debe verificar el dueno de cada
      fila. Aqui solo se ofrece crear_cliente_admin() para tareas administrativas, NO para chat.
      Doc: https://supabase.com/docs/guides/getting-started/api-keys (verificado 23/11/2026)
    * Las claves se leen SIEMPRE de variables de entorno. Nunca se imprimen ni se registran.
    * Lo que viene de la base de datos es DATO, no instrucciones: solo se reenvian al modelo
      los roles 'user' y 'assistant'; un registro con role 'system' se descarta.

LIMITES HONESTOS
    * La llamada a OpenRouter se recibe como funcion inyectada (llm); ver guia de OpenRouter.
    * No se probo contra un proyecto Supabase real ni contra PostgREST (PENDIENTE DE COMPROBAR);
      si se probo la logica con un cliente simulado y el SQL/RLS en PostgreSQL local.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any, Callable, Mapping, Sequence

# ----------------------------------------------------------------------------- errores


class MemoriaError(Exception):
    """Error base. El mensaje NUNCA contiene claves."""


class ConfigError(MemoriaError):
    """Falta una variable de entorno (se nombra la variable, jamas su valor)."""


class CredencialesError(MemoriaError):
    """Clave o JWT invalido/caducado (401/403, 'Invalid API key', 'JWT expired')."""


class PermisoError(MemoriaError):
    """Postgres 42501: falta grant o la politica RLS rechazo la operacion."""


class ProyectoNoDisponibleError(MemoriaError):
    """Red caida, timeout o proyecto pausado/inaccesible (plan Free se pausa por inactividad)."""


class EscrituraNoVerificadaError(MemoriaError):
    """La escritura no devolvio las filas esperadas: NO se debe decir 'guardado/confirmado'."""


# ----------------------------------------------------------------------------- configuracion


@dataclass(frozen=True)
class Config:
    url: str
    publishable_key: str

    def __repr__(self) -> str:  # evita filtrar la clave en logs
        return f"Config(url={self.url!r}, publishable_key='***')"


def cargar_config(env: Mapping[str, str] | None = None) -> Config:
    env = os.environ if env is None else env
    faltan = [n for n in ("SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY") if not env.get(n)]
    if faltan:
        raise ConfigError("Faltan variables de entorno: " + ", ".join(faltan))
    return Config(url=env["SUPABASE_URL"].strip(), publishable_key=env["SUPABASE_PUBLISHABLE_KEY"].strip())


def crear_cliente_usuario(jwt_usuario: str, env: Mapping[str, str] | None = None):
    """Cliente supabase-py que actua COMO EL USUARIO (rol 'authenticated'), RLS activo.

    jwt_usuario = access_token que el frontend obtuvo de Supabase Auth (p. ej. tras
    signInAnonymously()). El backend debe recibirlo en el encabezado Authorization del
    request, nunca en la URL. Se fija en ClientOptions(headers=...) al crear el cliente
    (verificado con supabase-py 2.34.1: el JWT viaja en Authorization y la clave
    publishable en apikey; ver test_memoria.py). Se crea un cliente POR REQUEST: no
    compartir un cliente con JWT entre usuarios.
    """
    if not jwt_usuario:
        raise CredencialesError("Falta el token de sesion del usuario")
    cfg = cargar_config(env)
    from supabase import ClientOptions, create_client  # import tardio: se prueba sin la libreria

    opciones = ClientOptions(
        headers={"Authorization": f"Bearer {jwt_usuario}"},
        auto_refresh_token=False,  # el backend no gestiona sesiones del usuario
        persist_session=False,
    )
    return create_client(cfg.url, cfg.publishable_key, opciones)


def crear_cliente_admin(env: Mapping[str, str] | None = None):
    """RIESGO ALTO: cliente con SECRET key (service_role, salta RLS). Solo administracion,
    jamas para atender chat de clientes. No se usa en este modulo."""
    env = os.environ if env is None else env
    if not env.get("SUPABASE_URL") or not env.get("SUPABASE_SECRET_KEY"):
        raise ConfigError("Faltan variables de entorno: SUPABASE_URL, SUPABASE_SECRET_KEY")
    from supabase import create_client

    return create_client(env["SUPABASE_URL"].strip(), env["SUPABASE_SECRET_KEY"].strip())


# ----------------------------------------------------------------------------- clasificar errores


def clasificar_error(exc: Exception) -> MemoriaError:
    """Traduce excepciones de supabase-py/PostgREST/red a errores propios SIN copiar claves."""
    codigo = str(getattr(exc, "code", "") or "")
    texto = str(getattr(exc, "message", "") or exc).lower()
    estado = getattr(exc, "status", None) or getattr(exc, "status_code", None)
    if codigo == "42501" or "row-level security" in texto or "permission denied" in texto:
        return PermisoError("Permiso denegado (42501): revisa grants y politicas RLS; no desactives RLS.")
    if (
        codigo in ("PGRST301", "PGRST303")
        or estado in (401, 403)
        or "invalid api key" in texto
        or "jwt" in texto
    ):
        return CredencialesError("Credenciales invalidas o sesion caducada: vuelve a iniciar sesion / revisa claves.")
    if isinstance(exc, (ConnectionError, TimeoutError, OSError)) or estado in (502, 503, 504) or "timed out" in texto:
        return ProyectoNoDisponibleError("No se pudo contactar al proyecto (red, pausa por inactividad o mantenimiento).")
    return MemoriaError(f"Error de base de datos ({type(exc).__name__}).")


def _ejecutar(consulta):
    try:
        return consulta.execute()
    except MemoriaError:
        raise
    except Exception as exc:  # noqa: BLE001 - se reclasifica
        raise clasificar_error(exc) from None


# ----------------------------------------------------------------------------- memoria


class Memoria:
    """Operaciones de memoria sobre un cliente ya autenticado como el usuario."""

    def __init__(self, cliente: Any):
        self.db = cliente

    # --- conversacion -------------------------------------------------------------
    def obtener_o_crear_conversacion(self, conversation_id: str | None = None, channel: str = "web") -> str:
        """Devuelve el id de una conversacion DEL USUARIO.

        Si llega conversation_id, solo se acepta cuando RLS la deja leer (es del usuario).
        Si no existe o es ajena se crea una nueva, sin revelar que el id existe.
        Sin id: reutiliza la mas reciente del usuario o crea una.
        """
        if conversation_id:
            r = _ejecutar(self.db.table("conversations").select("id").eq("id", conversation_id).limit(1))
            if r.data:
                return r.data[0]["id"]
        else:
            r = _ejecutar(
                self.db.table("conversations").select("id").order("updated_at", desc=True).limit(1)
            )
            if r.data:
                return r.data[0]["id"]
        # owner_id lo pone la base de datos (default auth.uid()): el cliente no lo envia.
        r = _ejecutar(self.db.table("conversations").insert({"channel": channel}))
        if not r.data:
            raise EscrituraNoVerificadaError("No se pudo crear la conversacion")
        return r.data[0]["id"]

    # --- lectura ------------------------------------------------------------------
    def ultimos_mensajes(self, conversation_id: str, n: int = 12) -> list[dict]:
        """Ultimos n mensajes en orden cronologico (mas antiguo primero)."""
        if n < 1:
            return []
        r = _ejecutar(
            self.db.table("messages")
            .select("role,body,created_at")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=True)
            .limit(n)
        )
        return list(reversed(r.data or []))

    # --- escritura ----------------------------------------------------------------
    def guardar_turno(self, conversation_id: str, texto_usuario: str, texto_asistente: str) -> int:
        """Guarda usuario + asistente en UNA sola sentencia (insercion masiva = atomica).

        Verifica que la base devolvio 2 filas; si no, lanza EscrituraNoVerificadaError.
        """
        filas = [
            {"conversation_id": conversation_id, "role": "user", "body": texto_usuario[:4000]},
            {"conversation_id": conversation_id, "role": "assistant", "body": texto_asistente[:4000]},
        ]
        r = _ejecutar(self.db.table("messages").insert(filas))
        if not r.data or len(r.data) != 2:
            raise EscrituraNoVerificadaError("El turno no quedo guardado; no lo des por recordado")
        return len(r.data)

    def crear_solicitud_reserva_demo(
        self, personas: int, fecha: str, hora: str, conversation_id: str | None = None, notas: str | None = None
    ) -> dict:
        """Crea una SOLICITUD DEMO (estado 'solicitud_demo'). Devuelve la fila escrita.

        El chatbot solo puede decir 'solicitud registrada' usando la fila devuelta. 'Confirmada'
        no existe para el cliente: la RLS lo impide; lo cambia el backend con otra via (con cupo).
        """
        fila = {"personas": personas, "fecha": fecha, "hora": hora}
        if conversation_id:
            fila["conversation_id"] = conversation_id
        if notas:
            fila["notas"] = notas[:500]
        r = _ejecutar(self.db.table("reservations").insert(fila))
        if not r.data:
            raise EscrituraNoVerificadaError("La solicitud de reserva no quedo guardada")
        return r.data[0]


# ----------------------------------------------------------------------------- armar contexto


def construir_mensajes_openrouter(
    system_prompt: str,
    historial: Sequence[Mapping[str, str]],
    nuevo_mensaje: str,
    max_caracteres: int = 6000,
) -> list[dict]:
    """Arma la lista `messages` estilo chat-completions (system + historial + mensaje nuevo).

    * Descarta del historial cualquier rol distinto de 'user'/'assistant' (datos no confiables).
    * Si el historial excede max_caracteres, conserva los turnos MAS RECIENTES.
    """
    validos = [
        {"role": m["role"], "content": m["body"]}
        for m in historial
        if m.get("role") in ("user", "assistant") and m.get("body")
    ]
    elegidos: list[dict] = []
    total = len(nuevo_mensaje)
    for m in reversed(validos):
        total += len(m["content"])
        if total > max_caracteres:
            break
        elegidos.append(m)
    elegidos.reverse()
    return [{"role": "system", "content": system_prompt}, *elegidos, {"role": "user", "content": nuevo_mensaje}]


# ----------------------------------------------------------------------------- un turno completo


def responder_turno(
    memoria: Memoria,
    llm: Callable[[list[dict]], str],
    system_prompt: str,
    texto_usuario: str,
    conversation_id: str | None = None,
    n_historial: int = 12,
) -> tuple[str, str]:
    """Flujo de un turno: conversacion -> leer ultimos N -> llamar al modelo -> guardar turno.

    Devuelve (respuesta, conversation_id). Si el modelo falla NO se guarda nada (se evita un
    historial con turnos a medias); el usuario puede reintentar el mismo mensaje.
    """
    texto_usuario = (texto_usuario or "").strip()
    if not texto_usuario:
        raise MemoriaError("Mensaje vacio")
    cid = memoria.obtener_o_crear_conversacion(conversation_id)
    historial = memoria.ultimos_mensajes(cid, n_historial)
    mensajes = construir_mensajes_openrouter(system_prompt, historial, texto_usuario)
    respuesta = llm(mensajes)  # puede lanzar: no se guarda nada
    memoria.guardar_turno(cid, texto_usuario, respuesta)
    return respuesta, cid
