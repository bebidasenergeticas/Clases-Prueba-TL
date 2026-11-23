# INVENTARIO DEL CHAT — E1601.2 · 22/11/2026

> Agente A · 23/11/2026. Fuente: `src/chat.txt` (353 líneas, **54 mensajes**). Los mensajes del profesor se reproducen **literalmente y completos** (salvo el truncado, que se muestra tal como quedó en el chat: no se completa). Los mensajes de alumnos están **anonimizados** con los códigos del brief y las URLs personales se sustituyen por "[URL personal de alumno omitida]". Las URLs `localhost`/`127.0.0.1` se conservan porque ilustran la diferencia local vs público. Las URLs del profesor son **ejemplos históricos de la clase; pueden no estar disponibles**.
> Las marcas de tiempo son exactas del chat (`HH:MM:SS`). "Contexto" = líneas de `transcript.txt` donde se habla de ese mensaje (aprox.).

## 0. Resumen cuantitativo

| Concepto | Cantidad |
|---|---|
| Mensajes totales | 54 |
| Mensajes del profesor | 29 |
| — Prompts/instrucciones para agentes de IA | 20 (C-01 a C-05, C-07 a C-16, C-18, C-19, C-20, C-22, C-23) |
| — Comando de soporte | 1 (C-29 `opencode auth list`) |
| — Enlaces | 8 (C-06, C-17, C-21, C-24, C-25, C-26, C-27, C-28) |
| Mensajes de alumnos | 25 (Alumna A: 4 · Alumna B: 4 · Alumna D: 5 · Alumna E: 1 · Alumno F: 3 · Participante G: 2 · Alumna H: 3 · Alumna I: 2 · Alumno J: 1) |
| Mensajes que contienen una API key o secreto | **0** (búsqueda de `sk-`, `eyJ`, `AIza`, `ghp_`; el profesor pegó su key en OpenCode/Claude Code, no en el chat) |

## 1. Mensajes del profesor (literal)

### C-01 · 00:26:16 · PROMPT (cabecera de metaprompt)

- **Estado:** VIGENTE (se antepone al texto a mejorar)
- **Relación entre versiones:** Precede a C-02/C-03; ver recetas T-01 y T-02
- **Contexto en la transcripción:** L219-250 (duda de Alumna A y explicación)
- **Herramienta/destino:** ChatGPT (cualquier LLM de chat)
- **Nota:** Es una fórmula, no un prompt de construcción. Se usa con datos reales o con DEMO: el profesor añade para qué herramienta/modelo y el contexto del negocio.
- **Línea en `chat.txt`:** 4

```text
Mejora este prompt , optimizalo , no inventes informacion y dame un buen prompt:
```

### C-02 · 00:26:36 · PROMPT (primer prompt largo del dashboard)

- **Estado:** **TRUNCADO** — NO COMPLETAR
- **Relación entre versiones:** **Reemplazado por C-03**
- **Contexto en la transcripción:** L238-254 ("el de arriba… se quedó corto, más bien estaba muy largo")
- **Herramienta/destino:** OpenCode (no usar)
- **Nota:** El propio chat cortó el mensaje en "Los filtros deberán actualizar". No se reconstruye el fragmento perdido. Los alumnos NO debían usar este mensaje (L251-253, L265-266, L272-274).
- **Línea en `chat.txt`:** 7

```text
# PROMPT MAESTRO — PUERTO A&M | DASHBOARD EMPRESARIAL CONECTADO A EXCEL

Actúa como un **ingeniero full-stack senior, analista de datos, especialista en Excel y diseñador UI/UX de dashboards empresariales premium**.

## 🎯 OBJETIVO

Desarrolla una aplicación web funcional llamada **Puerto A&M | Business Intelligence**, integrada al proyecto de demostración del restaurante Puerto A&M.

Quiero un dashboard extraordinariamente elegante, moderno y profesional que analice ventas, productos, ingresos, costos y rentabilidad.

**REQUISITO FUNDAMENTAL: tú mismo debes crear desde cero un archivo Excel (.xlsx), llenarlo con datos ficticios realistas y conectar verdaderamente ese archivo al dashboard.**

No quiero datos simulados únicamente en JavaScript. El Excel será la fuente de información del dashboard.

## 1. CREA LA BASE DE DATOS EN EXCEL

Utiliza Python y `openpyxl` para generar un archivo llamado:

`Puerto_AM_Base_Datos_DEMO.xlsx`

Incluye las siguientes hojas:

**Ventas:** genera al menos 300 registros ficticios distribuidos entre enero y marzo de 2026. Incluye fecha, ID de venta, ID de pedido, producto, categoría, cantidad, precio unitario, costo unitario, canal de venta, método de pago y estado de la transacción.

**Productos:** catálogo de platillos ficticios, categorías, precios y costos estimados.

**Metas:** objetivos mensuales de ventas e ingresos, claramente identificados como hipotéticos.

**Instrucciones:** explica las columnas, cómo modificar los registros y cómo actualizar el dashboard.

Utiliza datos coherentes, variados y matemáticamente consistentes. Todos los datos deben indicar expresamente que son una **simulación académica y no información real de Puerto A&M**.

Aplica al archivo Excel un diseño profesional: tablas, encabezados, filtros, formatos monetarios MXN, fechas y columnas bien dimensionadas.

## 2. CONECTA REALMENTE EXCEL CON EL DASHBOARD

Este es el requisito técnico más importante.

Desarrolla una arquitectura local sencilla con:

- **Frontend:** HTML, CSS y JavaScript, utilizando una biblioteca de gráficos como Chart.js.
- **Backend:** Python con FastAPI.
- **Fuente de datos:** el archivo Excel generado mediante `openpyxl`.

El backend debe leer la información del Excel y exponerla al frontend mediante endpoints locales.

Cuando modifique los datos en Excel, guarde el archivo y presione **«Actualizar datos»**, el dashboard deberá reflejar los cambios automáticamente, sin modificar el código.

Agrega también actualización periódica si es viable, con manejo correcto de errores.

Si implementas un formulario para registrar nuevas ventas, estas deberán guardarse realmente en el Excel y aparecer en el dashboard. Valida los datos antes de escribir y maneja el caso de que el archivo esté abierto o bloqueado.

No utilices números estáticos para los indicadores.

## 3. DISEÑA UN DASHBOARD EXTRAORDINARIAMENTE PROFESIONAL

Quiero una experiencia visual comparable a un software empresarial premium.

Estética:

- Azul petróleo, negro grafito y blanco cálido.
- Acentos dorados muy discretos.
- Tipografía elegante.
- Gráficos limpios.
- Animaciones suaves.
- Microinteracciones.
- Tarjetas KPI modernas.
- Diseño responsive.
- Barra lateral de navegación.
- Excelente jerarquía visual.

Evita el aspecto genérico de una plantilla administrativa.

### Indicadores obligatorios

Calcula desde el Excel:

1. Ventas totales en MXN.
2. Número de pedidos únicos.
3. Ticket promedio.
4. Unidades vendidas.
5. Costos de productos vendidos.
6. Utilidad bruta estimada.
7. Margen bruto porcentual.
8. Crecimiento de ventas mensual.
9. Producto más vendido.
10. Cumplimiento de metas.

### Visualizaciones

Incluye:

- Ventas por día y por mes.
- Ingresos frente a costos.
- Productos más vendidos.
- Distribución por categoría.
- Ventas por canal.
- Comparación de metas y resultados.
- Tabla interactiva de ventas.

Agrega filtros por fecha, categoría, producto y canal, y un botón para exportar información.

Los filtros deberán actualizar
```

