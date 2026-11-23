# 00 · MAPA DE FUENTES Y CRONOLOGÍA — E1601.2 · Sesión del domingo 22/11/2026

> Elaborado por el Agente A (analista forense del material) el 23/11/2026, a partir de la lectura íntegra, línea por línea, de `transcript.txt` (2 299 líneas) y `chat.txt` (353 líneas). Todo lo que sigue procede de esas fuentes salvo donde se indica **Inferido**.
> Convenciones: **L###** = número de línea de `transcript.txt` (base 1). Las marcas `HH:MM:SS` del chat son exactas (segundo); las marcas de la transcripción son solo cada 5 min, por lo que cualquier minuto intermedio es **aproximado** (≈). Alumnos anonimizados con los códigos del brief (Alumna A … Alumno J); el resto = "otro participante". El profesor (Kevin Martínez) sí se nombra.
> Etiquetas de contenido usadas: EN CLASE · PROMPT MEJORADO · COMPLEMENTO DEL PROFESOR · ACTUALIZACIÓN EXTERNA · DEMO SIMULADA · PENDIENTE DE COMPROBAR · ACLARACIÓN TÉCNICA POSTERIOR · RECONSTRUCCIÓN PEDAGÓGICA.

---

## 1. Registro de fuentes verificadas

### 1.1 Fuentes de la sesión (prioridad máxima)

| Fuente | Ruta verificada | Tamaño | Líneas | Rango temporal | Calidad |
|---|---|---|---|---|---|
| Transcripción automática de la reunión (notas del bot de la plataforma) | `src/transcript.txt` | 209 387 bytes · UTF-8 con BOM · saltos CRLF | 2 299 (la última sin salto final) | `00:00:00` → "La reunión finalizó después de **03:14:59**" (L2298). Marcas cada 5 min: `00:05:00` (L27) … `03:10:00` (L2197) = 38 marcas | **Transcripción automática con errores** (el propio archivo lo advierte en L2299). Sin marcas por intervención; sin separación fiable entre oraciones; nombres propios y términos técnicos mal reconocidos; 12 líneas de ruido atribuidas al bot ("M.", "Yeah", "Ô", "ше", "Ok,"…) que deben ignorarse |
| Chat de la reunión | `src/chat.txt` | 17 618 bytes · UTF-8 · LF | 353 | `00:24:22` → `03:14:17` | Íntegro, literal y con marca temporal por mensaje (formato `HH:MM:SS.mmm,HH:MM:SS.mmm` + `Autor: texto`). **54 mensajes**: 29 del profesor (20 prompts/instrucciones, 1 comando, 8 enlaces) y 25 de alumnos. El primer prompt del dashboard quedó **TRUNCADO** por el propio chat (termina en "Los filtros deberán actualizar", L110 del chat). Una búsqueda de patrones de secretos (`sk-`, `eyJ`, `AIza`, `ghp_`) no encontró ninguna clave ni en el chat ni en la transcripción |
| Instrucciones maestras del encargo | `src/megaprompt.md` | 41 916 bytes | 277 | — | Define alcance, reglas y 5 PDFs. Se contrastó contra las fuentes: ver §8 |
| Brief común de agentes | `scratchpad/BRIEF_COMUN.md` | — | 36 | — | Reglas de anonimización, secretos y etiquetas |

**Archivos NO disponibles en este entorno** (verificado con `ls`: solo hay 3 archivos en `src/`): la imagen de la publicación del muro, el Temario institucional y la Guía General. Todo lo que se afirme sobre ellos queda **PENDIENTE DE COMPROBAR**. El profesor menciona que publicó en el muro (a) la imagen de la línea del tiempo de vibe coding (L28-30, L343), (b) el PDF de la clase anterior (L193-196, L340-342).

**Participantes** (cabecera L3): 15 entradas = profesor + 1 bot de notas + 13 asistentes. Diez de ellos tienen código en el brief (A–J); tres más son "otros participantes" que no intervinieron de forma identificable.

### 1.2 Normalizaciones aplicadas al texto docente (reconocimiento automático → forma correcta)

| Como aparece en la transcripción | Se normaliza a | Notas |
|---|---|---|
| Open Router, Open Routro, Open Routroer | **OpenRouter** | L676, L694 y otras |
| GitHop, Gitcop, GitCop, GPHop, GitHub | **GitHub** | "GitHop CLI", "GitHops Li", "Gitcop LI" (L1014, L1050) = **GitHub CLI** |
| Versel, Verel, Bersel | **Vercel** | L1596, L1800 |
| Supase, Supas, Suabase, Tupabase, Supace, Superbase | **Supabase** | L599, L1256 |
| Open Code, OpenCot, "Codet", "el CO/Code" | **OpenCode** | contexto: la aplicación de terminal/escritorio |
| Cloud, Cloud Code, CloudCot, CloudC, Cloud Cod | **Claude / Claude Code** | **Atención**: "la nube de Antropic" (L829-832) es "cloud" literal = nube; no se normaliza |
| APK, APC, APIC, AP, Appicase, APICAS, "lápiz", Appi | **API key / API / APIs** | según contexto: "mi APK" = mi API key; "las APIs" = APIs |
| VIP coding, B coding, vive coding, m coding, BP coding | **vibe coding** | L23, L86, L154 |
| Soul MD, Sobre MD, SOBMD, soulmd, WMD | **soul.md** | el chat escribe `soulmd` |
| Postgradase | **PostgreSQL / Postgres** | L1256 |
| André Carpaty, Carpatti, Carpat | **Andrej Karpathy** | L31-66 |
| Yemini | Gemini | L134, L1517 |
| Antropic | Anthropic | L830 |
| Sonet | Sonnet | L45, L1780 |
| Super Wisper | SuperWhisper | L46 (cita del tuit) |
| Lobable, Bzero, Volt | Lovable, v0, Bolt | L136, L349 (Inferido para "B repete" = Replit y "MUS" = Manus, L136-137: **PENDIENTE DE COMPROBAR**) |
| Cloudfare | Cloudflare | L1331, L1977 |
| Chrome (en Supabase) | cron (tareas programadas) | L1304-1305 |
| Sbox | sandbox | L1308-1311 |
| N8N, N8 | n8n | L844, L1100 |
| Deepsic, Mimo | DeepSeek, MiMo (modelos gratuitos listados en OpenCode) | L1662 |
| "open code out list", "open code espacio list" | `opencode auth list` | el chat (03:06:18) da el comando exacto |
| "diagonal model" | `/model` | L2094-2098 |
| "high 4 / hi 4 / high 4 flash" | nombre de modelo **sin identificar con certeza** | L200-201, L895; **PENDIENTE DE COMPROBAR** (no inventar el nombre real) |
| "Fable 5.2", "Astra 6.2", "OPU 5.5 / Opus 5.5", "Sonet 5.5" | tal como los dijo el profesor | L817-819, L1761-1783, L1945-1947; no se verifican fuera de la clase: citarlos como "nombres dichos en clase" |
| "Fighter, Power B y W" | no identificado (L288, probablemente herramientas de BI) | **PENDIENTE DE COMPROBAR** |
| "Bem Mats" | no identificado (L63) | **PENDIENTE DE COMPROBAR** |

**FastAPI, Chart.js y openpyxl solo aparecen en los prompts del chat**; el profesor **nunca los menciona oralmente**. Por tanto, que OpenCode haya construido realmente con esas tecnologías es **Inferido** (la prueba "headless" y el "endpoint" de L893-896 son compatibles, pero no lo confirman). El nombre completo "Kevin Daniel Martínez Orozco" tampoco figura en las fuentes (solo "Kevin Martinez"): procede del megaprompt/brief.

### 1.3 Marcas de 5 minutos de la transcripción → línea

| Marca | Línea | Marca | Línea | Marca | Línea | Marca | Línea |
|---|---|---|---|---|---|---|---|
| 00:05 | 27 | 00:55 | 561 | 01:45 | 1111 | 02:35 | 1715 |
| 00:10 | 67 | 01:00 | 619 | 01:50 | 1175 | 02:40 | 1772 |
| 00:15 | 124 | 01:05 | 688 | 01:55 | 1244 | 02:45 | 1836 |
| 00:20 | 169 | 01:10 | 752 | 02:00 | 1296 | 02:50 | 1888 |
| 00:25 | 219 | 01:15 | 804 | 02:05 | 1345 | 02:55 | 1946 |
| 00:30 | 286 | 01:20 | 851 | 02:10 | 1399 | 03:00 | 2012 |
| 00:35 | 331 | 01:25 | 918 | 02:15 | 1461 | 03:05 | 2114 |
| 00:40 | 380 | 01:30 | 980 | 02:20 | 1516 | 03:10 | 2197 |
| 00:45 | 430 | 01:35 | 1033 | 02:25 | 1577 | fin | 2298 (03:14:59) |
| 00:50 | 486 | 01:40 | 1053 | 02:30 | 1660 | | |

