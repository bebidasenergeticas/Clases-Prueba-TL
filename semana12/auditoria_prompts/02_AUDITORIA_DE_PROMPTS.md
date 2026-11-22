# 02 — Auditoría técnica de los prompts

**Clase:** E1601.2, Semana 12 (15-nov-2026) · **Auditoría y consulta de documentación:** 2026-11-22.
Los textos originales y las fichas históricas están en `01_INVENTARIO_PROMPTS_ORIGINALES.md`. Aquí se evalúa cada prompt con criterios técnicos. Personas identificadas solo por rol ("Profesor", "Estudiante N").

## Escala de puntuación (1 a 5)

| Criterio | 1 | 3 | 5 |
|---|---|---|---|
| **Claridad** | Objetivo ambiguo o contradictorio | Objetivo claro con huecos de contexto o ambigüedades | Objetivo, contexto, límites y entrega bien definidos |
| **Seguridad** | Puede publicar, borrar o exponer datos sin control | Protecciones parciales o contradicciones | Permisos, secretos y confirmaciones explícitos |
| **Ejecutabilidad** | Pide algo que la herramienta no puede hacer | Funciona en condiciones favorables | Funciona en el entorno real de un principiante en Windows |
| **Verificabilidad** | Sin forma de comprobar el resultado | Comprobaciones parciales | Criterios de aceptación y verificación real |

## Tabla resumen de puntuaciones

| ID | Prompt | Claridad | Seguridad | Ejecutabilidad | Verificabilidad | Promedio |
|---|---|:-:|:-:|:-:|:-:|:-:|
| P01 | Abrir navegador desde OpenCode | 2 | 4 | 4 | 2 | 3.00 |
| P02 | Calculadora de automatización | 4 | 4 | 4 | 2 | 3.50 |
| P03 | Publicación de la calculadora (oral) | 2 | 2 | 3 | 1 | 2.00 |
| P04 | Coordinación OpenCode + Claude Code (oral) | 2 | 3 | 3 | 2 | 2.50 |
| P05 | Mejora de la calculadora y subagentes (oral) | 3 | 3 | 4 | 3 | 3.25 |
| P06 | Landing DENTEA | 4 | 2 | 3 | 3 | 3.00 |
| P07 | Meta-prompting para landing pages | 3 | 3 | 3 | 2 | 2.75 |
| P08 | Agente de voz xAI (oral) | 3 | 2 | 4 | 2 | 2.75 |
| P09 | Instalación inicial de GitHub CLI | 4 | 4 | 3 | 4 | 3.75 |
| P10 | Regeneración del código de dispositivo | 2 | 3 | 2 | 1 | 2.00 |
| P11 | Instalación GitHub CLI reforzada "MISIÓN" | 3 | 3 | 3 | 4 | 3.25 |
| P12 | Crear repositorio y desplegar en GitHub Pages | 2 | 2 | 3 | 1 | 2.00 |
| P13 | Landing Stilís (Estudiante 4) | 4 | 4 | 4 | 4 | 4.00 |
| P14 | Prueba de Google Flow (oral) | 2 | 2 | 3 | 2 | 2.25 |
| P15 | "¿Qué me hace falta para desplegar?" (oral) | 2 | 4 | 4 | 2 | 3.00 |
| P16 | Reconexión desde Claude Code (oral) | 2 | 3 | 3 | 2 | 2.50 |

Las puntuaciones de los prompts orales (P03, P04, P05, P08, P14, P15, P16) se aplican a la instrucción tal como se dijo, no a un texto escrito.

## Hallazgos transversales