> **[TRUNCADO — el mensaje termina aquí tal como está en el chat. No se completa ni se reconstruye. La versión que el profesor autorizó usar es C-03.]**

### C-03 · 00:27:22 · PROMPT (dashboard definitivo, compacto)

- **Estado:** **VIGENTE — el autorizado por el profesor**
- **Relación entre versiones:** Reemplaza a C-02
- **Contexto en la transcripción:** L249-254, L265-279 ("el último… lo vamos a meter a OpenCode")
- **Herramienta/destino:** OpenCode, modelo gratuito, carpeta de proyecto separada
- **Nota:** Este es el que copiaron/debían copiar los alumnos. Define las 4 hojas del Excel, FastAPI/openpyxl/Chart.js, KPIs, integración sin borrar la landing y comprobaciones.
- **Línea en `chat.txt`:** 115

```text
# PROMPT — PUERTO A&M | DASHBOARD CONECTADO A EXCEL

Actúa como **desarrollador full-stack, analista de datos y diseñador UI/UX senior**.

## 🎯 OBJETIVO

Construye con OpenCode una aplicación web llamada **Puerto A&M | Business Intelligence**, con un dashboard empresarial premium conectado a un archivo Excel real, creado por ti.

**No quiero una maqueta ni datos incrustados en JavaScript: quiero una aplicación completamente funcional.**

### 1. Crear el Excel

Genera `Puerto_AM_Base_Datos_DEMO.xlsx` utilizando Python y `openpyxl`.

Incluye cuatro hojas:

- **Ventas:** mínimo 300 registros ficticios de enero a marzo de 2026, con fecha, pedido, producto, categoría, cantidad, precio, costo, canal y método de pago.
- **Productos:** catálogo, categorías, precios y costos.
- **Metas:** objetivos mensuales ficticios.
- **Instrucciones:** cómo modificar el Excel y actualizar el dashboard.

Aplica formato profesional, tablas, filtros y moneda MXN. Identifica claramente todos los datos como simulación académica.

### 2. Conexión real con Excel

Utiliza:

- **Frontend:** HTML, CSS, JavaScript y Chart.js.
- **Backend:** Python y FastAPI.
- **Base de datos de demostración:** Excel mediante `openpyxl`.

El dashboard debe leer los datos directamente del Excel. Al modificar una cifra, guardar el archivo y pulsar **«Actualizar datos»**, los indicadores y gráficos deberán actualizarse sin modificar código.

### 3. Dashboard premium

Diseña una interfaz extraordinariamente elegante, estilo software corporativo de alta gama:

- Azul petróleo, grafito, blanco cálido y acentos dorados.
- Sidebar, tarjetas KPI, gráficos interactivos y animaciones sutiles.
- Diseño responsive, minimalista y profesional.

**Indicadores:** ventas totales, pedidos, ticket promedio, unidades vendidas, costos, utilidad bruta, margen bruto, crecimiento mensual, productos más vendidos y cumplimiento de metas.

**Gráficos:** evolución de ventas, ingresos vs. costos, ventas por categoría, productos destacados y metas vs. resultados.

Incluye filtros por fecha, producto y categoría, tabla de ventas y exportación de reportes.

Todos los cálculos deben provenir del Excel y ser matemáticamente correctos.

### 4. Integración con Puerto A&M

Inspecciona primero el proyecto existente.

Si ya está creada la página web de Puerto A&M con su chatbot, **consérvala e integra el dashboard como una sección administrativa**, sin eliminar funciones existentes.

Mantén separada la información administrativa de la página pública. Si todavía no existe el portal, construye el dashboard de forma independiente, listo para integrarse después.

### 5. Ejecución y validación

Trabaja autónomamente: crea archivos, instala dependencias, programa, ejecuta y corrige errores.

Comprueba que:

1. El Excel contiene los 300 registros.
2. El dashboard consulta realmente el archivo.
3. Los KPIs y gráficos muestran cálculos correctos.
4. Los filtros funcionan.
5. Cambiar una venta en Excel modifica el dashboard al actualizar.
6. La aplicación funciona en computadora y celular.

**No termines hasta probar la conexión real.**

Al finalizar, inicia el servidor local, abre el dashboard en el navegador si es posible y entrega instrucciones sencillas para editar el Excel y volver a ejecutar la aplicación.

**Prioridades: conexión real con Excel → precisión de los datos → diseño premium → experiencia de usuario.**

El resultado debe parecer un software auténtico de Business Intelligence, con información 100 % ficticia para nuestra práctica de Top Learning.
```

### C-04 · 00:45:21 · PROMPT (landing + agente IA con n8n + panel privado)