Sincronía chat ↔ transcripción: coherente en general (p. ej. la duda del chat de las 00:24:22 se lee justo después de la marca 00:25, L224-225); hay desfases de unos segundos a ~7 min porque el profesor lee/comenta mensajes con retraso (ver §8).

---

## 2. Tabla cronológica detallada (65 filas)

Leyenda de verificación: **T** = Observado en transcripción · **C** = Observado en chat · **I** = Inferido. Los códigos `C-nn` y `T-nn` remiten a `fuentes_editables/research/inventario_chat.md`.

| # | Intervalo aprox. (líneas) | Intervención | Herramienta | Instrucción | Resultado observado | Error / incidencia | Verif. |
|---|---|---|---|---|---|---|---|
| 1 | 00:00–00:03 (L5-26) | Saludo; el profesor no podía encender el micrófono; anuncia semana 13 "fundamentos de vibe coding y creación de dashboards con prompts"; repetir el proceso de la clase pasada y ver teoría nueva | Plataforma de videollamada + presentación | — | Arranque de la sesión | Audio cortado reportado en otra clase; pide avisar si ocurre (L18-21) | T |
| 2 | 00:03–00:10 (L27-66) | Línea del tiempo publicada en el muro: Karpathy 2017 (redes neuronales como forma de programar), copilotos 2023-24, "vibe coding" feb 2025 (lee el tuit, L44-54), "Software 3.0" jun 2025, ingeniería agéntica, feb 2026, término emergente "Bem Mats" | Presentación / navegador (tuit) | — | Contexto histórico del término | Datos dichos de memoria ("si no me equivoco", L31) → verificar (ver §4) | T |
| 3 | 00:10–00:12 (L67-81) | Duda del profesor sobre si el tema ya se dio; **Alumna I** aclara que lo repetido eran las herramientas, no el tema | — | — | Confirma que no se repite el tema | — | T |
| 4 | 00:12–00:19 (L82-168) | Objetivo de la sesión; definición de vibe coding; cambio de paradigma del programador; "tres factores"; "no es magia"; principios de prompts efectivos (contexto, ejemplos, iterar) | Presentación | — | Marco conceptual | Afirmaciones tentativas sobre programadores/empleo (L104-106, L134-147) | T |
| 5 | 00:20–00:22 (L169-198) | Transición a dashboards; pide abrir OpenCode; pregunta si hay dudas de vibe coding (manos); anuncia que subirá al muro el PDF de la clase anterior con prompts mejorados | OpenCode (apertura lenta) | Abrir OpenCode | OpenCode del profesor abre (L186-187) | Lentitud de OpenCode "estos días" (L183) | T |
| 6 | 00:22–00:25 (L199-218) | Elige modelo gratuito en OpenCode ("high 4 flash", nombre dudoso) y anuncia que hará un prompt desde cero con metaprompting | OpenCode | Selección de modelo | "Vamos a seguir ocupando high 4" | Nombre del modelo no verificable | T |
| 7 | 00:24–00:27 (L219-248; chat 00:24:22, 00:26:16, 00:26:36) | **Alumna A** pregunta en el chat cómo hacer metaprompting en ChatGPT; el profesor responde oralmente y envía **C-01** ("Mejora este prompt , optimizalo , no inventes informacion y dame un buen prompt:") y **C-02** (primer prompt largo del dashboard) | ChatGPT (metaprompting) / chat de la reunión | C-01 + C-02 | C-02 **se truncó** en el chat | Truncamiento del mensaje por longitud (el profesor lo explica en L251) | C+T |
| 8 | 00:27 (L249-254; chat 00:27:12, 00:27:22) | **Alumna B** escribe "me perdí, ¿qué vamos a poner de estas opciones?"; el profesor envía **C-03** (versión compacta definitiva) y dice "el de abajo, el último que les acabo de mandar" | Chat | C-03 = prompt autorizado | Los alumnos deben copiar solo C-03 | Confusión por tres mensajes seguidos | C+T |
| 9 | 00:27–00:29 (L255-284) | **Alumna E** (oral) avisa que subió dos prompts y otra compañera también se perdió; el profesor aclara que se pega **solo el último**; indica a los alumnos que lo pasen a OpenCode (el suyo ya estaba en una carpeta anterior) | OpenCode | Pegar C-03 | Alumnos empiezan a ejecutar C-03 | — | T |
| 10 | 00:29–00:35 (L285-345) | Teoría de dashboards (definición, flujo de 4 pasos, buenas prácticas); demo en ChatGPT: "Mejor este prompt, no inventes datos y optimízalo: …" con una cafetería de 10 años (L310-330); critica los "paquetes de prompts" | ChatGPT | Metaprompt (T-02) | Prompt específico generado desde una plantilla genérica | — | T |
| 11 | 00:35–00:40 (L331-379) | Buenas prácticas (revisar cifras, pedir autorización antes de cambiar datos); transición de dashboards a apps (Lovable, v0, Bolt); explica por qué enseña OpenCode y no Claude Code (gratuito); pregunta quién tiene resultado; **Alumna C**: "Sigue trabajando" | OpenCode | — | A ~00:38 aún nadie confirma resultado | OpenCode tarda en generar el dashboard | T |
| 12 | 00:40–00:43 (L379-417; chat 00:42:22, 00:42:32) | Presenta la práctica de landing + agente de restaurante (memoria de pedidos, reclamos); anuncia OpenRouter; **Alumna B** pregunta si la instrucción en inglés es mejor → el profesor dice que sí, ~20 % de ahorro de tokens | ChatGPT | — | Respuesta oral | Afirmación sin evidencia (ver §4) | C+T |
| 13 | ≈00:43 (L418-429) | Termina el dashboard del profesor (~15 min después de C-03); muestra KPIs: ventas totales, pedidos, ticket medio, unidades, crecimiento, margen, utilidad, costos, ranking, ventas por categoría, ingresos vs costos, metas vs resultados | OpenCode + navegador | — | Dashboard generado localmente | — | T |
| 14 | 00:45 (L430-447; chat 00:45:21) | El profesor pega **C-04** (landing + agente conectado a n8n + panel financiero) y pide pegarlo en **nueva conversación/carpeta** para no borrar el dashboard | OpenCode (2.º proyecto) | C-04 | Alumnos y profesor lanzan la 2.ª práctica en paralelo | C-04 incluye n8n y panel privado (luego recortado) | C+T |
| 15 | 00:45–00:47 (L448-461; chat 00:46:32) | Muestra el Excel generado ("aproximadamente 364 datos", columnas pedido, producto, categoría, cantidad, precio, costo) y su dashboard; **Alumna A**: "ya me dio el dashboard" | OpenCode, Excel | — | Excel DEMO creado; abre dashboard | — | C+T |
| 16 | 00:47–00:49 (L462-485) | Prueba de conexión: añade "varios ceros" en Excel, ventas totales 117 000; al actualizar **no cambia** | Excel + dashboard local | T-03: "corrige la conexión del Excel hacia el dashboard. Mejórala y que cada cambio sea fácil de hacer" | Primera prueba fallida | Conexión Excel→dashboard no reflejaba el cambio | T |
| 17 | 00:49–00:51 (L486-499) | Propone un chat conversacional para registrar ventas; OpenCode informa de **"permiso denegado al abrir el Excel"** (el agente explica que Windows bloquea la lectura mientras el archivo está abierto) | OpenCode | — | Causa encontrada | Archivo Excel abierto/bloqueado | T |
| 18 | 00:51–00:53 (L500-515) | Cierra el Excel; actualiza; "ya funcionó"; crecimiento mensual se dispara; OpenCode abre el Excel por comandos | OpenCode | T-04/T-05 | Cambio real reflejado | — | T |
| 19 | 00:53–00:55 (L516-535) | Copia una fila de pedido y le cambia el número; pedidos **360 → 361** | Excel + dashboard | — | Cifra de pedidos actualizada | Se menciona un valor "enorme" copiado; la explicación oral es confusa (ID/valor). Nota: evitar IDs duplicados | T |
| 20 | 00:55–00:57 (L536-558) | Explica el caso "negocio con computadora de registro": "si lo despliego, todos verán el dashboard con los datos que cambien en mi computadora"; pide opiniones (manos: **Alumno F**, **Alumna D**, **Alumna C**) | Dashboard local/desplegado | — | Afirmación general | Discutible (ver §4 nº 14) | T |
| 21 | 00:55–01:00 (L558-644) | **Alumna C** pregunta cómo hacerlo con Excels reales por área; el profesor ofrece dos opciones (conectar varios o unificar), Supabase como base de datos y selector de dataset por área (propuesta que le da el propio OpenCode, L611-618) | OpenCode, (Supabase mencionado) | "Conecta estos Excel" | Respuesta conceptual; sin implementar | Se afirma "no hay límite técnico real" y que no se modifican los Excel | T |
| 22 | 01:00–01:03 (L645-672; chat 01:03:28) | Siguiente paso: añadir al dashboard un chat de IA anclado a los datos; dicta y pega **C-05** | OpenCode | C-05 | Instrucción enviada a OpenCode | — | C+T |
| 23 | 01:04–01:05 (L679-691; chat 01:04:04, 01:05:12) | **Alumna D** pregunta "¿qué es un soulmd?"; el profesor: archivo Markdown, "alma" del agente, "lo correcto es que es un system prompt" | — | — | Alumna D: "ok, gracias" | — | C+T |
| 24 | 01:05–01:07 (L692-710; chat 01:05:29, 01:05:32) | OpenRouter: envía el enlace (C-06); **Alumna B**: "desde cero porfa"; guía: iniciar sesión con Google, botón verde "Get API key" | OpenRouter (web) | — | Alumnos inician sesión | El enlace con "/" final podía trabarse (L705) | C+T |
| 25 | 01:07–01:10 (L710-750) | Crea una API key en vivo: nombre "clase E1601.2"; recomienda expiración de 7 días; límite de crédito (o "sin límite" si la cuenta nunca se fondeó, "no hay riesgo de nada", L730) | OpenRouter | — | Key creada (no se muestra el valor) | Mensaje de riesgo discutible (ver §4) | T |
| 26 | 01:10–01:12 (L751-790; chat 01:11:06) | Pega su key **en el prompt a OpenCode** junto con **C-07** ("ES UNA API DE prueba…"); advierte "no me vayan a pegar su APK en el chat"; reconoce "mala práctica" y que lo correcto es `.env` (L770); repite en el 2.º proyecto | OpenCode (ambos proyectos) | C-07 + key | OpenCode elige un modelo gratuito; antes de la key el chat operaba con "motor local de respuestas exactas" (L778) | **Práctica insegura** (clave en prompt) reconocida por el profesor | C+T |
| 27 | 01:13–01:20 (L791-852) | **Alumna I** pregunta qué hace OpenRouter y si una key de ChatGPT/Claude serviría igual; el profesor explica el puente a modelos, ventajas de OpenRouter (cambio de modelo, uso gratuito limitado), privacidad empresarial vía API y n8n | — | — | Explicación oral | Afirmaciones sobre privacidad y gratuidad (ver §4 nº 24-25) | T |
| 28 | 01:20–01:22 (L853-878) | Aparece el asistente en el dashboard; "¿Quién eres?" → OpenRouter ya conectado; "¿cuál fue el último pedido?" → responde que hay 360 pedidos pero la herramienta devuelve solo los primeros registros; el texto del asistente dice que no usa información externa ni inventa cifras | Dashboard + OpenRouter | — | Primera respuesta con IA | "Ya ahí nos falló" (L878): no obtiene el último pedido | T |
| 29 | 01:22–01:24 (L879-908) | Error **"fail to fetch"**; el profesor pide a OpenCode "corrige el fallo" (T-06): servidor vivo, prueba headless OK, el fallo fue por reinicios con la pestaña abierta; verifica ventas totales y ticket promedio ("correcto") | OpenCode | T-06 | Chat responde con cifras correctas | Reinicio del servidor mientras la pestaña consultaba | T |
| 30 | 01:24–01:27 (L909-928) | Pruebas "irracionales": "crea una imagen de un gato", si vende palas/cemento; prueba de datos confidenciales (no responde como debería); propone añadir regla de confidencialidad en soul.md | Dashboard (chat IA) | T-07 | Resultado de cada prueba **no se narra** (solo "aquí no está contestando como debería") | Fuga potencial de datos del Excel | T |
| 31 | 01:27–01:30 (L929-982; chat 01:28:54) | Pregunta quién ya prueba el chat; **Alumna C** y **Alumno F**: OpenCode "no termina ningún proceso"; **Alumna E** (chat): se quedó en la API, "no tengo dada de alta esa aplicación", lo hará en repetición; el profesor envía **C-08** | OpenCode | C-08 "Abre el dashboard actualizado… apúralo" | Los alumnos atascados deben "apurar" a OpenCode | Procesos que no avanzan | C+T |
| 32 | 01:30–01:32 (L983-1007; chat 01:30:21, 01:30:49, 01:31:48) | **Alumna C** pide copiar el texto; **C-09** (= C-08 con "Acelera los procesos"); **Alumna H** reporta respuesta del chat "No puedo consultar pedidos individuales en línea…"; el profesor envía **C-10** ("Sincroniza los datos del excel…corrige el soulmd") + captura del error | OpenCode | C-09, C-10 | Intento de resincronizar datos y corregir soul.md | Respuesta de contingencia del chat (sin sincronización) | C+T |
| 33 | 01:32–01:35 (L1008-1032; chat 01:32:42) | **C-11** "Crea un nuevo repositorio en Github… publícalo en una page y dame el link público"; OpenCode "revisa si GitHub CLI está disponible"; el profesor remite al PDF de la clase pasada y explica el problema de los dashboards en web sin base de datos (sincronización depende de que la computadora esté encendida) y el plan del nivel 2 | OpenCode → GitHub CLI/Pages | C-11 | OpenCode empieza la publicación | — | C+T |
| 34 | 01:36–01:41 (L1037-1052) | **Descanso** de ~5 min ("nos vemos 10:42") | — | — | Pausa | El profesor cita las 10:41/10:42 (no cuadra con 08:52 + 01:36 ≈ 10:28); se usa la marca de transcripción | T |
| 35 | 01:41–01:43 (L1053-1078; chat 01:41:48) | Pide subir los enlaces de dashboards al muro; **Alumna C** pregunta si el dashboard "se descarga": el profesor: es un enlace; los cambios se hacen "sobre ese mismo link"; **Alumna D** (chat): "mi agente dice que está pendiente de conexión" | — | — | — | "Pendiente de conexión" en la landing | C+T |
| 36 | 01:43–01:45 (L1079-1110; chat 01:43:02, 01:43:26, 01:43:28, 01:44:17) | Diagnóstico: **C-12** (¿error de API, modelo saturado?); **Alumno F** lee: "El webhook está vacío… pegue su webhook de n8n…"; **Alumna H** comparte `127.0.0.1:8001`; el profesor envía **C-13** ("SOLO POR AHORA QUIERO LA LANDING PAGE CON EL CHAT DE SERVICIO AL CLIENTE, SIN N8N") y T-09 ("abre la landing page en mi navegador") | OpenCode | C-12, C-13 | n8n sale del MVP; "lo vamos a conectar en el nivel dos" (L1104) | Landing generada con módulo n8n/webhook vacío | C+T |
| 37 | 01:44–01:48 (L1106-1160; chat 01:44:50, 01:46:33, 01:48:11, 01:48:42) | Llegan enlaces: **Alumna A** `127.0.0.1:8000` (local), **Alumna I** (túnel de Cloudflare, URL omitida), **Alumna H** (github.io, URL omitida). El profesor ve que muchos enlaces muestran el mismo sitio local; sugiere nombres de repo distintos; en el sitio de **Alumna I** el dashboard "aparece conectado" y "sí se actualizan los datos"; el chat solo responde con "motor local" → sugiere pedir publicar también el asistente con IA (T-10) | Navegador | T-10, T-11 | Primeras publicaciones de dashboard | Enlaces locales vs públicos confundidos | C+T |
| 38 | 01:48–01:50 (L1161-1172) | Landing del profesor: reservas, eventos privados, FAQ; pregunta "¿qué platillos?" → "Por ahora no puedo compartir platillos sin una fuente oficial"; decide añadir menú | Landing local | **C-14** (01:50:03) "crea un demo, de un menu… comida costera" | Menú demo pendiente | Sin fuente de menú (respuesta correcta de no inventar) | C+T |
| 39 | 01:50–01:52 (L1173-1213) | Muestra la landing de **Alumna H**: reservas, chat con IA real ("Soy el asistente de Puerto AM"), bloquea "véndeme un costal de cemento"; "no es motor local" | Landing de alumna | — | Chat responde con IA y rechaza lo ajeno al negocio | — | T |
| 40 | 01:52–01:55 (L1214-1243; chat 01:53:30, 01:54:15, 01:54:34) | **C-15** y **C-16** (soul.md con reservas, pedidos, menú, tono vendedor; C-16 añade "añade el menu a el soulmd y a el contexto de el agente"; el profesor lo manda de nuevo por olvido, L1229-1236); **Alumno F** comparte `localhost:8080` | OpenCode | C-15 → C-16 | Menú y soul.md en proceso | — | C+T |
| 41 | 01:55–01:58 (L1244-1254) | Explica por qué un agente necesita memoria (cliente que recarga la página); menciona menú 4D como idea | — | — | Motivación de Supabase | — | T |
| 42 | 01:56–02:02 (L1254-1316; chat 02:02:26) | **Presentación de Supabase**: PostgreSQL, Auth, datos en tiempo real, Storage, cron, Edge Functions, vectores; plan gratuito (50 000 usuarios activos, 500 MB, 1 GB…) y Pro ($25); lo que usarán: base de datos y autenticación; envía **C-17** (enlace) | Supabase (web) | — | Contexto de herramienta | Cifras dichas oralmente → verificar (ver §4 nº 30) | C+T |
| 43 | 02:02–02:05 (L1317-1346; chat 02:03:38) | Dice que hoy quizá no se conecte; menciona Claude/Codex trabajando sobre el repo en GitHub; explica `localhost` a **Alumno F**; revisa el enlace publicado de **Alumna D** ("ya está desplegado"; menú poco claro: "falta contexto") | Navegador | — | Landing de Alumna D visible en la web | Menú no cargado correctamente | C+T |
| 44 | 02:05–02:09 (L1347-1397) | En su landing local pide el menú (responde), hace pedido de "10 tostadas de atún" y ceviche; el agente acepta y luego **olvida** los platillos ("no tengo a la vista los platillos"); decide integrar Supabase | Landing local | — | **Demostración de la falta de memoria** | Agente sin memoria | T |
| 45 | 02:09–02:13 (L1398-1445; chat 02:09:13, 02:11:52, 02:13:23) | **C-18** (memoria con Supabase; abre navegador para que el profesor inicie sesión), **C-19** (ya inició sesión; usar navegador integrado), **C-20** (usar el navegador de OpenCode). El agente abre Supabase pero informa: "no tengo herramientas de navegador para hacer clic dentro del dashboard, solo puedo abrir URLs" | OpenCode + navegador | C-18 → C-19 → C-20 | OpenCode abre Supabase, sin poder operarlo | Falta de herramienta de navegador en la sesión | C+T |
| 46 | ≈02:12 (L1431-1437) | Pregunta a su agente "¿por qué no te acuerdas?": responde "no conservo los mensajes anteriores… cada interacción empieza desde cero. Si me cuentas el día, hora y número de personas puedo registrar la solicitud para que el equipo te confirme" | Landing local | — | Confirma que la causa es la falta de memoria | — | T |
| 47 | 02:14 (L1449-1457; chat 02:14:01) | Muestra su dashboard publicado (**C-21**, enlace histórico): "ya está el link público… cualquiera ya puede ocupar ahí mi dashboard y de hecho ocupar la inteligencia artificial" | GitHub Pages | — | Dashboard público | Cómo se protege la key/IA en una página estática no se explica | C+T |
| 48 | 02:15–02:17 (L1460-1487; chat 02:16:41) | **Alumno F**: Supabase abierto pero "crear nueva organización"; el profesor: usar el navegador, hacer lo que pida (crear organización, nombre) y decir "terminamos"; **C-22** (usa el navegador y despliega la nueva organización) | OpenCode + Supabase | C-22 | Alumno F con Supabase abierto | Paso humano requerido (crear organización) | C+T |
| 49 | 02:17–02:22 (L1488-1538; chat 02:17:25, 02:17:51) | **Participante G** pregunta si puede centrarse en ChatGPT o Claude; el profesor: todo el código se puede crear con ChatGPT, pero API, despliegue y base de datos requieren cuentas/servicios; "mínimo cuatro herramientas"; presupuesto "como 70 mensuales" (L1531; moneda no dicha) | — | — | Respuesta oral amplia | Varias afirmaciones absolutas (ver §4 nº 37-40) | C+T |
| 50 | 02:22–02:24 (L1539-1575; chat 02:24:33) | **Alumno F**: Supabase "solo de forma local; me pide dos APIs para hacerlo público"; el profesor **pausa Supabase** y se centra en el despliegue en GitHub; envía **C-23** ("Crea un nuevo repositorio en github y despliega en una page publica esta landing page con la IA desplegada igual") | OpenCode → GitHub | C-23 | Intento de publicar la landing | Supabase no concluyó en alumnos | C+T |
| 51 | 02:25–02:27 (L1576-1622) | Pide que quien no desplegó hable; explica que GitHub **no ejecuta Python ni guarda la clave de OpenRouter** → hace falta backend (Vercel, "la siguiente clase") y Supabase para la memoria; "cuatro herramientas mínimas" | — | — | Marco arquitectónico correcto para Pages | — | T |
| 52 | 02:27–02:30 (L1623-1665) | **Alumno F**: GitHub le restringió temporalmente el uso ("tecleando a velocidad superhumana"); el profesor sugiere mandar la captura al muro y, si procede, crear nueva cuenta; **Alumna C**: OpenCode "no hace nada" si cambia de ventana; sugiere cambiar a otro modelo gratuito (DeepSeek, MiMo) y dejar a OpenCode trabajando con el PDF al terminar la clase | OpenCode, GitHub | — | Dos bloqueos sin resolver en directo | Límite/bloqueo de GitHub (causa no verificada); OpenCode congelado | T |
| 53 | 02:30–02:32 (L1672-1685) | **Alumna E**: se registró en Supabase pero al iniciar sesión sale "credencial no válida"; OpenCode le hizo el menú y todo lo demás | Supabase | — | Sin resolver en el momento | Inicio de sesión con Google vs credencial no válida | T |
| 54 | 02:32–02:35 (L1686-1715; chat 02:33:57) | El profesor **detiene la práctica grupal** ("vamos bastante adelantados"); anuncia que la siguiente clase será puro despliegue desde cero; muestra su landing en GitHub Pages (**C-24**): el chat funciona solo con "motor local"/respuestas predefinidas, **la IA no funciona en Pages** | GitHub Pages | — | Landing estática visible, sin IA | Limitación de GitHub Pages | C+T |
| 55 | 02:35–02:38 (L1716-1752) | Pasa a **Claude Code** ("modo rápido"): le da el enlace del repositorio y le pide conectarse; reconoce carpetas `frontend`, `backend`, `supabase`, `data`, `knowledge` | Claude Code + GitHub | T-14, T-15 | Repositorio conectado | A veces no reconoce el repo hasta pedirle "usa la terminal" (L1747) | T |
| 56 | 02:38–02:42 (L1753-1800) | **Primer cambio**: rediseño costero con animaciones; **segundo cambio**: despliegue en Supabase "con la conexión que tienes aquí directa"; lanza subagentes (principal "Opus 5.5", subagentes "Sonnet 5.5 esfuerzo medio") para rediseño, Supabase y backend de la IA en Vercel; indica que el proyecto de Vercel ya existe y está conectado a GitHub, "pero todavía no se puede usar el sitio" | Claude Code | T-16, T-17, T-18 | Tres subagentes en paralelo | — | T |
| 57 | 02:42–02:46 (L1801-1873) | Intenta iniciar sesión en Supabase desde Claude Code: la página se cierra porque el agente controla el navegador; tras iniciar sesión con otra cuenta, el agente **crea el proyecto** ("puerto AM landing"), elige región y contraseña de base de datos "sin que yo toque el teclado". **Alumna E** pregunta cómo hizo el inicio de sesión | Claude Code + Supabase | T-19 | Proyecto de Supabase creado (según lo narrado; **no se mostró** tabla, RLS ni memoria) | Sesión cerrada por el control del navegador | T |
| 58 | 02:46–02:52 (L1874-1932; chat 02:46:39) | Muestra el rediseño ("peces animados", tipografía, menú inventado); **Alumno F** logra su página en la web ("aún no tiene información la página, pero creo que así es el proceso"); el profesor **vuelve a pegar su API key en Claude Code** y pide "pon la API funcionando, termina el despliegue de Supabase y dame el link de Vercel" (T-21); GitHub Pages: "la publicación terminó bien" | Claude Code | T-20, T-21 | Landing rediseñada publicada en Pages | Key pegada otra vez en un prompt | C+T |
| 59 | 02:52–02:56 (L1925-1961; chat 02:52:08, 02:53:05) | Envía el enlace de Pages (**C-25**) y el de Vercel (**C-26**); **Alumna H** dice que ya funciona el diseño; "apenas está metiendo la parte de inteligencia artificial"; el enlace de Vercel **no abre** ("el backend en Vercel, por eso ese último link todavía no sirve", L1940); pide acelerar (T-22) | Claude Code / Vercel | T-22 | Diseño visible; backend no confirmado | Sitio de Vercel sin acceso/aún sin terminar | C+T |
| 60 | 02:56–03:00 (L1946-2011; chat 02:56:53, 02:59:51, 03:00:31) | Reenvía el enlace de Vercel (**C-27**); "ya creo que está… entren"; luego: "les va a pedir iniciar sesión… si no lo pueden ver, solo hace falta que termine de trabajar" (L1967-1968); **Alumna A** comparte un enlace de Codespaces (URL omitida); reenvía de nuevo (**C-28**). **Fin del bloque de despliegues sin prueba end-to-end confirmada** | Vercel | — | **No hay confirmación de que la IA/memoria funcionaran en Vercel** | Posible protección de despliegue o build en curso (Inferido) | C+T |
| 61 | ≈02:57–03:00 (L1962-1986) | **Tarea y cierre formal**: PDF de la práctica y PDFs de despliegue en el muro; mínimo tener sesión iniciada en Supabase y GitHub; enviar enlaces/evidencias por el muro; próxima clase el domingo siguiente | — | — | Promesas (ver §6) | — | T |
| 62 | 03:00–03:03 (L2012-2049) | Soporte: **Alumna D** pregunta por el valor de OpenCode (gratuito frente a Claude Code) y si publicar un dashboard sensible en GitHub lo deja desprotegido → "sí queda desprotegido… si alguien encuentra el link"; remedio dicho: eliminar el repositorio y dejarlo local | OpenCode / GitHub | — | Respuesta oral | Remedio incompleto (borrar el repo no deshace la exposición) | T |
| 63 | 03:03–03:09 (L2050-2178; chat 03:06:18) | Soporte con **Alumna C** (comparte pantalla): OpenCode no avanza si cambia de ventana; `/model` → "sin resultado de modelos"; el profesor pide ejecutar en la terminal `opencode auth list` (**C-29**; en la transcripción "open code out list"); hay confusión al pegar/escribir; diagnóstico: no recupera el catálogo de modelos / no conecta con el proveedor; probable reinstalación; promete mandar instrucciones por mensaje privado | OpenCode (Windows), terminal | C-29 | Resultado del comando **no se narra** | OpenCode sin lista de modelos; cuenta gratuita de Claude | C+T |
| 64 | 03:09–03:12 (L2179-2273) | Soporte con **Alumna E**: se perdió al intentar "instalar" OpenRouter; descargas de Vercel/Supabase; código de verificación de GitHub que no vio en OpenCode; el profesor explica el plan de PDFs (≈40 min; orden: clase completa → GitHub → Supabase → OpenRouter → Vercel; todo "desde cero"; incluirá ruta alternativa con Claude) | GitHub, OpenCode | — | Promesas | Código/2FA de GitHub no visto; confusión "OpenRouter instalado" | T |
| 65 | 03:12–03:15 (L2274-2299; chat 03:13:26, 03:14:14) | Despedida; recuerda evidencias por el muro; **Alumna D**: "¿Vercel es como GitHub? ¿con cualquiera ya no requiero hosting?"; el profesor empieza a responder ("Git… tiene los repositorios del código, pero solo los guarda… las landing page no es difícil publicarlas, pero cuando ya necesitas una aplicación con…") y **la grabación termina en medio de la frase** (03:14:59); **Alumno J** pide en el chat hablar con el profesor después de la grabación (el profesor acepta, L2292-2294; no se detalla el motivo) | — | — | Respuesta **inconclusa** | Cierre abrupto | C+T |