1. **Credenciales.** Los prompts escritos prohíben con razón pedir contraseñas o tokens (P09, P11), pero oralmente el Profesor dijo que el agente "les va a pedir su correo y contraseña" (L1662) y que en Claude "correo, contraseña y listo" (P16). Debe quedar claro que las credenciales se escriben únicamente en las páginas oficiales (github.com, accounts.google.com), nunca en el chat del agente.
2. **El código de dispositivo no llega por correo.** El flujo `gh auth login --web` es un flujo OAuth de dispositivo: el código se muestra en la terminal o en el chat del agente y se introduce en https://github.com/login/device (documentación OAuth de GitHub: el código se muestra "en el dispositivo", dura 900 s por defecto y consta de 8 caracteres con un guion). Varios estudiantes lo esperaban por correo. Posible confusión adicional (pendiente de verificar): GitHub puede enviar por correo un código de verificación de inicio de sesión desde un dispositivo nuevo, que es otro código distinto.
3. **Un shell de agente no es una terminal interactiva.** Por el código fuente de `gh` (internal/authflow/flow.go, consultado vía resumen de WebFetch), en modo no interactivo `gh auth login --web` imprime la URL y el código, no abre el navegador y sigue esperando la autorización; en modo interactivo pide pulsar Enter. La documentación de OpenCode (opencode.ai/docs/tools) define la herramienta de comandos como `shell`, con parámetro `background` para procesos largos, y no documenta soporte de terminal interactiva ni ventanas persistentes. Los prompts que dicen "abre la ventana" o "mantén abierta PowerShell" (P10, P11) pueden funcionar solo si el agente lanza un proceso del sistema (por ejemplo con `Start-Process`), lo que sí ocurrió para Estudiante 7, pero es frágil.
4. **Permisos de Windows y publicadores desconocidos.** Estudiante 7 rechazó una ventana de permisos que mostraba el nombre de una persona; el Profesor confirmó que es una señal de alerta. Los prompts no enseñan a verificar el editor de la ventana de control de cuentas (UAC). Falta un criterio de "detente y pregunta".
5. **Confusión entre herramientas.** Se mezclan ChatGPT (meta-prompt), OpenCode (agente), Claude Code (agente), GitHub (cuenta), GitHub CLI (programa `gh`) y GitHub Pages (hosting). Un principiante no sabe dónde pegar cada prompt (Estudiante 2 en 03:04:29-03:05:02; P07 con 3 mensajes sueltos).
6. **Privado frente a público.** P11 pide crear el repositorio PRIVADO; P12 pide publicar en GitHub Pages. La documentación de GitHub Pages (docs.github.com, consultada 2026-11-22) indica que, si la cuenta es GitHub Free, el repositorio debe ser público, y que un sitio de Pages es públicamente accesible aunque el repositorio sea privado en planes que lo permiten. Los prompts no resuelven el conflicto ni piden confirmación.
7. **Consumo de tokens y límites.** El Profesor explicó que cada mensaje relee toda la conversación y que conviene pocos prompts completos. Observado: modelos GLM lentos ("sigue trabajando"), límite gratuito alcanzado (Estudiante 4), prompts largos (P11 supera 4000 caracteres y se cortó). Ningún prompt original indica cuándo parar ni cómo limitar iteraciones.
8. **Verificación de resultados.** Solo P09 y P11 exigen "no declarar completado sin verificar". P12, el prompt de publicación, no verifica que la URL responda; en clase, el agente de Estudiante 7 reportó "todo listo" y luego "detectó un fallo real".
9. **Mezcla de actividades.** P11 mezcla instalación de herramientas, autenticación, configuración de Git y publicación de un proyecto en un solo prompt.

---

## P01 — Abrir navegador desde OpenCode

- **Claridad (2):** "abre el navegador y busca" no tiene complemento: ¿buscar qué, en qué sitio? El Profesor lo completó oralmente.
- **Contexto:** nulo; depende de que la sesión esté en la carpeta correcta y el navegador integrado habilitado.
- **Riesgos de seguridad:** bajos. El agente podría visitar sitios arbitrarios. OpenCode pide permisos según su política (docs: `ask` por defecto si ninguna regla coincide).
- **Ejecutabilidad (4):** razonable; la documentación de OpenCode (tools) lista un espacio de herramientas `browser` y la herramienta `webfetch`.
- **Verificabilidad (2):** sin criterio de éxito; basta que "aparezca" un navegador.
- **Confusión para principiantes:** no distingue navegador integrado y navegador del sistema; el del Profesor abría Edge.
- **Mejora clave:** pedir un destino concreto, una acción verificable (título de la página visitada) y que informe qué navegador usó.

## P02 — Calculadora de automatización

