# Contenido del ensayo: Inteligencia artificial para profesionales

*Nota para el editor: los bloques pueden reordenarse. Los números entre corchetes [n] remiten a la lista de Fuentes al final, con numeración única en todo el documento. B1 tiene dos versiones alternativas (B1-a y B1-b); use una sola.*

## [B1-a] Apertura: un escenario cotidiano

Lucía revisa su bandeja de entrada a las ocho de la mañana. Un correo de un proveedor trae una cotización impecable, con el logotipo correcto y el tono de siempre. Antes de responder, abre una hoja de cálculo que un asistente de inteligencia artificial preparó la noche anterior: resume tres contratos y marca una cláusula que no coincide con lo acordado. Lucía es gerente de administración en una empresa mediana de logística. No es programadora ni ingeniera, y hace tres años nada de esto formaba parte de su trabajo.

El escenario es ilustrativo, pero describe una situación cada vez más común. Según el AI Index 2026 de Stanford, 88% de las organizaciones ya usaba inteligencia artificial (IA) en 2025 [1]. La pregunta ya no es si esta tecnología llegará a nuestro sector, sino qué parte de nuestro trabajo cambiará primero, qué habilidades conviene desarrollar y qué riesgos debemos vigilar. Este ensayo responde a esas preguntas desde la práctica profesional, sin entusiasmo ciego ni alarmismo, con datos y con ejemplos que usted puede llevar a su escritorio.

*Ideas fuerza:* La IA ya forma parte del trabajo diario de muchos profesionales, no es un tema lejano. El reto es entender qué cambia, qué riesgos trae y qué decisiones nos toca tomar.

## [B1-b] Apertura: un caso real que obliga a desconfiar

En 2024, un empleado de la oficina de Hong Kong de una firma británica de ingeniería transfirió unos 25.6 millones de dólares (HK$200 millones) en 15 operaciones. Lo hizo tras una videollamada con supuestos colegas, entre ellos el director financiero (CFO, por sus siglas en inglés). Según la policía de Hong Kong, todos los demás participantes eran deepfakes: imágenes y voces generadas por inteligencia artificial que imitan a personas reales [2].

No fue un ataque de ciencia ficción ni requirió un hacker excepcional. Requirió una pantalla, un tono de autoridad y una urgencia bien elegida. Para quien trabaja en finanzas, compras o administración, la lección es directa: la IA ya permite imitar rostros y voces con una facilidad que hace pocos años no existía, y el control interno debe contemplarlo. Esa misma tecnología puede también ayudarnos a resumir, analizar y automatizar tareas que hoy nos quitan horas. Este ensayo recorre qué es la IA, dónde aporta valor, qué riesgos plantea y qué puede hacer usted esta semana para aprovecharla sin perder el control.

*Ideas fuerza:* Un fraude de unos 25.6 millones de dólares se cometió con una videollamada falsa. Entender la IA incluye aprender a desconfiar de forma inteligente y a usar sus beneficios con controles claros.

## [B2] Qué es la inteligencia artificial: conceptos clave

Una definición de trabajo describe la inteligencia artificial (IA) como el conjunto de sistemas que realizan tareas que, hechas por una persona, requerirían inteligencia: percibir, razonar, aprender, decidir o generar lenguaje. Dentro de ese campo conviene distinguir varios conceptos.

El aprendizaje automático (*machine learning*) no sigue reglas escritas a mano: aprende patrones a partir de miles de ejemplos ya etiquetados. Es como enseñar a un analista de crédito con expedientes resueltos, en lugar de entregarle un manual de mil páginas.

El aprendizaje profundo (*deep learning*) usa redes neuronales de muchas capas. Una red neuronal es un conjunto de unidades que transforman números, cuyas conexiones se ajustan con datos hasta que las respuestas mejoran. Piense en una línea de ensamblaje: la primera estación detecta bordes en una fotografía, la siguiente formas, y así hasta reconocer un rostro. Por este enfoque, Yoshua Bengio, Geoffrey Hinton y Yann LeCun recibieron el premio Turing 2018 [7].

Los modelos de lenguaje grande (LLM, por sus siglas en inglés) se basan en la arquitectura *transformer*, presentada en 2017 [3], en la que cada palabra "mira" a las demás para entender el contexto. Un LLM aprende a predecir el siguiente fragmento de texto, llamado token, a partir de enormes cantidades de texto. La analogía útil es un autocompletar muy sofisticado: esa misma naturaleza explica su fluidez y también sus errores.

La IA generativa crea contenido nuevo (texto, imágenes, audio, video o código) en lugar de solo clasificarlo. Los modelos de razonamiento generan pasos intermedios antes de responder. Un ejemplo público fue DeepSeek-R1, lanzado en enero de 2025 con pesos abiertos (los parámetros aprendidos del modelo, que cualquiera puede descargar y usar) [6].

Un agente de IA usa un modelo para planear y ejecutar varias acciones con herramientas: buscar información, editar un archivo o llamar a una aplicación. Imagine a un asistente administrativo al que usted pide "prepara la nómina del mes": revisa asistencias, detecta incidencias y prepara un borrador que usted aprueba. Anthropic distingue entre "workflows", con una ruta fijada por el desarrollador, y "agentes", donde el modelo decide sus pasos, y recomienda empezar por lo más simple [5].

