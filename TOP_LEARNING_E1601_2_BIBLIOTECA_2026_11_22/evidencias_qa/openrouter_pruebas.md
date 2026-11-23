# Pruebas de OpenRouter — evidencia (23/11/2026)

Fecha/hora de ejecución: 2026-11-23, ~07:45–07:50 UTC (cabecera `date` del servidor de OpenRouter: `Mon, 23 Nov 2026 07:44:58 GMT`).
Entorno: contenedor Linux, Python 3.13 + `requests` 2.34, Node v22.23 (`fetch`, con `NODE_USE_ENV_PROXY=1` por el proxy del entorno).
Endpoint real probado: `https://openrouter.ai/api/v1/chat/completions` y `https://openrouter.ai/api/v1/models` (público).
**No había API key.** Todo lo de abajo se hizo SIN clave o con claves FALSAS (`sk-or-v1-0000…` / `sk-or-v1-XXXXXXXX` / `sk-proj-FALSA`). No se imprimió ni se usó ninguna clave real.

## Resumen

| # | Caso | Resultado real del endpoint | Código HTTP |
|---|------|------------------------------|-------------|
| 1 | POST sin cabecera `Authorization` | `{"error":{"message":"No cookie auth credentials found","code":401}}` | 401 |
| 2 | Clave con formato `sk-or-v1-` + 64 ceros (inexistente) | `{"error":{"message":"User not found.","code":401}}` | 401 |
| 3 | Clave falsa corta `sk-or-v1-XXXXXXXX` | `{"error":{"message":"User not found.","code":401}}` | 401 |
| 4 | Clave de otro proveedor (`sk-proj-…`) | `Invalid API key: this is not an OpenRouter API key. OpenRouter keys start with "sk-or-". If you use an OpenAI or Anthropic SDK, check that it is not picking up OPENAI_API_KEY or ANTHROPIC_API_KEY instead of your OpenRouter key` | 401 |
| 5 | `Authorization: Bearer ` (vacío) | `No API key in the Authorization header: expected "Bearer sk-or-...". Check that your OpenRouter API key environment variable is set` | 401 |
| 6 | `GET /api/v1/key` con clave falsa | `User not found.` | 401 |
| 7 | `GET /api/v1/models/foo/bar-inexistente:free/endpoints` (público, modelo inexistente) | `{"error":{"message":"Not Found","code":404}}` | 404 |
| 8 | `GET /api/v1/models/google/gemma-4-31b-it:free/endpoints` (público) | JSON con endpoint "Google AI Studio", `pricing.prompt:"0"`, `context_length:262144`, `uptime_last_1d:100` | 200 |
| 9 | POST con JSON inválido y sin clave | 401 `No cookie auth credentials found` (la autenticación se evalúa ANTES de validar el cuerpo) | 401 |
| 10 | `GET /api/v1/models` (público, sin clave) | 477 modelos de texto; 15 con prompt=0 y completion=0 | 200 |

Cabecera de error observada: `x-openrouter-error-origin: client`. Las respuestas de error son JSON `{"error":{"message":…,"code":…}}`, coincidentes con la forma documentada en https://openrouter.ai/docs/api_reference/errors-and-debugging.md (verificado 23/11/2026).