- **Claridad (4):** objetivo, entradas (proceso, tiempo, frecuencia, costo por hora, empleados) y salidas están definidos; incluye la regla "supuestos transparentes y editables, sin inventar cifras".
- **Ambigüedades:** "tiempo que dedica" no dice unidad (minutos u horas por ejecución); "frecuencia" no dice periodo; "número de empleados" no aclara si multiplica horas; "inversión estimada" no tiene fórmula ni origen; "porcentaje estimado del proceso que puede automatizarse" no tiene método (el modelo lo inventará con una heurística opaca); ROI y periodo de recuperación sin definición (payback simple o descontado).
- **Cálculo financiero implícito:** el prompt mezcla horas recuperadas con "ahorro económico" y "reducción de costos operativos". Horas liberadas no son dinero ahorrado salvo reasignación o reducción de costos demostrable. Sin advertencia, el resultado puede sobrestimar beneficios. Además omite costos recurrentes (licencias, mantenimiento, tokens) en el beneficio neto.
- **Dependencias faltantes:** no define tecnología (HTML/JS suelto o framework), ni la librería de gráficos (si usa CDN, depende de internet), ni cómo ejecutar.
- **Validaciones omitidas:** validación de entradas (negativos, cero, vacío), formato de moneda, persistencia, pruebas de los cálculos, accesibilidad.
- **Seguridad (4):** bajo riesgo; trabajo en carpeta vacía. Sin riesgo de publicación.
- **Ejecutabilidad (4):** se ejecutó con éxito en clase con GLM.
- **Verificabilidad (2):** no pide probar con casos de ejemplo ni mostrar fórmulas.
- **Tokens:** razonable, pero pedir "recomendaciones personalizadas" abre la puerta a texto largo sin aportar.
- **Resultado observado:** la mejora posterior mostró escenarios con una sola ejecución semanal que "no se paga solo", indicando que el modelo de cálculo sí diferencia casos, pero las cifras eran "ejemplos" no auditados.
- **Mejora clave (V2):** modelo de datos explícito (horas por semana = duración × frecuencia semanal × personas; horas recuperables = horas × porcentaje automatizable; ahorro bruto = horas por año × costo por hora; beneficio neto = ahorro − costos recurrentes; ROI y payback con inversión inicial editable), supuestos editables y etiquetados, advertencia de "horas liberadas ≠ dinero ahorrado", pruebas con casos de referencia.

## P03 — Publicación de la calculadora (instrucción oral)

- **Claridad (2):** "usa un nuevo repositorio" ¿crear uno o usar uno existente?; "publica" no precisa dónde (Pages), visibilidad, nombre ni rama.
- **Riesgos de seguridad (2):** publica código sin revisión de secretos ni confirmación; si el repositorio es público, todo lo que esté en la carpeta se publica. Podría usar autenticación existente sin que el usuario sea consciente.
- **Ejecutabilidad (3):** funcionó porque el Profesor ya tenía `gh` autenticado y OpenCode con permisos. No es reproducible por un principiante sin P09-P12.
- **Validaciones omitidas:** build, `.gitignore`, comprobación de URL, espera del despliegue.
- **Verificabilidad (1):** el Profesor lo verificó abriendo el enlace; la orden no lo exige.
- **Mejora clave:** pedir plan previo, confirmación antes de crear/publicar, y comprobación HTTP de la URL final.

## P04 — Coordinación OpenCode + Claude Code (instrucción oral)

- **Claridad (2):** "conéctate a la calculadora que hizo Open Code... y al repositorio" es ambiguo: ¿clonar, leer, abrir la carpeta? "Deja el camino abierto" es una metáfora sin acción definida. Compartir "captura de pantalla" como canal entre agentes es informal.
- **Riesgos de seguridad (3):** dos agentes escribiendo en la misma carpeta pueden pisarse (Claude Code mismo avisó: "hasta entonces no toco el HTML para evitar conflictos"). Subir al repositorio sin revisión; costos si se conectan APIs de pago (advertido por el Profesor).
- **Ejecutabilidad (3):** posible con carpeta compartida y repositorio, pero la comunicación real es por archivos; no hay canal oficial entre agentes.
- **Verificabilidad (2):** se verificó visualmente el sitio publicado.
- **Mejora clave:** definir roles (agente líder y agente de apoyo), archivo de traspaso (por ejemplo `HANDOFF.md`), ramas o turnos para evitar conflictos, y qué debe quedar en el repositorio.

