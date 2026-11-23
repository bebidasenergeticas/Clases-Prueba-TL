# Investigación Vercel — insumo para el PDF 03 «Vercel desde cero»

**Autor:** Agente E (investigador de Vercel) · **Fecha de verificación técnica:** 23/11/2026 · **Clase de referencia:** domingo 22/11/2026 (grupo E1601.2, Top Learning).

> Convención de este archivo. Toda afirmación sobre comandos, configuración, precios o límites lleva la URL oficial consultada y se considera **verificada el 23/11/2026** (las páginas de documentación de Vercel se leyeron en su versión Markdown, p. ej. `https://vercel.com/docs/frameworks/backend/fastapi`, con marca «last_updated» del propio sitio). Etiquetas de contenido usadas: **EN CLASE**, **ACTUALIZACIÓN EXTERNA**, **ACLARACIÓN TÉCNICA POSTERIOR**, **RECONSTRUCCIÓN PEDAGÓGICA**, **DEMO SIMULADA**, **PENDIENTE DE COMPROBAR**. Lo que NO se pudo comprobar está marcado como **PENDIENTE DE COMPROBAR** y concentrado en la sección 16.
>
> Evidencia propia: código probado en `fuentes_editables/kit_referencia/vercel_landing/` y registro de pruebas en `evidencias_qa/vercel_pruebas.md` (pruebas LOCALES; **no** se hizo ningún despliegue real). Capturas reales de páginas públicas en `recursos_visuales/capturas/vercel_*.png`.

---

## 0. Resumen ejecutivo (10 ideas para la guía)

1. **Vercel es una plataforma de despliegue** (hosting de frontend + ejecución de backend «serverless»). **GitHub guarda código**; **GitHub Pages** solo publica archivos estáticos; **Supabase** guarda datos; **OpenRouter** da acceso a modelos de IA. Cada una resuelve una pieza distinta.
2. Conectar un repositorio de GitHub a Vercel crea **un deployment por cada push**: producción para la rama de producción (normalmente `main`), *preview* para las demás ramas y pull requests. Fuente: `https://vercel.com/docs/git/vercel-for-github` y `https://vercel.com/docs/deployments/environments` (verificado 23/11/2026).
3. Para **FastAPI**, Vercel busca una instancia `app` en `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py` o `asgi.py` (o las mismas dentro de `src/` o `app/`); **no hace falta `vercel.json`** para lo básico. Los archivos de `public/` los sirve la CDN. Fuente: `https://vercel.com/docs/frameworks/backend/fastapi` y `https://vercel.com/docs/functions/runtimes/python` (verificado 23/11/2026).
4. La clave de OpenRouter va en **variables de entorno del proyecto en Vercel** (tipo **Secret**), se lee en el backend y **jamás** en el navegador; un cambio de variables **solo aplica a deployments nuevos → hay que redeployar**. Fuente: `https://vercel.com/docs/environment-variables` (verificado 23/11/2026).
5. «Me pide iniciar sesión al abrir la URL» casi siempre es **Deployment Protection / Vercel Authentication**, no un error del código. Fuente: `https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication` (verificado 23/11/2026). **PENDIENTE DE COMPROBAR** si en la cuenta concreta del profesor estaba activada la opción (no se tuvo acceso).
6. **Un Excel en la laptop no existe para Vercel.** Una Function tiene sistema de archivos de **solo lectura** (más `/tmp` efímero de hasta 500 MB, por instancia, que no persiste); un archivo local solo está disponible si se subió al repo y entró al bundle. Para datos vivos hace falta una base externa (p. ej. Supabase). Fuente: `https://vercel.com/docs/functions/runtimes` (verificado 23/11/2026).
7. **Plan Hobby = gratis, pero solo para uso personal o no comercial** según los Términos de Servicio (última actualización 19/10/2026) `https://vercel.com/legal/terms`; y esos términos indican que en Hobby/prueba Pro Vercel puede usar «Your Content» para entrenar modelos (revisar antes de subir datos sensibles). Verificado 23/11/2026.
8. Un enlace `*.vercel.app` que abre **no demuestra** que la IA, la base de datos ni los pedidos funcionen. Hay que probar el endpoint (`curl`), revisar *Runtime Logs* y confirmar la escritura en la base (ver sección 12).
9. En clase el proyecto de Vercel se creó, se conectó a GitHub y quedó **pendiente de validar** el backend de IA (sección 15). No declararlo terminado de punta a punta.
10. Vercel **no exige GitHub**: también se puede desplegar con CLI (`vercel`), con Vercel Drop (arrastrar carpeta) y con Deploy Hooks. Fuente: `https://vercel.com/docs/deployments` (verificado 23/11/2026). Esto matiza la frase de clase «no se puede desplegar sin GitHub» (sección 15).

---

## 1. Conceptos con definición para principiantes

| Concepto | Definición para el alumno | Fuente oficial (verificado 23/11/2026) |
|---|---|---|
| **Alojamiento web (hosting)** | Una computadora de otra empresa, siempre encendida, que entrega tu sitio a quien lo pida. | `https://vercel.com/docs/domains` (explica cómo el navegador llega al servidor) |
| **Frontend** | Lo que ve y toca el usuario en el navegador: HTML, CSS, JavaScript. En Vercel, los archivos estáticos se entregan desde la **CDN** (red de servidores repartidos). | `https://vercel.com/docs/frameworks/backend/fastapi` (sección «Serving frontend and static assets») |
| **Backend** | Código que corre en un servidor (aquí, Python/FastAPI) y puede guardar secretos, llamar a APIs y a bases de datos. | `https://vercel.com/docs/frameworks/backend` |
| **Serverless / Vercel Functions** | Tu código backend se ejecuta **bajo demanda** como una *Function*; no administras un servidor y escala con el tráfico. Hay **Fluid compute** activado por defecto en proyectos nuevos. | `https://vercel.com/docs/functions`, `https://vercel.com/docs/functions/limitations` |
| **Runtime** | El «motor» que ejecuta el código (Node.js, **Python**, etc.). Para Python soporta **ASGI y WSGI**; versiones disponibles **3.12 (predeterminada), 3.13 y 3.14**. | `https://vercel.com/docs/functions/runtimes/python` |
| **Build** | Paso previo al despliegue donde Vercel instala dependencias y, si aplica, compila/empaqueta. Hay *build logs*. Una landing estática sin framework **no requiere build**. | `https://vercel.com/docs/builds/configure-a-build`, `https://vercel.com/docs/deployments/logs` |
| **Deploy / Deployment** | Una versión publicada e inmutable de tu proyecto con su propia URL. | `https://vercel.com/docs/deployments` |
| **Preview vs Production** | *Preview*: prueba de un push a una rama que no es la de producción o de un pull request. *Production*: lo que sirve el dominio principal, creado al fusionar en la rama de producción (`main` por defecto). **El primer deployment de un proyecto nuevo siempre es de producción.** | `https://vercel.com/docs/deployments/environments`, `https://vercel.com/docs/git` |
| **DNS** | «Agenda telefónica» de Internet: traduce un dominio (`midominio.com`) a la dirección del servidor. Solo necesitas tocarlo si usas **dominio propio**. | `https://vercel.com/docs/domains` |
| **`*.vercel.app`** | Dominio gratuito que Vercel genera para **cada** deployment (URL por commit, por rama y de producción). Es **pública por defecto**, salvo que actives Deployment Protection. | `https://vercel.com/docs/deployments/generated-urls` |
| **Variable de entorno** | Pareja clave=valor guardada **fuera del código**; puede cambiar según entorno (Production/Preview/Development). Cifradas en reposo. | `https://vercel.com/docs/environment-variables` |
| **Dominio personalizado** | Tu propio dominio asignado al proyecto desde *Settings → Domains*. | `https://vercel.com/docs/domains/working-with-domains/add-a-domain` |

