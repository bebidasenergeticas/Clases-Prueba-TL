# Práctica: Café Horizonte AI con OpenCode y OpenRouter

**Sesión:** miércoles 18 de noviembre de 2026 · E1577 · Laboratorio final

## 1. Objetivo

Construir y comprobar una app web de atención al cliente de una cafetería **ficticia**: frontend HTML/CSS/JS, backend Node.js + Express y un modelo vía OpenRouter. Es un **asistente conversacional especializado, no un agente autónomo de producción**.

## 2. Datos ficticios

- Horario: lunes a viernes 9:00–20:00; sábado y domingo 10:00–18:00.
- Menú (MXN): americano $45, capuchino $65, sándwich $89, rebanada de pastel $75.
- Preguntas de prueba: ¿A qué hora abren? · ¿Cuánto cuestan dos capuchinos? (esperado: $130) · ¿Qué me recomiendas para desayunar? · ¿Tienen servicio a domicilio? (debe reconocer que no tiene ese dato).

**Reglas de la sesión:** nunca pedir claves en una sesión grabada; nunca proyectar el archivo `.env`; la app se prepara antes de la sesión.

## 3. Prompt completo para OpenCode (copiar y pegar)

```text
Actúa como desarrollador web full stack senior y mentor de principiantes.

OBJETIVO
Construye "Café Horizonte AI", app web de atención al cliente para una cafetería FICTICIA. Es un asistente conversacional especializado (NO un agente autónomo de producción: solo responde preguntas, no ejecuta acciones).

REGLAS DE SEGURIDAD (obligatorias)
- Trabaja solo dentro de la carpeta actual; crea la subcarpeta "cafe-horizonte-ai".
- NO publiques nada en internet ni despliegues en ningún servicio.
- NO instales nada de forma global sin preguntarme antes; solo dependencias locales del proyecto.
- NO me pidas claves ni credenciales en este chat. Crea ".env.example" con los nombres de variables SIN valores reales. Yo crearé ".env" por mi cuenta. Agrega ".env" y "node_modules" a ".gitignore".
- La clave solo existe en el servidor: nunca en el navegador, nunca en el código fuente, nunca en logs ni mensajes de error.

ARQUITECTURA MÍNIMA
cafe-horizonte-ai/
  package.json, server.js, .env.example, .gitignore, README.md
  public/index.html, public/style.css, public/app.js
- Frontend: HTML + CSS + JavaScript simple, SIN frameworks, responsive (usable en celular), con interfaz de chat.
- Backend: Node.js + Express. Sirve "public/" como archivos estáticos y expone:
  1) GET /api/health -> { status: "ok", mode: "real" | "demo", model: <nombre o null> } (nunca incluyas la clave).
  2) POST /api/chat -> recibe { message: string }; devuelve { reply: string, mode: "real" | "demo" }.
- Dependencias permitidas: express y dotenv (usa el fetch nativo de Node 18+ para llamar a OpenRouter; si la versión de Node no lo soporta, avísame).
- Variables de entorno (solo en servidor): OPENROUTER_API_KEY y OPENROUTER_MODEL; PORT opcional (por defecto 3000).

MODELO (OpenRouter, API compatible con chat completions)
- POST https://openrouter.ai/api/v1/chat/completions con header Authorization: Bearer <OPENROUTER_API_KEY>, body { model: OPENROUTER_MODEL, messages: [system, user] }. Timeout de 20 segundos.
- Prompt de sistema (úsalo tal cual): "Eres el asistente de atención al cliente de Café Horizonte, una cafetería ficticia. Responde en español de México, breve, amable y claro. Usa ÚNICAMENTE estos datos. Horario: lunes a viernes 9:00 a 20:00; sábado y domingo 10:00 a 18:00. Menú (MXN): americano $45, capuchino $65, sándwich $89, rebanada de pastel $75. Si piden cuentas, calcula con los precios y muestra el desglose. Si preguntan algo que no está en estos datos (por ejemplo servicio a domicilio, ubicación o promociones), di claramente que no cuentas con ese dato y sugiere contactar a la cafetería. No inventes información. Para recomendaciones usa solo productos del menú."

MODO DEMOSTRACIÓN (explícito)
- Si falta OPENROUTER_API_KEY u OPENROUTER_MODEL, el servidor arranca en modo DEMOSTRACIÓN: responde con reglas simples por palabras clave usando los datos del café.
- La interfaz muestra una insignia visible y permanente: "MODO DEMOSTRACIÓN: no usa un modelo de IA real". En modo real muestra "Modelo real conectado".

VALIDACIÓN Y ERRORES
- Valida que message sea texto no vacío de máximo 500 caracteres; si no, responde 400 con mensaje claro.
- Si OpenRouter falla (401, 402, 429, timeout, modelo inválido, red): responde al usuario con un mensaje amable y distinto por caso, sin detalles internos; en consola registra solo el código de estado.
- En el frontend: mensaje de carga ("escribiendo..."), botón deshabilitado mientras espera, error visible, Enter para enviar, escape del texto para evitar inyección de HTML y etiquetas accesibles.

README.md para principiantes: qué es cada archivo, cómo instalar (npm install), cómo crear .env desde .env.example (sin pegar valores en el chat), cómo iniciar (npm start) y cómo probar.

PROCESO (no afirmes nada sin comprobarlo)
1. Antes de escribir código, muestra un plan de máximo 5 líneas y la lista de archivos.
2. Verifica que Node y npm existen (node -v, npm -v) y reporta versiones. Si faltan, dime qué hacer, no instales global sin permiso.
3. Crea los archivos, ejecuta npm install local, y comprueba la sintaxis (node --check server.js).
4. Inicia el servidor y dame la URL EXACTA con el puerto real en uso. Si el puerto está ocupado, dímelo y propón otro.
5. Prueba con curl: GET /api/health y POST /api/chat con las 3 preguntas de prueba: "¿A qué hora abren?", "¿Cuánto cuestan dos capuchinos?" (esperado $130 MXN) y "¿Tienen servicio a domicilio?" (debe decir que no tiene ese dato). Reporta resultados reales, incluyendo los fallos.
6. Confirma que la clave no aparece en public/ ni en ningún archivo servido al navegador.
7. Al final explica en lenguaje simple (máx. 15 líneas): qué hace el frontend, qué hace el backend y qué papel tiene OpenRouter, y por qué la clave vive solo en el servidor. Dime cómo pasar a modo real sin pegar mi clave en este chat.
```

