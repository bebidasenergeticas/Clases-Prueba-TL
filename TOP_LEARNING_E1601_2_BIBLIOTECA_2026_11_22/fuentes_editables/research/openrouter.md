# OpenRouter — investigación oficial para la Guía PDF 01

**Fecha de verificación:** 23 de noviembre de 2026 (la clase fue el 22/11/2026).
**Método:** lectura de la documentación oficial publicada en `openrouter.ai/docs` (versión `.md` de cada página), consulta del endpoint público `GET /api/v1/models`, capturas reales de páginas públicas con Playwright y pruebas HTTP reales SIN clave / con claves falsas (ver `evidencias_qa/openrouter_pruebas.md`).
**No se tuvo API key ni sesión iniciada.** Todo lo que requiere cuenta (pantallas de registro, "Keys", "Settings") se describe a partir de la documentación y queda marcado.

> Convención de citas: cada afirmación termina con `[Sx]` = fuente de la tabla de abajo, y **todas fueron verificadas el 23/11/2026** (“verificado 23/11/2026”). Si una afirmación no tiene `[Sx]` es una observación propia de esta sesión y se indica cómo se obtuvo.

## Fuentes oficiales consultadas (todas verificadas 23/11/2026)

| ID | URL |
|----|-----|
| S1 | https://openrouter.ai/docs/quickstart |
| S2 | https://openrouter.ai/docs/faq |
| S3 | https://openrouter.ai/docs/api_reference/limits |
| S4 | https://openrouter.ai/docs/api_reference/authentication |
| S5 | https://openrouter.ai/docs/api_reference/errors-and-debugging |
| S6 | https://openrouter.ai/docs/guides/routing/model-variants/free |
| S7 | https://openrouter.ai/docs/guides/routing/routers/free-router |
| S8 | https://openrouter.ai/docs/guides/routing/model-fallbacks |
| S9 | https://openrouter.ai/docs/app-attribution |
| S10 | https://openrouter.ai/docs/guides/privacy/data-collection |
| S11 | https://openrouter.ai/docs/guides/privacy/provider-logging |
| S12 | https://openrouter.ai/docs/guides/features/zdr |
| S13 | https://openrouter.ai/docs/guides/features/input-output-logging |
| S14 | https://openrouter.ai/docs/guides/overview/auth/security-settings |
| S15 | https://openrouter.ai/docs/guides/overview/auth/management-api-keys |
| S16 | https://openrouter.ai/docs/api_reference/models |
| S17 | https://openrouter.ai/docs/guides/routing/provider-selection |
| S18 | https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion (esquema OpenAPI de `POST /chat/completions`) |
| S19 | https://openrouter.ai/pricing |
| S20 | https://openrouter.ai/collections/free-models |
| S21 | https://openrouter.ai/privacy (Privacy Policy, “Last Updated: August 31, 2026”, visto en captura) |
| S22 | https://openrouter.ai/api/v1/models (catálogo público en vivo) |
| S23 | https://openrouter.ai/docs/guides/features/zero-completion-insurance |
| S24 | https://openrouter.ai/docs/llms.txt (índice de la documentación) |

Nota: `https://openrouter.ai/developers` (ruta citada en el megaprompt §11) responde 200 y sigue existiendo; la documentación técnica vigente vive en `/docs`. Observado en esta sesión.

---

## 1. Conceptos (con definiciones propias basadas en la documentación)

| Término | Definición para el alumno | Fuente |
|---|---|---|
| **OpenRouter** | Servicio con un solo punto de acceso (API) a cientos de modelos de IA de distintos laboratorios; “OpenRouter gives you access to hundreds of AI models through a single API endpoint”. La home y la tabla de precios hablan de “600+ models”. | [S1] [S19] |
| **Proveedor (provider)** | Empresa que *hospeda y ejecuta* un modelo (p. ej. un mismo modelo puede ser servido por varios proveedores). OpenRouter “routes your request to one of them” y cambia de proveedor automáticamente si falla. | [S2] ("How does model fallback work…") y captura `openrouter_03` |
| **Modelo** | El “cerebro” concreto, identificado por un ID `laboratorio/nombre` (ej. `google/gemma-4-31b-it:free`). | [S16] [S22] |
| **Endpoint** | Dirección URL de la API a la que se envía la petición. Para chat: `https://openrouter.ai/api/v1/chat/completions`. (En OpenRouter “endpoint” también se usa para la pareja modelo+proveedor: `/api/v1/models/{id}/endpoints`.) | [S2] [S18] [S22] |
| **API key** | Cadena secreta que identifica tu cuenta. Formato: `sk-or-v1-` + 64 hexadecimales (73 caracteres). Se envía como `Authorization: Bearer <clave>`. | [S4] |
| **Token** | Unidad en que el modelo lee/escribe texto y en que se mide el precio; el precio se muestra por millón de tokens, normalmente distinto para prompt (entrada) y completion (salida). | [S2] ("How do I get billed…") |
| **Contexto (context_length)** | Máximo de tokens (entrada + salida) que un modelo maneja en una petición; viene en el catálogo. Superarlo da error 400 `context_length_exceeded`. | [S22] [S5] |
| **Router** | Un “modelo” especial que elige por ti otro modelo. `openrouter/free` elige al azar entre los modelos gratuitos disponibles que soporten lo que pide tu solicitud. | [S7] |
| **Variante `:free`** | Sufijo del ID: una versión gratuita del modelo, con su propio precio 0, contexto y límites. | [S6] |
| **Créditos** | Saldo prepagado en dólares; cada petición de pago descuenta su costo. | [S2] ("What purchase options exist?") |
| **Interfaz web vs API** | La web (chat de OpenRouter, listado de modelos) funciona con sesión (cookies); la API usa clave en el encabezado. “OpenRouter uses three authentication methods: cookie-based…, API keys…, Management API keys”. No se instala nada en la computadora. | [S2] ("What authentication methods are supported?") |