Estructura de URLs generadas (doc oficial): commit `<proyecto>-<hash>-<scope>.vercel.app`; rama `<proyecto>-git-<rama>-<scope>.vercel.app`; producción `<proyecto>-<scope>.vercel.app`. Fuente: `https://vercel.com/docs/deployments/generated-urls` (verificado 23/11/2026).

---

## 2. Pasos desde cero por la web (flujo recomendado, con GitHub)

> Pantallas con sesión iniciada **no se capturaron** (no hay cuenta). Para el PDF: usar **esquemas rotulados «Ilustración esquemática; la interfaz puede variar»** con los campos/botones de la documentación (listados abajo), y las capturas reales de páginas públicas ya guardadas.

### Paso 0. Qué debe tener el repositorio antes de importar
RECONSTRUCCIÓN PEDAGÓGICA basada en el kit probado:
```
mi-proyecto/
  app.py              # define app = FastAPI()  (entrypoint reconocido)
  requirements.txt    # fastapi, httpx
  public/index.html   # frontend estático (lo sirve la CDN)
  public/app.js       # solo llama a /api/chat (sin claves)
  soul.md             # prompt de sistema (convención del proyecto)
  .gitignore          # excluye .env*, .vercel/, venv/
  .env.example        # nombres de variables, SIN valores
```
Reglas: nada de claves en el repo; `.env.example` va vacío; `.env.local` no se sube. Si una clave llegó a GitHub, **revocarla** (borrar el repo no deshace la exposición).

### Paso 1. Crear cuenta
- Ir a `https://vercel.com/signup`. **Captura real:** `recursos_visuales/capturas/vercel_signup.png` (23/11/2026) muestra los botones *Continue with Google*, *Continue with GitHub*, *Continue with ChatGPT*, *Continue with Apple*, *Show other options* y *Continue with Email*.
- Para vincular GitHub, lo más directo es registrarse con **Continue with GitHub**. Si ya hay otra cuenta de GitHub abierta en el navegador y quieres usar otra, el doc indica **cerrar sesión de GitHub y reiniciar el signup**. Fuente: `https://vercel.com/docs/git/vercel-for-github` (verificado 23/11/2026).
- Plan: se usa el **Hobby** (gratis; solo uso personal/no comercial — sección 11).
- No compartir ni mostrar códigos 2FA ni contraseñas en pantalla de clase.

### Paso 2. Importar el repositorio (botón **New Project**)
Fuente: `https://vercel.com/docs/git` → «Deploying a Git repository» (verificado 23/11/2026).
1. En el dashboard, botón **New Project** (arriba a la derecha).
2. Aparece la lista de repositorios; el menú desplegable arriba a la izquierda cambia la **cuenta u organización de Git**.
3. Seleccionar el repositorio correcto.
4. **Si el repo no aparece:** Vercel solo ve los repos a los que el *Vercel GitHub App* tiene acceso. Pulsar **Adjust GitHub App Permissions** (o **Configure GitHub App**), en *Repository access* añadir el repo (o *All repositories*) y **Save**. Para repos de una organización, el app debe estar instalado en ella (un Owner puede tener que aprobar). Fuente: `https://vercel.com/docs/git/vercel-for-github` («Missing Git repository»).
5. **Límite Hobby:** un proyecto de un equipo Hobby **no se puede conectar a repositorios que pertenezcan a organizaciones de Git**; hay que usar un equipo existente o crear uno. Fuente: `https://vercel.com/docs/limits` → «Connecting a project to a Git repository».

### Paso 3. Pantalla «Configure Project»
Campos que la documentación lista (`https://vercel.com/docs/git`): **nombre del proyecto**, **Framework Preset**, **Root Directory**, **Build and Output Settings**, **Environment Variables**, y el botón **Deploy**.
- **Framework Preset:** Vercel detecta Python/FastAPI cuando encuentra la dependencia en `requirements.txt`, `pyproject.toml` o `Pipfile` (`https://vercel.com/docs/functions/runtimes/python`). Si no detecta ningún framework, queda **Other**; con *Other* el directorio de salida es `public` si existe, o la raíz del proyecto si no (`https://vercel.com/docs/builds/configure-a-build`) — útil para landing estática pura.
- **Root Directory:** necesario cuando el app no está en la raíz del repo (p. ej. carpeta `frontend/` o `backend/`). Se cambia luego en *Settings → Build and Deployment → Root Directory*; aplica en el siguiente deployment (`https://vercel.com/docs/builds/configure-a-build`). Error típico: dejar la raíz del repo cuando el código vive en una subcarpeta → build sin entrypoint (ver sección 9).
- **Environment Variables:** añadir aquí `OPENROUTER_API_KEY` como **Secret** (ver sección 6). Se puede importar un `.env` completo con *Import .env* o pegándolo en el campo *Key* (`https://vercel.com/docs/environment-variables`); **no importar archivos `.env` con claves reales desde repos compartidos o pantallas proyectadas**.

### Paso 4. Deploy y primera URL
- Pulsar **Deploy**. Vercel construye y publica; la URL `*.vercel.app` aparece en la vista del proyecto/despliegue. Fuente: `https://vercel.com/docs/deployments/generated-urls`.
- Como es el primer deployment, **será de producción aunque no lo marques** (`https://vercel.com/docs/deployments/environments`).

### Paso 5. Actualizaciones continuas
- `git push` a `main` → deployment de producción; push a otra rama o PR → *preview* con URL propia y comentario en el PR. Cada push se despliega por defecto. Fuente: `https://vercel.com/docs/git/vercel-for-github` («A Deployment for Each Push»).
- Cambiaste una variable de entorno → **redeploy** (ver 6). Opción en dashboard: proyecto → **Deployments** → **Create Deployment** (por rama o SHA) según `https://vercel.com/docs/git`; el doc de variables remite a «Redeploy a project» en `https://vercel.com/docs/deployments/managing-deployments`.

### Paso 6. Verificación (sección 12)

### Esquemas rotulados sugeridos para el PDF (RECONSTRUCCIÓN PEDAGÓGICA)
No son capturas; dibujarlos como esquemas originales con leyenda «Ilustración esquemática; la interfaz puede variar»:
1. *Add New → Project* con lista de repos y selector de cuenta Git.
2. *Configure Project*: Project Name · Framework Preset · Root Directory · Build and Output Settings · Environment Variables · **Deploy**.
3. *Settings → Environment Variables*: Key · Value · **Type (Config/Secret)** · Environments (Production/Preview/Development).
4. *Deployments*: lista con etiqueta Production/Preview y botón **Create Deployment**; menú por despliegue con *Redeploy*.
5. *Logs* (barra lateral del proyecto): filtros y fila con HTTP status/función; *Build Logs* desde el tile del deployment.
6. *Settings → Deployment Protection*: opciones Standard Protection / All Deployments, y método Vercel Authentication.

---

## 3. Camino opcional por línea de comandos (CLI)

Fuentes: `https://vercel.com/docs/cli`, `https://vercel.com/docs/cli/deploy`, `https://vercel.com/docs/cli/env` (verificado 23/11/2026). Probado: ver `evidencias_qa/vercel_pruebas.md`.

