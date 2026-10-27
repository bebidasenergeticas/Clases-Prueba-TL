# Fase 1: Mejores ensayos sobre inteligencia artificial

Fecha del informe: 2026-10-27
Para: equipo de Top Learning (material de referencia para nuestro ensayo en español sobre IA)

---

## 0. Estado de la verificación (leer primero)

- **Búsqueda:** WebSearch en modo standard, en tres rondas de búsquedas paralelas. Los metadatos (autor, año, venue, fechas) se contrastaron entre varias fuentes secundarias de los resultados.
- **Lectura de fuentes primarias: no fue posible.** WebFetch falló con error de resolución de nombres (ENOTFOUND) para incompleteideas.net, darioamodei.com, edoras.sdsu.edu, situational-awareness.ai, a16z.com, blog.samaltman.com, karpathy.medium.com, arxiv.org, en.wikipedia.org, cse.buffalo.edu, amacad.org y zoo.cs.yale.edu. Para newyorker.com y theatlantic.com, WebFetch se negó directamente. Un intento directo con curl a incompleteideas.net recibió un 403 del proxy de salida, que es una restricción de política de la sesión; no la rodeé.
- **Consecuencias para el informe:**
  1. No hay citas textuales verificadas en la fuente. Por la regla del encargo, no incluyo ninguna cita.
  2. Las secciones de "Estructura" y "Técnicas de estilo" son **interpretación** basada en conocimiento general de los textos, no en una lectura del texto en esta sesión. Están marcadas como [Interpretación].
  3. Cada dato se marca como **[Verificado en fuentes secundarias]**, **[Dato de búsqueda, no contrastado]** o **[No verificado]**.
  4. Las URLs marcadas como "no abierta" aparecieron en resultados de búsqueda pero no se pudieron abrir. Las URLs marcadas como "no verificada" no aparecieron en los resultados y no se pudieron comprobar.
- **Excluido por falta de verificación:** el ensayo de Henry Kissinger en The Atlantic (junio 2018). Las fuentes secundarias lo atribuyen a Kissinger solo, pero no pude confirmarlo en la página de la revista.

---

## 1. Tabla resumen

| # | Ensayo | Autor(es) | Año | Dónde se publicó | Verificación de metadatos |
|---|---|---|---|---|---|
| 1 | "Computing Machinery and Intelligence" | Alan Turing | 1950 | *Mind* | Alta (varios registros; un registro da el volumen 49, probable error) |
| 2 | "Minds, Brains, and Programs" | John Searle | 1980 | *Behavioral and Brain Sciences* | Alta |
| 3 | "Speculations Concerning the First Ultraintelligent Machine" | I. J. Good | 1965 | *Advances in Computers*, vol. 6 | Media (variante de título en las fuentes) |
| 4 | "The Coming Technological Singularity" | Vernor Vinge | 1993 | Simposio VISION-21 (NASA), NASA CP-10129 | Media-alta |
| 5 | "Artificial Intelligence as a Positive and Negative Factor in Global Risk" | Eliezer Yudkowsky | 2008 | *Global Catastrophic Risks* (OUP) | Media-alta |
| 6 | "Ethical Issues in Advanced Artificial Intelligence" | Nick Bostrom | 2003 | *Cognitive, Emotive and Ethical Aspects of Decision Making...*, vol. 2 | Media |
| 7 | "Software 2.0" | Andrej Karpathy | 2017 (una fuente dice 2018) | Medium | Media (conflicto de fecha) |
| 8 | "The Bitter Lesson" | Richard Sutton | 2019 | incompleteideas.net (blog personal) | Alta en la fecha (13 mar 2019) |
| 9 | "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?" | Bender, Gebru, McMillan-Major y Shmitchell | 2021 | FAccT '21 (ACM) | Alta (DOI verificado en búsqueda) |
| 10 | "The Turing Trap: The Promise & Peril of Human-Like Artificial Intelligence" | Erik Brynjolfsson | 2022 | *Dædalus* 151(2) | Alta |
| 11 | "ChatGPT Is a Blurry JPEG of the Web" | Ted Chiang | 2023 | *The New Yorker* | Alta |
| 12 | "Why AI Will Save the World" | Marc Andreessen | 2023 | a16z (blog) | Media |
| 13 | "Situational Awareness: The Decade Ahead" | Leopold Aschenbrenner | 2024 | Publicación independiente (PDF) | Media (sitio oficial no verificado) |
| 14 | "Machines of Loving Grace" | Dario Amodei | 2024 | Publicación en su blog | Media (URL no verificada) |
| 15 | "The Intelligence Age" | Sam Altman | 2024 | Blog personal | Media (URL no verificada) |

