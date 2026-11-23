# Pruebas del kit `vercel_landing` (Agente E)

Fecha de ejecución: 23/11/2026 · Entorno: Linux (contenedor), Python 3.13, FastAPI 0.165.0, uvicorn 0.54.0, httpx 0.28.1, Vercel CLI 66.6.0 (instalado en local, sin login).
Código probado: `fuentes_editables/kit_referencia/vercel_landing/` (`app.py`, `public/`, `requirements.txt`, `.env.example`, `.gitignore`, `soul.md`).

## Qué SÍ se verificó
- Ejecución LOCAL con uvicorn (no en Vercel).
- Respuestas HTTP reales de `curl` contra el servidor local.
- Una llamada REAL a `https://openrouter.ai/api/v1/chat/completions` con una clave claramente FALSA (`sk-or-v1-XXXXXXXXXXXXXXXXFALSA`): OpenRouter respondió 401 y el backend lo tradujo a un 502 controlado (no se filtró la clave en logs).
- Camino feliz y errores del proveedor contra un MOCK local de OpenRouter (no es OpenRouter real).
- `vercel --version`, `vercel build --help`, `vercel deploy --help`, `vercel env --help`, `vercel whoami` sin credenciales.

## Qué NO se verificó (PENDIENTE DE COMPROBAR)
- Ningún despliegue real en Vercel (no hay cuenta ni login; no se desplegó nada).
- Respuesta real de un modelo de OpenRouter con una clave válida.
- Comportamiento exacto de `GET /api/chat` (405 vs 404) y de `public/` servido por la CDN en Vercel.
- Cold starts, tiempos y logs en el panel de Vercel.

## Suite 1 — servidor local SIN `OPENROUTER_API_KEY`
Comando de arranque: `uvicorn app:app --port 8000` (dentro de la carpeta del kit, con el entorno virtual con `pip install fastapi uvicorn httpx`).

```text
### Suite 1: sin OPENROUTER_API_KEY
$ curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://127.0.0.1:8000/
200 text/html; charset=utf-8
$ curl -s http://127.0.0.1:8000/ | head -n 4
<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8">
$ curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://127.0.0.1:8000/app.js
200 text/javascript; charset=utf-8
$ GET /api/health
{"ok":true,"chat_configured":false} [200]
$ POST /api/chat valido, sin clave
{"ok":false,"error":"chat_not_configured","detail":"El asistente no esta configurado en este despliegue (falta la variable OPENROUTER_API_KEY)."} [503]
$ POST mensaje vacio
{"ok":false,"error":"invalid_input","detail":[{"field":"message","msg":"String should have at least 1 character"}]} [422]
$ POST solo espacios
{"ok":false,"error":"invalid_input","detail":[{"field":"message","msg":"Value error, el mensaje no puede estar vacio"}]} [422]
$ POST 501 caracteres (respuesta recortada a 300 chars)
{"ok":false,"error":"invalid_input","detail":[{"field":"message","msg":"String should have at most 500 characters"}]} [422]
$ POST sin campo message
{"ok":false,"error":"invalid_input","detail":[{"field":"message","msg":"Field required"}]} [422]
$ POST JSON invalido
{"ok":false,"error":"invalid_input","detail":[{"field":"1","msg":"JSON decode error"}]} [422]
$ POST role "system" en history (intento de inyeccion)
{"ok":false,"error":"invalid_input","detail":[{"field":"history.0.role","msg":"Input should be 'user' or 'assistant'"}]} [422]
$ POST history con 7 turnos
{"ok":false,"error":"invalid_input","detail":[{"field":"history","msg":"List should have at most 6 items after validation, not 7"}]} [422]
$ GET /api/chat (nota: en local el mount "/" intercepta; en Vercel se espera 405 - PENDIENTE DE COMPROBAR)
{"detail":"Not Found"} [404]
$ GET /no-existe
[404]
$ Preflight CORS desde origen permitido (http://localhost:8000)
HTTP/1.1 200 OK
access-control-allow-methods: POST, GET, OPTIONS
access-control-allow-origin: http://localhost:8000
$ Preflight CORS desde origen NO permitido (https://sitio-malicioso.example)
HTTP/1.1 400 Bad Request
Disallowed CORS origin
```