---

## 3. Bloques temáticos: qué ocurrió realmente

### 3.1 Teoría (≈00:00–00:20)
**Ocurrió (EN CLASE):** línea del tiempo del término vibe coding con la lectura del tuit original; definición ("describir en lenguaje natural lo que se quiere"); el rol del programador como dirección/pensamiento crítico; principios de prompts (contexto, ejemplos, iteración); metaprompting como acelerador; dashboards como caso de negocio (L168). **Terminado:** exposición completa. **No hubo:** diferencia explícita prototipo vs producción (aparece solo tangencialmente: "proyectos desechables" en el tuit, L52). **Pendiente de verificar:** hitos históricos y afirmaciones de empleo/calidad (ver §4).

### 3.2 Práctica 1 — Dashboard Puerto A&M (≈00:20–01:35)
- **Terminado (local):** Excel DEMO con ~364 filas / 360 pedidos y hojas Ventas, Productos, Metas, Instrucciones (L455, L581); dashboard con KPIs y gráficos (L421-423); prueba real de edición de valores y de pedidos (pedidos 360→361); caso de Excel abierto (permiso denegado) resuelto cerrando el archivo; chat de IA integrado con OpenRouter y respuestas correctas de ventas totales y ticket (L896-908); regla de confidencialidad propuesta para soul.md.
- **Demo / limitación:** el chat no localizó "el último pedido" (L874-878); las pruebas irracionales y de datos confidenciales se hicieron, pero **no se narra el resultado final** de las que fallaban; la respuesta de **Alumna H** (L996-997) mostró una contingencia sin sincronización.
- **En proceso al cierre del bloque:** publicación en GitHub Pages iniciada (C-11); varios alumnos con OpenCode atascado. El profesor publicó su dashboard más tarde (L1449-1455, enlace histórico) y **Alumna I** publicó con un túnel de Cloudflare (**Inferido**: URL tipo "trycloudflare" = túnel temporal a su equipo; no es alojamiento persistente).
- **Limitación explícita aceptada por el profesor:** la sincronización depende de la computadora encendida; la solución es una base de datos en la nube (nivel 2) (L1023-1030).