- **Estado:** VIGENTE al enviarse; **luego recortado** (alcance reducido por C-13)
- **Relación entre versiones:** Alcance corregido por C-13 (01:44:17)
- **Contexto en la transcripción:** L379-447 ("un prompt que no sea muy largo"; nueva conversación y carpeta)
- **Herramienta/destino:** OpenCode (2.º proyecto, carpeta distinta al dashboard)
- **Nota:** Incluye n8n, panel administrativo financiero (CFDI, bancos, National Soft). Clasificar el panel/n8n como arquitectura FUTURA, no realizada en la sesión.
- **Línea en `chat.txt`:** 200

```text
Crea una **landing page premium para Puerto A&M**, un restaurante, con diseño corporativo moderno, minimalista y elegante, utilizando blanco, azul profundo, animaciones fluidas y una experiencia visual de primer nivel.

Integra un **chat con un agente de inteligencia artificial** conectado a n8n, capaz de consultar información, responder preguntas y ejecutar automatizaciones reales.

El sistema debe tener dos experiencias:

1. **Página pública:** presentación del restaurante, servicios, contacto y un asistente de IA para atención al cliente, preguntas frecuentes y solicitudes.
2. **Panel administrativo privado:** un agente financiero inteligente que permita consultar ventas, egresos, facturas CFDI, bancos, pagos pendientes, proveedores, movimientos de caja y reportes de National Soft. Debe integrarse con los workflows existentes de n8n, Google Drive y Gmail, generar reportes, detectar anomalías y explicar indicadores financieros mediante lenguaje natural.

Diseña un **dashboard ejecutivo con métricas, gráficas y un chat tipo ChatGPT**, donde el administrador pueda preguntar: «¿Cuánto gastamos este mes?», «¿Qué facturas faltan?» o «¿Cómo van las ventas?».

**Prioriza seguridad, autenticación, datos reales y reutilización de automatizaciones existentes.** Nunca expongas información financiera en la página pública ni inventes resultados.

Construye una aplicación funcional, responsive, con frontend y backend, estética de startup tecnológica de alto nivel y arquitectura preparada para producción. No quiero un mockup: implementa lo que permitan las conexiones disponibles y señala únicamente las integraciones pendientes.
```

### C-05 · 01:03:28 · PROMPT (chat de IA en el dashboard)

- **Estado:** VIGENTE
- **Relación entre versiones:** Dictado en L655-662; luego pegado en el chat
- **Contexto en la transcripción:** L645-672
- **Herramienta/destino:** OpenCode (proyecto dashboard)
- **Nota:** Regla estricta: solo datos del dashboard/Excel; si falta información no inventar; pide un buen soulmd.
- **Línea en `chat.txt`:** 219

```text
Agrega una seccion extra al dashboard de un chat, para ahi añadir un chat de Inteligencia Artificial, pero con una regla estricta de que solo este basado en los datos de el dashboard y de el excel, que conteste cuyalquier duda y si no hay informacion no la invente, dale un buen soulmd para contestar correctamente con los datos correspondientes
```

### C-06 · 01:05:29 · ENLACE (no es prompt)

- **Estado:** —
- **Relación entre versiones:** —
- **Contexto en la transcripción:** L692-704
- **Herramienta/destino:** Navegador
- **Nota:** https://openrouter.ai/ (sitio oficial). El profesor aclara que si el enlace con "/" final no funciona se quita la barra (L705).
- **Línea en `chat.txt`:** 228

```text
https://openrouter.ai/
```

### C-07 · 01:11:06 · PROMPT (conectar API de OpenRouter de DEMO y probar modelos)

- **Estado:** VIGENTE; **la práctica de pegar la key con este texto es INSEGURA**
- **Relación entre versiones:** Se envía junto con la key (L754-767); misma instrucción en el 2.º proyecto (L782-789)
- **Contexto en la transcripción:** L751-790
- **Herramienta/destino:** OpenCode (ambos proyectos)
- **Nota:** El profesor pegó su key en el prompt y reconoció "mala práctica" (L769-774). En las guías: sustituir por entorno secreto de backend; esta línea se cita solo como EN CLASE.
- **Línea en `chat.txt`:** 234

```text
ES UNA API DE prueba , solamente para la demo, añade la api, y prueba que los modelos corran correctamente, quiero un modelo free de openrouter que si pueda copntestar correctamente y no se termine rapido el uso
```

### C-08 · 01:29:39 · PROMPT (abrir dashboard y acelerar procesos)

- **Estado:** VIGENTE (para alumnos atascados)
- **Relación entre versiones:** **Reemplazado por C-09** (misma frase con prefijo)
- **Contexto en la transcripción:** L965-982
- **Herramienta/destino:** OpenCode
- **Nota:** Para quienes OpenCode seguía "pensando" sin terminar.
- **Línea en `chat.txt`:** 240

```text
Abre el dashboard actualizado en mi navegador, abrelo con la funcion de el asistente de ia, y si hace falta un proceso por terminar, apuralo
```

### C-09 · 01:30:49 · PROMPT (repetición con prefijo "Acelera los procesos")

- **Estado:** VIGENTE
- **Relación entre versiones:** Reemplaza a C-08 (C-09 = "Acelera los procesos " + C-08)
- **Contexto en la transcripción:** L984-995
- **Herramienta/destino:** OpenCode
- **Nota:** El profesor lo "vuelve a copiar" a petición de Alumna C.
- **Línea en `chat.txt`:** 246

```text
Acelera los procesos Abre el dashboard actualizado en mi navegador, abrelo con la funcion de el asistente de ia, y si hace falta un proceso por terminar, apuralo
```

### C-10 · 01:31:48 · PROMPT (sincronizar Excel y corregir soulmd)

- **Estado:** VIGENTE
- **Relación entre versiones:** Dirigido sobre todo a Alumna H (+ captura del error), L998-1007
- **Contexto en la transcripción:** L996-1007
- **Herramienta/destino:** OpenCode (dashboard)
- **Nota:** Respuesta a la contingencia "No puedo consultar pedidos individuales en línea…".
- **Línea en `chat.txt`:** 249

```text
Sincroniza los datos del excel para que el agente conteste, y que no me mande error, que tenga una buena sincronizacion y corrige el soulmd
```

### C-11 · 01:32:42 · PROMPT (crear repositorio y publicar el dashboard en Pages)

