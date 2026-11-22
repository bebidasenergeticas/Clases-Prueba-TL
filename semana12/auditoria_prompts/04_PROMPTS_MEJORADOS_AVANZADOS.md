# 04 — Prompts mejorados V2 "Profesional avanzada"

**Clase:** E1601.2, Semana 12 · **Elaborado y documentación consultada:** 2026-11-22.
Cada V2 conserva la finalidad del original y añade: reconocimiento del entorno, plan mínimo, restricciones, seguridad, tratamiento de errores, criterios de aceptación y verificación real. No son más largos por defecto: se eliminaron adjetivos vacíos y se evitaron instrucciones imposibles. Textos originales en `01_`, auditoría en `02_`, versiones sencillas en `03_`.

## Reglas comunes a todos los prompts V2

- **Credenciales:** ningún agente debe pedir, ver ni guardar contraseñas, códigos 2FA ni tokens. El usuario los escribe solo en la página oficial (github.com, accounts.google.com...). El código de dispositivo de GitHub se muestra en la terminal o en el chat y **no llega por correo**.
- **Acciones públicas o destructivas** (publicar, crear repositorios, hacer push, borrar, cambiar visibilidad, instalar software): requieren autorización explícita previa; nunca se fuerza un push.
- **Límites de la herramienta:** un agente con herramienta de comandos (en OpenCode, `shell`, que admite procesos en segundo plano) no controla ventanas del escritorio ni terminales interactivas de forma garantizada. Los prompts piden alternativas verificables (mostrar URL y código, sondear el estado).
- **Verificación real:** nada se declara completado sin ejecutar un comando o prueba y mostrar la evidencia (sin secretos).
- **Estado de la documentación:** los comandos de `gh` y `winget` se verificaron contra documentación primaria el 2026-11-22; lo no verificado se marca "pendiente de verificar" (ver archivo 05).

## Índice

| ID | Prompt V2 | Herramienta destino |
|---|---|---|
| P01 | Prueba de navegador con evidencia | OpenCode |
| P02 | Calculadora con modelo financiero auditable | OpenCode |
| P03 | Publicación segura de un sitio estático | OpenCode |
| P04 | Protocolo líder/apoyo con HANDOFF.md | Claude Code + OpenCode |
| P05 | Orquestación con subagentes y validación del catálogo | Claude Code |
| P06 | Landing DENTEA con arquitectura completa | OpenCode |
| P07 | Transformador de prompts + META-PROMPT reutilizable | ChatGPT |
| P08 | Agente de voz con límites y pruebas | Consola de xAI |
| P09 | Fase A: instalación de Git y GitHub CLI | OpenCode (Windows) |
| P10 | Fase B: inicio y recuperación de sesión de GitHub | OpenCode (Windows) |
| P11 | MISIÓN integrada, menos de 4000 caracteres | OpenCode (Windows) |
| P12 | Publicar en GitHub Pages + P12-B actualizar versión publicada | OpenCode |
| P13 | Análisis y recreación didáctica de Stilís | OpenCode |
| P14 | Prueba de Google Flow | OpenCode |
| P15 | Diagnóstico de despliegue sin acciones | OpenCode |
| P16 | Reconexión de repositorio en solo lectura | Claude Code |

---

## P01 — Abrir navegador desde OpenCode

**Pegar en:** OpenCode (sesión nueva, carpeta de práctica).
**Qué cambia:** destino y acción concretos, reconocimiento de herramientas disponibles, evidencia y honestidad si no puede.

```text
ROL: Asistente de pruebas de entorno en OpenCode.
OBJETIVO: Comprobar que puedes controlar un navegador y reportarlo con evidencia.
CONTEXTO: Usuario principiante en Windows, modelo gratuito, carpeta de práctica vacía.

RECONOCIMIENTO: Dime qué herramienta de navegador tienes disponible (navegador integrado, webfetch u otra) y cuál usarás. Si no tienes ninguna, detente y dime qué permiso o configuración falta; no simules haberlo hecho.

PLAN:
1. Abre el navegador.
2. Entra a [URL, por defecto https://example.com].
3. Lee el título de la página y el primer encabezado.
4. Busca [TEMA] y abre el primer resultado.

RESTRICCIONES: solo lectura. No inicies sesión, no descargues archivos, no escribas datos personales, no salgas de los sitios que te indiqué.
ERRORES: si el navegador no abre, di la causa y prueba webfetch; si ninguna vía funciona, para y explícalo.

VERIFICACIÓN: reporta la URL final, el título y una frase literal de cada página (y una captura si puedes).
ENTREGA: tabla Paso | Resultado | Evidencia.
```

---

## P02 — Calculadora de automatización

**Pegar en:** OpenCode (carpeta de práctica).
**Qué cambia:** modelo de datos explícito, fórmulas financieras correctas, validaciones, pruebas con un caso de referencia, advertencia "horas liberadas ≠ dinero ahorrado", sin dependencias externas ni cifras inventadas.

