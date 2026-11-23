"""
app.py - API FastAPI minima del dashboard Puerto A&M (SIMULACION ACADEMICA).

Ejecuta:  uvicorn app:app --reload --port 8000     y abre http://127.0.0.1:8000

Endpoints
  GET  /api/kpis      KPIs (filtros opcionales: desde, hasta, producto, categoria, canal)
  GET  /api/ventas    lineas de venta (mismos filtros + estado, limite, desplazamiento, orden)
  POST /api/refresh   vuelve a leer el Excel (boton «Actualizar datos»)
  POST /api/chat      asistente financiero: el backend calcula, el LLM solo explica
  GET  /api/health

Variables de entorno (ver .env.example; NUNCA subas el .env ni pegues claves en el chat/frontend)
  EXCEL_PATH          ruta del .xlsx (por defecto, el DEMO junto a este archivo)
  OPENROUTER_API_KEY  clave de OpenRouter (solo backend)
  OPENROUTER_MODEL    id del modelo, p. ej. uno gratuito listado en openrouter.ai/models
  OPENROUTER_BASE_URL (opcional) por defecto https://openrouter.ai/api/v1
"""
from __future__ import annotations

import json
import os
import threading
from datetime import datetime, timezone
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import kpis as K

BASE = Path(__file__).resolve().parent
load_dotenv(BASE / ".env")  # opcional; las variables reales del sistema tienen prioridad
SOUL_PATH = BASE / "soul_financiero.md"

app = FastAPI(title="Puerto A&M — Dashboard (DEMO)", version="1.0.0")

_lock = threading.Lock()
_estado: dict = {"datos": None, "leido_en": None, "ruta": None}


def _ruta_excel() -> Path:
    return Path(os.environ.get("EXCEL_PATH") or BASE / "Puerto_AM_Base_Datos_DEMO.xlsx")


def _recargar() -> dict:
    """Lee el Excel y reemplaza la cache SOLO si la lectura fue correcta."""
    ruta = _ruta_excel()
    datos = K.leer_excel(ruta)
    with _lock:
        _estado.update(datos=datos, leido_en=datetime.now(timezone.utc).isoformat(timespec="seconds"),
                       ruta=str(ruta))
    return datos


def _datos() -> dict:
    with _lock:
        d = _estado["datos"]
    if d is None:
        try:
            d = _recargar()
        except K.ExcelBloqueadoError as e:
            raise HTTPException(423, str(e))
        except K.ExcelError as e:
            raise HTTPException(500, str(e))
    return d


def _filtros(desde, hasta, producto, categoria, canal) -> dict:
    for nombre, valor in (("desde", desde), ("hasta", hasta)):
        if valor and K._a_fecha(valor) is None:
            raise HTTPException(422, f"Fecha «{nombre}» no válida (usa AAAA-MM-DD).")
    return {k: v for k, v in dict(desde=desde, hasta=hasta, producto=producto,
                                  categoria=categoria, canal=canal).items() if v}


@app.get("/api/health")
def health():
    return {"ok": True, "leido_en": _estado["leido_en"], "excel": Path(_estado["ruta"] or _ruta_excel()).name}


@app.get("/api/kpis")
def api_kpis(desde: str | None = None, hasta: str | None = None, producto: str | None = None,
             categoria: str | None = None, canal: str | None = None):
    datos = _datos()
    out = K.calcular_kpis(datos, _filtros(desde, hasta, producto, categoria, canal))
    out["opciones"] = K.opciones_filtros(datos)
    out["leido_en"] = _estado["leido_en"]
    return out


@app.get("/api/ventas")
def api_ventas(desde: str | None = None, hasta: str | None = None, producto: str | None = None,
               categoria: str | None = None, canal: str | None = None, estado: str | None = None,
               limite: int = Query(50, ge=1, le=500), desplazamiento: int = Query(0, ge=0),
               orden: str = Query("asc", pattern="^(asc|desc)$")):
    return K.listar_ventas(_datos(), _filtros(desde, hasta, producto, categoria, canal),
                           estado, limite, desplazamiento, orden)


@app.post("/api/refresh")
def api_refresh():
    try:
        datos = _recargar()
    except K.ExcelBloqueadoError as e:
        # 423 Locked: se conservan los datos de la ultima lectura correcta.
        raise HTTPException(423, str(e))
    except K.ExcelError as e:
        raise HTTPException(500, str(e))
    return {"ok": True, "leido_en": _estado["leido_en"], "lineas": len(datos["ventas"]),
            "calidad": datos["calidad"]}


class ChatIn(BaseModel):
    pregunta: str = Field(min_length=1, max_length=1000)
    desde: str | None = None
    hasta: str | None = None
    producto: str | None = None
    categoria: str | None = None
    canal: str | None = None


def _config_ia() -> tuple[str, str, str]:
    key = (os.environ.get("OPENROUTER_API_KEY") or "").strip()
    model = (os.environ.get("OPENROUTER_MODEL") or "").strip()
    base = (os.environ.get("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1").rstrip("/")
    if not key or not model:
        raise HTTPException(503, "IA no configurada: falta OPENROUTER_API_KEY y/o OPENROUTER_MODEL en el "
                                 "entorno del servidor. Las cifras del dashboard siguen disponibles; "
                                 "el asistente no responderá hasta configurarlas.")
    return key, model, base


@app.post("/api/chat")
def api_chat(body: ChatIn):
    key, model, base = _config_ia()  # sin key => 503 explicito, jamas se inventa una respuesta
    f = _filtros(body.desde, body.hasta, body.producto, body.categoria, body.canal)
    # El backend calcula. Al LLM solo van agregados (KPIs), nunca filas crudas del Excel.
    resumen = K.calcular_kpis(_datos(), f)
    resumen.pop("calidad", None)  # detalle de filas/ids no es necesario para responder
    resumen["calidad_resumen"] = _datos()["calidad"]["advertencias"]
    soul = SOUL_PATH.read_text(encoding="utf-8")
    mensajes = [
        {"role": "system", "content": soul},
        {"role": "user", "content": "KPIS_CALCULADOS (JSON, fuente única de verdad):\n"
                                    + json.dumps(resumen, ensure_ascii=False)
                                    + "\n\nPREGUNTA DEL USUARIO:\n" + body.pregunta},
    ]
    try:
        r = httpx.post(f"{base}/chat/completions", timeout=60,
                       headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                       json={"model": model, "messages": mensajes, "temperature": 0.2})
    except httpx.HTTPError as e:
        raise HTTPException(502, f"No se pudo contactar al proveedor de IA ({type(e).__name__}).")
    if r.status_code != 200:
        # No se devuelve el cuerpo completo: podria incluir datos de la peticion.
        raise HTTPException(502, f"El proveedor de IA respondió HTTP {r.status_code}. "
                                 "Revisa la clave, el modelo (los gratuitos pueden saturarse) y los límites.")
    try:
        texto = r.json()["choices"][0]["message"]["content"]
    except (KeyError, IndexError, ValueError):
        raise HTTPException(502, "Respuesta inesperada del proveedor de IA.")
    return {"respuesta": texto, "modelo": model, "base": "KPIs calculados por el backend",
            "aviso": "SIMULACIÓN ACADÉMICA. Verifica las cifras contra el dashboard."}


app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")


@app.get("/")
def index():
    return FileResponse(BASE / "static" / "index.html")