> **Aclaración técnica (para PDF):** OpenRouter no es un programa que se instale; es un sitio web + una API. (Un participante dijo en clase “no lo tengo instalado” → ver §13.)

---

## 2. Registro de cuenta

**Lo que dice la documentación**
- “To get started, create an account and add credits on the Credits page… Once you have credits you can either use the chat room, or create API keys.” [S2] — la FAQ habla de añadir créditos, pero también:
- “All new users receive a small free allowance to test out OpenRouter. There are many free models available…” [S2] ("What free tier options exist?").
- La documentación **no describe** los métodos de inicio de sesión (Google/GitHub/correo). Lo único que menciona: autenticación por cookie para la web y para el chat [S2], y que existe un inicio de sesión OIDC emitido por `clerk.openrouter.ai` [S4].

**Lo observado en esta sesión**
- La página pública muestra botones **“Sign in”** y **“Sign up”** y, en la home, **“Get API key”** (captura `openrouter_01_home.png`).
- No pude abrir el formulario de registro: el widget de inicio de sesión se carga desde `clerk.openrouter.ai`, bloqueado por el proxy del entorno de trabajo (los scripts de ese host fallan con `ERR_TUNNEL_CONNECTION_FAILED`). **PENDIENTE DE COMPROBAR:** qué proveedores de identidad se ofrecen hoy (Google, GitHub, correo) y qué ocurre al entrar con Google/GitHub (cuenta única por correo, etc.).
- EN CLASE (01:05–01:10): el profesor indicó que se puede iniciar sesión “con su Google en un click”. Esto no se pudo contrastar con la interfaz de hoy → **PENDIENTE DE COMPROBAR**.
- Para el diseñador: esquema rotulado “Ilustración esquemática; la interfaz puede variar”: [Home → Sign up → elegir método de acceso → verificar correo si aplica → panel]. No fingir pantalla real.

---

## 3. Creación de API key (paso a paso según la documentación; sin capturas porque requiere sesión)

Ruta documentada: **https://openrouter.ai/keys** (“API keys page”) [S4]. Gestión/seguridad: https://openrouter.ai/settings/keys y https://openrouter.ai/settings/security [S4] [S14].

Pasos (texto para esquema rotulado):
1. Iniciar sesión → abrir **Keys** (desde la home, “Get API key”; o `openrouter.ai/keys`). [S4]
2. **Crear una clave nueva.** “Give it a name and choose a credit limit (or no limit).” [S4] La interfaz de hoy, según la clase, también pedía **expiración** (EN CLASE 01:06–01:08: nombre, expiración, crédito límite) y la documentación de seguridad confirma que las claves pueden tener expiración: “create a new key with an expiration”. [S14]
3. **Nombre:** libre; sirve para identificar en qué app/clase se usa. (EN CLASE: “clase E1601.2”.) [observación de clase]
4. **Límite de crédito:** tope de gasto de la clave; reinicio configurable `daily`/`weekly`/`monthly` o nunca (campo `limit_reset`). “Once a key has used its credit limit, requests with it are rejected until you raise the limit… or, for a daily, weekly, or monthly limit, until the limit resets.” [S4] [S3] [S15 ejemplo de campos]
   - Recomendación oficial: **“We recommend setting a credit limit on every key. A key with no limit lets a leaked key or a runaway agent spend your entire balance, including any auto top-ups.”** [S4]
5. **Expiración:** “You can't change the expiration of an existing key. To replace a key, create a new key with an expiration, move your apps to it, and then disable or archive the old key.” [S14] Existe además una política de cuenta: “maximum key lifetime” en https://openrouter.ai/settings/privacy [S14]. Las claves creadas durante el onboarding tienen un límite de US$100 y caducan a los 180 días. [S4]
6. **Copiar la clave cuando se muestra.** Para claves de gestión la documentación dice literalmente “Copy the key when it is shown. You will not be able to see it again” [S15]. Para claves normales no encontré la frase literal en la documentación → **PENDIENTE DE COMPROBAR en la interfaz** (EN CLASE 01:15: “solamente se puede ver una vez”).
7. **Guardarla en un lugar secreto** (variable de entorno / `.env` del backend), nunca en el chat, el frontend o GitHub (ver §11).
8. **Revocar / deshabilitar / archivar:** en https://openrouter.ai/settings/keys (“delete the compromised key and create a new one”) [S4]; en **Security settings → Key safety** cada clave permite *Disable* (reversible) o *Archive* (permanente, pide escribir `archive`), y *Set limit* para claves sin tope. [S14]
9. **Comprobar el estado de la clave por API:** `GET https://openrouter.ai/api/v1/key` devuelve `limit`, `limit_remaining`, `usage`, `is_free_tier`, `expires_at`, `free_model_daily_requests {used, limit, remaining}`. [S3]
10. **Si se expone:** “OpenRouter is a GitHub secret scanning partner… If you receive such a notification or suspect your key has been exposed, immediately visit your key settings page to delete the compromised key and create a new one.” [S4]