Por último, la generación aumentada por recuperación (RAG, por sus siglas en inglés) consulta una base de documentos antes de responder, para anclar la respuesta en fuentes concretas. Es un examen con libro abierto [4].

En resumen: la IA es el campo; el aprendizaje automático, su método principal; el aprendizaje profundo, una familia de técnicas; los LLM y la IA generativa, la aplicación visible hoy; y los agentes y el RAG, las formas de conectar esos modelos con el trabajo real.

*Ideas fuerza:* La IA moderna aprende patrones de grandes volúmenes de datos. Los LLM son predictores de texto muy sofisticados, y los agentes y el RAG los conectan con herramientas y documentos reales.

## [B3] Historia breve e hitos

El término "inteligencia artificial" tiene fecha de origen. En 1955, John McCarthy, Marvin Minsky, Nathaniel Rochester y Claude Shannon propusieron un taller de investigación de verano en Dartmouth College para estudiar la posibilidad de que las máquinas simulen aspectos de la inteligencia humana. El taller se realizó en 1956, y McCarthy fue quien acuñó el nombre [8].

Las expectativas iniciales fueron enormes, y la desilusión llegó pronto. En la década de 1970, un informe británico encargado al profesor James Lighthill criticó la "explosión combinatoria" de muchos problemas, es decir, el crecimiento tan rápido de las combinaciones posibles que vuelve impracticable la búsqueda exhaustiva. Siguió un recorte de financiación. Hubo un segundo periodo de desconfianza a finales de los ochenta, cuando el mercado de los sistemas expertos (programas con reglas escritas por especialistas humanos) se derrumbó. A estos periodos se les llama "inviernos de la IA" [9].

El deshielo llegó con hitos que ganaron titulares. En 1997, la computadora Deep Blue de IBM venció 3½ a 2½ al campeón mundial de ajedrez, Garry Kasparov [10]. En 2012, la red AlexNet ganó el concurso ImageNet con un error de 15.3% en la clasificación de imágenes, frente a 26.2% del segundo lugar; tenía unos 60 millones de parámetros y se entrenó en tarjetas gráficas (GPU), hardware diseñado para hacer muchas operaciones en paralelo [11]. Ese resultado mostró con claridad la ventaja del aprendizaje profundo.

En 2016, AlphaGo, de la empresa DeepMind, derrotó 4 a 1 al jugador de Go Lee Sedol en Seúl. Combinó redes neuronales con aprendizaje por refuerzo, una técnica en la que el sistema aprende por ensayo y error guiado por recompensas [13]. En 2017 llegó el *transformer*, que en traducción inglés-alemán alcanzó 28.4 puntos BLEU, una medida estándar de calidad de traducción, y que pronto sustituyó a las redes recurrentes en muchas tareas [3].

El hito que cambió la conversación pública fue el lanzamiento de ChatGPT, el 30 de noviembre de 2022, como vista previa de investigación gratuita. En enero de 2023, una estimación de un banco de inversión, basada en datos de Similarweb, situó su audiencia mensual en unos 100 millones de usuarios. No fue una cifra de la empresa [12].

Este recorrido explica el presente: no hay una sola invención detrás de la IA actual, sino una combinación de datos abundantes, cómputo cada vez más accesible y arquitecturas como el *transformer*.

*Ideas fuerza:* La IA avanzó en oleadas de entusiasmo y desencanto. El salto actual combina arquitecturas nuevas, grandes volúmenes de datos y cómputo cada vez más accesible.

## [B4] Estado actual (2024-2026): tendencias principales

Entre 2024 y 2026, la conversación pasó de "qué sabe hacer la IA" a "qué puede hacer por sí sola durante horas". Varias tendencias ayudan a ordenar el panorama.

**Autonomía.** El organismo de evaluación METR midió que la duración de las tareas que un agente completa con 50% de éxito se duplicó cerca de cada siete meses entre 2019 y 2024 [15]. Gartner pronostica que más de 40% de los proyectos de IA agéntica se cancelarán para fines de 2027, por costos, valor poco claro o controles de riesgo insuficientes. Calcula que solo unos 130 de los miles de proveedores que dicen ofrecer "agentes" lo son de verdad, un fenómeno que llama *agent washing* (presentar como agente lo que no lo es). Y predice que, para 2028, los agentes autónomos tomarán al menos 15% de las decisiones laborales cotidianas, frente a 0% en 2024 [14]. Son pronósticos, no hechos.

**Razonamiento.** Los modelos de razonamiento gastan más cómputo al responder, lo que puede mejorar resultados en problemas complejos. DeepSeek-R1 mostró que esta capacidad podía estar disponible con pesos abiertos, con un rendimiento cercano al de modelos cerrados de primera línea en pruebas estandarizadas (benchmarks) [6].

**Multimodalidad.** Un mismo sistema trabaja con texto, imagen, audio y video. En la práctica, permite subir una factura escaneada o una gráfica y pedir un resumen o una tabla.

**Modelos abiertos frente a cerrados.** Los modelos abiertos tienen pesos públicos; los cerrados solo se usan a través de un servicio. Según Epoch AI, los mejores modelos abiertos iban unos cuatro meses detrás de la frontera a inicios de 2026, frente a tres meses en octubre de 2025. La distancia se amplió, no se redujo [16].

