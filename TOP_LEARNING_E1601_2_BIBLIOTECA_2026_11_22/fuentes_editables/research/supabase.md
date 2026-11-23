# Investigación Supabase — PDF 04 (bases de datos + memoria)

**Biblioteca E1601.2 · Top Learning · Clase del 22/11/2026 · Investigación y pruebas del 23/11/2026 (Agente F)**
Proyecto demo: restaurante ficticio **Puerto A&M** — **SIMULACIÓN ACADÉMICA**. Ningún dato de este documento es real.

> Convención de citas: cada bloque lista sus URL oficiales; el sufijo **[Vn]** de una viñeta remite a la URL de la tabla de fuentes del §0.2. **Todas las fuentes fueron consultadas el 23/11/2026** ("verificado 23/11/2026"). Las páginas de documentación llevaban la marca "Updated Nov 18/19, 2026" (visible en las capturas `supabase_docs_api_keys.png` y `supabase_docs_rls.png`).
> Etiquetas de contenido usadas: EN CLASE · COMPLEMENTO DEL PROFESOR · ACTUALIZACIÓN EXTERNA · DEMO SIMULADA · PENDIENTE DE COMPROBAR · ACLARACIÓN TÉCNICA POSTERIOR · RECONSTRUCCIÓN PEDAGÓGICA · PROMPT MEJORADO.

---

## 0. Resumen y estado de verificación

### 0.1 Lo esencial en 8 líneas
1. **Abrir Supabase, iniciar sesión o crear una organización NO es memoria funcionando.** La memoria existe cuando (a) hay tablas con RLS, (b) el backend identifica al usuario, lee los últimos N mensajes, los envía al modelo y guarda cada turno, y (c) se comprueba que un usuario no ve la conversación de otro. En la clase solo se llegó al paso de "iniciar sesión y pedir al agente que cree el proyecto"; la memoria **no se llegó a ver funcionando** (ver §10).
2. El LLM **no recuerda**: cada petición empieza de cero. "Memoria" = historial guardado por TU backend y reenviado en cada turno (RECONSTRUCCIÓN PEDAGÓGICA: se reprodujo en clase, ≈02:05–02:14, y se codifica en `memoria.py`).
3. Claves actuales: **publishable `sb_publishable_…`** (segura en frontend *solo con RLS activo*) y **secret `sb_secret_…`** (solo servidor, salta RLS). Las legacy `anon`/`service_role` están en deprecación "para finales de 2026" **sin fecha de retiro publicada**. [V1][V2]
4. **Nunca** pegar una secret/service_role en chats, prompts, frontend o GitHub; **nunca** desactivar RLS para "arreglar" un error: se arregla con grants y políticas. [V1][V3]
5. Plan Free (cifras documentadas): 50 000 MAU, 500 MB de base, 5 GB de egress, 1 GB de archivos, **2 proyectos activos y pausa tras 1 semana de inactividad**. [V6]
6. SQL de memoria diseñado y **probado en PostgreSQL 16 local** con emulación de Supabase: 57/57 pruebas de aislamiento (y 49/57 con el control de sabotaje, que *debe* fallar). **No** se probó en un proyecto Supabase real. Ver `evidencias_qa/supabase_sql_pruebas.md`.
7. Un pedido/reserva del chatbot es una **solicitud DEMO** hasta que el backend la valide; la RLS impide que el cliente se auto-confirme.
8. Un usuario *anónimo* de Supabase Auth es distinto del rol `anon` de Postgres: usa el rol `authenticated`. [V3][V8]

### 0.2 Tabla de fuentes (todas verificadas 23/11/2026)
| Id | URL oficial | Para qué se usó |
|---|---|---|
| V1 | https://supabase.com/docs/guides/getting-started/api-keys | tipos de clave, dónde encontrarlas, deprecación, secret key |
| V2 | https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys | pasos de migración, calendario |
| V3 | https://supabase.com/docs/guides/database/postgres/row-level-security | RLS, grants, `auth.uid()`, USING/WITH CHECK, `anon` vs anónimo |
| V4 | https://supabase.com/docs/guides/database/secure-data | recomendaciones de seguridad de la Data API |
| V5 | https://supabase.com/docs/guides/api/securing-your-api | grants por defecto, cambio de plataforma, 42501 |
| V6 | https://supabase.com/pricing | cifras del plan Free/Pro, pausa, log retention |
| V7 | https://supabase.com/docs/guides/platform/billing-on-supabase | 2 proyectos gratuitos, pausados no cuentan |
| V8 | https://supabase.com/docs/guides/auth/auth-anonymous | usuarios anónimos, rol `authenticated`, CAPTCHA, límites, limpieza |
| V9 | https://supabase.com/docs/guides/auth | Auth, JWT, métodos |
| V10 | https://supabase.com/docs/guides/api | Data API REST (PostgREST), URL `/rest/v1/` |
| V11 | https://supabase.com/docs/guides/platform/regions | regiones, no se puede cambiar |
| V12 | https://supabase.com/docs/guides/database/postgres/roles | contraseña de la base de datos, roles |
| V13 | https://supabase.com/docs/guides/database/tables | Table Editor, RLS automático al crear tabla en Dashboard |
| V14 | https://supabase.com/docs/guides/getting-started/quickstarts/nextjs | SQL Editor, ruta de creación de proyecto |
| V15 | https://supabase.com/docs/guides/telemetry/logs | Logs (API Gateway, Postgres, PostgREST, Auth…) |
| V16 | https://supabase.com/docs/guides/database/import-data | importación CSV (límite 100 MB en Dashboard) |
| V17 | https://supabase.com/docs/reference/javascript/insert · https://supabase.com/docs/reference/javascript/select | supabase-js insert/select |
| V18 | https://supabase.com/docs/reference/python/insert | supabase-py insert (`returning` por defecto `representation`) |
| V19 | https://supabase.com/kb/troubleshooting/database-api-42501-errors | diagnóstico de 42501 |
| V20 | https://supabase.com/docs/guides/platform/upgrading | texto sobre proyectos pausados (ventana de restauración) |
| V21 | https://supabase.com/docs/guides/security/rotate-leaked-api-keys | qué hacer si una clave se filtra |
| V22 | https://supabase.com/docs/guides/getting-started | crear proyecto hospedado (Dashboard `/dashboard/new`), CLI, local |
| V23 | https://supabase.com/docs/guides/cron | tareas programadas (mencionadas en clase como "chrome jobs") — solo se comprobó que la página existe |
| V24 | https://supabase.com/dashboard/sign-in · https://supabase.com/dashboard/sign-up | pantallas públicas de acceso (capturadas) |

