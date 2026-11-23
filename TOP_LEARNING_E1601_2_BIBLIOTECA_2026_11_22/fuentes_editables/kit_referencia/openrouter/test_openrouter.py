#!/usr/bin/env python3
"""
test_openrouter.py - Prueba minima de OpenRouter (chat completions) con manejo de errores.

Uso (Windows PowerShell):
    $env:OPENROUTER_API_KEY = "<tu clave, escrita por ti, nunca en un chat>"
    python test_openrouter.py
    python test_openrouter.py --prompt "Que platillos tienen?"

La clave se lee SOLO del entorno (OPENROUTER_API_KEY). Este script nunca la imprime.
En una app real este codigo vive en el BACKEND; el navegador nunca ve la clave.

Documentacion oficial (verificado 23/11/2026):
  - https://openrouter.ai/docs/api_reference/errors-and-debugging.md   (codigos de error, Retry-After)
  - https://openrouter.ai/docs/api_reference/limits.md                 (limites de modelos gratis, 429, 402)
  - https://openrouter.ai/docs/api_reference/authentication.md         (Bearer, mensajes 401)
  - https://openrouter.ai/docs/guides/routing/model-variants/free.md   (:free y aviso de fallbacks de pago)

Variables opcionales de entorno:
  OPENROUTER_MODEL           modelo principal (por defecto: openrouter/free)
  OPENROUTER_FALLBACK_MODELS lista separada por comas de modelos de respaldo (deben terminar en :free)
  OPENROUTER_BASE_URL        solo para pruebas con servidor simulado (por defecto https://openrouter.ai/api/v1)
  OPENROUTER_REFERER / OPENROUTER_TITLE  encabezados opcionales de atribucion (HTTP-Referer / X-OpenRouter-Title)

Codigos de salida: 0 OK | 1 fallo tras reintentos/fallbacks | 2 falta la clave | 3 error fatal (401/402/403/400)
"""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
import time

import requests

BASE_URL = os.environ.get("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
DEFAULT_MODEL = os.environ.get("OPENROUTER_MODEL", "openrouter/free")
TIMEOUT = (5, 60)            # (conexion, lectura) en segundos
MAX_RETRIES_PER_MODEL = 3    # intentos por modelo ante 408/429/5xx
BACKOFF_BASE = 1.0           # 1s, 2s, 4s ... (+ jitter)
BACKOFF_CAP = 20.0

# Estados que se reintentan (espera con backoff) y despues se cambia de modelo
RETRYABLE = {408, 429, 500, 502, 503, 504}
# Estados que NO se arreglan reintentando: se detiene y se explica
FATAL = {400, 401, 402, 403}

MENSAJES = {
    400: "400 Solicitud invalida: revisa el JSON (campo 'model' y 'messages'). Si viene del navegador, puede ser CORS: llama desde tu backend.",
    401: "401 Credencial invalida: la clave falta, esta mal copiada, fue borrada/deshabilitada o caduco. Crea otra en https://openrouter.ai/keys y vuelve a definir OPENROUTER_API_KEY.",
    402: "402 Creditos insuficientes o limite de la clave agotado. Revisa error.metadata.limit_source en el cuerpo; sube el limite de la clave o agrega creditos. Si 'Retry-After' viene en la respuesta, espera y reintenta.",
    403: "403 Prohibido: permisos, guardrail, presupuesto o moderacion. Lee error.message y error.metadata.",
    404: "404 No encontrado: el ID del modelo no existe o ya no esta disponible. Consulta https://openrouter.ai/api/v1/models y cambia el ID.",
    408: "408 Tiempo de espera agotado en el servidor.",
    429: "429 Limite de peticiones (modelo gratis o proveedor saturado). Espera con backoff; con :free hay tope por minuto y por dia.",
    502: "502 El modelo/proveedor elegido no responde o devolvio algo invalido.",
    503: "503 No hay proveedor disponible que cumpla tus requisitos de enrutamiento.",
}


def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def descubrir_modelos_free(limit: int = 5) -> list[str]:
    """Lee el catalogo PUBLICO (sin clave) y devuelve IDs con precio prompt=0 y completion=0 que terminan en ':free'."""
    try:
        r = requests.get(f"{BASE_URL}/models", timeout=TIMEOUT)
        r.raise_for_status()
        out = []
        for m in r.json().get("data", []):
            p = m.get("pricing", {})
            if str(m.get("id", "")).endswith(":free") and float(p.get("prompt", 1)) == 0 and float(p.get("completion", 1)) == 0:
                out.append((m.get("context_length", 0), m["id"]))
        out.sort(reverse=True)
        return [i for _, i in out[:limit]]
    except Exception as exc:  # el catalogo es opcional: no debe romper la prueba
        log(f"[aviso] no pude leer el catalogo de modelos ({exc.__class__.__name__}); sigo sin descubrimiento.")
        return []


def parse_error(resp: requests.Response) -> tuple[str, dict]:
    """Extrae error.message y error.metadata sin lanzar excepciones."""
    try:
        data = resp.json()
        err = data.get("error") or {}
        return str(err.get("message", "")), (err.get("metadata") or {})
    except ValueError:
        return resp.text[:200], {}


def espera_backoff(intento: int, retry_after: str | None) -> float:
    if retry_after:
        try:
            return min(float(retry_after), 60.0)
        except ValueError:
            pass
    return min(BACKOFF_CAP, BACKOFF_BASE * (2 ** intento)) + random.uniform(0, 0.5)


class FatalError(Exception):
    def __init__(self, status: int, detalle: str):
        super().__init__(detalle)
        self.status = status


def llamar_modelo(api_key: str | None, modelo: str, prompt: str, system: str | None, sleep=time.sleep) -> str:
    """Intenta un modelo con reintentos. Devuelve el texto o lanza RuntimeError (agotado) / FatalError (no reintentar)."""
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    if os.environ.get("OPENROUTER_REFERER"):
        headers["HTTP-Referer"] = os.environ["OPENROUTER_REFERER"]       # opcional
    if os.environ.get("OPENROUTER_TITLE"):
        headers["X-OpenRouter-Title"] = os.environ["OPENROUTER_TITLE"]   # opcional

    messages = ([{"role": "system", "content": system}] if system else []) + [{"role": "user", "content": prompt}]
    body = {"model": modelo, "messages": messages, "max_tokens": 200}

    ultimo = "sin intentos"
    for intento in range(MAX_RETRIES_PER_MODEL):
        try:
            resp = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=body, timeout=TIMEOUT)
        except (requests.Timeout, requests.ConnectionError) as exc:
            ultimo = f"red/timeout ({exc.__class__.__name__})"
            log(f"[{modelo}] {ultimo}; intento {intento + 1}/{MAX_RETRIES_PER_MODEL}")
            sleep(espera_backoff(intento, None))
            continue

        status = resp.status_code
        if status == 200:
            data = resp.json()
            # Un 200 puede traer un error dentro del cuerpo (fallo durante la generacion)
            err = data.get("error") or (data.get("choices") or [{}])[0].get("error")
            if err:
                ultimo = f"error dentro de 200: {err.get('code')} {err.get('message')}"
                log(f"[{modelo}] {ultimo}")
                sleep(espera_backoff(intento, None))
                continue
            texto = (data["choices"][0].get("message") or {}).get("content") or ""
            if not texto.strip():
                ultimo = "respuesta vacia"
                log(f"[{modelo}] {ultimo}; reintento")
                sleep(espera_backoff(intento, None))
                continue
            log(f"[ok] modelo usado: {data.get('model', modelo)}")
            return texto

        mensaje, meta = parse_error(resp)
        explicacion = MENSAJES.get(status, f"HTTP {status}")
        ultimo = f"{explicacion} | servidor dijo: {mensaje!r}"
        if status in FATAL:
            raise FatalError(status, ultimo)
        if status == 404:
            raise RuntimeError(ultimo)  # no tiene sentido reintentar el mismo ID: pasar al siguiente modelo
        if status in RETRYABLE or status >= 500:
            espera = espera_backoff(intento, resp.headers.get("Retry-After"))
            log(f"[{modelo}] {explicacion} intento {intento + 1}/{MAX_RETRIES_PER_MODEL}; espero {espera:.1f}s")
            sleep(espera)
            continue
        raise RuntimeError(ultimo)
    raise RuntimeError(f"agotados {MAX_RETRIES_PER_MODEL} intentos: {ultimo}")


