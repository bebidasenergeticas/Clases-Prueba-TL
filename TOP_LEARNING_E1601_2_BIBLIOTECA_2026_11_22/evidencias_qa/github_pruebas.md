# Evidencias de pruebas: Git local, `.gitignore`, `.env` y GitHub CLI

Fecha de ejecución: **23/11/2026**. Entorno: contenedor Linux (no Windows), `git version 2.43.0`, `gh version 2.89.0 (2026-03-26)`.
Agente D (investigador GitHub). Todo dato es SIMULACIÓN ACADÉMICA; el `.env` es **falso** y no contiene ninguna clave real.

## Qué se probó y qué NO

| Prueba | Resultado | Nota |
|---|---|---|
| `git init -b main`, `.gitignore` con `.env`, `git status`, `git check-ignore -v` | HECHO, funciona | Salida real abajo (sección 1). |
| `git add .env` bloqueado por `.gitignore` | HECHO | Git exige `-f` para forzar. |
| `.gitignore` creado **después** de commitear `.env` no sirve | HECHO | Se reproduce y se muestra la reparación `git rm --cached`. |
| `git remote add origin` dos veces → `remote origin already exists` | HECHO | Error real y reparación `git remote set-url`. |
| Push rechazado (no fast-forward) | HECHO con remoto *bare* local que simula GitHub | Mensaje real de Git 2.43: `(fetch first)`. La documentación de GitHub muestra `(non-fast-forward)`; ambos significan lo mismo. |
| `gh` sin login: `gh auth status`, `gh repo create ... --push` | HECHO | Sin sesión, con `GH_TOKEN` quitado del entorno de la prueba. Códigos de salida 1 y 4. |
| Comparación de flags de `gh repo create`, `gh auth login`, `gh auth status`, `gh auth setup-git`, `gh repo view` entre `--help` local y manual en línea | HECHO | Coinciden salvo `--expiring`, que está en el manual vigente pero no en la 2.89.0 instalada. |
| `gh auth login` real, creación de repo real en GitHub, activar Pages, 2FA | **NO HECHO** (no se hace login ni se toca una cuenta) | Se describe según documentación. PENDIENTE DE COMPROBAR en vivo con una cuenta de prueba. |
| Instalación de Git/gh en **Windows** (winget, MSI, PATH) | **NO HECHO** (no hay Windows en este entorno) | Comandos verificados contra documentación oficial, no ejecutados. |
| Captura de `github.com/signup` | **NO OBTENIDA** | El proxy del entorno devolvió 403 para `github.com` (solo responde `docs.github.com`, `cli.github.com`). La captura que salió era una página de bloqueo y se **descartó**. |
| Captura/lectura de `git-scm.com` | **NO OBTENIDA** | `git-scm.com` bloqueado por la red del entorno (ERR_TUNNEL_CONNECTION_FAILED). Habría que permitir ese host. |

## 1. `.gitignore` protege el `.env` (repo de prueba)

Estructura creada (valores falsos): `index.html`, `README.md`, `.gitignore` (`.env`, `.env.*`, `!.env.example`, `__pycache__/`, `*.pyc`, `node_modules/`), `.env` (con una clave **FALSA**) y `.env.example` (solo el nombre de la variable, sin valor).