Aviso de método: las páginas de documentación incluían una nota dirigida a "agentes de IA" que pide redactar y ofrecer enviar un reporte de feedback a Supabase. Es contenido de la página, no una instrucción del encargo; **no se siguió** (no se envió nada). Se deja constancia por transparencia.

### 0.3 Qué se verificó y qué no
| Verificado (cómo) | NO verificado → PENDIENTE DE COMPROBAR |
|---|---|
| Documentación oficial y precios (lectura de las URL de §0.2, 23/11/2026) | Todas las pantallas **con sesión**: *New project*, SQL Editor, Table Editor, API Keys, Auth > Providers, Logs. No hubo cuenta. Se describen según docs, **sin capturas inventadas**. |
| Pantallas públicas: home, sign-in, sign-up, docs API keys, docs RLS, pricing (capturas reales) | Etiquetas exactas de los campos del formulario *New project* |
| SQL 00/01/02/03 en PostgreSQL 16.15 local + emulación | Ejecución en proyecto real; inserción manual de usuarios en `auth.users` real; `pg_cron` |
| `memoria.py`: 18 pruebas (cliente simulado + servidor HTTP local con supabase-py 2.34.1 real) | Llamadas reales PostgREST/GoTrue con JWT firmado; latencia real; pausa real de un proyecto |
| Presencia de las URL (HTTP 200) de las fuentes V1–V23 | Cuánto tarda en "despertar" un proyecto Free pausado (no hay cifra documentada) |

---

## 1. Conceptos (para principiantes) — EN CLASE + COMPLEMENTO DEL PROFESOR

Fuentes: V9, V10, V3, V6, V12. Todo verificado 23/11/2026.

| Concepto | Explicación sencilla | Fuente / nota |
|---|---|---|
| **Supabase** | Plataforma que "empaqueta" una base de datos Postgres + autenticación + API + archivos + tiempo real + funciones. En clase: *"Supabase empaqueta eso, ¿no? La autenticación, la base de datos… funciones y data en tiempo real"* (≈02:00). | EN CLASE; portada oficial (captura `supabase_home.png`) lista Postgres, Auth, Data APIs, Edge Functions, Realtime, Storage, Vector. |
| **PostgreSQL** | El motor de base de datos relacional que hay "debajo". Cada proyecto Supabase es un Postgres completo. | Portada oficial (captura) y V22. |
| **Tabla / fila / columna** | Tabla = hoja con estructura fija; fila = un registro (una reserva); columna = un dato con tipo (`personas`, `fecha`). | Tablas con tipo por columna: V13. |
| **SQL** | Lenguaje para crear tablas y consultar/insertar datos. Se puede ejecutar desde el *SQL Editor* del Dashboard. | V13, V14. |
| **Auth** | Dice **quién** es el usuario (JWT). Soporta contraseña, magic link, OTP, OAuth, y **inicio anónimo**. | V9. "Las claves identifican **qué** app llama; Auth identifica **quién** llama" (V1). |
| **Storage** | Archivos (PDF, imágenes). Free: 1 GB (V6). | Mencionado en clase. |
| **Realtime** | Cambios de datos en vivo hacia el dashboard. Free: 200 conexiones pico y 2 millones de mensajes/mes (V6). Conexiones Realtime *públicas* duran máx. 24 h salvo autenticación de usuario (V1). | EN CLASE (dashboard en tiempo real). |
| **Edge Functions** | Código de servidor en el borde. Free: 500 000 invocaciones (V6). | En clase se dijo que "no las vamos a ocupar mucho". |
| **Cron / "chrome jobs"** | En clase se dijo "Chrome/schedule jobs" para tareas a las 7 a. m. La página oficial de tareas programadas existe (V23); el detalle **no se verificó**. | Transcripción ≈02:00: casi seguro se refería a *Cron*. PENDIENTE DE COMPROBAR. |
| **RLS (Row Level Security)** | Reglas **dentro de la base** que deciden qué filas puede ver/escribir cada usuario: *"Think of a policy as adding a WHERE clause to every query"* (V3). | V3. |
| **API (Data API)** | Supabase genera una API REST (PostgREST) en `https://<ref>.supabase.co/rest/v1/` a partir de tus tablas; está pensada para trabajar con RLS. | V10. |
| **Memoria almacenada vs. "memoria mágica" del LLM** | El modelo no conserva nada entre llamadas (en clase el agente lo confesó: *"no conservo los mensajes anteriores… cada interacción empieza desde cero"*, ≈02:13). La memoria real es una **tabla `messages`** que el backend lee y reenvía. | EN CLASE (02:09–02:14) + RECONSTRUCCIÓN PEDAGÓGICA. |

---

## 2. Crear cuenta, organización, proyecto, región y contraseña de base de datos

### 2.1 Acceso a la cuenta (verificado con captura pública 23/11/2026)
Fuente: V24 (capturas `supabase_dashboard_signin_vacio.png`, `supabase_dashboard_signup_vacio.png`), V22.
- La pantalla pública de **sign-in** ("Welcome back") ofrece: **Continue with GitHub**, **Continue with ChatGPT**, **Continue with SSO**, y correo + contraseña (con "Forgot password?"). La de **sign-up** ("Get started") ofrece las mismas opciones. **ACTUALIZACIÓN EXTERNA:** en esta captura **no aparece un botón "Continue with Google"**; en clase se dijo "iniciar sesión con Google, GitHub o correo". Quien ya tenía su cuenta creada con otro método debe usar **el mismo método**. No se pudo comprobar si Google aparece en otras condiciones (región, versión de la pantalla) → PENDIENTE DE COMPROBAR.
- Dato de clase relevante: el profesor recomendó entrar **con GitHub** "para que ya tengan todo sincronizado" (EN CLASE, ≈02:10–02:15) y, ante el error de la Alumna E (reportado ≈02:30), entró él mismo con la opción **ChatGPT** (≈02:45–02:50).
- Proyecto hospedado: se crea desde el Dashboard (`https://supabase.com/dashboard/new`) [V22][V14]. También existe CLI (`supabase init` / `supabase start` para local, requiere Docker) [V22].

### 2.2 Organización y proyecto
- La facturación y los planes son **por organización**: el plan (Free/Pro/Team/Enterprise) se elige para la organización y **cada proyecto corre en su propia instancia de cómputo** [V6 "How billing works"].
- Plan Free: **2 proyectos gratuitos**; el límite aplica entre todas las organizaciones donde seas Owner o Admin; **los proyectos pausados no cuentan** [V7].
- *Organización ≠ memoria*: crear la organización (en clase, varios prompts del chat 02:09–02:17 pedían "despliega ahí la nueva organización") solo crea el contenedor. Falta **proyecto + tablas + RLS + backend** (§4).
- Campos del formulario *New project* (nombre, organización, contraseña de base de datos, región): **etiquetas exactas PENDIENTE DE COMPROBAR** (sin sesión). El profesor lo narró en clase: *"le está poniendo la región, la contraseña de la base de datos, está poniendo el nombre del proyecto"* (≈02:47, EN CLASE).