Lectura: la landing (`public/index.html`, `app.js`) se sirve (200); `POST /api/chat` sin clave devuelve un **503 controlado** con mensaje claro (no 500 ni traza); entradas inválidas devuelven **422** con detalle compacto (sin devolver el texto enviado); CORS permite el origen listado y rechaza `https://sitio-malicioso.example` (400). Nota: el `GET /api/chat` → 404 es peculiaridad local (el `mount("/")` de desarrollo intercepta); en Vercel la ruta la resuelve la plataforma (PENDIENTE DE COMPROBAR si da 405).

## Suite 2a — clave FALSA contra OpenRouter REAL
```text
### Suite 2a: clave FALSA (sk-or-v1-XXXX...FALSA) contra https://openrouter.ai/api/v1 REAL
$ GET /api/health
{"ok":true,"chat_configured":true} [200]
$ POST /api/chat valido
{"ok":false,"error":"upstream_auth","detail":"El proveedor rechazo la credencial del servidor. Revisa la variable de entorno."} [502]
[log del servidor, solo líneas de la app]
INFO:puerto-am:chat: upstream status=401 msg_len=4
```
Comprobación: `grep -c "XXXX" log` = 0 (la clave no aparece en los logs de la app).

## Suite 2b — backend contra MOCK local de OpenRouter
El mock (`scratchpad/mock_upstream.py`, no incluido en el kit) imita `/v1/chat/completions` y devuelve códigos según el sufijo de la clave falsa. Se usó la variable `OPENROUTER_BASE_URL`.
```text
### Suite 2b: backend contra MOCK local de OpenRouter (NO es una llamada real; clave falsa 'mock-ok')
$ POST /api/chat con history
{"ok":true,"reply":"Respuesta MOCK: el ceviche cuesta $120 (demo)."} [200]
--- Lo que recibio el mock (sin imprimir la clave):
{"path": "/v1/chat/completions", "auth_header_present": true, "model": "openrouter/free", "roles": ["system", "user", "assistant", "user"], "max_tokens": 300, "last_user": "Cuanto cuesta el ceviche?"}
$ clave mock-ratelimit => 
{"ok":false,"error":"rate_limited","detail":"Demasiadas solicitudes al proveedor. Espera un momento."} [429]
$ clave mock-credits => 
{"ok":false,"error":"upstream_credits","detail":"El proveedor reporta falta de creditos/limite."} [502]
$ clave mock-boom => 
{"ok":false,"error":"upstream_error","detail":"El proveedor respondio con error (500)."} [502]
$ clave mock-badjson => 
{"ok":false,"error":"upstream_bad_response","detail":"Respuesta inesperada del proveedor."} [502]
$ upstream inalcanzable (puerto cerrado)
{"ok":false,"error":"upstream_unreachable","detail":"No se pudo contactar al proveedor de IA."} [502]
```
Lectura: el backend envía `system` (de `soul.md`) + historial validado + mensaje del usuario, con `Authorization: Bearer …` solo desde el servidor, `max_tokens=300` y el modelo por defecto `openrouter/free` (ese ID aparece en el listado público `https://openrouter.ai/api/v1/models` consultado el 23/11/2026; los IDs de modelos cambian: se configura con `OPENROUTER_MODEL`). Mapa de errores: 429 → 429; 402 → 502 `upstream_credits`; 401/403 → 502 `upstream_auth`; otros ≥400 → 502; JSON inesperado → 502; red/timeout → 502/504.