## P05 — Mejora de la calculadora y subagentes (instrucción oral)

- **Claridad (3):** "hazla más intuitiva y fácil, mejora el diseño, agrega animaciones 3D" son adjetivos subjetivos sin criterio de aceptación. La delegación a subagentes sí es concreta (catálogo; interfaz) y el agente principal definió la coordinación ("espero a los subagentes").
- **Subagentes (documentación consultada 2026-11-22, code.claude.com/docs/en/sub-agents):** cada subagente arranca con contexto nuevo, solo ve el mensaje de delegación y los archivos de contexto del proyecto; el modelo puede definirse por subagente; consumen del mismo límite de uso. Por eso el prompt de delegación debe ser autocontenido; en clase Claude Code generó uno aceptable ("Eres investigador de automatización...").
- **Riesgos:** un catálogo de 327 procesos generado por un modelo sin fuentes puede presentar como hechos estimaciones inventadas (horas, porcentajes). La validación observada fue estructural ("327 ids únicos"), no factual. Las animaciones 3D pueden afectar rendimiento y accesibilidad (`prefers-reduced-motion`).
- **Ejecutabilidad (4):** funcionó y fue probado en navegador por el propio agente.
- **Consumo:** dos subagentes en paralelo multiplican el consumo de tokens; justificable solo con límites de alcance.
- **Mejora clave:** pedir fuentes o marcar estimaciones, límite de alcance (por ejemplo, número de sectores), esquema fijo del catálogo y prueba automática de integridad; exigir copia de seguridad o rama antes de editar el HTML.

## P06 — Landing page DENTEA

- **Claridad (4):** buen prompt: rol, dirección visual, estructura, objetivo y reglas de honestidad ("No inventes testimonios, certificaciones, precios ni datos de contacto... contenido provisional claramente identificado").
- **Ambigüedades y contradicciones:** exige "testimonios" y a la vez prohíbe inventarlos; exige botones de WhatsApp pero prohíbe inventar datos de contacto (en clase se usó un número provisional inventado, lo que podría ser un número real de un tercero); "hiperrealistas" de tratamientos y sonrisas puede inducir a presentar imágenes sintéticas como pacientes reales; "optimiza el rendimiento" sin métrica; "lista para desplegar" sin indicar destino (base path en GitHub Pages).
- **Seguridad (2):** el uso "obligatorio" de Google Flow implica iniciar sesión en una cuenta de Google en el navegador del agente; el Profesor admitió que se pedirá contraseña y sugirió cuenta alterna. Descarga de archivos desde un sitio externo y posibles términos de uso del contenido generado. Riesgo de que el agente escriba credenciales o las guarde en archivos.
- **Ejecutabilidad (3):** depende de Google Flow (cuenta, créditos, interfaz cambiante), de un navegador controlable y de un modelo gratuito lento. Sin plan alternativo: en clase "nos hacen falta las fotos". Framer Motion: el paquete actual puede llamarse `motion` (pendiente de verificar; motion.dev no accesible en esta sesión).
- **Dependencias faltantes:** versión de Node, gestor de paquetes, bundler (Vite, Next), librerías con versión fijada.
- **Validaciones omitidas:** accesibilidad (WCAG), SEO básico, pruebas de enlaces, prueba de `wa.me` (formato internacional sin `+`, texto codificado; documentación de WhatsApp pendiente de verificar), peso de imágenes.
- **Verificabilidad (3):** pide abrir en navegador y revisar desktop y móvil, pero sin lista de comprobación.
- **Tokens:** prompt largo y generación de imágenes con navegador implican muchas llamadas; en clase algunas sesiones seguían "trabajando" tras más de 45 minutos (Estudiante 5 a las 02:27, Estudiante 4 a las 01:56).
- **Mejora clave (V2):** arquitectura frontend, tokens de diseño, accesibilidad, rendimiento, imágenes con alternativa local si no hay Flow, número de WhatsApp configurable y deshabilitado si falta, testimonios claramente ficticios, pruebas visuales y preparación para GitHub Pages.

## P07 — Meta-prompting para landing pages