```
$ git --version
git version 2.43.0
[exit 0]

$ git init -b main
Initialized empty Git repository in /tmp/claude-0/-workspace-Clases-Prueba-TL/fc61acbe-61be-5e5a-9f79-91c1a835bdb5/scratchpad/gh/pruebarepo/.git/
[exit 0]

$ git config user.name 'Alumno Demo'
[exit 0]

$ git config user.email 'demo@example.com'
[exit 0]

$ ls -la
total 32
drwxr-xr-x 3 root root 4096 Nov 23 07:46 .
drwxr-xr-x 5 root root 4096 Nov 23 07:46 ..
-rw-r--r-- 1 root root   81 Nov 23 07:46 .env
-rw-r--r-- 1 root root   20 Nov 23 07:46 .env.example
drwxr-xr-x 7 root root 4096 Nov 23 07:46 .git
-rw-r--r-- 1 root root   59 Nov 23 07:46 .gitignore
-rw-r--r-- 1 root root   42 Nov 23 07:46 README.md
-rw-r--r-- 1 root root  135 Nov 23 07:46 index.html
[exit 0]

$ git status
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.env.example
	.gitignore
	README.md
	index.html

nothing added to commit but untracked files present (use "git add" to track)
[exit 0]

$ git check-ignore -v .env
.gitignore:1:.env	.env
[exit 0]

$ git check-ignore -v .env.example; echo '(texto del echo de la prueba; el código [exit 0] es del echo, no de check-ignore; ver sección 2)'
.gitignore:3:!.env.example	.env.example
(texto del echo de la prueba; el código [exit 0] es del echo, no de check-ignore; ver sección 2)
[exit 0]

$ git add .
[exit 0]

$ git status --short
A  .env.example
A  .gitignore
A  README.md
A  index.html
[exit 0]

$ git commit -q -m 'Primer commit: sitio estatico de demostracion'
[exit 0]

$ git ls-files
.env.example
.gitignore
README.md
index.html
[exit 0]

$ git log --oneline
7624242 Primer commit: sitio estatico de demostracion
[exit 0]

$ git ls-files | grep -c '^.env$' ; true
0
[exit 0]

--- intentar forzar .env sin -f
$ git add .env
The following paths are ignored by one of your .gitignore files:
.env
hint: Use -f if you really want to add them.
hint: Turn this message off by running
hint: "git config advice.addIgnoredFile false"
[exit 1]

$ git add -f .env.example; git status --short
[exit 0]

$ git remote -v; echo '(sin remotos todavia)'
(sin remotos todavia)
[exit 0]

$ git remote add origin https://github.com/USUARIO/puerto-am-demo.git
[exit 0]

$ git remote add origin https://github.com/USUARIO/otro.git
error: remote origin already exists.
[exit 3]

$ git remote set-url origin https://github.com/USUARIO/puerto-am-demo.git && git remote -v
origin	https://github.com/USUARIO/puerto-am-demo.git (fetch)
origin	https://github.com/USUARIO/puerto-am-demo.git (push)
[exit 0]

```

Lectura: `git status` **no lista** `.env` (ignorado); `git check-ignore -v .env` imprime la regla `.gitignore:1:.env`; tras `git add .` y el commit, `git ls-files` **no contiene** `.env`; `git add .env` falla con "The following paths are ignored" y pide `-f`.

## 2. Casos de error reproducidos

```
$ git check-ignore -v .env.example
[exit 1]

$ git check-ignore -q .env; echo "check-ignore -q .env => $?"
check-ignore -q .env => 0
[exit 0]

=== ESCENARIO: .gitignore creado DESPUES de commitear .env
$ git ls-files
.env
.gitignore
index.html
[exit 0]

$ git status --short; echo '(.env sigue rastreado aunque .gitignore lo liste)'
(.env sigue rastreado aunque .gitignore lo liste)
[exit 0]

$ echo cambio >> .env; git status --short
 M .env
[exit 0]

$ git rm --cached .env && git commit -q -m 'Dejar de rastrear .env' && git ls-files
rm '.env'
.gitignore
index.html
[exit 0]

$ git log --oneline --all -- .env
68466aa Dejar de rastrear .env
2b1e374 c1
[exit 0]

=== ESCENARIO: push rechazado non-fast-forward (remoto bare local simulando GitHub)
$ git push origin main
To /tmp/claude-0/-workspace-Clases-Prueba-TL/fc61acbe-61be-5e5a-9f79-91c1a835bdb5/scratchpad/gh/nff/remoto.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to '/tmp/claude-0/-workspace-Clases-Prueba-TL/fc61acbe-61be-5e5a-9f79-91c1a835bdb5/scratchpad/gh/nff/remoto.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
[exit 1]

$ git pull --no-rebase --no-edit origin main && git push origin main
From /tmp/claude-0/-workspace-Clases-Prueba-TL/fc61acbe-61be-5e5a-9f79-91c1a835bdb5/scratchpad/gh/nff/remoto
 * branch            main       -> FETCH_HEAD
   8e48828..d199795  main       -> origin/main
Merge made by the 'ort' strategy.
 g | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 g
To /tmp/claude-0/-workspace-Clases-Prueba-TL/fc61acbe-61be-5e5a-9f79-91c1a835bdb5/scratchpad/gh/nff/remoto.git
   d199795..033f579  main -> main
[exit 0]

=== ESCENARIO: gh sin login
$ gh repo create puerto-am-demo --public --source=. --remote=origin --push
To get started with GitHub CLI, please run:  gh auth login
Alternatively, populate the GH_TOKEN environment variable with a GitHub API authentication token.
[exit 4]

$ gh auth status
You are not logged into any GitHub hosts. To log in, run: gh auth login
[exit 1]

$ gh --version | head -1
gh version 2.89.0 (2026-03-26)
[exit 0]

$ gh nocomando
unknown command "nocomando" for "gh"

Usage:  gh <command> <subcommand> [flags]

Available commands:
  agent-task
  alias
  api
  attestation
  auth
  browse
  cache
  co
  codespace
  completion
  config
  copilot
  extension
  gist
  gpg-key
  issue
  label
  licenses
  org
  pr
  preview
  project
  release
  repo
  ruleset
  run
  search
  secret
  ssh-key
  status
  variable
  workflow

[exit 1]

```

