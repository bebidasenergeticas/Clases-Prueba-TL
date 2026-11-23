# Investigación GitHub (Web + CLI en Windows) para el PDF 02

Agente D, investigador de GitHub. Producción y verificación técnica: **23/11/2026**. Clase de origen: domingo 22/11/2026, grupo E1601.2, profesor Kevin Daniel Martínez Orozco. Proyecto demo: restaurante ficticio Puerto A&M (**SIMULACIÓN ACADÉMICA**).

Convenciones de este documento:

- `[F#]` remite a la tabla de fuentes del final. **Todas las fuentes se consultaron el 23/11/2026** ("verificado 23/11/2026"); cada fila de la tabla lleva su URL.
- Etiquetas de contenido: EN CLASE · COMPLEMENTO DEL PROFESOR · ACTUALIZACIÓN EXTERNA · ACLARACIÓN TÉCNICA POSTERIOR · RECONSTRUCCIÓN PEDAGÓGICA · PENDIENTE DE COMPROBAR.
- No hay ninguna clave, token, código 2FA ni usuario real en este archivo. Los nombres de usuario, repositorios y URLs son **marcadores** (`USUARIO`, `puerto-am-demo`).
- Alumnos citados solo con códigos (Alumna E, Alumno F, etc.).

---

## 0. Resumen para el diseñador y el redactor

1. **Dos rutas independientes que convergen**: Ruta A (todo en el navegador) y Ruta B (Git + GitHub CLI en PowerShell). Ambas terminan en el mismo repositorio y en la misma publicación con GitHub Pages.
2. **Una cuenta gratuita basta** para repositorios públicos y para GitHub Pages [F16][F13]. En plan Free, GitHub Pages exige repositorio **público** [F16]. Si un repositorio Free pasa de público a privado, el sitio Pages se **despublica** [F14]. No se afirma ningún precio.
3. **GitHub Pages solo sirve archivos estáticos** (HTML, CSS, JavaScript) y **no admite lenguajes de servidor como PHP, Ruby o Python** [F16][F19]. Por tanto no ejecuta FastAPI y no puede guardar una clave de OpenRouter: todo lo que viaje en el JavaScript del sitio lo puede leer cualquier visitante.
4. **El sitio Pages es público en Internet aunque el repositorio sea privado** (si el plan lo permite) [F16][F17]. La publicación privada de Pages es una función de GitHub Enterprise Cloud [F22]. Para alumnos con cuenta gratuita: **no publicar datos reales de un negocio**.
5. **Eliminar el repositorio no deshace una exposición** de secretos o datos. Primero se revoca o rota el secreto [F24][F25][F23]; los forks de un repositorio público no se borran con él [F15].
6. **No se pudo hacer** (ver sección 11): login real, creación real de repo/Pages, instalación en Windows, captura de `github.com/signup` y de `git-scm.com` (el entorno bloquea esos hosts). Lo que sí se probó está en `evidencias_qa/github_pruebas.md`.

---

## 1. Vocabulario mínimo (para un adulto sin programación)

| Término | Qué es (en palabras sencillas) | Fuente |
|---|---|---|
| **Git** | Programa que corre en tu computadora y guarda el historial de cambios de tus archivos. Es lo que hace "local". | [F28] |
| **GitHub** | Sitio web donde se guardan repositorios en Internet. No es lo mismo que Git. | [F28][F13] |
| **GitHub CLI (`gh`)** | Programa de línea de comandos para hacer desde la terminal cosas de GitHub (crear repos, iniciar sesión). | [F39] |
| **Repositorio (repo)** | Carpeta de proyecto con todos sus archivos y el historial de cada archivo. Puede ser público o privado. | [F13] |
| **Branch (rama)** | Versión paralela del código dentro del mismo repo; `main` es la principal por defecto. | [F13][F33] |
| **Commit** | "Fotografía guardada" de los cambios, con un mensaje corto que los describe. | [F11] |
| **Remote / `origin`** | El repositorio que está en GitHub (no en tu compu); `origin` es el nombre habitual. | [F13][F32] |
| **Clone / Fork / Pull request** | Copiar un repo a tu compu / copia propia de un repo ajeno / propuesta de unir cambios de una rama a otra. | [F13] |
| **GitHub Pages** | Servicio de GitHub que toma archivos HTML/CSS/JS de un repo y los publica como sitio web. | [F19] |
| **Terminal / PowerShell** | Ventana donde se escriben comandos. PowerShell es la de Windows. | RECONSTRUCCIÓN PEDAGÓGICA |
| **PATH** | Lista de carpetas donde Windows busca los programas cuando escribes su nombre. Si `gh` no está en el PATH, aparece "no se reconoce como comando". | [F47][F50] |
| **`localhost`** | Dirección que significa "esta misma computadora"; solo tú la ves. Una URL `github.io` la ve cualquiera. | EN CLASE (explicado por el profesor) |

---

## 2. Ruta A: GitHub por la web (sin terminal)

> Las pantallas con sesión **no se capturaron** (no se entra a ninguna cuenta). El diseñador debe hacer **esquemas rotulados** ("Ilustración esquemática; la interfaz puede variar"). Los nombres de campos y botones de abajo salen de la documentación vigente.

### A1. Crear la cuenta

1. Abrir `https://github.com/signup` [F1]. Alternativa: **Continue with Google** (los proveedores sociales compatibles son Google y Apple) [F1].
2. Seguir las indicaciones para crear la cuenta personal. Durante el registro se pide **verificar el correo** [F1].
3. Si aparece `This email can't be used` o `We couldn't create your account`: probar otro navegador o limpiar cookies, desactivar extensiones, otro dispositivo o red, esperar un rato; o usar otro correo. La documentación advierte que **GitHub Support no puede investigar fallos individuales de verificación en el registro** [F1].
4. Cuidado con enlaces: escribir `github.com` a mano, no entrar por anuncios ni mensajes (RECONSTRUCCIÓN PEDAGÓGICA; la guía de prevención no se verificó en una página concreta de GitHub: PENDIENTE DE COMPROBAR si se quiere citar).

### A2. Verificar el correo

- Si no llegó el correo de verificación: arriba a la derecha clic en la **foto de perfil → Settings → Emails** (sección *Access*) → bajo el correo, **Resend verification email**; el correo trae un enlace que lleva al panel y muestra un aviso de confirmación [F2].
- Nota de Pages: si se publica desde una rama, el sitio puede no construirse si quien hizo el push **no verificó su correo** [F17][F20].

### A3. Activar 2FA (verificación en dos pasos) y guardar los códigos de recuperación

Ruta en pantalla [F5]: foto de perfil → **Settings** → **Password and authentication** (sección *Access*) → en *Two-factor authentication* clic **Enable two-factor authentication**.

Métodos (la documentación recomienda una app TOTP sobre SMS) [F5]:

1. **App autenticadora (TOTP)**: instalar cualquier app TOTP; bajo *Scan the QR code* escanear el QR (o **setup key** si no se puede escanear); escribir el código de 6 dígitos en *Verify the code from the app*.
2. **SMS**: existe, pero GitHub lo desaconseja (se puede interceptar, entrega poco fiable, no disponible en todos los países) [F5].
3. **Llave de seguridad, passkey y GitHub Mobile** como métodos adicionales (requieren tener ya TOTP o SMS) [F5][F4].

**Códigos de recuperación** [F5][F6]:

- En *Save your recovery codes* clic **Download**; guardarlos en un lugar seguro (se recomienda un gestor de contraseñas) y luego **I have saved my recovery codes**. El archivo por defecto se llama `github-recovery-codes.txt` [F8].
- Son **16 códigos de un solo uso**; al agotarlos se puede **Generate new recovery codes** (invalida los anteriores) [F6].
- Para verlos de nuevo: Settings → Password and authentication → *Recovery codes* → **View** [F6].
- **Nunca** compartirlos ni pegarlos en chats, en un prompt ni en un repositorio [F6].
- **Advertencia crítica**: con 2FA activado, si se pierden las credenciales 2FA y los métodos de recuperación, **GitHub Support no puede restaurar el acceso** [F4][F8]. Recomendación oficial: configurar dos o más métodos [F6].
- Tras activar 2FA hay un **periodo de revisión de 28 días**; se sale de él haciendo 2FA con éxito en ese plazo [F5][F7].
- **Dato de contexto**: desde marzo de 2023 GitHub exigió 2FA a los usuarios que contribuyen código en GitHub.com en grupos escalonados; quien no recibió aviso no estaba obligado, aunque se recomienda [F4][F5].