### 3.3 Práctica 2 — Landing + agente de restaurante (≈00:40–02:05)
- **EN CLASE:** C-04 (landing con n8n y panel financiero) → recortada a "solo landing con chat de servicio al cliente, sin n8n" (C-13, L1100-1104; n8n queda "para el nivel dos"). Menú costero DEMO y soul.md de atención/reservas/pedidos (C-14 → C-16).
- **Observado:** la landing del profesor decía "no puedo compartir platillos sin fuente oficial" antes del menú; la de **Alumna H** respondía con IA real y rechazaba preguntas ajenas; tras añadir menú, el agente respondió el menú pero **olvidó el pedido** (L1369-1379).
- **No terminado en clase:** reservas/pedidos **guardados** (el agente solo "registra la solicitud" verbalmente, L1436); no se demostró persistencia.
- **Diferenciación pedagógica clave (observada):** chat con **motor local de respuestas predefinidas** (L778-780, L1707-1710) vs chat realmente conectado a API (L1199-1206).

### 3.4 OpenRouter (≈01:05–01:20 y reaparece en 01:41–01:44, 02:52)
Inicio de sesión con Google, "Get API key", nombre, expiración (7 días recomendados), límite de crédito, key visible una sola vez (L792); pegado de la key en el prompt (práctica reconocida como insegura); elección automática de modelo gratuito por OpenCode (nombre no dicho); preguntas de **Alumna I** y confusión posterior de **Alumna E** ("instalar OpenRouter"). **No hubo** un recorrido por límites, errores 429/402 ni lista de modelos gratuitos; solo "modelo saturado / API agotada" como causas posibles (L1085-1086).