Claves de gestión (Management API keys): son otra cosa (administran claves por API) y “cannot be used to make API calls to OpenRouter's completion endpoints”. No son necesarias para el curso. [S15]; en el plan Free de la tabla de precios, “Management API key: No”. [S19]

**Sin capturas de esta parte:** el diseñador debe hacer un esquema rotulado (“Ilustración esquemática; la interfaz puede variar”) con campos *Name / Credit limit / Expiration / Create* y un recuadro rojo “la clave se muestra una vez (en claves de gestión está documentado): cópiala a tu variable de entorno”. Jamás una clave real; usar `sk-or-v1-XXXXXXXX…`.

---

## 4. Créditos, capa gratuita y límites

**Créditos**
- Base en dólares; recarga manual o automática. [S2]
- Cargo al comprar créditos: **5,5 % (mínimo US$0,80)**; pagos con cripto 5 %. “We pass through the pricing of the underlying providers; there is no markup on inference pricing.” [S2]. La tabla de precios muestra “Platform fees: Free N/A · Standard 5.5% · Business 8%”. [S19]
- Los créditos pueden expirar tras un año de la compra según los términos; reembolso solo en las primeras 24 h; cripto no reembolsable. [S2]
- **Cuenta con saldo negativo:** “If your account has a negative credit balance, you may see errors, including for free models.” [S3]

**Capa gratuita (cifras oficiales, verificadas 23/11/2026)**
- “All new users receive a small free allowance…”; los modelos gratuitos “have low rate limits (50 requests per day total) and are usually not suitable for production use. If you have purchased at least 10 credits, the free models will be limited to 1000 requests per day.” [S2]
- Tabla de límites de uso gratuito (modelos con ID que termina en `:free`) [S3]:

| Créditos comprados (histórico) | Peticiones por minuto | Peticiones por día |
|---|---|---|
| Menos de 10 | 20 | 50 |
| Al menos 10 | 20 | 1000 |

- Los días se cuentan en UTC (`free_model_daily_requests` = “requests recorded so far in the current UTC day”). [S3]
- “Making additional accounts or API keys will not affect your rate limits, as we govern capacity globally.” [S3] → crear varias claves no “reinicia” el cupo.
- La tabla de precios del plan **Free** dice: “Rate limits: 50 requests/day”, “25+ free models”, “4 free providers”, “Budgets & Spend Controls: No”, “Data Policy-Based Routing: No”. [S19] (Observación: el “No” de *Budgets & Spend Controls* se refiere a controles de plan/organización; el límite de crédito por clave sí está documentado en [S4]. **PENDIENTE DE COMPROBAR en la UI** si un usuario sin créditos puede fijar límite en la clave.)
- Nota de calidad de la documentación: la página de límites contiene una plantilla sin rellenar (`{FREE_MODEL_CREDITS_THRESHOLD - 1}`) al explicar que el umbral del segundo nivel se concede “starting one credit below the table's threshold”. [S3] Por eso en la guía debe decir “aprox. 10 créditos” y remitir a la página.
- Límites en las respuestas: los 429 propios de OpenRouter por modelos gratis traen `X-RateLimit-Limit/Remaining/Reset`; las respuestas exitosas **no** traen cabeceras `X-RateLimit-*`. Para ver el cupo diario restante hay que llamar `GET /api/v1/key`. [S3]
- Los modelos `:free` no consumen saldo, pero el aviso oficial es **que un `models` con fallback a un modelo de pago SÍ cobra** (ver §5). [S6]

**Presupuesto en vuelo (in-flight)**, solo cuentas con saldo: puede devolver 402 aunque haya saldo positivo; **no aplica a modelos gratuitos**. [S3]

---

## 5. `:free`, `openrouter/free` y fallbacks

- **`:free`**: “Append `:free` to the ID of a model that has a free entry… only models that list one support it.” Ejemplo oficial: `meta-llama/llama-3.2-3b-instruct:free`. “Free variants… may have different rate limits or availability compared to paid versions.” [S6] → no todo modelo tiene `:free`; hay que verificar el ID en el catálogo en tiempo real (ejemplo de la doc puede ya no existir; en el catálogo de hoy no aparece `meta-llama/llama-3.2-3b-instruct:free`: ver §6).
- **`openrouter/free` (Free Models Router)**: existe y está vigente (aparece en el catálogo de hoy con contexto 200 000 y precio 0). “Automatically selects a free model at random from the available free models… filters for models that support the features your request needs, such as image understanding, tool calling, and structured outputs.” “You cannot control which specific model is selected.” “The Free Models Router is completely free.” Responde con el campo `model` indicando cuál se usó. [S7] [S22]
- **Advertencia clave (cita literal):** “If you list a `:free` model in a `models` fallback array, OpenRouter tries the next model… Each model is billed at its own price, so a fallback to a paid model incurs charges even though the first model was `:free`. To keep a request free, list only `:free` models in `models`, or use the Free Models Router (`openrouter/free`) on its own, which falls back only to other free models.” [S6]
- **Fallback de modelos:** parámetro `models: [...]` por orden de prioridad; OpenRouter prueba el siguiente “if the primary model's providers are down, rate-limited, or refuse to reply due to content moderation”. [S8] Además hay fallback automático **entre proveedores del mismo modelo** antes de que el error llegue al cliente. [S3]
- **Otros routers** vigentes (no gratuitos o no necesarios para el curso): `openrouter/auto`, `openrouter/auto-code`, `openrouter/pareto-code`, `openrouter/fusion`, etc. aparecen en el catálogo con precio dinámico “-1”; “sending requests to -1 routers … will produce unexpected routing behavior” si el código espera un LLM normal. [S16] [S22]
- **Qué NO recomendar:** un modelo gratuito fijo como “el” modelo del curso (la lista cambia a diario; ver §6). Enseñar a buscar y comprobar, y usar `openrouter/free` o una lista de respaldo solo con `:free`.