| Paso | Comando | Estado |
|---|---|---|
| Instalar | `npm i -g vercel` (doc oficial; también pnpm/yarn/bun) | Instalado en local como paquete (v**66.6.0**); `vercel --version` → `66.6.0` **verificado en prueba** |
| Ver versión | `vercel --version` | **verificado en prueba** |
| Iniciar sesión | `vercel login` (interactivo) | **no probado** (requiere cuenta) |
| Crear cuenta desde CLI | `vercel signup` (doc) | **no probado** |
| Vincular carpeta con un proyecto | `vercel link` | **no probado** |
| Variables | `vercel env add <NOMBRE>` (ej. de la ayuda: `vercel env add API_URL --environment production,preview,development`); `vercel env list`; `vercel env pull [archivo]` (por defecto `.env.local`); `vercel env run -- <comando>` | `--help` **verificado**; ejecución **no probada**. El doc indica que los valores **Secret** no se pueden leer: `env pull` deja un marcador para completar solo en local |
| Tipo de variable | `--type config` o `--type secret` (equivalen a `--no-sensitive` / `--sensitive`); `--visibility` está **obsoleto** | Doc `https://vercel.com/docs/environment-variables` |
| Desarrollo local FastAPI | `python -m venv .venv` → activar → `pip install -r requirements.txt` → `vercel dev` (CLI mínimo **48.1.8** para FastAPI) | Doc FastAPI; **no probado** (se usó `uvicorn` en su lugar) |
| Despliegue preview | `vercel` (equivale a `vercel deploy`) | **no probado** |
| Despliegue producción | `vercel --prod` | **no probado** |
| Simular sin subir | `vercel deploy --dry` (según ayuda) | **probado sin login → error**: exige credenciales |
| Compilar local | `vercel build` (con `vercel pull` previo); `vercel build --help` | `--help` **verificado**; sin login responde `project_settings_required` |
| Logs | `vercel logs --environment production --query 'level:error' --since 1h` (devuelve un conjunto acotado; no hace streaming) | Doc `https://vercel.com/docs/runtime-logs` |
| Sin cuenta | `vercel deploy --temporary` | **NO ejecutado a propósito**: crea un despliegue público de producción real |

**Aviso sobre `vercel deploy --temporary`** (doc `https://vercel.com/docs/deployments/deploy-without-logging-in`, verificado 23/11/2026): despliega sin login a producción, imprime una URL y un **claim URL**; el despliegue **expira** si no se reclama; el enlace de reclamación **no debe compartirse** (quien lo tenga puede reclamar el proyecto); no funciona en CI ni en carpetas ya vinculadas. Útil para demostrar, pero **no** para proyectos con datos o claves.

Variables de CLI en automatización (CI): `VERCEL_TOKEN` (recomendado frente a `--token`). Fuente: `https://vercel.com/docs/cli`. Un token es secreto: nunca en chats, prompts ni repos.

---

## 4. Caso A — Landing estática (sin backend)

**Cuándo:** solo HTML/CSS/JS, sin claves ni base de datos (por ejemplo la landing Puerto A&M sin chatbot).

- Sin framework detectado, preset **Other**: directorio de salida = `public/` si existe; si no, la raíz del repo (`https://vercel.com/docs/builds/configure-a-build`). Alternativa: activar *Override* en *Output Directory* y dejarlo vacío para omitir el build.
- **Despliegues estáticos rápidos** por CLI: Vercel detecta proyectos elegibles y los deja listos **sin paso de build** (hasta 100 archivos y 25 MB; HTML, CSS, JSON, imágenes, fuentes, PDF, etc.; si el despliegue incluye JavaScript u otros archivos no listados, o lo dispara Git, usa el flujo estándar). `https://vercel.com/docs/cli/deploy` («Fast static deployments»).
- **Sin Git ni CLI:** **Vercel Drop** — arrastrar archivo, carpeta o `.zip` al navegador; sin cuenta solo sitios estáticos y el despliegue es temporal hasta reclamarlo (`https://vercel.com/docs/drop`, `https://vercel.com/docs/deployments/deploy-without-logging-in`).
- Cuidado: archivos estáticos **no son secretos**. Cualquier cosa en `public/` es descargable por cualquiera.
- Frente a GitHub Pages: ambas publican estáticos; Vercel añade previews por rama, Functions y dominios; Pages es un servicio de hosting estático desde un repo (`https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages`, verificado 23/11/2026).

---

## 5. Caso B y Caso C — Backend `POST /api/chat` y proyecto mixto FastAPI + frontend

### Qué soporta la documentación actual (y qué NO asumir)
- **FastAPI es un preset de framework** con entrypoint `app`; Vercel busca `FastAPI` llamada `app` en `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py`, `asgi.py` o las mismas dentro de `src/`/`app/`. Para otro módulo: `[tool.vercel] entrypoint = "backend.server:app"` en `pyproject.toml`. Fuente: `https://vercel.com/docs/frameworks/backend/fastapi` (verificado 23/11/2026).
- **Todo el app FastAPI se convierte en UNA sola Vercel Function** (con Fluid compute). Para configurarla (p. ej. `maxDuration`) se usa `vercel.json` → `functions` con **la clave igual al archivo entrypoint** (`"app/main.py": {"maxDuration": 60}` en el ejemplo oficial). **No es obligatorio** `vercel.json`.
- **Estructura antigua `/api/*.py`:** sigue soportada «para proyectos existentes» (cada `.py` en `/api` es una Function; handlers `app`, `application` o clase `handler(BaseHTTPRequestHandler)`), pero **para aplicaciones Python nuevas el doc indica usar un preset de framework**; y si Vercel detecta un preset, **los archivos bajo `/api` ya no se convierten en Functions separadas**. Fuente: `https://vercel.com/docs/functions/runtimes/python/api-directory`. → No mezclar carpeta `/api/*.py` con FastAPI.
- **Dependencias:** `requirements.txt`, `pyproject.toml` (con o sin `uv.lock`) o `Pipfile` + `Pipfile.lock`. Python por defecto 3.12; configurable con `pyproject.toml`, `.python-version` o `Pipfile.lock` (`https://vercel.com/docs/functions/runtimes/python/python-version`).
- **Frontend en el mismo proyecto — tres vías documentadas:**
  1. Carpeta **`public/`** en la raíz: la CDN la sirve en `/` (p. ej. `public/logo.svg` → `/logo.svg`). **No** montar `public/` con `app.mount()` (lo gestiona la plataforma). *Es la vía usada en el kit.*
  2. `app.frontend("/", directory="dist")` o `app.mount("/assets", StaticFiles(...))`: los archivos se promueven a la CDN en el build. Con `app.frontend()` toda ruta de API tiene prioridad sobre los archivos del frontend.
  3. **Vercel Services** (**Beta**, todos los planes): varios servicios en un proyecto (p. ej. Next.js + FastAPI) con `vercel.json` → `services` y `rewrites` (`https://vercel.com/docs/services`). Más complejo; **no recomendado para el primer despliegue de principiantes**.
- **Streaming**: `StreamingResponse` soportado; WebSockets siguen los límites de duración (`https://vercel.com/docs/frameworks/backend/fastapi`). El kit usa respuesta simple (no streaming).