**Si no se activa 2FA**, GitHub puede pedir una **verificación de dispositivo**: al iniciar sesión desde un dispositivo no reconocido llega un código al correo (vale **una hora**) o una solicitud a GitHub Mobile; con 2FA activo o con passkey no se pide [F3].

### A4. Crear un repositorio (botón **New repository**)

Ruta [F9]: arriba a la derecha, el botón **+** → **New repository** (también `https://github.com/new`). Campos que ve el alumno:

| Campo/botón | Qué poner en la práctica | Fuente |
|---|---|---|
| **Owner** (desplegable) | Tu cuenta personal | [F9] |
| **Repository name** | `puerto-am-demo` (solo letras ASCII, dígitos y `.` `-` `_`; máximo 100 caracteres) | [F9] |
| **Description** (opcional) | "Demo estática Puerto A&M (simulación académica)" | [F9] |
| **Visibility**: Public / Private | Para Pages en cuenta Free: **Public**. Un repo público lo ve cualquiera | [F9][F13][F16] |
| **Add README** (interruptor) | **On** para el primer repo web | [F16][F9] |
| **Add .gitignore** (opcional) | Útil si habrá proyecto local; los repos que se subirán desde terminal **no** deben crearse con README/license/.gitignore para evitar conflictos [F33] | [F9][F33] |
| **Add license** (opcional) | No necesaria en la práctica | [F9] |
| **Create repository** | Botón final | [F9] |

Si el nombre **ya existe** en tu cuenta, la web no deja crearlo: elegir otro (por ejemplo `puerto-am-demo-2`). Texto exacto del aviso: PENDIENTE DE COMPROBAR.

Para un sitio de usuario (no recomendado para la práctica) el repo debe llamarse `USUARIO.github.io` en minúsculas [F16]. Para un **sitio de proyecto** (nuestro caso) la URL es `https://USUARIO.github.io/NOMBRE-DEL-REPO` [F19].

### A5. Subir archivos, crear y editar desde el navegador

**Subir archivos** [F10]: página principal del repo → **Add file** → **Upload files** (o arrastrar y soltar). Límites: **25 MiB por archivo** desde el navegador y **hasta 100 archivos a la vez**; por terminal hasta 100 MiB por archivo [F10]. Escribir el mensaje en *Commit message* y elegir rama; clic **Commit changes** o **Propose changes**.

**Crear archivo** [F11]: **Add file → Create new file**; escribir nombre con extensión (con `/` se crean carpetas, por ejemplo `assets/logo.svg`); escribir contenido; botón **Commit changes...**; mensaje; rama; confirmar.

**Editar** [F12]: abrir el archivo → ícono de lápiz (editor) → modificar → **Preview** → **Commit changes...**.

**Commit directo vs rama nueva**: la documentación recomienda que, si la rama actual es la predeterminada, se elija **rama nueva y pull request** [F10][F11][F12]. Para un repo personal de práctica el formulario también permite confirmar directamente en la rama actual; es lo más simple. Es una decisión didáctica del PDF (COMPLEMENTO).

**Secretos**: GitHub puede bloquear subir un archivo que contenga un token compatible (push protection para cargas web, en vista previa pública) [F10][F26]. **No** subir `.env` ni claves nunca [F10][F11].

**README** [F13][F16]: es el archivo de presentación del repo. Además, GitHub Pages usa `index.html`, `index.md` o `README.md` como página de entrada, siempre en la raíz de la carpeta fuente [F16]. El nombre `index.html` distingue mayúsculas: `Index.html` o `index.HTML` **no** funcionan [F20].

### A6. Publicar con GitHub Pages

Ruta [F16][F17] (cuenta con permisos de admin del repo):

1. Repo → pestaña **Settings** (si no se ve, el menú desplegable `...` de las pestañas) → barra lateral, sección **Code, planning, and automation** → **Pages**.
2. Bajo **Build and deployment** → **Source** → elegir **Deploy from a branch**.
3. Usar el desplegable de **rama** (normalmente `main`) y el de **carpeta** (`/ (root)` o `/docs`) → **Save** [F17].
4. Esperar: la documentación dice que puede tardar **hasta 10 minutos** tras el push; si en **una hora** no se ve, revisar errores de construcción [F16][F17].
5. Volver a **Settings → Pages** y clic en **Visit site** [F16]. La URL del sitio de proyecto es `https://USUARIO.github.io/NOMBRE-DEL-REPO` [F19].

Opción alternativa **GitHub Actions** como fuente: en *Source* elegir **GitHub Actions** y usar una plantilla de flujo (necesario para generadores de sitios que no son Jekyll o para repos con enlaces simbólicos) [F17]. Para la práctica se usa "Deploy from a branch".

Detalles útiles:

- Con "Deploy from a branch" GitHub usa Jekyll por defecto; para HTML plano funciona, y para evitar el proceso Jekyll se puede crear un archivo vacío `.nojekyll` en la raíz de la fuente [F16].
- Cada publicación se despliega con un flujo de GitHub Actions; para ver errores: pestaña **Actions** del repo → abrir la ejecución → ver el resumen [F17][F57]. Si falla la construcción llega un **correo** al correo principal [F58].
- Los *commits* hechos por un flujo con `GITHUB_TOKEN` **no** disparan una construcción de Pages [F16][F17].
- Si cambias de público a privado o viceversa, la URL cambia y los enlaces se rompen hasta reconstruir [F20].

### A7. Distinguir `github.io/usuario/repositorio` de `localhost`

| Dirección | Quién la ve | Dónde corre |
|---|---|---|
| `http://localhost:8000` (o `127.0.0.1`) | Solo tu computadora, mientras el programa esté encendido | Tu PC (EN CLASE: el profesor insistió en que `localhost` no es Internet) |
| `https://USUARIO.github.io/REPO` | Cualquier persona con el enlace | Servidores de GitHub Pages (estático) |
| `https://*.vercel.app` | Cualquiera con el enlace (según configuración) | Plataforma Vercel [F52] |

Los sitios `github.io` creados después del 15/06/2016 se sirven por HTTPS automáticamente [F59].

### A8. Actualizar el sitio desde la web

Editar o subir el archivo → **Commit changes**; GitHub Pages reconstruye y publica (puede tardar hasta 10 minutos) [F16]. Después refrescar con Ctrl+F5 (caché del navegador: COMPLEMENTO, no verificado en doc).

### A9. Dejar de publicar (despublicar) y eliminar

- **Despublicar sitio** (no borra el repo): en la tarjeta de Pages, junto a "Your site is live at", el menú `...` → **Unpublish site**; el repo y sus ajustes no se alteran [F21].
- **Volver a privado** en cuenta Free despublica automáticamente Pages [F14].
- **Eliminar repo**: Settings → *General* → *Danger Zone* → **Delete this repository** → confirmar escribiendo el nombre [F15]. Ver sección 6: **no equivale a "deshacer" una exposición**.

---

## 3. Ruta B: Git + GitHub CLI en Windows (PowerShell)

> No se pudo probar en Windows. Las instalaciones y comandos se verificaron contra documentación oficial; el comportamiento exacto de pantallas de instalador y PowerShell es **PENDIENTE DE COMPROBAR en Windows 11 real**. La parte de Git y `.gitignore` sí se probó en Linux (ver evidencias).

### B0. Qué instalar y por qué

| Programa | Para qué | Instalación |
|---|---|---|
| **Git** | Control de versiones local (`git init`, `git commit`) | Instalador oficial desde git-scm.com [F28] (página no verificada: ver sección 11) o `winget` |
| **GitHub CLI (`gh`)** | Iniciar sesión y crear repos desde la terminal | `winget` o MSI [F47][F48] |

Git for Windows incluye el **Git Credential Manager** que guarda credenciales en el Administrador de credenciales de Windows [F31]; se recomienda siempre la versión más reciente y **mínimo 2.29** (primera con OAuth para GitHub) [F31].

### B1. Abrir PowerShell

Menú Inicio → escribir `PowerShell` → abrir **Windows PowerShell** o **Terminal**. (Pasos de interfaz de Windows: RECONSTRUCCIÓN PEDAGÓGICA.)

### B2. Instalar Git

Opción recomendada para alumnos: **instalador oficial de Git for Windows** (sitio oficial git-scm.com → Download for Windows). [F28]