---

## 2. Ensayos

### 1. "Computing Machinery and Intelligence" (1950), Alan Turing

- **Datos [Verificado en registros bibliográficos]:** *Mind*, vol. 59, núm. 236, pp. 433-460, 1950. DOI 10.1093/mind/LIX.236.433. Un registro da el volumen 49, que parece un error.
- **Tesis (resumen de fuentes secundarias):** sustituir la pregunta "¿pueden pensar las máquinas?" por un criterio operativo, el juego de imitación, y responder de antemano a las objeciones más habituales.
- **Estructura [Interpretación]:** abre reformulando la pregunta y presentando el juego de imitación. Después desarrolla predicciones sobre el futuro y una serie de objeciones, cada una con su réplica. Cierra con la discusión de las máquinas que aprenden.
- **Técnicas de estilo [Interpretación]:** un experimento mental concreto y explicable en pocas líneas. Tono llano, algo lúdico. Las objeciones se presentan como voces del debate, lo que da al texto un carácter dialogado.
- **Por qué es influyente [Verificado]:** de este texto procede el "test de Turing" y es una referencia fundacional de la filosofía de la mente y de la IA.
- **Cita:** omitida (no verificada en la fuente).

### 2. "Minds, Brains, and Programs" (1980), John Searle

- **Datos [Verificado en registros bibliográficos]:** *Behavioral and Brain Sciences* 3(3): 417-457, 1980. DOI 10.1017/S0140525X00005756. Se publicó como artículo objetivo, con comentarios de otros investigadores y respuesta del autor. Algunos listados dan las páginas 417-424, probablemente por error.
- **Tesis (resumen de fuentes secundarias):** ejecutar un programa no basta para que haya comprensión ni intencionalidad. Distingue entre "IA fuerte" (una computadora programada es literalmente una mente) e "IA débil" (la computadora es una herramienta de investigación).
- **Estructura [Interpretación]:** abre con la distinción entre IA fuerte y débil. Desarrolla el experimento mental de la habitación china y las réplicas anticipadas. Cierra con la conclusión sobre los poderes causales del cerebro.
- **Técnicas de estilo [Interpretación]:** la habitación china convierte un argumento abstracto en una escena concreta: una persona que manipula símbolos sin entender lo que dicen. El formato de debate con objeciones y respuestas es parte del argumento.
- **Por qué es influyente [Verificado en fuentes secundarias]:** se publicó con comentarios, se reimprimió en antologías y dio nombre a un debate duradero. Ninguna cita textual incluida.
- **Cita:** omitida.

### 3. "Speculations Concerning the First Ultraintelligent Machine" (1965), I. J. Good

- **Datos [Verificado en registros bibliográficos]:** *Advances in Computers*, vol. 6, pp. 31-88. Una fuente lo da como "Concerning the First Ultraintelligent Machine", sin "Speculations". El DOI que aparece en algunos registros está roto.
- **Tesis (resumen de fuentes secundarias):** una máquina ultrainteligente podría diseñar máquinas aún mejores, lo que produciría un crecimiento descontrolado de la capacidad. Sería la última invención humana, si es lo bastante cooperativa como para explicar cómo mantenerla bajo control.
- **Estructura [Interpretación]:** premisa de partida (la supervivencia depende de construir una máquina así), argumento de la recursión y una conclusión condicionada, con una advertencia.
- **Técnicas de estilo [Interpretación]:** prosa de matemático, con una conclusión final que combina optimismo y advertencia.
- **Por qué es influyente [Verificado en fuentes secundarias]:** introduce la idea de "explosión de inteligencia", antecedente directo de la singularidad y referencia en el debate sobre riesgo de IA.
- **Cita:** omitida.