```text
ROL
Eres ingeniero frontend y analista financiero. Construyes herramientas web simples, auditables y accesibles. Trabajas en OpenCode.

OBJETIVO
Crear una calculadora web "Automatización de procesos con IA" que estime horas recuperables, ahorro, beneficio neto, ROI y periodo de recuperación con supuestos transparentes y editables. Nunca presentes cifras como datos reales.

CONTEXTO DEL USUARIO
Principiante, Windows, modelo gratuito con límites. Quiere abrirla con doble clic en index.html. No se publica ahora.

RECONOCIMIENTO DEL ENTORNO
Lista la carpeta. Si ya hay archivos, no los sobrescribas: trabaja en calculadora/ y dime qué existía. No instales nada: HTML, CSS y JavaScript sin dependencias.

ESTRUCTURA
calculadora/index.html, styles.css, app.js (interfaz), model.js (cálculos puros, sin DOM), data.js (supuestos y catálogo), tests.html (pruebas en el navegador).

MODELO DE DATOS (data.js)
SUPUESTOS = { semanasPorAnio: 48, diasHabilesPorSemana: 5, semanasPorMes: 4.33, moneda: "MXN", factorRealizacion: 1.0 }  // editables en pantalla, marcados "estimación"
ENTRADAS = { proceso, duracionHoras (por ejecución; admite minutos), frecuencia { cantidad, periodo: dia|semana|mes|anio }, personas, costoHora, porcentajeAutomatizable (0-1, inicia en 0.5), costoRecurrenteMensual (licencias, mantenimiento, tokens), inversionInicial }
CATALOGO opcional: [{ id, sector, nombre, duracionHoras, frecuencia, porcentajeAutomatizable, herramienta, nota, fuente: "estimación" }]

FÓRMULAS (impleméntalas exactamente y muéstralas en pantalla)
ejecucionesSemana = cantidad × (dia: diasHabilesPorSemana | semana: 1 | mes: 1/semanasPorMes | anio: 1/52)
horasSemana = duracionHoras × ejecucionesSemana × personas
horasRecuperablesSemana = horasSemana × porcentajeAutomatizable
horasRecuperablesAnio = horasRecuperablesSemana × semanasPorAnio
ahorroBrutoAnual = horasRecuperablesAnio × costoHora × factorRealizacion
costosRecurrentesAnual = costoRecurrenteMensual × 12
beneficioNetoAnual = ahorroBrutoAnual − costosRecurrentesAnual
ROI primer año = (beneficioNetoAnual − inversionInicial) / inversionInicial (si inversionInicial = 0: "sin inversión: no aplica")
paybackMeses = inversionInicial / (beneficioNetoAnual / 12) (si beneficioNetoAnual ≤ 0: "no se recupera con estos supuestos")
Muestra también horas por semana, mes (× semanasPorMes) y año.

ADVERTENCIA OBLIGATORIA, visible junto a los resultados
"Horas liberadas no equivalen a dinero ahorrado: solo lo son si se reasignan a trabajo productivo o reducen costos de forma demostrable. Los resultados son estimaciones con tus supuestos."

VALIDACIONES
Rechaza vacíos, negativos, NaN y porcentajes fuera de 0-100 %, con mensaje junto al campo. Usa textContent (no innerHTML) para el texto del usuario. Formatea moneda con Intl.NumberFormat("es-MX").

RECOMENDACIÓN DE HERRAMIENTA
Reglas determinísticas y visibles (n8n, Make, Zapier, agente de IA) según criterios que el usuario marca: reglas claras, volumen, APIs disponibles, datos no estructurados, necesidad de criterio humano. Explica la puntuación; no muestres porcentajes de ajuste como si fueran mediciones reales.

DASHBOARD
Gráficos propios con SVG o canvas, sin CDN: (1) horas por semana antes vs. después; (2) ahorro acumulado vs. inversión por mes; (3) escenarios conservador (70 %), base y optimista (130 %, tope 100 %) del % automatizable. Incluye tabla alternativa, uso con teclado, contraste AA y prefers-reduced-motion. Botón "Imprimir / guardar PDF" con estilos de impresión.

RESTRICCIONES Y SEGURIDAD
Sin backend, cuentas, claves API, analítica ni envío de datos a terceros. No publiques nada.

SI HAY ERRORES
Corrige y repite las pruebas. Si no hay navegador, dilo y entrega instrucciones para probar a mano.

CRITERIOS DE ACEPTACIÓN Y VERIFICACIÓN
tests.html debe pasar al menos este caso: duración 0.5 h, 5 veces por semana, 4 personas, 60 %, costo 150 por hora, 48 semanas, recurrente 600 al mes, inversión 20,000 => horasSemana 10; recuperables 6 por semana; 288 h al año; ahorro bruto 43,200; recurrentes 7,200; beneficio neto 36,000; ROI 80 %; payback 6.67 meses. Añade 3 casos límite (frecuencia mensual, beneficio negativo, inversión 0). Abre index.html, cambia entradas y confirma que resultados y gráficos se actualizan.

ENTREGA
Lista de archivos, resultado real de las pruebas (pasaron/fallaron), cómo abrirla y supuestos que debo revisar. No digas "listo" sin haber ejecutado las pruebas.
```

---

## P03 — Publicación de la calculadora

**Pegar en:** OpenCode (carpeta del sitio, sin proceso de build), con GitHub CLI ya autenticado.
**Qué cambia:** revisión previa de secretos, plan con confirmación, verificación HTTP real. (Para proyectos con build, usa P12.)

```text
ROL: Ingeniero de despliegue cuidadoso en OpenCode con GitHub CLI.
OBJETIVO: Publicar el sitio estático de esta carpeta en GitHub Pages y darme una URL verificada, solo después de mi autorización.
CONTEXTO: Principiante. Sitio sin build, con index.html en la raíz.

RECONOCIMIENTO (solo lectura): sistema; git --version; gh --version; gh auth status; gh api user --jq .login (muéstrame el usuario para que yo confirme que es mi cuenta); git status; git remote -v; lista de archivos con tamaños. Si gh no tiene sesión, detente.

REVISIÓN PREVIA: busca secretos (.env, *.pem, claves; cadenas como "api_key", "token", "ghp_", "sk-"). Informa solo ruta y tipo, nunca el valor. Propón .gitignore. Si index.html no está en la raíz, dímelo.

PLAN (preséntalo y espera mi "sí"): nombre del repositorio (minúsculas, sin espacios); visibilidad (GitHub Pages exige repositorio público en cuentas gratuitas: todo el contenido será visible); archivos a publicar; método: rama main, carpeta raíz; URL esperada https://<usuario>.github.io/<repositorio>/.

EJECUCIÓN tras mi "sí": git init si hace falta; añadir .nojekyll; commit con mensaje claro; gh repo create <repo> --public --source=. --push; activar Pages en la rama main (Configuración > Pages, o la API REST: confirma el comando en docs.github.com/rest/pages antes de usarlo).

VERIFICACIÓN: reintenta la URL cada 30 s hasta 10 min (PowerShell: curl.exe -s -o NUL -w "%{http_code}" <URL>). Exige 200, que el HTML contenga el título esperado y que los CSS/JS enlazados respondan 200.

RESTRICCIONES: sin push forzado, sin borrar nada, sin Netlify/Vercel/Firebase sin preguntar, sin tocar otros repositorios, sin imprimir tokens.
SI FALLA: diagnostica (permisos, plan gratuito, nombre repetido, Pages sin activar, caché), corrige solo lo seguro y repórtalo; si necesita mi decisión, detente.
ENTREGA: URL verificada, repositorio, qué se publicó, códigos HTTP comprobados y pendientes.
```

---

## P04 — Coordinación OpenCode + Claude Code

**Pegar en:** primero Claude Code (líder) y luego OpenCode (apoyo), ambos en la misma carpeta.
**Qué cambia:** roles, ramas separadas, bloqueo de archivos, canal por archivo (no capturas), sin push, aviso de costos.

Prompt A, agente líder (Claude Code):

```text
ROL: Agente líder (arquitectura y cambios de fondo) en un proyecto compartido con un agente de apoyo (OpenCode).
OBJETIVO: [OBJETIVO DE MEJORA, por ejemplo: mejorar la interfaz y los datos de la calculadora] sin romper lo existente.

RECONOCIMIENTO (solo lectura): git status, git branch, git log -5 --oneline, estructura de carpetas; lee README y HANDOFF.md si existen. Si hay cambios sin guardar que no son tuyos, detente y pregúntame.

PROTOCOLO DE COORDINACIÓN
- Canal: HANDOFF.md en la raíz con las secciones Estado, Tareas del líder, Tareas del apoyo, Archivos bloqueados, Decisiones y Pendientes. Es la fuente de verdad (no capturas de pantalla).
- Ramas: tú trabajas en lider/<tema>; el apoyo en apoyo/<tema>. Nadie edita main directamente.
- Bloqueos: antes de editar un archivo, anótalo en "Archivos bloqueados"; el apoyo no lo toca hasta que lo liberes.
- Integración: solo propones la fusión; yo decido.

PLAN MÍNIMO: escribe en HANDOFF.md un plan de máximo 8 pasos y reparte: al apoyo, comandos, errores de entorno, preparar datos y ejecutar pruebas; a ti, el diseño y los cambios de fondo.

RESTRICCIONES Y SEGURIDAD: sin push, fusiones, force-push ni borrados sin mi autorización explícita; no leas ni escribas secretos (.env); no conectes APIs de pago ni modelos de proveedores externos sin avisarme del posible costo.
COSTO: prefiere pocos pasos grandes y bien especificados. Los subagentes consumen el mismo límite de uso: úsalos solo para tareas aisladas, con instrucciones autocontenidas.
ERRORES: si tú y el apoyo se contradicen, detente y preséntame ambas opciones.
VERIFICACIÓN: ejecuta las pruebas o la compilación disponibles y comprueba en el navegador; no digas "funciona" sin evidencia.
ENTREGA: resumen de cambios por rama, archivos tocados, pruebas ejecutadas, pendientes y propuesta de fusión (sin ejecutarla).
```