Opción con `winget`: el identificador del paquete es **`Git.Git`** (existe en el repositorio oficial `microsoft/winget-pkgs`) [F56]. Comando sugerido: `winget install --id Git.Git -e --source winget`. **El formato exacto de flags no se pudo contrastar con la documentación de Microsoft (sitio bloqueado en este entorno): PENDIENTE DE COMPROBAR.**

Durante el instalador, la pantalla **"Adjusting your PATH environment"** ("How would you like to use Git from the command line?") ofrece tres opciones; la **marcada como (Recommended)** es **"Git from the command line and also from 3rd-party software"**: añade solo unos mínimos envoltorios al PATH y permite usar Git desde Git Bash, el Símbolo del sistema y PowerShell, y desde programas de terceros [F50]. La opción "Use Git from Git Bash only" **no modifica el PATH** y solo funciona dentro de Git Bash [F50] (por eso `git` "no se reconoce" en PowerShell si se eligió esa).

Otra pantalla (nombre de la rama inicial): "Let Git decide" o "Override the default branch name for new repositories" (por ejemplo `main`) [F50]. Si no cambia, Git usa su nombre por defecto; la documentación de GitHub indica que `git init` crea `main` por defecto y se puede forzar con `git init -b main` (Git 2.28 o posterior) [F33].

### B3. Instalar GitHub CLI

```powershell
winget install --id GitHub.cli --source winget
```
[F47] (documentación oficial del repositorio `cli/cli`: "Recommended (Official): WinGet"). Actualizar: `winget upgrade --id GitHub.cli --source winget` [F47]. Alternativa: instalador **MSI** de la página de descargas de cli.github.com / releases (binarios `exe` y `msi` para 386, amd64 y arm64) [F47][F48].

**Importante (PATH):** "The Windows installer modifies your PATH. When using Windows Terminal, you will need to **open a new window** for the changes to take effect. Simply opening a new tab will not be sufficient." [F47] Es decir: **cerrar y abrir PowerShell/Terminal** después de instalar. Lo mismo aplica a un terminal ya abierto dentro de OpenCode/VS Code (RECONSTRUCCIÓN PEDAGÓGICA).

Paquetes comunitarios (Chocolatey, Scoop, Conda) existen pero **no los mantiene el equipo de gh** y no se recomiendan en la guía [F47].

### B4. Comprobar la instalación

```powershell
git --version
gh --version
```
Resultado esperado (ejemplo del contenedor de pruebas, no de Windows): `git version 2.43.0`, `gh version 2.89.0 (2026-03-26)`. En la fecha de este documento la versión de `gh` del contenedor era anterior a la del manual en línea (ver sección 11), por lo que en la guía **no** se muestran números de versión fijos.

Si PowerShell dice que el comando no se reconoce: ver tabla de errores (E1). Comprobaciones útiles de Windows: `Get-Command git`, `Get-Command gh` y `where.exe gh` (cmdlets estándar de PowerShell; PENDIENTE DE COMPROBAR en Windows real).

### B5. Configurar tu identidad en Git (una sola vez)

```powershell
git config --global user.name "Nombre Apellido"
git config --global user.email "correo@ejemplo.com"
git config --global user.name
git config --global user.email
```
[F29][F30] El nombre de Git **no es lo mismo** que el usuario de GitHub y puede ser cualquier texto [F29]. Para el correo se puede usar el correo `noreply` que ofrece GitHub (Settings → Emails → *Keep my email addresses private*) [F30]. Sin esto, el primer `git commit` falla con `Author identity unknown` (reproducido, ver evidencias).

### B6. Iniciar sesión: `gh auth login`

```powershell
gh auth login
```
[F39][F40][F42] Flujo (EN CLASE: el profesor mencionó códigos de autenticación y que OpenCode revisó si "GitHub CLI está disponible"):

1. Elegir **GitHub.com** cuando pregunte dónde usas GitHub [F39][F40].
2. Elegir protocolo **HTTPS** para Git y responder **Y** a "authenticate Git with your GitHub credentials" para que `gh` guarde las credenciales y funcione `git push` sin otro gestor [F31][F39][F40]. (La redacción exacta de las preguntas se muestra en inglés; PENDIENTE DE COMPROBAR el orden en la versión vigente.)
3. El modo predeterminado es **iniciar sesión en el navegador** (flujo web) y el token se guarda en el almacén seguro del sistema; si no hay almacén, `gh` cae a un archivo de texto plano (`gh auth status` indica dónde) [F42].
4. `gh` muestra un **código de un solo uso** y pide pulsar **Enter** para abrir el navegador: el código de la CLI es de **8 caracteres con un guion** (formato `XXXX-XXXX`) y la página es `https://github.com/login/device` [F37][F49]. El código **caduca**: por defecto **900 segundos (15 minutos)** en el flujo de dispositivo [F37].
5. En el navegador: iniciar sesión en GitHub (si tienes 2FA, completar el segundo factor), pegar el código y **autorizar**. Volver a la terminal.
6. Variante con copia automática del código: `gh auth login --web --clipboard` [F42].
7. Si el navegador no se abre solo, `gh` avisa "Failed opening a web browser ... Please try entering the URL in your browser manually" [F49]: abrir a mano `https://github.com/login/device` y escribir el código.

**Qué códigos hay en GitHub y cuál es cuál** (RECONSTRUCCIÓN PEDAGÓGICA a partir de la duda de la Alumna E en clase, ~03:10, que mencionó un código enviado a su dispositivo al entrar a GitHub y que no lo vio en la herramienta de código):

| Código | Cuándo aparece | Dónde se escribe | Caduca | Fuente |
|---|---|---|---|---|
| Código de **app TOTP** (6 dígitos) | Tras escribir contraseña si tienes 2FA | Navegador, en GitHub | Cambia cada pocos segundos | [F5][F7] |
| **Código de recuperación 2FA** | Solo si perdiste el segundo factor | Navegador, "More options → 2FA recovery code" | Un solo uso | [F6][F8] |
| **Código de verificación de dispositivo** | Sin 2FA, en dispositivo nuevo | Navegador; llega al correo | 1 hora | [F3] |
| **Código de un solo uso de `gh`** (`XXXX-XXXX`) | Al ejecutar `gh auth login` por navegador | `https://github.com/login/device` | ~15 min (flujo de dispositivo) | [F37][F49] |
| Aprobación en **GitHub Mobile** (a veces con número de 2 dígitos) | Si lo configuraste | App del celular | n/d | [F7] |

Regla: **nunca** pegar estos códigos ni ningún token en un chat, prompt o repositorio.

Alternativa sin navegador (solo si hace falta, para scripts): `--with-token` lee un **personal access token** por entrada estándar; el mínimo documentado es `repo`, `read:org` y `gist` (token clásico) [F42]. GitHub recomienda tokens *fine-grained* y con caducidad cuando sea posible [F23][F38]. En la guía para principiantes **no se recomienda** esta vía; si se usa, el token se escribe directamente en la terminal local, jamás en un chat.

### B7. Comprobar la sesión

```powershell
gh auth status
```
Muestra la cuenta activa y el estado de la autenticación por host; si hay un problema de autenticación **termina con código de salida 1** [F43]. Sin sesión, en el contenedor de pruebas respondió: "You are not logged into any GitHub hosts. To log in, run: gh auth login" (salida 1; ver evidencias). **No** usar `--show-token` en pantallas compartidas ni en capturas (muestra el token en claro) [F43].

### B8. Conectar Git con la sesión de `gh` (si hace falta)

```powershell
gh auth setup-git
```
Configura Git para usar GitHub CLI como *credential helper* en todos los hosts autenticados; si no hay hosts autenticados **falla con un error** [F44]. Normalmente `gh auth login` con HTTPS y "Y" ya lo deja listo; `setup-git` sirve para repararlo [F40]. Se puede limitar a un host: `gh auth setup-git --hostname github.com` [F40][F44].

### B9. De proyecto local a repositorio en GitHub

Carpeta del proyecto (ejemplo de ruta; sustituir): `C:\Users\TU_USUARIO\Documents\puerto-am-demo`.

```powershell
cd C:\Users\TU_USUARIO\Documents\puerto-am-demo
git init -b main
```
[F33] (`-b` requiere Git 2.28 o posterior; en versiones anteriores `git init` y luego `git symbolic-ref HEAD refs/heads/main`).

**Antes del primer `git add`: crear `.gitignore` con `.env`** (probado en evidencias):

