# E1577 | LABORATORIO FINAL — Construye. Resuelve. Continúa.

**Guion oral con tiempos · 12 diapositivas · 40 min · Google Meet**
**Fecha:** miércoles 18 de noviembre de 2026 · **Profesor:** Kevin Daniel Martínez Orozco · Top Learning, grupo E1577 "Inteligencia Artificial y Automatización con n8n"
**Concepto:** "Una etapa termina. Lo que construyan apenas comienza."

> Nota institucional: adaptación extraordinaria sujeta a Coordinación Académica. No terminar anticipadamente la llamada; se mantienen los 40 min completos.
> Voz: profesor joven, cercano, que no pretende saberlo todo. Si algo no se puede verificar, se dice: "no estoy seguro, lo confirmo con Coordinación" o "si la plataforma lo permite".
> Material compañero: `E1577_Practica_OpenCode_OpenRouter.md` (prompts y pasos) y `E1577_Contingencias.md` (errores, respaldo, checklist).

**Contexto de la sesión del 13/11 (de la transcripción):** se repasó n8n, OpenRouter, Hermes, OpenCode y Muse; se pidió a Muse un dashboard de activos y pasivos como cierre; quedó pendiente que compartieran sus prácticas en el muro. Juan Caudillo preguntó cómo compartir su dashboard HTML: al pegarlo en el muro de Top Learning solo aparece un enlace y no se ejecuta; se le sugirió pedirle a su Muse que lo suba como archivo a la carpeta del curso. Sobre Muse, la transcripción dice: agente personal que organiza objetivo, guion y estructura, trabaja en sus propios "espacios" y se le puede conectar Drive. No se afirma nada más.

## Mapa de tiempos

| Min | Diapositiva | Tema |
|---|---|---|
| 0:00–1:15 | 1 | Portada + bienvenida y disculpa |
| 1:15–3:00 | 2 | Hoy ustedes toman el control |
| 3:00–5:00 | 3 | Comprobar, no solo generar |
| 5:00–7:00 | 4 | De una idea a una app con IA |
| 7:00–8:30 | 5 | Café Horizonte AI |
| 8:30–16:00 | 6 | OpenCode: construyamos |
| 16:00–22:00 | 7 | Probemos, fallemos y corrijamos |
| 22:00–24:00 | 8 | ¿Y si Muse también pudiera...? |
| 24:00–29:00 | 9 | Consultorio final (+ demos de alumnos) |
| 29:00–31:30 | 10 | Gracias por dejarme acompañarlos |
| 31:30–32:30 | 11 | Frase final |
| 32:30–40:00 | 12 | Bloque institucional (evaluación, registro, recordatorio) |

(El bloque institucional absorbe evaluación y registro hasta el minuto 38 y el recordatorio de 38 a 40.)

---

## Diapositiva 1 — Portada: E1577 | LABORATORIO FINAL (0:00–1:15)

**Qué digo (30–45 s de bienvenida y disculpa):**
"Muy buenas noches a todos. Antes que nada, quiero ofrecerles nuevamente una disculpa por la confusión de horario de nuestra sesión anterior. Entiendo que no todos pudieron conectarse y eso es algo que me gustaría corregir. Por eso hoy sí vamos a concluir definitivamente esta etapa, y lo vamos a hacer de la mejor manera: construyendo una última aplicación con IA, resolviendo dudas y cerrando juntos. Gracias por estar aquí."
**Qué comparto:** diapositiva de portada.
**Qué pido al alumno:** que escriban "presente" en el chat.
**Pregunta:** "¿Quién estuvo el viernes y quién no? No pasa nada, solo para saber desde dónde partimos."
**Silencio:** 5 s tras la pregunta.
**Si nadie responde:** "Perfecto, asumo que hay de ambos y seguimos."
**Si OpenCode tarda:** no aplica aún; abrir OpenCode en segundo plano.
**Transición:** "Veamos qué vamos a hacer hoy."

## Diapositiva 2 — Hoy ustedes toman el control (1:15–3:00)