Hallazgos importantes:
- Sin cabecera `Authorization` el mensaje real es **"No cookie auth credentials found"** (no "Missing Authentication header"); la documentación lo describe así para `/chat/completions` (https://openrouter.ai/docs/api_reference/authentication.md, sección "Troubleshooting 401 errors").
- Una clave con formato correcto pero inexistente devuelve **"User not found."**, que la documentación equipara a "clave eliminada, deshabilitada o inexistente".
- **No se pudieron probar** con el endpoint real: 402, 403, 404 de modelo inexistente en `/chat/completions`, 429, 5xx y la llamada exitosa, porque todos exigen una clave válida (la autenticación falla primero). Esas ramas se probaron solo contra un servidor local simulado (ver más abajo), lo cual valida la lógica del script, NO el comportamiento de OpenRouter.

## Llamada exitosa — PENDIENTE DE COMPROBAR con clave del alumno
La respuesta 200 con texto generado (`choices[0].message.content`, `model` realmente usado) **no se pudo probar**: no hay API key. Procedimiento para el alumno: definir `OPENROUTER_API_KEY` en su terminal (nunca en un chat), ejecutar `python test_openrouter.py` o `node test_openrouter.js`, y esperar una línea `[ok] modelo usado: …` en stderr y el texto en stdout. Estado: **PENDIENTE DE COMPROBAR**.

## Salidas literales de los scripts contra el endpoint real
(códigos de salida del script: 0 OK, 1 agotado, 2 falta clave, 3 error fatal 4xx de credenciales/permisos)

```
UTC 2026-11-23 07:46:40
=== PY-1 sin clave, sin --allow-no-key
Falta OPENROUTER_API_KEY. Defina la variable de entorno (no pegue la clave en chats, codigo ni GitHub).
PowerShell:  $env:OPENROUTER_API_KEY = '<su clave>'
[codigo de salida: 2]
=== PY-2 sin clave, con --allow-no-key
ERROR FATAL: 401 Credencial invalida: la clave falta, esta mal copiada, fue borrada/deshabilitada o caduco. Crea otra en https://openrouter.ai/keys y vuelve a definir OPENROUTER_API_KEY. | servidor dijo: 'No cookie auth credentials found'
[codigo de salida: 3]
=== PY-3 clave falsa (formato valido, inexistente)
ERROR FATAL: 401 Credencial invalida: la clave falta, esta mal copiada, fue borrada/deshabilitada o caduco. Crea otra en https://openrouter.ai/keys y vuelve a definir OPENROUTER_API_KEY. | servidor dijo: 'User not found.'
[codigo de salida: 3]
=== PY-4 clave falsa de otro proveedor
ERROR FATAL: 401 Credencial invalida: la clave falta, esta mal copiada, fue borrada/deshabilitada o caduco. Crea otra en https://openrouter.ai/keys y vuelve a definir OPENROUTER_API_KEY. | servidor dijo: 'Invalid API key: this is not an OpenRouter API key. OpenRouter keys start with "sk-or-". If you use an OpenAI or Anthropic SDK, check that it is not picking up OPENAI_API_KEY or ANTHROPIC_API_KEY instead of your OpenRouter key'
[codigo de salida: 3]
=== PY-5 descubrimiento de modelos free + clave falsa
ERROR FATAL: 401 Credencial invalida: la clave falta, esta mal copiada, fue borrada/deshabilitada o caduco. Crea otra en https://openrouter.ai/keys y vuelve a definir OPENROUTER_API_KEY. | servidor dijo: 'User not found.'
[codigo de salida: 3]
=== JS-1 sin clave
Falta OPENROUTER_API_KEY. Defina la variable de entorno (no pegue la clave en chats, codigo ni GitHub).
PowerShell:  $env:OPENROUTER_API_KEY = '<su clave>'
[codigo de salida: 2]
=== JS-2 sin clave --allow-no-key
ERROR FATAL: 401 Credencial invalida: clave ausente, mal copiada, borrada/deshabilitada o caducada. Crea otra en https://openrouter.ai/keys. | servidor dijo: "No cookie auth credentials found"
[codigo de salida: 3]
=== JS-3 clave falsa
ERROR FATAL: 401 Credencial invalida: clave ausente, mal copiada, borrada/deshabilitada o caducada. Crea otra en https://openrouter.ai/keys. | servidor dijo: "User not found."
[codigo de salida: 3]
```

(El aviso `UNDICI-EHPA` de Node solo aparece por usar `NODE_USE_ENV_PROXY=1` en este sandbox; se omitió de la transcripción.)

## Prueba de la lógica contra servidor local simulado (NO es OpenRouter)
Archivo: `fuentes_editables/kit_referencia/openrouter/test_mock_errors.py`. Levanta un servidor HTTP en `127.0.0.1` que devuelve respuestas guionadas y ejecuta las funciones de `test_openrouter.py` (y `test_openrouter.js` para el caso 7).

```
PASA  429 -> reintento -> 200
PASA  404 -> fallback
PASA  401 fatal sin reintento ni fallback
PASA  402 fatal sin reintento ni fallback
PASA  403 fatal sin reintento ni fallback
PASA  503 x3 -> fallback
PASA  error dentro de 200 -> reintento
PASA  todos fallan -> RuntimeError
PASA  node: 429 -> reintento -> 200
RESULTADO: TODO OK
```

Ramas validadas: 429 con `Retry-After` → reintento → 200; 404 → fallback al siguiente modelo; 401/402/403 → error fatal sin reintento ni fallback; 503 persistente ×3 → fallback; error dentro de un 200 → reintento; todos los modelos fallan → error claro; versión Node 429 → reintento → 200.

## Limitaciones declaradas
- Sin clave real: no se verificó el cuerpo real de 402/403/429/5xx de `/chat/completions` ni el contenido de una respuesta 200.
- El proxy del sandbox bloquea `clerk.openrouter.ai`, por lo que las páginas de inicio de sesión/registro (widget de Clerk) no cargan y no se capturaron.
- Resultados del catálogo de modelos son una foto del 23/11/2026 ~07:45 UTC (caché CDN de 120 s); cambian continuamente.