Lectura:

- `git check-ignore -q .env` devuelve `0` (ignorado). `git check-ignore -v .env.example` imprimió en la sección 1 la regla de negación `!.env.example` (cuando el archivo aún no estaba rastreado: el `!` significa "no ignorar") y, una vez commiteado, ya no imprime nada y devuelve `1`, porque `git check-ignore` omite por defecto los archivos ya rastreados (se puede forzar con `--no-index`). Lo importante: `.env.example` **sí** se versiona y `.env` **no**.
- Escenario "`.gitignore` tardío": `.env` ya estaba en un commit, así que **sigue rastreado** aunque luego se escriba en `.gitignore`; `git rm --cached .env` lo deja de rastrear, **pero el historial conserva el archivo** (`git log --all -- .env` lo muestra). Si hubiera sido una clave real habría que **revocarla**, no solo borrarla.
- Push rechazado: el mensaje real de Git 2.43 dice `[rejected] main -> main (fetch first)` y sugiere `git pull`. Reparación probada: `git pull --no-rebase --no-edit origin main && git push origin main`.
- `gh` sin sesión: `gh auth status` → "You are not logged into any GitHub hosts. To log in, run: gh auth login" (salida 1). `gh repo create ... --push` → "To get started with GitHub CLI, please run: gh auth login" (salida 4). Es decir: **primero `gh auth login`**.

## 3. Contraste de flags (`--help` local 2.89.0 vs manual en línea 23/11/2026)

Coinciden: `gh repo create` (`--public`, `--private`, `--internal`, `--source`, `--remote`, `--push`, `--clone`, `--add-readme`, `--description`, `--gitignore`, `--license`, `--template`, `--team`, `--homepage`, `--disable-issues`, `--disable-wiki`, `--include-all-branches`), `gh auth login` (`--web`, `--clipboard`, `--git-protocol`, `--hostname`, `--scopes`, `--with-token`, `--insecure-storage`, `--skip-ssh-key`), `gh auth status` (`--active`, `--hostname`, `--json`, `--show-token`), `gh auth setup-git` (`--hostname`, `--force`), `gh repo view` (`--web`, `--branch`).

Diferencia: el manual en línea documenta `gh auth login --expiring` (credenciales con expiración que `gh` refresca) y `gh auth status --no-refresh`; **no existen** en la 2.89.0 del contenedor. Los alumnos instalarán la versión vigente con winget; no se usan esos flags en la guía.

Fuentes: https://cli.github.com/manual/gh_repo_create , https://cli.github.com/manual/gh_auth_login , https://cli.github.com/manual/gh_auth_status , https://cli.github.com/manual/gh_auth_setup-git , https://cli.github.com/manual/gh_repo_view (todas verificado 23/11/2026).

## 4. Capturas reales obtenidas (Playwright, 1280x800, deviceScaleFactor 2, sin sesión)

Carpeta `recursos_visuales/capturas/`:

- `github_cli_home.png` (cli.github.com)
- `github_cli_manual_gh_repo_create.png`
- `github_cli_manual_gh_auth_login.png`
- `github_docs_pages_creating_site.png`
- `github_docs_pages_publishing_source.png`
- `github_docs_pages_limits.png`
- `github_docs_2fa_configurar.png`

Son páginas de **documentación pública** (sin datos personales ni claves). No son pantallas de la app con sesión.

## 5. Error "Author identity unknown" (commit sin `user.name`/`user.email`)

Reproducido en un directorio con HOME vacío (sin configuración global de Git):

```
$ git init -q -b main && echo x > a && git add a
$ git commit -m test
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```

Reparación (documentada en https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git y https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address , verificado 23/11/2026): `git config --global user.name "Nombre Apellido"` y `git config --global user.email "correo@ejemplo.com"` (se puede usar el correo `noreply` que GitHub ofrece).