---

## 6. Modelos gratuitos encontrados HOY (23/11/2026, ~07:45 UTC)

Fuente: `GET https://openrouter.ai/api/v1/models` [S22] (por defecto solo modelos con salida de texto [S16]). Criterio: `pricing.prompt == "0"` y `pricing.completion == "0"`. Archivo completo: `evidencias_qa/openrouter_modelos_free_2026-11-23.json`.
Catálogo de texto: **477** modelos; con precio 0/0: **15** (12 con sufijo `:free`, 1 router `openrouter/free`, 2 *previews* de audio sin `:free`).

| ID | Contexto | Modalidad | Nota |
|---|---:|---|---|
| `inclusionai/ling-3.2-flash:free` | 1 048 576 | texto+imagen→texto | |
| `particle-ai/particle-1:free` | 1 048 576 | texto+imagen→texto | |
| `baidu/ernie-5.5-flash-preview:free` | 1 024 000 | texto→texto | “preview” |
| `nvidia/nemotron-3.5-super-vl:free` | 1 000 000 | texto+imagen+video→texto | |
| `nvidia/nemotron-3.5-lightning:free` | 1 000 000 | texto→texto | |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1 000 000 | texto→texto | |
| `dots-studio/dots-3-note-preview:free` | 512 000 | texto+imagen→texto | **caduca 2026-12-31** (`expiration_date`) |
| `liquid/lfm-3-1.7b:free` | 262 144 | texto→texto | |
| `recursive/flint-v1.0:free` | 262 144 | texto→texto | |
| `google/gemma-4-26b-a4b-it:free` | 262 144 | texto+imagen+video→texto | |
| `google/gemma-4-31b-it:free` | 262 144 | texto+imagen+video→texto | proveedor: Google AI Studio (visto en `/endpoints`) |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256 000 | texto+imagen+audio+video→texto | razonamiento |
| `openrouter/free` | 200 000 | texto+imagen→texto | router |
| `google/lyria-3-pro-preview`, `google/lyria-3-clip-preview` | 1 048 576 | →texto+audio | **no** usar: modelos de audio en preview con precio 0 sin sufijo `:free` |

