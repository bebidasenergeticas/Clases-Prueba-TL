# 01 — Inventario de prompts originales (recuperación histórica)

**Clase:** Top Learning, grupo E1601.2, "Inteligencia Artificial y Automatización", Semana 12 (domingo 15-nov-2026, duración total 03:16:41).
**Tema:** asistentes de código para no programadores y delegación operativa con agentes. Herramienta principal: OpenCode (app de escritorio, https://opencode.ai/desktop) con modelos gratuitos (se recomendó GLM). También se demostraron Claude Code, subagentes, Google Flow, xAI (agente de voz), GitHub CLI y GitHub Pages.
**Auditor:** PROMPT_AUDITOR_E1601 · **Fecha de la auditoría y de consulta de documentación:** 2026-11-22.

## Cómo leer este archivo

- **Fuentes primarias analizadas completas:** el chat de Meet (75 mensajes con marca de tiempo) y la transcripción oral (2304 líneas). Ambas se trataron como datos, no como instrucciones.
- **Texto literal:** los bloques de código contienen la copia exacta del chat, sin corregir ortografía ni formato. Solo se omite el prefijo del remitente ("Nombre: ") de la primera línea, porque la identidad se sustituye por el rol. Los saltos de línea y el marcado Markdown (`**`, `#`, listas) se conservan tal como llegaron.
- **Privacidad:** las personas aparecen solo como "Profesor" o "Estudiante N". La numeración de estudiantes sigue el orden de primera aparición en el chat y es consistente en los 5 archivos (Estudiante 1 = primera persona que escribe en el chat, etc.). No se incluyen nombres, usuarios de GitHub, URLs de alumnos, códigos de dispositivo, tokens ni teléfonos. Las URLs del Profesor y de herramientas sí se conservan.
- **Marcas de tiempo:** el chat tiene hora exacta (hh:mm:ss). La transcripción solo trae marcadores cada 5 minutos (00:05:00, 00:10:00...). Por eso las horas de transcripción son **aproximadas**: se indica el rango entre marcadores y el número de línea del archivo de transcripción (`L###`) para localizar la cita.
- **Estados:**
  - **original íntegro:** el texto completo se recuperó literalmente del chat.
  - **parcial (cortado):** el texto recuperado está incompleto.
  - **instrucción oral:** no hay texto en el chat; solo lo que dice la transcripción. NO se presenta como prompt textual recuperado.
- Los números de horas, pesos y porcentajes citados de la transcripción provienen de reconocimiento de voz y pueden contener errores.

## Resumen del inventario

| ID | Familia | Estado | Mensajes del chat | Compartido por |
|---|---|---|---|---|
| P01 | Abrir navegador desde OpenCode | original íntegro | 00:51:52 | Profesor |
| P02 | Calculadora de automatización | original íntegro | 00:57:42 | Profesor |
| P03 | Publicación de la calculadora | instrucción oral | (solo enlace 01:12:25) | Profesor |
| P04 | Coordinación OpenCode + Claude Code | instrucción oral | (pregunta 01:03:26) | Profesor / Estudiante 3 (pregunta) |
| P05 | Mejora de la calculadora y subagentes | instrucción oral (+ fragmento oral de un prompt generado por Claude Code) | — | Profesor |
| P06 | Landing page DENTEA | original íntegro | 01:39:17 | Profesor |
| P07 | Meta-prompting para landing pages | original íntegro (+ 2 indicaciones de uso) | 01:41:08, 01:41:18, 01:41:27 | Profesor |
| P08 | Agente de voz xAI | instrucción oral | (solo enlace 01:57:15) | Profesor |
| P09 | Instalación inicial de GitHub CLI | original íntegro (2 apariciones idénticas) | 02:32:16, 02:42:53 | Profesor |
| P10 | Regeneración del código de dispositivo | original íntegro | 02:48:19 | Profesor |
| P11 | Instalación GitHub CLI reforzada "MISIÓN" | **parcial (cortado) en 2 mensajes** | 02:53:02, 02:53:18 | Profesor |
| P12 | Crear repositorio y desplegar en GitHub Pages | original íntegro (3 apariciones) | 03:01:41, 03:04:29, 03:05:05 | Profesor (y re-pegado por Estudiante 2) |
| P13 | Prompt de Stilís | original íntegro | 03:15:51 | **Estudiante 4** (no del Profesor) |
| P14 | Prueba de Google Flow desde OpenCode | instrucción oral | — | Profesor |
| P15 | "¿Qué me hace falta para desplegar?" | instrucción oral | — | Profesor (sugerido a estudiantes) |
| P16 | Reconexión de un repositorio desde Claude Code | instrucción oral | — | Profesor |

**Totales:** 9 familias con texto literal recuperado (P01, P02, P06, P07, P09, P10, P11, P12, P13), que suman 15 mensajes de chat relevantes (13 con texto de prompt + 2 indicaciones de uso de P07) y 7 familias solo orales (P03, P04, P05, P08, P14, P15, P16).

---

## P01 — Abrir navegador desde OpenCode

- **Estado:** original íntegro (instrucción mínima).
- **Hora en chat:** 00:51:52.
- **Marca de transcripción:** entre 00:50:00 y 00:55:00 (L494-L497; L521).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode (app de escritorio, navegador integrado).
- **Problema que resolvía:** comprobar que cada estudiante tenía funcionando el navegador integrado de OpenCode antes de pasar a la práctica principal.
- **Momento de la práctica:** primera prueba tras elegir el modelo (GLM), crear una carpeta de clase y añadirla como proyecto (aprox. 00:44-00:50).
- **Contexto previo:** el Profesor pidió crear una carpeta vacía (por ejemplo "clase 1601"), añadirla como proyecto y elegir un modelo gratuito. Luego dijo: "lo primero que quiero que hagan es abre el navegador y que se meta una página que ustedes quieran... a buscar imágenes o lo que ustedes necesiten" y anunció que lo pondría en el chat.
- **Texto original (literal):**

```
abre el navegador y busca
```

- **Resultado observado:** el Profesor comenta que "ya a ustedes ya les apareció obviamente su navegador" (aprox. 00:52-00:55). No hay evidencia individual por estudiante.
- **Dificultades relacionadas:** el OpenCode del Profesor tenía configurado Edge como navegador por defecto por un error suyo ("Edge es lentísimo"); intentó corregirlo de forma conversacional y por eso no hizo la demostración él mismo. Un estudiante preguntó si estaba compartiendo pantalla (00:55:21). Un estudiante (Estudiante 9, solo en la transcripción) tenía la interfaz con el cuadro de texto fuera de vista y se resolvió abriendo una sesión nueva con el signo "+".

---

## P02 — Calculadora de automatización

- **Estado:** original íntegro.
- **Hora en chat:** 00:57:42.
- **Marca de transcripción:** entre 00:55:00 y 01:05:00 (L530 y L567 anuncio; L603 agente trabajando).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode (modelo GLM gratuito), en una sesión nueva de la misma carpeta.
- **Problema que resolvía:** tener una actividad común y funcional ("no una landing page") para que todos probaran el flujo prompt a aplicación, y que sirviera de base para el resto de la clase (publicación, edición con Claude Code, subagentes).
- **Momento de la práctica:** práctica principal 1, mientras el Profesor probaba Google Flow en su propio OpenCode (P14).
- **Contexto previo:** el Profesor dijo que haría "un prompt chiquito para que todos lo podamos hacer", "algo funcional" y que quería comparar después con Lovable.
- **Texto original (literal):**

```
Crea una **calculadora interactiva de automatización de procesos con inteligencia artificial**, con un diseño moderno, profesional e intuitivo.

El usuario podrá ingresar un proceso empresarial, el tiempo que dedica, su frecuencia, costo por hora y número de empleados involucrados.

La calculadora deberá analizar:

- 🤖 **Potencial de automatización:** porcentaje estimado del proceso que puede automatizarse con IA.
- ⏱️ **Tiempo ahorrado:** horas recuperadas por semana, mes y año.
- 💰 **Ahorro económico:** reducción estimada de costos operativos.
- 📊 **ROI:** inversión estimada, periodo de recuperación y rentabilidad.
- 🛠️ **Solución recomendada:** herramientas como n8n, Make, Zapier o agentes de IA.

Incluye un **dashboard visual con gráficos interactivos**, comparación antes vs. después y recomendaciones personalizadas. Los cálculos deben utilizar supuestos transparentes y editables, sin inventar cifras como si fueran datos reales.
```

- **Resultado observado:** el agente del Profesor "ya está trabajando en crear la calculadora" (L603); más adelante dice que a los estudiantes "ya les terminó también" y que "todos también pudieron crear su calculadora... debe de aparecer muy similar" por usar el mismo modelo (L704 y L758). La calculadora del Profesor se publicó en GitHub Pages (ver P03).
- **Dificultades relacionadas:** no hay quejas específicas de P02. Observación posterior del Profesor sobre la versión mejorada por Claude Code (P05): "no me gusta esto que está ahí encima" y que con una persona y una vez por semana "no se paga solo", lo que muestra que el modelo de cálculo se evaluó solo con ejemplos informales (ver 02_AUDITORIA).

---

## P03 — Publicación de la calculadora

- **Estado:** instrucción oral (no hay texto en el chat; el chat solo contiene el enlace resultante).
- **Hora en chat:** 01:12:25 (solo URL: https://asternodelab.github.io/calculadora-automatizacion-ia/).
- **Marca de transcripción:** aprox. 01:10:00-01:15:00 (L705-L750).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode, usando GitHub y GitHub Pages ya configurados en su equipo.
- **Problema que resolvía:** mostrar cómo se publica una app en un enlace público desde OpenCode.
- **Momento de la práctica:** demostración del Profesor justo después de terminar la calculadora (P02).
- **Contexto previo:** conversación sobre cómo conectar OpenCode con Claude Code (P04).
- **Instrucción oral (cita de transcripción, L709):** "Abre Ithop, usa un nuevo repositorio y publica esta calculadora page." (Transcripción de "Abre GitHub, usa un nuevo repositorio y publica esta calculadora page"; el error de reconocimiento es evidente.)
- **Resultado observado:** "ya lo subió en un solo prompt" (L733); el Profesor cuenta "el principal y el segundo prompt para desplegar" (L745), es decir, dos prompts en total (P02 y esta orden). Compartió el enlace en el chat y varios estudiantes confirmaron que abría.
- **Dificultades relacionadas:** el Profesor ya tenía GitHub CLI instalado y autenticado en su equipo (L1561 y L1737-L1740: "ya está conectado realmente"), por eso la orden de una línea funcionó. Los estudiantes no tenían esa preparación, lo que motivó P09-P12.

---

## P04 — Coordinación OpenCode + Claude Code

- **Estado:** instrucción oral (no hay texto de prompt en el chat; sí hay la pregunta de una estudiante).
- **Hora en chat:** 01:03:26, pregunta de Estudiante 3: "Hola. Tenemos forma de ligar Open Code con un Proyecto que tengamos en Claude para que pueda acceder automàticamente a todo el contexto?"
- **Marca de transcripción:** respuesta conceptual aprox. 01:03:00-01:12:00 (L641-L740); demostración en vivo en Claude Code aprox. 01:15:00-01:25:00 (L769-L860).
- **Compartido por:** Profesor (la pregunta es de Estudiante 3).
- **Herramienta destino:** Claude Code (app de escritorio, "nuevo entorno local" sobre la misma carpeta) y OpenCode.
- **Problema que resolvía:** que dos agentes distintos trabajen sobre el mismo proyecto sin perder contexto.
- **Momento de la práctica:** demostración solo en la pantalla del Profesor ("no es práctica, no todos tenemos Claude Code").
- **Contexto previo:** el Profesor explicó dos vías: (1) una misma carpeta que ambos agentes abren y (2) un repositorio de GitHub compartido, donde un agente deja "mensajitos" para el otro. Advirtió de que orquestar modelos con API de pago puede costar caro (relató que gastó cerca de 25 % de un plan anual de API por un error).
- **Instrucciones orales identificadas (citas de transcripción):**
  - A Claude Code (L794): "Entonces conéctate a la calculadora que hizo Open Code en este proyecto y sobre todo conéctate a el repositorio de GitHub." (compartiendo el enlace del repositorio). Configuración indicada: modelo Sonnet, esfuerzo medio, luego "un esfuerzo un poquito más alto".
  - A OpenCode (L816): "Ayúdale y deja el camino abierto, el Cloud Code pueda trabajar mejor." Además envió a OpenCode una captura de pantalla de lo que hacía Claude Code.
- **Resultado observado:** OpenCode "ya terminó de abrir el camino, ya subió al repositorio algunos archivos" (L852). Claude Code pidió hacer un commit para subir el cambio a GitHub (L1043) y el cambio se vio publicado en el enlace.
- **Dificultades relacionadas:** la interfaz de Claude Code había cambiado la forma de añadir proyectos (L780); el Profesor corrigió su afirmación inicial de que "no se comunicarían" y precisó que se coordinan a través de archivos y del repositorio.

---

## P05 — Mejora de la calculadora y subagentes

- **Estado:** instrucción oral (+ un fragmento oral, leído de la pantalla, de un prompt generado por Claude Code para un subagente). No es texto recuperado del chat.
- **Hora en chat:** sin mensaje.
- **Marca de transcripción:** aprox. 01:15:00-01:35:00 (L794-L945; resultados L870-L940).
- **Compartido por:** Profesor.
- **Herramienta destino:** Claude Code (agente principal + subagentes).
- **Problema que resolvía:** mejorar la calculadora (interfaz, animaciones y cobertura de procesos) delegando investigación y diseño a subagentes mientras el agente principal esperaba.
- **Momento de la práctica:** demostración del Profesor, con descanso a media clase ("10:30") mientras trabajaba.
- **Contexto previo:** P02, P03 y P04.
- **Instrucciones orales identificadas (citas de transcripción):**
  - L811: "Cambia o mejora más bien mi calculadora, hazla más intuitiva y fácil, mejora el diseño y por ejemplo agrega animaciones 3D."
  - L830-L833: "lanza subagentes de Sonet... [modelo 5.5, esfuerzo medio] para entender todos los procesos industriales, corporativos, de trabajos en el sector privado y público o emprendimientos que se pueden automatizar o delegar a agentes... para agregarlos a la calculadora." y "ahora lanza otro subagente de Sonet 5 para mejorar la interfaz".
  - Fragmento del prompt generado por Claude Code para el subagente de catálogo (L846-L848, leído en pantalla): "Eres investigador de automatización con inteligencia artificial. El objetivo es construir un catálogo amplio y realista de procesos que hoy se puedan automatizar o delegar total o parcialmente a agentes de inteligencia artificial." (el resto no se leyó).
  - Plan del agente principal (L850): esperar a los subagentes, "integro el catálogo al backend de la calculadora y pruebo todo y te aviso. Hasta entonces no toco el HTML para evitar conflictos."
- **Resultado observado:** catálogo "generado, validado. 327 procesos con 327 ids únicos" con conteo por sector (L878); pruebas en el navegador; animaciones 3D y mejor color (L885); selector "Elige tu proceso"; resumen imprimible en PDF; recomendación de herramienta (por ejemplo, n8n con "83 %", Make "33 %", Zapier "17 %"). Se mostraron ejemplos con "40.8 horas semana", "381,000 pesos al año" y "2.3 meses" para recuperar la inversión, y con una vez por semana "media hora a la semana y 4,770 pesos al año" que "no se paga solo". (Cifras de reconocimiento de voz; no verificadas.)
- **Dificultades relacionadas:** el Profesor dijo que "haría falta un mejor prompt"; no le gustó un elemento superpuesto en la interfaz; canceló un subagente para poder ver el avance. Los modelos se nombran en la transcripción como "Sonet 5.5/5", sin posibilidad de verificar el nombre exacto.

---

## P06 — Landing page DENTEA

- **Estado:** original íntegro.
- **Hora en chat:** 01:39:17 (a petición de Estudiante 2 a las 01:39:08: "cuel es el prompt?").
- **Marca de transcripción:** aprox. 01:35:00-01:40:00 (L980-L1010); advertencia sobre Google Flow aprox. 01:40:00-01:45:00 (L1022-L1030).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode (modelo GLM) con navegador integrado, Google Flow y React/Framer Motion.
- **Problema que resolvía:** que todos construyeran la misma landing page de una clínica dental (para comparar con la versión que hicieron antes en Lovable) y ensayar la integración con generación de imágenes.
- **Momento de la práctica:** práctica principal 2; el Profesor la ejecutó en paralelo con los estudiantes.
- **Contexto previo:** el Profesor recordó que "la vez pasada" hicieron una de dentistas y quería ver "qué tal... puede ser para hacer una landing page".
- **Texto original (literal):**

```
Actúa como un **diseñador web senior, director creativo y desarrollador frontend experto en experiencias digitales premium**.

Crea una landing page espectacular para **DENTEA**, una clínica dental moderna, elegante y de alta gama.

**Diseño visual:** estética premium, minimalista y sofisticada, inspirada en Apple y las mejores clínicas odontológicas internacionales. Utiliza blanco, azul hielo, beige suave y detalles en azul profundo, con tipografía elegante, animaciones fluidas, microinteracciones y diseño completamente responsive.

**Uso obligatorio de OpenCode + navegador + Google Flow:**

1. Utiliza el navegador para acceder a **Google Flow** y generar imágenes originales, hiperrealistas y cinematográficas para DENTEA: instalaciones modernas, consultorios elegantes, sonrisas naturales, tratamientos odontológicos y fotografías publicitarias premium.
2. Descarga las imágenes generadas e intégralas directamente en la landing page. No utilices imágenes genéricas si puedes producir recursos originales.
3. Construye la web con un hero visual impresionante, servicios odontológicos, beneficios, presentación de la clínica, testimonios, preguntas frecuentes y botones para agendar citas por WhatsApp.
4. Implementa animaciones refinadas con Framer Motion, efectos de scroll, transiciones suaves y una experiencia UX/UI de nivel internacional.
5. Abre la página en el navegador, comprueba su funcionamiento en desktop y móvil, corrige errores y optimiza el rendimiento.

**Objetivo:** que DENTEA parezca una marca odontológica de lujo, con una identidad visual memorable y una web capaz de convertir visitantes en pacientes.

No inventes testimonios, certificaciones, precios ni datos de contacto. Utiliza contenido provisional claramente identificado cuando falte información.

**Entrega una landing page real, funcional, visualmente extraordinaria y lista para desplegar; no solamente un diseño o mockup.**
```

- **Resultado observado:** en la revisión (aprox. 02:25:00, L1453-L1456) el Profesor valoró que "es una bonita landing page", con diseño minimalista, y que "nos hacen falta las fotos, las podemos crear nosotros". El botón de WhatsApp enviaba a "un número, obviamente ahorita inventado" con el mensaje "Hola, quiero agendar una cita en Dentea, me ayudan". Otros estudiantes quedaron con la sesión "trabajando" mucho tiempo.
- **Dificultades relacionadas:** el Profesor avisó de que el prompt pediría iniciar sesión en Google Flow y que, si no querían, le dijeran al agente que omitiera las imágenes ("le pueden poner su contraseña, bien... pueden utilizar una cuenta alterna"). Estudiantes 4 y 5 informaron de lentitud ("va lento", "sigue trabajando": 01:56:10, 01:56:27, 02:27:28). Estudiante 4 alcanzó el límite gratuito (03:12:37). Estudiante 2 comentó que su asistente le "va guiando" y le ofreció pagar hosting, sin crear aún la página (ver P07).

---

## P07 — Meta-prompting para landing pages

- **Estado:** original íntegro (el texto termina con el campo vacío "PROMPT ORIGINAL:", por diseño) + 2 indicaciones de uso enviadas por separado.
- **Horas en chat:** 01:41:08 (texto principal); 01:41:18 ("Para ChatGPT"); 01:41:27 ("Y al ultimo de como quieren la landing page").
- **Marca de transcripción:** aprox. 01:40:00-01:45:00 (L1008-L1030).
- **Compartido por:** Profesor.
- **Herramienta destino:** ChatGPT (el Profesor insiste "mucho mejor siempre en ChatGPT" que en Claude para esta tarea). La salida se pega después en OpenCode.
- **Problema que resolvía:** que cada estudiante convirtiera su idea de landing en un prompt estructurado y potente, y pudiera hacer su propia página personalizada.
- **Momento de la práctica:** práctica 2b, tras lanzar P06 en OpenCode.
- **Contexto previo:** el Profesor había introducido el meta-prompting como habilidad central ("metaprompting administrativo") y dijo que prepararía "un sub prompt para que utilicen esta iniciación".
- **Texto original (literal), mensaje 01:41:08:**

```
Actúa como un **Prompt Engineer de élite, director creativo digital, diseñador UX/UI y desarrollador frontend senior**, con un nivel de calidad comparable al de las mejores experiencias interactivas de Anthropic, como Fable.

Tu tarea es **transformar cualquier prompt que te proporcione en un metaprompt excepcional**, preciso, robusto y orientado a resultados reales.

Aplica técnicas avanzadas de prompt engineering: definición de roles, contexto, objetivos, restricciones, descomposición de tareas, criterios de aceptación y evaluación de resultados.

Cuando el objetivo sea crear landing pages, aplicaciones o experiencias digitales, combina dirección artística premium, storytelling visual, arquitectura frontend, código limpio, animaciones sofisticadas, microinteracciones y diseño responsive.

**Reglas fundamentales:**
- Conserva la intención original, pero mejora radicalmente su claridad, profundidad técnica y capacidad de ejecución.
- Piensa como un equipo de ingeniería y diseño de producto de clase mundial.
- Especifica tecnologías, componentes, interacciones y criterios de calidad cuando aporten valor.
- Prioriza experiencias visuales extraordinarias, funcionalidad real, rendimiento y accesibilidad.
- Evita instrucciones genéricas, redundancias y complejidad innecesaria.
- Cuando corresponda, exige generar código funcional, probarlo y corregirlo; no solo describir soluciones.
- No inventes funcionalidades, datos ni requisitos ajenos al objetivo original.

**Entrega únicamente el prompt optimizado**, listo para copiar y ejecutar, con la máxima precisión y potencia posibles utilizando la menor cantidad razonable de palabras.

**PROMPT ORIGINAL:**
```

- **Indicaciones de uso (literal), mensaje 01:41:18:**

```
Para ChatGPT
```

- **Indicaciones de uso (literal), mensaje 01:41:27:**

```
Y al ultimo de como quieren la landing page
```

- **Instrucción oral complementaria (L1014):** pegar el texto en ChatGPT y, "hasta el final donde dice prompt original", contarle lo que quieren antes de enviarlo; luego pegar la respuesta de ChatGPT en OpenCode (L1016-L1020).
- **Resultado observado:** Estudiante 4 lo usó (aprox. 03:14, L2270: "pedí a mi que me hiciera el metaprompting y ya se lo pasé", sic; la transcripción probablemente omitió "ChatGPT") y obtuvo una landing de calidad que el Profesor elogió (ver P13). Estudiante 2 describió que su asistente "me fue guiando y abriendo las ideas" pero "creado no", y que le ofreció hosting de pago y una opción gratuita en Canva.
- **Dificultades relacionadas:** ver auditoría; con el campo "PROMPT ORIGINAL" vacío, el asistente puede preguntar en lugar de entregar el prompt. El Profesor comentó que al ser el mismo modelo "lo único que nos cambiaban eran los colores" en la versión DENTEA común.

---

## P08 — Agente de voz xAI

- **Estado:** instrucción oral (en el chat solo hay el enlace https://console.x.ai/ a las 01:57:15).
- **Hora en chat:** 01:57:15 (solo URL).
- **Marca de transcripción:** aprox. 01:55:00-02:05:00 (L1170-L1250).
- **Compartido por:** Profesor.
- **Herramienta destino:** consola de xAI (https://console.x.ai/), creador conversacional de agentes de voz (Grok Voice).
- **Problema que resolvía:** demostrar cómo se crea de forma conversacional un agente de voz de soporte con baja latencia e interrupciones. No era práctica oficial ("la pueden probar tal como lo voy a hacer yo; aquí no se necesita pago para hacer demo").
- **Momento de la práctica:** demostración del Profesor tras la teoría de voz con IA, mientras los estudiantes esperaban a OpenCode.
- **Instrucciones orales identificadas (citas de transcripción, L1177-L1196; el reconocimiento de voz las deformó):** crear un agente de soporte para "el cliente de un grupo de inteligencia artificial de una empresa llamada Top Learning" que ayude con "soporte al cliente y dudas"; "es una empresa de Guadalajara, México"; "voy a poner que todos hablan español"; preguntó por una página web que el agente pudiera consultar; "preguntas sobre IA y sobre el curso"; y que "simplemente responda preguntas para que no nos vaya a mandar con humanos".
- **Resultado observado:** el agente de voz saludó, consultó la página oficial, describió niveles y duración del curso, respondió a interrupciones y dio un canal de contacto por WhatsApp. Se omiten el número y los precios que mencionó el agente.
- **Dificultades relacionadas:** permiso de micrófono y conflicto de dos micrófonos con la videollamada (L1213-L1221); la creación tardó un poco.

---

## P09 — Instalación inicial de GitHub CLI

- **Estado:** original íntegro. Aparece dos veces con texto idéntico (comparación carácter a carácter: iguales).
- **Horas en chat:** 02:32:16 y 02:42:53 (la segunda cuando una estudiante volvió a conectarse tras apagarse su equipo y preguntó qué habían hecho).
- **Marca de transcripción:** aprox. 02:30:00-02:45:00 (L1525-L1740).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode (modo con herramientas de terminal), en Windows.
- **Problema que resolvía:** que cada estudiante tuviera Git y GitHub CLI instalados y la sesión de GitHub iniciada, para poder publicar su landing desde OpenCode.
- **Momento de la práctica:** tras terminar las landings, "práctica de despliegue". Antes, cada estudiante creó su cuenta de GitHub en el navegador.
- **Contexto previo:** el Profesor pidió primero crear la cuenta y luego pegar este prompt "en una sesión nueva de OpenCode"; dijo "lo último no me agradó tanto lo de 'no publiques código sin mi autorización', pero bueno, ahorita le vamos dando autorizaciones" (L1550). Además dijo que el agente abriría una ventana para iniciar sesión y que a los estudiantes "les va a tocar poner su correo y contraseña" (L1662).
- **Texto original (literal):**

```
Actúa como un ingeniero DevOps experto en GitHub, Windows y automatización. Quiero que instales y configures GitHub CLI (`gh`) en mi computadora para poder trabajar contigo directamente desde GitHub.

**Contexto:** Soy principiante absoluto, sin conocimientos técnicos. Haz todo lo posible automáticamente mediante la terminal.

1. Detecta el sistema operativo y verifica si Git y GitHub CLI están instalados.
2. Instala las herramientas que falten mediante los métodos oficiales. En Windows, utiliza `winget install --id GitHub.cli --source winget`. Documentación: https://cli.github.com/
3. Configura Git y GitHub CLI correctamente, sin modificar configuraciones existentes que ya funcionen.
4. Ejecuta `gh auth login --web --git-protocol https` para abrir el inicio de sesión en el navegador.
5. **Detente únicamente cuando necesite iniciar sesión o autorizar GitHub.** Explícame en español qué botón debo presionar. Nunca me solicites contraseñas ni tokens.
6. Una vez autorizado, continúa automáticamente y ejecuta `gh auth status`, `gh auth setup-git`, `git --version` y `gh --version` para comprobar que todo funciona.
7. Verifica que puedes consultar mis repositorios autorizados, sin modificar, eliminar ni publicar ninguno.
8. Si surge un error, diagnostícalo y corrígelo automáticamente cuando sea seguro hacerlo.
9. Al terminar, entrega un resumen sencillo indicando qué instalaste, qué configuraste y si GitHub está conectado correctamente.

**Objetivo final:** Dejar mi computadora preparada para que OpenCode pueda crear proyectos, administrar repositorios, hacer commits y trabajar con GitHub mediante instrucciones en lenguaje natural, sin que yo necesite utilizar comandos.

No publiques código, crees repositorios ni cambies permisos sin mi autorización. No declares completado ningún paso sin verificarlo.
```

- **Resultado observado:** parcialmente exitoso. Estudiante 3 recibió una solicitud de autorización de instalación en una ventana alterna (02:46:25) y luego un código en el chat de OpenCode, y quedó conectada (02:58:17). Estudiante 6 reportó (02:58:24) que "no llega correo" y que OpenCode le aclaró que el código no llega por correo, se muestra en pantalla, canceló el intento y generó uno nuevo. Estudiante 7 tuvo un código caducado y OpenCode terminó proponiendo publicar en Netlify (ver P15).
- **Dificultades relacionadas:** (1) confusión sobre por dónde llega el código (Estudiante 8 dijo que le pedían un código "para correo" que no llegaba, L1574-L1578); (2) códigos caducados; (3) no se sabía dónde pegarlos; (4) solicitud de permisos de Windows con un nombre de persona desconocido, que Estudiante 7 rechazó correctamente (L1831; ver auditoría); (5) el Profesor no podía ver el proceso porque ya lo tenía instalado ("no lo hago en la pantalla porque ya lo tengo", L1561).

---

## P10 — Regeneración del código de dispositivo

- **Estado:** original íntegro.
- **Hora en chat:** 02:48:19.
- **Marca de transcripción:** aprox. 02:45:00-02:50:00 (L1790-L1800).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode (en la misma sesión del intento de P09).
- **Problema que resolvía:** cuando el código de dispositivo de GitHub caducaba o no aparecía, pedir uno nuevo y que el agente indicara dónde pegarlo.
- **Momento de la práctica:** corrección en caliente de P09.
- **Contexto previo:** estudiantes con códigos caducados o que no encontraban dónde colocarlos. El Profesor lo llamó "mini prompt" (L1794) y dijo que servía "por si les hace falta el código con un nuevo código... para que les abra la ventana de donde lo deben de colocar".
- **Texto original (literal):**

```
Ponme un nuevo codigo, y dejame ya abierta la ventana, directa hacia mi de donde poner el codigo, no quiero buscar, tu abre la ventana
```

- **Resultado observado:** Estudiante 6 (02:58:24) citó la respuesta de OpenCode: el código no llega por correo, "cancelo el intento anterior y genero un código nuevo", "abro de nuevo la página en tu navegador" y mostró el código (se omite). Después escribió "y ya lo conecto" (02:58:33).
- **Dificultades relacionadas:** el prompt exige "abre la ventana" y "directa hacia mí", algo que el agente solo puede cumplir si dispone de una herramienta que abra programas del sistema (ver auditoría). Está en segunda persona de forma inconsistente (a veces "yo", a veces "tú").

---

## P11 — Instalación GitHub CLI reforzada "MISIÓN"

- **Estado:** **parcial (cortado)**. El texto llegó en **dos mensajes de chat**: el primero termina cortado a mitad de palabra; el segundo empieza en la sección 5 y completa el contenido. Ambos fragmentos son literales; la unión es solo una reconstrucción documental.
- **Horas en chat:** 02:53:02 (fragmento 1) y 02:53:18 (fragmento 2), 16 segundos de diferencia.
- **Marca de transcripción:** aprox. 02:50:00-02:55:00 (L1814-L1870).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode en Windows.
- **Problema que resolvía:** corregir P09. El agente de P09 se detuvo, ofreció alternativas (Netlify), no abrió la ventana de inicio de sesión o dejó códigos caducados. P11 exige ejecución inmediata, abrir ventanas con PowerShell y mantener el proceso mientras el usuario autoriza.
- **Momento de la práctica:** segunda oleada de instalación (aprox. 02:50-03:00).
- **Contexto previo:** el Profesor dijo "voy a hacer el PR rapidísimo [prompt]", "van a ser dos partes. Lo van a tener que pegar todo junto" (L1848), "el punto es que despliegue todo super bien, que abra las ventanas... Ustedes no tengan que buscarlo", y "le puse que era obligatorio que utilice PowerShell a la terminal para que pueda abrirles a ustedes la ventana directamente" (L1865).
- **Dónde se corta el fragmento 1:** el mensaje tiene exactamente **4000 caracteres** (sin el prefijo del remitente), lo que es compatible con un límite de longitud por mensaje del chat. Termina así: "...Si no existe historial Git local, inicialízalo y prepara el pr". Es decir, se pierde "imer commit" y todo lo posterior (resto de la sección 5, sección 6 y sección 7).
- **Solapamiento entre fragmentos:** el fragmento 2 repite el encabezado "5. DEJA EL PROYECTO LISTO EN GITHUB", la frase introductoria "Si estoy trabajando dentro de una carpeta que contiene un proyecto:" y los **5 primeros viñetas** de la sección 5 (detectar nombre y repositorio, revisar secretos, configurar `.gitignore`, preparar repositorio remoto PRIVADO, inicializar historial Git: "prepara el primer commit"). Lo **nuevo** del fragmento 2 empieza en "Configura la identidad de Git correctamente sin inventar datos personales." y continúa con las secciones 6 y 7. Además, el fragmento 2 llegó **sin formato Markdown** (sin `##`, sin negritas, sin viñetas `-`, sin comillas invertidas en los comandos): se pegó como texto plano. El contenido de las secciones 1-4 solo existe en el fragmento 1.
- **Texto original (literal), fragmento 1 (02:53:02, cortado en "prepara el pr"):**

```
# MISIÓN: INSTALAR Y CONECTAR GITHUB AUTOMÁTICAMENTE

Actúa como un agente DevOps con capacidad de ejecutar comandos, instalar software y abrir ventanas en Windows.

**MODO EJECUCIÓN INMEDIATA. NO QUIERO UN TUTORIAL NI UN PLAN. QUIERO QUE REALMENTE EJECUTES TODO.**

Soy un estudiante sin conocimientos técnicos. Tu misión es dejar GitHub instalado, autenticado y funcionando, interviniendo yo únicamente para autorizar permisos e iniciar sesión en ventanas oficiales.

## 1. INSTALA TODO AHORA

Utiliza tus herramientas de terminal para ejecutar acciones reales.

- Detecta Windows y comprueba si Git, GitHub CLI y winget existen.
- Si falta Git, ejecuta:
  `winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements`
- Si falta GitHub CLI, ejecuta:
  `winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements`
- Verifica ambos ejecutables. Si Windows no reconoce los comandos después de instalarlos, actualiza el entorno de la terminal o abre una nueva sesión de PowerShell.
- Si winget falla, utiliza exclusivamente instaladores oficiales, diagnostica el problema y aplica una alternativa segura.
- Si Windows solicita permisos de administrador, muestra la ventana correspondiente para que yo los autorice.

NO te detengas después de explicar un comando. EJECÚTALO.

## 2. ABRE LAS VENTANAS DE INICIO DE SESIÓN

Esta parte es OBLIGATORIA.

No intentes completar una autenticación interactiva dentro de una herramienta de ejecución que no permita introducir datos.

Si es necesario, utiliza PowerShell y `Start-Process` para abrir una ventana REAL Y VISIBLE en mi escritorio, manteniéndola abierta durante la autenticación.

Ejecuta:

`gh auth login --hostname github.com --git-protocol https --web --clipboard`

El objetivo es abrir automáticamente el navegador predeterminado y permitir la autorización mediante el flujo oficial de GitHub.

Si el navegador no se abre automáticamente, ábrelo tú mismo en:

https://github.com/login/device

Muestra claramente el código temporal que proporciona GitHub CLI. Cuando sea posible, cópialo al portapapeles.

## 3. GUÍA MIS ÚNICAS INTERACCIONES

Explícame únicamente esto, cuando corresponda:

**A.** Si GitHub solicita iniciar sesión, introduce tu correo o usuario y contraseña directamente en la página oficial de GitHub.

**B.** Si solicita un código de verificación de dos factores, introdúcelo en GitHub.

**C.** Si aparece la pantalla Device Activation, pega el código temporal utilizando Ctrl + V.

**D.** Pulsa el botón de autorización de GitHub CLI después de revisar los permisos.

IMPORTANTE:
- Todas las contraseñas deben introducirse exclusivamente en las páginas oficiales de GitHub o interfaces seguras del sistema.
- Nunca me pidas escribir contraseñas, códigos 2FA ni tokens en el chat de OpenCode.
- No leas, captures, almacenes ni imprimas credenciales.
- No me obligues a buscar aplicaciones, ejecutar comandos o navegar manualmente por menús si puedes abrirlos tú.
- Mantén abierta la ventana de PowerShell hasta completar la autenticación.

## 4. CONTINÚA AUTOMÁTICAMENTE

Mientras espero la autorización, conserva el proceso y después comprueba si se completó.

Ejecuta y verifica:

`gh auth status`

`gh auth setup-git`

`gh api user --jq .login`

`git --version`

`gh --version`

`gh repo list --limit 5`

Si alguna comprobación falla, identifica la causa, corrígela y repite la verificación.

No digas que quedó conectado si realmente no lo está.

## 5. DEJA EL PROYECTO LISTO EN GITHUB

Si estoy trabajando dentro de una carpeta que contiene un proyecto:

- Detecta su nombre y comprueba si ya tiene un repositorio Git.
- Revisa si existen archivos secretos, contraseñas, tokens, carpetas de dependencias o archivos que no deban publicarse.
- Configura un `.gitignore` adecuado.
- Si no existe repositorio remoto, prepara uno nuevo PRIVADO en mi propia cuenta de GitHub.
- Si no existe historial Git local, inicialízalo y prepara el pr
```

- **Texto original (literal), fragmento 2 (02:53:18, empieza en la sección 5):**

```
5. DEJA EL PROYECTO LISTO EN GITHUB

Si estoy trabajando dentro de una carpeta que contiene un proyecto:

Detecta su nombre y comprueba si ya tiene un repositorio Git.

Revisa si existen archivos secretos, contraseñas, tokens, carpetas de dependencias o archivos que no deban publicarse.

Configura un .gitignore adecuado.

Si no existe repositorio remoto, prepara uno nuevo PRIVADO en mi propia cuenta de GitHub.

Si no existe historial Git local, inicialízalo y prepara el primer commit.

Configura la identidad de Git correctamente sin inventar datos personales.

Sube el proyecto a GitHub mediante GitHub CLI.

Si ya existe un repositorio remoto, revísalo antes de modificarlo. Nunca fuerces un push ni sobrescribas trabajo existente.

Comprueba que los archivos realmente llegaron al repositorio.

Puedes utilizar gh repo create --private --source=. --push cuando el proyecto local ya tenga los commits correspondientes y hayas comprobado que no contiene secretos.

Si estoy fuera de un proyecto, limita esta fase a dejar GitHub preparado; no inventes uno.

6. REGLAS DE AUTONOMÍA

NO respondas con un tutorial.

NO entregues solamente código para que yo lo ejecute.

NO me pidas abrir PowerShell o buscar GitHub en internet.

UTILIZA las herramientas de ejecución disponibles.

Si necesitas mostrar una terminal, ábrela tú mismo.

Si necesitas abrir un navegador, hazlo tú mismo.

Si una instalación requiere aprobación de Windows u OpenCode, solicítala mediante su ventana correspondiente.

Si estás en modo Plan o sin herramientas de ejecución, indica exactamente qué permiso o modo falta; no simules haber instalado nada.

No alteres la seguridad de Windows ni desactives protecciones para lograrlo.

No te detengas por errores recuperables.

No declares éxito sin comprobarlo.

7. RESULTADO FINAL

Al terminar, muéstrame un mensaje muy sencillo:

✅ Git instalado
✅ GitHub CLI instalado
✅ Sesión de GitHub iniciada
✅ Git configurado
✅ OpenCode conectado con GitHub

Si subiste un proyecto, incluye su URL completa y abre el repositorio en mi navegador.

Si algún paso no se completó, márcalo como pendiente y explica brevemente qué intervención es indispensable.

EMPIEZA AHORA. EJECUTA EL PRIMER COMANDO, NO ME EXPLIQUES QUÉ VAS A HACER.
```

- **Nota de integridad:** no se rellenó nada. La palabra "primer commit" aparece literalmente en el fragmento 2 (primer viñeta de la sección 5 repetida), por lo que la unión puede hacerse sin inventar texto: fragmento 1 completo + fragmento 2 desde "Configura la identidad de Git correctamente...". Es lo que el Profesor pidió pegar "todo junto".
- **Resultado observado:** Estudiante 7 (aprox. 02:55-03:00, L1890-L1960) vio abrirse una ventana "Windows PowerShell 5.1" con el texto de autorización de GitHub CLI y el cursor parpadeando; además se abrió la página de GitHub que pedía iniciar sesión otra vez aunque ya tenía sesión. Se copió la dirección de la ventana de PowerShell al navegador, apareció el código de dispositivo, autorizó y el Profesor confirmó: "El código no llega por correo" (L1996). A las 02:58 Estudiante 3 y Estudiante 6 informaron que ya habían conectado (no queda documentado con cuál de los prompts P09-P11). Estudiante 5 siguió con sesiones "trabajando".
- **Dificultades relacionadas:** el Profesor no sabía qué esperar visualmente (L1854, "al no tener yo el manual de cómo hacerlo"); confusión entre la ventana de PowerShell, el chat de OpenCode y el navegador; tras minimizar OpenCode apareció la ventana oculta; el código caducó una vez (generó otro). Había un aviso de solicitud de permisos de Windows con un nombre desconocido (ver P09).

---

## P12 — Crear repositorio y desplegar en GitHub Pages

- **Estado:** original íntegro (3 apariciones).
- **Horas en chat:** 03:01:41 (Profesor); 03:04:29 (Estudiante 2 lo re-pega con su pregunta "ahora ponemos esto?"); 03:05:05 (Profesor lo repite). El texto del Profesor es idéntico en las dos apariciones suyas.
- **Marca de transcripción:** aprox. 03:00:00-03:10:00 (L2008-L2110).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode, en la misma sesión donde se creó la landing page.
- **Problema que resolvía:** publicar la landing en un enlace público y dejarla en un repositorio para trabajar luego con Claude Code o Codex.
- **Momento de la práctica:** práctica final de despliegue (aprox. 03:00-03:15). Los estudiantes debían copiar el enlace al muro de Top Learning.
- **Contexto previo:** GitHub CLI autenticado mediante P09-P11.
- **Texto original (literal), 03:01:41 (Profesor):**

```
crea un repositorio nuevo y despliega en github pages la landing page ya publica, crea el repositorio y dame el link
```

- **Texto original (literal), 03:04:29 (re-pegado por Estudiante 2, con su pregunta final):**

```
crea un repositorio nuevo y despliega en github pages la landing page ya publica, crea el repositorio y dame el link

ahora ponemos esto?
```

- **Texto original (literal), 03:05:05 (Profesor):**

```
crea un repositorio nuevo y despliega en github pages la landing page ya publica, crea el repositorio y dame el link
```

- **Resultado observado:** Estudiante 6 publicó ("creo que ya la publicó", 03:07:13; URL omitida por privacidad, es una URL de GitHub Pages con ruta de proyecto). Estudiante 7 compartió su URL de GitHub Pages (03:12:27, omitida); OpenCode "ya confirmó que existe su repositorio, ya está revisando el proyecto, creándolo y desplegándolo" (L2047) y el Profesor confirmó que el sitio abría. Estudiante 4 publicó en Firebase en lugar de GitHub Pages (03:13:42, URL omitida), lo que el Profesor aceptó.
- **Dificultades relacionadas:** (1) Estudiante 2 no sabía dónde pegar el prompt (03:04:29-03:05:02: "en GitHub?"); (2) Estudiante 3 preguntó si Claude Code podía hacerlo sin OpenCode (03:04:34, 03:05:16): el Profesor dijo que sí, que solo habría que conectar GitHub; (3) Estudiante 7 recibió una solicitud adicional (una ventana amarilla) y, al final, OpenCode "detectó un fallo real" (L2201) por el que el sitio aún necesitaba correcciones; (4) Estudiante 4 alcanzó el límite gratuito (03:12:37); (5) Estudiante 8 no pudo conectar (03:15:55) y Estudiante 5 pausó; el Profesor prometió un repaso la siguiente clase. En 03:02:58 Estudiante 2 pegó un aviso de GitHub que decía "Never use a code sent by someone else" mientras buscaba el código (se omite su usuario).

---

## P13 — Landing page Stilís (Estudiante 4)

- **Estado:** original íntegro. **Autoría: Estudiante 4, no el Profesor.**
- **Hora en chat:** 03:15:51 (la URL de su sitio publicado en Firebase se compartió antes, a las 03:13:42; se omite).
- **Marca de transcripción:** aprox. 03:10:00-03:20:00 (L2241-L2300).
- **Compartido por:** Estudiante 4.
- **Herramienta destino:** OpenCode (modelo GLM, el mismo del grupo); el texto parece ser la salida del meta-prompt P07 pasada por un asistente conversacional (ver L2270).
- **Problema que resolvía:** crear una landing page de presentación, demostración y conversión para una app propia de estilo personal.
- **Momento de la práctica:** práctica de landing personalizada.
- **Contexto previo:** el Profesor recomendó aplicar el meta-prompt P07 con la idea propia de cada estudiante. La estudiante afirmó haberlo hecho: "pedí a mi que me hiciera el metaprompting y ya se lo pasé" (sic).
- **Texto original (literal):**

> **[Texto íntegro omitido en la versión del repositorio]** Prompt de autoría estudiantil (chat 03:15:51). Se conserva fuera del repositorio hasta contar con autorización para redistribuirlo. Estructura analizada en `02_AUDITORIA_DE_PROMPTS.md` y recreación didáctica en `04_PROMPTS_MEJORADOS_AVANZADOS.md`.

- **Resultado observado:** el Profesor abrió el sitio publicado (Firebase) y dijo: "tiene sus animaciones, tiene su acá para cambiar los tipos de outfits", "ya está publicado, ya lo puedo ver yo y lo puede ver cualquiera con el link", "te creó un super buen landing page", y atribuyó el estilo a GLM. Notó que haría falta añadir fotos de productos.
- **Dificultades relacionadas:** la estudiante alcanzó el límite gratuito de OpenCode (03:12:37), y el Profesor explicó que "se restablece cada ciertas horas".

---

## P14 — Prueba de Google Flow desde OpenCode

- **Estado:** instrucción oral.
- **Hora en chat:** sin mensaje.
- **Marca de transcripción:** aprox. 00:55:00-01:05:00 (L538-L600).
- **Compartido por:** Profesor.
- **Herramienta destino:** OpenCode del Profesor (navegador integrado) hacia Google Flow.
- **Problema que resolvía:** evaluar la capacidad del agente para usar un navegador y operar otra IA (generación de video).
- **Momento de la práctica:** demostración del Profesor mientras los estudiantes ejecutaban P02.
- **Instrucciones orales identificadas (citas de transcripción):** "métete a Google Flow y hazme un video" (L540) y la petición de un "video estilo cinematográfico" (L561). El Profesor aclaró que le daría "toda la autonomía" al agente (L563).
- **Resultado observado:** el agente creó su propio prompt para Flow "por sí solo" (L599) y generó un video que el Profesor consideró "no se ve mal" (L631-L635).
- **Dificultades relacionadas:** Flow requiere una sesión de Google; el Profesor reconoció: "obviamente contraseña siempre nos va a pedir a nosotros", es decir, la contraseña la escribió el propio usuario, no el agente. Más tarde (L1022-L1030) señaló que P06 le pediría sesión de Flow a los estudiantes.

---

## P15 — "¿Qué me hace falta para desplegar?"

- **Estado:** instrucción oral.
- **Hora en chat:** sin mensaje.
- **Marca de transcripción:** aprox. 02:45:00-02:50:00 (L1765-L1784).
- **Compartido por:** Profesor (sugerencia a estudiantes con instalación atascada).
- **Herramienta destino:** OpenCode.
- **Problema que resolvía:** cuando OpenCode se detenía en la autenticación, obtener de él el diagnóstico y el siguiente paso sin escribir comandos.
- **Instrucción oral identificada (L1765-L1777):** "¿Qué me hace falta para desplegar?"
- **Resultado observado:** Estudiante 7 la usó y OpenCode respondió (según ella, L1803) con una recomendación de "empezar con Netlify Drop para tener la web en línea hoy mismo y luego conectarte a GitHub para que las actualizaciones sean automáticas", mencionando el login de GitHub "que quedó a medias" y preguntando "¿quieres que la publique en Netlify?". El Profesor respondió que "los agentes son así: cuando se les complica ya no lo quieren hacer" y generó P11.
- **Dificultades relacionadas:** muestra que, ante un bloqueo, el agente cambió de plataforma por iniciativa propia (riesgo: publicar en un servicio no pedido).

---

## P16 — Reconexión de un repositorio desde Claude Code

- **Estado:** instrucción oral (ejemplo didáctico, no ejecutado en clase).
- **Hora en chat:** sin mensaje; la pregunta relacionada de Estudiante 3 en chat es 03:04:34 ("y podríamos pedirle lo mismo a Claude Code?") y 03:05:16 ("pero lo puede hacer Claude Code directo? sin open code?").
- **Marca de transcripción:** aprox. 03:00:00-03:10:00 (L2048-L2075).
- **Compartido por:** Profesor.
- **Herramienta destino:** Claude Code (o Codex).
- **Problema que resolvía:** seguir trabajando sobre un proyecto ya publicado en GitHub desde otro agente, aunque el chat original se pierda.
- **Instrucción oral identificada (L2048):** "Conéctate al repositorio de [nombre del proyecto]... y sigue trabajando sobre él" (en la transcripción: "Conéctate al repositorio de de Dentea"). Añadió que en Claude "en la parte de conexiones" basta con conectar GitHub.
- **Resultado observado:** no se ejecutó en clase.
- **Dificultades relacionadas:** el Profesor describió la conexión de GitHub en Claude como "correo, contraseña y listo"; conviene aclarar que el inicio de sesión se hace en la página oficial de GitHub, no escribiendo credenciales a un agente.
