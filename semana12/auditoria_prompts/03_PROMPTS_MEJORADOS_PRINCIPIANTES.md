# 03 — Prompts mejorados V1 "Mejorada y sencilla" (principiantes)

**Clase:** E1601.2, Semana 12 · **Elaborado:** 2026-11-22.
Cada prompt conserva la finalidad del original, está pensado para copiar y pegar, y busca ser breve (idealmente menos de 200 palabras). Las versiones avanzadas están en `04_PROMPTS_MEJORADOS_AVANZADOS.md`; los textos originales, en `01_INVENTARIO_PROMPTS_ORIGINALES.md`; los motivos de cada mejora, en `02_AUDITORIA_DE_PROMPTS.md`.

## Cómo usar estos prompts

1. Fíjate en la línea **"Pegar en"**: cada prompt indica la herramienta (OpenCode, Claude Code, ChatGPT o la consola de xAI). No los mezcles.
2. En OpenCode, abre una **sesión nueva** (signo "+") dentro de la carpeta de tu práctica.
3. Sustituye lo que esté entre [CORCHETES] por tus datos.
4. **Nunca escribas contraseñas, códigos ni tokens en el chat de un agente.** Los inicios de sesión se hacen solo en las páginas oficiales (por ejemplo https://github.com/login/device). El código de dispositivo de GitHub **no llega por correo**: aparece en la terminal o en el chat del agente.
5. Si Windows muestra una ventana de permisos con un nombre que no reconoces, **cancela y pregunta**.
6. Un prompt "oral" en la clase (P03, P04, P05, P08, P14, P15, P16) no tenía texto escrito; aquí se ofrece una versión escrita **nueva**, que no es un texto original recuperado.

---

## P01 — Abrir navegador desde OpenCode

**Pegar en:** OpenCode (sesión nueva, carpeta de práctica).
**Qué hace:** comprueba que el agente puede usar un navegador y te dice qué hizo.

```text
Abre un navegador y entra a https://example.com. Dime el título de la página y la primera frase que veas. Después busca información sobre [TEMA QUE QUIERAS] y dime el título del primer resultado.
No inicies sesión en ningún sitio, no descargues archivos y no escribas datos personales.
Si no puedes abrir un navegador, dime claramente qué falta y no finjas que lo hiciste.
```

---

## P02 — Calculadora de automatización

**Pegar en:** OpenCode (carpeta vacía de práctica).
**Qué hace:** crea una calculadora web con fórmulas visibles y supuestos editables.

```text
Crea una calculadora web sencilla (un solo archivo index.html, sin instalar nada) que estime el ahorro de automatizar un proceso con IA.

El usuario escribe: nombre del proceso, minutos por ejecución, veces por semana, número de personas, costo por hora, costo mensual de la herramienta e inversión inicial.

Calcula y muestra las fórmulas:
- horas por semana = minutos/60 × veces por semana × personas
- horas recuperables = horas por semana × % automatizable (editable, empieza en 50 %)
- ahorro mensual = horas recuperables × 4.33 × costo por hora
- beneficio neto mensual = ahorro − costo de la herramienta
- meses para recuperar la inversión = inversión ÷ beneficio neto mensual

Todos los supuestos deben ser editables y estar marcados como "estimación"; no inventes datos. Muestra el aviso: "Horas liberadas no son dinero ahorrado si no se reasignan o reducen costos."
Añade un gráfico simple "antes vs. después" y valida que no haya números negativos.
Al terminar, prueba con un ejemplo y dime el resultado.
```

---

## P03 — Publicación de la calculadora

**Pegar en:** OpenCode, en la misma sesión o carpeta donde está la calculadora. Requiere haber hecho antes P09 (GitHub conectado).
**Qué hace:** publica la página en GitHub Pages con tu confirmación.

```text
Quiero publicar esta carpeta como página web con GitHub Pages.
Primero revisa, sin cambiar nada: si ya es un repositorio Git, si "gh auth status" muestra mi sesión y si hay contraseñas o archivos .env.
Dime el plan en 3 líneas (nombre del repositorio y visibilidad; en cuentas gratuitas GitHub Pages necesita un repositorio público) y espera a que yo diga "sí".
Cuando lo autorice: crea el repositorio, sube los archivos, activa GitHub Pages y espera a que termine.
Dame el enlace solo si responde correctamente (código 200). Si falla, dime la causa.
```

---

## P04 — Coordinación OpenCode + Claude Code

**Pegar en:** primero Claude Code y luego OpenCode, ambos abiertos en la **misma carpeta**. (En clase solo el Profesor mostró Claude Code.)
**Qué hace:** evita que dos agentes se pisen: cada uno tiene un rol y se comunican con un archivo.

Prompt A, para Claude Code:

```text
Trabajaremos en esta carpeta con otro agente (OpenCode). Primero solo lee: lista los archivos, explícame qué hace el proyecto y revisa "git status". No cambies nada todavía.
Luego crea HANDOFF.md con: lo que entiendes del proyecto, lo que harás tú y lo que debe hacer el otro agente.
Antes de editar, crea una rama llamada claude-mejoras. Haz cambios pequeños y dime qué archivos tocaste.
No hagas push ni subas nada sin mi autorización.
```

Prompt B, para OpenCode:

```text
Lee HANDOFF.md y "git status". Tu rol es de apoyo: resuelve errores de comandos y prepara lo que pida HANDOFF.md, pero no edites los archivos que está cambiando el otro agente.
Trabaja en tu propia rama (opencode-apoyo) y anota en HANDOFF.md lo que hiciste.
No hagas push sin mi autorización.
```

---

## P05 — Mejora de la calculadora y subagentes

**Pegar en:** Claude Code (la carpeta de la calculadora).
**Qué hace:** mejora la calculadora en pasos seguros, con un subagente para el catálogo de procesos.

```text
Mejora mi calculadora (index.html) en pasos seguros. Antes de empezar, crea una rama y una copia de index.html.

1. Lanza un subagente que cree un catálogo de 30 procesos empresariales en catalogo.json (campos: id, sector, nombre, minutos típicos, % automatizable). Marca todo como "estimación" y no inventes fuentes ni datos reales.
2. Cuando termine, intégralo como selector de procesos sin romper los campos editables.
3. Mejora la claridad visual y añade una animación sutil que respete "reducir movimiento".
4. Abre la página, prueba con 2 procesos y dime qué comprobaste.

No hagas push ni publiques sin mi autorización.
```

---

## P06 — Landing page DENTEA

**Pegar en:** OpenCode (sesión nueva en una carpeta vacía).
**Qué hace:** crea la landing de una clínica dental, sin inicio de sesión en Google Flow ni datos inventados.

```text
Actúa como diseñador web y desarrollador frontend. Crea en esta carpeta una landing page responsive para DENTEA, una clínica dental moderna (estilo limpio: blanco, azul hielo, beige y azul profundo).

Secciones: portada, servicios, beneficios, la clínica, testimonios, preguntas frecuentes y botón "Agendar por WhatsApp".

Reglas:
- No inventes certificaciones, precios ni datos reales. Los testimonios deben decir "Ejemplo ficticio".
- El número de WhatsApp va en una variable al inicio (WHATSAPP_NUMBER), vacía. Si está vacía, el botón aparece desactivado con el aviso "Falta configurar el número".
- Usa imágenes de ejemplo o ilustraciones simples. No inicies sesión en ningún sitio ni me pidas contraseñas.
- Animaciones sutiles que respeten "reducir movimiento".

Al terminar, ábrela en el navegador, revisa escritorio y móvil, corrige errores y dime cómo verla. No publiques nada.
```

---

## P07 — Meta-prompting para landing pages

**Pegar en:** ChatGPT (no en OpenCode). Después copia **solo el prompt final** que te entregue y pégalo en OpenCode.
**Qué hace:** convierte tu idea en un prompt completo para tu propia landing.

```text
Ayúdame a escribir un prompt para que un agente de código (OpenCode) cree la landing page de mi negocio.

Antes de escribir el prompt, hazme hasta 5 preguntas cortas, una por una: nombre del negocio, a quién le vende, qué problema resuelve, qué ofrece y qué quiero que haga el visitante (por ejemplo, escribirme por WhatsApp).

Luego entrega SOLO el prompt final, listo para copiar, con: rol, objetivo, secciones de la página, estilo visual, reglas ("no inventes datos, precios ni testimonios; marca como ejemplo lo que falte"), cómo probarla y qué debe entregar al terminar.

Empieza con la primera pregunta.
```

---

## P08 — Agente de voz xAI

**Pegar en:** la consola de xAI, https://console.x.ai/ (creador de agentes de voz; demostración, no práctica oficial).
**Qué hace:** configura un agente de voz de atención al cliente honesto.

```text
Crea un agente de voz de atención al cliente para [NOMBRE DE LA EMPRESA]. Habla en español, con tono amable y respuestas breves. Empieza diciendo que eres un asistente de inteligencia artificial.
Solo responde sobre [TEMAS: por ejemplo, cursos y dudas generales]. Usa únicamente la información de [PÁGINA WEB OFICIAL]. Si no encuentras un dato (precio, horario, fechas), dilo y ofrece que una persona de la empresa responderá. No inventes precios ni promesas.
Si el cliente pide hablar con una persona o está molesto, ofrece derivarlo.
No pidas tarjetas, contraseñas ni datos sensibles.
```

---

## P09 — Instalación inicial de GitHub CLI

**Pegar en:** OpenCode (sesión nueva). Antes debes tener tu cuenta de GitHub creada en https://github.com/.
**Qué hace:** instala Git y GitHub CLI y deja tu sesión iniciada.

```text
Soy principiante y uso Windows. Quiero conectar GitHub con OpenCode.

1. Comprueba si tengo Git y GitHub CLI ("git --version" y "gh --version").
2. Si falta algo, instálalo con winget, por ejemplo: winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements. Si Windows pide permisos, dímelo y espera: yo comprobaré el nombre del editor antes de aceptar.
3. Si "gh" no se reconoce al terminar, usa una terminal nueva.
4. Ejecuta: gh auth login --web --git-protocol https
5. Escribe aquí el código que muestre la terminal y la dirección https://github.com/login/device. El código NO llega por correo. Dime qué botón pulsar.
6. Cuando yo diga "listo", ejecuta "gh auth status" y "gh api user --jq .login".

Nunca me pidas contraseñas ni tokens. No crees repositorios ni publiques nada. No digas que algo quedó listo sin comprobarlo.
```

---

## P10 — Regeneración del código de dispositivo

**Pegar en:** OpenCode, en la sesión donde falló el inicio de sesión de GitHub (P09).
**Qué hace:** pide un código nuevo y te dice dónde ponerlo.

```text
El código de GitHub caducó o no lo encuentro. Cancela el intento anterior de "gh auth login" y empieza uno nuevo con: gh auth login --web --git-protocol https
Escribe aquí el código nuevo y la dirección https://github.com/login/device. Si puedes, abre esa página en mi navegador; si no, dame el enlace. Dime paso a paso qué hacer.
Espera a que yo diga "listo" y comprueba con "gh auth status". No me pidas contraseñas.
```

---

## P11 — Instalación GitHub CLI reforzada

**Pegar en:** OpenCode (sesión nueva), en Windows. Sustituye a P09 si P09 se atascó.
**Qué hace:** instalación completa, inicio de sesión y verificación, sin subir ningún proyecto (eso es P12).

```text
Actúa como asistente técnico paciente. Uso Windows y soy principiante. Objetivo: dejar Git y GitHub CLI instalados y mi sesión de GitHub iniciada. En esta tarea no subas ni publiques ningún proyecto.

1. Detecta mi sistema y comprueba winget, git y gh.
2. Instala lo que falte con winget (--accept-package-agreements --accept-source-agreements). Si Windows pide permisos, avísame para que yo compruebe el editor antes de aceptar. Si "gh" no se reconoce después, usa una terminal nueva.
3. Ejecuta "gh auth login --web --git-protocol https". Muéstrame en el chat el código y https://github.com/login/device (el código NO llega por correo). Si el proceso se corta o el código caduca, repite. Si tu terminal no aguanta el proceso, abre una ventana de PowerShell visible con Start-Process -NoExit.
4. Cuando yo diga "listo": ejecuta "gh auth status", "gh auth setup-git" y "gh api user --jq .login".
5. Pregúntame mi nombre y correo antes de usar "git config"; no los inventes.

No pidas contraseñas ni tokens. Termina con una lista ✅ / ⏳ de lo que comprobaste.
```

---

## P12 — Crear repositorio y desplegar en GitHub Pages

**Pegar en:** OpenCode, en la sesión (o carpeta) donde está tu landing page. Requiere GitHub conectado (P09-P11).
**Qué hace:** publica tu página con revisión previa y te da el enlace solo si funciona.

```text
Quiero publicar la página de esta carpeta en GitHub Pages.
Antes de hacer nada, revisa y dime en pocas líneas: si hay contraseñas o archivos .env, si la página necesita "build" (por ejemplo Vite) y cómo se llamará el repositorio. En cuentas gratuitas el repositorio debe ser público: pídeme confirmación antes de crearlo.
Cuando yo diga "sí": crea el repositorio, súbelo, activa GitHub Pages y espera a que termine. Si usa Vite, configura la ruta base con el nombre del repositorio.
Dame el enlace solo después de comprobar que carga (código 200). Si algo falla, dime la causa.
No uses Netlify, Firebase ni Vercel sin preguntarme.
```

---

## P13 — Landing page Stilís (Estudiante 4)

**Nota:** el original es de Estudiante 4 y no se reescribe. Abajo hay una **recreación didáctica V1**, basada solo en su estructura; no es el texto original. La versión original completa está en el archivo 01 y un análisis más profundo en el archivo 04.

**Pegar en:** OpenCode (carpeta vacía).

```text
Crea una landing page responsive para [NOMBRE_DE_LA_APP], una app de [QUÉ HACE]. Lema: "[LEMA]".
Secciones: navegación, portada con dos botones, cómo funciona (3 pasos), funcionalidades, demo interactiva, planes, preguntas frecuentes y cierre.
Reglas de honestidad: no inventes precios, testimonios, métricas ni disponibilidad. Donde falten datos escribe "Detalles próximamente". La demo debe decir "Demostración ilustrativa" y no simular conexiones reales. Si no hay formulario real, muestra un estado honesto y no confirmes registros.
Diseño: móvil primero, color principal [COLOR], fondos claros, foco visible, buen contraste y sin animaciones si el usuario prefiere reducir movimiento.
Guarda textos y planes en un solo archivo editable.
Prueba en escritorio y móvil, corrige errores y dime qué funciona y qué datos faltan. No publiques nada.
```

---

## P14 — Prueba de Google Flow desde OpenCode

**Pegar en:** OpenCode (con navegador disponible). Opcional y puede consumir créditos de Flow.

```text
Abre el navegador, entra a Google Flow y genera un video corto de estilo cinematográfico sobre [TEMA].
Cuando pida iniciar sesión, detente y avísame: yo escribiré mi contraseña directamente en la página de Google; tú no debes verla ni guardarla.
Antes de generar, muéstrame el texto que usarás para describir el video y dime si usar la función gasta créditos.
Al terminar, dime dónde quedó el video.
```

---

## P15 — "¿Qué me hace falta para desplegar?"

**Pegar en:** OpenCode, cuando el inicio de sesión o la publicación se atasque.
**Qué hace:** pide un diagnóstico sin que el agente cambie nada ni elija otra plataforma.

```text
No ejecutes nada todavía. Dime en una lista corta qué me falta para publicar esta página en GitHub Pages (herramientas, sesión de GitHub, repositorio, configuración) y cuál es el siguiente paso.
No propongas otra plataforma ni cambies archivos.
```

---

## P16 — Reconexión de un repositorio desde Claude Code

**Pegar en:** Claude Code (o Codex), después de conectar GitHub desde sus conexiones oficiales.

```text
Conéctate en modo solo lectura al repositorio [USUARIO/REPOSITORIO] de mi cuenta de GitHub. Léelo y dime qué es el proyecto y cuáles son sus archivos principales.
No cambies nada ni hagas push. Después propón 3 mejoras pequeñas y espera a que yo elija una.
```