**Costo e inversión.** Según Epoch AI, el precio de un nivel de rendimiento fijo cayó 10 veces o más entre abril de 2023 y marzo de 2025, aunque la caída varía según la tarea [17]. Pero el gasto total puede subir, porque los agentes consumen muchos más tokens por tarea. Las cuatro grandes tecnológicas (Microsoft, Alphabet, Amazon y Meta) guiaron, en el primer trimestre de 2026, a un gasto de capital (inversión en infraestructura) de unos 700 a 725 mil millones de dólares para ese año [19]. Una nota que cita a Bloomberg atribuye a Nvidia alrededor de 86% de las ventas de aceleradores de IA en 2025 [18].

*Ideas fuerza:* Las tendencias de 2024 a 2026 apuntan a sistemas que ejecutan tareas por más tiempo, a costos unitarios más bajos y a una inversión enorme. Las predicciones sobre su éxito siguen abiertas.

## [B5] Impacto en el trabajo y la economía

Cuando se pregunta cuántos empleos desaparecerán por la IA, la respuesta depende de cómo se mida. El Foro Económico Mundial (WEF) proyecta, en su informe *The Future of Jobs 2025*, que para 2030 se crearán 170 millones de empleos y se desplazarán 92 millones, con un saldo neto de +78 millones [20]. Un saldo positivo no dice quién pierde su puesto ni cuánto dura la transición.

El Fondo Monetario Internacional (FMI) estima que casi 40% del empleo mundial está expuesto a la IA: unos 60% en economías avanzadas y 26% en países de bajo ingreso. Alrededor de la mitad de ese empleo expuesto podría verse afectado de forma negativa, y la otra mitad podría ganar productividad. A diferencia de olas anteriores de automatización, esta alcanza también a puestos de mayores ingresos [21]. Estar expuesto no significa desaparecer; puede significar transformarse.

La Organización Internacional del Trabajo (OIT), junto con el instituto polaco NASK, calcula que unos 25% del empleo mundial está en ocupaciones con alguna exposición a la IA generativa, cifra que sube a 34% en los países de altos ingresos. Dentro de las ocupaciones de mayor exposición, las mujeres (4.7% del empleo mundial) superan a los hombres (2.4%). Los autores esperan más transformación de empleos que sustitución masiva [22].

Dentro de las empresas, los estudios muestran resultados mixtos. Brynjolfsson, Li y Raymond observaron que un asistente de IA elevó 15% los casos resueltos por hora de agentes de soporte: 34% para los novatos y casi nada para los más experimentados [23]. En un experimento con 758 consultores de la firma BCG, quienes usaron IA completaron 12.2% más tareas y trabajaron 25.1% más rápido; pero en una tarea compleja, fuera de lo que la IA hacía bien, rindieron 23% peor [24]. En un ensayo aleatorizado de julio de 2025, 16 desarrolladores experimentados tardaron 19% más con herramientas de IA, aunque antes creían que serían 24% más rápidos [25]. La muestra fue pequeña, pero los tres estudios sugieren lo mismo: la IA mejora las tareas bien delimitadas y puede restar cuando el contexto es complejo.

A escala macroeconómica, el economista Daron Acemoglu estimó que la IA aumentaría la productividad total de los factores como máximo 0.66% en diez años, ajustado a unos 0.53% [26].

El efecto más sensible está en la entrada al empleo. Brynjolfsson, Chandar y Chen, con datos de la empresa de nómina ADP, hallaron que el empleo relativo de personas de 22 a 25 años en las ocupaciones más expuestas cayó 16% en la versión de noviembre de 2025, mientras los trabajadores mayores se mantuvieron o crecieron. Es un documento de trabajo, sin réplicas independientes conocidas [27].

La percepción también importa. En una encuesta de Microsoft a unos 20,000 trabajadores del conocimiento que ya usan IA, dos tercios dicen que les permite dedicar más tiempo a trabajo de mayor valor, pero 65% teme quedarse atrás y solo 13% dice que su empresa premia la experimentación [28]. PwC reporta una prima salarial de 56% para puestos que requieren habilidades de IA; son correlaciones, no efectos causales [29].

*Ideas fuerza:* Hay ganancias reales de productividad en tareas concretas, resultados mixtos dentro de las empresas y señales de alerta para la entrada de los jóvenes al empleo. La pregunta útil es qué tareas cambian, no solo cuántos puestos.

## [B6] Aplicaciones por área profesional

No todas las aplicaciones de la IA están igual de maduras. Las que muestran más valor combinan tareas repetibles, documentación propia y una persona que revisa el resultado. Veamos cinco áreas, con ejemplos ilustrativos de empresas ficticias.

**Recursos humanos.** La IA ya redacta descripciones de puesto, prepara preguntas de entrevista o filtra currículums. Una encuesta de SHRM, la asociación estadounidense de gestión de recursos humanos, encontró que la adopción de IA en tareas del área pasó de 26% en 2024 a 43% en 2025 [30]. Otra de 2026 reporta que 39% la tiene adoptada en sus funciones, con el reclutamiento como uso más común (27%). Como ambas usan definiciones distintas, no conviene compararlas al pie de la letra [31]. La advertencia es jurídica: en *Mobley contra Workday*, un tribunal federal de California certificó preliminarmente en mayo de 2025 una acción colectiva por discriminación por edad contra un proveedor de software de contratación, y la jueza consideró que el ranking de candidatos por IA podría constituir una política unificada [32]. Imagine a "Grupo Vera", una cadena ficticia de tiendas: usa IA para redactar 40 descripciones de puesto, pero un comité humano decide la selección final.