- **Estado:** VIGENTE
- **Relación entre versiones:** Se repite en forma de landing en C-23
- **Contexto en la transcripción:** L1008-1013 (dictado y pegado)
- **Herramienta/destino:** OpenCode + GitHub CLI/Pages
- **Nota:** Solo para quien ya terminó la práctica. Pages publica solo estáticos (ver clarificación).
- **Línea en `chat.txt`:** 252

```text
Crea un nuevo repositorio en Github, con el nombre de el dashboard y publicalo en una page y dame el link publico
```

### C-12 · 01:43:02 · PROMPT (diagnóstico "pendiente de conexión")

- **Estado:** VIGENTE
- **Relación entre versiones:** Responde a Alumna D (01:41:48)
- **Contexto en la transcripción:** L1079-1086
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Pide distinguir error de API / modelo saturado / saturación de la API. Contiene erratas literales ("sayure").
- **Línea en `chat.txt`:** 258

```text
Dime si pendiente de conexion es un error d emi api? el modelo esta saturado o sayure la api? si es el modelo busca un modelo que si logre responder
```

### C-13 · 01:44:17 · PROMPT (alcance: landing + chat de servicio al cliente SIN n8n)

- **Estado:** **VIGENTE — corrección prioritaria**
- **Relación entre versiones:** Corrige/recorta C-04
- **Contexto en la transcripción:** L1098-1104
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Instrucción citada en mayúsculas por el profesor. Para el MVP del manual tiene prioridad cronológica sobre C-04.
- **Línea en `chat.txt`:** 267

```text
SOLO POR AHORA QUIERO LA LANDING PAGE CON EL CHAT DE SERVICIO AL CLIENTE, SIN N8N DE POR MEDIO
```

### C-14 · 01:50:03 · PROMPT (crear menú demo costero)

- **Estado:** VIGENTE
- **Relación entre versiones:** Texto incluido en C-15 y C-16
- **Contexto en la transcripción:** L1173-1182
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Para que el agente tenga datos que decir (DEMO SIMULADA).
- **Línea en `chat.txt`:** 282

```text
crea un demo, de un menu de el restaurant en comida costera
```

### C-15 · 01:53:30 · PROMPT (soul.md de reservas/pedidos/atención + menú demo)

- **Estado:** REEMPLAZADO
- **Relación entre versiones:** **Reemplazado por C-16** (que añade la última cláusula)
- **Contexto en la transcripción:** L1214-1228
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** El profesor olvidó pedir añadir el menú al soul.md y al contexto (L1229-1236).
- **Línea en `chat.txt`:** 285

```text
agrega un buen soulmd, para que pueda hacer las reservaciones, pueda tomar los pedidos y ser completamente autonomo para atender a los clientes, crea un demo, de un menu de el restaurant en comida costera, que sea amable, que convenza a los clientes de comprar los platillos y los antoje de comprar los platillos
```

### C-16 · 01:54:15 · PROMPT (soul.md definitivo + menú en soul.md y contexto)

- **Estado:** **VIGENTE — versión final**
- **Relación entre versiones:** Reemplaza a C-15 (= C-15 + ", añade el menu a el soulmd y a el contexto de el agente")
- **Contexto en la transcripción:** L1229-1238
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Pide un agente "completamente autónomo" para reservas y pedidos: en las guías debe contrastarse con la necesidad de escritura real validada (ver §Fidelidad).
- **Línea en `chat.txt`:** 288

```text
agrega un buen soulmd, para que pueda hacer las reservaciones, pueda tomar los pedidos y ser completamente autonomo para atender a los clientes, crea un demo, de un menu de el restaurant en comida costera, que sea amable, que convenza a los clientes de comprar los platillos y los antoje de comprar los platillos , añade el menu a el soulmd y a el contexto de el agente
```

### C-17 · 02:02:26 · ENLACE (no es prompt)

- **Estado:** —
- **Relación entre versiones:** —
- **Contexto en la transcripción:** L1316-1317
- **Herramienta/destino:** Navegador
- **Nota:** https://supabase.com/ (sitio oficial); "vayan iniciando sesión".
- **Línea en `chat.txt`:** 294

```text
https://supabase.com/
```

### C-18 · 02:09:13 · PROMPT (memoria con Supabase; abrir navegador para iniciar sesión)

- **Estado:** REEMPLAZADO (v1 de 4)
- **Relación entre versiones:** Reemplazado por C-19 → C-20 → C-22
- **Contexto en la transcripción:** L1381-1397
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Primera versión de la petición de memoria persistente.
- **Línea en `chat.txt`:** 300

```text
añade supabase para la memoria de este proyecto, quiero que el agente o chat tenga memoriaq y no olvide lo que esta hablando con los clientes, abre en el nevagedor supabase y dejame iniciar sesion yo ahi
```

### C-19 · 02:11:52 · PROMPT (Supabase v2: sesión ya iniciada, usar navegador integrado)

- **Estado:** REEMPLAZADO (v2 de 4)
- **Relación entre versiones:** C-19 = "ya esta iniciado sesion, entonces con el navegador integrado, despliega toda la memoria en supabase" + C-18
- **Contexto en la transcripción:** L1423-1429
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Se manda después de que el alumno inicia sesión en Supabase.
- **Línea en `chat.txt`:** 303

```text
ya esta iniciado sesion, entonces con el navegador integrado, despliega toda la memoria en supabase añade supabase para la memoria de este proyecto, quiero que el agente o chat tenga memoriaq y no olvide lo que esta hablando con los clientes, abre en el nevagedor supabase y dejame iniciar sesion yo ahi
```

### C-20 · 02:13:23 · PROMPT (Supabase v3: usar el navegador de OpenCode)

- **Estado:** REEMPLAZADO (v3 de 4)
- **Relación entre versiones:** C-20 = "quiero que uses el navegador de opencode, como tal el navegador de opencode ya esta iniciado sesion," + C-19 sin la cláusula inicial
- **Contexto en la transcripción:** L1441-1448 (error "no tengo herramientas de navegador")
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Respuesta al aviso del agente de no tener herramientas de navegador.
- **Línea en `chat.txt`:** 306