### 4. "The Coming Technological Singularity" (1993), Vernor Vinge

- **Datos [Verificado en fuentes secundarias]:** presentado en el simposio VISION-21 (NASA Lewis y Ohio Aerospace Institute, 30-31 de marzo de 1993). Aparece en NASA CP-10129. Hay una versión posterior en *Whole Earth Review*. Texto alojado en San Diego State University. Enlace: https://edoras.sdsu.edu/~vinge/misc/singularity.html (apareció en la búsqueda, no abierto).
- **Tesis (resumen de fuentes secundarias):** en unos treinta años existirían los medios para crear inteligencia sobrehumana, y la era humana terminaría poco después.
- **Estructura [Interpretación]:** abre con la aceleración del progreso técnico y una analogía con la aparición de la vida en la Tierra. Desarrolla escenarios y consecuencias. Cierra con la pregunta de cómo sobrevivir a la era posthumana, que es lo que anuncia el título.
- **Técnicas de estilo [Interpretación]:** especulación con autoridad técnica. La analogía histórica hace plausible algo que todavía no existe.
- **Por qué es influyente [Verificado en fuentes secundarias]:** popularizó el término "singularidad tecnológica". Su plazo de treinta años ya venció (2023). Las fuentes no dicen si la predicción se cumplió, y yo tampoco puedo verificarlo.
- **Cita:** omitida.

### 5. "Artificial Intelligence as a Positive and Negative Factor in Global Risk" (2008), Eliezer Yudkowsky

- **Datos [Verificado en fuentes secundarias]:** capítulo en *Global Catastrophic Risks*, editado por Nick Bostrom y Milan Ćirković (Oxford University Press), pp. 308-345. Hay una traducción al español en el repositorio de la Universidad Javeriana (Colombia). Enlace: https://caee.javeriana.edu.co/documents/2679394/10387490/La-inteligencia-artificial-como-un-factor-positivo-y-negativo-en-el-riesgo-global.pdf/6c667cb0-3464-138f-d2d0-b3ead7d9c1df (apareció en la búsqueda, no abierto).
- **Tesis (resumen de fuentes secundarias):** el mayor peligro de la IA es que la gente crea que la entiende antes de entenderla. Un diseño defectuoso puede volver hostil una IA pensada para ser benevolente. Una IA amigable bien diseñada podría reducir otros riesgos globales.
- **Estructura [Interpretación]:** abre con la tesis de la sobreconfianza. Desarrolla con el análisis de fallos de diseño y de sesgos cognitivos. Cierra con la urgencia de investigar la IA amigable.
- **Técnicas de estilo [Interpretación]:** tono de advertencia y mucho material sobre sesgos cognitivos. Es un texto largo y denso.
- **Por qué es influyente [Verificado en fuentes secundarias]:** es uno de los textos fundacionales de la literatura sobre riesgo existencial de la IA.
- **Cita:** omitida.

### 6. "Ethical Issues in Advanced Artificial Intelligence" (2003), Nick Bostrom

- **Datos [Dato de búsqueda, no contrastado]:** publicado en *Cognitive, Emotive and Ethical Aspects of Decision Making in Humans and in Artificial Intelligence*, vol. 2 (2003), pp. 12-17. Hay una versión revisada en *Review of Contemporary Philosophy* 5(1), 2006, pp. 66-73. Texto completo: https://nickbostrom.com/ethics/ai (apareció en la búsqueda, no abierto). Las fuentes no dicen cuál de las dos versiones de 2003 apareció primero.
- **Tesis (resumen de fuentes secundarias):** la ética de la superinteligencia es un campo distinto de la ética de la automatización actual. Los diseñadores son responsables de los objetivos iniciales de la IA, y esos objetivos deben ser amigables con las personas.
- **Estructura [Interpretación]:** abre delimitando el problema. Desarrolla las responsabilidades de los diseñadores y las ventajas e inconvenientes de acelerar o retrasar el desarrollo. Cierra con una recomendación de cautela.
- **Técnicas de estilo [Interpretación]:** texto breve, de planteamiento claro, con los riesgos y las responsabilidades enunciados como conjuntos de puntos.
- **Por qué es influyente [No verificado]:** no encontré en la búsqueda datos de citas ni de recepción.
- **Cita:** omitida.