def preguntar(api_key: str | None, prompt: str, system: str | None = None, modelos: list[str] | None = None, sleep=time.sleep) -> str:
    """Prueba cada modelo en orden. Solo hay respaldo entre modelos ':free' / openrouter/free para NO generar cargos."""
    modelos = modelos or [DEFAULT_MODEL]
    fallos = []
    for m in modelos:
        try:
            return llamar_modelo(api_key, m, prompt, system, sleep=sleep)
        except FatalError:
            raise
        except RuntimeError as exc:
            fallos.append(f"- {m}: {exc}")
            log(f"[fallback] {m} no funciono; paso al siguiente.")
    raise RuntimeError("Ningun modelo respondio:\n" + "\n".join(fallos))


def main() -> int:
    ap = argparse.ArgumentParser(description="Prueba minima OpenRouter con reintentos y fallback.")
    ap.add_argument("--prompt", default="Responde en una frase: que es una API?")
    ap.add_argument("--system", default=None, help="Mensaje de sistema opcional (p. ej. el contenido de soul.md)")
    ap.add_argument("--allow-no-key", action="store_true", help="SOLO para documentar el error del endpoint sin clave")
    ap.add_argument("--discover-free", action="store_true", help="Agrega como respaldo modelos :free leidos del catalogo publico")
    args = ap.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not api_key and not args.allow_no_key:
        log("Falta OPENROUTER_API_KEY. Defina la variable de entorno (no pegue la clave en chats, codigo ni GitHub).")
        log("PowerShell:  $env:OPENROUTER_API_KEY = '<su clave>'")
        return 2

    modelos = [DEFAULT_MODEL]
    modelos += [m.strip() for m in os.environ.get("OPENROUTER_FALLBACK_MODELS", "").split(",") if m.strip()]
    if args.discover_free:
        modelos += [m for m in descubrir_modelos_free() if m not in modelos]
    # Seguridad de costo: un modelo sin :free (salvo openrouter/free) puede generar cargos
    de_pago = [m for m in modelos if m != "openrouter/free" and not m.endswith(":free")]
    if de_pago:
        log(f"[aviso] estos modelos podrian generar cargos: {de_pago}")

    try:
        print(preguntar(api_key or None, args.prompt, args.system, modelos))
        return 0
    except FatalError as exc:
        log(f"ERROR FATAL: {exc}")
        return 3
    except RuntimeError as exc:
        log(f"ERROR: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