**Qué digo:** "La agenda de hoy, 40 minutos: primero entendemos qué vamos a construir; luego lo construimos con OpenCode; lo probamos, lo rompemos a propósito y lo corregimos; vemos hacia dónde podría crecer; y dejo un consultorio abierto. No es una clase de teoría. Yo manejo la demo, pero ustedes deciden qué probar y qué preguntar."
**Qué comparto:** agenda con los bloques y tiempos.
**Qué pido:** que anoten en el chat una duda que quieran resolver hoy.
**Pregunta:** "¿Cuál es la duda que no los dejaría irse tranquilos hoy?"
**Silencio:** 8 s; leer las dudas conforme lleguen y anotarlas para el consultorio.
**Si nadie responde:** "Yo traigo cinco dudas típicas preparadas; seguro alguna es suya."
**Si OpenCode tarda:** n/a.
**Transición:** "Y para empezar, una idea que quiero dejar clara."

## Diapositiva 3 — No basta con generar código, debemos comprobar que funciona (3:00–5:00)

**Qué digo:** "La IA genera código muy rápido, y muchas veces se ve convincente aunque no funcione. Mi regla: nada está terminado hasta que lo ejecutamos y lo probamos. Hoy cada paso tiene una comprobación: ¿arranca?, ¿responde?, ¿la respuesta coincide con los datos reales?, ¿la clave está a salvo? Y aquí entra el criterio humano: la IA propone, nosotros verificamos."
**Qué comparto:** tres verbos: Generar -> Ejecutar -> Comprobar.
**Qué pido:** que opinen en el chat.
**Pregunta:** "¿Les ha pasado que la IA les dio algo que se veía perfecto y no corría?"
**Silencio:** 6 s.
**Si nadie responde:** cuento un caso propio breve (algo que me falló por no verificar).
**Si OpenCode tarda:** n/a.
**Transición:** "Veamos la arquitectura de lo que vamos a comprobar."

## Diapositiva 4 — De una idea a una aplicación con IA (5:00–7:00)

**Qué digo:** "El recorrido es: cliente, frontend, backend en Node con Express, OpenRouter y la respuesta de vuelta. El frontend es la pantalla; el backend es quien recibe la pregunta y guarda los secretos; OpenRouter es la puerta de acceso a un modelo de lenguaje. Es un asistente conversacional especializado, no un agente autónomo de producción: responde preguntas sobre un negocio, no toma decisiones ni ejecuta acciones por su cuenta."
**Qué comparto:** diagrama: Cliente -> Frontend (HTML/CSS/JS) -> Backend (Node + Express) -> OpenRouter -> Respuesta.
**Qué pido:** que identifiquen dónde debe vivir la clave.
**Pregunta:** "En ese diagrama, ¿dónde debe vivir la clave de API y por qué?"
**Silencio:** 8 s.
**Si nadie responde:** "En el backend. Lo que está en el navegador, cualquiera con las herramientas del navegador puede verlo."
**Si OpenCode tarda:** n/a.
**Transición:** "Ahora el caso: una cafetería ficticia."

## Diapositiva 5 — Café Horizonte AI (7:00–8:30)

**Qué digo:** "Un café ficticio. Horario de lunes a viernes de 9:00 a 20:00 y sábado y domingo de 10:00 a 18:00. Menú: americano 45 pesos, capuchino 65, sándwich 89 y rebanada de pastel 75. El asistente debe responder con esos datos y, si le preguntan algo que no tiene, como el servicio a domicilio, debe decir que no lo sabe."
**Qué comparto:** tabla de horario y menú; las 4 preguntas de prueba.
**Qué pido:** que predigan una respuesta.
**Pregunta:** "Si preguntamos '¿cuánto cuestan dos capuchinos?', ¿qué respuesta correcta esperamos?" (130 MXN)
**Silencio:** 5 s.
**Si nadie responde:** "130 pesos. Esa respuesta nos sirve como prueba: si dice otra cosa, algo falló."
**Si OpenCode tarda:** n/a.
**Transición:** "Vamos a pedírselo a OpenCode."

## Diapositiva 6 — OpenCode: construyamos la aplicación (8:30–16:00)