```gitignore
.env
.env.*
!.env.example
__pycache__/
*.pyc
node_modules/
```
`.gitignore` en la raíz le dice a Git qué archivos no versionar [F27]. **Si un archivo ya se había commiteado, agregarlo después a `.gitignore` no lo "des-sube"**: hay que dejar de rastrearlo con `git rm --cached ARCHIVO` [F27] y, si era un secreto, revocarlo (probado en evidencias).

```powershell
git status
git add .
git commit -m "Primer commit: sitio estatico de demostracion"
gh repo create puerto-am-demo --public --source=. --remote=origin --push
gh repo view --web
```

Verificación de cada pieza contra el manual [F41][F45][F33]:

- `gh repo create NOMBRE --public --source=. --remote=origin --push`: con nombre y una bandera de visibilidad (`--public`, `--private` o `--internal`) se crea el repo **sin preguntas**; `--source` indica el repositorio local de origen (por defecto el nombre del repo remoto es el de la carpeta); `--remote` fija el nombre del remoto; `--push` sube los **commits locales** al repo nuevo [F41][F33]. Ejemplo oficial del manual: `gh repo create my-project --private --source=. --remote=upstream` [F41]. Si se omite `OWNER/`, se usa tu cuenta [F41].
- **Prerrequisitos**: sesión iniciada (`gh auth login`) y al menos un commit. Sin sesión se probó: `To get started with GitHub CLI, please run: gh auth login` (salida 4). Comportamiento de `--push` sin commits: PENDIENTE DE COMPROBAR.
- `--private`: en cuenta gratuita **un repo privado no puede publicar Pages** [F16][F14].
- `gh repo view --web` abre el repo en el navegador; sin `--web` imprime descripción y README; sin argumento usa el repo de la carpeta actual [F45][F39].
- Alternativa interactiva: `gh repo create` sin argumentos y elegir "Push an existing local repository to GitHub" [F33].
- **Alternativa solo con Git** (sin `gh repo create`): crear el repo vacío en la web **sin README/license/.gitignore**, copiar la URL y ejecutar `git remote add origin URL` y `git push -u origin main` [F33][F32].

### B10. Publicar en Pages desde la terminal

Lo más simple para principiantes: **Settings → Pages** en la web (sección A6). Opción por línea de comandos con la API REST:

```powershell
gh api --method POST repos/USUARIO/puerto-am-demo/pages -f "source[branch]=main" -f "source[path]=/"
```
- El endpoint "Create a GitHub Pages site" existe; exige admin del repo y, para tokens clásicos, el alcance `repo`; parámetros: `source.branch` (obligatorio) y `source.path` (`/` o `/docs`, por defecto `/`); respuestas `201`, `409` y `422` [F51].
- `gh api` admite `--method` y campos `-f key=value`; los parámetros anidados se escriben `key[subkey]=value` [F46].
- **Esta combinación exacta no se ejecutó** (no hay sesión): PENDIENTE DE COMPROBAR. En PowerShell las comillas dobles alrededor de `source[branch]=main` evitan que los corchetes se interpreten (COMPLEMENTO, no verificado).

### B11. Actualizar el sitio

```powershell
git add .
git commit -m "Actualiza menu"
git push
```
[F33] `git push` sin argumentos funciona si la rama ya tiene seguimiento (tras `gh repo create --push` o `git push -u origin main`); el primer push con `-u origin main` lo deja configurado [F33].

### B12. Rutas alternativas (alumno sin CLI o cuya herramienta no abre terminal)

1. **Ruta A completa por web** (sección 2): subir archivos con **Upload files** y publicar en Settings → Pages. No requiere instalar nada.
2. **GitHub Desktop**: aplicación gráfica que sustituye la línea de comandos para añadir un repositorio local a GitHub [F28][F33]. (Instalación y pantallas: PENDIENTE DE COMPROBAR; no se investigó a fondo.)
3. **Pedir a la herramienta de IA** (OpenCode/Claude Code) que ejecute los comandos, **pero el login lo hace siempre la persona** en su navegador (código de un solo uso). EN CLASE: el prompt del profesor fue "Crea un nuevo repositorio en GitHub y despliega en una page pública" (chat ~01:32 y ~02:24); la herramienta revisó si GitHub CLI estaba disponible. **Prompt mejorado sugerido (PROMPT MEJORADO)**:
   > "Revisa si git y gh están instalados (`git --version`, `gh --version`) y dime el resultado. Si `gh auth status` indica que no hay sesión, **detente** y dime que yo iniciaré sesión. Mi carpeta es una versión **estática y sin claves** (no hay `.env` ni archivos de datos reales). Crea `.gitignore` con `.env`, haz el primer commit y crea el repositorio público `puerto-am-demo` con `gh repo create`. No me pidas pegar tokens en el chat. Después dime cómo activar Pages en Settings → Pages."

---

## 4. Esquemas rotulados que debe dibujar el diseñador (pantallas con sesión: NO capturadas)

Cada esquema debe llevar el rótulo "Ilustración esquemática; la interfaz puede variar" y **sin** datos personales ni claves.

| # | Esquema | Elementos a rotular (según documentación vigente) | Fuente |
|---|---|---|---|
| S1 | Crear cuenta (`/signup`) | Campo de correo, contraseña, nombre de usuario, botón *Continue with Google*, verificación por correo | [F1] |
| S2 | Menú de perfil → Settings | Foto de perfil (arriba a la derecha) → *Settings* → barra lateral *Access*: *Emails*, *Password and authentication* | [F2][F5] |
| S3 | 2FA | *Enable two-factor authentication* → QR / *setup key* → campo "Verify the code from the app" → *Save your recovery codes* (Download) → *I have saved my recovery codes* | [F5] |
| S4 | New repository | Owner, Repository name, Description, Public/Private, Add README, Add .gitignore, Add license, *Create repository* | [F9] |
| S5 | Página del repo | Pestañas (Code, Issues, Pull requests, Actions, Settings), menú *Add file* → *Upload files* / *Create new file*, lista de archivos | [F10][F11] |
| S6 | Commit en la web | Cuadro *Commit message*, opción "current branch / new branch", botones *Commit changes* / *Propose changes* | [F10][F11][F12] |
| S7 | Settings → Pages | Barra lateral *Code, planning, and automation → Pages*; *Build and deployment → Source: Deploy from a branch*; desplegables de rama y carpeta; *Save*; *Visit site* | [F16][F17] |
| S8 | Pestaña Actions | Lista de ejecuciones del flujo de Pages; punto verde/rojo | [F17][F57] |
| S9 | Terminal PowerShell (esquema de texto) | `git --version`, `gh --version`, `gh auth login` con código `XXXX-XXXX` (**falso, ejemplo**), `gh auth status` | [F42][F49] |
| S10 | Pantalla de dispositivo `github.com/login/device` | Campo para el código de 8 caracteres; botón *Continue*; pantalla de autorización | [F37] |
| S11 | Instalador de Git: PATH | Tres opciones; la recomendada = "Git from the command line and also from 3rd-party software" | [F50] |

**Capturas reales obtenidas** (páginas públicas sin sesión, Playwright 1280x800 @2x) en `recursos_visuales/capturas/`:

- `github_cli_home.png` (cli.github.com)
- `github_cli_manual_gh_repo_create.png`
- `github_cli_manual_gh_auth_login.png`
- `github_docs_pages_creating_site.png`
- `github_docs_pages_publishing_source.png`
- `github_docs_pages_limits.png`
- `github_docs_2fa_configurar.png`

No obtenidas: `github.com/signup` (el entorno devolvió una página de bloqueo, descartada) y `git-scm.com/download/win` (host bloqueado). Se sustituyen por los esquemas S1 y S11.

---

## 5. Tabla de errores: error → causa probable → prueba → reparación

