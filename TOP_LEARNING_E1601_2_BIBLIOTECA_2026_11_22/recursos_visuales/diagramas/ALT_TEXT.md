# Texto alternativo de los diagramas

Cada SVG incluye `<title>` y `<desc>` equivalentes. Úsalo como `alt` en `<img>` (resumen breve) y como descripción larga en fuentes editables.

## arquitectura_4_niveles.svg

**Título:** Arquitectura progresiva de cuatro niveles

**Descripción:** Escalera ascendente de cuatro niveles. Nivel 1: Excel y dashboard local. Nivel 2: landing local con chat simulado. Nivel 3: landing y API backend segura desplegada. Nivel 4: memoria y datos persistentes en Supabase con reglas de acceso (RLS). Arriba, en línea punteada, una arquitectura opcional futura con n8n, marcada como no implementada en la práctica.

## arquitectura_general.svg

**Título:** Arquitectura general: navegador, frontend, backend seguro, OpenRouter y Supabase

**Descripción:** Diagrama de izquierda a derecha. En la zona pública están el navegador y el frontend (HTML, CSS y JavaScript). El frontend envía la petición POST /api/chat al backend seguro, que está en la zona privada con un candado y lee la API key de las variables de entorno. El backend llama a OpenRouter con la clave para obtener la respuesta del modelo y a Supabase para leer y guardar la memoria. La clave nunca llega al navegador ni a GitHub.

## esquema_github_new_repository.svg

**Título:** Esquema: crear un repositorio nuevo en GitHub (New repository)

**Descripción:** Formulario genérico con propietario y nombre del repositorio, descripción opcional, opciones público o privado, casilla para añadir un README, listas desplegables de plantilla .gitignore y licencia, y el botón Create repository. Los números 1 a 6 se explican en la lista de la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_github_settings_pages.svg

**Título:** Esquema: activar GitHub Pages en Settings → Pages

**Descripción:** Pantalla genérica de ajustes de un repositorio con menú lateral y la opción Pages resaltada. En el área principal, la sección Build and deployment con la fuente Deploy from a branch, selectores de rama y carpeta, botón Save y un aviso con la dirección donde queda publicado el sitio estático. Los números 1 a 6 se explican a la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_openrouter_crear_api_key.svg

**Título:** Esquema: crear una API key en OpenRouter

**Descripción:** Pantalla genérica con menú lateral con la opción de claves de API, botón para crear clave, ventana con campos de nombre y límite opcional y botón de confirmar, y un panel que muestra la clave una sola vez con botón de copiar. Los números 1 a 6 se explican en la lista de la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_supabase_new_project.svg

**Título:** Esquema: crear un proyecto nuevo en Supabase (New project)

**Descripción:** Formulario genérico con organización, nombre del proyecto, contraseña de la base de datos con opción de generarla, región y el botón Create new project. Los números 1 a 6 se explican en la lista de la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_supabase_sql_editor.svg

**Título:** Esquema: SQL Editor de Supabase

**Descripción:** Pantalla genérica con barra lateral estrecha que incluye SQL Editor resaltado, pestaña de consulta nueva, área de edición con un comentario de ejemplo, botón Run y un panel de resultados inferior que muestra el mensaje de éxito o de error. Los números 1 a 5 se explican en la lista de la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_vercel_environment_variables.svg

**Título:** Esquema: variables de entorno en un proyecto de Vercel (Environment Variables)

**Descripción:** Pantalla genérica de ajustes de proyecto con pestañas superiores y la pestaña Settings resaltada, menú lateral con Environment Variables, formulario con Key, Value, selección de entornos Production, Preview y Development y botón Save, más un aviso de volver a desplegar. Los números 1 a 7 se explican a la derecha. Ilustración esquemática; la interfaz puede variar.

## esquema_vercel_import_project.svg

**Título:** Esquema: importar un proyecto desde GitHub en Vercel (Import project)

**Descripción:** Dos paneles apilados. Arriba, el menú Add New con la opción Project y una lista de repositorios con un botón Import. Abajo, la pantalla de configuración con nombre del proyecto, framework preset, directorio raíz, variables de entorno y el botón Deploy. Los números 1 a 7 se explican en la lista de la derecha. Ilustración esquemática; la interfaz puede variar.

## excel_fastapi_dashboard_asistente.svg

**Título:** Flujo local: Excel, FastAPI, dashboard y asistente

**Descripción:** Cuatro pasos de izquierda a derecha. Un archivo Excel con datos simulados de Puerto A&M se lee con FastAPI, que calcula los KPIs y los expone como endpoints. El dashboard los muestra con tarjetas y gráficas. El asistente responde preguntas usando esas cifras como contexto. Una nota aclara que el Excel vive en la computadora; en un despliegue público se necesita almacenamiento accesible en la nube.