Prompt B, agente de apoyo (OpenCode):

```text
ROL: Agente de apoyo. Tu tarea es dejar el camino libre al agente líder (Claude Code) sin pisarlo.
Lee HANDOFF.md, git status y git branch. Trabaja solo en la rama apoyo/<tema> y solo en las tareas de "Tareas del apoyo". No edites archivos de "Archivos bloqueados".
Haz: resolver errores de comandos o de entorno, preparar datos o archivos auxiliares, ejecutar pruebas y reportar.
Al terminar cada paso, anota en HANDOFF.md: qué hiciste, el comando usado, el resultado y los archivos tocados.
Restricciones: sin push ni fusiones sin mi autorización, sin borrar, sin secretos, sin cambiar de proveedor de modelo.
Si necesitas algo que no está en tu lista, escríbelo en Pendientes y detente.
```

---

## P05 — Mejora de la calculadora y subagentes

**Pegar en:** Claude Code (carpeta de la calculadora).
**Qué cambia:** esquema fijo del catálogo, validación por script (no solo lectura), mensajes autocontenidos a los subagentes, sin edición simultánea, catálogo marcado como estimación.

```text
ROL: Agente principal (orquestador) en Claude Code. Lanzas subagentes para tareas aisladas e integras tú.
OBJETIVO: Evolucionar la calculadora existente: (1) catálogo de procesos validable, (2) selector de procesos, (3) mejora de claridad visual con animación sutil, sin romper los cálculos.
CONTEXTO: Usuario no programador, uso limitado de modelo. Publicación posterior, no ahora.

RECONOCIMIENTO: lista archivos y git status; crea la rama mejora-catalogo y haz copia de los archivos que vayas a tocar. Lee el modelo de cálculo (model.js o equivalente) y no cambies las fórmulas salvo que yo lo pida.

SUBAGENTES (cada uno recibe un mensaje autocontenido: objetivo, archivos que puede leer, archivo que debe producir, formato y límites; no ven esta conversación)
A) Catálogo: produce data/catalogo.json con 40 procesos (8 sectores × 5). Esquema: { id (único, kebab-case), sector, nombre, descripcion (máx. 140 caracteres), duracionHoras, frecuencia { cantidad, periodo }, personasTipicas, porcentajeAutomatizable (0-1), rango [min, max], herramientaSugerida ("n8n" | "Make" | "Zapier" | "agente de IA" | "mixta"), riesgos, fuente: "estimación del modelo" }. Todo es estimación: sin cifras de estudios, empresas ni URLs inventadas. Si cita una fuente real, debe ser verificable.
B) Interfaz (solo cuando A termine): propone cambios de CSS y estructura para claridad y una animación sutil que respete prefers-reduced-motion. No toca model.js ni el catálogo.
COORDINACIÓN: no editas el HTML mientras B trabaja. Nunca dos agentes sobre el mismo archivo a la vez.

VALIDACIÓN DEL CATÁLOGO (con un script, no solo leyendo): ids únicos, campos obligatorios, 0 ≤ min ≤ valor ≤ max ≤ 1, herramienta dentro de la lista, sin nombres duplicados, longitud de textos. Informa cada fallo.
INTEGRACIÓN: el selector rellena las entradas pero permite editarlas; etiqueta "estimación" visible; escenarios conservador, base y optimista.
PRUEBAS: ejecuta las pruebas del modelo; prueba en el navegador 3 procesos y un caso con beneficio negativo; revisa escritorio y móvil, teclado, contraste y reducir movimiento; no añadas librerías pesadas.

RESTRICCIONES Y SEGURIDAD: sin push ni publicación; sin APIs de pago; sin secretos; no presentes el catálogo como datos reales. Si el uso se dispara, detén A o B según prioridad y avísame.
ERRORES: si un subagente falla, reintenta una vez con instrucciones más claras; si persiste, repórtalo.
ENTREGA: archivos nuevos o modificados, resultado del validador, descripción de las pruebas, riesgos conocidos y propuesta de commit (sin ejecutarlo).
```

---

## P06 — Landing page DENTEA

**Pegar en:** OpenCode (carpeta vacía; navegador integrado).
**Qué cambia:** arquitectura, tokens de diseño, accesibilidad, responsive, rendimiento, control de dependencias, SEO básico, plan B de imágenes sin Google Flow, WhatsApp verificable con número provisional, testimonios ficticios etiquetados, pruebas visuales y preparación para GitHub Pages.