Cada fila: [F#] fuente documental; "PROBADO" = reproducido en `evidencias_qa/github_pruebas.md`.

| # | Error / síntoma | Causa probable | Prueba | Reparación | Fuente |
|---|---|---|---|---|---|
| E1 | PowerShell: `gh` o `git` "no se reconoce como nombre de un cmdlet..." | El programa no está en el **PATH** o la terminal se abrió antes de instalar | Cerrar y abrir PowerShell; `gh --version` / `git --version`; `Get-Command gh` | **Abrir una ventana nueva** (una pestaña nueva no basta) [F47]; en el instalador de Git elegir la opción recomendada de PATH [F50]; reinstalar con winget o MSI | [F47][F50] |
| E2 | Nombre de repositorio **ocupado** | Ya tienes un repo con ese nombre en tu cuenta (o el nombre no es válido: solo ASCII, dígitos, `.` `-` `_`, máx. 100) | `gh repo view USUARIO/NOMBRE` (si existe, lo muestra) | Elegir otro nombre o trabajar con el existente. Texto exacto del error de `gh`: PENDIENTE DE COMPROBAR | [F9][F45] |
| E3 | `fatal: remote origin already exists.` | Ya hay un remoto `origin` en esa carpeta | `git remote -v` | Cambiar su URL con `git remote set-url origin URL`; o renombrarlo / eliminarlo (`git remote rename`, `git remote remove`); o usar otro nombre de remoto. **PROBADO** | [F32] |
| E4 | `403` / `permission denied` / `Permission to X denied to Y` al hacer push | Estás autenticado con otra cuenta; no tienes permiso de escritura; credencial antigua en Windows | `gh auth status` (¿qué cuenta está activa?); `git remote -v` (¿el repo es tuyo?) | `gh auth switch` si hay varias cuentas [F39]; confirmar que el repo es tuyo; borrar la credencial vieja de GitHub en **Panel de control → Cuentas de usuario → Administrador de credenciales** [F31]; el texto exacto `Permission to X denied` PENDIENTE DE COMPROBAR | [F35][F31][F39] |
| E5 | `401` o "credenciales inválidas" / se pide contraseña en la terminal | La **contraseña de la cuenta ya no vale para Git**; hace falta token, `gh` o Git Credential Manager; credenciales viejas en caché; versión de Git muy antigua | `gh auth status`; `git --version` (mínimo 2.29 para OAuth con el Credential Manager) | `gh auth login` + `gh auth setup-git` [F44]; o instalar la última versión de Git for Windows (incluye el Credential Manager) [F31]; borrar credenciales viejas en el Administrador de credenciales [F31]. Nota: "Password-based authentication for Git has been removed" [F32] | [F31][F32][F35] |
| E6 | `rejected ... (non-fast-forward)` o `(fetch first)` | El repo remoto tiene commits que tu carpeta no tiene (por ejemplo, creaste el repo **con README** en la web y luego hiciste `git init` local) | `git fetch origin`; `git status` | `git pull origin main` (une los cambios) y luego `git push` [F34]. **PROBADO** (Git 2.43 dice `(fetch first)`; la documentación muestra `(non-fast-forward)`; es el mismo problema). **No** usar `--force` sin entenderlo | [F34] |
| E7 | `Author identity unknown` al hacer commit | Falta `user.name` / `user.email` | `git config --global user.name` | `git config --global user.name "..."` y `user.email "..."` [F29][F30]. **PROBADO** | [F29][F30] |
| E8 | `gh` pide iniciar sesión: "To get started with GitHub CLI, please run: gh auth login" | No hay sesión de `gh` | `gh auth status` (código de salida 1) | `gh auth login` [F42][F43]. **PROBADO** (mensaje real) | [F42][F43] |
| E9 | El código de `gh` ("one-time code") **no funciona o caducó** | Pasó el tiempo (por defecto 15 minutos) o se escribió mal; el navegador no se abrió | Repetir `gh auth login` | Obtener un código nuevo (ejecutar de nuevo) y escribirlo en `https://github.com/login/device`; si el navegador no abre, ir a mano a esa URL [F37][F49] | [F37][F49] |
| E10 | GitHub pide un **código** que no llegó o que "se perdió" entre varias herramientas (caso Alumna E) | Varios flujos distintos con código a la vez (2FA TOTP, verificación de dispositivo por correo, código de `gh`) | Identificar cuál código es (tabla de la sección B6) | Hacer **un flujo a la vez**; revisar correo (spam) para el código de dispositivo [F3]; usar app TOTP o código de recuperación [F6][F8] | [F3][F5][F7] |
| E11 | **Perdí el teléfono / app 2FA** | Sin segundo factor | n/a | Usar código de recuperación (`github-recovery-codes.txt`) en "More options → 2FA recovery code" [F8]; o passkey/llave de seguridad, SSH, PAT o dispositivo verificado [F6][F8]. **Si no hay ningún método, GitHub Support no puede restaurar el acceso** [F4][F8] | [F4][F6][F8] |
| E12 | **Rate limit / bloqueo temporal** (caso Alumno F, ~02:25: "me restringió temporalmente el uso por teclear a velocidad superhumana") | La **API** limita solicitudes (límites primarios y **secundarios**: por ejemplo exceso de solicitudes concurrentes, por minuto o de tokens OAuth por hora); al excederse llega `403` o `429` con mensaje; si viene `retry-after`, **no reintentar antes** de esos segundos [F36]. El mensaje literal de la clase (la web) **no está en la documentación consultada** | `gh api rate_limit` (no consume el límite primario; puede contar para el secundario [F36]); leer el mensaje completo | **Esperar** el tiempo indicado, **no reintentar en bucle**, no automatizar clics/teclado. Si persiste, contactar a GitHub Support. El profesor sugirió crear otra cuenta: **no se recomienda como solución estándar** (ver sección 9). El mensaje exacto del caso de la clase: PENDIENTE DE COMPROBAR | [F36] |
| E13 | Pages: **404** al abrir `https://USUARIO.github.io/REPO` | No hay `index.html` en la raíz de la fuente publicada; nombre con mayúsculas (`Index.html`); carpeta equivocada; rama equivocada; no se ha publicado aún; repo privado en plan Free (sin Pages); incidente de GitHub | Ver `index.html` en la raíz; Settings → Pages (¿Source y rama/carpeta correctas?); pestaña Actions | La documentación lista: revisar la página de estado de GitHub, DNS (si hay dominio propio), caché del navegador, que exista `index.html` **exacto** en la raíz de la fuente (sensible a mayúsculas), que la rama sea la predeterminada, que haya un commit empujado por alguien con permisos de admin, y cambios de visibilidad (cambian la URL) [F20] | [F20][F16][F17] |
| E14 | Pages: **tarda en publicar** / no se ve el cambio | Normal: hasta **10 minutos**; no se construye si quien empujó no verificó su correo o por push con deploy key; construcción fallida; caché | Pestaña **Actions** (estado de la ejecución); correo de error | Esperar hasta 10 min; si pasa **1 hora** revisar errores de construcción [F16][F17]; verificar correo [F2]; recargar sin caché (Ctrl+F5, COMPLEMENTO) | [F16][F17][F20][F58] |
| E15 | El sitio carga pero el **chatbot de IA no responde** | Pages es estático: no ejecuta Python/FastAPI ni guarda claves; el chat solo funcionaba con respuestas predefinidas (EN CLASE, ~02:30) | Abrir el sitio en otro dispositivo; revisar la consola del navegador | Alojar el backend en otra plataforma (p. ej. Vercel) con la clave en variables de entorno; GitHub Pages solo sirve la parte visual [F16][F19][F54][F55] | [F16][F19] |
| E16 | `git push` rechazado por **secreto detectado** | **Push protection** bloquea pushes con secretos conocidos (activada por defecto para usuarios en repos públicos de GitHub.com) | Leer el mensaje del push | Quitar el secreto del archivo (y del historial si ya se había commiteado), **revocar** la clave, volver a intentar [F26][F25] | [F25][F26] |
| E17 | Se subió `.env` o una clave por error | `.gitignore` creado tarde o no existía | `git ls-files` (¿aparece `.env`?); buscar el commit | **1) Revocar/rotar la clave ya**; 2) `git rm --cached .env`, commit, push (PROBADO: el historial lo conserva); 3) limpiar historial solo si hace falta [F24][F23] | [F23][F24][F27] |
| E18 | "Repository not found" / `404` al hacer push/clone | URL del remoto errónea, repo privado/ajeno, repo borrado | `git remote -v` | Corregir con `git remote set-url origin URL` [F35][F32] | [F35] |
| E19 | `gh repo create` con `--push`: "no commits" o el repo queda vacío | No se hizo commit antes | `git log --oneline` | Hacer `git add .` y `git commit` antes de `gh repo create --push` (comportamiento exacto del error: PENDIENTE DE COMPROBAR) | [F41] |
| E20 | Advertencia en Windows `LF will be replaced by CRLF` | Conversión de saltos de línea | n/a | No es un error; se ignora en la práctica. **No verificado en documentación de esta investigación**: PENDIENTE DE COMPROBAR | — |