### 2.3 Región
Fuente: V11 (verificado 23/11/2026).
- Cada proyecto se despliega en **una región primaria**; elegir la más cercana a los usuarios.
- **No se puede cambiar** después; hay que migrar a otro proyecto.
- Regiones generales: Americas (East US, North Virginia), Europe (Central EU, Frankfurt), APAC (Southeast Asia, Singapore). Regiones específicas documentadas incluyen East US (N. Virginia/Ohio), West US (N. California/Oregón), Canadá (Central), São Paulo, Londres, Irlanda, París, Frankfurt, Zúrich, Estocolmo, Mumbai, Singapur, Tokio, Seúl, Sídney.
- **No aparece México** en la lista de regiones. Para usuarios en México la documentación no dice cuál elegir; la lista sugiere East US o West US (RECONSTRUCCIÓN PEDAGÓGICA, criterio de cercanía; no hay medición de latencia, PENDIENTE DE COMPROBAR).
- Elegir región es control de *ubicación de datos*, no prueba de cumplimiento normativo (V11).

### 2.4 Contraseña de la base de datos
Fuente: V12 (verificado 23/11/2026).
- Al crear el proyecto se define la contraseña del rol `postgres`. Usar gestor de contraseñas, ≥12 caracteres; si lleva símbolos especiales hay que **codificarlos en porcentaje** en la cadena de conexión (ej. `p%3Dword`).
- Se cambia en Dashboard > *Database Settings*; el cambio no causa caída de los servicios gestionados.
- Texto literal clave: *"You should never give this to third-party service unless you absolutely trust them."* → **no compartirla** (ni en chat, ni con un agente de IA, ni en GitHub).
- **ACLARACIÓN TÉCNICA POSTERIOR:** en clase el agente escribió la contraseña de la base de datos en la pantalla de creación (≈02:47). Es un recurso pedagógico válido para ver el flujo, pero en un proyecto real la contraseña debe generarla/guardarla una persona (gestor de contraseñas), no pasar por un chat ni un prompt. La memoria del chat **no necesita** esa contraseña: usa la Data API con RLS (§4).

---

## 3. Project URL y claves (publishable / secret vs. legacy anon / service_role)

Fuentes: V1, V2, V21. Verificado 23/11/2026.

### 3.1 Dónde encontrarlas (según docs; **sin captura con sesión**)
- **Connect dialog** del proyecto: muestra **Project URL** y la **publishable key** del framework elegido (V1).
- **Settings > API Keys**: lista **todas** las claves, incluidas las legacy. La doc subraya que **no existe una página separada "Settings > API"** (V1). (Quien siga tutoriales viejos puede no encontrarla.)
- Alternativas: `supabase projects api-keys --remote=<ref>` (CLI) o Management API con token de acceso personal (V1).
- Forma de la URL: `https://<ref-del-proyecto>.supabase.co`; la API REST cuelga de `/rest/v1/` (V10). El *Data API URL* se ve en Integrations > Data API (V10).

### 3.2 Tipos de clave (tabla oficial V1)
| Clave | Formato | Privilegios | Rol Postgres | ¿JWT? | Dónde usarla |
|---|---|---|---|---|---|
| **Publishable** | `sb_publishable_…` | Bajos | `anon` o `authenticated` | No | Navegador, móvil, código fuente, CLI. "Safe to expose online" **con RLS activo**. |
| **Secret** | `sb_secret_…` | Elevados | `service_role` (**BYPASSRLS**) | No | **Solo servidor** (backend, Edge Function, cron). |
| Legacy `anon` | JWT largo (`eyJ…`) | Bajos | anon/authenticated | Sí | Equivale a publishable. |
| Legacy `service_role` | JWT largo | Elevados | service_role | Sí | Equivale a secret. |

- *"If a tool, tutorial, or AI assistant tells you to copy a long key that begins with `eyJ`, it was written for the legacy keys."* (V1) → muchos tutoriales y asistentes de IA (incluidos los de la clase) pueden pedir la clave legacy.
- Publishable/secret se envían en el encabezado **`apikey`** (no en `Authorization: Bearer`) [V1][V2]. Con supabase-py 2.34.1 se comprobó en el cable que `apikey` lleva la publishable y `Authorization` el JWT del usuario (prueba `test_el_jwt_del_usuario_viaja_en_authorization`).
- La secret key **devuelve 401 si detecta un navegador** (por `User-Agent`) [V1][V2]. No es protección suficiente: sigue sin poder estar en frontend.
- La publishable key **no protege** contra ingeniería inversa, inspector de red, CSRF, XSS ni phishing: *"Row Level Security must do that work"* (V1).

### 3.3 Calendario de retiro de legacy — ACTUALIZACIÓN EXTERNA
- Texto oficial: *"Supabase is deprecating the `anon` and `service_role` keys by the end of 2026."* Es la **única fecha** que dan las dos páginas; **no hay fecha de retiro ni hitos intermedios** (V1, V2). Hoy es 23/11/2026: la deprecación "para finales de 2026" es inminente → **enseñar publishable/secret** y avisar de que tutoriales con `eyJ…` están desfasados.
- Crear claves nuevas **no revoca** las legacy; ambas funcionan en paralelo hasta que se desactivan en *Settings > API Keys* (paso separado, **reversible** según V2).
- Pasos de migración (V2), resumidos: (1) crear claves nuevas (se llaman `default`), (2) cambiar `anon` → publishable en frontend, (3) `service_role` → secret en servidores, (4) webhooks/`pg_net` con `apikey`, (5) Edge Functions (`SUPABASE_PUBLISHABLE_KEYS`/`SUPABASE_SECRET_KEYS`, `verify_jwt = false` o SDK `@supabase/server`), (6) verificar que nada use legacy, (7) desactivar legacy.
- Los JWT de los usuarios siguen firmados con el secreto JWT del proyecto; las claves nuevas no lo cambian (V2). Rotar firma: guía aparte de "JWT signing keys" (no leída en detalle → PENDIENTE DE COMPROBAR).
- supabase-js: el ejemplo oficial pasa `sb_publishable_…` a `createClient` en lugar de `anon`; **no declaran versión mínima** (V2). supabase-py 2.34.1 aceptó `sb_publishable_…` en `create_client` (comprobado local, sin red).