```text
quiero que uses el navegador de opencode, como tal el navegador de opencode ya esta iniciado sesion, entonces con el navegador integrado, despliega toda la memoria en supabase añade supabase para la memoria de este proyecto, quiero que el agente o chat tenga memoriaq y no olvide lo que esta hablando con los clientes, abre en el nevagedor supabase y dejame iniciar sesion yo ahi
```

### C-21 · 02:14:01 · ENLACE (no es prompt) — ejemplo histórico del profesor

- **Estado:** —
- **Relación entre versiones:** —
- **Contexto en la transcripción:** L1449-1455
- **Herramienta/destino:** Navegador
- **Nota:** Dashboard publicado del profesor. EJEMPLO HISTÓRICO DE LA CLASE; puede no estar disponible: asternodelab.github.io/puerto-am-dashboard/ .
- **Línea en `chat.txt`:** 309

```text
https://asternodelab.github.io/puerto-am-dashboard/
```

### C-22 · 02:16:41 · PROMPT (Supabase v4: controlar el navegador y desplegar la nueva organización)

- **Estado:** **VIGENTE — versión más completa de la memoria**
- **Relación entre versiones:** C-22 = "Usa el navegador controlalo y despliega ahi la nueva organizacion tu " + C-20
- **Contexto en la transcripción:** L1476-1483
- **Herramienta/destino:** OpenCode (landing)
- **Nota:** Para Alumno F, que veía "crear nueva organización". El agente puede pedir pasos humanos (crear organización, nombre) y hay que decirle "terminamos".
- **Línea en `chat.txt`:** 312

```text
Usa el navegador controlalo y despliega ahi la nueva organizacion tu quiero que uses el navegador de opencode, como tal el navegador de opencode ya esta iniciado sesion, entonces con el navegador integrado, despliega toda la memoria en supabase añade supabase para la memoria de este proyecto, quiero que el agente o chat tenga memoriaq y no olvide lo que esta hablando con los clientes, abre en el nevagedor supabase y dejame iniciar sesion yo ahi
```

### C-23 · 02:24:33 · PROMPT (repositorio nuevo + landing con IA en página pública)

- **Estado:** VIGENTE
- **Relación entre versiones:** Variante landing de C-11
- **Contexto en la transcripción:** L1556-1575
- **Herramienta/destino:** OpenCode + GitHub CLI/Pages
- **Nota:** Pausa Supabase para que todos consigan un enlace público. Pages no ejecuta backend.
- **Línea en `chat.txt`:** 321

```text
Crea un nuevo repositorio en github y despliega en una page publica esta landing page con la IA desplegada igual
```

### C-24 · 02:33:57 · ENLACE (no es prompt) — ejemplo histórico del profesor

- **Estado:** —
- **Relación entre versiones:** —
- **Contexto en la transcripción:** L1703
- **Herramienta/destino:** Navegador
- **Nota:** Landing en GitHub Pages. EJEMPLO HISTÓRICO DE LA CLASE; puede no estar disponible: asternodelab.github.io/puerto-am-landing/ . Se mostró que el chat solo usaba motor local.
- **Línea en `chat.txt`:** 324

```text
https://asternodelab.github.io/puerto-am-landing/
```

### C-25 · 02:52:08 · ENLACE REPETIDO (no es prompt)

- **Estado:** —
- **Relación entre versiones:** Repite C-24
- **Contexto en la transcripción:** L1925-1929
- **Herramienta/destino:** Navegador
- **Nota:** Reenvío del enlace de Pages tras el rediseño (histórico).
- **Línea en `chat.txt`:** 330

```text
https://asternodelab.github.io/puerto-am-landing/
```

### C-26 · 02:53:05 · ENLACE (no es prompt) — ejemplo histórico del profesor

- **Estado:** —
- **Relación entre versiones:** —
- **Contexto en la transcripción:** L1925-1941
- **Herramienta/destino:** Navegador
- **Nota:** Despliegue en Vercel de la landing (ejemplo histórico: puerto-am-landing-eduvo1.vercel.app; puede no estar disponible). En ese momento el backend seguía en construcción y el sitio no abría (L1933, L1940).
- **Línea en `chat.txt`:** 333

```text
https://puerto-am-landing-eduvo1.vercel.app
```

### C-27 · 02:56:53 · ENLACE REPETIDO (no es prompt)

- **Estado:** —
- **Relación entre versiones:** Repite C-26
- **Contexto en la transcripción:** L1958-1961
- **Herramienta/destino:** Navegador
- **Nota:** Reenvío ("les voy a mandar el link de nuevo").
- **Línea en `chat.txt`:** 336

```text
https://puerto-am-landing-eduvo1.vercel.app
```

### C-28 · 03:00:31 · ENLACE REPETIDO (no es prompt)

- **Estado:** —
- **Relación entre versiones:** Repite C-26
- **Contexto en la transcripción:** L2012-2016 (aprox.)
- **Herramienta/destino:** Navegador
- **Nota:** Tercer envío; sin confirmación de funcionamiento end-to-end en las fuentes.
- **Línea en `chat.txt`:** 342

```text
https://puerto-am-landing-eduvo1.vercel.app
```

### C-29 · 03:06:18 · COMANDO (diagnóstico)

- **Estado:** VIGENTE (soporte)
- **Relación entre versiones:** Usado con Alumna C
- **Contexto en la transcripción:** L2129-2146 ("open code out list" en la transcripción)
- **Herramienta/destino:** Terminal de Windows
- **Nota:** `opencode auth list`. Se pidió para entender por qué no se cargaban modelos. La salida no se narra. Comando exacto del chat; efecto real PENDIENTE DE COMPROBAR en documentación oficial.
- **Línea en `chat.txt`:** 345

```text
opencode auth list
```

## 2. Mensajes de alumnos (anonimizados)