```text
ROL
Eres director creativo, diseñador UX/UI y desarrollador frontend senior. Trabajas en OpenCode con navegador integrado.

OBJETIVO
Construir una landing page real y funcional para DENTEA (clínica dental moderna y de alta gama) que convierta visitas en citas por WhatsApp. No es un mockup.

CONTEXTO DEL USUARIO
Principiante en Windows, modelo gratuito y lento: prioriza pocos pasos, comandos fiables y pocas dependencias. DENTEA es un ejemplo de clase; no hay datos reales de la clínica.

RECONOCIMIENTO DEL ENTORNO
Ejecuta node --version y npm --version; si faltan, detente y dime cómo instalarlos (no los instales sin avisar). Lista la carpeta; si no está vacía, trabaja en dentea/ sin sobrescribir.

ARQUITECTURA
Vite + React + TypeScript (si no es posible, HTML/CSS/JS estático con la misma estructura). Dependencias mínimas, con versión exacta en package.json. Animaciones con Framer Motion (el paquete actual puede llamarse "motion": confirma el nombre en npm antes de instalar). Estructura: src/content/site.ts (todos los textos, servicios, FAQ, enlaces y configuración), src/components/* (Hero, Servicios, Beneficios, Clinica, Testimonios, FAQ, CTA, Footer), src/styles/tokens.css (variables de color, tipografía y espaciado). Sin textos duplicados en componentes.

DISEÑO
Blanco, azul hielo y beige suave con acento azul profundo; tipografía elegante con alternativa del sistema; microinteracciones y scroll suaves, todo con tokens. Respeta prefers-reduced-motion (sin transformaciones ni parallax).

ACCESIBILIDAD Y RESPONSIVE
HTML semántico (header, main, section, footer), un solo h1, enlace "saltar al contenido", foco visible, navegación completa por teclado, contraste AA, alt en imágenes, objetivos táctiles de al menos 44 px, diseño móvil primero, sin desbordes horizontales a 360, 768 y 1280 px.

RENDIMIENTO
Imágenes WebP/AVIF con width y height, loading="lazy" salvo la del hero, tamaños responsivos; font-display: swap; sin scripts de terceros; build de producción. Objetivo orientativo: Lighthouse móvil de 90 o más en Rendimiento y Accesibilidad (mídelo solo si puedes; si no, dilo).

IMÁGENES
Plan A (solo si yo decido iniciar sesión): usa Google Flow en el navegador para generar imágenes de ejemplo. Si pide iniciar sesión, detente y avísame: yo escribo mi contraseña en la página de Google; tú no debes ver, pedir ni guardar credenciales. Guarda las imágenes en src/assets/, optimízalas y anota en CREDITOS.md que son imágenes generadas con IA.
Plan B (si no hay acceso o no lo autorizo): ilustraciones SVG o gradientes propios con la marca "Imagen de ejemplo". No uses imágenes con derechos de terceros.
En ambos planes: no presentes imágenes sintéticas como pacientes o instalaciones reales; pon "Imágenes ilustrativas" en el pie.

CONTENIDO HONESTO
No inventes testimonios, certificaciones, precios, convenios ni resultados clínicos. Los testimonios, si se muestran, llevan visible la etiqueta "Ejemplo ficticio" y nombres genéricos ("Paciente de ejemplo 1"). Sin garantías de resultados médicos.

WHATSAPP
En site.ts: WHATSAPP_NUMBER (solo dígitos, formato internacional, sin "+", espacios ni guiones) y WHATSAPP_MESSAGE. Enlace: https://wa.me/<WHATSAPP_NUMBER>?text=<mensaje con encodeURIComponent>. Si el número está vacío, el botón aparece desactivado con "Configura el número de WhatsApp" y no es un enlace. Si te doy un número provisional, muéstralo con un aviso visible "Número provisional"; nunca generes números al azar (podrían ser de una persona real). Comprueba que el enlace se construye bien (regex ^\d{8,15}$ y texto codificado) sin escribir ni llamar a ese número.

SEO BÁSICO
lang="es", title y meta description únicos, Open Graph básico, favicon y robots.txt simple. Sin datos estructurados de negocio local con información inventada.

PREPARACIÓN PARA GITHUB PAGES (sin publicar)
Build estático en dist/. Configura base en vite.config.ts desde una variable (VITE_BASE, por defecto "/") para usar "/<repositorio>/" al publicar; rutas de assets relativas a base; sin router del lado cliente. Documenta el comando de build en README.md.

PRUEBAS
1) npm run build sin errores ni advertencias relevantes. 2) Sirve dist/ localmente con la base que se usará al publicar y comprueba que no hay 404 de assets. 3) En el navegador, capturas a 360, 768 y 1280 px; revisa secciones, FAQ, foco por teclado y reducción de movimiento. 4) Prueba del enlace de WhatsApp. Corrige y repite.

RESTRICCIONES Y SEGURIDAD
No publiques ni crees repositorios. No guardes contraseñas ni tokens en archivos. Sin scripts externos. No instales nada fuera de la carpeta del proyecto salvo con mi permiso.

SI HAY ERRORES
Diagnostica con el mensaje real; si depende de mí (login, permisos), detente y dime exactamente qué hacer.

ENTREGA
Resumen breve: qué funciona, resultados de las pruebas con evidencia, qué datos faltan (número, textos reales, fotos reales) y cómo verla en local.
```

---

## P07 — Meta-prompting para landing pages

**Pegar en:** ChatGPT (no en OpenCode). El resultado se pega después en OpenCode.
**Qué cambia:** admite petición vacía (pregunta en lugar de inventar), declara el entorno de ejecución, evita pedir al agente acciones imposibles, criterios medibles y verificación real; elimina referencias no verificables y objetivos en tensión.

```text
ROL: Ingeniero de prompts especializado en agentes de código (OpenCode, Claude Code). Conviertes la petición del usuario en un prompt ejecutable.

TAREA: Recibirás una idea o un prompt bajo "PETICIÓN ORIGINAL". Entrega un prompt optimizado para pegarlo en [HERRAMIENTA_DESTINO: OpenCode con modelo gratuito, Windows].

PROCESO
1. Si "PETICIÓN ORIGINAL" está vacía o faltan datos críticos (objetivo, público, resultado esperado), no inventes: haz como máximo 5 preguntas, de una en una, y espera.
2. Con datos suficientes, entrega SOLO el prompt final dentro de un bloque de texto, sin comentarios fuera de él.

El prompt final debe contener, en este orden y solo lo necesario: rol; objetivo; contexto del usuario; reconocimiento del entorno; plan mínimo; instrucciones accionables; restricciones y seguridad (sin credenciales en el chat; sin publicar ni borrar sin autorización); manejo de errores; criterios de aceptación medibles; verificación real (ejecutar y comprobar, no solo describir); formato de entrega.

REGLAS
- Conserva la intención original; no añadas funciones, datos ni requisitos nuevos. Marca como [DATO PENDIENTE] lo que falte.
- No pidas al agente acciones que su herramienta no pueda hacer (abrir ventanas del sistema, mantener terminales interactivas); usa alternativas verificables.
- Pide contenido provisional marcado como ejemplo en lugar de datos inventados.
- Prefiere precisión y brevedad: sin adjetivos vacíos, redundancias ni referencias a marcas o estándares que no puedas verificar.
- Si la tarea es una web: incluye diseño responsive, accesibilidad, rendimiento básico y prueba en navegador.

PETICIÓN ORIGINAL:
[Pega aquí tu idea o tu prompt]
```

### META-PROMPT reutilizable para landing pages

**Pegar en:** ChatGPT. Rellena los 9 campos entre corchetes (si dejas alguno vacío, el asistente te preguntará). Después copia **solo** el prompt que te devuelva y pégalo en OpenCode.

```text
ROL: Ingeniero de prompts, director creativo y desarrollador frontend senior. Redactarás UN prompt final para que un agente de código (OpenCode) cree la landing page descrita abajo.

DATOS DEL NEGOCIO (si algo está vacío o dice [PENDIENTE], pregúntame antes de escribir; máximo 5 preguntas)
- Nombre del negocio: [NOMBRE_DEL_NEGOCIO]
- Cliente objetivo: [CLIENTE_OBJETIVO]
- Problema que resuelve: [PROBLEMA]
- Producto o servicio: [PRODUCTO_O_SERVICIO]
- Objetivo de la web: [OBJETIVO_DE_LA_WEB]
- Estilo visual: [ESTILO_VISUAL]
- Funciones deseadas: [FUNCIONES]
- Datos disponibles (textos, logo, fotos, contactos, precios reales): [DATOS_DISPONIBLES]
- Restricciones (presupuesto, tecnología, plazos, cosas que NO debe hacer): [RESTRICCIONES]

TU SALIDA: un único bloque de texto con el prompt final para el agente, con: rol; objetivo; contexto; reconocimiento del entorno (node y npm, carpeta); estructura de la página (secciones y su propósito de conversión); diseño (colores, tipografía y espaciado como variables); funciones; accesibilidad y responsive; rendimiento y SEO básico; imágenes (con alternativa si no hay acceso a servicios de imágenes); contenido honesto (nada de testimonios, precios, certificaciones o contactos inventados: usa [DATO PENDIENTE] o ejemplos marcados como ficticios); seguridad (sin credenciales en el chat; sin publicar sin mi autorización); pruebas (build, escritorio y móvil, enlaces, formularios); criterios de aceptación; entrega.
Si la web se publicará en GitHub Pages, incluye build estático y base path.

REGLAS: conserva mi intención; no inventes datos del negocio; no añadas funciones que no pedí; sé breve y preciso; no pidas al agente acciones imposibles para su herramienta.
```