### 3.4 Qué hacer si una clave se filtra (V21)
Crear una secret nueva → reemplazarla en todos los componentes → **retirar** la comprometida (si alguien la usa activamente, retirar de inmediato). Si la comprometida es `service_role` legacy, retirar también la `anon` legacy y migrar al publishable. En la clase, el profesor **pegó la API key de OpenRouter** en Claude Code (≈02:52) — esa clave debe tratarse como expuesta y **rotarse** si el chat/pantalla se compartió (ver guía OpenRouter). Para Supabase: ninguna secret fue mostrada, hasta donde se ve en la transcripción.

---

## 4. Flujo de memoria por turnos (diseño probado)

Código: `fuentes_editables/kit_referencia/supabase_memoria/memoria.py` + `test_memoria.py`. SQL: `fuentes_editables/sql/`.

```
Navegador (frontend, publishable key)         Backend (FastAPI en Vercel, claves en variables de entorno)        Supabase (Postgres + RLS)
 1. signInAnonymously() ──► Auth ──► JWT del usuario (rol authenticated, auth.uid() = id estable)
 2. POST /chat  { mensaje, conversation_id? }
    Authorization: Bearer <JWT usuario> ──────► 3. crear_cliente_usuario(JWT)  (publishable + JWT: RLS ACTIVO)
                                                4. obtener_o_crear_conversacion()  ──► select/insert conversations  (RLS: solo las mías)
                                                5. ultimos_mensajes(N)             ──► select messages  (RLS por JOIN a mi conversación)
                                                6. construir_mensajes_openrouter(system, historial, mensaje)
                                                7. llm(messages)  ← OpenRouter (key SOLO en el backend)
                                                8. guardar_turno(user + assistant) ──► insert messages (una sentencia)  ◄── validar 2 filas devueltas
 ◄────────── respuesta + conversation_id
```
Pasos y por qué:
1. **ID de sesión = usuario de Supabase Auth.** Opción simple para el demo: *anonymous sign-in*: el usuario obtiene JWT y `auth.uid()` sin correo ni datos personales [V8]. Advertencias oficiales: el usuario anónimo **pierde su cuenta** si cierra sesión, borra datos del navegador o cambia de dispositivo [V8] — por eso a veces "la memoria desaparece" (es comportamiento esperado, no un error de la base). **Nunca** usar un ID de conversación o de usuario que el cliente pueda inventar/adivinar como única barrera: la barrera es RLS.
2. **Backend con el JWT del usuario** (no con la secret key): si el código tiene un bug, la base sigue sin entregar filas ajenas. Con secret key (`service_role`) *tu código* debe comprobar el dueño de cada fila, porque salta RLS [V1][V3]. *Matiz oficial:* una secret key salta RLS "solo cuando la petición no lleva token de usuario"; si lleva uno, aplican las políticas del usuario (V3).
3. **Leer últimos N** (`order by created_at desc limit N`, índice `(conversation_id, created_at desc)`).
4. **Armar el contexto**: solo roles `user`/`assistant` desde la BD (lo de la BD es **dato**, no instrucciones; un `system` guardado se descarta), recorte por caracteres conservando lo más reciente.
5. **Llamar al modelo.** Si falla, **no se guarda nada** (evita turnos a medias; el usuario reintenta).
6. **Guardar el turno** en **una sola sentencia** (inserción masiva = atómica) y **validar** que volvieron 2 filas; si no, `EscrituraNoVerificadaError` → el bot no debe decir "guardado". Con supabase-py el insert devuelve las filas por defecto (`returning='representation'`, V18; comprobado en cable: `Prefer: return=representation`); en **supabase-js no** (hay que encadenar `.select()`, V17). Para devolver filas hace falta política `select` (la hay en `02`).

### 4.1 Contexto largo, vencimiento y borrado
- **Contexto largo:** (a) ventana de últimos N mensajes (implementado); (b) tope de caracteres (implementado, `max_caracteres`); (c) *resumen periódico* que se guarda como mensaje de sistema **generado por el servidor** — opción de diseño, **no implementada ni probada** (RECONSTRUCCIÓN PEDAGÓGICA). Cada mensaje está limitado a 4 000 caracteres por `CHECK`.
- **Vencimiento / retención:** `purgar_conversaciones_antiguas(dias)` (`01_schema_memoria.sql`) borra conversaciones sin actividad y sus mensajes por `ON DELETE CASCADE`; solo la puede ejecutar `service_role`/administrador (`REVOKE` a clientes; probado: `authenticated` recibe 42501). Programarla con `pg_cron` está en la doc de Cron [V23] — **no probado**. Usuarios anónimos: *"Automatic cleanup of anonymous users is currently not available"*; la doc ofrece un `delete from auth.users where is_anonymous is true and created_at < now() - interval '30 days'` [V8] (ejecutar con cuidado: borra también sus conversaciones por cascada; no probado contra `auth.users` real).
- **Borrado a petición:** el usuario puede borrar su conversación (política `delete`); los mensajes caen en cascada (probado T60–T62). Los pedidos sobreviven con `conversation_id = NULL` (`ON DELETE SET NULL`), decisión de diseño: las solicitudes del negocio no desaparecen al borrar el chat; si se exige borrado total, cambiar a `CASCADE`.
- **Límite del plan Free:** 500 MB de base de datos [V6]; no hay cifra documentada de "mensajes por MB".
- **Abuso de inicio anónimo:** como esos usuarios se guardan en la base, la doc recomienda activar **CAPTCHA invisible o Cloudflare Turnstile**, y existe un **límite por IP de 30 solicitudes por hora** (modificable en el Dashboard) [V8]. *Inferencia (no probada):* un grupo en la misma red/IP podría toparse con ese límite al iniciar sesión anónima todos a la vez → para práctica grupal, escalonar o usar cuentas por correo.

### 4.2 Código de ejemplo (supabase-js, formas verificadas en V17/V8)
```js
// Frontend (navegador): solo clave PUBLISHABLE. Nunca la secret.
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) // valores desde variables de entorno del build; sin secretos
const { data: { session } } = await supabase.auth.signInAnonymously()  // V8
const token = session.access_token                                      // se envía al backend en Authorization: Bearer
// insert en supabase-js: por defecto NO devuelve filas; encadenar .select() si se necesitan (V17)
const { data, error } = await supabase.from('conversations').insert({ channel: 'web' }).select()
```
*Nota:* el frontend *puede* hablar directo con la base gracias a RLS; el patrón de la clase (chat → backend FastAPI → OpenRouter) es necesario porque **la clave de OpenRouter debe vivir en el backend**. El backend reenvía el JWT para que RLS siga aplicando.

---

## 5. Pedidos y reservas: DEMO vs. confirmados