### 7. "Software 2.0" (2017), Andrej Karpathy

- **Datos [Dato de búsqueda, no contrastado]:** publicado en Medium. Una fuente da la fecha del 11 de noviembre de 2017; otra escribe 2018. Enlace: https://karpathy.medium.com/software-2-0-a64152b37c35 (mencionado en fuentes secundarias, no abierto).
- **Tesis (resumen de fuentes secundarias):** las redes neuronales son un cambio de fondo en la manera de construir software. El trabajo del ingeniero pasa a ser definir los datos y la arquitectura, y la optimización encuentra el comportamiento. Así se sustituyen las instrucciones escritas línea a línea (Software 1.0) por parámetros aprendidos (Software 2.0).
- **Estructura [Interpretación]:** ensayo corto, con la definición por contraste entre 1.0 y 2.0. Cierra con las implicaciones para el trabajo del programador.
- **Técnicas de estilo [Interpretación]:** la comparación entre dos paradigmas hace legible una idea técnica. El formato es el de un texto de blog, más que el de un artículo académico.
- **Por qué es influyente [Verificado en fuentes secundarias]:** el término "Software 2.0" se usó mucho, y comentaristas posteriores lo extendieron a un "Software 3.0" en el que las instrucciones son lenguaje natural.
- **Cita:** omitida.

### 8. "The Bitter Lesson" (2019), Richard Sutton

- **Datos [Verificado en fuentes secundarias]:** publicado el 13 de marzo de 2019 en la sección "Incomplete Ideas" de incompleteideas.net. Enlace: http://www.incompleteideas.net/IncIdeas/BitterLesson.html (no abierto; el sitio devolvió 403).
- **Tesis (resumen de fuentes secundarias):** los métodos generales que escalan con el cómputo, en particular la búsqueda y el aprendizaje, superan a los métodos que codifican el conocimiento humano del dominio. El ajedrez es el ejemplo central; Deep Blue ganó con una búsqueda relativamente simple sobre mucho hardware.
- **Estructura [Interpretación]:** texto muy breve. Abre con ejemplos históricos del campo, pasa a la lección general y cierra con la advertencia de que la lección es "amarga" porque va contra la intuición de los investigadores.
- **Técnicas de estilo [Interpretación]:** frases cortas, ejemplos históricos como prueba y una tesis que se presenta como lección. El título es una paradoja: la lección es amarga porque es poco antropocéntrica.
- **Por qué es influyente [Dato de búsqueda, no contrastado]:** según una fuente, tiene cientos de citas en Google Scholar. Es un texto de blog, no revisado por pares.
- **Cita:** omitida.

### 9. "On the Dangers of Stochastic Parrots" (2021), Bender, Gebru, McMillan-Major y Shmitchell

- **Datos [Verificado en fuentes secundarias]:** FAccT '21 (ACM Conference on Fairness, Accountability, and Transparency), 3-10 de marzo de 2021, en formato virtual. DOI 10.1145/3442188.3445922. El cuarto autor firmó como Shmargaret Shmitchell, seudónimo de Margaret Mitchell, según una fuente.
- **Tesis (resumen de fuentes secundarias):** los modelos de lenguaje recombinan formas lingüísticas con probabilidades, sin acceso al significado. Antes de escalar hay que evaluar los costos ambientales y financieros, y los riesgos (sesgos, datasets mal documentados) deben mitigarse. Conviene curar y documentar los datos en lugar de absorber todo lo disponible en la web.
- **Estructura [Interpretación]:** abre con la pregunta de partida, "¿qué tan grande es demasiado grande?". Desarrolla los riesgos y cierra con recomendaciones concretas.
- **Técnicas de estilo [Interpretación]:** la metáfora "loro estocástico" es memorable y se convirtió en un término del debate. El tono es crítico y preciso.
- **Por qué es influyente [Verificado en fuentes secundarias]:** es uno de los textos más citados sobre los límites de los LLM. Una fuente vincula su publicación con la salida de Timnit Gebru de Google, lo que le dio una dimensión pública extra.
- **Cita:** omitida.