**Finanzas y contabilidad.** La IA concilia cuentas, clasifica gastos y detecta anomalías. Una encuesta de Consero a 102 líderes financieros de empresas con capital de riesgo o capital privado (*private equity*) indica que 42% tiene IA integrada en sus funciones, frente a 22% un año antes. Es una muestra pequeña y no representativa [33]. El riesgo es el del caso de Hong Kong [2]: toda solicitud urgente de pago debe confirmarse por un segundo canal, aunque llegue en vivo.

**Marketing y ventas.** La IA redacta borradores de correos, variantes de anuncios y resúmenes de llamadas. Imagine a "Textil Norte", una fábrica ficticia de uniformes: su equipo prepara con IA tres versiones de un correo de reactivación y resume cada llamada en su sistema de gestión de clientes (CRM, por sus siglas en inglés). Una persona aprueba el tono y las cifras antes de enviar. La ganancia es de tiempo; el riesgo es publicar algo falso o incoherente con la marca.

**Educación y capacitación.** La OCDE concluye, en su *Digital Education Outlook 2026*, que la IA generativa ayuda al aprendizaje solo si se diseña con principios pedagógicos. Si el alumno solo delega la tarea, mejora su desempeño, pero no aprende [34]. Un tutor de IA diseñado con pedagogía, en un curso de física de Harvard con 194 estudiantes, produjo según resúmenes una ganancia de aprendizaje de más del doble que la de una clase activa; las cifras varían entre reportes [35].

**Operaciones y automatización.** La IA rinde más en tareas repetitivas y de bajo riesgo, como clasificar solicitudes o responder consultas frecuentes. Un patrón práctico es el RAG: un asistente que consulta los manuales antes de responder a un técnico de campo [4]. Anthropic recomienda empezar con la solución más simple y advierte que algunos frameworks ocultan los prompts y las respuestas [5].

*Ideas fuerza:* Las aplicaciones con más valor combinan tareas repetibles, documentación propia y revisión humana. Los mismos casos muestran riesgos en contratación, pagos y comunicación con clientes.

## [B7] Riesgos y desafíos

Los riesgos ya tienen costos medibles.

**Alucinaciones.** Una alucinación es una respuesta fluida, plausible y falsa. OpenAI explica que el entrenamiento y la evaluación premian adivinar frente a reconocer incertidumbre: quien adivina una fecha de cumpleaños tiene 1 entre 365 de acertar, mientras que "no lo sé" vale cero. Propone penalizar más el error que la abstención [36]. Ya hay consecuencias en tribunales: una base de datos alimentada por colaboradores, de Charlotin, registra 1,240 casos en Estados Unidos desde abril de 2023 con documentos judiciales que contienen alucinaciones, 668 de ellos solo en 2026 hasta julio [37].

**Sesgos.** Un estudio de la Universidad de Washington (2024) sobre modelos de *embeddings* (sistemas que convierten texto en números para buscar o clasificar) encontró que favorecieron nombres asociados a personas blancas en 85.1% de los casos, y nombres asociados a mujeres en 11.1%. Quitar los nombres no basta: el modelo puede inferir la identidad a partir del historial educativo o de la ciudad [38].

**Privacidad.** En diciembre de 2024, el regulador italiano de protección de datos (Garante) multó a OpenAI con 15 millones de euros por entrenar con datos personales sin base legal adecuada, por falta de transparencia y por no notificar una brecha de marzo de 2023. OpenAI anunció que lo recurriría [39].

**Deepfakes y desinformación.** A principios de 2026, reguladores del Reino Unido, la Comisión Europea e Irlanda abrieron investigaciones por imágenes sexuales falsas generadas con Grok, la IA de X; Indonesia y Malasia dictaron prohibiciones temporales [40].

**Propiedad intelectual.** En *Bartz contra Anthropic*, la empresa aceptó pagar al menos 1,500 millones de dólares por haber descargado libros de bibliotecas piratas, unos 3,000 dólares por obra. El juez sostuvo que entrenar con libros comprados legalmente podría ser un uso legítimo (*fair use*), pero que importaba cómo se obtuvieron [41]. En Múnich, un tribunal concluyó en noviembre de 2025 que OpenAI infringió derechos de autor de letras de canciones; la sentencia no es firme y puede apelarse [42]. Un tribunal de Londres llegó a una conclusión distinta en el caso Getty contra Stability AI [43].

**Concentración de poder.** Nvidia tuvo alrededor de 86% de las ventas de aceleradores de IA en 2025 [18], y las cuatro grandes tecnológicas guían a unos 700 mil millones de dólares de inversión en infraestructura para 2026 [19]. La competencia por el cómputo necesario para los modelos más avanzados se concentra en pocas empresas.