- **Regla (megaprompt §8.7):** el chatbot **no puede afirmar "confirmado"** sin una **escritura real validada**; en un negocio real además debe comprobar cupo, catálogo, precio y disponibilidad. En el demo: estado **`solicitud_demo`** y **no se procesa dinero**.
- **Hecho en clase (DEMO SIMULADA):** el agente respondió *"Okay, anotado en tu pedido… Perfecto, ya está anotado"* y luego admitió *"ya no tiene a la vista los platillos que llevabas"* (≈02:05–02:10). Es la prueba viva de que **una respuesta generativa ≠ pedido guardado**. En ese momento no existía ninguna tabla de pedidos.
- **Diseño en SQL:** `orders`/`reservations` tienen `estado` con valores `solicitud_demo | confirmado | cancelado`; la política de INSERT del cliente exige `estado = 'solicitud_demo'` y **no existe UPDATE** para `authenticated`. Probado: T08/T09 (el cliente no puede insertar `confirmado`) y T15 (no puede actualizar); T51 (`service_role` sí puede pasar a `confirmado` → ese es el papel del backend/personal).
- **Frase correcta del bot:** "Registré tu **solicitud DEMO** (id …). Un integrante del equipo la revisará." — generada **a partir de la fila devuelta** por `crear_solicitud_reserva_demo()`, nunca antes de que la escritura se valide.
- **Privacidad:** no pedir DNI, tarjeta ni datos bancarios; en el esquema no hay columnas de nombre/teléfono (solo `notas` opcional ≤500 caracteres; aconsejar no escribir datos personales).
- `total` en `orders` lo manda el cliente en el demo; en un negocio real debe **calcularlo el servidor desde el catálogo** (no probado, solo recomendación).

---

## 6. RLS: diseño, pruebas positivas/negativas y cómo se lee un fallo

Fuentes: V3, V5, V4 (verificado 23/11/2026). Resultados: `evidencias_qa/supabase_sql_pruebas.md`.

### 6.1 Modelo
- 5 tablas con **RLS activado**: `conversations`, `messages`, `orders`, `order_items`, `reservations`.
- Políticas **una por operación** (la doc lo recomienda; Postgres no admite varias operaciones en un `for`), `to authenticated`, con `(select auth.uid())` para que se evalúe una vez por consulta (se observó `InitPlan` en `EXPLAIN`; V3 explica el motivo).
- `messages` y `order_items` autorizan **por JOIN** a su conversación/pedido propio.
- **Grants explícitos de mínimo privilegio** (no depender de los defaults): `anon` sin ningún permiso; `authenticated` solo lo necesario; `service_role` todo.
- `01` y `02` son idempotentes y compatibles con `00_primera_practica_simple.sql`.

### 6.2 Resultados de las pruebas (PostgreSQL 16.15 local, 23/11/2026)
| Escenario | Resultado |
|---|---|
| Primera práctica (`00` + `00b`) | **7/7** |
| Esquema completo, privilegios por defecto = todo concedido (peor caso de proyectos existentes) | **57/57** |
| Idempotencia `00` → `01` → `02` → `03` | **57/57** |
| Sin grants automáticos (comportamiento nuevo que anuncia la doc) | **57/57** |
| **Control negativo:** RLS apagado en `messages` + grant a `anon` | **49/57 → 8 fallos esperados** (la prueba sí detecta la fuga) |

Pruebas clave: A inserta conversación y mensajes y los lee (T01–T07); **B no ve** nada de A (T20–T23), **no puede insertar** en la conversación de A (T24 → 42501), **no borra** nada de A (T27/T28 → 0 filas sin error); **anon sin sesión** recibe `permission denied` (T40–T41) y, aun con un grant accidental, 0 filas (T42); sesión caducada (`auth.uid()` NULL) ve 0 y no inserta (T43/T44); `service_role` ve todo (T50: por eso la secret key es peligrosa).

### 6.3 Cómo se manifiestan los fallos (observado + V3/V5)
| Situación | Qué ocurre | Evidencia |
|---|---|---|
| **Falta un grant** | Error `42501 permission denied for table …` *antes* de evaluar políticas | T15, T40; V5/V19 |
| **INSERT que viola `WITH CHECK`** | Error `42501 new row violates row-level security policy` (**no es silencioso**) | T08–T10, T24 |
| **SELECT/UPDATE/DELETE filtrado por `USING`** | **0 filas, sin error** (este es el "silencio") | T20–T23, T27–T28; V3 |
| **`auth.uid()` es NULL** (sin sesión/expirada) | `null = owner_id` nunca es verdadero → 0 filas; la doc avisa que "falla silenciosamente" | T43; V3 |
| **UPDATE necesita política SELECT** | Sin SELECT, el UPDATE "no funciona como se espera" | V3 |
| **CHECK constraint** | `23514` | T11–T14 |

> **Corrección importante a una creencia común** ("RLS bloquea inserts silenciosamente"): lo que se bloquea *en silencio* son lecturas/actualizaciones/borrados; un INSERT rechazado **lanza error**. Pero un cliente de bajo nivel que no revise el error o un bug que ignore `data` vacío sí puede *parecer* silencioso → por eso `memoria.py` valida las filas devueltas.

- **Defaults de la plataforma:** en proyectos **existentes**, las tablas nuevas de `public` reciben todos los privilegios para `anon`, `authenticated` y `service_role`, y *añadir políticas no los quita* [V3][V5]. Supabase anuncia que **cambiará el default** a opt-in (existe el ajuste "Automatically expose new tables" en Integrations > Data API) [V5]. Por eso `02` hace `REVOKE` + `GRANT` explícitos.
- **Vistas** saltan RLS por defecto: crear con `security_invoker = true` (Postgres 15+) [V3]. No hay vistas en este esquema.
- **Funciones** en `public`: Postgres da `EXECUTE` a `PUBLIC` por defecto [V5]; por eso la función de purga lleva `REVOKE … FROM public, anon, authenticated` (probado T15b).
- **Usuarios anónimos:** usan rol `authenticated` y llevan el claim `is_anonymous`; para exigir cuenta permanente: política **restrictive** con `(select (auth.jwt()->>'is_anonymous')::boolean) is false` [V8]. Probado ad hoc (anónimo rechazado, permanente aceptado).
- **Tabla creada desde el Dashboard** (Table Editor) → Supabase **habilita RLS por ti**; creada con SQL → **tú** debes hacerlo [V13]. Con RLS y sin políticas la Data API devuelve 0 filas, mientras que el SQL Editor (rol dueño) sí ve todo — fuente típica de confusión [V13].
- **Seguridad:** **no desactivar RLS para arreglar un fallo** [V3][V4].