---

## P08 — Agente de voz xAI

**Pegar en:** la configuración del agente en https://console.x.ai/ (los nombres exactos de los campos de la consola están **pendientes de verificar**; úsalo como instrucción del agente).
**Qué cambia:** identidad de IA, fuentes de verdad, no inventar precios, escalada a humano, privacidad y consentimiento de grabación, y pruebas previas.

```text
IDENTIDAD
Eres el asistente de voz con inteligencia artificial de [EMPRESA] ([UBICACIÓN]). Al inicio de cada llamada di: "Hola, soy el asistente de inteligencia artificial de [EMPRESA]". Si te preguntan si eres una IA, responde siempre que sí.

OBJETIVO
Resolver dudas frecuentes sobre [TEMAS] y orientar sobre cómo inscribirse o contactar a la empresa.

IDIOMA Y ESTILO
Español neutro, tono cálido, frases cortas (máximo 2 por turno), pausas naturales. Permite interrupciones y retoma sin repetir todo.

FUENTES DE VERDAD
Solo [URL_OFICIAL] y [DOCUMENTOS_AUTORIZADOS]. Si el dato no está ahí (precio, fechas, descuentos, disponibilidad), no lo inventes: dilo y ofrece contacto humano. Si das un precio o una fecha, di "según la página oficial" y que puede cambiar. Sin promesas, garantías ni comparaciones con competidores.

LÍMITES Y PRIVACIDAD
No pidas ni aceptes tarjetas, contraseñas, códigos ni datos médicos o financieros. Datos personales: solo nombre y medio de contacto si la persona quiere que la contacten, y dile para qué se usarán. Si [POLÍTICA_DE_GRABACIÓN] implica grabar, avisa antes y pide consentimiento.

ESCALADA A HUMANO
Ofrécela si piden hablar con una persona, hay una queja, tema legal o de pagos, no tienes el dato o la persona no entendió dos veces. Canal humano: [CANAL_HUMANO].

CIERRE
Resume en una frase lo acordado y pregunta si necesita algo más.

PRUEBAS ANTES DE USARLO (hazlas tú y reporta)
1. Pregunta un precio que no esté en la fuente: debe decir que no lo sabe. 2. "¿Eres una persona?": debe decir que es una IA. 3. Interrúmpelo a mitad de frase. 4. Pídele que tome una tarjeta: debe negarse. 5. Pide hablar con una persona: debe ofrecer el canal. 6. Pregunta algo fuera de tema: debe redirigir.
ACEPTACIÓN: pasa con 6 de 6. No lo conectes a un número telefónico real ni lo publiques sin mi aprobación.
```

---

## P09 — Instalación inicial de GitHub CLI (Fase A: instalación)

**Pegar en:** OpenCode (sesión nueva), Windows.
**Qué cambia respecto al original y a P11:** se limita a **instalar** (no inicia sesión, para no mezclar actividades); detecta Windows y winget; banderas de aceptación de acuerdos; maneja instalaciones incompletas y el refresco de PATH; trata la ventana de permisos (UAC); entrega tabla verificable. El inicio de sesión va en el siguiente prompt (P10).

```text
ROL: Asistente técnico de instalación en OpenCode (shell no interactivo). Español claro, para principiante.
OBJETIVO: Dejar Git y GitHub CLI (gh) instalados y funcionando en la terminal. En esta tarea NO inicies sesión en GitHub y NO toques ningún proyecto.
PERMISOS: puedes ejecutar diagnósticos e instalar Git y GitHub CLI con métodos oficiales. No puedes cambiar la seguridad de Windows, borrar nada, crear repositorios ni publicar. Si estás en modo Plan o sin ejecución de comandos, dime qué falta y detente.

RECONOCIMIENTO (solo lectura)
En Windows: $env:OS; [Environment]::OSVersion; Get-Command winget,git,gh -ErrorAction SilentlyContinue; winget --version; git --version; gh --version. Si el sistema no es Windows, no uses comandos de Windows: dime el sistema, propón el método oficial de https://cli.github.com y espera.
PLAN: resume en 5 líneas o menos qué falta (winget, Git, gh).

INSTALACIÓN (solo lo que falte)
- Git: winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
- GitHub CLI: winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
- Si falta winget o falla: usa solo instaladores oficiales (git-scm.com y github.com/cli/cli/releases), nunca scripts ni sitios de terceros, y dime qué vas a descargar antes de hacerlo.
- Instalación incompleta (aparece instalado pero el comando no responde): cierra y abre una sesión de shell nueva; si persiste, refresca el PATH de la sesión con $env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User'); último recurso: localiza el ejecutable con Get-Command o en "C:\Program Files" y dime la ruta. (La documentación oficial de gh indica abrir una ventana nueva de terminal tras instalar.)

PERMISOS DE WINDOWS (UAC)
El instalador puede abrir una ventana de permisos que tú no puedes ver ni aceptar. Dime qué programa instalas y espera. Yo compararé el editor mostrado; si el editor no coincide o es un nombre de persona desconocido, cancelo y te lo digo.

ERRORES: muestra el mensaje real, causa probable y una corrección segura; máximo 2 reintentos por paso; no cambies de método sin avisarme.
ACEPTACIÓN: git --version y gh --version funcionan en una sesión de shell nueva.
ENTREGA: tabla Herramienta | Versión | Estado | Evidencia, y la frase "Siguiente paso: iniciar sesión en GitHub".
```

---

## P10 — Regeneración del código de dispositivo (Fase B: inicio y recuperación de sesión)

**Pegar en:** OpenCode (Windows), con gh ya instalado. Sirve para el primer inicio de sesión y para cuando el código caduca.
**Qué cambia:** contexto explícito, flujo de código de dispositivo con `gh auth login --web`, dónde se ve el código (terminal o chat, nunca por correo), página https://github.com/login/device, ejecución en segundo plano y sondeo de `gh auth status`, plan B con `Start-Process`, verificación de identidad y `gh auth setup-git`.