## 4. Demostración en 7 pasos

1. **Abrir OpenCode y la carpeta de trabajo** (carpeta vacía; es "su casita" para sus archivos). Sin mostrar claves.
2. **Pegar la instrucción** de la sección 3; mostrar el modelo activo de la sesión.
3. **Identificar archivos:** `public/` = frontend; `server.js` = backend; `.env.example` = nombres de variables.
4. **Iniciar el servidor y abrir** la URL exacta que dio OpenCode (por ejemplo http://localhost:3000; solo funciona en ese equipo).
5. **Probar una pregunta:** "¿Cuánto cuestan dos capuchinos?" -> $130 MXN.
6. **Qué pasa si falla la API o falta la clave:** sin clave, modo demostración con insignia; clave inválida o modelo inválido, mensaje amable sin detalles internos.
7. **Pedir a OpenCode que corrija** (sección 6) y repetir la prueba.

## 5. Rutas

- **Ruta A (real):** solo si OPENROUTER_API_KEY y OPENROUTER_MODEL ya están configurados en el `.env`, preparado en privado antes de la sesión. El indicador debe decir "Modelo real conectado".
- **Ruta B (demostración):** sin clave. La insignia dice "MODO DEMOSTRACIÓN: no usa un modelo de IA real". Sirve para aprender la arquitectura sin costo ni riesgo.

## 6. Prompts de corrección

**Corrección 1: error 401 o "Error de conexión"**
```text
La app muestra "Error de conexión" y en la consola del servidor aparece el código 401. Sin pedirme mi clave y sin imprimirla: (1) revisa que dotenv se cargue al inicio de server.js y que se lean OPENROUTER_API_KEY y OPENROUTER_MODEL de process.env; (2) revisa que el header sea "Authorization: Bearer " + la clave; (3) haz que /api/health indique si faltan variables (solo nombres, nunca valores); (4) si faltan, cambia automáticamente a modo demostración con la insignia visible; (5) devuelve mensajes amables distintos para 401, 402, 429 y timeout; (6) reinicia, prueba las preguntas y reporta qué archivos y líneas cambiaste y la URL exacta.
```

**Corrección 2: puerto ocupado o el frontend no llama bien al backend**
```text
Al iniciar aparece EADDRINUSE (puerto ocupado) o el chat no recibe respuesta. Haz que el servidor use process.env.PORT o 3000 y, si está ocupado, muestre un mensaje claro y la forma de usar otro puerto. Verifica que public/app.js llame a "/api/chat" con ruta relativa, que muestre el error devuelto y que no se quede en "escribiendo...". Reinicia, comprueba con curl a /api/health y dame la URL exacta con el puerto real.
```

**Corrección 3: la IA inventa datos**
```text
Ante "¿Tienen servicio a domicilio?" el asistente inventó una respuesta. Refuerza el prompt de sistema para que, cuando un dato no esté en el horario o el menú, diga explícitamente que no cuenta con él y sugiera contactar a la cafetería. Prueba las 4 preguntas y reporta las respuestas literales.
```

## 7. Cómo verificar

- `curl http://localhost:3000/api/health` -> `status: ok` y `mode` correcto (ajustar el puerto al que dio OpenCode).
- `curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"message":"¿Cuánto cuestan dos capuchinos?"}'` -> debe indicar $130 MXN.
- Las 4 preguntas coinciden con los datos; la de domicilio reconoce que no tiene el dato.
- **La clave no aparece en el navegador:** abrir las herramientas del navegador (pestaña Fuentes/Red), revisar que `app.js` y las peticiones no contienen la clave; y buscar en la carpeta `public/` (por ejemplo `grep -ri "sk-" public/`, sin mostrar el `.env`).
- La insignia de modo coincide con `/api/health`.
- Cambiar un precio en el prompt de sistema y verificar que la respuesta cambia (comprobación de que usa los datos).

## 8. Seguridad

- No proyectar el `.env`; si hay que mostrarlo, mostrar solo `.env.example`.
- No pegar claves en el chat de OpenCode, de Meet ni del muro; si una clave se expuso, revocarla y generar otra.
- No publicar la app ni exponer `localhost`; un endpoint público sin autenticación permite que cualquiera gaste la cuenta.
- Permisos de OpenCode: aprobar solo crear archivos y `npm install` local; preguntar ante cualquier instalación global o acceso fuera de la carpeta.
- Datos ficticios únicamente; no cargar datos personales ni de clientes reales.

## 9. Muse por niveles (sin prometer conexión automática)

Según la clase del 13/11, Muse es un agente personal que organiza objetivo, guion y estructura y trabaja en sus propios espacios; se le pueden conectar fuentes como Drive. No se afirma nada adicional sobre sus funciones.

1. **Nivel 1 — disponible hoy:** planear requisitos, redactar instrucciones, revisar la experiencia de usuario y hacer transferencia **manual** del prompt a OpenCode.
2. **Nivel 2 — condicionado:** requiere una API segura por HTTPS con autenticación y que la cuenta o plataforma permita conectores personalizados (confirmar en la cuenta/documentación). Esquema a explorar: MUSE -> CONECTOR AUTORIZADO -> API DEL NEGOCIO -> BACKEND -> OPENROUTER. `localhost` no es accesible desde fuera; no se expone un endpoint sin autenticación. Los pasos concretos de configuración dependen de la plataforma y no se detallan aquí.
3. **Nivel 3 — propuesto:** base de datos, CRM, n8n, autenticación, observabilidad y supervisión humana.