### 6.4 Prueba real recomendada para el alumno (PENDIENTE DE COMPROBAR en proyecto real)
Dos navegadores/ventanas privadas distintos → dos usuarios anónimos → en A escribir "mi nombre es X"; en B preguntar "¿cómo me llamo?" → B **no** debe saber; recargar A → A **sí** conserva. Mirar en *Table Editor* que hay dos `owner_id` distintos. (Se omite la inserción manual en `auth.users`: su viabilidad en Supabase real **no está verificada**.)

---

## 7. Herramientas del Dashboard (según docs; sin captura con sesión)

- **SQL Editor:** pegar y ejecutar el SQL (se usa en los quickstarts oficiales) [V14]. Corre como el rol dueño → **no está sujeto a RLS**, por eso "en el editor sí veo los datos pero en la app no" [V13].
- **Table Editor:** *New table* → nombre + columnas; al guardar desde aquí RLS se activa automáticamente [V13]. Permite *Insert > Import data from CSV* [V16].
- **Importar CSV/Excel (actividad complementaria):** el Dashboard acepta CSV con límite de **100 MB** y sirve para datos pequeños; para producción grande hay `pgloader`, `COPY` o la API [V16]. Validar tipos, duplicados (PK/UNIQUE) y permisos (RLS/grants) antes de importar; Excel debe exportarse a CSV primero (no hay importación .xlsx documentada en V16). Un CSV importado desde el Dashboard lo ejecuta el rol dueño: **no pasa por RLS**; el campo `owner_id` hay que traerlo en el CSV o asignarlo después.
- **Logs:** *Logs* filtra por tipo (API Gateway, Postgres, Auth, Storage, PostgREST, Edge Function, Realtime, pooler), nivel, **estado HTTP o SQLSTATE**, método, ruta, y usuario [V15]. Para depurar permisos: filtrar SQLSTATE `42501`; V19 ofrece una consulta de logs de Postgres para ese código. Retención en Free: **1 día** [V6] — hay que depurar el mismo día.
- **API Keys / Connect:** ver §3. **Auth > Providers:** habilitar *Anonymous sign-ins* (enlace del Dashboard en V8; ruta/etiqueta exacta PENDIENTE DE COMPROBAR).

---

## 8. Errores frecuentes y diagnóstico (cada uno: síntoma → causa → qué hacer)

| # | Síntoma | Causa probable | Qué hacer | Fuente / estado |
|---|---|---|---|---|
| 1 | **"Credencial no válida / inválida"** al iniciar sesión en el *Dashboard* (Alumna E, EN CLASE: reportado ≈02:30 y explicado ≈02:45) | La cuenta se creó con un método (p. ej. Google/GitHub/ChatGPT) y se intenta entrar con otro (correo+contraseña), o contraseña guardada que no corresponde. **No se puede determinar la causa exacta desde la transcripción.** | Entrar con **el mismo método con el que se registró**; si fue correo: "Forgot password?"; probar ventana privada; no crear otra cuenta con el mismo correo. | Opciones visibles: captura V24. Causa = RECONSTRUCCIÓN PEDAGÓGICA (hipótesis); cómo recuperar cuenta: PENDIENTE DE COMPROBAR |
| 2 | **"Invalid API key" / JWT inválido o caducado** al llamar a la API | Clave mal copiada, clave legacy desactivada, URL de otro proyecto, o JWT de usuario vencido | Volver a copiar URL+publishable desde *Connect*; comprobar que no se desactivaron las legacy mientras algo las usa (V2); reiniciar sesión del usuario | V1, V2 |
| 3 | **Proyecto pausado** | Plan Free: *"paused after 1 week of inactivity"*; límite de 2 proyectos activos | Entrar al Dashboard y **restaurar** (un clic según V20); los pausados no cuentan para el límite (V7); proyectos de pago no se pausan | V6, V7, V20. **Inconsistencia de la doc:** el texto dice *ventana de restauración de 1 año*, pero la imagen de la misma página se titula "90 Days Remaining" → **PENDIENTE DE COMPROBAR** cuál es vigente. Tiempo de "despertar": no documentado |
| 4 | **`permission denied for table x` / 42501** | Falta `GRANT` al rol (o schema no expuesto) | `grant select, insert … to authenticated;` y **mantener RLS**; el error trae una *hint* con el GRANT exacto | V5, V19; probado T15/T40 |
| 5 | **Consulta devuelve `[]` y no hay error** (RLS) | Sin sesión (`auth.uid()` NULL), política inexistente o `owner_id` distinto; en SQL Editor sí se ven filas | Verificar que la petición lleva el JWT; revisar políticas `to authenticated`; probar con rol impersonado; **no** desactivar RLS | V3, V13; probado T20–T23, T43 |
| 6 | **Insert falla con "violates row-level security policy"** | `owner_id` ≠ `auth.uid()` o `estado` distinto de `solicitud_demo` | No enviar `owner_id` (la BD lo pone); enviar solo valores permitidos | probado T08–T10 |
| 7 | **El insert "funciona" pero no se ve la fila / `data` vacío** | En supabase-js no se devuelven filas por defecto; o falta política SELECT; o filas filtradas | Encadenar `.select()` (JS); revisar política SELECT; validar `data` | V17, V18, V3 |
| 8 | **No aparece el proyecto en el Dashboard** | *(hipótesis, no verificables sin sesión)* otra cuenta/método de acceso, otra **organización** seleccionada, proyecto aún creándose, o no se llegó a crear (solo la organización) | Confirmar con qué cuenta entras; revisar el selector de organización; recordar que **crear organización ≠ crear proyecto**; esperar a que termine la creación | RECONSTRUCCIÓN PEDAGÓGICA; PENDIENTE DE COMPROBAR |
| 9 | **"La memoria se borró"** al volver | Usuario anónimo perdido (cierre de sesión, datos del navegador borrados, otro dispositivo) | Explicarlo; para persistencia entre dispositivos, vincular correo/OAuth | V8 |
| 10 | **Latencia alta** | Región lejana al backend/usuario (no se puede cambiar); CPU compartida del plan Free; cada turno hace 3 consultas + 1 llamada al modelo (el modelo suele dominar); primer acceso tras pausa | Elegir región cercana al backend; reducir N; medir por separado BD vs. modelo | V11, V6; **sin mediciones propias** → PENDIENTE DE COMPROBAR |
| 11 | **"Los datos no se sincronizan"** | No es Realtime: el chat lee al cargar; filas del usuario equivocado; caché del navegador; la app apunta a otro proyecto/URL | Recargar, comparar `owner_id`, revisar la URL del proyecto, mirar *Logs* | V15 |
| 12 | **Free: 429 al crear usuarios anónimos** *(inferencia)* | Límite por IP de 30/hora | CAPTCHA + escalonar; o cuentas por correo | V8 (límite); efecto en clase = inferencia |
| 13 | **Respuestas "estafa"/sitio falso** al buscar Supabase | Anuncios patrocinados (el profesor lo advirtió, ≈02:44, EN CLASE) | Entrar solo por `supabase.com` / `supabase.com/dashboard` | EN CLASE |