---

## 6. Seguridad en GitHub: secretos, privacidad y "qué hago si ya se expuso"

**Reglas (todas con [F23][F10][F11][F33])**:

1. **Nunca** `git add`, `commit` ni `push` de contraseñas o API keys a un repositorio remoto [F10][F11][F33].
2. No subir credenciales sin cifrar **ni siquiera a un repo privado** [F23].
3. No compartir tokens por mensajería no cifrada ni por correo; no pasar un token como texto plano en la línea de comandos [F23].
4. Tokens con **permisos mínimos** y **fecha de caducidad corta**; preferir *fine-grained* [F23][F38].
5. No escribir credenciales fijas en el código [F23]. Para una web estática: **toda clave puesta en JavaScript es pública**; las claves viven solo en el backend/variables de entorno (regla del proyecto; COMPLEMENTO).
6. Si de verdad hace falta guardar claves en un archivo local, un `.env` que **nunca se suba** [F23]. Usar `.env.example` **sin valores** como plantilla versionable (patrón probado en evidencias; COMPLEMENTO).

**Secret scanning y push protection** [F25][F26]:

- *Secret scanning* revisa **todo el historial de todas las ramas** en busca de credenciales conocidas y genera alertas; además revisa descripciones y comentarios de issues, pull requests, discusiones y wikis [F25].
- *Push protection* **bloquea el push antes** de que el secreto llegue al repo: desde la línea de comandos, commits en la UI, cargas de archivos y la API REST [F26]. **Para usuarios está activada por defecto** y evita subir secretos a repositorios públicos de GitHub.com; la de repositorios requiere GitHub Secret Protection y está desactivada por defecto [F26]. No sustituye a `.gitignore` ni garantiza detectar todo (hay patrones de proveedores concretos).

**Qué hacer si una clave ya se subió** [F24][F25][F23] (orden importa):

1. **Revocar o rotar la clave inmediatamente** en el servicio de origen (OpenRouter, Supabase, GitHub…). GitHub lo dice explícitamente: si el dato sensible es un secreto, el **primer paso** es revocarlo y/o rotarlo; con eso suele bastar; reescribir historial puede no estar justificado [F24]. Plan oficial: generar credencial nueva, reemplazar la vieja en todos los sitios y **borrar la comprometida** [F23].
2. Evaluar qué se pudo usar/leer con esa clave (revisar uso/facturación del proveedor; PENDIENTE: depende de cada proveedor).
3. Quitarla del repo (`git rm --cached`, commit) [F27]. Reescribir el historial (`git-filter-repo`) es un procedimiento complejo, con efectos secundarios; incluso así las confirmaciones pueden seguir accesibles en clones, forks, vistas en caché y pull requests [F24].
4. Cada clave nueva se guarda solo en variables de entorno o en secretos del servicio.

**Eliminar el repositorio NO deshace la exposición** (ACLARACIÓN TÉCNICA POSTERIOR):

- Borrar un repo público **no borra sus forks** [F15]; los clones y copias que alguien hizo siguen existiendo; las vistas en caché y referencias de pull requests pueden seguir accesibles [F24]. El único remedio fiable para un secreto es revocarlo [F24].
- Algunos repos borrados pueden restaurarse en 90 días [F15] (señal de que el contenido no desaparece al instante).

**Visibilidad y Pages** [F13][F14][F16][F22]:

- Repositorio **público**: lo ve cualquiera en Internet. **Privado**: solo tú y quien invites [F13].
- Un sitio de Pages es **público en Internet aunque el repo sea privado**, si el plan lo permite; si hay datos sensibles hay que retirarlos antes de publicar [F16][F17][F59].
- En plan Free, Pages exige repo público [F16]; con cuenta gratuita no se puede "publicar Pages en privado": la publicación privada es de **GitHub Enterprise Cloud** [F22].
- "Si alguien encuentra el link, queda desprotegido" (EN CLASE, profesor, ~03:00): correcto, y además, si el repo es público, **el código y los datos del repo también son legibles** aunque nadie conozca el enlace del sitio. No hay "seguridad por oscuridad". **Jamás** subir un dashboard con datos reales y sin autenticación a un repo o página pública (megaprompt §6; RECONSTRUCCIÓN PEDAGÓGICA).
- Pages **no debe usarse para transacciones sensibles** (enviar contraseñas, tarjetas) [F18][F59].
- Pages registra la **IP de los visitantes** con fines de seguridad [F19].

---

## 7. Comparativa: repositorio GitHub, GitHub Pages y Vercel

| Aspecto | Repositorio GitHub | GitHub Pages | Vercel |
|---|---|---|---|
| Qué es | Almacén de código con historial y colaboración [F13] | Hosting **estático** que publica HTML/CSS/JS desde un repo [F19] | Plataforma de despliegue conectada a Git; funciones serverless, runtime Python (FastAPI) [F52][F55] |
| ¿Ejecuta backend (Python/FastAPI)? | No | **No**: "does not support server-side languages such as PHP, Ruby, or Python" [F16] | **Sí**: despliega una app FastAPI con el runtime de Python y *Vercel Functions* [F55] |
| ¿Guarda claves de forma segura? | Las claves **no** deben ir al repo [F23] | **No**: es solo estático y público [F16][F18] | Variables de entorno cifradas en reposo; valores *Secret* de solo escritura tras guardarse [F54] |
| Costo para el alumno | Cuenta Free: repos públicos y privados ilimitados (con funciones limitadas en privados) [F13] | Gratis en repos **públicos** con Free [F16] | Plan **Hobby gratuito** con cuotas mensuales [F53]; no se citan cifras aquí |
| Cuándo usarlo | Siempre: guardar código | Landing / sitio visual estático | Cuando hay backend (OpenRouter, base de datos) |
| Relación | Fuente | Se publica desde el repo | **Importa el repo de GitHub y despliega en cada push**; hay vistas previas por pull request [F52] |
| URL típica | `github.com/USUARIO/REPO` | `USUARIO.github.io/REPO` [F19] | `NOMBRE.vercel.app` |

**Analogía (RECONSTRUCCIÓN PEDAGÓGICA)**: el repositorio es el **archivero** donde se guarda la receta; Pages es un **mostrador de exhibición** (solo muestra lo ya hecho); Vercel es la **cocina** (donde se procesa el pedido y se guardan los secretos del restaurante).

**Cuándo una página estática conversa con un backend aparte**: el JavaScript del sitio llama por `fetch` a la URL de un backend (por ejemplo, en Vercel); ese backend es quien guarda la clave de OpenRouter y valida al usuario. Requisitos de seguridad mínimos: clave solo en variables de entorno del backend; autenticación y autorización antes de consultar datos; CORS restringido al dominio del sitio; límites de uso. (COMPLEMENTO; detalles de implementación pertenecen al PDF de Vercel/Supabase; no verificados aquí).

---

## 8. Límites de GitHub Pages (solo lo documentado)

Fuente [F18] (verificado 23/11/2026):

- **Solo estático**; sin PHP, Ruby ni Python [F16].
- Los repositorios fuente tienen un **límite recomendado de 1 GB**; los sitios publicados **no pueden superar 1 GB** [F18].
- Las implementaciones expiran si tardan **más de 10 minutos** [F18].
- Límite **blando de ancho de banda: 100 GB por mes** [F18].
- Límite **blando de 10 construcciones por hora** (no aplica si se publica con un flujo personalizado de GitHub Actions) [F18].
- Pueden aplicarse límites de tasa: respuesta HTTP **429** [F18].
- **Un solo sitio de usuario u organización** por cuenta (`USUARIO.github.io`); un sitio de proyecto por repositorio [F18][F19].
- **Uso permitido**: no está pensado ni permitido como hosting gratuito para un negocio en línea, comercio electrónico o sitios cuyo fin principal sea facilitar transacciones comerciales o ser SaaS; no usar para transacciones sensibles [F18]. (La práctica de Puerto A&M es **simulación académica**, no un negocio real.)
- **Ejercicios educativos**: copiar un sitio como práctica no está prohibido, pero hay que escribir el código uno mismo, el sitio no puede recoger datos de usuarios y debe llevar un aviso visible de que es un ejercicio educativo [F18].
- Tiempo de publicación: hasta **10 minutos** tras el push [F16].
- Visibilidad: Free → repos públicos; Pro/Team/Enterprise → públicos y privados [F16]; sitios privados: solo Enterprise Cloud [F22].
- Cuota de Actions: los *runners* estándar son **gratis en repos públicos**; en privados hay cargos tras el uso incluido del plan [F16].