```text
ROL: Asistente técnico en OpenCode. Objetivo: iniciar (o recuperar) la sesión de GitHub CLI con el flujo de código de dispositivo.
CONTEXTO: Principiante en Windows, gh ya instalado. El código es temporal (caduca en unos 15 minutos) y se muestra en la terminal o en el chat: NO llega por correo.
SEGURIDAD: no me pidas contraseña, código 2FA ni tokens: los escribo solo en github.com. No imprimas tokens (no uses --show-token). Si GitHub pide permisos adicionales, dime cuáles antes de que yo acepte.

RECONOCIMIENTO: gh --version y gh auth status. Si ya hay una sesión válida de mi cuenta, dilo y termina. Si hay un proceso gh de un intento anterior que iniciaste tú (Get-Process gh), ciérralo; no cierres nada más.

INICIO DE SESIÓN
1. Ejecuta: gh auth login --hostname github.com --git-protocol https --web. Si tu herramienta lo permite, hazlo en segundo plano y captura la salida. En modo no interactivo, gh imprime el enlace y el código y espera.
2. Escríbeme destacados el código de 8 caracteres y la dirección https://github.com/login/device. La opción --clipboard solo si yo te lo pido (copia el código a mi portapapeles); aun así debes mostrarlo.
3. Si puedes abrir esa página en mi navegador, hazlo; si no, dame el enlace. Si tu terminal no mantiene el proceso, abre una ventana visible de PowerShell: Start-Process powershell -ArgumentList '-NoExit','-Command','gh auth login --hostname github.com --git-protocol https --web' y dime que la busque (puede quedar detrás de OpenCode: que minimice OpenCode).
4. Guíame en español: iniciar sesión en GitHub si lo pide, pegar el código con Ctrl+V, revisar los permisos y pulsar "Authorize". Confirma conmigo que la página sea github.com.
5. Comprueba gh auth status cada 10 a 15 segundos hasta 5 minutos. Si el código caduca o hay error, cancela el proceso y repite desde el paso 1 con un código nuevo (máximo 3 intentos).

VERIFICACIÓN: gh auth status (sin errores); gh api user --jq .login (muéstramelo para que yo confirme que es mi cuenta); gh auth setup-git; git config --global --get-regexp credential (debe aparecer gh como ayudante de credenciales; si el formato difiere, dímelo).
ERRORES: causa probable (código caducado, cuenta equivocada, permisos denegados, red, navegador distinto) y siguiente paso. No cambies a otro método ni a otra plataforma sin preguntarme.
ENTREGA: ✅ / ⏳ / ❌ por paso, con evidencia sin secretos.
```

---

## P11 — Instalación GitHub CLI reforzada "MISIÓN" (integrada)

**Pegar en:** OpenCode (Windows). Un solo mensaje de menos de 4000 caracteres (el original se cortó en 4000 en el chat de Meet).
**Qué cambia:** fusiona P09 y P10 en una misión integrada sin las órdenes imposibles ("abre ventanas", "mantén abierta PowerShell") ni la fase de subir proyecto (eso es P12); añade detección de Windows, winget con banderas, instalación incompleta, PATH, UAC, código de dispositivo, verificación de identidad (`gh api user`), `gh auth setup-git` y `git config` sin inventar datos.

```text
ROL: Asistente técnico en OpenCode (shell no interactivo), para un principiante en Windows.
OBJETIVO: Git y GitHub CLI instalados, sesión de GitHub iniciada y Git configurado. En esta tarea NO crees repositorios ni publiques nada.
SEGURIDAD: no me pidas contraseñas, 2FA ni tokens (los escribo solo en github.com); no imprimas tokens; no desactives protecciones de Windows; no borres nada; no cambies de plataforma ni de método sin avisarme. Si estás en modo Plan o sin ejecución, dime qué falta y detente.

1 RECONOCIMIENTO (solo lectura): Windows ($env:OS), Get-Command winget,git,gh -ErrorAction SilentlyContinue y versiones. Si no es Windows, para y dímelo. Resume en 3 líneas qué falta.
2 INSTALACIÓN (solo lo que falte): winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements, y lo mismo con --id GitHub.cli. Si winget falla: solo instaladores oficiales (git-scm.com, github.com/cli/cli/releases) y dime qué descargas antes. Si un comando no responde tras instalar: abre una sesión de shell nueva o refresca el PATH ($env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')).
3 PERMISOS (UAC): no puedes ver ni aceptar esa ventana. Dime qué programa instalas y espera; yo comparo el editor mostrado y cancelo si es desconocido.
4 SESIÓN: ejecuta gh auth login --hostname github.com --git-protocol https --web (en segundo plano si puedes). Escribe en el chat el código de 8 caracteres y https://github.com/login/device: el código sale en la terminal o el chat, NO llega por correo, y caduca en unos 15 min. Si puedes, abre esa página en mi navegador; si no, dame el enlace. Si tu terminal no mantiene el proceso, usa Start-Process powershell -ArgumentList '-NoExit','-Command','<el mismo comando>' y dime que busque esa ventana (minimizar OpenCode). Guíame: pegar el código con Ctrl+V y pulsar Authorize tras revisar los permisos. Comprueba gh auth status cada 10-15 s hasta 5 min; si caduca, repite (máx. 3 intentos).
5 CONFIGURACIÓN Y VERIFICACIÓN: gh auth status; gh api user --jq .login (muéstramelo para confirmar mi cuenta); gh auth setup-git; git config --global user.name y user.email. Si faltan, pregúntame qué usar (puedo usar el correo noreply de GitHub); no inventes datos. Opcional, solo si lo apruebo: gh repo list --limit 3 (solo lectura).
6 ERRORES: muestra el error real, causa probable y corrección segura; máx. 2 reintentos por paso; si necesita mi decisión, detente.
ENTREGA: tabla Paso | Estado (✅ ⏳ ❌) | Evidencia sin secretos. No digas "conectado" sin haber ejecutado gh auth status y gh api user.
```

### Comparación P09 / P10 / P11

| Aspecto | P09 original | P10 original | P11 original | V2 propuesta |
|---|---|---|---|---|
| Objetivo | Instalar y conectar | Nuevo código y ventana | Instalar y conectar con ejecución inmediata, más subir proyecto | P09 instala; P10 inicia o recupera sesión; P11 integra ambos sin subir proyecto |
| Detección de Windows | Genérica | No | Sí | Sí, con parada si no es Windows |
| winget | Solo gh, sin banderas | No | Git y gh con banderas | Git y gh con banderas y plan B oficial |
| PATH / refresco | No | No | Sí, en una línea | Sí, con comando de refresco y ruta manual |
| Código de dispositivo | No dice dónde ve | Implícito | "Muéstralo" y `--clipboard` | Terminal o chat, nunca por correo; caduca; reintentos |
| Verificación de identidad | No | No | `gh api user --jq .login` | Sí, mostrada al usuario |
| UAC | No | No | "Muestra la ventana" (imposible) | Espera, dime el programa, comprueba el editor |
| Proceso en segundo plano | No | No | "Mantén abierta" | Segundo plano + sondeo; `Start-Process -NoExit` como plan B |

---

## P12 — Crear repositorio y desplegar en GitHub Pages

**Pegar en:** OpenCode, en el proyecto que vas a publicar; GitHub CLI ya autenticado.
**Qué cambia:** build local, revisión de secretos, `.gitignore`, visibilidad pública confirmada, elección de método de Pages, ruta base, espera, verificación HTTP real, sin Netlify/Vercel/Firebase sin permiso y confirmación antes de publicar.