| ID | Hora | Autor | Texto (literal, URLs personales omitidas) | Relación / respuesta |
|---|---|---|---|---|
| S-01 | 00:24:22 | Alumna A | duda como haces el meta promping en chat gpt? | Pregunta de metaprompting. Respuesta oral L225-233 → C-01. |
| S-02 | 00:27:12 | Alumna B | hola, me perdi, que vamos a poner de estas opciones? | Duda: "me perdí, ¿qué vamos a poner de estas opciones?" Respuesta: usar solo el último (C-03); L249-268. |
| S-03 | 00:42:22 | Alumna B | duda, la instruccicón en inglés es mejor¡ | Duda: la instrucción en inglés. Respuesta oral L407-417 (ver mapa §4 nº 10). |
| S-04 | 00:42:32 | Alumna B | ? | Continuación ("?") de la duda anterior. |
| S-05 | 00:46:32 | Alumna A | ya me dio el dashboard | Informa que ya obtuvo el dashboard (≈19 min después de C-03). |
| S-06 | 01:04:04 | Alumna D | Hola, Què es un soulmd? | Duda: qué es un soulmd. Respuesta oral L679-691. |
| S-07 | 01:05:12 | Alumna D | ok, gracias | Cierre de la duda anterior. |
| S-08 | 01:05:32 | Alumna B | desde cero porfa | Petición: OpenRouter "desde cero". El profesor guía el alta y la creación de key en vivo (L692-750). |
| S-09 | 01:28:54 | Alumna E | Yo me quede desde la Api, me di cuenta que yo no tengo dada de alta esa aplicacion, entonces, solo ten go mi Dashboard y mi puerto, lo voy hacer en repetición de clase. | Se quedó en la API (no tenía cuenta/"aplicación dada de alta"); lo hará en repetición. Sin respuesta directa en clase. |
| S-10 | 01:30:21 | Alumna H | A mi da esta informacion al preguntar al chat, No puedo consultar pedidos individuales en línea. Para darte seguimiento, por favor indícame tu **nombre, teléfono y número de pedido** (si lo tienes) y con gusto lo revisamos por teléfono o correo. | Reporta la respuesta de contingencia del chat del dashboard. Respuesta: C-10 + captura del error (L996-1007). |
| S-11 | 01:41:48 | Alumna D | En la landing, le di mi API, pero mi agente dice que està pendiente de conexiòn | Reporta "pendiente de conexión" en la landing. Respuesta: C-12 (L1079-1086). |
| S-12 | 01:43:26 | Alumna H | http://127.0.0.1:8001/ (localhost, no es URL pública) | Comparte un enlace local (127.0.0.1:8001). No es público. |
| S-13 | 01:43:28 | Alumno F | a mi de dice "El webhook está vacío, así que la sección muestra “Sin webhook · pendiente” y el chat responde en modo pendiente. Para activarla, inicie sesión con la clave del archivo indicado, pegue su webhook de n8n en Configuración del workflow y pruebe la conexión. " | Reporta mensaje de webhook de n8n vacío. Respuesta: C-13 (sin n8n); L1087-1104. |
| S-14 | 01:44:50 | Alumna A | http://127.0.0.1:8000/ (localhost, no es URL pública) | Comparte un enlace local (127.0.0.1:8000). No es público. |
| S-15 | 01:46:33 | Alumna I | [URL personal de alumno omitida] | Comparte un enlace público temporal de su equipo (túnel). El profesor lo ve y comenta (L1131-1156, L1331). |
| S-16 | 01:48:11 | Alumna I | ok | Confirmación breve. |
| S-17 | 01:48:42 | Alumna H | [URL personal de alumno omitida] | Comparte su página publicada en GitHub Pages (el profesor la ve, L1124-1126, L1178-1192). |
| S-18 | 01:54:34 | Alumno F | http://localhost:8080 (localhost, no es URL pública) | Comparte un enlace local (localhost:8080). Respuesta oral: es el despliegue local en su computadora (L1325-1333). |
| S-19 | 02:03:38 | Alumna D | [URL personal de alumno omitida] | Comparte su página publicada en GitHub Pages; el profesor la revisa (L1327-1346). |
| S-20 | 02:17:25 | Participante G | todo este ir y venir entre plataformas e ias, lo puedo hacer tambien si me enfoco en chatgpt, estudiandolo a profundidad, o necesariamente es como lo enseñas aqui | Pregunta si puede hacer todo enfocándose en ChatGPT. Respuesta oral L1489-1532. |
| S-21 | 02:17:51 | Participante G | o claude | Completa la pregunta anterior ("o claude"). |
| S-22 | 02:46:39 | Alumno F | Parece que ya pude, aun no tiene informacion la pagina, pero creo que asi es el proceso. [URL personal de alumno omitida] | Informa que logró publicar una página aún sin información; comparte su enlace (omitido). El profesor la ve en L1913-1923. |
| S-23 | 02:59:51 | Alumna A | [URL personal de alumno omitida] | Comparte un enlace de un entorno de desarrollo en la nube (Codespaces; omitido). |
| S-24 | 03:13:26 | Alumna D | Disculpa, últimas dudas muy básicas: vercel es como github? si uso cualquiera de los dos, entonces ya no requiero contratar dónde hostear mis páginas? solo que no se ve la liga tan profesional, cierto? | Pregunta final: Vercel vs GitHub y hosting. Respuesta **inconclusa** (L2287-2297; la grabación termina a las 03:14:59). |
| S-25 | 03:14:14 | Alumno J | Hola, Kevin. ¿Puedo quedarme un momento contigo después de la grabación de la sesión? Esto porque tengo una consulta que no veo el caso que quede grabada | Pide hablar con el profesor tras la grabación. El profesor acepta (L2292-2294). No se detalla el motivo. |

## 3. Genealogía de versiones (cuál reemplaza a cuál)

| Cadena | Orden | Versión vigente | Cómo difieren |
|---|---|---|---|
| Dashboard Puerto A&M | C-01 (cabecera) → C-02 (TRUNCADO) → **C-03** | **C-03** (00:27:22) | C-02 es el prompt "maestro" largo (empresarial, 10 indicadores, filtros, etc.); el profesor dice que se quedó corto en el chat y manda el compacto. Los alumnos debían pegar solo C-03 (L251-253, L265-266, L272-275). |
| Abrir dashboard / acelerar | C-08 → **C-09** | C-09 (01:30:49) | C-09 = "Acelera los procesos " + C-08 (misma instrucción). |
| Landing | C-04 → recorte **C-13** | C-04 con el alcance de C-13 | C-13 obliga a "SOLO… LANDING PAGE CON EL CHAT DE SERVICIO AL CLIENTE, SIN N8N". El panel administrativo/n8n queda como arquitectura futura. |
| Menú y soul.md | C-14 ⊂ C-15 → **C-16** | C-16 (01:54:15) | C-15 = C-14 + soul.md (reservas, pedidos, tono vendedor); C-16 = C-15 + ", añade el menu a el soulmd y a el contexto de el agente". |
| Memoria Supabase | C-18 → C-19 → C-20 → **C-22** | C-22 (02:16:41) | Cada versión antepone una cláusula a la anterior: sesión ya iniciada (C-19); usar el navegador de OpenCode (C-20); controlarlo y desplegar la nueva organización (C-22). Mismo texto base: memoria persistente para que el agente no olvide lo que habla con los clientes. |
| Repo + Pages | C-11 (dashboard) · C-23 (landing con IA) | ambas | Dos instrucciones paralelas, una por proyecto. |
| Enlaces repetidos | C-24 → C-25; C-26 → C-27 → C-28 | — | Reenvíos del mismo enlace histórico; no aportan contenido nuevo. |