## flujo_depuracion_chat.svg

**Título:** Flujo de depuración cuando el chat no responde

**Descripción:** Diagrama de decisión vertical con cinco preguntas. 1) ¿Responde la interfaz? Si no, revisa el servidor del frontend y la consola. 2) ¿La petición llega al backend? Si no, revisa URL, puerto y CORS. 3) ¿El backend tiene la API key? Si no, define la variable de entorno y reinicia. 4) ¿Qué código HTTP devuelve el proveedor? 401 o 403: clave inválida; 402 o 429: saldo o límite; 404: modelo o URL equivocados; 5xx: falla del proveedor. 5) ¿La interfaz muestra el campo reply? Si no, revisa cómo el frontend lee la respuesta.

## flujo_seguro_api_key.svg

**Título:** Dónde guardar la API key: incorrecto frente a correcto

**Descripción:** Dos paneles. A la izquierda, el camino incorrecto en rojo: la clave escrita en el código del frontend, pegada en un chat o prompt, o dentro de un archivo .env subido a un repositorio público; cualquiera puede leerla. A la derecha, el camino correcto en verde azulado: el navegador llama a tu backend, que lee la clave de una variable de entorno y es el único que habla con OpenRouter. Si una clave se expone, hay que revocarla y crear otra.

## flujo_turno_memoria.svg

**Título:** Flujo de un turno de chat con memoria

**Descripción:** Seis pasos. 1) El navegador envía el ID de sesión y el mensaje. 2) El backend lee los últimos N mensajes de esa sesión en Supabase, filtrando por el usuario antes de llamar al modelo. 3) Construye el prompt con el system prompt (soul.md), el historial y el mensaje nuevo. 4) Llama a OpenRouter. 5) Guarda el turno completo en Supabase. 6) Devuelve la respuesta al navegador.

## github_web_vs_cli.svg

**Título:** GitHub: ruta web frente a GitHub CLI

**Descripción:** Dos rutas hacia el mismo resultado, un repositorio en GitHub. Ruta A, web sin terminal: New repository, nombrar y crear, subir archivos con Upload files y confirmar con Commit changes. Ruta B, GitHub CLI en Windows: gh auth login, git init, git add, git commit y gh repo create o git push. Los pasos detallados están en la guía 02.

## linea_tiempo_sesion.svg

**Título:** Línea de tiempo aproximada de la sesión del 22/11/2026

**Descripción:** Línea horizontal de 00:00 a 03:15 con nueve hitos aproximados: 00:00 teoría; 00:20 dashboard; 00:40 landing; 01:05 OpenRouter; 01:30 GitHub; 01:55 Supabase; 02:30 Claude Code y Vercel; 03:00 dudas; 03:15 cierre. Los minutos son aproximados y se reconstruyeron a partir de la transcripción.

## localhost_vs_pages_vs_vercel.svg

**Título:** Comparación: localhost, GitHub Pages y Vercel

**Descripción:** Tabla visual de tres columnas. Localhost: solo tu computadora, ejecuta el backend mientras el servidor esté encendido, las claves viven en un archivo .env local. GitHub Pages: sitio estático público, no ejecuta Python ni FastAPI y no protege claves. Vercel: URL pública con despliegues de vista previa y producción, permite variables de entorno y funciones de servidor según la configuración del proyecto.

## modelo_datos_memoria.svg

**Título:** Modelo de datos de la memoria: conversations, messages, orders, order_items y reservations

**Descripción:** Cinco tablas de PostgreSQL. conversations tiene id (clave primaria) y owner_id, que apunta a auth.users. messages tiene conversation_id que apunta a conversations. reservations y orders también apuntan a conversations mediante conversation_id y tienen owner_id. order_items tiene order_id que apunta a orders. Todas las tablas llevan seguridad por filas (RLS). Los datos son una simulación académica de Puerto A&M.

## n8n_futuro_no_implementado.svg

**Título:** Arquitectura futura con n8n — no implementada en la práctica

**Descripción:** Diagrama punteado y atenuado. La landing o el chat envía un evento a un webhook de n8n; el flujo de trabajo procesa con un modelo de lenguaje, guarda en una base de datos o una hoja y avisa por correo o mensajería. Está rotulado como arquitectura futura, no implementada en la práctica de la clase.

## vercel_preview_vs_production.svg

**Título:** Vercel: despliegue de vista previa frente a producción

**Descripción:** Flujo de un repositorio de GitHub conectado a Vercel. Un push a una rama de trabajo genera un despliegue de vista previa con una URL propia para probar. Un push o fusión a la rama de producción, normalmente main, genera el despliegue de producción en el dominio del proyecto. Las variables de entorno se configuran por entorno: Production, Preview y Development.