### Caso B — «Solo la API» (`POST /api/chat`)
Un proyecto FastAPI que expone `/api/chat` y `/api/health`; el frontend puede vivir **en otro lugar** (p. ej. GitHub Pages) → **entonces sí hace falta CORS** con lista restringida de orígenes y el frontend usa la URL absoluta del backend. Riesgo: sin límites de uso cualquier visitante puede gastar tu cuota de IA → **PENDIENTE DE COMPROBAR / DISEÑAR** rate limiting y autenticación (el kit solo limita longitud y tamaño de historial; no hay rate limit).

### Caso C — Proyecto mixto (recomendado para la clase): FastAPI + `public/` en un solo proyecto
Frontend y API en el **mismo dominio** → el navegador llama a **`/api/chat` relativo**, sin CORS y sin exponer URL de otro origen. Es lo implementado y probado en `fuentes_editables/kit_referencia/vercel_landing/`:

| Archivo | Función |
|---|---|
| `app.py` | `app = FastAPI(...)`; `POST /api/chat`; `GET /api/health`; CORS por lista (`ALLOWED_ORIGINS`); validación Pydantic (mensaje 1–500 caracteres, historial ≤ 6 turnos con roles solo `user`/`assistant`); lee `OPENROUTER_API_KEY` del entorno; errores controlados (503 sin clave, 502/504/429 del proveedor, 422 entrada inválida); registra solo códigos de estado |
| `public/` | `index.html`, `style.css`, `app.js` (sin claves) |
| `soul.md` | Prompt de sistema inyectado por el backend (**convención del proyecto**, no estándar de Vercel/OpenRouter) |
| `requirements.txt` | `fastapi`, `httpx` |
| `.env.example` | Nombres de variables vacíos |
| `.gitignore` | `.env*`, `.vercel/`, `venv/` |

Detalle de diseño: en Vercel se define `VERCEL=1` (variable de sistema, `https://vercel.com/docs/environment-variables/system-environment-variables`) y el kit **solo monta `StaticFiles` cuando `VERCEL` no está definido** (para que `uvicorn` local sirva la landing), respetando la regla de no montar `public/` en Vercel.

Resultado de pruebas locales (detalle en `evidencias_qa/vercel_pruebas.md`): landing 200; `/api/health` 200; `POST /api/chat` sin clave → **503** claro; entradas inválidas → **422**; preflight CORS permitido/denegado; clave falsa contra OpenRouter real → 401 del proveedor traducido a **502** sin filtrar la clave; camino feliz y errores 429/402/500/JSON raro contra un **mock** local. **No probado en Vercel** (sección 16).

**Cómo se hace la prueba real tras desplegar** (guion para el PDF, RECONSTRUCCIÓN PEDAGÓGICA):
```
curl -i https://TU-PROYECTO.vercel.app/                       # 200 y HTML
curl -s https://TU-PROYECTO.vercel.app/api/health             # {"ok":true,"chat_configured":true}
curl -s -X POST https://TU-PROYECTO.vercel.app/api/chat \
  -H "Content-Type: application/json" -d '{"message":"Hola"}'  # {"ok":true,"reply":"..."}
```
Si `chat_configured` es `false`: falta la variable en ese **entorno** (Production/Preview) o falta **redeploy**.

---

## 6. Variables de entorno y secretos

Fuentes: `https://vercel.com/docs/environment-variables`, `https://vercel.com/docs/environment-variables/sensitive-environment-variables` (verificado 23/11/2026).

- **Config vs Secret:** al agregar una variable se elige **Config** (legible después de guardar por miembros con acceso) o **Secret** (**solo escritura** tras guardar; para contraseñas, API keys y tokens). Las antiguas «Sensitive» se tratan como Secret. **La clave de OpenRouter debe ser Secret.** Los Secret se permiten también en Development.
- **Entornos:** *Production* (próximo deployment de producción), *Preview* (ramas distintas de la de producción), *Development* (solo `vercel dev`/`vercel env pull`) y *Custom* (Pro/Enterprise). Se elige a qué entornos aplica cada variable. Para Preview se puede limitar a una rama.
- **Redeploy obligatorio:** «los cambios no se aplican a deployments previos, solo a nuevos». Síntoma: «cambié la variable y sigue fallando» → *Redeploy*. Fuente: tabla de *Troubleshooting* del mismo doc.
- **Tamaño:** hasta 64 KB en total por deployment (Node.js, Python, Ruby, Go).
- **Nombres:** para este kit: `OPENROUTER_API_KEY` (obligatoria), `OPENROUTER_MODEL` (opcional, default `openrouter/free`; los IDs de modelos de OpenRouter **cambian**: ese ID aparecía en `https://openrouter.ai/api/v1/models` el 23/11/2026 — confirmar antes de enseñar), `ALLOWED_ORIGINS` (opcional).
- **NUNCA usar prefijos que expongan al navegador para secretos.** Los frameworks exigen prefijos (`NEXT_PUBLIC_` en Next.js, `PUBLIC_` en Astro) **para hacer disponibles las variables en el cliente**; Next.js las **incrusta en el bundle del navegador en el build** (`https://vercel.com/docs/environment-variables`, tabla de problemas; `https://vercel.com/docs/environment-variables/framework-environment-variables`). Por eso `NEXT_PUBLIC_…`/`PUBLIC_…` son **públicas por diseño**. `VITE_` es la convención equivalente de Vite: **PENDIENTE DE COMPROBAR** en la documentación de Vite (no fue accesible desde este entorno); la regla pedagógica es la misma: *si el nombre lleva prefijo de cliente, no es secreto*. Una clave de OpenRouter jamás va en `app.js`, `index.html`, `config.js` ni en variables con prefijo de cliente.
- **Redacción en logs de build:** valores Secret de 32+ caracteres que aparezcan en el build log se reemplazan por `[REDACTED]`; **no** hay garantía equivalente para runtime logs → no imprimir claves ni cuerpos de mensajes completos (el kit registra solo códigos de estado y longitudes).
- **Rotación:** doc `https://vercel.com/docs/environment-variables/rotating-secrets` (existe; no se resumió aquí). Ante exposición: **revocar en OpenRouter**, crear nueva, actualizar variable y redeployar.
- **Local:** `.env.local` (ignorado por git) o `vercel env pull` (los Secret no se pueden leer; hay que poner valores locales a mano).
- **Supabase:** la clave *publishable* puede ir al navegador (solo alcanza lo que permita RLS); la *secret* solo en backend (`https://supabase.com/docs/guides/getting-started/api-keys`, verificado 23/11/2026; ver investigación de Supabase del compañero). Nunca poner la secret/`service_role` en `public/`.

---

## 7. CORS, rutas y rewrites

- **Mejor opción para la clase:** mismo dominio (Caso C) → fetch relativo `fetch('/api/chat')`; no hay CORS.
- **Si el frontend está en otro origen** (p. ej. GitHub Pages → backend en Vercel): configurar CORS con **lista explícita de orígenes** (no `*` con datos privados). Vercel documenta cabeceras `Access-Control-Allow-Origin/-Methods/-Headers/-Credentials/-Max-Age`, y que el navegador envía **preflight `OPTIONS`** para métodos distintos de GET/HEAD/POST o con cabeceras personalizadas (un `POST` con `Content-Type: application/json` provoca preflight). Opciones en Vercel: cabeceras en `vercel.json`, Routing Middleware o código del propio framework (en el kit: `CORSMiddleware` de FastAPI). Fuente: `https://vercel.com/kb/guide/how-to-enable-cors` (verificado 23/11/2026).
- **Trampa clásica:** con **Deployment Protection** activa, el preflight sin autenticar recibe **401** antes de llegar al código; el navegador nunca ve tus cabeceras CORS. Solución documentada: **OPTIONS Allowlist** (para proyectos nuevos `/api/*` ya viene en la lista por defecto, según la guía) o desactivar la protección para ese entorno. Fuente: misma guía y `https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/options-allowlist`.
- **Rewrites** (`vercel.json` → `rewrites`): reenvían rutas a otra ruta o a un origen externo (un *rewrite proxy* hace que el navegador vea mismo origen y evita CORS). Fuente: `https://vercel.com/docs/project-configuration` y la guía CORS. No necesarios en el kit.
- Límite relacionado: `proxied request timeout` = **120 s** y 2048 rutas por deployment (Hobby) — `https://vercel.com/docs/limits`.