### 3.5 GitHub (≈01:30–02:35, y 03:09–03:12)
C-11 (repo + Pages) y C-23 (landing + IA); OpenCode intentó usar GitHub CLI; hubo enlaces `github.io` de varios alumnos y del profesor (no se reproducen los de alumnos); **Alumno F** fue restringido temporalmente por GitHub; **Alumna E** tuvo un código/2FA que no encontró. Conclusión del profesor: **GitHub (Pages) no ejecuta Python ni guarda la clave de OpenRouter** (L1612-1618, L1704-1711) → la IA no funciona en Pages.

### 3.6 Supabase (≈01:55–02:30 y 02:42–02:50)
Presentación conceptual con planes y productos; intento de configurar memoria con OpenCode (sin herramientas de navegador, organización por crear); **Alumno F** abrió Supabase solo localmente; **Alumna E**: "credencial no válida". En Claude Code, el profesor logró (según narra) que el agente creara el proyecto "puerto AM landing". **No se mostró** esquema, tablas, RLS, conexión ni prueba de memoria. **Estado: en proceso / no verificado.**

### 3.7 Claude Code + Vercel (≈02:35–03:00)
Transición de OpenCode a Claude Code conectándose al repo por enlace; subagentes; rediseño costero con animaciones (visible); GitHub Pages actualizado ("terminó bien"); proyecto de Vercel conectado a GitHub pero sitio inaccesible en ese momento; backend de IA en Vercel "en construcción"; el último enlace "te va a pedir iniciar sesión" / aún sin terminar. **Estado: parcialmente accesible; NO afirmar end-to-end.**

### 3.8 Dudas finales y soporte (≈03:00–03:15)
**Alumna C** (OpenCode sin modelos), **Alumna E** (OpenRouter/Supabase/GitHub), **Alumna D** (OpenCode vs Claude Code; privacidad; GitHub vs Vercel — pregunta final **sin respuesta completa en la grabación**), **Alumno J** (hablar tras la grabación). Cierre con promesas de PDFs (ver §6).

---

## 4. Afirmaciones tentativas o discutibles del profesor (para ACLARACIÓN TÉCNICA POSTERIOR)

> Se citan fragmentos breves del reconocimiento automático (pueden contener errores) con respeto; el objetivo es dar a los redactores qué verificar con fuente primaria, no cuestionar la intención pedagógica. Muchas son opiniones o simplificaciones razonables para principiantes.