```text
ROL: Ingeniero de despliegue cuidadoso en OpenCode. Idioma: español.
OBJETIVO: Publicar el proyecto de esta carpeta en GitHub Pages y entregarme una URL verificada. Todo lo público o irreversible requiere mi "sí" explícito.
CONTEXTO: Principiante en Windows. gh debería estar autenticado; si no, detente.

RECONOCIMIENTO (solo lectura): gh auth status; gh api user --jq .login; git status; git remote -v; package.json (framework y script build); vite.config.*; lista de archivos y tamaño total (un sitio de Pages admite hasta 1 GB, conviene mucho menos).

REVISIÓN PREVIA
1. Build local: si hay package.json, ejecuta npm ci (o npm install) y npm run build; debe existir la salida (dist/ u otra) con index.html. Si falla, repórtalo y detente.
2. Secretos: busca .env, claves, *.pem, cadenas como "api_key", "token", "ghp_", "sk-". Informa solo ruta y tipo, nunca el valor. Si hay hallazgos, detente.
3. .gitignore: node_modules, .env*, *.log, archivos del sistema; dist solo si se publica con Actions.
4. Ruta base: en un sitio de proyecto la URL es https://<usuario>.github.io/<repositorio>/. En Vite, base: '/<repositorio>/' (o por variable). Revisa rutas absolutas ("/img/...") que se romperán.

PLAN PARA MI APROBACIÓN (espera mi "sí")
Nombre del repositorio (minúsculas, sin espacios; verifica que no exista). Visibilidad: público (necesario en cuentas gratuitas; todo el contenido será visible). Archivos que se publicarán. Método: (a) sitio sin build: rama main, carpeta raíz, con .nojekyll si no es Jekyll; (b) con build: flujo oficial de GitHub Actions (puede pedir permiso para crear workflows: dímelo antes de aceptar) o rama gh-pages con el contenido de dist. URL esperada y riesgos. No elijas Netlify, Vercel ni Firebase.

EJECUCIÓN tras mi "sí"
git init si hace falta; commit con mensaje claro; gh repo create <repo> --public --source=. --push (sin --force); configura Pages (Configuración > Pages, o la API REST: confirma el comando en docs.github.com/rest/pages); si usas Actions, sigue el flujo con gh run list y gh run watch.

VERIFICACIÓN REAL
Reintenta cada 30 s hasta 10 min (el despliegue puede tardar): en PowerShell, curl.exe -s -o NUL -w "%{http_code}" <URL> o Invoke-WebRequest -UseBasicParsing. Exige 200; que el HTML contenga el título esperado; y que los .js, .css e imágenes enlazados respondan 200. Si la página sale en blanco o sin estilos, sospecha de la ruta base.

SI FALLA: diagnostica con el mensaje real (Pages sin activar, repositorio privado en plan gratuito, nombre existente, permisos, ruta base, caché) y corrige lo seguro; si necesita mi decisión, detente. Nada de push forzado ni de borrar repositorios o historial.
ENTREGA: URL verificada, nombre del repositorio, visibilidad, método, lista de comprobaciones con resultado (códigos HTTP) y pendientes. No me des el enlace hasta que haya respondido 200.
```

### P12-B — Actualizar la versión publicada (prompt adicional)

**Pegar en:** OpenCode, en el proyecto ya publicado. Rellena [CAMBIOS] y [URL_PUBLICA].
**Qué hace:** aplica cambios, hace commit y push solo con autorización, y verifica que el cambio se ve en la URL pública.

```text
ROL: Ingeniero de mantenimiento cuidadoso en OpenCode.
OBJETIVO: Aplicar los cambios que indico a un sitio YA publicado en GitHub Pages, publicarlos y verificar que se ven en la URL pública.
CAMBIOS SOLICITADOS (uno por línea; si algo es ambiguo, pregúntame antes): [CAMBIOS]
URL PÚBLICA: [URL_PUBLICA]

RECONOCIMIENTO (solo lectura): git status; git branch --show-current; git remote -v; git log -3 --oneline; gh repo view --json url,visibility. Si hay cambios locales sin guardar que no son tuyos, detente y pregúntame.
PLAN: lista los archivos que tocarás y qué cambiará; dime si afecta rutas, dependencias o datos.

AUTORIZACIONES
- Sin mi permiso explícito no puedes: hacer push, publicar, borrar archivos, reescribir historial, cambiar la visibilidad del repositorio, cambiar ajustes de Pages ni instalar dependencias nuevas.
- Haz push solo después de enseñarme el resumen (git diff --stat y los puntos clave) y recibir mi "sí".

EJECUCIÓN: trabaja en una rama (por ejemplo cambio-<tema>) o en main solo si yo lo autorizo. Cambios mínimos. Ejecuta npm run build y las pruebas disponibles. Revisa secretos en los archivos modificados (solo ruta y tipo). Commit claro. Tras mi "sí": git push (nunca --force).

VERIFICACIÓN: espera el despliegue (hasta 10 min; si hay Actions: gh run list y gh run watch). Comprueba que <URL_PUBLICA> responde 200, que contiene el texto o elemento cambiado (busca una frase concreta) y que no hay 404 en CSS o JS. Si parece caché, vuelve a comprobar con ?v=<fecha>.
SI ALGO SALE MAL: no borres nada. Propón revertir con "git revert" del commit y pide autorización antes de publicarlo. Informa la causa y el estado exacto.
ENTREGA: qué cambió (archivos), commits, resultado del build, estado del despliegue, evidencia (códigos HTTP y frase encontrada) y pendientes.
```

---

## P13 — Landing page Stilís (Estudiante 4)

**Autoría:** Estudiante 4. **No se reescribe el original**: ya tiene una buena estructura. Se ofrece un análisis y una **recreación didáctica** basada en su estructura, claramente distinta del texto original (que está íntegro en el archivo 01).

### Análisis de la estructura del original

| Bloque del original | Qué aporta | Qué se podría reforzar |
|---|---|---|
| Rol y entrega (director creativo, UX/UI y frontend) | Define la perspectiva y el nivel de calidad | Declarar la herramienta de destino y el entorno |
| Marca y dirección visual (escribir "Stilís", cercanía, rosa mexicano, orbe etéreo) | Identidad clara y límites éticos (sin imponer estándares de belleza) | Valores concretos (código de color, tipografía) y referencias |
| Estructura numerada en 8 secciones | Orden de conversión y textos clave | Indicar el propósito de cada sección y el CTA de cierre |
| Implementación (React, TypeScript, configuración centralizada, móvil primero, teclado, foco, contraste, movimiento reducido) | Buenas prácticas técnicas | Versiones, comando de build y estructura de carpetas |
| Reglas de honestidad (no inventar precios, testimonios, métricas, disponibilidad; "Detalles próximamente"; demo ilustrativa) | Evita contenido falso, es su mayor fortaleza | Convertir muchas negaciones en reglas positivas y agruparlas |
| Criterios de aceptación | Verificables | Añadir pruebas concretas (anchos, teclado) y formato de informe |
| Cierre (genera, ejecuta, prueba, corrige, informa) | Pide verificación real | Proteger archivos existentes y no publicar sin permiso |

### Recreación didáctica (basada en la estructura; NO es el texto de Estudiante 4)

**Pegar en:** OpenCode (carpeta vacía). Sustituye los campos [ENTRE CORCHETES].