---

## 8. Deployment Protection y «me pide iniciar sesión»

Fuentes: `https://vercel.com/docs/deployment-protection` y `.../methods-to-protect-deployments/vercel-authentication` (verificado 23/11/2026). **Captura real:** `recursos_visuales/capturas/vercel_docs_deployment_protection.png`.

- **Qué es:** controla quién puede abrir las URL de *preview* y *producción*. Se configura **por proyecto** (Settings → **Deployment Protection**), eligiendo **método** (cómo) y **alcance** (qué URLs).
- **Vercel Authentication:** solo usuarios de Vercel con acceso (miembros del equipo/proyecto, personas a las que se concedió acceso, quien tenga un **Shareable Link**, o herramientas con *Protection Bypass for Automation*). Si no estás autorizado, **redirige a un login de Vercel** y ofrece **solicitar acceso**. Disponible en **todos los planes**. En Hobby **solo se permite un usuario externo** por cuenta.
- **Alcance:** *Standard Protection* (todos los planes; protege todos los dominios **excepto los de producción**), *All Deployments* (todos los planes; protege **también** el dominio de producción y las URL `*.vercel.app` generadas) y *Only Production* (solo Enterprise, con Trusted IPs). Existen opciones *Legacy*. Password Protection **no está disponible en Hobby** (en Pro: US$20/mes por proyecto protegido, según la tabla del doc).
- **Cuándo aparece el login en clase:** (a) la URL abierta es una *preview* o una URL generada y la protección está en Standard/All; (b) el proyecto/equipo tiene *All Deployments*; (c) el alumno abre el link sin sesión de Vercel. **PENDIENTE DE COMPROBAR** cuál fue el caso real: la documentación no indica el valor por defecto de un proyecto nuevo (puede venir de un *default de equipo*, `https://vercel.com/docs/deployment-protection#how-team-default-settings-apply-to-new-projects`).
- **Cómo comprobar/arreglar** (para público abierto): *Settings → Deployment Protection* → elegir protección **Standard** (producción pública) o desactivar Vercel Authentication, **guardar y reabrir en ventana privada**. Si es una demo con costo (IA), considerar proteger y dar **Shareable Link**.
- **Efectos colaterales** (documentados): con Standard Protection, la URL de producción *generada* queda restringida; si el código usaba `VERCEL_URL`/`VERCEL_BRANCH_URL` para llamarse a sí mismo, debe usar rutas relativas o el dominio solicitado. Los clientes automáticos (`curl`, Playwright) necesitan *Protection Bypass for Automation*.
- Un 401 *no* proviene de tu FastAPI: viene de Vercel antes de tu código. En el kit, tus errores siempre devuelven JSON `{"ok":false,"error":...}`; un HTML de login indica protección.

---

## 9. Diagnóstico de errores (tarjetas «síntoma → causa probable → prueba → reparación»)

Fuentes de la columna «Doc»: páginas de error de Vercel `https://vercel.com/docs/errors/<CÓDIGO>` y las indicadas (verificado 23/11/2026).

| # | Síntoma | Causa probable | Prueba | Reparación | Doc |
|---|---|---|---|---|---|
| 1 | **404 `NOT_FOUND`** al abrir una ruta | URL mal escrita, recurso inexistente, `public/` mal ubicado, Root Directory incorrecto | Abrir `/` y `/api/health`; revisar el árbol del repo y *Root Directory* | Corregir ruta/estructura; mover `index.html` a `public/`; ajustar Root Directory y redeployar | `/docs/errors/NOT_FOUND` |
| 2 | **404 `DEPLOYMENT_NOT_FOUND`** | Deployment inexistente o borrado; URL antigua | Abrir la URL desde el panel | Usar la URL actual del proyecto/producción | `/docs/errors/DEPLOYMENT_NOT_FOUND` |
| 3 | **401** o pantalla de login de Vercel | **Deployment Protection / Vercel Authentication**; en preflight CORS: sección 7 | `curl -i URL` → ¿HTML de login? ¿ventana privada? | Ajustar alcance/método, Shareable Link, OPTIONS Allowlist | sección 8 |
| 4 | **403 `DEPLOYMENT_BLOCKED`** | Cuenta/plan (p. ej. bajó a Hobby), cuota excedida, política o configuración | Correo de Vercel; estado de cuenta; status page | Revisar cuenta/límites y redeployar | `/docs/errors/DEPLOYMENT_BLOCKED` |
| 5 | **500 `FUNCTION_INVOCATION_FAILED`** | Runtime Python **cayó** o excepción no capturada (p. ej. falta dependencia, import inválido, variable ausente usada en el arranque) | **Logs** del proyecto (Runtime Logs); `GET /api/health` | `try/except`, añadir dependencia a `requirements.txt`, revisar variables, redeploy | `/docs/errors/FUNCTION_INVOCATION_FAILED` |
| 6 | **504 `FUNCTION_INVOCATION_TIMEOUT`** | La función tarda más que la duración máxima o no responde | Runtime Logs; tiempos del proveedor de IA | Timeout hacia el proveedor (el kit usa 25 s), manejar errores, subir `maxDuration` en `vercel.json` → `functions` (Hobby: **300 s tope**) | `/docs/errors/FUNCTION_INVOCATION_TIMEOUT`, `/docs/functions/limitations` |
| 7 | **413 `FUNCTION_PAYLOAD_TOO_LARGE`** | Cuerpo de petición > **4.5 MB** (por defecto) | Tamaño del request | Reducir/recortar; el kit limita a 500 caracteres | `/docs/functions/limitations` |
| 8 | **Build falla** | Dependencias, versión de Python, sin entrypoint reconocido, función > límite (250 MB; **500 MB** Python), build > 45 min | **Build Logs** del deployment; `vercel build` local tras `vercel pull` | Corregir el error indicado; `requirements.txt` mínimo; `excludeFiles` | `/docs/deployments/logs`, `/docs/deployments/troubleshoot-a-build`, `/docs/functions/limitations` |
| 9 | **«Cambié la variable y no cambió nada»** | Cambios solo aplican a deployments nuevos | `GET /api/health` → `chat_configured` | **Redeploy** | `/docs/environment-variables` (Troubleshooting) |
| 10 | **Funciona en Production pero no en Preview (o al revés)** | Variable no asignada a ese entorno | Settings → Environment Variables → columna de entornos | Marcar el entorno correcto; redeploy | `/docs/environment-variables` |
| 11 | **El repo no aparece al importar** | El Vercel GitHub App no tiene acceso a ese repo / cuenta equivocada | Selector de cuenta; GitHub → Settings → Applications | *Adjust GitHub App Permissions*; si es de organización, instalar el app ahí | `/docs/git/vercel-for-github` («Missing Git repository») |
| 12 | **Repo de organización no conecta (Hobby)** | Hobby no admite repos de organizaciones de Git | — | Usar repo personal o crear/usar un equipo | `/docs/limits` |
| 13 | **Sitio abre pero el chat falla** | Falta clave / modelo inexistente / proveedor 401-402-429 / CORS | `curl` a `/api/chat`; `error` del JSON (`chat_not_configured`, `upstream_auth`, `rate_limited`…) | Ver tabla de errores del kit; corregir variable/modelo; esperar o cambiar modelo | `evidencias_qa/vercel_pruebas.md` |
| 14 | **Guardó el pedido pero no aparece / «se perdió»** | Escritura en disco de la Function (efímera) o sin base externa | Revisar si el código usa archivos locales | Guardar en Supabase u otra base | sección 10 |
| 15 | **Logs vacíos o «ya no están»** | Runtime logs en Hobby solo **1 hora** | — | Reproducir la petición y mirar enseguida | `/docs/plans/hobby`, `/docs/limits` |