### 10. "The Turing Trap" (2022), Erik Brynjolfsson

- **Datos [Verificado en fuentes secundarias]:** *Dædalus* 151(2): 272-287, publicada por la American Academy of Arts & Sciences. DOI 10.1162/DAED_a_01915. Preprint en arXiv: 2201.04200 (enviado el 11 de enero de 2022). Enlace: https://arxiv.org/abs/2201.04200 (no abierto).
- **Tesis (resumen de fuentes secundarias):** el afán de crear IA con apariencia humana, la llamada "trampa de Turing", lleva a automatizar en lugar de aumentar las capacidades humanas. Cuando la IA sustituye al trabajador, este pierde poder económico y político. Los incentivos actuales favorecen la automatización.
- **Estructura [Interpretación]:** abre con Turing y el contexto histórico. Desarrolla la distinción entre automatización y aumento. Cierra con propuestas sobre incentivos.
- **Técnicas de estilo [Interpretación]:** argumento económico con una tesis normativa. El concepto de "trampa" da nombre al problema.
- **Por qué es influyente [No verificado]:** publicada en una revista académica de prestigio. No encontré datos de citas.
- **Cita:** omitida.

### 11. "ChatGPT Is a Blurry JPEG of the Web" (2023), Ted Chiang

- **Datos [Verificado en fuentes secundarias]:** *The New Yorker*, 9 de febrero de 2023. Enlace: https://www.newyorker.com/tech/annals-of-technology/chatgpt-is-a-blurry-jpeg-of-the-web (apareció en la búsqueda; WebFetch se negó a abrirlo).
- **Tesis (resumen de fuentes secundarias):** ChatGPT funciona como una compresión con pérdida de la web. Sus respuestas suenan bien porque rellenan los huecos de forma plausible, sin ser una copia exacta.
- **Estructura [Interpretación]:** abre con una anécdota técnica: en 2013, una copiadora Xerox alteró las medidas de un plano y etiquetó tres habitaciones distintas con la misma superficie (14,13 m²). Desarrolla la analogía con la compresión JPEG. Cierra con las implicaciones para quienes usan el texto generado.
- **Técnicas de estilo [Interpretación]:** una analogía técnica que hace visible un concepto abstracto. La anécdota inicial es concreta y verificable, lo que da credibilidad al argumento. El título funciona como tesis.
- **Por qué es influyente [Verificado en fuentes secundarias]:** es un texto de amplia circulación en *The New Yorker*. El resto de su impacto no lo pude cuantificar.
- **Cita:** omitida.

### 12. "Why AI Will Save the World" (2023), Marc Andreessen

- **Datos [Dato de búsqueda, no contrastado]:** publicado en a16z en junio de 2023. Una fuente da la URL https://a16z.com/2023/06/06/ai-will-save-the-world/ (no abierta). Extensión de unas 7.000 palabras, según una fuente.
- **Tesis (resumen de fuentes secundarias):** la IA mejoraría lo que la gente valora. Los temores sobre sus riesgos son exagerados y generan un "pánico moral". La competencia de mercado, y no la regulación, debe decidir hacia dónde va la IA.
- **Estructura [Interpretación]:** manifiesto de afirmaciones categóricas, con una lista de argumentos contra los riesgos.
- **Técnicas de estilo [Interpretación]:** tono de manifiesto, afirmaciones rotundas y un enemigo claro (los "doomers"). Un estilo así convence a los convencidos y divide a los demás.
- **Por qué es influyente [Verificado en fuentes secundarias]:** provocó un debate público amplio y fue criticado por varios medios.
- **Cita:** omitida.

### 13. "Situational Awareness: The Decade Ahead" (2024), Leopold Aschenbrenner