- **Claridad (3):** pide convertir "cualquier prompt" en un metaprompt excepcional y entregar únicamente el prompt optimizado. Es útil, pero:
  - La referencia "comparable a... Anthropic, como Fable" no es verificable ni operativa.
  - Pide "máxima precisión y potencia" con "la menor cantidad razonable de palabras": objetivos en tensión.
  - Termina en "PROMPT ORIGINAL:" con el hueco vacío. Si el estudiante envía solo la plantilla, el modelo responde con preguntas o ideas (observado en Estudiante 2: "me fue guiando... pero creado no").
  - Las instrucciones de uso están en dos mensajes aparte ("Para ChatGPT", "Y al ultimo de como quieren la landing page"), fáciles de perder.
- **Contexto faltante:** no declara que el prompt resultante se ejecutará en OpenCode, con modelo gratuito, en Windows y publicación en GitHub Pages; ChatGPT puede producir prompts con herramientas inexistentes.
- **Seguridad (3):** riesgo de que el estudiante pegue datos personales o de clientes en ChatGPT; no hay recordatorio de privacidad. Buena regla: "No inventes funcionalidades, datos ni requisitos".
- **Ejecutabilidad (3):** funcionó para Estudiante 4 (landing Stilís), pero depende de que el estudiante aporte datos buenos.
- **Verificabilidad (2):** sin criterios para evaluar el prompt generado.
- **Mejora clave:** plantilla con campos [NOMBRE_DEL_NEGOCIO], [CLIENTE_OBJETIVO]..., regla de preguntar un máximo de preguntas si faltan datos, y declarar entorno de ejecución (ver META-PROMPT en el archivo 04).

## P08 — Agente de voz xAI (instrucción oral)

- **Claridad (3):** las instrucciones fueron conversacionales y suficientes para una demo.
- **Riesgos de seguridad (2):** "que no nos vaya a mandar con humanos" elimina la escalada; sin consentimiento de grabación ni aviso de que es IA (el Profesor lo mencionó como buena práctica en teoría); el agente publicó precios y un contacto de WhatsApp leídos de la web: riesgo de afirmar datos desactualizados o inventados.
- **Ejecutabilidad (4):** funcionó con baja latencia; fallos de micrófono.
- **Verificabilidad (2):** no se contrastó lo que dijo el agente con la fuente.
- **Mejora clave:** reglas de honestidad (no inventar precios, citar fuente, derivar a humano cuando no sepa), aviso de IA y consentimiento, alcance de temas.

## P09 — Instalación inicial de GitHub CLI

- **Claridad (4):** rol, contexto de principiante, 9 pasos numerados, objetivo final y prohibiciones ("No publiques código, crees repositorios ni cambies permisos sin mi autorización. No declares completado ningún paso sin verificarlo").
- **Ambigüedades:** "métodos oficiales" sin dar el de Git; "Configura Git... correctamente" no menciona `user.name`/`user.email`; "corrígelo automáticamente cuando sea seguro" no define seguro (el agente de Estudiante 7 optó por proponer Netlify); "mediante la terminal" supone terminal no interactiva.
- **Errores o riesgos de comandos (verificados 2026-11-22):**
  - `gh auth login --web --git-protocol https`: flags válidos (`-w/--web`, `-p/--git-protocol`) según cli.github.com/manual/gh_auth_login y `gh auth login --help` de gh 2.89.0. Funciona; falta `--hostname github.com` (opcional, es el valor por defecto).
  - `winget install --id GitHub.cli --source winget`: es el comando de la documentación oficial de GitHub CLI (docs/install_windows.md). Sin `--accept-package-agreements --accept-source-agreements` puede detenerse esperando confirmación; para Git no se dio comando (id `Git.Git`, que aparece como ejemplo en la documentación de winget).
  - `gh auth status`, `gh auth setup-git` verificados. `gh auth status` devuelve código de salida 1 si hay problemas; la opción `--show-token` imprime el token y no debe usarse.