**Energía.** La Agencia Internacional de Energía (IEA) estimó que los centros de datos usaron unos 415 TWh (teravatios-hora) en 2024, cerca de 1.5% de la electricidad mundial, y proyectó unos 945 TWh para 2030, algo más que el consumo actual de Japón [44].

**Dependencia de habilidades.** En cuatro centros de Polonia, la tasa de detección de adenomas (lesiones que pueden preceder al cáncer colorrectal) sin asistencia de IA bajó de 28.4% a 22.4% tras la exposición a la herramienta. Es observacional, pero advierte que una herramienta puede erosionar habilidades [45].

**Uso malicioso.** En noviembre de 2025, Anthropic informó que un grupo vinculado a China usó su herramienta Claude Code en una campaña de espionaje casi automatizada contra unas 30 organizaciones. Hay escepticismo sobre su alcance: el informe no incluyó indicadores verificables [46].

*Ideas fuerza:* Los riesgos ya tienen costos concretos: respuestas falsas en tribunales, discriminación en la contratación, fraude, uso indebido de datos personales y consumo energético. Gestionarlos exige reglas claras, no solo confianza en la herramienta.

## [B8] Regulación y gobernanza

Las fechas de este bloque corresponden a la versión vigente a la fecha de redacción, y varias se están modificando; conviene verificarlas en la fuente oficial antes de tomar decisiones de cumplimiento.

La Unión Europea tiene el marco más completo. Su Reglamento de IA entró en vigor el 1 de agosto de 2024 y se aplica por fases: las prácticas prohibidas rigen desde febrero de 2025 y las obligaciones para modelos de propósito general desde agosto de 2025. Las multas pueden llegar a 35 millones de euros o 7% de la facturación mundial, la mayor de las dos cifras [48]. Un paquete de simplificación aplazaría los sistemas de alto riesgo a diciembre de 2027, según resúmenes jurídicos; las fechas de transparencia para contenidos generados varían entre fuentes, así que conviene confirmarlo en el Diario Oficial [48].

En Estados Unidos aún no existe un estándar federal único. Una orden ejecutiva de diciembre de 2025 creó un grupo de trabajo para impugnar leyes estatales de IA [47]. California aprobó la SB 53, que exige a los desarrolladores de modelos muy grandes publicar marcos de riesgo catastrófico y reportes de transparencia; sus obligaciones principales rigen desde enero de 2026 [49].

China exige desde septiembre de 2025 etiquetar el contenido generado por IA, con marcas visibles y metadatos [50].

En América Latina, Perú fue pionero con la Ley 31814 (2023), cuyo reglamento define obligaciones de gobernanza [51]. Brasil aprobó su proyecto de ley de IA en el Senado en diciembre de 2024, pero sigue pendiente en la Cámara de Diputados [52]. México no tiene aún una ley general de IA aprobada, y en febrero de 2026 se presentó en el Senado una Ley Nacional de Inteligencia Artificial [53][54]. El Índice Latinoamericano de Inteligencia Artificial (ILIA 2026), de la CEPAL, sitúa a Chile (71.4 puntos), Brasil (68.4) y Uruguay (67) a la cabeza [55].

En el plano internacional, los Principios de la OCDE sobre IA (2019, actualizados en 2024) no son vinculantes [56]. El Convenio Marco del Consejo de Europa, abierto a firma desde septiembre de 2024, excluye la investigación y la seguridad nacional [57]. La ONU celebró en Ginebra, los días 6 y 7 de julio de 2026, la primera sesión de su Diálogo Global sobre Gobernanza de la IA [58].

*Ideas fuerza:* La regulación avanza por bloques: la UE tiene reglas con calendario escalonado, Estados Unidos discute el reparto de competencias con los estados, y América Latina tiene una ley pionera en Perú y proyectos pendientes en México y Brasil. Para el profesional, la brújula es la versión vigente y el cumplimiento interno.

## [B9] Debates abiertos

Los siguientes debates no tienen respuesta definitiva. Los presentamos como lo que son: discusiones con evidencia parcial.

**¿Cuándo llegará la inteligencia artificial general?** La inteligencia artificial general (AGI) sería un sistema capaz de realizar cualquier tarea intelectual que puede hacer una persona. En una encuesta de 2023 a 2,778 expertos, la mediana situó ese nivel hacia 2047 [59]. Más revelador es que, según 80,000 Hours, las definiciones cambian los pronósticos entre 10 y 20 años, y ninguno parece especialmente fiable [59].

**¿Sustituir o aumentar?** En 2022, Erik Brynjolfsson describió la "trampa de Turing": perseguir máquinas con apariencia humana lleva a automatizar en lugar de potenciar a las personas, y quien es sustituido pierde poder económico y político [60]. La OIT, en cambio, espera más rediseño de empleos que sustitución masiva [22]. Ningún estudio mide todavía el efecto agregado.

**¿Entienden los modelos de lenguaje?** En 1950, Alan Turing propuso sustituir la pregunta de si las máquinas pueden pensar por un criterio operativo, el juego de imitación [65]. En 1980, John Searle respondió con el experimento de la habitación china: manipular símbolos según reglas no equivale a comprender [64]. Emily Bender y coautores llamaron "loros estocásticos" a los LLM, que recombinan formas lingüísticas según probabilidades, sin acceso al significado [62]. Ted Chiang los comparó con una copia borrosa de la web [63]. Del otro lado, Anthropic describió en 2025 circuitos internos que planean rimas con varias palabras de antelación; el mismo trabajo muestra también razonamientos plausibles pero falsos cuando la premisa es incorrecta [61].