No se citan precios de planes (no se verificaron).

---

## 9. Aclaraciones respecto a la clase (22/11/2026)

| # | Lo dicho / ocurrido en clase | Aclaración técnica vigente | Etiqueta |
|---|---|---|---|
| 1 | El profesor: "GitHub solo es un repositorio de código que sí permite desplegar las landing page" y "no puede ejecutar Python; tampoco guardar nuestra clave de OpenRouter" (~02:25 y ~02:30). | Correcto. Precisión: es **GitHub Pages** (un servicio de GitHub) el que publica estáticos; Python no se ejecuta [F16]. Una clave puesta en JS del sitio sería pública [F23]. | ACLARACIÓN TÉCNICA POSTERIOR |
| 2 | Prompt: "Crea un nuevo repositorio en GitHub y despliega en una page pública" (chat ~01:32 y ~02:24). Los alumnos compartieron enlaces `github.io`. | Funciona **solo si** la cuenta tiene sesión de `gh` y el repo es **público** (plan Free) [F16]. Publicado ≠ aplicación funcional: la parte de IA y la persistencia no funcionan con Pages. | ACLARACIÓN TÉCNICA POSTERIOR |
| 3 | El profesor mostró su landing en Pages con chat "motor local" (respuestas predefinidas) y dijo que la IA requiere más integraciones. | Es el comportamiento esperado: sin backend no hay IA real. **Un enlace publicado no es prueba de funcionamiento end-to-end**. | ACLARACIÓN TÉCNICA POSTERIOR |
| 4 | Alumna D preguntó por privacidad del dashboard en GitHub (~03:00). El profesor: "si alguien encuentra el link, queda desprotegido; si quieren bajarlo, que elimine el repositorio y lo dejen local". | Correcto en lo esencial. Añadir: (a) en un repo público **el código** es visible; (b) **despublicar** (Unpublish site) quita el sitio sin borrar el repo [F21]; en Free, hacer el repo privado despublica Pages [F14]; (c) **eliminar el repo no deshace una exposición** (forks, clones, cachés) y hay que **revocar claves** [F15][F24]; (d) la publicación privada de Pages es de Enterprise Cloud [F22]. | ACLARACIÓN TÉCNICA POSTERIOR |
| 5 | Alumna D: "¿Vercel y GitHub son la misma idea, ambos para hospedar?" Profesor: Git guarda repositorios; Vercel es para aplicaciones. | Aproximación válida: GitHub = repositorio (+ Pages estático); Vercel = despliegue con backend. Se conectan: Vercel **importa el repo** y despliega en cada push [F52]. Pages **sí hospeda** estáticos, así que "hosting" no es exclusivo de Vercel. | ACLARACIÓN TÉCNICA POSTERIOR |
| 6 | Alumna E: tras entrar a GitHub desde otra herramienta le apareció un código enviado a su dispositivo y no lo vio al desplegar (~03:10). | Probablemente un flujo de **verificación** (código de 2FA, verificación de dispositivo o código de `gh`). Hay **cuatro tipos de código distintos** (tabla en B6). Se recomienda hacerlos **uno por uno** y guardar los códigos de recuperación [F3][F5][F6][F37]. No es posible saber cuál fue sin ver el mensaje. | RECONSTRUCCIÓN PEDAGÓGICA |
| 7 | Alumno F: GitHub le "restringió temporalmente el uso por teclear a velocidad superhumana" y le bloqueó (~02:25); el profesor sugirió enviar el aviso y, si no, crear una cuenta nueva. | La documentación consultada describe límites de **API** (primarios y secundarios, con `403`/`429` y `retry-after`) [F36] pero **no el mensaje exacto visto en la web**: PENDIENTE DE COMPROBAR. Recomendación: esperar, no insistir ni automatizar, y contactar a GitHub Support; **no** se recomienda crear cuentas nuevas como solución de rutina (la política de múltiples cuentas no se verificó). | PENDIENTE DE COMPROBAR |
| 8 | El profesor: "el PDF de la clase pasada es una guía superdetallada de GitHub paso a paso" (~01:30). | Esta investigación y el PDF 02 actualizan esa guía con documentación vigente 23/11/2026 (menú *Settings → Pages → Build and deployment*, flujo web de `gh auth login`). | ACTUALIZACIÓN EXTERNA |
| 9 | El profesor: "no se puede desplegar sin GitHub" y que ChatGPT/Claude necesitan conectarse a GitHub para desplegar (~02:15). | Afirmación **no verificada** en esta investigación (depende de la plataforma de despliegue, de la herramienta y del plan). Para **GitHub Pages**, sí hace falta un repositorio en GitHub [F16]. Para Vercel, la integración con GitHub es una vía [F52]; otras vías (CLI de Vercel) no se investigaron aquí. | PENDIENTE DE COMPROBAR |
| 10 | El profesor: "Claude desde el celular puede usar GitHub; OpenCode necesita computadora" (~02:40). | Fuera del alcance de esta investigación (producto de terceros); no verificado. | PENDIENTE DE COMPROBAR |
| 11 | Chat de clase: GitHub como parte del ecosistema (base de datos + repositorio + desplegador + herramienta de IA). | Ecosistema coherente: GitHub (código/Pages), Vercel (backend), Supabase (datos/autenticación), herramienta de IA. Las responsabilidades de cada pieza se detallan en los otros PDFs. | EN CLASE |
| 12 | Se hablaba de "códigos de autenticación y bloqueo" con `gh`. | En `gh auth login`, el código es de **un solo uso** (`XXXX-XXXX`) y se escribe en `github.com/login/device`; `gh auth status` confirma la sesión [F37][F43][F49]. El comando `opencode auth list` que se recogió en el chat pertenece a OpenCode y comprueba las autenticaciones de **OpenCode**; no sustituye a `gh auth status`, que comprueba la sesión de **GitHub CLI** (distinción pedida en el megaprompt; el comando de OpenCode no se verificó aquí). | ACLARACIÓN TÉCNICA POSTERIOR |

---

## 10. Plantilla de práctica "proyecto local → repo GitHub → Pages" (versión estática segura, SIN claves)

Estado inicial: carpeta `puerto-am-demo` con `index.html` (landing estática del restaurante ficticio, con rótulo "SIMULACIÓN ACADÉMICA"), `assets/` y `README.md`. **No** hay `.env`, ni Excel real, ni claves, ni datos reales.

| Paso | Acción | Salida esperada | Diagnóstico si falla |
|---|---|---|---|
| 1 | `git --version`, `gh --version` | Dos líneas con versión | E1 |
| 2 | `git config --global user.name/email` | Se guarda | E7 |
| 3 | `gh auth login` (web) y `gh auth status` | "Logged in" (texto exacto: PENDIENTE) | E8, E9, E10 |
| 4 | Crear `.gitignore` con `.env` | `git status` no muestra `.env` | E17 |
| 5 | `git init -b main`, `git add .`, `git commit -m "..."` | Commit creado (`git log --oneline`) | E7 |
| 6 | `gh repo create puerto-am-demo --public --source=. --remote=origin --push` | Repo en `github.com/USUARIO/puerto-am-demo` | E2, E3, E4, E5 |
| 7 | Settings → Pages → Deploy from a branch → `main` `/ (root)` → Save | Sitio en `USUARIO.github.io/puerto-am-demo` en ≤10 min | E13, E14 |
| 8 | Abrir el enlace en el celular (otra red) | El sitio carga | Si no, E13 |
| 9 | Verificar que el chat NO usa IA real | Respuestas predefinidas | E15 |

Cierre pedagógico: "pantalla publicada" ≠ "aplicación operativa". La IA con clave y la memoria requieren backend (Vercel) y base de datos (Supabase), ver PDFs 03 y 04.

---

## 11. Qué NO se verificó (resumen honesto)

**No se hizo / no se pudo hacer**

