"""Puerto A&M (DEMO) - backend minimo para Vercel (FastAPI).

Estructura segun la documentacion vigente de Vercel (verificado 23/11/2026):
  https://vercel.com/docs/frameworks/backend/fastapi
  - Vercel busca una instancia FastAPI llamada `app` en app.py / index.py /
    server.py / main.py (o dentro de src/ o app/).
  - Los archivos de la carpeta `public/` los sirve la CDN de Vercel en la raiz
    (public/index.html -> "/"). NO se monta `public/` con app.mount().
  - Dependencias en requirements.txt (o pyproject.toml).

Secretos: la clave de OpenRouter se lee SOLO de la variable de entorno
OPENROUTER_API_KEY (en Vercel: Project Settings > Environment Variables;
en local: archivo .env.local o variable del terminal). Nunca va al navegador.
"""
import logging
import os
from pathlib import Path

import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from typing import Literal

log = logging.getLogger("puerto-am")
logging.basicConfig(level=logging.INFO)

BASE_DIR = Path(__file__).parent
MAX_MESSAGE_CHARS = 500          # limite de longitud por mensaje
MAX_HISTORY_ITEMS = 6            # turnos previos que acepta el backend
MAX_OUTPUT_TOKENS = 300          # tope de respuesta del modelo
UPSTREAM_TIMEOUT_S = 25          # timeout hacia OpenRouter

# CORS restringido: lista explicita de origenes (NUNCA "*" con datos privados).
# En Vercel con frontend y API en el MISMO dominio no hace falta CORS; solo se
# usa si el frontend vive en otro origen (p. ej. una pagina estatica aparte).
DEFAULT_ORIGINS = "http://localhost:8000,http://127.0.0.1:8000"
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",") if o.strip()
]

app = FastAPI(title="Puerto A&M DEMO", docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
    allow_credentials=False,
    max_age=600,
)


def load_system_prompt() -> str:
    """`soul.md` = convencion de ESTE proyecto: un Markdown que el backend inyecta
    como mensaje `system`. No es un estandar de OpenRouter ni de Vercel."""
    f = BASE_DIR / "soul.md"
    try:
        return f.read_text(encoding="utf-8")
    except OSError:
        return "Eres un asistente de un restaurante ficticio (DEMO). Responde breve."


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=MAX_MESSAGE_CHARS)
    history: list[Turn] = Field(default_factory=list, max_length=MAX_HISTORY_ITEMS)

    @field_validator("message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("el mensaje no puede estar vacio")
        return v


def err(status: int, code: str, detail: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"ok": False, "error": code, "detail": detail})


@app.exception_handler(RequestValidationError)
async def bad_input(_: Request, exc: RequestValidationError):
    # Respuesta compacta: no se devuelve de vuelta el contenido enviado (evita eco de entradas largas).
    problems = [{"field": ".".join(str(x) for x in e["loc"][1:]) or "body", "msg": e["msg"]} for e in exc.errors()]
    return JSONResponse(status_code=422, content={"ok": False, "error": "invalid_input", "detail": problems})


@app.get("/api/health")
def health():
    # No revela la clave; solo si existe (para diagnosticar "despliegue sin variable").
    return {"ok": True, "chat_configured": bool(os.getenv("OPENROUTER_API_KEY"))}


@app.post("/api/chat")
async def chat(body: ChatIn):
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    if not api_key:
        # Error controlado y claro; sin stack trace ni detalles internos.
        log.warning("chat: falta OPENROUTER_API_KEY en el entorno")
        return err(503, "chat_not_configured",
                   "El asistente no esta configurado en este despliegue (falta la variable OPENROUTER_API_KEY).")

    base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
    model = os.getenv("OPENROUTER_MODEL", "openrouter/free")

    messages = [{"role": "system", "content": load_system_prompt()}]
    messages += [t.model_dump() for t in body.history]
    messages.append({"role": "user", "content": body.message})

    try:
        async with httpx.AsyncClient(timeout=UPSTREAM_TIMEOUT_S) as client:
            r = await client.post(
                f"{base_url}/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json={"model": model, "messages": messages, "max_tokens": MAX_OUTPUT_TOKENS},
            )
    except httpx.TimeoutException:
        log.warning("chat: timeout hacia el proveedor")
        return err(504, "upstream_timeout", "El proveedor de IA tardo demasiado. Intenta de nuevo.")
    except httpx.HTTPError as e:
        log.warning("chat: error de red hacia el proveedor: %s", type(e).__name__)
        return err(502, "upstream_unreachable", "No se pudo contactar al proveedor de IA.")

    # Solo se registra el codigo de estado, nunca la clave ni el contenido del usuario.
    log.info("chat: upstream status=%s msg_len=%s", r.status_code, len(body.message))
    if r.status_code == 429:
        return err(429, "rate_limited", "Demasiadas solicitudes al proveedor. Espera un momento.")
    if r.status_code in (401, 403):
        return err(502, "upstream_auth", "El proveedor rechazo la credencial del servidor. Revisa la variable de entorno.")
    if r.status_code == 402:
        return err(502, "upstream_credits", "El proveedor reporta falta de creditos/limite.")
    if r.status_code >= 400:
        return err(502, "upstream_error", f"El proveedor respondio con error ({r.status_code}).")

    try:
        reply = r.json()["choices"][0]["message"]["content"]
    except (ValueError, KeyError, IndexError, TypeError):
        return err(502, "upstream_bad_response", "Respuesta inesperada del proveedor.")
    return {"ok": True, "reply": reply}


# Solo para desarrollo local (uvicorn): Vercel define VERCEL=1 y sirve public/ por si mismo.
if not os.getenv("VERCEL"):
    from fastapi.staticfiles import StaticFiles

    app.mount("/", StaticFiles(directory=str(BASE_DIR / "public"), html=True), name="public-local")
