# 05 — Trazabilidad de prompts y evidencias

**Clase:** E1601.2, Semana 12 (15-nov-2026, 03:16:41 de duración) · **Auditoría y consulta de documentación:** 2026-11-22.
Este archivo cruza cada prompt con su hora en el chat, las marcas relacionadas de la transcripción, el estado de recuperación, la evidencia de resultado, las incidencias y la documentación consultada. Los encabezados "## Pxx — ..." coinciden con los de los archivos 01 a 04.

## Fuentes y método

| Fuente | Contenido | Huella SHA-256 (del archivo subido) |
|---|---|---|
| Chat de Meet | 75 mensajes con hora exacta (hh:mm:ss) | f97f95f280981412b5782106327695788f04387b5ae574f5b51a9fc7b14e3045 |
| Transcripción oral | 2304 líneas, 207 726 bytes; marcadores de hora solo cada 5 minutos | 9745e4d98d110350218c3285850684ee6fc267a8a767e61ae03dc0b817790c1f |

- **Marcas de la transcripción:** son aproximadas. Se indica el rango entre marcadores de 5 minutos y la línea (`L###`) del archivo de transcripción. Las líneas son una ayuda de localización; el reconocimiento de voz deforma nombres y términos ("Ithop" por GitHub, "Sonet", "Open Code", "Power Cell").
- **Textos literales:** los 14 bloques de texto de prompts del archivo 01 se comprobaron por programa contra el chat original (coincidencia exacta, sin el prefijo del remitente).
- **Privacidad:** roles "Profesor" y "Estudiante N". La numeración de estudiantes sigue el orden de primera aparición en el chat (Estudiante 1 = primera persona distinta del Profesor que escribe; Estudiante 9 solo habla en la transcripción) y es la misma en los cinco archivos. Se omitieron nombres, usuarios de GitHub, URLs de estudiantes (GitHub Pages y Firebase), números de teléfono, precios dichos por el agente de voz y códigos de dispositivo.
- **Estados:** original íntegro · parcial (cortado) · instrucción oral.

## Tabla de trazabilidad