| Nº | Línea | Cita breve | Tema | Por qué requiere aclaración | Etiqueta sugerida |
|---|---|---|---|---|---|
| 1 | L31 | "cofundador de Open AI… si no me equivoco" / 2017 | Karpathy | Dicho con duda; verificar rol, fecha y obra (Software 2.0) en fuentes primarias | ACTUALIZACIÓN EXTERNA |
| 2 | L38, L44-55 | "febrero del 2025 nace el término vibe coding" | Origen del término | Se lee el tuit; confirmar fecha/redacción exacta en la fuente | ACTUALIZACIÓN EXTERNA |
| 3 | L57 | "junio del 2025 sale Software 3.0… programamos en inglés" | Software 3.0 | Resumen libre; verificar contenido de la charla | ACTUALIZACIÓN EXTERNA |
| 4 | L62-64 | "Bem Mats… término emergente todavía no oficial" | Término no identificado | No se puede identificar; no incluir como hecho | PENDIENTE DE COMPROBAR |
| 5 | L104-106, L134-135 | "los modelos ya programan mucho mejor que la mayoría… mejor que cualquier programador" | Calidad de la IA | Opinión general; depende de tarea, supervisión y pruebas; no medida | ACLARACIÓN TÉCNICA POSTERIOR (opinión) |
| 6 | L138-145 | "la mayoría se está quedando sin trabajo… reemplazados por una suscripción" | Empleo de programadores | Afirmación empírica sin fuente; además contradice la diapositiva que cita (demanda > disponibilidad); el propio profesor lo califica de "difícil saber si es verdad" | ACLARACIÓN TÉCNICA POSTERIOR (no generalizable) |
| 7 | L148-149 | México "se tardaron mucho en añadirla… no veo gran uso" | Adopción empresarial | Percepción personal | COMPLEMENTO DEL PROFESOR (opinión) |
| 8 | L146 | "para hacer un dashboard es lo más fácil del mundo" | Dashboards | Un prototipo es fácil; un dashboard fiable (datos reales, auth, pruebas) no necesariamente | ACLARACIÓN TÉCNICA POSTERIOR |
| 9 | L292, L1767 | "miles de veces mejor" con datos reales / modelos de Claude | Hipérbole | Calidad depende de datos y modelo; no cuantificable | COMPLEMENTO DEL PROFESOR |
| 10 | L409-417 | "la instrucción en inglés… ahorra tokens… un 20 %" | Idioma y tokens | Cifra sin evidencia; el ahorro depende del tokenizador y del texto; la calidad en español suele ser muy buena | ACLARACIÓN TÉCNICA POSTERIOR (no generalizable) |
| 11 | L498, L505 | "Windows bloquea la lectura… si está abierto no vamos a poder actualizar" | Excel bloqueado | Fue la causa **observada en ese código**; depende del modo de lectura (copia temporal, solo lectura, motor) y del bloqueo de Excel | ACLARACIÓN TÉCNICA POSTERIOR (no universal) |
| 12 | L534-535 | "ni siquiera necesitamos añadir los datos con OpenCode, … alguien lo siga registrando" | Flujo manual | Válido en local; no escalable | COMPLEMENTO DEL PROFESOR |
| 13 | L531 | pedidos 361 por una fila copiada | Calidad de datos | Duplicar filas altera ventas; usar IDs únicos y probar reglas contables | ACLARACIÓN TÉCNICA POSTERIOR |
| 14 | L539-542 | "si yo lo despliego, todos van a poder ver el dashboard con los datos que estén cambiando en mi computadora" | Despliegue y Excel local | Solo ocurre si el backend corre en esa computadora (túnel/local); no en GitHub Pages ni en la nube. El profesor lo matiza en L1023-1029 | ACLARACIÓN TÉCNICA POSTERIOR |
| 15 | L573-575, L612, L639-640 | "no hay límite técnico real… nada más con que le digas que lo sincronice, lo hará correctamente" | Varios Excel | Sobrepromesa; requiere diseño, pruebas y esquemas homogéneos | ACLARACIÓN TÉCNICA POSTERIOR |
| 16 | L634-636 | "no te va a dañar tus Excel porque no los modificas" | Seguridad de archivos | Solo si el acceso es de lectura; el formulario del prompt original escribe en el Excel | ACLARACIÓN TÉCNICA POSTERIOR |
| 17 | L623-626 | OpenCode "permite subir esos Excel así como en Claude" | Carga de archivos | OpenCode trabaja con la carpeta del proyecto; verificar mecanismo | PENDIENTE DE COMPROBAR |
| 18 | L727-731 | "sin expiración… sin límite… no hay riesgo de nada" (cuenta no fondeada) | Seguridad de la key | Contradice la regla: incluso una key de demo merece límite/caducidad; si luego se fondea o hay créditos gratuitos, el riesgo existe | ACLARACIÓN TÉCNICA POSTERIOR |
| 19 | L721-725 | "me llegaron correos… modelos atacados" | Incidente | Anécdota no verificable | PENDIENTE DE COMPROBAR |
| 20 | L754-774 | Pegar la key en el prompt de OpenCode; "si no le ponemos que es de prueba llega a no querer hacerlo por temas de seguridad" | Gestión de secretos | El profesor reconoce "mala práctica"; presentar como NO recomendable; la key va en variable de entorno de backend (`.env`, ignorado por Git) | ACLARACIÓN TÉCNICA POSTERIOR |
| 21 | L792 | "solo la pueden ver una vez… no tienen que crear otra" | Key única visible | Se muestra al crearla; si se pierde, se crea otra y se revoca la anterior; verificar en la UI vigente | ACTUALIZACIÓN EXTERNA |
| 22 | L801-803 | OpenRouter da "modelos de Chat GPT… de forma gratuita"; "la API es una llave segura encriptada" | Qué es OpenRouter / API | Imprecisión: gratuitos son modelos específicos y limitados; una API key es una credencial, no un cifrado | ACLARACIÓN TÉCNICA POSTERIOR |
| 23 | L809-815 | "ya tuviera una key de ChatGPT o de Claude, sería usar exactamente lo mismo" | Reutilizar keys | Cada proveedor tiene su API/endpoint; OpenRouter es un enrutador con su propia key | ACLARACIÓN TÉCNICA POSTERIOR |
| 24 | L822-826 | "más de 600 o 700 modelos"; Google regala uso de API; ChatGPT/Claude "nulo o en extremo poco uso gratuito" | Catálogo y gratuidad | Cifras y planes cambian; verificar | ACTUALIZACIÓN EXTERNA |
| 25 | L828-834 | "si yo pago Anthropic… entrena sus modelos con la información de mi empresa. Por eso las empresas usan API… toda la IA corra en un servidor local… no tenga que salir a la nube" | **Privacidad** | Una API en la nube **no** es procesamiento local ni garantiza por sí sola que los datos no se retengan o usen; depende de políticas y planes del proveedor y de OpenRouter | ACLARACIÓN TÉCNICA POSTERIOR (crítica) |
| 26 | L920-928 | soul.md "restringirá el acceso a datos confidenciales" | Seguridad | Un soul.md es texto de instrucciones; no reemplaza autenticación, autorización por usuario ni RLS; los datos confidenciales no deben llegar al prompt | ACLARACIÓN TÉCNICA POSTERIOR (crítica) |
| 27 | L681-686 | Markdown = "lenguaje para nosotros en español de los modelos"; soul.md = system prompt | soul.md | Definición de proyecto/convención, no estándar universal | ACLARACIÓN TÉCNICA POSTERIOR |
| 28 | L1023-1029 | con base en la nube "el dashboard jamás va a dejar de estar alimentado" | Persistencia | Hipérbole; hay latencias, límites y pausas | ACLARACIÓN TÉCNICA POSTERIOR |
| 29 | L1276-1293 | Supabase free: 50 000 usuarios activos, "API requests ilimitadas", 500 MB DB, "5 GB caché", 1 GB de archivos; Pro $25 (100 000 usuarios, 8 GB…) | Planes | Cifras dichas de memoria sobre una página; verificar y fechar | ACTUALIZACIÓN EXTERNA |
| 30 | L1279-1282 | "la API request es lo mismo que con OpenRouter" | Concepto de API | Mezcla dos usos (llamada a datos vs llamada a modelo) | ACLARACIÓN TÉCNICA POSTERIOR |
| 31 | L1304-1306 | "Chrome" (cron) / tareas recurrentes con IA | Supabase Cron | Verificar disponibilidad y sintaxis actual | ACTUALIZACIÓN EXTERNA |
| 32 | L1318-1321 | "conexión facilísima en Claude o Codex… simplemente iniciando sesión con Google"; "ChatGPT ya puede trabajar en ese repositorio" | Integraciones | Requiere conectores/CLI/permisos; verificar | PENDIENTE DE COMPROBAR |
| 33 | L1451-1455 | "cualquiera ya puede ocupar mi dashboard y la inteligencia artificial que tengo en el dashboard" | Dashboard público | Un dashboard público sin autenticación expone datos; cómo se protegió la key/IA no se mostró | PENDIENTE DE COMPROBAR |
| 34 | L1491-1494, L1501-1502 | "no puedes desplegar con ChatGPT o Claude… no se puede desplegar una memoria sin Supabase, ni meter una API sin OpenRouter" | Qué puede hacer cada herramienta | Absolutos: hay otras bases de datos y otros routers; y el propio profesor luego despliega con Claude Code | ACLARACIÓN TÉCNICA POSTERIOR |
| 35 | L1503-1511, L1519 | "ChatGPT no puede ocupar la suscripción en tu aplicación"; "ninguna IA te va a añadir una API ni una base de datos por sí sola" | Suscripción vs API | La primera es cierta (suscripción ≠ API); la segunda se contradice con la demo (agente creó proyecto Supabase) | ACLARACIÓN TÉCNICA POSTERIOR |
| 36 | L1520, L1535-1536 | "es imposible desplegarlo con una sola herramienta"; "saber desplegar no se hace con IA" | Despliegue | Hay plataformas integradas; y el agente ejecutó pasos de despliegue en la propia clase | ACLARACIÓN TÉCNICA POSTERIOR |
| 37 | L1531 | "70 mensuales" (Supabase Pro + GitHub Pro + Claude Pro) | Presupuesto | Estimación sin fuente ni moneda; precios variables | ACTUALIZACIÓN EXTERNA |
| 38 | L1596-1601 | "100 % cualquier persona tiene que ocupar una base de datos… no hay otro camino" | Arquitectura | Para este proyecto con memoria, sí; no es universal | ACLARACIÓN TÉCNICA POSTERIOR |
| 39 | L1799 | "Claude desde nuestro celular puede ocupar GitHub, OpenCode necesita una computadora" | Capacidades | Verificar | PENDIENTE DE COMPROBAR |
| 40 | L1812-1813 | resultados patrocinados "la mayoría de veces son estafas" | Seguridad de navegación | Buen consejo; la cifra es general | COMPLEMENTO DEL PROFESOR |
| 41 | L1637-1646 | restricción de GitHub; "si no, crear una nueva cuenta" | Bloqueo de cuenta | La causa no se verificó (posible límite de uso/anti-abuso); evitar recomendar cuentas nuevas para saltar restricciones | PENDIENTE DE COMPROBAR |
| 42 | L1904 | "la API como no viaja en datos tenemos que ponerla también en Claude" (la pega de nuevo) | Secretos | Misma práctica insegura; la key va al entorno del backend/Vercel, no al prompt | ACLARACIÓN TÉCNICA POSTERIOR |
| 43 | L1331, L1452 | "terminó en Cloudflare… muy buen despliegue" | Enlace de **Alumna I** | **Inferido** túnel temporal a su equipo; no equivale a alojamiento permanente | ACLARACIÓN TÉCNICA POSTERIOR |
| 44 | L2032-2036 | "si alguien encuentra el link, está difícil… elimina el repositorio y lo deja localmente" | Privacidad de dashboards | "Difícil de encontrar" no es seguridad; borrar el repo no deshace una exposición (revocar keys, evaluar fuga) | ACLARACIÓN TÉCNICA POSTERIOR (crítica) |
| 45 | L2070-2072, L2148 | "puede ser la actualización… tendrás que desinstalar" | Diagnóstico OpenCode | Hipótesis no probada | PENDIENTE DE COMPROBAR |
| 46 | L352-354 | "la interfaz es exactamente lo mismo, solo cambian los modelos" (OpenCode vs Claude Code) | Herramientas | Simplificación; hay diferencias de capacidades y planes | ACLARACIÓN TÉCNICA POSTERIOR |