## 4. Prompts e instrucciones dictados oralmente por el profesor — SOLO TRANSCRIPCIÓN

Citas breves del reconocimiento automático (pueden tener errores). "≈" = minuto aproximado según las marcas de 5 min. Ninguno de estos textos aparece en el chat. Las claves/enlaces personales NO se reproducen.

| ID | ≈ Minuto (líneas) | Cita breve | Herramienta | Naturaleza | Nota |
|---|---|---|---|---|---|
| T-01 | ≈00:25–00:27 (L229-237) | "Mejor este prompt, optimízalo. No inventes información… decirle para qué… para Open Code con el modelo high 4… investiga primero cómo es que recibe ese modelo el mejor prompt" | ChatGPT | Receta oral de metaprompting | Complementa C-01: añadir destino (herramienta/modelo) y pedir investigar la forma de prompt óptima. SOLO TRANSCRIPCIÓN. |
| T-02 | ≈00:33 (L310-327) | "Mejor este prompt, no inventes datos y optimízalo:" + plantilla + "es para una cafetería que lleva 10 años" | ChatGPT | Demostración en vivo | Resultado leído en L325-327 ("Actúa como un experto en business intelligence…"). Muestra cómo adaptar una plantilla genérica. |
| T-03 | ≈00:48 (L480-481) | "corrige la conexión de el Excel hacia el dashboard. Mejórala y que cada cambio sea fácil de hacer." | OpenCode (dashboard) | Instrucción de corrección | Dicho "ahorita les paso el prompt"; no consta en el chat. |
| T-04 | ≈00:51 (L501) | "le voy a decir que ya cerré el archivo" | OpenCode | Instrucción de seguimiento | Tras el error de permiso denegado. |
| T-05 | ≈00:52 (L508) | "vuelve a abrir el Excel en mi computadora" | OpenCode | Instrucción operativa | Aprovecha que el agente abre archivos por comandos (L509-511). |
| T-06 | ≈01:23 (L885) | "corrige el fallo" | OpenCode | Instrucción de corrección | Ante "fail to fetch" (L891). |
| T-07 | ≈01:26 (L924-928) | "añaden en su soul.md que nunca vaya a compartir datos confidenciales" | OpenCode | Ajuste de soul.md (ofrecido) | "Si quieren ahorita también les pego" — no aparece en el chat. No sustituye autenticación/RLS. |
| T-08 | ≈01:44 (L1105-1106) | "Abre la landing page en mi navegador" | OpenCode | Instrucción operativa | "en un mensaje separado". |
| T-09 | ≈01:46 (L1152-1154) | "decirle… que para GitHub publique también la parte del asistente, pero con IA, porque creo que solo lo puso con motor local" | OpenCode | Sugerencia a Alumna I | Diagnóstico: chat solo con respuestas predefinidas. |
| T-10 | ≈01:45–01:46 (L1127, L1158) | "ponga un link diferente con un nombre diferente" | OpenCode | Sugerencia general | Evitar repositorios/páginas con el mismo nombre. |
| T-11 | ≈02:01 (L1333) | "díganle Open Code que se conecte bien a la CLI y que les dé el link de la página" | OpenCode | Sugerencia a Alumno F | Para pasar de localhost a enlace público. |
| T-12 | ≈02:25 (L1593) | "ahorita solo GitHub Page" | OpenCode | Respuesta a las preguntas del agente | Para limitar el despliegue de esa fase. |
| T-13 | ≈02:36 (L1734) | "conéctate a este repositorio y vamos a hacer cambios en él" (+ enlace del repo) | Claude Code | Instrucción de arranque | Pantalla del profesor; "ya no se los voy a copiar… va a ir en el PDF" (L1744-1746). Enlace no reproducido. |
| T-14 | ≈02:37 (L1747-1748) | "usa la terminal y usa aquí [el] repositorio" | Claude Code | Alternativa si no reconoce el repo | Transcripción dudosa. |
| T-15 | ≈02:39 (L1756-1758) | "Primer cambio, quiero que la landing page tenga un diseño de restaurant costero con animaciones… lanza un subagente" | Claude Code | Prompt de rediseño | Con subagente. |
| T-16 | ≈02:41 (L1778-1780) | "Segundo cambio es el despliegue en Supabase… con la conexión que tienes aquí directa en Cloud. Lanza un subagente de Sonnet 5.5 medio para cada integración." | Claude Code | Prompt de integración | Principal "Opus 5.5"; subagentes "Sonnet 5.5, esfuerzo medio" (como se dijo en clase). |
| T-17 | ≈02:42 (L1787-1789) | "otro despliegue… para que pueda servir nuestro agente de inteligencia artificial en línea" | Claude Code | Tercer cambio implícito | Backend de IA en Vercel; **no se dicta el texto completo**. |
| T-18 | ≈02:42 (L1794-1795) | "si no tienes la conexión, usa el navegador de Claude Code y despliega en Supabase ahí la información. Yo inicio sesión y lo hago." | Claude Code | Instrucción de contingencia | Patrón: el humano inicia sesión. |
| T-19 | ≈02:45 (L1865-1867) | "Ya inicié sesión, tú sigue con el despliegue en el navegador" | Claude Code / OpenCode / ChatGPT | Instrucción genérica al alumno | "no reacciona en cuanto ya inició sesión; tenemos que recordarle". |
| T-20 | ≈02:47 (L1886) | "sube el rediseño" ("le vamos a poner siempre que sí, que sí lo suba") | Claude Code | Autorización | Publicación del rediseño en GitHub Pages. |
| T-21 | ≈02:51 (L1900-1906) | "pon la API funcionando y también termina el despliegue de Supabase y dame el link de Vercel para probarlo" | Claude Code | Prompt de cierre | **Acompañado de la API key pegada** (práctica insegura; no se reproduce). |
| T-22 | ≈02:55 (L1943-1945) | "acelera el despliegue en Vercel… lanza subagentes de Sonnet 5.5 medio para lo que hace falta" | Claude Code | Instrucción de aceleración | Último intento de dejar Vercel funcionando. |
| T-23 | ≈02:29 (L1661-1664) | "cambiaras de modelo a cualquiera de estos… gratuitos… DeepSeek… MiMo… y que le mandes ese PDF" | OpenCode | Sugerencia a Alumna C | Cambiar de modelo gratuito y dejar al agente trabajando con el PDF. |
| T-24 | ≈03:05 (L2094-2098) | "diagonal model… tiene que ser en minúscula" | OpenCode | Comando `/model` | Resultado: "sin resultado de modelos" (L2103). |
| T-25 | ≈03:10 (L2246-2252) | "Desplegar todas esas herramientas en Cloud… para que si un día se traban" | (notas del profesor para los PDF) | Nota personal | "lo escribí todo mal, es recordatorio para mí". Fundamenta la ruta alternativa con Claude Code. |
| T-26 | ≈01:21–01:26 (L860-863, L902-917) | "¿Quién eres?" · "cuál fue el último pedido" · "crea una imagen de un gato" · si vende palas/cemento | Chat IA del dashboard | Preguntas de prueba (no prompts de construcción) | Método "preguntas irracionales" (L912-917): un agente que inventa precios/links falla. |
| T-27 | ≈01:49–01:52, 02:04 (L1166-1206, L1339-1341, L1897) | "hola, qué platillos" · "quiero reservar una mesa" · "¿Quién eres?" · "¿Qué haces?" · "véndeme un costal de cemento" · "horarios" · "que me des tu menú" | Chat IA de la landing | Preguntas de prueba | Distingue motor local vs IA conectada (L1201, L1206). |
| T-28 | ≈02:06–02:12 (L1369-1372, L1431-1436) | "quiero hacer un pedido de 10 tostadas de atún" · "sí, agrégalo y confirmo el pedido" · "¿por qué no te acuerdas?" | Chat IA de la landing (local) | Prueba de memoria | Demuestra el olvido del pedido y la respuesta "cada interacción empieza desde cero". |