**Qué digo:** "La app ya la preparé antes de la sesión, así que si algo tarda no nos quedamos esperando. Voy a seguir los siete pasos: abro OpenCode en la carpeta; pego la instrucción; identifico qué es frontend y qué es backend; inicio el servidor y abro la URL exacta; pruebo una pregunta; vemos qué pasa si falta la clave; y le pido a OpenCode que corrija. Nunca voy a pedir claves en la llamada ni voy a mostrar el archivo .env."
**Qué comparto:** terminal/OpenCode; el prompt de `E1577_Practica_OpenCode_OpenRouter.md` (no mostrar `.env`).
**Qué pido:** quien tenga OpenCode que haga lo mismo en su equipo; quien no, que siga la demo y use el dashboard de respaldo (ver Contingencias).
**Pregunta:** "Mientras OpenCode trabaja: ¿qué archivos esperan ver, cuáles son frontend y cuáles backend?"
**Silencio:** dejar trabajar a OpenCode 20–30 s sin hablar; leer en voz alta lo que va haciendo.
**Si nadie responde:** señalar yo: `public/` es frontend, `server.js` es backend.
**Si OpenCode tarda:** "Esto es normal, a veces tarda. Mientras, abro la versión preparada y seguimos; la de ustedes la revisan al terminar." Abrir el ejemplo local preparado.
**Transición:** "Ya corre. Ahora la parte más útil: romperlo."

## Diapositiva 7 — Probemos, fallemos y corrijamos (16:00–22:00)

**Qué digo:** "Hacemos las cuatro preguntas: ¿A qué hora abren? ¿Cuánto cuestan dos capuchinos? ¿Qué me recomiendas para desayunar? ¿Tienen servicio a domicilio? La última es la trampa: no tenemos ese dato. Hay dos rutas. Ruta A: modelo real con OpenRouter, solo si ya está configurado. Ruta B: modo demostración, que dice claramente en pantalla que no usa un modelo real. Ahora provoco un error a propósito: quito la clave o pongo un modelo inválido, y le pido a OpenCode que lo corrija."
**Qué comparto:** la app corriendo, la insignia de modo, el prompt de corrección.
**Qué pido:** que propongan cuál sería el error probable antes de que lo revisemos.
**Pregunta:** "¿Qué creen que vamos a ver en pantalla si falta la clave: error técnico o mensaje amable?"
**Silencio:** 6 s.
**Si nadie responde:** "Lo comprobamos juntos."
**Si OpenCode tarda:** "Mientras corrige, leemos el error; saber leerlo es parte del oficio."
**Transición:** "Ya vimos que funciona. ¿Hasta dónde puede crecer esto?"

## Diapositiva 8 — ¿Y si Muse también pudiera utilizar nuestro agente? (22:00–24:00)

**Qué digo:** "Tres niveles, y cuidado: no prometo magia. Nivel 1, disponible hoy: usar Muse para planear requisitos, redactar instrucciones, revisar la experiencia de usuario y pasarle ese prompt a OpenCode manualmente. Nivel 2, condicionado: necesitaríamos una API segura por HTTPS con autenticación, y si la cuenta o plataforma permite conectores personalizados (yo no lo he comprobado), explorar un conector: Muse, conector autorizado, API del negocio, backend, OpenRouter. Algo importante: localhost no es accesible desde fuera de mi computadora, y nunca se expone un endpoint sin autenticación. Nivel 3, propuesto: base de datos, CRM, n8n, autenticación, observabilidad y supervisión humana."
**Qué comparto:** diagrama de tres niveles.
**Qué pido:** que elijan un nivel para su proyecto.
**Pregunta:** "Si fueran a llevar esto a su trabajo, ¿qué agregarían primero del nivel 3?"
**Silencio:** 6 s.
**Si nadie responde:** propongo n8n para registrar consultas y supervisión humana para casos sensibles.
**Si OpenCode tarda:** n/a.
**Transición:** "Abramos el consultorio."

## Diapositiva 9 — Consultorio final (24:00–29:00)