---

## 5. Preguntas de alumnos (anonimizadas)

| Nº | Quién | Pregunta (resumen fiel) | Dónde | Respuesta dada en clase | ¿Resuelta? |
|---|---|---|---|---|---|
| 1 | Alumna A | ¿Cómo se hace metaprompting en ChatGPT? | Chat 00:24:22 · L225-233 | Chat nuevo + "Mejora este prompt, optimízalo, no inventes información:" + contexto; pega C-01/C-02/C-03 | Sí |
| 2 | Alumna B | "Me perdí, ¿qué vamos a poner de estas opciones?" (además **Alumna E** oral, L258-263) | Chat 00:27:12 · L249-268 | Solo el último prompt (C-03) a OpenCode | Sí |
| 3 | Alumna B | ¿La instrucción en inglés es mejor? | Chat 00:42:22/00:42:32 · L407-417 | Sí; ahorra tokens (~20 %); contenido puede quedar en español | Respondida (afirmación discutible, §4 nº 10) |
| 4 | Alumna C | Con Excels reales de 4 áreas, ¿cómo saco el dashboard? ¿OpenCode permite subirlos? | Voz · L559-640 | Conectar varios Excel / unificar / base de datos (Supabase) / selector por área; "súbelos" y "sincronízalos" | Parcial (no implementado en clase) |
| 5 | Alumna D | ¿Qué es un soul.md? | Chat 01:04:04 · L679-691 | Archivo Markdown = system prompt del agente | Sí ("ok, gracias") |
| 6 | Alumna B | "Desde cero porfa" (OpenRouter) | Chat 01:05:32 · L695-710 | Se hizo la creación de key en vivo | Sí |
| 7 | Alumna I | ¿Qué hace OpenRouter? ¿Y si ya tengo key de ChatGPT/Claude? | Voz · L795-827 | Puente a muchos modelos; "exactamente lo mismo" | Respondida (matices en §4 nº 22-23) |
| 8 | Alumna E | "Me quedé desde la API… no tengo dada de alta esa aplicación; lo haré en repetición" | Chat 01:28:54 | Sin respuesta directa | Pendiente (se aborda en L2188-2195 y en el PDF) |
| 9 | Alumna H | El chat responde "No puedo consultar pedidos individuales en línea…" | Chat 01:30:21 · L996-1006 | Reenviar "sincroniza los datos…" + captura del error | No consta resolución |
| 10 | Alumna D | "En la landing le di mi API, pero mi agente dice que está pendiente de conexión" | Chat 01:41:48 · L1058-1062 | C-12: preguntar si es la API, modelo saturado | No consta resolución explícita (más tarde su landing responde, L1327-1346) |
| 11 | Alumno F | Su landing dice "El webhook está vacío…" (n8n) | Chat 01:43:28 · L1087-1094 | C-13 (sin n8n) | Sí (publica después, L1913-1915) |
| 12 | Alumno F | (localhost) Enlace local `localhost:8080` | Chat 01:54:34 · L1325-1333 | Es local; pedir a OpenCode publicar con la CLI | Sí |
| 13 | Participante G | ¿Puedo hacer todo esto si me enfoco en ChatGPT (o Claude)? | Chat 02:17:25/51 · L1489-1532 | Sí se crea el código; despliegue, API y base de datos requieren GitHub/OpenRouter/Supabase; mínimo cuatro herramientas | Sí (con absolutos, §4 nº 34-38) |
| 14 | Alumno F | Supabase "solo de forma local; me pide dos APIs para hacerlo público" | Voz · L1543-1551 | El profesor pausa Supabase | No |
| 15 | Alumno F | GitHub lo restringió temporalmente | Voz · L1637-1648 | Enviar captura al muro; crear cuenta nueva si fuera necesario | No |
| 16 | Alumna C | OpenCode "no hace nada" fuera de la ventana; sin lista de modelos | Voz · L939-953, L1651-1665, L2057-2176 | Cambiar de modelo; `/model`; `opencode auth list`; reinstalar; mensaje privado | No (queda pendiente) |
| 17 | Alumna E | Supabase: "credencial no válida"; no aparece opción de Google | Voz · L1673-1685, L1815-1869 | Mostrar el flujo con Claude Code; repetir desde cero | No |
| 18 | Alumna E | ¿Qué PDF cubrirá OpenRouter, Supabase, GitHub (código de verificación)? | Voz · L2181-2273 | PDFs por herramienta, "desde cero" | Sí (promesa) |
| 19 | Alumna D | ¿El valor real de OpenCode es si no tienes Claude Code? | Voz · L2023-2028 | Sí: es gratuito y da modelos gratis | Sí |
| 20 | Alumna D | Si publico un dashboard sensible en GitHub, ¿queda desprotegido hasta que veamos autenticación? | Voz · L2029-2044 | Sí queda desprotegido; borrar repo o mantenerlo local; compartir carpeta local con el equipo está bien | Respondida (crítica, §4 nº 44) |
| 21 | Alumna D | ¿Vercel es como GitHub? ¿Con cualquiera ya no requiero hosting? ¿la liga no se ve profesional? | Chat 03:13:26 · L2287-2297 | Empezó a responder: Git guarda repositorios; landing fáciles; apps necesitan más… | **Sin respuesta completa: la grabación termina a mitad de frase** |
| 22 | Alumna C | ¿Puedo descargar el dashboard o se modifica sobre el enlace? | Voz · L1065-1076 | Es un enlace; se modifica sobre el mismo | Respondida (simplificada) |
| 23 | Alumno J | ¿Puedo quedarme contigo después de la grabación? | Chat 03:14:14 · L2292-2294 | Aceptado | — (no se detalla) |