Observaciones propias:
- Con `?output_modalities=all` el catálogo trae 743 entradas; muchas de imagen/video/rerank muestran `prompt/completion = "0"` porque se cobran por otra unidad (p. ej. `image_output`), por tanto **“precio 0 en prompt y completion” no basta para decir “gratis” fuera de modelos de texto**. En ese catálogo también hay `:free` de embeddings, rerank, voz, imágenes y “decisions”. [S22 + S16]
- Los ejemplos de la documentación (`meta-llama/llama-3.2-3b-instruct:free`, `liquid/lfm-2.5-2.6b:free`, `cohere/north-mini-code:free`, etc.) **ya no están o no coinciden** con el catálogo de hoy → razón para enseñar a consultar el catálogo en vivo en vez de copiar IDs. [S6] [S16] [S22]
- Ninguno de los 15 de hoy es de OpenAI/Anthropic: los modelos “de ChatGPT/Claude” no son gratuitos en OpenRouter (ver §13).
- La colección oficial de modelos gratuitos (https://openrouter.ai/collections/free-models) los ordena por uso real de la última semana y dice: “every one of them has $0 prompt pricing… Rankings measure usage on OpenRouter and reflect adoption, not model quality or benchmark performance.” [S20]
- Cómo buscarlo en la web (EN LA UI, verificado con captura): `https://openrouter.ai/models?max_price=0` (precio de prompt = FREE) [S2] y `https://openrouter.ai/models?pricing=free` [S7]. Cada modelo free tiene su propia página con precio “Free”, contexto, proveedores, “Uptime” y botón API (captura `openrouter_03`).
- **Disponibilidad en tiempo real:** `GET /api/v1/models/{id}/endpoints` (público) devuelve proveedores y `uptime_last_1d`, `status`; se probó con `google/gemma-4-31b-it:free` → HTTP 200, `uptime_last_1d: 100`; con un ID inexistente → HTTP 404 `{"error":{"message":"Not Found","code":404}}`. [observación propia, 23/11/2026]

---

## 7. Encabezados opcionales

- `Authorization: Bearer <OPENROUTER_API_KEY>` (obligatorio). [S4]
- `Content-Type: application/json`.
- **`HTTP-Referer`** (URL de tu app) y **`X-OpenRouter-Title`** (nombre visible; **`X-Title` sigue soportado por compatibilidad**): son opcionales; “Setting them allows your app to appear on the OpenRouter leaderboards.” [S1] [S9]. Según la página de atribución, `HTTP-Referer` “is required for app attribution” (para tener página de app y aparecer en rankings) y el título solo no crea la app; apps con `localhost` deben enviar también el título. [S9] → **No hace falta para que la API funcione.**
- Otras: `X-OpenRouter-Categories` (opcional) [S9]. `Retry-After` en respuestas 429/503/402 especiales. [S5]
- Clientes Anthropic: se acepta `x-api-key` con una clave API. [S4]

⚠ Diferencia con material antiguo: el nombre del título era `X-Title`; hoy el oficial es `X-OpenRouter-Title`. [S9]

---

## 8. Formato de petición y respuesta

**Endpoint de chat (OpenAI-compatible):** `POST https://openrouter.ai/api/v1/chat/completions`. [S2] [S18] Además, **desde la documentación vigente el Quickstart usa `POST /api/v1/responses`** (campo `input` en vez de `messages`) y la FAQ lista `/responses`, `/chat/completions` y `/completions`. [S1] [S2] → ambas vías válidas hoy; para el curso se usa `/chat/completions` por compatibilidad con SDK OpenAI y los ejemplos de errores de la doc. [S5]

Petición mínima (esquema oficial, `ChatRequest`): [S18]
```json
{
  "model": "openrouter/free",
  "messages": [
    {"role": "system", "content": "…contenido de soul.md…"},
    {"role": "user", "content": "¿Qué platillos tienen?"}
  ],
  "max_tokens": 200
}
```
Respuesta exitosa (esquema `ChatResult`): campos obligatorios `id`, `choices[]`, `created`, `model` (el modelo realmente usado), `object: "chat.completion"`, `system_fingerprint`; texto en `choices[0].message.content`; consumo en `usage {prompt_tokens, completion_tokens, total_tokens}`. [S18]
Errores: HTTP no 200 con `{"error":{"code":…,"message":"…","metadata":{…}}}`. **Pero un error durante la generación puede llegar dentro de un 200**, en `error` o en `choices[0].error` → el código debe revisar el cuerpo siempre. [S5]
Streaming: `stream: true` (SSE); los errores a mitad de flujo llegan como evento con `finish_reason: "error"`. [S2] [S3]
Cobro por respuestas vacías: existe “Zero Completion Insurance: OpenRouter will not charge you for zero token responses”. [S23] (no confundir con garantía de respuesta útil).

Compatibilidad: se puede usar el SDK de OpenAI con `base_url="https://openrouter.ai/api/v1"` pero cuidando el “OPENAI_API_KEY fallback trap” (ver error 401). [S4]

El script probado (`kit_referencia/openrouter/test_openrouter.py` y `.js`) implementa esto con timeout, backoff exponencial con jitter, respeto de `Retry-After`, fallback solo entre modelos `:free`/`openrouter/free` y detección de errores dentro de 200.

---

## 9. Códigos de error oficiales: causa y reparación

Forma: `{"error":{"code":number,"message":string,"metadata"?:{}}}`; “The HTTP Response will have the same status code as `error.code`”. Lista oficial: 400, 401, 402, 403, 408, 429, 502, 503. [S5] Tabla ampliada `error_type` (incluye 404, 413, 422, 500, 504) en la misma página. [S5]

| HTTP | Qué significa (doc) | Causas típicas en el curso | Reparación | Fuente |
|---|---|---|---|---|
| 400 | Solicitud inválida (parámetros inválidos/ausentes, **CORS**) | JSON mal formado; falta `model`/`messages`; `context_length_exceeded`; llamar desde el navegador | Corregir cuerpo; reducir prompt/`max_tokens`; llamar desde el backend | [S5] |
| 401 | Credencial inválida (sesión OAuth caducada, clave deshabilitada/inválida) | Ver mensajes reales abajo | Ver tabla 401 | [S5] [S4] |
| 402 | Créditos insuficientes (cuenta o clave) | Saldo ≤ 0, límite de la clave agotado, presupuesto en vuelo, fallback a modelo de pago | Mirar `error.metadata.limit_source`: `openrouter_credits`, `openrouter_key_limit`, `openrouter_in_flight_budget` (esperar `Retry-After`); subir límite/añadir créditos; reducir `max_tokens` | [S5] [S3] |
| 403 | Prohibido (permisos, **guardrail**, moderación) | Presupuesto de org/guardrail, entrada moderada, IP no permitida (Enterprise) | Leer `error.message`/`metadata` (`limit_source`, `resets_at`); no se resuelve reintentando | [S5] [S3] [S14] |
| 404 | `not_found`: el recurso (modelo, archivo) no existe | ID de modelo mal escrito, retirado o sin `:free` | Consultar catálogo en vivo y corregir el ID; fallback a otro modelo | [S5 tabla error_type]; observado en `/models/{id}/endpoints` (404 “Not Found”) |
| 408 | Tiempo de espera de la petición agotado | Modelo lento/saturado | Reintentar con backoff; otro modelo | [S5] |
| 429 | Estás limitado por tasa | Cupo `:free` (20/min; 50 o 1000/día), proveedor saturado | Backoff exponencial + `Retry-After`; comprar ≥10 créditos para 1000/día; variante de pago; fallback `models` o `openrouter/free`; revisar `GET /api/v1/key` | [S5] [S3] |
| 502 | Modelo caído o respuesta inválida del proveedor | Proveedor con fallo | Reintentar; fallback de modelo/proveedor | [S5] |
| 503 | “No available model provider that meets your routing requirements” | Filtros de privacidad/ZDR/proveedor sin candidatos, saturación | Relajar `provider`/privacidad; reintentar; otro modelo | [S5] [S2] |
| 500/504 | Error interno / el proveedor no respondió a tiempo | — | Reintentar con backoff | [S5 tabla error_type] |

**401 — mensajes reales documentados** [S4] y **comprobados en vivo con claves falsas** (ver `evidencias_qa/openrouter_pruebas.md`):

| Mensaje | Causa | Reparación | ¿Comprobado hoy? |
|---|---|---|---|
| `No cookie auth credentials found` | Sin encabezado `Authorization` (en `/chat/completions`) | Enviar `Authorization: Bearer <clave>` | Sí (HTTP 401) |
| `No API key in the Authorization header…` | `Bearer` vacío / variable de entorno sin definir (`undefined`/`null`) | Definir `OPENROUTER_API_KEY` y reiniciar la terminal/app | Sí |
| `Invalid API key: this is not an OpenRouter API key…` | Se usó una clave de otro proveedor (`sk-…` sin `or`) o el SDK tomó `OPENAI_API_KEY` | Pasar `apiKey: process.env.OPENROUTER_API_KEY` explícitamente | Sí |
| `User not found.` / `Invalid API key` | Clave con formato correcto pero borrada/deshabilitada/inexistente | Revisar la página de claves; crear otra | Sí (clave falsa) |
| `Missing Authentication header` | Encabezado mal formado | Exactamente `Authorization: Bearer <clave>` | No |
| `Malformed authentication credential` | Caracteres invisibles al copiar/pegar | Copiar de nuevo | No |
| `API key expired` | Caducó | Crear otra con nueva expiración (no se puede alargar) | No |

---

## 10. Políticas de datos (citas literales cortas)

Resumen para el alumno: **mandar un prompt a un modelo vía API NO es “procesar en local” ni garantiza que no se entrene con tus datos**: el prompt pasa por OpenRouter y por un proveedor externo con su propia política.

1. **Dentro de OpenRouter** (logging): “OpenRouter does not store your prompts or responses, *unless* you opt in…” — dos opciones apagadas por defecto: *Private Input & Output Logging* y *OpenRouter Use of Inputs/Outputs* (1 % de descuento a cambio). [S10] También: “OpenRouter retains prompts only when you opt in, or when retention is needed for CSAM review, reporting, and related legal preservation.” [S10] FAQ: “We log basic request metadata (timestamps, model used, token counts). Prompt and completion are not logged by default.” [S2]
2. **Input & Output Logging** (beta): guarda prompts/completions para que tú los revises en *Logs*; “OpenRouter does not access or use this data”; retención mínima de 3 meses; ajuste en Observability. [S13]
3. **Entrenamiento por parte de PROVEEDORES:** “On your account settings page, you can set whether you would like to allow routing to providers that may train on your data (according to their own policies). There are separate settings for paid and free models.” “Wherever possible, OpenRouter works with providers to ensure that prompts will not be trained on, but there are exceptions.” [S11] FAQ: “Providers that do log, or where we have been unable to confirm their policy, will not be routed to unless the model training toggle is switched on in the privacy settings tab.” [S2]
   - Por petición: `provider.data_collection: "deny"` (por defecto `"allow"`: “allow providers which store user data non-transiently and may train on it”). [S17]
   - “If you specify provider routing… but none of the providers match the level of privacy specified in your account settings, you will get an error and your request will not complete.” [S2] (→ 404/503 aparente en modelos gratis cuando se activa un filtro estricto; **PENDIENTE DE COMPROBAR** el código exacto).
   - Los modelos gratuitos suelen tener proveedores con menos garantías: la política se muestra con la etiqueta “Data Policy” en cada modelo. [S17] **No promover datos reales/sensibles con modelos gratuitos** (RECONSTRUCCIÓN PEDAGÓGICA, no cita).
4. **Tres niveles de política de datos de endpoints:** *ZDR* (no hay almacenamiento rutinario; “Is your data trained on? No”), *Safety Retention* (puede retener “only to detect, investigate, and prevent abuse”; no entrena) y *Retention and Training* (“May be, under the provider's policy”). [S12]
5. **ZDR:** “Zero Data Retention (ZDR) means no routine storage of prompts or responses after processing, apart from the CSAM exception”. Se puede imponer globalmente, por grupo de modelos, por guardrail o por petición (`zdr: true`); “some models may be unavailable”. Aviso: “ZDR enforcement only applies to provider routing for inference requests. It does not apply to plugins and tools you choose to enable”. [S12] En la tabla de precios, “Data Policy-Based Routing” figura **No** para el plan Free y Sí para Standard+. [S19] → **PENDIENTE DE COMPROBAR** si el interruptor de privacidad está disponible a cuentas sin créditos.
6. **Si no hay política clara:** “we take a conservative stance and assume that the endpoint both retains and trains on data”. [S12]
7. **Cribado CSAM:** OpenRouter “will screen inference requests, including ZDR traffic, for child sexual abuse material (CSAM) in flight”; lo marcado puede retenerse para revisión/ley. [S10] [S12]
8. **Metadatos:** “OpenRouter does store metadata (e.g. number of prompt and completion tokens, latency, etc) for each request… does not include the content”. [S10]
9. **Chat web de OpenRouter:** las conversaciones “are stored locally on your device”. [S2]
10. **Datos de la cuenta:** Privacy Policy completa en https://openrouter.ai/privacy (última actualización 31/08/2026, visto en captura) y Terms en https://openrouter.ai/terms. [S2] [S21]
11. **Regiones:** enrutamiento regional UE/EE. UU. solo en planes Business/Enterprise. [S11] [S19]
12. Ubicación de los ajustes (requieren sesión, **PENDIENTE DE COMPROBAR visualmente**): `https://openrouter.ai/settings/privacy`, `https://openrouter.ai/workspaces/default/observability`, `https://openrouter.ai/workspaces/default/settings`. [S10] [S11] [S12]

Políticas de Anthropic/OpenAI/otros proveedores **no se investigaron aquí** (fuera del alcance del Agente C); la lista oficial por proveedor está en https://openrouter.ai/docs/guides/privacy/provider-logging y en las páginas de cada modelo. [S11]

---

## 11. Seguridad y arquitectura (resumen verificable)

- La clave solo en el **backend** (variable de entorno / `.env` no versionado). La doc: “Using environment variables and keeping keys out of your codebase is strongly recommended.” [S4]
- Una clave de OpenRouter “is more powerful than keys used directly for model APIs” (permite límites de crédito y OAuth). [S4]
- Poner un límite de crédito y una expiración a cada clave. [S4] [S14]
- Navegador → backend → OpenRouter. Llamar a la API desde el navegador implica exponer la clave y puede provocar errores 400 por CORS. [S5] (CORS: “Bad Request (invalid or missing params, CORS)”.)
- Tarjeta roja (texto sugerido): “NUNCA pegues una API key en el chat de clases, en código frontend o en GitHub. Si lo hiciste: borra la clave en openrouter.ai/settings/keys y crea otra.”

---

## 12. Pruebas ejecutadas y su alcance

Detalle en `evidencias_qa/openrouter_pruebas.md`. Resumen:
- Reales (endpoint de OpenRouter, sin clave/clave falsa): 401 en 5 variantes, `GET /key` 401, `/models` 200, `/models/{id}/endpoints` 200 y 404.
- Scripts `test_openrouter.py` y `test_openrouter.js` ejecutados sin clave (salida 2), con `--allow-no-key` y con claves falsas (salida 3, mensaje claro).
- Lógica 429/404/402/503/200-con-error probada **solo contra un servidor local simulado** (`test_mock_errors.py`: 9/9 casos PASA). No valida el comportamiento real de OpenRouter.
- **PENDIENTE DE COMPROBAR con clave del alumno:** llamada exitosa 200, 429 real en un modelo free, 402 real, 404 real de modelo inexistente con clave válida, forma exacta de `error.metadata` en esos casos.

---

## 13. Diferencias respecto a lo dicho en clase (ACLARACIÓN TÉCNICA POSTERIOR; sin juicio al profesor)

Referencias de minuto aproximadas según las marcas de la transcripción (`transcript.txt`).

| # | EN CLASE (min.) | Documentación vigente 23/11/2026 | Aclaración para la guía |
|---|---|---|---|
| 1 | Iniciar sesión “con su Google en un click”; cuenta nueva (01:03–01:10). | La documentación no describe los métodos de acceso; la UI muestra Sign in/Sign up; no pude abrir el formulario (proxy). | Mostrar “Sign up” y decir “elige uno de los métodos ofrecidos”; **PENDIENTE DE COMPROBAR** Google/GitHub/correo. |
| 2 | Expiración de 7 días recomendada; “sin expiración” aceptable si la cuenta no está fondeada (01:06–01:09). | Se recomienda **límite de crédito en cada clave** y expiración; la expiración **no se puede cambiar** después; hay política de “maximum key lifetime”. [S4][S14] | 7 días es una buena práctica de seguridad para el curso (COMPLEMENTO DEL PROFESOR). Si sin fondos, el riesgo de gasto es nulo, pero la clave también puede usar modelos gratis y su abuso sigue consumiendo cupo; igualmente ponerle expiración. |
| 3 | Con cuenta fondeada: “Custom amount” como crédito límite; sin fondos: “sin límite”. | Correcto en lo básico: el campo se llama *credit limit*; reinicio daily/weekly/monthly. [S4][S3] | Añadir: el límite protege de fugas y de agentes en bucle. Ejemplo de importe: **no inventar**; sugerir “el mínimo que permita la interfaz”, como se dijo. |
| 4 | “Solo la pueden ver una vez” (01:15). | Documentado literalmente solo para claves de gestión. [S15] | Mantenerlo como regla práctica (copiar en el momento); **PENDIENTE DE COMPROBAR** para claves normales. |
| 5 | Se **pegó la clave en el chat del agente** (OpenCode) diciendo que es “una API de prueba solo para la demo” porque si no, el modelo podría negarse (01:10–01:12). El profesor aclaró que es mala práctica y que lo correcto es `.env`. | La doc exige mantener claves fuera del código; un prompt viaja a un proveedor externo que puede registrar/entrenar según su política. [S4][S11] El megaprompt §10 ya ordena sustituirlo. | **Procedimiento correcto:** pedir al agente que cree `.env.example` con `OPENROUTER_API_KEY=` vacío y que *abra* el archivo `.env` para que el alumno escriba la clave a mano; nunca en el chat. Si se pegó, revocar y recrear. |
| 6 | “OpenRouter nos da acceso a los modelos de ChatGPT, pero no con suscripción, para nosotros de forma gratuita” (01:15–01:20). | Los modelos gratuitos de hoy son de otros laboratorios (Google Gemma, NVIDIA Nemotron, etc.); los modelos de OpenAI/Anthropic son de pago por crédito. La suscripción a ChatGPT/Claude **no** sirve como clave de API. [S22][S2] | Aclarar: gratis = modelos con precio 0; los de pago consumen créditos. |
| 7 | “Más de 600 o 700 modelos”. | “600+ models” (precios/home). Catálogo de hoy: 477 modelos de texto; 743 entradas con todas las modalidades. [S19][S22] | Decir “cientos de modelos (la cifra cambia a diario)”. |
| 8 | “Con API hacemos que la IA corra en servidor local… y no tenga que salir a la nube; las empresas usan API para que Anthropic no entrene con sus conversaciones” (01:16–01:20). | Con OpenRouter la API **sí envía** el prompt a la nube: a OpenRouter y luego a un proveedor; OpenRouter ofrece ajustes (no entrenamiento, ZDR) pero nada corre en local. El no-entrenamiento depende de la política del proveedor/endpoint y de tus ajustes. [S10][S11][S12] | Ver §10. Corregir como “API ≠ local; hay que activar y verificar políticas”. |
| 9 | “Un modelo free que sí pueda contestar y no se termine rápido el uso” (chat 01:11). | Los modelos `:free` tienen tope: 20/min y 50/día (<10 créditos) o 1000/día; el tope se comparte entre todos los modelos gratuitos y las claves de la cuenta. Un agente de código puede gastarlo rápido. [S3] | Explicar el tope y que un 429 puede ser del proveedor o de OpenRouter; backoff + fallback. |
| 10 | “Cambia a DeepSeek o MiMo, está muy saturado” (02:30). | DeepSeek/MiMo **no** aparecen entre los modelos gratuitos de texto de hoy. [S22] La saturación se describe como 429/502/503 con fallback. [S3][S5] | Enseñar a consultar la lista en vivo; no citar nombres fijos. |
| 11 | Otro participante: “no tengo instalado OpenRouter” (03:10). | OpenRouter no se instala; es web + API. [S2] | Distinguir web/API (megaprompt §5). |
| 12 | GitHub no puede guardar la clave de OpenRouter ni ejecutar Python (02:25). | Coherente con la guía de seguridad de claves; GitHub Pages es estático (otro agente). OpenRouter además escanea repos públicos como *GitHub secret scanning partner*. [S4] | Mantener; añadir “si la subes por error, OpenRouter te avisará y debes revocarla”. |
| 13 | Quickstart/headers de ejemplos antiguos (`X-Title`, `/chat/completions`). | Quickstart de hoy usa `/api/v1/responses` y `X-OpenRouter-Title`; `X-Title` y `/chat/completions` siguen válidos. [S1][S9][S2] | Documentar ambos; usar `/chat/completions` en el kit. |

---

## 14. Lo que NO pude verificar (PENDIENTE DE COMPROBAR)

1. Formulario de registro/inicio de sesión (Google/GitHub/correo) y qué pasa al entrar con cada uno: el widget de Clerk está bloqueado en el sandbox.
2. Pantalla real de “Keys → Create”: campos exactos hoy (nombre, expiración, límite, reinicio), si la clave se muestra una sola vez para claves normales, textos de botones.
3. Pantallas de Settings (privacidad, observabilidad, créditos): requieren sesión.
4. Llamada exitosa 200 y los cuerpos reales de 402/404/429/5xx en `/chat/completions` (sin clave válida; la autenticación falla antes).
5. Si un usuario sin créditos puede fijar límite de crédito en la clave y si los filtros de privacidad están disponibles en el plan Free (la tabla de precios dice “No” para Budgets y Data Policy-Based Routing en Free).
6. Código HTTP exacto cuando un filtro de privacidad deja sin proveedores a un modelo gratuito.
7. Políticas de datos de cada proveedor de los modelos gratuitos listados (consultar la página de cada modelo antes de usar datos reales).
8. Valor exacto del umbral de créditos del segundo nivel de límite (doc con plantilla sin rellenar; se usa “10”).

---

## 15. Capturas reales disponibles (`recursos_visuales/capturas/`, 1280×800 @2x, sin sesión, 23/11/2026)

| Archivo | Contenido |
|---|---|
| `openrouter_01_home.png` | Home: “Get API key”, Sign in / Sign up |
| `openrouter_02_modelos_gratis.png` | Listado `models?max_price=0` con precios $0/M |
| `openrouter_03_modelo_free_gemma4.png` | Página de `google/gemma-4-31b-it:free`: Price Free, Context 262K, proveedores |
| `openrouter_04_router_free.png` | Página de `openrouter/free` |
| `openrouter_05_docs_quickstart.png` | Docs: Quickstart |
| `openrouter_06_docs_autenticacion_api_keys.png` | Docs: Authentication (tema claro) |
| `openrouter_07_docs_limites.png` | Docs: Limits |
| `openrouter_08_docs_faq.png` | Docs: FAQ |
| `openrouter_09_docs_privacidad_datos.png` | Docs: Data Collection |
| `openrouter_10_pricing.png` | Pricing (planes Free/Standard/Business/Enterprise) |
| `openrouter_11_privacy_policy.png` | Privacy Policy (última actualización 31/08/2026) |
| `openrouter_12_coleccion_free.png` | Colección de modelos gratuitos |

Notas: en las capturas de docs el logotipo del encabezado se ocultó (la imagen no cargaba en el sandbox y mostraba el texto alternativo “dark logo”); el resto de la página no se modificó. No hubo banner de cookies visible. **No existe captura de registro/login** (bloqueada) **ni de Keys/Settings** (requieren sesión): hacer esquemas rotulados.