**Qué digo:** "Empiezo con la duda de Juan, porque seguro le pasó a más de uno: generó su dashboard en HTML y al pegarlo en el muro solo aparece un enlace y no se ejecuta. Explicación simple: un archivo HTML necesita abrirse en un navegador; una vista previa local vive solo en tu computadora; un archivo adjunto se descarga y se abre; y un enlace público requiere una app alojada. Lo que sugerí el viernes fue compartirlo como archivo en la carpeta del curso; si la plataforma lo permite lo adjuntan como archivo, y qué formatos acepta el muro lo confirmo con Coordinación. Después veo las dudas del chat."
**Qué comparto:** diapositiva con las cinco dudas: dónde están los archivos de OpenCode (carpeta donde se abrió); cómo reabrir la app (volver a la carpeta, `npm start`, abrir la URL); por qué no responde OpenRouter (clave, modelo, límite de uso, red; revisar `/api/health` y la consola); cómo interpretar un error del backend (leer código de estado y mensaje, copiárselo a OpenCode); qué falta para una app real (autenticación, base de datos, límites de uso, monitoreo, supervisión humana, hosting seguro).
**Qué pido:** que pregunten o que 1–2 personas muestren lo que hicieron (2 min cada una).
**Pregunta:** "¿Qué se les atoró? ¿Quién quiere compartir pantalla?"
**Silencio:** 10 s después de abrir el micrófono; es incómodo, es normal.
**Si nadie responde:** provocar un error intencional (puerto ocupado o clave inválida) y corregirlo en vivo; ver Contingencias.
**Si OpenCode tarda:** responder dudas conceptuales mientras tanto.
**Transición:** "Antes de lo institucional, quiero decirles algo."

## Diapositiva 10 — Gracias por dejarme acompañarlos (29:00–31:30)

**Qué digo (despedida oral, 2–3 min, tres ideas):**
"Primero: las herramientas cambian. Hoy hablamos de OpenCode, OpenRouter y Muse; el año que viene seguramente serán otras. Lo que se transfiere son los principios: dividir un problema, pedir con claridad, proteger las claves, probar antes de confiar. Segundo: el aprendizaje sigue. No termina porque termine el diplomado; sigue cuando experimentan, cuestionan, construyen y verifican por su cuenta, y cuando se equivocan y lo corrigen. Tercero: gratitud. Gracias por dejarme acompañarlos en la segunda mitad del diplomado, y por ver cómo empezaron a experimentar con agentes, automatizaciones y APIs. Yo también sigo aprendiendo, y varias cosas las aprendí viendo lo que ustedes preguntaban."
**Qué comparto:** diapositiva con tres frases: Las herramientas cambian · Los principios se transfieren · Seguimos construyendo.
**Qué pido:** nada; que escuchen.
**Pregunta:** ninguna; opcional al final: "¿Qué es lo primero que van a construir?"
**Silencio:** 5 s al terminar.
**Si nadie responde:** seguir; no forzar.
**Si OpenCode tarda:** n/a.
**Transición:** "Y para cerrar con una frase."

## Diapositiva 11 — Frase final (31:30–32:30)

**Qué digo:** "Las herramientas cambiarán. Lo que aprendieron a construir se queda con ustedes. Gracias, E1577."
**Qué comparto:** solo la frase.
**Qué pido:** nada.
**Pregunta:** ninguna.
**Silencio:** 5 s.
**Si nadie responde / OpenCode tarda:** n/a.
**Transición:** "Ahora sí, lo institucional."

## Diapositiva 12 — Bloque institucional (32:30–40:00)

**Qué digo:** "Ahora lo institucional. Les comparto las indicaciones de evaluación y de registro; les doy unos minutos. Para cualquier fecha o requisito específico, lo confirmo con Coordinación Académica y les aviso por el canal oficial."
Minuto 38–40: "Recordatorio: revisen sus pendientes y los canales oficiales de Top Learning. Gracias, nos vemos."
**Qué comparto:** instrucciones de evaluación y registro (según Coordinación; no inventar fechas ni enlaces).
**Qué pido:** completar evaluación y confirmar asistencia.
**Pregunta:** "¿Alguna duda sobre la evaluación o el registro?"
**Silencio:** dar tiempo real; no llenar el silencio.
**Si nadie responde:** responder las dudas pendientes del consultorio.
**Si OpenCode tarda:** n/a.
**Transición:** mantener la llamada hasta el minuto 40; cierre final.