- **Dependencias faltantes:** disponibilidad de `winget`; aviso de que el instalador modifica el PATH y la documentación oficial indica abrir una ventana nueva de terminal para que el cambio surta efecto; elevación UAC.
- **Flujo de código:** no se dice dónde se muestra el código ni que no llega por correo; no se indica ejecutar el proceso de inicio de sesión en segundo plano ni qué hacer si caduca (900 s por defecto). Esto explica los códigos caducados y los reportes de "no llega correo" (P10 nació de ahí).
- **Seguridad (4):** buenas barreras (nunca solicitar contraseñas ni tokens, no publicar). Riesgo residual: `gh repo list`/consultas revelan nombres de repositorios privados al modelo; no hay recomendación de verificar el editor de las ventanas UAC.
- **Ejecutabilidad (3):** funcionó para varios (Estudiantes 3 y 6), falló o se atascó para otros (7, 8).
- **Verificabilidad (4):** verifica `gh auth status`, versiones y listado de repositorios; falta `gh api user --jq .login` para confirmar identidad.
- **Tokens:** longitud moderada (≈250 palabras).
- **Confusión para principiantes:** "iniciar sesión" ocurre en tres lugares (cuenta de GitHub en el navegador, `gh` en terminal, página de dispositivo).

## P10 — Regeneración del código de dispositivo

- **Claridad (2):** "Ponme un nuevo codigo, y dejame ya abierta la ventana, directa hacia mi de donde poner el codigo, no quiero buscar, tu abre la ventana": no menciona GitHub ni `gh`; asume que el agente recuerda el contexto de P09. Alterna "ponme/déjame" con "tú abre".
- **Ejecutabilidad (2):** pide "abrir la ventana", que depende de que el agente pueda lanzar el navegador o PowerShell. Si no puede, solo puede mostrar la URL https://github.com/login/device y el código. En clase funcionó porque el agente canceló el intento anterior y generó un código nuevo (relato de Estudiante 6).
- **Riesgos de seguridad (3):** el código de dispositivo es una credencial temporal; el agente lo mostró en el chat (aceptable si es el propio usuario), pero conviene advertir de no compartirlo y de que GitHub avisa: "Never use a code sent by someone else".
- **Verificabilidad (1):** no pide comprobar que el login quedó completado (`gh auth status`).
- **Mejora clave:** contexto explícito, reiniciar el flujo, mostrar código y URL, esperar y verificar.

## P11 — Instalación GitHub CLI reforzada "MISIÓN"

### Por qué P11 intentaba corregir P09
Según lo dicho en clase y lo observado, P09 fallaba en: (1) el agente se detenía y explicaba en lugar de actuar; (2) los estudiantes no encontraban la ventana o el código; (3) códigos caducados; (4) el agente de un estudiante cambió a Netlify; (5) faltaban banderas de winget y refresco de PATH; (6) no había verificación de identidad. P11 responde con "MODO EJECUCIÓN INMEDIATA", apertura obligatoria de PowerShell con `Start-Process`, `--clipboard`, URL de respaldo, más verificaciones (`gh api user --jq .login`, `gh repo list --limit 5`), reglas de autonomía y fase de proyecto. Sigue sin resolver: caducidad del código, ejecución en segundo plano, UAC, y dónde mirar el código.

### Verificación de comandos
- `gh auth login --hostname github.com --git-protocol https --web --clipboard`: **la opción `--clipboard` existe** (`-c, --clipboard`: "Copy one-time OAuth device code to clipboard"), verificado en cli.github.com/manual/gh_auth_login y en la ayuda local de gh 2.89.0, que incluye el ejemplo `gh auth login --web --clipboard`. Matiz (código fuente): copia al portapapeles del equipo donde corre `gh`; si falla, imprime el código en pantalla. Para el principiante puede confundir porque el código no se ve y debe pegarse con Ctrl+V.
- `winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements` y el análogo para `GitHub.cli`: las opciones existen según la documentación de winget (`--id`, `--exact/-e`, `--source`, `--accept-package-agreements`, `--accept-source-agreements`).
- `gh auth setup-git`, `gh auth status`, `gh api user --jq .login` (endpoint `GET /user`, campo `login`), `gh repo list --limit 5` (`--limit` confirmado; si incluye repositorios privados por defecto, **pendiente de verificar**), `gh repo create --private --source=. --push` (confirmado en cli.github.com/manual/gh_repo_create).
- `Start-Process`: el prompt no da el comando exacto ni `-NoExit`; si la ventana se cierra al terminar el comando, el código se pierde. Observado: Estudiante 7 vio una ventana "Windows PowerShell 5.1" con el cursor parpadeando.

