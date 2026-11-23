# HECHOS CLAVE DE LA CLASE — E1601.2 · 22/11/2026 (resumen técnico para redactores)

> Agente A · 23/11/2026. Todo procede de `transcript.txt` (L = línea) y `chat.txt` (C-nn / S-nn en `inventario_chat.md`); **Inferido** = deducción marcada. Alumnos con códigos A–J. Cronología completa en `00_MAPA_DE_FUENTES_Y_CRONOLOGIA.md`.

## 1. Sesión
Domingo 22/11/2026, 08:52 CST; ~3 h 15 min (termina "después de 03:14:59", a mitad de la respuesta a Alumna D). Profesor: Kevin Martínez. Semana 13, vibe coding. Herramienta principal de alumnos: **OpenCode** (gratuito, Windows); el profesor termina en **Claude Code**. Dos proyectos paralelos: (1) dashboard Puerto A&M, (2) landing + agente de restaurante. Todo dato = SIMULACIÓN ACADÉMICA. Fuente prioritaria de prompts: C-03 (dashboard), C-13 (alcance landing sin n8n), C-16 (soul.md+menú), C-22 (memoria Supabase), C-23 (repo+Pages).

## 2. Nombres, carpetas y archivos
- Proyecto: `Puerto A&M | Business Intelligence`. Excel: `Puerto_AM_Base_Datos_DEMO.xlsx` (hojas Ventas, Productos, Metas, Instrucciones; el profesor vio "~364" filas y **360 pedidos**, L455, L526, L874). Tecnologías solo en el chat (el profesor no las nombra oralmente): HTML/CSS/JS + Chart.js, FastAPI, openpyxl (**Inferido** que OpenCode las usó).
- Landing en **carpeta/conversación distinta** al dashboard para no borrarlo (L434-443). Archivos citados: `soul.md` (system prompt en Markdown), `.env` (mención de buena práctica, L770). Repo conectado a Claude Code mostraba carpetas `frontend`, `backend`, `supabase`, `data`, `knowledge` (L1751). Proyecto Supabase creado por el agente: "puerto AM landing" (L1872).
- Enlaces del profesor (ejemplos históricos; pueden no estar disponibles): dashboard y landing en `asternodelab.github.io/...` y Vercel `puerto-am-landing-eduvo1.vercel.app`.

## 3. Herramientas y modelos mencionados
OpenCode (modelo gratuito dicho "high 4/high 4 flash", sin verificar; alternativas gratuitas vistas: DeepSeek, MiMo, L1662) · ChatGPT (metaprompting, "el que mejor contesta", L228) · OpenRouter (key, "modelo free") · GitHub (CLI + Pages) · Supabase · Claude Code ("Opus 5.5" principal, subagentes "Sonnet 5.5 esfuerzo medio", como se dijo) · Vercel · Cloudflare (enlace de Alumna I, **Inferido** túnel temporal) · n8n (solo mencionado/recortado) · Lovable, v0, Bolt (nombradas, no usadas) · Codespaces (enlace de Alumna A, **Inferido**). Nombres de modelos "Fable 5.2", "Astra 6.2": solo dichos de pasada (L817-819).

## 4. Secuencia técnica real (lo observado)
1. **Metaprompting** en ChatGPT (fórmula C-01) → prompts C-02 (truncado) y **C-03** (autorizado). Dashboard listo en ≈15 min (≈00:43).
2. **Pruebas Excel→dashboard:** editar valores no reflejó el cambio hasta corregir la conexión (T-03); error "permiso denegado" con Excel abierto → cerrar el archivo; edición de valores y copia de un pedido (360→361) reflejadas.
3. **Chat de IA en el dashboard** (C-05) + **OpenRouter** (key de 7 días recomendados; límite de crédito; visible una vez) + C-07. Antes de la key, el chat usaba "motor local de respuestas exactas" (L778). Con la key respondió con IA; fallo "fail to fetch" por reinicio del servidor (corregido); ventas totales y ticket verificados "correctos" por el profesor; no obtuvo "el último pedido".
4. **Pruebas anti-alucinación** (preguntas irracionales, palas/cemento, datos confidenciales) y regla propuesta para soul.md (T-07).
5. **GitHub:** C-11 (repo + Pages del dashboard), luego C-23 (landing). Varios alumnos publicaron en `github.io`; otros solo `localhost`; Alumna I con túnel de Cloudflare.
6. **Landing:** C-04 trajo módulo n8n/webhook vacío → C-13 (sin n8n). Menú costero DEMO + soul.md de reservas/pedidos (C-14→C-16). Prueba: el agente aceptó "10 tostadas de atún" y **olvidó** el pedido al siguiente mensaje; confirmó "cada interacción empieza desde cero" (L1369-1437).
7. **Supabase (OpenCode):** presentación conceptual (Auth, PostgreSQL, Realtime, Storage, cron, Edge Functions; plan gratuito "50 000 usuarios, 500 MB…", Pro $25: cifras orales a verificar). Intentos C-18→C-22: OpenCode abrió Supabase pero "no tengo herramientas de navegador… solo puedo abrir URLs"; Alumno F llegó a "crear nueva organización"; luego "solo local, pide dos APIs"; Alumna E: "credencial no válida". Se pausó para centrarse en GitHub.
8. **GitHub Pages:** el profesor mostró su landing publicada: **el chat solo funcionaba con respuestas predefinidas; la IA no corre en Pages** ("GitHub no puede ejecutar Python ni guardar la clave de OpenRouter", L1612-1618) → hace falta backend (Vercel, "la siguiente clase") y Supabase para memoria.
9. **Claude Code:** conectado al repo por URL; rediseño costero con animaciones (visible, "peces animados"); subagentes para rediseño, Supabase y backend en Vercel; el agente creó el proyecto Supabase (según narró; sin tablas/RLS/memoria mostradas); GitHub Pages actualizado ("terminó bien"). **Vercel:** proyecto existente conectado a GitHub pero "todavía no se puede usar el sitio" (L1800); backend de IA aún en construcción; último enlace "todavía no sirve" (L1940) y luego "les va a pedir iniciar sesión" (L1967). **Sin confirmación end-to-end.**