---

## 9. Seguridad y privacidad (Supabase)

1. **Claves:** publishable en frontend; secret **solo servidor**; nada en chats, prompts, capturas, repositorios ni URL; no registrar claves (ni "inválidas"); si se filtra, rotar (V1, V21). Plantilla: `.env.example` (campos vacíos).
2. **RLS siempre activo** y mínimo privilegio; **no usar `service_role` para el chat**; revisar el *Security Advisor* del Dashboard que cita V1 (ruta exacta PENDIENTE DE COMPROBAR).
3. **Contraseña de la BD:** no compartirla con terceros ni con agentes (V12).
4. **Datos personales:** el demo no pide DNI, tarjeta ni datos bancarios; `notas` libres pueden contener datos personales → aviso y límite de 500 caracteres. No usar nombres ni teléfonos de alumnos en datos de prueba.
5. **Retención y borrado:** política de N días + función de purga + derecho a borrar la conversación; los **backups** y logs tienen su propia retención (backups automáticos **no incluidos** en Free; logs 1 día — V6).
6. **Datos hacia terceros:** cada turno se envía al router/proveedor de modelos: la memoria guardada en Supabase **no** impide que el texto viaje a OpenRouter y al proveedor; revisar sus políticas de datos (ver guía OpenRouter). *API en la nube ≠ procesamiento local.*
7. **Vistas y funciones** nuevas deben nacer con RLS/`security_invoker`/`REVOKE` (V3, V5).
8. **Prompt injection vía historial:** el contenido guardado es dato no confiable; `memoria.py` descarta roles `system` guardados y no ejecuta contenido.

---

## 10. Aclaraciones respecto a la clase (sin ridiculizar; cada una con fuente)

| Qué se vio/dijo el 22/11 (EN CLASE) | Aclaración / actualización | Etiqueta y fuente |
|---|---|---|
| "Supabase empaqueta autenticación, base de datos, funciones y datos en tiempo real" (≈02:00). | Correcto. Además incluye Storage, Vector y Cron. | EN CLASE; confirmado V9, captura home |
| Cifras del plan Free: 50 000 usuarios activos, 500 MB de base de datos, 5 GB de egress/caché, 1 GB de archivos, Pro de 25 USD; "API requests ilimitadas" (≈02:00). | **Coinciden** con la página de precios de hoy: 50 000 MAU, 500 MB, 5 GB egress, 5 GB egress en caché, 1 GB, Pro desde 25 USD/mes, "Unlimited API requests". **Faltó mencionar** (importante para la práctica): *Free se pausa tras 1 semana sin actividad* y *máximo 2 proyectos activos*; sin backups automáticos; logs 1 día. "Ilimitadas" se refiere a peticiones, **no** a datos: hay tope de egress y almacenamiento. | ACTUALIZACIÓN EXTERNA; V6 |
| Analogía: "la API request es lo mismo que con OpenRouter" (≈02:00). | Conviene distinguir: en Supabase la **Data API** (PostgREST) lee/escribe tus tablas; en OpenRouter la API pide respuestas a modelos y **cuesta/consume cuota**. Se parecen en usar una clave, no en el tipo de recurso. | ACLARACIÓN TÉCNICA POSTERIOR; V10 |
| "Inicien sesión con Google, GitHub o correo" (≈02:10–02:15). | La pantalla pública de hoy muestra GitHub, **ChatGPT**, SSO y correo/contraseña; **no se vio Google**. | ACTUALIZACIÓN EXTERNA; captura V24 |
| "Credencial no válida" (Alumna E): el profesor entró con ChatGPT y le funcionó (≈02:45–02:50). | Regla práctica: entrar con **el mismo método** del registro; ver tabla §8-1. | ACLARACIÓN TÉCNICA POSTERIOR; RECONSTRUCCIÓN PEDAGÓGICA |
| Prompts: "añade Supabase para la memoria… abre en el navegador Supabase y déjame iniciar sesión… despliega toda la memoria" (chat 02:09, 02:11, 02:13, 02:16: "despliega ahí la nueva organización"). | Los prompts piden **crear proyecto/organización y memoria** en un paso. Para el alumno principiante conviene separar: (1) cuenta, (2) proyecto, (3) SQL 00, (4) comprobar RLS, (5) backend. Ver "Prompt mejorado" abajo. **Crear organización no es memoria.** | PROMPT MEJORADO; megaprompt §8 |
| El agente creó el proyecto "puerto AM landing", región y **contraseña de base de datos** por el navegador (≈02:47). | Útil como demostración; en la práctica real la contraseña la define y guarda la persona. | ACLARACIÓN TÉCNICA POSTERIOR; V12 |
| En la prueba final (≈02:50): "¿cuál es tu menú? … Okay, todavía no" y se pegó la API en Claude Code "porque a veces la API no viaja" (≈02:52); backend en Vercel aún pendiente (≈02:55). | **La memoria con Supabase no quedó demostrada funcionando en vivo.** El flujo completo (proyecto + tablas + RLS + backend + prueba de dos usuarios) queda como tarea de la siguiente clase. | EN CLASE; ESTADO REAL |
| "ChatGPT no te permite desplegar la base de datos… ninguna IA añade una base de datos por sí sola" (≈02:15–02:20). | Matiz: una IA/agente **sí puede** ejecutar el SQL o crear el proyecto **si tiene acceso** (conector, navegador con sesión, CLI/token); lo que no hace sola es crear la cuenta ni el proyecto sin permisos. El chat de ChatGPT, sin conector, solo produce el SQL que tú ejecutas. | ACLARACIÓN TÉCNICA POSTERIOR (sin fuente única; es consecuencia de V1/V22: la creación requiere sesión/token) |
| "Tareas programadas con Chrome" (≈02:00). | Probablemente *Cron* (V23). No verificado en detalle. | PENDIENTE DE COMPROBAR |
| "Claves anon/service_role" no se mencionaron en clase. | **Hoy** las claves legacy están en deprecación "para finales de 2026"; la guía usa publishable/secret. | ACTUALIZACIÓN EXTERNA; V1, V2 |