**¿Modelos abiertos o cerrados?** Los modelos abiertos favorecen la innovación y la soberanía. El ILIA 2026 define la soberanía como la capacidad de decidir y conservar alternativas, no como autosuficiencia [55]. Los cerrados ofrecen más control, un argumento central para quienes temen usos maliciosos. Según Epoch AI, la brecha entre ambos es de unos cuatro meses [16].

**¿Burbuja o transformación?** Las grandes tecnológicas guían a unos 700 mil millones de dólares de inversión en infraestructura para 2026 [19], y Gartner anticipa que más de 40% de los proyectos agénticos se cancelará para 2027 [14]. Ninguna de esas cifras dice todavía cuánto de esa inversión producirá valor.

Ninguno de estos debates tiene respuesta definitiva. Lo sensato es tratarlos como hipótesis, decidir con la información disponible y revisar las decisiones conforme lleguen datos nuevos.

*Ideas fuerza:* Los expertos no coinciden en cuándo llegará la AGI, en si los modelos entienden o solo predicen, ni en si la IA sustituirá o aumentará el trabajo. Son debates con evidencia parcial, que conviene tratar como hipótesis.

## [B10] Cierre y llamado a la acción

Volvamos a Lucía, la gerente de administración del principio. Su ventaja no vino de saber programar, sino de hacerse tres preguntas antes de usar cualquier herramienta: qué tarea puede acelerarse, qué riesgo tiene y cómo sabe que el resultado es correcto. Esas preguntas sirven a cualquier profesional, sea de recursos humanos, finanzas, marketing, administración u operaciones.

El caso de Hong Kong [2] recuerda que la tecnología que engañó a una empresa no era exótica, y que la defensa también era sencilla: un procedimiento de verificación. La IA exige la misma disciplina que cualquier herramienta de trabajo: entenderla, probarla y ponerle controles.

Le proponemos cinco acciones para esta semana:

1. Haga un inventario de tres tareas repetitivas de su semana y clasifique cada una por riesgo: bajo, medio o alto.
2. Pruebe una herramienta de IA con una tarea de bajo riesgo y sin datos confidenciales. Compare el resultado con su propio trabajo y anote en qué se equivocó.
3. Escriba una regla de una página para su equipo: qué información no entra a herramientas públicas, quién revisa cada salida y cómo se confirma una solicitud de pago por un segundo canal.
4. Pregunte si su organización tiene una política de uso de IA. Si no la tiene, proponga un piloto de un mes con una métrica medible, como minutos por proceso o errores por cada cien operaciones.
5. Dedique 30 minutos a un curso práctico o a una fuente de calidad, y comparta un hallazgo con un colega.

La IA no va a esperar a que estemos listos, pero sí podemos decidir cómo entrar en ella: con curiosidad, con criterio y sin ceder el juicio propio.

*Ideas fuerza:* Dominar la IA en el trabajo se construye con preguntas simples, pruebas pequeñas y reglas claras. Cinco acciones esta semana bastan para empezar.

## Fuentes