**Dónde ver logs:** *Build Logs* desde el tile del deployment (`https://vercel.com/docs/deployments/logs`, se almacenan indefinidamente, truncados a 4 MB); *Runtime Logs* en la sección **Logs** de la barra lateral del proyecto (límite por petición: 256 líneas, 256 KB por línea, 1 MB en total) o `vercel logs` (`https://vercel.com/docs/runtime-logs`). Para funciones, `https://my-deployment-xxx.vercel.app/_logs` según el doc de timeout. Los logs **no deben contener secretos**.

---

## 10. Por qué Vercel no lee el Excel de la laptop ni escribe de forma duradera en disco

Fuente principal: `https://vercel.com/docs/functions/runtimes` («File system support») (verificado 23/11/2026).

- Una Vercel Function corre en la nube de Vercel, **no** en la laptop del profesor. No existe ruta `C:\Users\...\datos.xlsx` para ella. Solo ve lo que se **incluyó en el bundle** al desplegar (copia de solo lectura de archivos del repo trazados en el build) — «build file paths from the project root». Cada cambio al Excel local exige **re-exportar, commit, push y redeploy**; no hay lectura «en vivo».
- El sistema de archivos es **solo lectura**, con `/tmp` escribible **hasta 500 MB**, pero ese espacio es **de una sola instancia**: otras instancias no lo ven y **no persiste cuando la instancia se detiene**. Por eso el doc advierte que **una base basada en archivos (p. ej. SQLite) no puede persistir datos** en una Function y recomienda una base de datos alojada (Marketplace/almacenamiento de Vercel u otra).
- Consecuencia para el proyecto: guardar pedidos/reservas/mensajes en `.xlsx`, `.csv`, `.json` dentro de la Function **se pierde** o diverge entre instancias.
- **Opciones válidas** (RECONSTRUCCIÓN PEDAGÓGICA): (1) **Instantánea de solo lectura**: exportar el Excel a CSV/JSON, commitearlo y leerlo desde el backend (datos de catálogo que cambian poco); (2) **Sincronización**: script/n8n que sube filas del Excel a **Supabase** (tabla `menu`, etc.) y el backend consulta Supabase; (3) Migrar el origen de verdad a Supabase. Cualquier sincronización hay que **diseñarla y probarla**; no «aparece sola».
- **Cuándo usar Supabase:** cuando necesitas **memoria por sesión/usuario**, pedidos, reservas, datos que cambian en runtime, varias personas usando la app, o cualquier cosa que deba **sobrevivir** a reinicios y redeploys. Seguridad: RLS activado; clave *secret* solo en backend; no desactivar RLS para «arreglar». Fuentes: `https://supabase.com/docs/guides/getting-started/api-keys` (verificado 23/11/2026) y la guía de Supabase del equipo.
- Un chatbot **no debe decir «confirmado»** sin escritura real validada en la base (regla del proyecto; en la demo, «solicitud DEMO»).

---

## 11. Plan Hobby, límites y dominio propio

Fuentes: `https://vercel.com/docs/plans/hobby`, `https://vercel.com/docs/limits`, `https://vercel.com/docs/functions/limitations`, `https://vercel.com/docs/limits/fair-use-guidelines`, `https://vercel.com/legal/terms` (todas verificadas 23/11/2026; términos con «Last Updated October 19, 2026»). Precios en USD sin impuestos.

**Condición de uso (importante para negocios reales):** «You shall only use the Services under a Hobby plan for your personal or non-commercial use». Vercel puede deshabilitar/eliminar proyectos Hobby con o sin aviso. → Para el restaurante **ficticio** de clase es adecuado; para un negocio real **cobrando** se debe revisar plan **Pro** o los Términos. (Interpretación legal: **PENDIENTE DE COMPROBAR** por el profesor/Top Learning; este documento solo cita el texto.)
**Privacidad:** los mismos Términos dicen que en Hobby o prueba de Pro «we may use Your Content to train our AI and machine learning models» y compartirlo con terceros para ese fin; en Pro de pago está desactivado por defecto y se puede *opt-in/opt-out*. → No subir datos reales de clientes ni información confidencial a proyectos Hobby. (Alcance exacto de «Your Content»: **PENDIENTE DE COMPROBAR** leyendo la definición completa en los Términos.)

| Recurso (Hobby) | Cifra documentada | Fuente |
|---|---|---|
| Precio | Gratis; sin ciclo de facturación; si excedes un límite, normalmente esperar **30 días** | `/docs/plans/hobby` |
| Proyectos | 200 | `/docs/limits` |
| Despliegues por día | **100** (también 100 builds por hora) | `/docs/limits` |
| Dominios personalizados por proyecto | 50 | `/docs/domains/working-with-domains/add-a-domain` |
| Duración máxima de Function | **300 s** (predeterminada y máxima) | `/docs/functions/limitations` |
| Memoria de Function | 2 GB / 1 vCPU (máx.) | `/docs/functions/limitations` |
| Invocaciones de Function | primeras **1 000 000**/mes | `/docs/plans/hobby` |
| Active CPU / memoria aprovisionada | 4 CPU-h / 360 GB-h al mes | `/docs/plans/hobby` |
| Fast Data Transfer | primeros 100 GB/mes | `/docs/plans/hobby` |
| Fast Origin Transfer | primeros 10 GB/mes | `/docs/plans/hobby` |
| CDN Requests | primeros 1 000 000/mes | `/docs/plans/hobby` |
| Cuerpo de petición a Function | **4.5 MB** por defecto | `/docs/functions/limitations` |
| Tamaño de bundle de Function | 250 MB; **500 MB para Python** | `/docs/functions/limitations` |
| Tiempo de build | 45 min | `/docs/limits` |
| Runtime Logs | **1 hora** | `/docs/plans/hobby` |
| Deployment Protection | Vercel Authentication, Exceptions y Shareable Links; **sin** Password Protection | `/docs/plans/hobby` |
| Cron Jobs | hasta 100 (con restricciones) | `/docs/limits` |
| Conexión a repos de organizaciones Git | **No soportada** en Hobby | `/docs/limits` |
| Usuarios externos con acceso a deployments protegidos | 1 por cuenta | `/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication` |