**PROMPT MEJORADO (paso a paso, para OpenCode/Claude Code/ChatGPT):**
> "Voy a crear la memoria de mi chatbot de Puerto A&M (demo ficticio). **Paso 1:** NO crees nada todavía; explícame qué necesito tener hecho en Supabase (cuenta, proyecto, región). **Paso 2:** dame el SQL de dos tablas, `conversations` y `messages`, con `owner_id uuid default auth.uid()`, RLS activo y políticas `to authenticated` con `(select auth.uid())`, sin tocar `service_role`. **Paso 3:** dame una prueba con dos usuarios para comprobar que uno no ve la conversación del otro. **Reglas:** no me pidas pegar claves en el chat; las claves van en variables de entorno del backend; usa la clave *publishable* en el frontend y nunca la *secret*; no desactives RLS. Pídeme confirmación antes de cada acción que cree o borre datos."

---

## 11. Ejercicios propuestos (acumulativos) — RECONSTRUCCIÓN PEDAGÓGICA

**A) El chat se reinicia y conserva memoria autorizada.**
- *Estado inicial:* proyecto Supabase creado, SQL `00` ejecutado, *Anonymous sign-ins* activado, backend con `memoria.py`.
- *Acciones:* abrir la página, decir "me llamo …, quiero 10 tostadas de atún"; recargar; preguntar "¿qué pedí?".
- *Salida esperada:* el bot cita el pedido (viene de `messages`). En una ventana privada, el bot **no** sabe nada.
- *Diagnóstico:* ver §8 filas 2, 4, 5, 7, 9.
- **Estado:** PENDIENTE DE COMPROBAR en proyecto real (solo se probó la lógica y el SQL localmente).

**B) El dashboard lee tablas y actualiza indicadores sin exponer datos privados.**
- Crear una **vista agregada** (p. ej. conteo de solicitudes por día) con `security_invoker = true` o una función `security definer` que devuelva solo agregados; dar `select` solo a lo necesario. Los indicadores no deben incluir `notas`.
- No implementado ni probado en este paquete → PENDIENTE DE COMPROBAR. (Cuidado: las vistas saltan RLS por defecto — V3.)

**C) (Complementaria) Importar un CSV.** Exportar el Excel de demo a CSV, importarlo con *Insert > Import data from CSV* en una tabla de prueba (no de producción), comprobando tipos, duplicados y que la tabla tiene RLS. Límite del Dashboard: 100 MB (V16).

---

## 12. Capturas reales (públicas, sin sesión) — 1280×800, deviceScaleFactor 2

Carpeta: `recursos_visuales/capturas/` (tomadas con Playwright el 23/11/2026; PNG de 2560×1600).
| Archivo | URL | Contenido verificado visualmente |
|---|---|---|
| `supabase_home.png` | https://supabase.com/ | "Build in a weekend / Scale to millions", botones *Sign in* y *Start your project*, tarjetas Postgres/Auth/Edge Functions |
| `supabase_dashboard_signin_vacio.png` | https://supabase.com/dashboard/sign-in | "Welcome back": GitHub, ChatGPT, SSO, correo/contraseña (vacío) |
| `supabase_dashboard_signup_vacio.png` | https://supabase.com/dashboard/sign-up | "Get started": mismas opciones (vacío) |
| `supabase_docs_api_keys.png` | https://supabase.com/docs/guides/getting-started/api-keys | "API keys", *Updated Nov 18, 2026* |
| `supabase_docs_rls.png` | https://supabase.com/docs/guides/database/postgres/row-level-security | "Row Level Security", *Updated Nov 19, 2026*, aviso rojo sobre tablas sin RLS |
| `supabase_pricing.png` | https://supabase.com/pricing | Free $0, Pro desde $25, Team desde $599; *"Free projects are paused after 1 week of inactivity. Limit of 2 active projects."* |

Nota de privacidad: las pantallas de acceso muestran una reseña de terceros (cita pública del sitio) y **no** contienen cuentas ni correos. Si se publican en PDF, citar la URL. **NO capturadas (requieren sesión; no se inventan):** *New project*, SQL Editor, Table Editor, API Keys, Auth settings, Logs. Para esas pantallas usar una *ilustración esquemática rotulada* "Ilustración esquemática; la interfaz puede variar" con los campos de §2.2, §3.1 y §7.

---

## 13. Entregables de este agente

| Ruta (bajo `$R`) | Qué es | Estado |
|---|---|---|
| `fuentes_editables/sql/00_primera_practica_simple.sql` | Solo `conversations` + `messages` + grants + RLS (para principiantes) | Probado (E1, E3) |
| `fuentes_editables/sql/01_schema_memoria.sql` | Esquema completo + trigger + función de purga | Probado (E2–E4) |
| `fuentes_editables/sql/02_rls_politicas.sql` | RLS, grants mínimos, políticas | Probado (E2–E4) |
| `fuentes_editables/sql/03_pruebas_aislamiento.sql` (+ `_helpers_pruebas.sql`, `00b_prueba_simple_aislamiento.sql`) | 57 + 7 pruebas | 57/57 y 7/7 |
| `fuentes_editables/sql/_emulacion_supabase_SOLO_PARA_PRUEBAS_LOCALES.sql` | Emulación mínima (NO para Supabase real) | — |
| `fuentes_editables/kit_referencia/supabase_memoria/{memoria.py,test_memoria.py,.env.example,requirements.txt}` | Backend de referencia + pruebas + plantilla de entorno | 18 pruebas OK |
| `evidencias_qa/supabase_sql_pruebas.md` | Salidas reales de las pruebas | — |
| `recursos_visuales/capturas/supabase_*.png` | 6 capturas públicas | verificadas visualmente |

## 14. Resumen de PENDIENTE DE COMPROBAR
1. Ejecución del SQL y de `memoria.py` en un **proyecto Supabase real** (Data API/PostgREST, GoTrue, JWT firmados).
2. Etiquetas exactas de *New project*, *Settings > API Keys*, *Auth > Providers/Anonymous*, Logs, Security Advisor.
3. Si el botón **Google** aparece en el sign-in en otros contextos.
4. Ventana de restauración de proyectos pausados (**1 año** en el texto vs. **90 días** en la imagen de la misma página) y tiempo de reactivación.
5. Región recomendable para México (no figura; falta medir latencia).
6. Inserción manual en `auth.users` real; `pg_cron`; limpieza de usuarios anónimos en `auth.users` real.
7. Rotación de la firma de JWT (guía aparte), calendario de retiro real de legacy (la doc solo dice "finales de 2026").
8. Ejercicio B (vista agregada para dashboard), resumen de contexto largo, importación CSV real.
9. Cómo recuperar acceso a una cuenta del Dashboard ante "credencial no válida" (no hay documentación consultada específica).