### Instrucciones imposibles o frágiles
- "Mantén abierta la ventana de PowerShell hasta completar la autenticación" y "Mientras espero la autorización, conserva el proceso": un agente con herramienta `shell` no controla ventanas del escritorio. Funciona solo si el proceso lanzado con `Start-Process` es independiente; lo robusto es **sondear** `gh auth status` hasta que sea correcto.
- "Si Windows solicita permisos de administrador, muestra la ventana correspondiente": el agente no puede mostrar ni pulsar UAC; la ventana aparece en el escritorio seguro del sistema.
- "No intentes completar una autenticación interactiva dentro de una herramienta de ejecución que no permita introducir datos" es un buen principio, pero en modo no interactivo `gh auth login --web` sí funciona (imprime URL y código), como mostró P09.
- "OpenCode conectado con GitHub" en el mensaje final es un estado no verificable por separado.

### Seguridad
- Buenas reglas: nunca pedir contraseñas/tokens en el chat, no leer ni imprimir credenciales, no desactivar protecciones de Windows, no forzar push, repositorio privado por defecto, no declarar éxito sin comprobar.
- Riesgos: (1) **alcance excesivo**: la sección 5 sube un proyecto a GitHub, algo no pedido en la instalación y que contradice la cautela de P09; (2) "NO te detengas por errores recuperables" y "EJECUTA" refuerzan autonomía sin definir "recuperable"; (3) `gh repo list` expone nombres de repos privados; (4) no hay instrucción de verificar el publicador de las ventanas UAC; (5) el flujo guía al usuario a escribir correo y contraseña en la página de GitHub (correcto solo si la URL es github.com).

### Claridad e integridad del texto
- Se cortó en 4000 caracteres exactos: la sección 5 quedó incompleta y llegó en un segundo mensaje, sin formato, con solapamiento (ver ficha en el archivo 01). Los estudiantes debían pegar "todo junto"; riesgo de pegar solo una parte. Recomendación: prompt más corto (<4000 caracteres) o entregarlo como archivo.
- Mayúsculas, negritas y órdenes en tono imperativo ("NO QUIERO UN TUTORIAL") no mejoran el resultado con modelos pequeños y pueden aumentar errores de interpretación.
- Mezcla instalación, autenticación y publicación de proyecto.

### Puntuación
Claridad 3, seguridad 3, ejecutabilidad 3, verificabilidad 4.

## P12 — Crear repositorio y desplegar en GitHub Pages

- **Claridad (2):** "la landing page ya publica" puede leerse como "ya pública" (adjetivo) o "ya publica" (verbo): se pide a la vez crear repositorio, publicar y dar el enlace. No indica nombre del repositorio, visibilidad, rama, carpeta ni método de Pages.
- **Seguridad (2):** una orden de una línea que crea un repositorio y publica contenido sin plan ni confirmación. No exige revisar secretos, `.gitignore`, `node_modules`, `.env`. Contradice el espíritu de P09 ("no publiques... sin mi autorización"), aunque el usuario autoriza al pegarlo.
- **Documentación de Pages (consulta 2026-11-22):** en cuentas GitHub Free el repositorio debe ser público; el sitio publicado es público; opciones de fuente: rama y carpeta, o GitHub Actions; los cambios pueden tardar hasta 10 minutos; el límite del sitio es 1 GB y existe una restricción de uso comercial (Pages no es para alojar un negocio en línea o comercio). Para frameworks distintos de Jekyll se recomienda un flujo de Actions o `.nojekyll`.
- **Base path:** para un sitio de proyecto (`https://<usuario>.github.io/<repositorio>/`) Vite requiere `base: '/<repositorio>/'` (documentación de Vite vía GitHub). Sin ello, la página queda en blanco o sin estilos. Es una causa probable de "fallos reales" observados en una estudiante (no confirmado).
- **Autenticación:** desplegar con Actions requiere permisos para escribir workflows (alcance `workflow` en el token; hipótesis sobre la ventana de autorización adicional que vio Estudiante 7, pendiente de verificar).
- **Verificabilidad (1):** "dame el link" no garantiza que la URL funcione; el despliegue puede tardar. Falta comprobación HTTP real.
- **Ejecutabilidad (3):** funcionó en varios casos (Estudiantes 6 y 7).
- **Confusión para principiantes:** Estudiante 2 no sabía dónde pegarlo; el prompt se re-pegó entre mensajes; algunos pidieron Firebase o Claude Code.
- **Mejora clave:** plan con confirmación previa, build local, revisión de secretos, visibilidad pública confirmada, método de Pages elegido, base path, espera, verificación de URL y entrega de informe; más un prompt de actualización de la versión publicada.