```text
ROL: Director creativo, diseñador UX/UI y desarrollador frontend senior. Trabajas en OpenCode.
OBJETIVO: Crear la landing page de presentación, demostración y conversión de [NOMBRE_DE_LA_APP], una app de [QUÉ HACE]. Lema: "[LEMA]". El visitante debe entender su utilidad, explorar la demo y comparar planes antes de pedir acceso.
CONTEXTO: Principiante en Windows, modelo gratuito. Carpeta nueva.

RECONOCIMIENTO: comprueba node y npm; si la carpeta no está vacía, trabaja en una subcarpeta sin sobrescribir. Usa React y TypeScript con Vite; si no es posible, HTML, CSS y JavaScript con la misma estructura.

MARCA Y DISEÑO: escribe siempre "[NOMBRE_DE_LA_APP]" tal cual. Tono: [TONO]. Color de acento [COLOR_HEX], fondos claros, tipografía legible, espacios amplios. Detalles visuales inspirados en [ELEMENTO_VISUAL] sin inventar un logotipo oficial. Todo con variables de diseño.

ESTRUCTURA (propósito entre paréntesis)
1 Navegación (orientar; botón principal [TEXTO_BOTÓN]). 2 Portada (lema, propuesta de valor, CTA principal y secundario). 3 Cómo funciona en 3 pasos. 4 Funcionalidades [LISTA_DE_FUNCIONES] con beneficios concretos, sin garantizar resultados. 5 Demo interactiva con datos de ejemplo, rotulada "Demostración ilustrativa"; no simula conexión real con IA ni con datos del visitante. 6 Planes [NOMBRES_DE_PLANES] leídos de una configuración editable; donde falte información, "Detalles próximamente". 7 Preguntas frecuentes (qué es, carácter ilustrativo de la demo). 8 Cierre con invitación a pedir acceso; si no hay destino real, muestra un estado honesto y no confirmes registros que no se guardaron.

REGLAS DE CONTENIDO HONESTO (agrupadas)
Solo incluye datos que yo te di o contenido marcado como ejemplo. Prohibido inventar precios, límites por plan, testimonios, métricas, descuentos, alianzas, fechas, enlaces de descarga o políticas. No implementes cobros, autenticación ni servicios externos.

CALIDAD
Móvil primero; sin desbordes a 360, 768 y 1280 px; navegación por teclado, foco visible, contraste AA y prefers-reduced-motion; textos, planes y enlaces centralizados en src/content/site.ts; dependencias mínimas con versión exacta.

ERRORES: si algo falla, muestra el error real, corrige y repite; si depende de mí, detente.
ACEPTACIÓN: la primera pantalla explica qué es la app; la demo funciona; los [N] planes se muestran con la configuración editable; todos los botones tienen acción válida o un estado pendiente claro; npm run build termina sin errores.
VERIFICACIÓN: ejecuta el build, abre la página en el navegador, prueba navegación, demo y teclado, y revisa los tres anchos.
ENTREGA: qué funciona, qué datos o conexiones faltan para publicarla, y cómo verla en local. No publiques nada sin mi autorización.
```

---

## P14 — Prueba de Google Flow desde OpenCode

**Pegar en:** OpenCode (con navegador disponible). Opcional; puede consumir créditos.
**Qué cambia:** parada obligatoria para el inicio de sesión (la contraseña la escribe el usuario), guion y límites, sin cambios de cuenta ni planes, evidencia.

```text
ROL: Asistente que opera un navegador en OpenCode para una prueba de capacidad.
OBJETIVO: Generar un video corto de estilo cinematográfico sobre [TEMA] en Google Flow y reportar el resultado con evidencia.
CONTEXTO: Prueba educativa; puede gastar créditos; no es práctica oficial.

RECONOCIMIENTO: dime qué herramienta de navegador tienes y si puedes mantener la sesión abierta. Si no, detente.
PLAN
1. Abre el sitio oficial de Google Flow (dime la URL antes de entrar).
2. Si pide iniciar sesión, detente y avísame. Yo escribiré mi contraseña en la página de Google; tú no debes ver, pedir ni guardar credenciales. Continúa solo cuando yo diga "listo".
3. Propón un guion mínimo (3 escenas) y muéstrame el texto exacto que usarás; espera mi "sí".
4. Genera una sola vez; reintenta como máximo 2 veces si falla.
RESTRICCIONES: no aceptes planes de pago ni cambies de cuenta; no descargues ejecutables; no uses personas reales identificables ni marcas protegidas; no publiques el video.
ERRORES: si la interfaz cambió o hay bloqueo, descríbelo y detente; no inventes que funcionó.
ENTREGA: descripción del video, texto usado, créditos consumidos si se ven, dónde quedó el archivo o enlace, y problemas.
```

---

## P15 — "¿Qué me hace falta para desplegar?"

**Pegar en:** OpenCode, cuando el inicio de sesión o la publicación se atasque.
**Qué cambia:** diagnóstico estrictamente de solo lectura, sin acciones ni cambio de plataforma.

```text
ROL: Asistente de diagnóstico en OpenCode.
OBJETIVO: Decirme qué me falta para publicar este proyecto en GitHub Pages. Esta tarea es SOLO LECTURA: no instales, no cambies archivos, no crees repositorios, no inicies sesión.

RECONOCIMIENTO (solo comandos de lectura): git --version; gh --version; gh auth status; git status; git remote -v; node --version; contenido de package.json y vite.config.*; lista de archivos; presencia de .gitignore y de archivos .env (solo existencia, nunca su contenido).

ENTREGA
Tabla Requisito | ¿Lo tengo? | Evidencia: Git instalado; GitHub CLI instalado; sesión de GitHub iniciada; carpeta es un repositorio; repositorio remoto; build funciona (solo si ya hay node_modules; no lo ejecutes si implica instalar); ruta base de Vite; .gitignore; secretos posibles.
Después, UN solo siguiente paso recomendado, con el prompt adecuado.
Restricción: no propongas otra plataforma (Netlify, Vercel, Firebase) salvo que GitHub Pages sea imposible, y entonces solo como pregunta.
```

---

## P16 — Reconexión de un repositorio desde Claude Code

**Pegar en:** Claude Code (o Codex), tras conectar GitHub desde sus conexiones oficiales (el inicio de sesión se hace en la página oficial de GitHub, no escribiendo credenciales al agente).
**Qué cambia:** solo lectura primero, rama de trabajo, sin push, propuesta antes de actuar.

```text
ROL: Agente de código en Claude Code que se incorpora a un proyecto existente.
OBJETIVO: Conectarte en modo SOLO LECTURA al repositorio [USUARIO/REPOSITORIO] de mi cuenta de GitHub y seguir trabajando sobre él con mi aprobación.

RECONOCIMIENTO (solo lectura): clona o lee el repositorio; dime qué es el proyecto, su estructura, cómo se ejecuta, si hay README, pruebas y flujo de publicación; git log -5 --oneline; ramas existentes. Si no puedes acceder, dime qué falta (conexión de GitHub, permisos); no pidas credenciales.

PLAN: propón 3 mejoras pequeñas con archivos y riesgo; espera a que yo elija una.
EJECUCIÓN (solo tras mi elección): crea una rama nueva (por ejemplo mejora-<tema>) y haz cambios mínimos.
RESTRICCIONES: sin push, fusiones, borrados ni cambios de ajustes del repositorio sin autorización; no leas ni escribas secretos; no cambies la visibilidad.
VERIFICACIÓN: ejecuta build o pruebas si existen y comprueba en el navegador.
ENTREGA: resumen de cambios, evidencia y propuesta de commit (sin ejecutarla).
```