---

## 6. Promesas de cierre y tarea comunicadas al grupo

| Nº | Línea | Cita breve | Compromiso |
|---|---|---|---|
| 1 | L193-196, L214-217, L340-344 | "ya tengo la guía… ya están mejorados los prompts… se las voy a subir a su muro" | PDF de la clase anterior (GitHub, prompts mejorados); **ya subido** durante la clase; también la imagen de la línea del tiempo |
| 2 | L1962-1965 | "lo que les voy a dejar de tarea es que yo les voy a poner el PDF de la práctica… y unos PDFs para los despliegues… mínimo tener iniciada sesión en su Supabase, en su GitHub" | Tarea + PDFs prometidos |
| 3 | L1969-1976 | "me voy a concentrar en hacerles el PDF para cada cosa… se los voy a publicar en el muro… véanlos, váyanlos repasando… quien no, se espera hacia la otra clase" | PDFs en el muro; práctica voluntaria; próxima clase = despliegues |
| 4 | L1977-1986 | "los que sí tuvieron su link de GitHub o de Cloudflare… mándenmelo por el muro, lo voy a checar… retroalimentación… nos estaríamos viendo el próximo domingo" | Entregar enlace/evidencia por el muro; retroalimentación del profesor |
| 5 | L2206-2212 | "tarda unos 40 minutos… primero el PDF de la clase total, después el PDF de integración de GitHub, después uno de Supabase, otro para OpenRouter y otro de Vercel" | **Los cinco PDF de esta biblioteca**; orden anunciado |
| 6 | L2222, L2246-2252 | "todo va a ir desde cero… desplegar todas esas herramientas también en Claude… aunque tengan cuenta gratuita o de pago" | Ruta alternativa con Claude Code en las guías |
| 7 | L1691-1697, L1775 | "a la siguiente clase lo que vamos a hacer es el puro despliegue… iniciar sesión todos desde cero en GitHub" | Próxima sesión |
| 8 | L1104, L1032 | n8n "en el nivel dos"; "dos semanas para el nivel dos… base de datos" | Contenido futuro |
| 9 | L1025-1030 | en el nivel dos añadir una base de datos como respaldo del Excel | Contenido futuro |
| 10 | L1948-1949 | "me hace falta darles una clase de subagentes" | Contenido futuro |
| 11 | L1955-1957 | "yo voy a dejar abierto a que funcione la inteligencia artificial para que le puedan hacer preguntas" | Disponibilidad no garantizada; el enlace es "ejemplo histórico; puede no estar disponible" |
| 12 | L2156-2172 | a **Alumna C**: contactarla por la plataforma, mensaje privado con instalación alternativa y el PDF | Seguimiento individual |
| 13 | L1646 | a **Alumno F**: enviar al muro el aviso de GitHub | Seguimiento individual |
| 14 | L2278-2280 | "estoy en el muro para que me manden sus dudas… manden sus evidencias" | Canal de dudas y evidencias |

---

## 7. Puntos de interrupción típicos y estado que debería tener el alumno

| Punto | Qué estaba pasando | Estado esperado al llegar (checklist de rescate) |
|---|---|---|
| **00:27** | Se acaban de enviar C-01/C-02/C-03 | OpenCode abierto en carpeta/proyecto nuevo, modelo gratuito elegido; **solo C-03** pegado (no C-02, que está truncado) |
| **00:43–00:47** | Dashboard generado; arranca la landing | Excel DEMO creado + dashboard local abierto; segunda conversación/carpeta distinta para la landing (C-04 versión inicial) |
| **00:50–00:53** | Prueba de edición y bloqueo de Excel | Dashboard reflejando una edición; Excel cerrado antes de actualizar |
| **01:03** | Chat de IA en el dashboard | C-05 enviado; chat con "motor local" antes de la API |
| **01:11** | OpenRouter | Cuenta iniciada; key creada con **nombre, caducidad y límite**; key pegada **solo** en la configuración segura (no en el prompt, ver correcciones); C-07 (sin la key) |
| **01:20–01:30** | Pruebas de chat y atascos | Chat del dashboard respondiendo datos; C-08/C-09 si OpenCode está colgado; C-10 si falla sincronización |
| **01:32** | Publicación del dashboard | C-11; repositorio nuevo con nombre propio y **sin datos reales ni claves** |
| **01:44** | Landing sin n8n | C-13 enviado; landing local abierta |
| **01:50–01:54** | Menú y soul.md | C-14 → C-16 (versión larga con menú y contexto) |
| **02:09** | Supabase | C-18…C-22 (versión más completa); sesión de Supabase iniciada **por el alumno**; organización creada a mano si la pide |
| **02:24** | Repo + Pages de la landing | C-23; entender que Pages solo muestra estáticos y la IA no funcionará |
| **02:35** | Claude Code | Repositorio conectado por URL; carpetas `frontend/backend/supabase/data/knowledge` |
| **02:56–03:00** | Vercel | Enlace de Vercel (histórico) inaccesible/pidiendo login = **estado en proceso**, no fallo del alumno |
| **03:06** | Soporte de modelos | `/model` y `opencode auth list` ejecutados; si no hay modelos, reinstalar según PDF |

---

## 8. Discrepancias y dudas entre chat, transcripción y megaprompt

1. **Orden "Acelera los procesos"**: el profesor dice haber pegado "Acelera los procesos" (L993-994) **antes** de leer el mensaje de **Alumna H** (L996), pero el chat marca C-09 a las 01:30:49 **después** del mensaje de Alumna H (01:30:21). Desfase menor (<1 min) de lectura.
2. **Hora del descanso**: el profesor dice "10:41/10:42" (L1038, L1044) pero 08:52 + 01:36 ≈ 10:28. Se usa la marca de la transcripción (≈01:36–01:41).
3. **Enlace localhost del Alumno F**: el chat lo registra a las 01:54:34, pero el profesor lo comenta en L1325 (≈02:01); también el enlace de **Alumna D** (chat 02:03:38) se comenta en L1327-1346 (≈02:03-02:05). Prevalecen las marcas del chat para el momento del envío.
4. **Alumno F publica**: chat 02:46:39; el profesor lo "ve" en L1913-1915 (≈02:50).
5. **"Alumna H dijo que ya funciona"** (L1928): no hay mensaje de Alumna H en el chat en ese tramo; solo lo relata el profesor (puede ser voz no transcrita). Grado: reportado por el profesor.
6. **Quién preguntó "qué prompt copiar"**: el brief atribuye la duda a la Alumna B; la transcripción añade que **Alumna E** lo planteó oralmente (L258-263) y mencionó a "otra compañera". Se registran ambas.
7. **Número de ventas**: el prompt pide "al menos 300"; el profesor muestra "aproximadamente 364 datos" (L455) y 360 pedidos (L526, L874); ventas totales 117 000 aparecen en L470 (cifra relativa al estado mostrado; no se verificó contra cálculo independiente).
8. **Pedidos 360 → 361**: la explicación oral de L518-531 ("copié ese numerote enorme") es ambigua; solo se observa el contador cambiando de 360 a 361.
9. **Comando de soporte**: el chat dice `opencode auth list` (03:06:18); el reconocimiento oral oye "open code out list" y "open code espacio list" (L2133, L2144-2146). El propósito dicho era entender por qué no se listan modelos. **PENDIENTE DE COMPROBAR** en la documentación oficial qué muestra exactamente ese comando; no se narra su salida.
10. **Primer prompt de landing y n8n**: el profesor dice que va a hacer "un prompt que no sea muy largo" (L403) pero C-04 contiene n8n, panel financiero (CFDI, bancos, "National Soft") y requisitos de producción; la corrección llega en C-13 (01:44:17), tal como señala el brief.
11. **Moneda y precios**: "$25" del plan Pro y "70 mensuales" se dicen sin moneda explícita (L1278, L1531).
12. **Archivos faltantes**: imagen del muro, Temario y Guía General no disponibles.
13. **Estado de Vercel y Supabase**: ninguna fuente prueba que la IA, la memoria o el backend funcionaran al final; el profesor mismo dice que el último enlace "todavía no sirve" (L1940) y luego "les va a pedir iniciar sesión" (L1967).

---

## 9. Qué se verificó y qué no (Agente A)

- **Verificado:** lectura completa de `transcript.txt` (L1-L2299, en bloques) y `chat.txt` (L1-L353); conteo de 54 mensajes de chat (29 profesor / 25 alumnos); ausencia de secretos en ambas fuentes por búsqueda de patrones; correspondencia de marcas de tiempo.
- **No verificado:** cualquier dato fuera de las fuentes (fechas históricas, precios, límites, comandos); contenido del muro; salida de comandos; funcionamiento real de las aplicaciones mostradas. No se abrieron enlaces públicos (no se accedió a internet).