| ID | Hora en chat | Marcas de transcripción (aprox.) | Estado | Evidencia de resultado | Incidencias | Documentación consultada (2026-11-22) |
|---|---|---|---|---|---|---|
| P01 | 00:51:52 | 00:50-00:55; L494-L497, L521 | original íntegro | "ya a ustedes ya les apareció... su navegador" (L521). Sin evidencia individual | Navegador por defecto del Profesor era Edge; Estudiante 2 preguntó si compartía pantalla (00:55:21); Estudiante 9 con interfaz desplazada | opencode.ai/docs/tools (herramientas `browser`, `webfetch`: parcial) |
| P02 | 00:57:42 | 00:55-01:10; L530, L567-L575, L603, L704, L758 | original íntegro | Agente del Profesor trabajando (L603); "todos también pudieron crear su calculadora" (L758) | Cifras de la versión mejorada: "no se paga solo" con 1 ejecución semanal (L908); modelo de cálculo sin fórmulas en el prompt | Sin fuente externa: las fórmulas de V2 son aritmética propia, con caso de prueba comprobado a mano (ahorro bruto 43,200; neto 36,000; ROI 80 %; payback 6.67 meses) |
| P03 | 01:12:25 (solo URL de la calculadora) | 01:10-01:15; L705-L750 (orden en L709) | instrucción oral | "ya lo subió en un solo prompt" (L733); "uno y dos" prompts (L745); enlace compartido y confirmado por estudiantes | El Profesor ya tenía `gh` autenticado (L1561, L1737-L1740); la orden era ambigua (crear o usar repositorio, visibilidad) | docs.github.com Pages (crear sitio, fuente de publicación): repositorio público en cuentas Free, hasta 10 min de despliegue |
| P04 | 01:03:26 (pregunta de Estudiante 3) | 01:03-01:25; L641-L860 (órdenes en L794 y L816) | instrucción oral | OpenCode "ya subió al repositorio algunos archivos" (L852); Claude Code pidió commit (L1043); cambio visible en el enlace | Interfaz de Claude Code cambió (L780); el Profesor corrigió su afirmación sobre comunicación entre agentes; advertencia de costos de API | code.claude.com/docs/en/sub-agents (parcial: primeros 100 000 de 115 219 caracteres); opencode.ai/docs/agents |
| P05 | sin mensaje | 01:15-01:35; L794-L945 (órdenes en L811, L830-L833; prompt generado en L846-L848) | instrucción oral (+ fragmento oral) | "327 procesos con 327 ids únicos" (L878); animaciones 3D (L885); pruebas en navegador | Validación solo estructural; cifras de ejemplo dictadas ("40.8 horas", "381,000", "2.3 meses", "4,770") sujetas a error de reconocimiento de voz; nombres de modelo ("Sonet 5.5") no verificables | code.claude.com/docs/en/sub-agents: contexto propio por subagente, modelo por subagente, mismo límite de uso |
| P06 | 01:39:17 (pedido de Estudiante 2 a las 01:39:08) | 01:35-01:45; L980-L1030 (revisión L1453-L1456) | original íntegro | DENTEA revisada por el Profesor: "bonita landing page", "nos hacen falta las fotos", botón de WhatsApp con número "inventado" (L1453-L1456) | Sesiones "trabajando" (01:56:10, 01:56:27, 02:27:28); límite gratuito (03:12:37); inicio de sesión de Google Flow; número provisional inventado | wa.me y paquete de Framer Motion: pendiente de verificar (sitios no accesibles en la sesión) |
| P07 | 01:41:08; 01:41:18; 01:41:27 | 01:40-01:45; L1008-L1030 | original íntegro (+ 2 indicaciones de uso) | Estudiante 4 lo usó (L2270) y publicó una landing que el Profesor elogió (L2280-L2296) | Estudiante 2: el asistente "me fue guiando" sin crear la página y ofreció hosting/Canva (L1478-L1480); texto con campo "PROMPT ORIGINAL:" vacío; referencia no verificable "como Fable" | Sin fuente externa para el diseño del meta-prompt |
| P08 | 01:57:15 (solo https://console.x.ai/) | 01:55-02:05; L1170-L1250 (instrucciones L1177-L1196; agente L1222 en adelante) | instrucción oral | Demo con baja latencia e interrupciones (L1222-L1250) | Micrófonos duplicados y permiso (L1218, L1250); el agente citó precios y un contacto (omitidos aquí); sin documentación de la consola consultada | Pendiente de verificar (no se consultó documentación de xAI) |
| P09 | 02:32:16; 02:42:53 | 02:30-02:45; L1525-L1740 | original íntegro (2 apariciones idénticas) | Estudiante 3 (02:46:25 y 02:58:17) y Estudiante 6 (02:58:24) conectaron; el Profesor reconoce "ya quedó listo" | Códigos que "no llegan por correo" (Estudiante 8, L1574-L1578); códigos caducados (Estudiante 7); OpenCode ofreció Netlify (L1803); el Profesor no pudo mostrarlo en pantalla (L1561); solicitud de Windows con nombre de persona rechazada por Estudiante 7 (L1831) | cli.github.com/manual/gh_auth_login, gh_auth_status, gh_auth_setup-git; docs de OAuth device flow; docs/install_windows.md de gh; documentación de winget (repositorio winget-cli) |
| P10 | 02:48:19 | 02:45-02:50; L1790-L1800 (L1794 "mini prompt") | original íntegro | Estudiante 6 cita la respuesta de OpenCode: cancela el intento y genera un código nuevo (02:58:24); "y ya lo conecto" (02:58:33) | Pide "abre la ventana" sin contexto; solo funciona si el agente conserva el contexto de P09 | cli.github.com/manual/gh_auth_login; internal/authflow/flow.go de gh (comportamiento del flujo de código) |
| P11 | 02:53:02 (cortado) y 02:53:18 (continuación) | 02:50-02:55; L1814-L1870 (L1848 "dos partes", L1865 PowerShell) | **parcial (cortado)** | Estudiante 7 vio una ventana "Windows PowerShell 5.1" con el código y completó el inicio de sesión (L1890-L1996); "el código no llega por correo" (L1996) | Fragmento 1 de 4000 caracteres exactos, cortado en "...prepara el pr"; fragmento 2 empieza en "5. DEJA EL PROYECTO LISTO EN GITHUB", repite el encabezado y 5 viñetas, y llegó sin formato; ventana oculta tras OpenCode; código caducado una vez; alcance excesivo (subir proyecto) | `--clipboard` verificado en cli.github.com y en `gh auth login --help` (gh 2.89.0); gh_repo_create, gh_repo_list (`--limit`), gh_api |
| P12 | 03:01:41; 03:04:29 (re-pegado por Estudiante 2); 03:05:05 | 03:00-03:10; L2008-L2110 (L2047 confirmación del repositorio) | original íntegro (3 apariciones) | Estudiante 6 publicó (03:07:13); Estudiante 7 compartió su URL (03:12:27) y el Profesor confirmó que abría; Estudiante 4 publicó en Firebase (03:13:42) | Dónde pegarlo (03:04:29-03:05:02); "detectó un fallo real" (L2201); ventana adicional amarilla (L2106); Estudiantes 5 y 8 sin completar; ambigüedad "ya publica/pública"; conflicto privado/público con P11 | docs.github.com Pages: crear sitio, fuente de publicación, flujos personalizados, límites; Vite (static-deploy, vía GitHub): base `'/<repositorio>/'` |
| P13 | 03:15:51 (Estudiante 4) | 03:10-03:20; L2241-L2300 | original íntegro | Sitio publicado en Firebase compartido a las 03:13:42 y elogiado (L2280-L2296: "animaciones", "tipos de outfits") | Límite gratuito alcanzado (03:12:37); el texto se publicó en el chat después de la URL; autoría de Estudiante 4, no del Profesor | Sin fuente externa; análisis estructural propio |
| P14 | sin mensaje | 00:55-01:05; L538-L640 (L540, L561, L563, L599, L631-L635) | instrucción oral | El agente generó su propio prompt para Flow y se vio un video ("no se ve mal", L635) | La contraseña la escribe el usuario (L560); consumo de créditos no mencionado | Pendiente de verificar (Google Flow no consultado) |
| P15 | sin mensaje | 02:45-02:50; L1765-L1784 | instrucción oral | Estudiante 7 la ejecutó; OpenCode propuso Netlify (L1803) | El agente cambió de plataforma por iniciativa propia | opencode.ai/docs/permissions (preguntar/permitir/denegar) |
| P16 | sin mensaje (preguntas de Estudiante 3 a 03:04:34 y 03:05:16) | 03:00-03:10; L2048-L2075 | instrucción oral | No se ejecutó en clase; el Profesor confirma que se puede en Claude Code "sin OpenCode" (L2069) | Descripción de la conexión como "correo, contraseña y listo" | Sin fuente externa |

## Documentación consultada (2026-11-22)

Las consultas se hicieron con la herramienta WebFetch, que devuelve un resumen del contenido de cada página; no se leyeron las páginas completas. Se anota qué se confirmó.

| Documento | Estado | Qué se confirmó |
|---|---|---|
| https://cli.github.com/manual/gh_auth_login | verificado | Opciones `-c/--clipboard` ("Copy one-time OAuth device code to clipboard"), `-w/--web`, `-p/--git-protocol`, `-h/--hostname`, `--with-token`, `--insecure-storage`, `-s/--scopes`, `--skip-ssh-key` |
| Ayuda local `gh auth login --help` (gh 2.89.0) | verificado | Mismas opciones y ejemplo `gh auth login --web --clipboard`. Intento de login real no concluyente: el proxy de la sesión devolvió HTTP 415 |
| https://raw.githubusercontent.com/cli/cli/trunk/internal/authflow/flow.go | verificado (resumen) | Modo no interactivo imprime la URL y no abre el navegador; modo interactivo espera Enter; con `--clipboard` copia el código y, si falla, lo imprime; si el navegador falla, imprime la URL y continúa |
| https://cli.github.com/manual/gh_auth_status | verificado | Opciones `--active`, `--hostname`, `--show-token` (imprime el token: no usar), `--json`; código de salida 1 si hay problemas |
| https://cli.github.com/manual/gh_auth_setup-git | verificado | Configura Git para usar `gh` como ayudante de credenciales; `--hostname`, `--force` |
| https://cli.github.com/manual/gh_repo_create | verificado | `--source`, `--push`, `--private`, `--public`, `--remote` |
| https://cli.github.com/manual/gh_repo_list | parcial | `--limit` (por defecto 30). Si incluye repositorios privados por defecto: **pendiente de verificar** |
| https://cli.github.com/manual/gh_api | parcial | `--jq`; adviértese que añadir parámetros cambia el método a POST. El endpoint `user` no aparece en esa página |
| https://docs.github.com/en/rest/users/users#get-the-authenticated-user | verificado | `GET /user` devuelve `login` |
| https://raw.githubusercontent.com/cli/cli/trunk/docs/install_windows.md | verificado | `winget install --id GitHub.cli --source winget`; el instalador modifica el PATH y en Windows Terminal hay que abrir una ventana nueva |
| https://raw.githubusercontent.com/microsoft/winget-cli/master/doc/windows/package-manager/winget/install.md | verificado (resumen) | `--id`, `--exact/-e`, `--source`, `--accept-package-agreements`, `--accept-source-agreements`, `--scope`; ejemplo con `Git.Git` |
| https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow | verificado | El código se muestra en el dispositivo y se introduce en https://github.com/login/device; 8 caracteres con guion; caduca por defecto a los 900 s |
| https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site | verificado | En cuentas Free el repositorio debe ser público; fuente: rama y carpeta o GitHub Actions; hasta 10 min para ver cambios; Jekyll por defecto, alternativa `.nojekyll` |
| https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site | verificado | Rama y carpeta (raíz o /docs) o GitHub Actions. El endpoint REST de Pages **no** se pudo confirmar aquí |
| https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages | verificado | Permisos `pages: write` e `id-token: write`; `actions/configure-pages`, `upload-pages-artifact`, `deploy-pages`; entorno `github-pages` |
| https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | verificado | Sitio de hasta 1 GB; límite blando de 100 GB al mes; despliegues de hasta 10 min; usos comerciales prohibidos (negocio en línea, comercio, SaaS) |
| https://raw.githubusercontent.com/vitejs/vite/main/docs/guide/static-deploy.md | verificado (resumen) | Para `https://<USUARIO>.github.io/<REPO>/`, `base` = `'/<REPO>/'`; fuente Pages "GitHub Actions" |
| https://opencode.ai/docs/ , /permissions/ , /tools/ , /agents/ | parcial | App de escritorio (Windows incluido); permisos allow/ask/deny; herramienta de comandos `shell` con `background`; agentes Build y Plan (Plan no edita archivos del proyecto); subagentes General y Explore. **No** se confirmó: lista de modelos gratuitos, cambio de agente con Tab, soporte de terminal interactiva |
| https://code.claude.com/docs/en/sub-agents | parcial | Subagentes con contexto propio, modelo por subagente, herramientas restringibles, ejecución en primer o segundo plano, mismo límite de uso. Solo se leyeron los primeros 100 000 de 115 219 caracteres |

## No se pudo verificar (pendiente de verificar)

1. **Microsoft Learn (winget), vite.dev, faq.whatsapp.com (enlaces wa.me) y motion.dev:** estos hosts no resolvieron en la sesión de auditoría. Las opciones de winget sí se contrastaron con el repositorio winget-cli y la ruta base de Vite con el repositorio de Vite en GitHub. Quedan sin comprobar: el formato exacto de los enlaces `wa.me` (se asume número internacional solo con dígitos y `?text=` codificado) y el nombre actual del paquete de Framer Motion (puede ser `motion`).
2. **Endpoint REST para crear un sitio de Pages** (`POST /repos/{owner}/{repo}/pages`): los prompts piden al agente confirmarlo en docs.github.com/rest/pages antes de usarlo.
3. **Si `gh repo list` incluye repositorios privados por defecto** y el efecto del alcance `workflow` en la ventana de autorización adicional que vio Estudiante 7 (hipótesis, sin evidencia).
4. **Nombres de editor mostrados por el control de cuentas de Windows (UAC)** para los instaladores de Git y GitHub CLI y la causa de la ventana con un nombre de persona (no se pudo determinar; el criterio recomendado es cancelar y verificar).
5. **Correo de verificación de GitHub para dispositivos nuevos:** se menciona como posible fuente de confusión; no se confirmó con documentación.
6. **Formato del correo `noreply` de GitHub** para `git config` (se menciona solo como opción que el usuario puede elegir).
7. **Google Flow y consola de xAI:** no se consultó documentación; el comportamiento descrito es el observado en clase.
8. **Comportamiento de `Start-Process` y del portapapeles en Windows 10/11** para estudiantes concretos: solo hay un caso observado (Estudiante 7). No se ejecutó nada en un equipo Windows.
9. **Modelo de OpenCode usado por cada estudiante:** se recomendó GLM, pero la transcripción no confirma el modelo concreto de cada persona. Los nombres de modelos dichos en voz ("GLM 5.3 Flash", "Sonet 5.5") son transcripciones de voz.

## Otros elementos revisados y descartados como prompts

- Pregunta de Estudiante 4 sobre Firebase (02:30:29) y respuesta oral del Profesor (L1530): consulta, no prompt.
- Mensajes con solo enlaces del Profesor (https://github.com/ a las 02:29:31, 02:29:52 y 02:42:45; https://opencode.ai/desktop a las 00:39:21): no contienen instrucciones a un agente.
- Mensaje de Estudiante 6 de las 02:58:24: cita la respuesta de OpenCode (evidencia de P10), no es un prompt; contiene un código de dispositivo que se omite.
- Mensaje de Estudiante 2 de las 03:02:58: texto de la página de GitHub copiado con su usuario (se omite); sirve solo como evidencia de la advertencia "Never use a code sent by someone else".
- Ejemplo oral de un caso práctico (clínica dental con botón de WhatsApp, L375): ilustración docente, no una orden ejecutada.

## Hechos clave de cronología (para cruzar)

| Tiempo | Hecho |
|---|---|
| 00:38-00:52 | Descarga de OpenCode, elección de modelo, carpeta de proyecto; P01 |
| 00:57-01:12 | P02 (calculadora), P14 (Flow, demo del Profesor), P03 (publicación del Profesor) |
| 01:03-01:25 | P04 y P05 (Claude Code y subagentes, solo pantalla del Profesor); descanso |
| 01:39-01:45 | P06 y P07 |
| 01:55-02:05 | P08 (xAI) |
| 02:30-02:50 | P09, P10, P15 |
| 02:50-03:00 | P11 (dos mensajes) y primeras conexiones |
| 03:00-03:15 | P12, publicaciones de las estudiantes, P13 |