Pro (solo para referencia, no se recomienda comprar): puestos de desarrollador **US$20 por usuario/mes** (`/docs/plans/hobby`, sección *Upgrading to Pro*); la página de Deployment Protection muestra una prueba Pro de 14 días con US$20 en créditos (captura `vercel_docs_deployment_protection.png`; condiciones exactas **PENDIENTE DE COMPROBAR**).
**Uso justo:** hay guías de «fair use»; la página dice que usará criterios para identificar uso atípico y avisará (`/docs/limits/fair-use-guidelines`). Detalles de ejemplos de «fair use/never fair use» **no se pudieron leer** en la versión Markdown (listas vacías) → **PENDIENTE DE COMPROBAR**.

**Dominio propio:** *Settings → Domains → Add Existing*; para apex (`example.com`) Vercel sugiere añadir también `www`; por CLI `vercel domains add example.com [proyecto]`; después hay que configurar **registros DNS** (A/CNAME/NS según el caso) en el proveedor del dominio. Se puede **comprar el dominio** con Vercel (`https://vercel.com/domains`; **precios no verificados**). Fuentes: `https://vercel.com/docs/domains/working-with-domains/add-a-domain` y `https://vercel.com/docs/domains` (verificado 23/11/2026). Un dominio propio da una URL «profesional» (respuesta a la duda del chat); `*.vercel.app` es gratis.

---

## 12. «Pantalla publicada» vs «aplicación operativa» — lista de comprobaciones reales

RECONSTRUCCIÓN PEDAGÓGICA (cada punto con evidencia):
1. **HTTP:** `curl -I https://…/` → 200 (evidencia: salida del comando; si hay HTML de login → protección).
2. **Frontend carga** en ventana privada, sin sesión de Vercel.
3. **Salud del backend:** `GET /api/health` → `chat_configured: true` (confirma la variable en ese entorno sin revelarla).
4. **API con clave privada responde:** `POST /api/chat` → `{"ok":true,"reply":…}` (no la página en HTML).
5. **Errores controlados:** sin clave → 503; entrada inválida → 422.
6. **Runtime Logs** del proyecto: solicitud visible, sin claves ni datos personales.
7. **Persistencia:** (solo si hay Supabase operativo) refrescar la página no borra el contexto; verificar la **fila** en la tabla (no basta la frase del chatbot).
8. **Pedidos/reservas:** registro real en base; en demo, estado «solicitud DEMO».
9. **Respuesta generativa ≠ transacción guardada.**
10. Registrar fecha, URL (si es pública), commit y entorno de cada prueba.

---

## 13. Tabla comparativa: GitHub · GitHub Pages · Vercel · Supabase

| Pregunta | GitHub (repositorio) | GitHub Pages | Vercel | Supabase |
|---|---|---|---|---|
| ¿Qué es? | Guarda código y versiones | Hosting de **sitios estáticos** desde un repo (`docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages`) | Plataforma de despliegue: frontend + Functions + CDN + previews | Base de datos Postgres, Auth, Storage, API (ver guía Supabase) |
| ¿Ejecuta Python/FastAPI? | No | **No** (solo archivos estáticos) | **Sí** (Python runtime, FastAPI como Function) | Edge Functions (Deno/TypeScript), no FastAPI |
| ¿Guarda secretos de forma segura para que los use un backend? | Secretos de Actions, no para servir la web | **No** (todo es público en el navegador) | **Sí**, variables de entorno tipo Secret | Claves y secretos de proyecto; la secret solo en backend |
| ¿Guarda datos que cambian (pedidos, memoria)? | No | No | **No** de forma duradera en disco (solo lectura + `/tmp` efímero); usar base externa | **Sí** |
| ¿Despliegue automático por push? | — | Sí (desde rama/Action) | Sí, con *preview* por rama/PR | — |
| URL gratuita | `github.com/usuario/repo` (código) | `*.github.io` | `*.vercel.app` | URL del proyecto API |
| ¿Sirve para la demo del chatbot? | Código y control de versiones | Solo la **landing estática sin IA** | **Sí** (landing + `/api/chat`) | **Sí** para memoria/pedidos/reservas |
| Riesgo principal | Exponer claves o datos en repos | Publicar contenido con claves | Variables mal configuradas / protección activa / límites Hobby | RLS mal configurado; exponer secret key |

Detalle de GitHub Pages (límites, repos públicos/privados) está en la investigación de GitHub (otro agente); aquí solo se cita lo verificado.

---

## 14. Rutas de decisión sugeridas para el PDF

- **¿Solo quiero mostrar una página bonita?** → Caso A (Pages o Vercel).
- **¿Quiero un chatbot con IA y mi clave protegida?** → Caso C (Vercel, FastAPI + `public/`).
- **¿Quiero que recuerde conversaciones, pedidos o reservas?** → Añadir Supabase (+ escritura validada).
- **¿Mi Excel cambia a diario en mi laptop?** → Exportar/sincronizar a una base; Vercel no lo lee.
- **¿Es un negocio real cobrando?** → Revisar plan/Términos de Vercel (Hobby = no comercial) y privacidad.

Orden recomendado para la biblioteca (acorde al megaprompt): guía de clase → OpenRouter → GitHub → **Vercel** → Supabase.

---

## 15. Aclaraciones respecto a la clase (contraste con el transcript)

Todas con etiqueta **ACLARACIÓN TÉCNICA POSTERIOR** salvo indicación; marcas de tiempo según `transcript.txt`/`chat.txt` (aprox.).

| # | EN CLASE (aprox.) | Aclaración con base en documentación vigente |
|---|---|---|
| 1 | ~02:25–02:30: el profesor explica que GitHub «no puede ejecutar Python», «no puede guardar la clave de OpenRouter» y que hace falta «dónde desplegar el backend», por eso Vercel; Supabase para memoria. | **Correcto en lo esencial.** GitHub Pages es hosting estático (`docs.github.com/…/what-is-github-pages`); Vercel ejecuta Python/FastAPI como Function (`vercel.com/docs/frameworks/backend/fastapi`); la memoria durable requiere base externa (`vercel.com/docs/functions/runtimes`). |
| 2 | ~02:15–02:20: «no se puede desplegar sin GitHub» (y «nunca van a poder desplegar con ChatGPT o Claude» salvo dominios con costo). | **Matiz.** En **Vercel** el despliegue **no exige GitHub**: también CLI (`vercel`), Vercel Drop y Deploy Hooks (`vercel.com/docs/deployments`). Lo que sí es cierto: ChatGPT/Claude como *chat* no alojan tu app; necesitas una plataforma de despliegue. La parte «con costo por dominios» **no se verificó** (PENDIENTE DE COMPROBAR). |
| 3 | ~02:40–02:45: «el proyecto de Vercel ya existe y está conectado a GitHub, pero todavía no se puede usar el sitio». | Consistente con un proyecto creado y un **primer deployment en curso/fallido o protegido**. Un proyecto conectado **no** implica sitio operativo; pasos 8–9 de la sección 12 (build logs, protección, variables). |
| 4 | ~02:50–02:55: el profesor pega la API key en Claude Code «porque a veces la API no viaja en datos» y pide «pon la API funcionando». | **ACLARACIÓN:** la clave debe vivir **solo** en variables de entorno del backend (Vercel, tipo Secret) o `.env.local`; **no pegarla en chats/prompts**. Si se pegó en un chat, **rotarla** (`vercel.com/docs/environment-variables/rotating-secrets`). Con Vercel hay que **redeployar** tras configurarla. |
| 5 | ~02:53: «el Vercel app todavía no me dejó abrirlo… el último link todavía no sirve». ~02:55–03:00: «Okay, les va a pedir iniciar sesión». | **Dos causas distintas posibles:** (a) **build/Function aún no listos** (ver Build Logs) y (b) **Deployment Protection / Vercel Authentication** pide login (sección 8). Cuál fue: **PENDIENTE DE COMPROBAR** (no hay evidencia en el transcript). |
| 4b | Enlace de ejemplo compartido en el chat a las 02:53, 02:56 y 03:00 (`puerto-am-landing-eduvo1.vercel.app`). | **Ejemplo histórico de la clase; puede no estar disponible.** No se usó como prueba (no se consultó). Un enlace compartido **no prueba** que IA y persistencia funcionen. |
| 6 | ~02:55: el profesor pide «acelera el despliegue en Vercel y lanza subagentes de Sonnet 5.5 medio»; menciona que los subagentes trabajan en segundo plano. | Es una decisión de herramienta (Claude Code), sin relación con la plataforma Vercel. La sesión **terminó sin prueba concluyente**; no declarar el sistema terminado de punta a punta. |
| 7 | ~03:13 (chat) Alumna D: «¿Vercel es como GitHub? Si uso cualquiera de los dos, ¿ya no necesito contratar dónde hostear? Solo que la liga no se ve profesional». Profesor ~03:12: «Git guarda los repositorios; las landing pages son fáciles de publicar, pero cuando necesitas una aplicación…» (se cortó al final de la grabación). | **Respuesta completa:** no son lo mismo. GitHub = repositorio (y Pages para estáticos); Vercel = despliegue con backend. Ambos dan URL gratuita (`*.github.io`, `*.vercel.app`) y **no necesitas contratar hosting** para una demo; para una URL «profesional» se usa **dominio propio** (compra + DNS, `vercel.com/docs/domains`). Hobby = uso no comercial (sección 11). |
| 8 | ~02:25–02:30: «cuatro herramientas son el mínimo: base de datos Supabase, repositorio GitHub, desplegador Vercel y la herramienta para crear código». | **Correcto como arquitectura mínima del demo con memoria.** Falta mencionar el **proveedor de IA** (OpenRouter) como quinta pieza, y que la landing sin IA solo requiere hosting estático. |
| 9 | Teoría: «saber desplegar no se hace con IA». | **Matiz:** una IA puede ayudar a escribir configuración y comandos, pero **requiere credenciales y revisión humana**; lo crítico (permisos, secretos, protección, plan) lo decide la persona. |