## P13 — Landing page Stilís (Estudiante 4)

- **Claridad (4):** estructura profesional: marca y dirección visual, estructura numerada en 8 secciones, implementación, criterios de aceptación y entrega. Define lemas, nombres de planes, textos de botones.
- **Fortalezas:** reglas de honestidad (no inventar precios, métricas, testimonios, descargas; "Detalles próximamente"), demo etiquetada como "demostración ilustrativa", estado honesto si no hay destino de registro, accesibilidad (`prefers-reduced-motion`, foco visible, contraste), diseño móvil primero, textos y planes centralizados en configuración editable, criterios de aceptación verificables ("sin desbordamientos en móvil y escritorio", "todos los botones deben tener una acción válida o indicar claramente su estado pendiente").
- **Debilidades:** muchas negaciones seguidas (riesgo de que el modelo se enfoque en lo prohibido); "React y TypeScript si el entorno lo permite" es ambiguo; "rosa mexicano" y "orbe etéreo" no tienen valores concretos (hex, referencia); no indica carpeta de trabajo ni protección de archivos existentes; no pide build ni comandos de verificación concretos; no dice cómo entregar el informe final más allá de "brevemente"; no cubre despliegue (se publicó aparte en Firebase).
- **Seguridad (4):** sin credenciales, sin servicios externos reales, sin cobros ni autenticación.
- **Ejecutabilidad (4):** ejecutada con GLM y el resultado fue elogiado por el Profesor.
- **Tokens:** 3731 caracteres; aceptable por su densidad.
- **Atribución:** autoría de Estudiante 4, aunque el texto parece derivar de P07 (la estudiante dijo que lo pasó por un asistente para "metaprompting").
- **Cómo se compara con P06:** es más preciso en límites y criterios, aunque más largo; P06 aporta la integración con Flow.
- **Recomendación:** no reescribir; ver la "recreación didáctica" en el archivo 04.

## P14 — Prueba de Google Flow desde OpenCode (instrucción oral)

- **Claridad (2):** "métete a Google Flow y hazme un video" delega todo, incluido qué video. El agente generó su propio prompt para Flow.
- **Seguridad (2):** requiere sesión de Google; el Profesor reconoció que la contraseña "siempre nos va a pedir a nosotros", es decir, la escribe el usuario en la página oficial. Posible consumo de créditos de Flow.
- **Ejecutabilidad (3):** dependiente de interfaz web cambiante y de las capacidades del navegador del agente.
- **Verificabilidad (2):** se evaluó viendo el video.
- **Mejora clave:** especificar el guion mínimo, duración, que el agente se detenga para login, y no almacene credenciales.

## P15 — "¿Qué me hace falta para desplegar?" (instrucción oral)

- **Claridad (2):** pregunta abierta que invita al agente a decidir la plataforma. Es segura, pues solo pide información.
- **Efecto observado:** el agente propuso Netlify en lugar de completar GitHub. Aceptar sin pensar habría publicado el sitio en un servicio no pedido.
- **Mejora clave:** pedir diagnóstico sin acciones ("No ejecutes nada: dime qué falta para GitHub Pages") y restringir la plataforma.

## P16 — Reconexión desde Claude Code (instrucción oral)

- **Claridad (2):** "conéctate al repositorio de..." no define permisos (solo lectura o lectura/escritura), rama ni acción.
- **Seguridad (3):** concede acceso de escritura a un repositorio; la conexión de GitHub en Claude se hace por el conector oficial, no escribiendo contraseña a un agente.
- **Mejora clave:** definir solo lectura primero, rama de trabajo, y qué hacer antes de cambiar.