- `gh auth login` real, creación de repositorio real, activación real de Pages, 2FA real: no se inicia sesión ni se toca una cuenta. Los textos exactos de pantallas con sesión (mensajes tras autorizar, "Logged in as…") son **PENDIENTE DE COMPROBAR**.
- **Windows real**: no hay Windows en el entorno. `winget`, MSI, PATH y PowerShell se basan en documentación; `Get-Command`/`where.exe` son cmdlets estándar no ejecutados.
- **`git-scm.com`**: bloqueado por la red del entorno (también `github.com`, `learn.microsoft.com`, `gitforwindows.org`). No se leyó la página de descarga de Windows ni la de Microsoft sobre `winget`. El identificador `Git.Git` se verificó en el repositorio `microsoft/winget-pkgs`; el texto de las opciones de PATH se verificó en el código del instalador de Git for Windows (`git-for-windows/build-extra`). Hay que **permitir `git-scm.com`** en la red de la sesión para completar la verificación y la captura.
- **Captura de `github.com/signup`**: el proxy devolvió una página de bloqueo; descartada. No se inventó ninguna captura.
- **Versión vigente de `gh`**: no se pudo consultar la última versión (API de GitHub devolvió 403). El README de `cli/cli` indica que desde v2.93.0 las versiones son *immutable releases*, de modo que la versión vigente es **probablemente ≥ 2.93.0** (inferido, no confirmado); el contenedor trae 2.89.0. El manual en línea documenta `--expiring` y `--no-refresh`, ausentes en 2.89.0; la guía no usa esos flags.
- Texto exacto de errores de `gh` para nombre ocupado, `--push` sin commits, y de "Permission to X denied": PENDIENTE DE COMPROBAR.
- Mensaje exacto de restricción temporal de la web visto por el Alumno F: no está en la documentación consultada.
- Política de varias cuentas gratuitas por persona: no verificada.
- Cifras de planes y precios: no se citan.
- GitHub Desktop (instalación y pantallas): no investigado.
- Afirmaciones sobre ChatGPT/Claude/OpenCode (conexión a GitHub, uso en celular): no verificadas.

**Sí se verificó (23/11/2026)**: todas las afirmaciones marcadas con [F#]; comparación de flags de `gh repo create`, `gh auth login/status/setup-git`, `gh repo view` entre `--help` de `gh 2.89.0` y el manual en línea; pruebas locales de `.gitignore`, `check-ignore`, `remote origin already exists`, push rechazado (remoto *bare* local), `Author identity unknown`, `gh` sin sesión; siete capturas de documentación pública.

---

## 12. Fuentes (todas consultadas y verificado 23/11/2026)

| ID | URL | Se usó para |
|---|---|---|
| F1 | https://docs.github.com/en/get-started/start-your-journey/creating-an-account-on-github | Crear cuenta, Google/Apple, errores de registro |
| F2 | https://docs.github.com/en/account-and-profile/how-tos/email-preferences/verifying-your-email-address | Verificar/reenviar correo |
| F3 | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/verifying-new-devices-when-signing-in | Verificación de dispositivo (código 1 h) |
| F4 | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-two-factor-authentication | Qué es 2FA, requisito 2023, Support no restaura |
| F5 | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication | Activar 2FA (TOTP, SMS, passkey, llave, Mobile), periodo 28 días |
| F6 | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication-recovery-methods | Códigos de recuperación (16), generar nuevos |
| F7 | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/accessing-github-using-two-factor-authentication | Iniciar sesión con 2FA, línea de comandos |
| F8 | https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/recovering-your-account-if-you-lose-your-2fa-credentials | Recuperar cuenta, `github-recovery-codes.txt` |
| F9 | https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository | Crear repo web, campos, nombre válido |
| F10 | https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository | Upload files, límites 25 MiB/100 archivos |
| F11 | https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files | Crear archivos |
| F12 | https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files | Editar archivos |
| F13 | https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories | Términos, visibilidad, plan Free |
| F14 | https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility | Privado despublica Pages en Free |
| F15 | https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository | Eliminar repo; forks; restaurar 90 días |
| F16 | https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site | Crear Pages, Free→público, 10 min, sin Python |
| F17 | https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site | Settings → Pages, fuente por rama/Actions |
| F18 | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits | Límites de Pages (1 GB, 100 GB/mes, 10 builds/h) |
| F19 | https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages | Qué es Pages, URL, IP de visitantes |
| F20 | https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites | Pages 404 |
| F21 | https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site | Despublicar |
| F22 | https://docs.github.com/en/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site | Pages privado = Enterprise Cloud |
| F23 | https://docs.github.com/en/rest/authentication/keeping-your-api-credentials-secure | Credenciales seguras, plan de remediación |
| F24 | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository | Revocar primero; historial; forks/clones |
| F25 | https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning | Secret scanning |
| F26 | https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection | Push protection |
| F27 | https://docs.github.com/en/get-started/git-basics/ignoring-files | `.gitignore`, `git rm --cached` |
| F28 | https://docs.github.com/en/get-started/git-basics/set-up-git | Instalar/configurar Git, GitHub Desktop |
| F29 | https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git | `git config user.name` |
| F30 | https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address | `git config user.email`, noreply |
| F31 | https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git | Git Credential Manager, Windows, borrar credencial |
| F32 | https://docs.github.com/en/get-started/git-basics/managing-remote-repositories | Remotos, `remote origin already exists`, `set-url` |
| F33 | https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github | `git init -b main`, `gh repo create --source`, `git push -u` |
| F34 | https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors | Push rechazado |
| F35 | https://docs.github.com/en/repositories/creating-and-managing-repositories/troubleshooting-cloning-errors | 401/403, remoto correcto |
| F36 | https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api | Rate limits primarios y secundarios |
| F37 | https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps | Flujo de dispositivo: `github.com/login/device`, código de 8 caracteres, 900 s |
| F38 | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens | Tokens (fine-grained vs clásico) |
| F39 | https://docs.github.com/en/github-cli/github-cli/quickstart | Quickstart de gh |
| F40 | https://docs.github.com/en/github-cli/github-cli/authenticating-with-github-cli | Autenticación de gh, `GH_TOKEN`, `setup-git` |
| F41 | https://cli.github.com/manual/gh_repo_create | `gh repo create` y flags |
| F42 | https://cli.github.com/manual/gh_auth_login | `gh auth login` y flags |
| F43 | https://cli.github.com/manual/gh_auth_status | `gh auth status` |
| F44 | https://cli.github.com/manual/gh_auth_setup-git | `gh auth setup-git` |
| F45 | https://cli.github.com/manual/gh_repo_view | `gh repo view --web` |
| F46 | https://cli.github.com/manual/gh_api | `gh api`, campos anidados |
| F47 | https://raw.githubusercontent.com/cli/cli/trunk/docs/install_windows.md | Instalar gh en Windows (winget, MSI, PATH) |
| F48 | https://cli.github.com/ | Página oficial de gh (instalar con WinGet / MSI) |
| F49 | https://raw.githubusercontent.com/cli/cli/trunk/internal/authflow/flow.go | Texto del flujo de gh: "First copy your one-time code", "Press Enter" |
| F50 | https://raw.githubusercontent.com/git-for-windows/build-extra/main/installer/install.iss | Opciones del instalador de Git for Windows (PATH, rama inicial) |
| F51 | https://docs.github.com/en/rest/pages/pages | API para crear sitio Pages |
| F52 | https://vercel.com/docs/git/vercel-for-github | Vercel + GitHub: despliegue por push, vistas previas |
| F53 | https://vercel.com/docs/plans/hobby | Plan Hobby gratuito con cuotas |
| F54 | https://vercel.com/docs/environment-variables | Variables de entorno cifradas |
| F55 | https://vercel.com/docs/frameworks/backend/fastapi | FastAPI en Vercel |
| F56 | https://raw.githubusercontent.com/microsoft/winget-pkgs/master/manifests/g/Git/Git/2.47.1/Git.Git.installer.yaml | Identificador winget `Git.Git` |
| F57 | https://docs.github.com/en/actions/how-tos/monitor-workflows/view-workflow-run-history | Ver ejecuciones en Actions |
| F58 | https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-jekyll-build-errors-for-github-pages-sites | Errores de construcción de Pages, correo de error, 10 min |
| F59 | https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https | HTTPS automático desde 15/06/2016; Pages público aunque el repo sea privado |

Nota: F58 = errores de construcción de Pages; F59 = HTTPS en Pages. Los archivos fuente descargados están en el scratchpad del agente (no en `$R`) y no se ejecutó nada de ellos.

Evidencias de pruebas: `evidencias_qa/github_pruebas.md`. Capturas: `recursos_visuales/capturas/github_*.png`.