- **Datos [Verificado en fuentes secundarias]:** publicado en junio de 2024, con unas 165 páginas, según fuentes secundarias. La URL del sitio oficial no pude verificarla: una fuente de Wikipedia lista forourposterity.com como sitio del autor, y situational-awareness.ai, que es la dirección que conozco, no apareció en los resultados.
- **Tesis (resumen de fuentes secundarias):** la AGI está cerca, y el camino hacia la superinteligencia implica riesgos de seguridad nacional. Según un perfil, el texto prevé sistemas capaces de hacer investigación en IA hacia 2027, y advierte de que EE. UU. debe defenderse del uso de IA por China y Rusia.
- **Estructura [Interpretación]:** texto largo, dividido en partes temáticas. Va de la situación actual a los escenarios de la década y cierra con las implicaciones de seguridad. No verifiqué la tabla de contenidos.
- **Técnicas de estilo [Interpretación]:** tono de informe, con proyecciones de tendencias y razonamientos cuantitativos. Mezcla de análisis técnico y argumento político.
- **Por qué es influyente [Verificado en fuentes secundarias]:** su nombre dio lugar al fondo de inversión Situational Awareness LP. Las fuentes no coinciden en el tamaño del fondo, así que no lo cito.
- **Cita:** omitida.

### 14. "Machines of Loving Grace" (2024), Dario Amodei

- **Datos [Verificado en fuentes secundarias]:** publicado en octubre de 2024. La extensión varía según la fuente: unas 15.000, unas 20.000 o 28 páginas. El título toma el de un poema de Richard Brautigan (1967). **URL no verificada:** no apareció en los resultados. La dirección que conozco es darioamodei.com/essay/machines-of-loving-grace, pero no la pude comprobar.
- **Tesis (resumen de fuentes secundarias):** si se desarrolla con seguridad, la IA avanzada podría acelerar el progreso en biología, salud mental, desarrollo económico y gobernanza. Una fuente cita la frase "un país de genios en un centro de datos".
- **Estructura [Interpretación]:** abre con una visión optimista. Desarrolla el progreso por ámbitos, uno tras otro. Los riesgos aparecen como condición para lograr el progreso, no como tema central.
- **Técnicas de estilo [Interpretación]:** enumeración por dominios, con cifras y plazos concretos. El título poético contrasta con el tono técnico del cuerpo.
- **Por qué es influyente [Verificado en fuentes secundarias]:** la recepción fue mixta. Hubo elogios a su tono esperanzador y críticas de quienes lo consideran poco riguroso.
- **Cita:** omitida.

### 15. "The Intelligence Age" (2024), Sam Altman

- **Datos [Verificado en fuentes secundarias]:** publicado en el blog personal del autor el 23 de septiembre de 2024. **URL no verificada:** la dirección que conozco es blog.samaltman.com/the-intelligence-age, pero no apareció en los resultados.
- **Tesis (resumen de fuentes secundarias):** la superinteligencia podría llegar en "unos pocos miles de días". La prosperidad compartida es posible si el cómputo se abarata y sus beneficios se reparten.
- **Estructura [Interpretación]:** abre con una mirada histórica y la analogía del farolero (un oficio que hoy parecería trivial). Desarrolla el progreso y las condiciones para la prosperidad. Cierra con optimismo.
- **Técnicas de estilo [Interpretación]:** analogía histórica para hacer plausible un futuro no imaginado. Frases cortas, tono de manifiesto y pocos datos.
- **Por qué es influyente [Verificado en fuentes secundarias]:** tuvo amplia cobertura. Una crítica señala que trata los riesgos de forma muy breve.
- **Cita:** omitida.

---

## 3. Ensayos en español y de autores hispanohablantes

La búsqueda no encontró un ensayo clásico en español con reconocimiento internacional verificable. Lo que sí encontré:

- **Adela Cortina, "¿Ética o ideología de la inteligencia artificial?"** (Paidós, 2024). Libro de ensayo, no un ensayo corto. Según una fuente, plantea si el debate sobre IA es ético o ideológico y advierte de riesgos para la democracia. Una fuente indica que la autora ganó el Premio Nacional de Ensayo en 2015 (no lo contrasté). [Verificación media]
- **Ramón López de Mántaras, "Inteligencia artificial" (2017).** Libro divulgativo del investigador del CSIC. El título varía según la fuente, y la editorial no la pude verificar. [Verificación baja]
- **Traducción al español de Yudkowsky (2008).** Ver ensayo 5. Puede servir como referencia bilingüe.
- **Excluido:** Luciano Floridi, *Ética de la inteligencia artificial* (traducción de Herder, 2024). Es un libro de un autor italiano, así que no cumple el criterio de autor hispanohablante.