**Total del profesor inventariado:** 29 mensajes de chat + 28 elementos solo-transcripción (T-01 a T-25: instrucciones/recetas/sugerencias; T-26 a T-28: series de preguntas de prueba) = **57 entradas**.

## 5. Cobertura del inventario mínimo del megaprompt (§4)

| # | Elemento del megaprompt | Dónde está | Observaciones |
|---|---|---|---|
| 1 | Meta-prompt "Mejora este prompt, optimízalo, no inventes información" | C-01 + T-01 + T-02 | Explicar uso con datos reales vs DEMO (T-02: el profesor lo hace con contexto de negocio inventado/propio). |
| 2 | Dashboard: versión extensa TRUNCADA y versión definitiva (~00:27) | C-02 (truncado) y **C-03 (definitivo)** | C-03 es el que los alumnos debían copiar. |
| 3 | Landing restaurante con agente IA, panel y n8n | C-04 | MVP sin n8n = C-13. |
| 4 | Chat en el dashboard limitado a datos (~01:03) | C-05 (+ T-07 regla de confidencialidad) | — |
| 5 | Crear/configurar API OpenRouter DEMO (~01:11) | C-07 (+ C-06 enlace) | Sustituir pegar-key por entorno secreto. |
| 6 | Abrir dashboard / detener ejecución atascada (~01:29–01:31) | C-08, C-09 | — |
| 7 | Resincronizar Excel y corregir soul.md (~01:31) | C-10 | — |
| 8 | Repositorio + GitHub Pages (~01:32) y nueva instrucción para landing (~02:24) | C-11, C-23 | — |
| 9 | Diagnosticar "pendiente de conexión", API, modelo saturado, webhook vacío (~01:43) y quitar n8n (~01:44) | C-12, C-13 | Webhook vacío = mensaje de Alumno F (S-13). |
| 10 | Menú costero ficticio (~01:50) | C-14 | — |
| 11 | soul.md de ventas, reservas, pedidos y menú (~01:53–01:54) | C-15 → C-16 | — |
| 12 | Memoria persistente con Supabase; logueo supervisado (~02:09–02:17) | C-18, C-19, C-20, C-22 | — |
| 13 | Subir al repo, migrar a Claude Code, mejorar diseño y desplegar en Vercel (oral desde ~02:35) | T-13 a T-22 | **No está en el chat**: solo oral; prompts no dictados completos. |
| 14 | `opencode auth list` (~03:06) | C-29 (+ T-24 `/model`) | Salida no narrada. |
| 15 | Otros prompts/preguntas | T-02 a T-12, T-23, T-25 a T-28; preguntas de alumnos S-01 a S-25 | — |

## 6. Notas de fidelidad para los redactores

1. **No completar C-02.** Citarlo como "primer prompt largo, truncado por el chat" y dirigir a C-03.
2. **C-07 y T-21:** reflejan una práctica insegura (key en el prompt). Presentarlos como EN CLASE con ACLARACIÓN TÉCNICA POSTERIOR; la versión mejorada usa variable de entorno de backend.
3. **C-15/C-16:** piden un agente "completamente autónomo… reservaciones… pedidos". En la sesión el agente no demostró guardar reservas/pedidos; la versión mejorada debe exigir escritura real validada y estados "solicitud DEMO".
4. **C-04** mezcla n8n y un panel con datos financieros (CFDI, bancos, proveedores, National Soft): usar solo como "arquitectura futura / no realizada".
5. Todo enlace del profesor es **ejemplo histórico de la clase; puede no estar disponible**. No se reproducen enlaces de alumnos.
