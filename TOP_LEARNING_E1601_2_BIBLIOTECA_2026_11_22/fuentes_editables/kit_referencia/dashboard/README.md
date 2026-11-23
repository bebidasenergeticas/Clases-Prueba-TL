# Kit de referencia — Dashboard Puerto A&M conectado a Excel (DEMO)

> **SIMULACIÓN ACADÉMICA — no son datos reales de Puerto A&M.**
> Código mínimo y probado (23/11/2026) que acompaña las guías. No es una app de producción.

## Qué incluye
| Archivo | Para qué sirve |
|---|---|
| `generar_excel.py` | Crea `Puerto_AM_Base_Datos_DEMO.xlsx` (hojas Ventas, Productos, Metas, Instrucciones; 403 líneas de venta, 01/01–31/03/2026; semilla fija). |
| `kpis.py` | Lee el Excel de forma robusta y calcula los 10 KPIs (solo ventas `Completada`). |
| `app.py` + `static/index.html` | API FastAPI + dashboard con Chart.js y asistente financiero. |
| `soul_financiero.md` | *System prompt* (convención del proyecto) que el backend inyecta al LLM. |
| `test_kpis.py` | 26 pruebas con verificación independiente (pandas + conjunto calculado a mano). |

## Ejecutar en Windows (PowerShell, Python 3.11 o superior)
```powershell
cd ruta\a\kit_referencia\dashboard
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
py generar_excel.py                      # (el archivo DEMO ya viene incluido; esto lo regenera)
uvicorn app:app --reload --port 8000
```
Abre <http://127.0.0.1:8000>. Si PowerShell bloquea el script de activación, ejecuta una vez
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (o usa `cmd` y `.venv\Scripts\activate.bat`).
Para detener el servidor: `Ctrl+C`.

## Probar la conexión real con Excel
1. Abre `Puerto_AM_Base_Datos_DEMO.xlsx`, cambia una **cantidad** en la hoja Ventas y **guarda** (Ctrl+S).
2. Si el dashboard avisa de archivo bloqueado, cierra Excel y reintenta. El bloqueo **depende de la
   aplicación y del modo en que se abrió el archivo; no siempre ocurre** (ver comentarios en `kpis.py`).
   Lo no guardado en Excel no está en disco, así que el dashboard no lo ve.
3. Pulsa **Actualizar datos**: los KPIs y gráficos cambian sin tocar el código.

## Pruebas
```powershell
pip install -r requirements-dev.txt
pytest -v
```

## Asistente financiero (opcional)
1. Copia `.env.example` a `.env` y escribe `OPENROUTER_API_KEY` y `OPENROUTER_MODEL` **solo en tu computadora**.
   Nunca los pegues en chats, prompts, el frontend ni GitHub (`.env` está en `.gitignore`).
2. Sin esas variables, `POST /api/chat` responde **503 «IA no configurada»** y la interfaz lo muestra: no se inventan respuestas.
3. El backend calcula las cifras; al modelo solo viaja el JSON de KPIs ya calculados (no filas del Excel) y `soul_financiero.md`.
4. Una API en la nube **no** es procesamiento local ni garantiza por sí sola que tus datos no se retengan o usen
   para entrenar: revisa las políticas del router y del proveedor del modelo antes de enviar datos reales.
   La llamada a OpenRouter (`/chat/completions`) se probó solo con un servidor simulado en las pruebas;
   **PENDIENTE DE COMPROBAR** con una clave real.

## Endpoints
`GET /api/kpis` · `GET /api/ventas` (filtros `desde, hasta, producto, categoria, canal, estado, limite, desplazamiento, orden`) ·
`POST /api/refresh` · `POST /api/chat` · `GET /api/health`.

## Límites y avisos
- Chart.js se carga desde jsDelivr (`chart.js@4.4.1`); sin internet verás los KPIs pero no los gráficos.
- El menú de `Productos` es propio de este kit; si tu landing usa otro menú costero, alinea la hoja Productos y `CATALOGO` en `generar_excel.py`.
- Un Excel en tu laptop no es la base de datos de un despliegue en la nube; GitHub Pages solo hospeda archivos estáticos (no ejecuta FastAPI ni protege claves).
- No hay autenticación: no expongas este dashboard con datos reales a Internet.