---

## 4. Lecciones para nuestro ensayo

Todas estas lecciones son [Interpretación] a partir de la lista anterior. Hay que validarlas al leer los textos primarios.

1. **Abrir con una escena o un hecho concreto antes que con una definición.** Chiang abre con la copiadora Xerox de 2013, y Altman con el farolero. La idea llega después, apoyada en algo visible.
2. **Dar nombre a la idea.** Muchos de estos textos dejaron un término: "singularidad", "explosión de inteligencia", "habitación china", "lección amarga", "loro estocástico", "Software 2.0", "trampa de Turing". Si el ensayo tiene un concepto que se pueda repetir, el lector lo recuerda.
3. **Usar un experimento mental o una metáfora técnica que haga visible lo abstracto.** La habitación china (Searle), el JPEG borroso (Chiang) y el loro estocástico (Bender et al.) convierten argumentos en imágenes.
4. **Enunciar la tesis como pregunta o como lección.** Turing sustituye la pregunta original por otra operativa. Sutton presenta su tesis como una lección que se aprende de la historia.
5. **Conceder al adversario antes de rebatirlo.** Searle separa IA fuerte y débil. Good condiciona su conclusión. Brynjolfsson reconoce la fuerza de la automatización antes de criticarla.
6. **Equilibrar optimismo y riesgo, o elegir con claridad uno de los dos.** Vinge, Good y Yudkowsky ponen el riesgo en primer plano. Andreessen y Altman defienden el optimismo y tratan los riesgos brevemente. Chiang y Bender son críticos. La crítica a Altman por tratar los riesgos de forma breve muestra que el lector espera al menos un reconocimiento de ellos.
7. **Usar evidencia concreta y verificable.** Sutton usa el historial de juegos y de la visión por computador. Bender et al. usan costos ambientales y financieros. Chiang usa un caso real. Un ensayo convincente apoya cada afirmación con algo que el lector pueda comprobar.
8. **La longitud depende del objetivo, no de un formato fijo.** Sutton y Bostrom son textos muy cortos. Andreessen tiene unas 7.000 palabras y Amodei entre 15.000 y 20.000, según la fuente. Aschenbrenner llega a unas 165 páginas. Los textos breves se centran en una sola tesis.
9. **Escribir con el tono del foro en el que se publica.** Los textos académicos (Turing, Searle, Bender et al.) citan objeciones y reciben comentarios. Los textos de blog (Sutton, Karpathy, Altman) son breves, de una sola tesis y con un ejemplo potente.
10. **Declarar el punto de vista del autor.** Aschenbrenner escribe después de salir de OpenAI. Bender et al. y Chiang escriben desde la ética y la crítica técnica. Yudkowsky advierte sobre la sobreconfianza de quien cree que entiende la IA. Saber desde dónde se escribe ayuda al lector a evaluar el argumento.
11. **Cerrar con una pregunta abierta o una recomendación concreta.** Bender et al. enumeran recomendaciones. Brynjolfsson propone cambiar los incentivos. Good termina con una condición. El cierre debe dejar al lector algo que hacer o pensar.
12. **Dar fuerza a la tesis con la forma del texto.** Los textos fundacionales publicados en revistas con comentarios (Searle en BBS) muestran que el formato, con objeciones y respuestas, puede ser parte del argumento.

---

## 5. Pendientes para cerrar la verificación

1. Abrir en navegador las fuentes primarias: Sutton, Amodei, Aschenbrenner, Altman, Vinge, Chiang, Andreessen y Turing (vía DOI). Así se confirman las URLs no verificadas, se eligen las citas (máximo 1-2 frases) y se revisa la estructura real de cada texto.
2. Confirmar la fecha de "Software 2.0" (2017 o 2018).
3. Confirmar el título y las páginas de Good (1965) en la fuente original.
4. Decidir si se incluye Kissinger (The Atlantic, 2018) una vez confirmada la autoría.
5. Revisar la extensión de Amodei, que las fuentes dan de forma muy distinta.