## Vercel CLI (sin login, sin desplegar)
```text
$ npm i vercel --prefix <carpeta-temporal>  (instalación local, no global)
$ vercel --version
Vercel CLI 66.6.0 (native)
66.6.0

$ vercel build --help
<claude-code-hint v="1" type="plugin" value="vercel@claude-plugins-official" />
▲ vercel build [options]
Build the project.

Options:
  --deployment <DEPLOYMENT>        Deployment ID to pull environment variables
                                   from (e.g. dpl_xxx)
  -e, --environment <ENVIRONMENT>  Environment to build for: production,
                                   preview, or a custom environment (default:
                                   preview)
  -o, --output <DIR>               Directory where built assets will be written
                                   to
  --prod                           Build a production deployment
  -p, --project <NAME_OR_ID>       Project name or ID (default: linked project)
  --standalone                     Create a standalone build with all
                                   dependencies inlined into function output
                                   folders
  -y, --yes                        Skip the confirmation prompt about pulling
                                   environment variables and project settings
                                   when not found locally

Global Options: See `vercel --help`

Examples:
  Build the project
    vercel build

  Build the project in a specific directory
    vercel build --cwd ./path-to-project

  Build with deployment-scoped environment variables
    vercel build --deployment dpl_xxx

$ vercel deploy --help (primeras lineas)
<claude-code-hint v="1" type="plugin" value="vercel@claude-plugins-official" />
▲ vercel deploy [project-path] [options]
Deploy your project to Vercel. Use `--temporary` to create a temporary
deployment without logging in. The `deploy` command is the default command for
the Vercel CLI, and can be omitted (`vc deploy my-app` equals `vc my-app`). Use
`--dry` to inspect the detected framework preset and source files without
deploying.

Options:
  --archive <FORMAT>                 Compress the deployment code into an
                                     archive before uploading it
  --build-env <KEY=VALUE>            Specify environment variables during
                                     build-time (e.g. `--build-env KEY1=value1
                                     --build-env KEY2=value2`)
  --create-if-missing                Create the --project if it doesn't exist
                                     yet. Needed only when --project names a new
                                     project with --yes or in non-interactive
                                     mode. Can't be used with --dry
  --delete-project-after <DURATION>  Create a temporary project that is deleted
                                     automatically after 1h, 1d, 1w, 2w, or 30d.
                                     Only applies when the deploy creates the
                                     project
  --dry                              Inspect the detected framework preset and
                                     source files without uploading or creating
                                     a deployment. Non-TTY output includes every
                                     file as JSON
  --env <KEY=VALUE>                  Specify environment variables during
                                     run-time (e.g. `--env KEY1=value1 --env
                                     KEY2=value2`)
  --environment <ENVIRONMENT>        Environment to deploy to: production,

$ vercel env --help (primeras lineas)
<claude-code-hint v="1" type="plugin" value="vercel@claude-plugins-official" />
▲ vercel env <command>
Interact with Environment Variables for a Project

Commands:
  add <name>        Add an Environment Variable
  list              List all Environment Variables for a Project
  pull [filename]   Pull Environment Variables into a local file (default:
                    .env.local)
  remove <name>     Remove an Environment Variable (see examples below)
  run <command>...  Run a command with environment variables from the linked
                    Vercel project
  update <name>     Update the value of an existing Environment Variable (see
                    examples below)

Global Options: See `vercel --help`

Examples:
  Run a command with Environment Variables from the linked Project
    vercel env run -- <command>

  Add one variable to multiple Environments
    vercel env add API_URL --environment production,preview,development
$ vercel whoami (sin login)
<claude-code-hint v="1" type="plugin" value="vercel@claude-plugins-official" />
> Logged out.
> Run `vercel deploy --temporary` to create a temporary deployment you can claim later, or `vercel login` to log in.

$ vercel deploy --dry   (sin login)
Error: No existing credentials found. Run `vercel deploy --temporary` to create a temporary deployment you can claim later, or `vercel login` to log in.

$ vercel build   (sin login ni proyecto vinculado)
{ "status": "error", "reason": "project_settings_required",
  "message": "No project settings found locally. Run pull to retrieve them, or re-run with --yes to pull automatically.", ... }
```
Lectura: `vercel deploy --dry` y `vercel build` requieren credenciales/proyecto vinculado (`vercel login`/`vercel pull`). No se ejecutó `vercel deploy --temporary` porque habría creado un despliegue público real (fuera del alcance acordado).

## Limitaciones de esta evidencia
- Es una prueba LOCAL: demuestra la lógica (validación, errores controlados, CORS, no filtrar secretos), no el despliegue.
- Un despliegue real requiere: repositorio en GitHub, proyecto importado en Vercel, variable `OPENROUTER_API_KEY` configurada y redeploy, y una prueba `curl` a la URL pública (ver `fuentes_editables/research/vercel.md`).