## 5. Errores vistos → solución aplicada o propuesta
| Error / síntoma | Causa dicha | Solución |
|---|---|---|
| Dashboard no refleja cambio | conexión Excel→dashboard deficiente | pedir a OpenCode corregir (T-03) |
| "Permiso denegado" al leer Excel | archivo abierto en Windows (según el agente) | cerrar el Excel antes de actualizar |
| `fail to fetch` en chat | servidor reiniciado con pestaña abierta | pedir "corrige el fallo"; el agente verificó endpoint/prueba headless |
| OpenCode "pensando" sin terminar; se detiene al cambiar de ventana | modelo/proceso atascado | "Acelera los procesos" (C-09); cambiar de modelo; reiniciar/actualizar; sesión limpia |
| "Pendiente de conexión" | API, modelo saturado o webhook n8n vacío | C-12; C-13 (quitar n8n); revisar key/modelo |
| Chat con respuestas predefinidas ("motor local") | solo se publicó la parte local | pedir publicar también el asistente con IA; requiere backend |
| Enlaces `localhost`/`127.0.0.1` | solo en el equipo del alumno | publicar (Pages u otro); no es URL pública |
| Landing/dashboard idénticos publicados | mismo nombre de repo/enlace | nombres distintos (T-10) |
| Agente sin memoria | LLM sin estado entre cargas | base de datos (Supabase); no resuelto en clase |
| Supabase: sin herramientas de navegador | sesión sin navegador integrado | iniciar sesión a mano y decir "ya inicié sesión, sigue" (T-19) |
| Supabase "credencial no válida" / pide organización | registro por Google vs credenciales; organización pendiente | crear organización manualmente; repetir desde cero (PDF) |
| GitHub restringió uso temporal (Alumno F) | "tecleando a velocidad superhumana" (causa no verificada) | captura al muro; **PENDIENTE DE COMPROBAR** |
| OpenCode sin lista de modelos (Alumna C) | catálogo no se recupera; cuenta gratuita | `/model`, `opencode auth list` (efecto **PENDIENTE DE COMPROBAR**), reinstalación por mensaje privado |
| Código/2FA de GitHub no visto (Alumna E) | dispositivo de verificación | cubrir en el PDF de GitHub |

## 6. Prácticas inseguras observadas (a corregir en las guías)
Key de OpenRouter **pegada en el prompt** a OpenCode (L754-774) y de nuevo a Claude Code (L1900-1906); el profesor reconoce "mala práctica" y nombra `.env`. Recomendó "sin expiración / sin límite… no hay riesgo" si la cuenta no tiene fondos (L727-731). Dashboard publicado sin autenticación y con IA "que cualquiera puede ocupar" (L1451-1455); el profesor admite que sin autenticación queda "desprotegido" (L2031-2033). Afirmación de privacidad de API ≠ local (L828-834). Remedio "eliminar el repositorio" (no revoca exposición).

## 7. Estado de cada pieza al terminar
| Pieza | Estado |
|---|---|
| Dashboard local con Excel + chat IA | **Terminado y probado en local** (con la limitación de sincronización local) |
| Dashboard publicado (profesor) | Publicado como estático; dependencia de PC local/backend no aclarada |
| Landing local con IA y menú DEMO | Funcional en local; sin memoria |
| Landing en GitHub Pages | Publicada; **solo respuestas predefinidas** |
| Memoria con Supabase | **En proceso / no verificada** (proyecto creado según el profesor) |
| Backend IA en Vercel | **En construcción**; sitio no accesible al final |
| n8n / panel financiero | **No implementado** (nivel 2) |
| Reservas y pedidos guardados | **No demostrado** |

## 8. Tarea y promesas
PDFs en el muro (clase completa → GitHub → Supabase → OpenRouter → Vercel; "~40 min", todo "desde cero", ruta alternativa con Claude); tarea: revisar PDFs, practicar, tener sesión iniciada en GitHub/Supabase, **subir enlace/evidencia al muro**; próxima clase (domingo siguiente): **despliegue desde cero**; n8n y bases de datos en nivel 2 (≈2 semanas); seguimiento privado a Alumna C. Pregunta final de Alumna D (Vercel vs GitHub) quedó **sin respuesta completa**.