- [1] Stanford HAI, *AI Index 2026* (abril 2026). https://hai.stanford.edu/ai-index/2026-ai-index-report
- [2] CNN, caso de fraude con deepfake en Arup, Hong Kong (2024; citado por ABC17). https://abc17news.com/money/cnn-business-consumer/2024/05/16/british-engineering-giant-arup-revealed-as-25-million-deepfake-scam-victim/
- [3] Vaswani et al., "Attention Is All You Need" (arXiv:1706.03762, 2017). https://arxiv.org/abs/1706.03762
- [4] Lewis et al., trabajo sobre generación aumentada por recuperación (RAG), NeurIPS 2020; arXiv:2005.11401. https://arxiv.org/abs/2005.11401
- [5] Anthropic, "Building effective agents" (diciembre 2024). https://www.anthropic.com/research/building-effective-agents
- [6] Asia Society, resumen sobre el caso DeepSeek y el modelo R1 (2025). https://centerforchinaanalysis.asiasociety.org/p/the-deepseek-moment-how-a-chinese
- [7] ACM, Premio Turing 2018 (2019). https://www.acm.org/media-center/2019/march/turing-award-2018
- [8] AI Magazine (AAAI), propuesta del Dartmouth Summer Research Project on Artificial Intelligence (1955). https://ojs.aaai.org/index.php/aimagazine/article/view/1904
- [9] Historia de la IA: inviernos de la IA e informe Lighthill (1973), resúmenes de DataCamp y Wikipedia. URL no registrada en el dossier; confirmar antes de publicar.
- [10] Deep Blue frente a Kasparov (1997), Wikipedia y resúmenes. URL no registrada en el dossier; confirmar antes de publicar.
- [11] Resumen de la publicación original de AlexNet en ILSVRC 2012. URL no registrada en el dossier; confirmar antes de publicar.
- [12] Reuters (citado en gigazine.net), lanzamiento de ChatGPT y estimación de audiencia de UBS con datos de Similarweb (2023). URL no registrada en el dossier; confirmar antes de publicar.
- [13] Wikipedia, "AlphaGo versus Lee Sedol". https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol
- [14] Gartner, comunicado sobre IA agéntica (25 de junio de 2025). https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
- [15] METR, investigación sobre la duración de tareas que completan los agentes (2025). https://metr.org/research
- [16] Epoch AI, brecha entre modelos abiertos y cerrados (mayo 2026). https://epoch.ai/data-insights/open-closed-eci-gap
- [17] Epoch AI, "Top 10 data insights and gradient updates of 2025". https://epoch.ai/blog/top-10-data-insights-and-gradient-updates-of-2025
- [18] Yahoo Finance, citando a Bloomberg, sobre el mercado de aceleradores de IA y Nvidia (fecha no registrada en el dossier). https://finance.yahoo.com/markets/stocks/articles/nvidia-stock-investors-just-got-090800739.html
- [19] AIweekly, gasto de capital de Amazon, Microsoft, Alphabet y Meta en 2026. https://aiweekly.co/alerts/amazon-microsoft-alphabet-meta-plan-725b-ai-capex-in-2026
- [20] Foro Económico Mundial, *The Future of Jobs Report 2025* (enero 2025), a través de resumen de AI Magazine. https://aimagazine.com/articles/wef-report-the-impact-of-ai-driving-170m-new-jobs-by-2030
- [21] Fondo Monetario Internacional, *Gen-AI: Artificial Intelligence and the Future of Work* (nota de discusión, enero 2024). https://www.imf.org/en/Publications/Staff-Discussion-Notes/Issues/2024/01/14/Gen-AI-Artificial-Intelligence-and-the-Future-of-Work-542379
- [22] OIT y NASK, *Generative AI and Jobs: A Refined Global Index of Occupational Exposure* (ILO Working Paper 140, mayo 2025). https://webapps.ilo.org/static/english/intserv/working-papers/wp140/index.html
- [23] Brynjolfsson, Li y Raymond, "Generative AI at Work" (NBER w31161). https://nber.org/papers/w31161
- [24] Dell'Acqua et al., "Navigating the Jagged Technological Frontier" (Organization Science), nota de BCG (2023). https://www.bcg.com/news/25october2023-theres-time-and-place-for-generative-ai
- [25] METR, ensayo aleatorizado sobre productividad de desarrolladores con IA (julio 2025), resumen de Simon Willison. https://simonwillison.net/2025/Jul/12/ai-open-source-productivity/
- [26] Acemoglu, "The Simple Macroeconomics of AI" (NBER w32487, mayo 2024). https://www.nber.org/papers/w32487
- [27] Brynjolfsson, Chandar y Chen, "Canaries in the Coal Mine?" (Stanford Digital Economy Lab, 2025). https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine/
- [28] Microsoft, *Work Trend Index 2026* (mayo 2026). https://www.microsoft.com/en-us/worklab/work-trend-index
- [29] PwC, *2025 Global AI Jobs Barometer* (junio 2025). https://pwc.com/gx/en/news-room/press-releases/2025/ai-linked-to-a-fourfold-increase-in-productivity-growth.html
- [30] SHRM, *Talent Trends 2025* (encuesta de campo en febrero 2025). https://www.shrm.org/mena/topics-tools/research/2025-talent-trends
- [31] SHRM, *State of AI in HR 2026* (encuesta de campo en diciembre 2025). https://www.shrm.org/in/topics-tools/research/state-of-ai-hr-2026/full-report
- [32] Resumen jurídico del caso *Mobley v. Workday* (N.D. California, mayo 2025). https://www.hklaw.com/en/insights/publications/2025/05/federal-court-allows-collective-action-lawsuit-over-alleged
- [33] Consero, *2026 CFO Survey*. https://conseroglobal.com/2026-cfo-survey/
- [34] OCDE, *Digital Education Outlook 2026* (enero 2026). https://www.oecd.org/en/publications/2026/01/oecd-digital-education-outlook-2026_940e0dd8.html
- [35] Kestin et al., estudio de tutor de IA en un curso de física (Harvard; *Scientific Reports*, junio 2025). https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/
- [36] OpenAI, "Why Language Models Hallucinate" (septiembre 2025). https://openai.com/index/why-language-models-hallucinate/
- [37] Charlotin, base de casos de alucinaciones en documentos judiciales, citada por la Massachusetts Bar Association (julio 2026). https://www.msba.org/site/content/News-and-Publications/News/General-News/Confronting_the_Hard%20Numbers_Behind_Lawyers_AI_and_Phantom_Precedents.aspx
- [38] Wilson y Caliskan, Universidad de Washington, sesgo en modelos de embeddings (arXiv:2407.20371, 2024). https://arxiv.org/abs/2407.20371
- [39] AP, multa del Garante italiano a OpenAI (diciembre 2024), citada por WSLS. https://www.wsls.com/business/2024/12/20/italys-privacy-watchdog-fines-openai-for-chatgpts-violations-in-collecting-users-personal-data/
- [40] Al Jazeera, investigación de la Comisión Europea sobre Grok (enero 2026). https://www.aljazeera.com/news/2026/1/26/eu-launches-probe-into-grok-ai-feature-creating-deepfakes-of-women-minors
- [41] Asociación de Editores de EE. UU., declaración sobre el acuerdo en *Bartz v. Anthropic* (septiembre 2025). https://publishers.org/news/statement-on-proposed-settlement-of-1-5-billion-in-bartz-v-anthropic-class-action-suit/
- [42] Norton Rose Fulbright, sentencia *GEMA v. OpenAI*, Tribunal Regional de Múnich (noviembre 2025). https://www.nortonrosefulbright.com/en-gr/knowledge/publications/656613b2/germany-delivers-landmark-copyright-ruling-against-openai-what-it-means-for-ai-and-ip
- [43] *Getty Images v. Stability AI*, Tribunal Superior de Londres (noviembre 2025), resúmenes de prensa jurídica. URL no registrada en el dossier; confirmar antes de publicar.
- [44] Agencia Internacional de Energía (IEA), *Energy and AI* (abril 2025). https://www.iea.org/news/ai-is-set-to-drive-surging-electricity-demand-from-data-centres-while-offering-the-potential-to-transform-how-the-energy-sector-works
- [45] Budzyń et al., *The Lancet Gastroenterology & Hepatology* (agosto 2025), publicación en Warwick. https://wrap.warwick.ac.uk/id/eprint/191005
- [46] Technology Magazine, resumen del informe de Anthropic sobre ciberespionaje con IA (noviembre 2025). https://technologymagazine.com/news/anthropic-disrupts-first-ai-orchestrated-cyber-espionage
- [47] Morrison Foerster, orden ejecutiva "Ensuring a National Policy Framework for Artificial Intelligence" (diciembre 2025). https://www.mofo.com/resources/insights/251213-executive-order-state-ai-laws
- [48] Gibson Dunn, Reglamento de IA de la UE y acuerdo de ómnibus digital. https://www.gibsondunn.com/eu-ai-act-omnibus-agreement
- [49] Future of Privacy Forum, "California's SB 53: The First Frontier AI Law, Explained" (septiembre 2025). https://fpf.org/blog/californias-sb-53-the-first-frontier-ai-law-explained/
- [50] Caixin, etiquetado obligatorio de contenido generado por IA en China (septiembre 2025). https://www.caixinglobal.com/2025-09-03/china-enforces-ai-content-labeling-rules-to-curb-misuse-102358308.html
- [51] El Peruano, reglamento de la Ley 31814 sobre inteligencia artificial en Perú (2025). https://elperuano.pe/noticia/299823-peru-tiene-una-de-las-legislaciones-vinculantes-mas-completas-en-ia-responsable-del-sur-global
- [52] Congreso Nacional de Brasil, PL 2338/2023 (proyecto de ley de IA). https://www.congressonacional.leg.br/web/atividade/materias/-/materia/157233
- [53] ITSitio, panorama de iniciativas de IA en México (2026). https://www.itsitio.com/mx/?p=192691
- [54] Senado de México, Gaceta: iniciativa de Ley Nacional de Inteligencia Artificial (11 de febrero de 2026). https://infosen.senado.gob.mx/sgsp/gaceta/66/2/2026-02-11-1/assets/documentos/Ini_Morena_Sen_Karina_Ruiz_Expide_Ley_Nacional_de_Inteligencia_Artificial.pdf
- [55] CEPAL y CENIA, *Índice Latinoamericano de Inteligencia Artificial (ILIA 2026)* (20 de octubre de 2026). https://www.cepal.org/es/publicaciones/90413-indice-latinoamericano-inteligencia-artificial-ilia-2026
- [56] OCDE, actualización de los Principios de IA (mayo 2024). https://www.oecd.org/en/about/news/press-releases/2024/05/oecd-updates-ai-principles-to-stay-abreast-of-rapid-technological-developments.html
- [57] Consejo de Europa, Convenio Marco sobre inteligencia artificial y derechos humanos (CETS 225). https://www.coe.int/en/web/portal/-/council-of-europe-opens-first-ever-global-treaty-on-ai-for-signature
- [58] Naciones Unidas, Diálogo Global sobre Gobernanza de la IA. https://www.un.org/ai-dialogue
- [59] 80,000 Hours, "When do experts expect AGI to arrive?" (marzo 2025). https://80000hours.org/2025/03/when-do-experts-expect-agi-to-arrive/
- [60] Brynjolfsson, "The Turing Trap: The Promise & Peril of Human-Like Artificial Intelligence" (*Dædalus*, 2022; arXiv:2201.04200). https://arxiv.org/abs/2201.04200
- [61] Anthropic, "Tracing thoughts in a language model" (marzo 2025). https://anthropic.com/research/tracing-thoughts-language-model
- [62] Bender, Gebru, McMillan-Major y Shmitchell, "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?" (FAccT '21). https://doi.org/10.1145/3442188.3445922
- [63] Chiang, "ChatGPT Is a Blurry JPEG of the Web" (*The New Yorker*, febrero 2023). https://www.newyorker.com/tech/annals-of-technology/chatgpt-is-a-blurry-jpeg-of-the-web
- [64] Searle, "Minds, Brains, and Programs" (*Behavioral and Brain Sciences*, 1980). https://doi.org/10.1017/S0140525X00005756
- [65] Turing, "Computing Machinery and Intelligence" (*Mind*, 1950). https://doi.org/10.1093/mind/LIX.236.433