Notas sobre la transcripción: la herramienta de transcripción escribe «Versel/Verel» por «Vercel»; normalizado en los textos docentes. No se reproducen nombres de alumnos: Alumna D (diferencia GitHub vs Vercel; privacidad).

---

## 16. Lo NO verificado / PENDIENTE DE COMPROBAR (resumen)

1. **Ningún despliegue real en Vercel** (sin cuenta/login): comportamiento en la plataforma, tiempos de build, `GET /api/chat` → ¿405 o 404?, logs reales.
2. **Capturas con sesión** (Import Git Repository, Configure Project, Environment Variables, Deployments, Logs, Deployment Protection como usuario): **no existen**; solo esquemas rotulados.
3. **Valor por defecto de Vercel Authentication** en proyectos nuevos y **cuál fue la causa real** del login en clase.
4. **Respuesta de un modelo real de OpenRouter** con clave válida: solo se probó 401 real con clave falsa y el camino feliz con **mock**. El ID `openrouter/free` aparece en el listado público el 23/11/2026, pero la disponibilidad de modelos gratuitos cambia.
5. **`VITE_`**: regla de Vite no verificada contra su documentación (acceso bloqueado).
6. **Interpretación comercial/legal** del plan Hobby y alcance de «Your Content» para entrenamiento de modelos.
7. **Ejemplos de uso justo** (listas vacías en la versión Markdown) y condiciones de la **prueba Pro**.
8. **Precios de dominios** y flujo de compra; **configuración DNS** concreta del proveedor del alumno.
9. **Vercel Services (Beta)** y `app.frontend()` no se probaron; solo `public/`.
10. **Rate limiting/abuso** del endpoint público de IA: diseño pendiente (no hay estado persistente en la Function).
11. **Claim de que ChatGPT/Claude «necesitan dominios con costo» para desplegar**: no verificado.
12. Políticas de privacidad/uso de datos del router y proveedor de modelos de OpenRouter (se cubre en la guía de OpenRouter).

---

## 17. Índice de fuentes oficiales (todas consultadas el 23/11/2026)

- Vercel for GitHub: https://vercel.com/docs/git/vercel-for-github
- Git (producción, preview, importar): https://vercel.com/docs/git
- FastAPI en Vercel: https://vercel.com/docs/frameworks/backend/fastapi
- Python runtime: https://vercel.com/docs/functions/runtimes/python · versión: https://vercel.com/docs/functions/runtimes/python/python-version · `/api`: https://vercel.com/docs/functions/runtimes/python/api-directory
- Functions: https://vercel.com/docs/functions · runtimes/sistema de archivos: https://vercel.com/docs/functions/runtimes · límites: https://vercel.com/docs/functions/limitations
- Variables de entorno: https://vercel.com/docs/environment-variables · Config/Secret: https://vercel.com/docs/environment-variables/sensitive-environment-variables · prefijos de framework: https://vercel.com/docs/environment-variables/framework-environment-variables · variables de sistema: https://vercel.com/docs/environment-variables/system-environment-variables
- Deployments: https://vercel.com/docs/deployments · entornos: https://vercel.com/docs/deployments/environments · URLs: https://vercel.com/docs/deployments/generated-urls · sin login: https://vercel.com/docs/deployments/deploy-without-logging-in · Drop: https://vercel.com/docs/drop
- Deployment Protection: https://vercel.com/docs/deployment-protection · Vercel Authentication: https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication
- Configuración de proyecto: https://vercel.com/docs/project-configuration · builds: https://vercel.com/docs/builds/configure-a-build · logs de build: https://vercel.com/docs/deployments/logs · Runtime Logs: https://vercel.com/docs/runtime-logs
- CLI: https://vercel.com/docs/cli · deploy: https://vercel.com/docs/cli/deploy · env: https://vercel.com/docs/cli/env · build: https://vercel.com/docs/cli/build
- Límites: https://vercel.com/docs/limits · Hobby: https://vercel.com/docs/plans/hobby · uso justo: https://vercel.com/docs/limits/fair-use-guidelines · Términos: https://vercel.com/legal/terms
- Dominios: https://vercel.com/docs/domains · añadir dominio: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- Errores: https://vercel.com/docs/errors/FUNCTION_INVOCATION_FAILED · …/FUNCTION_INVOCATION_TIMEOUT · …/NOT_FOUND · …/DEPLOYMENT_NOT_FOUND · …/DEPLOYMENT_BLOCKED
- CORS: https://vercel.com/kb/guide/how-to-enable-cors
- Services (Beta): https://vercel.com/docs/services
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Supabase claves: https://supabase.com/docs/guides/getting-started/api-keys
- Listado público de modelos OpenRouter (solo para ID de ejemplo): https://openrouter.ai/api/v1/models

**Capturas reales (públicas, sin sesión, 1280×800 @2×, 23/11/2026):** `recursos_visuales/capturas/vercel_signup.png`, `vercel_docs_fastapi.png`, `vercel_docs_env_vars.png`, `vercel_docs_deployment_protection.png`. Nota: en `vercel_docs_fastapi.png` una imagen decorativa de la tarjeta «Deploy FastAPI to Vercel» no cargó (aparece un icono roto) — es tal como lo entregó el sitio en la captura.
