# -*- coding: utf-8 -*-
"""
gen_esquemas_ui.py — Esquemas ORIGINALES de interfaz (genéricos, sin logos, sin datos personales).
Todos llevan el rótulo "Ilustración esquemática; la interfaz puede variar".
Los rótulos de botones y campos se limitan a los descritos en la documentación oficial; en caso de
duda se usa un rótulo genérico en español. Se invoca desde gen_diagramas.py (run).
"""
from svgkit import *

LABEL = "Ilustración esquemática; la interfaz puede variar"
GREY = "#E8E6EE"; GREY2 = "#F4F2F8"; BORDER = "#C6C2D4"; TXT = "#2A2F45"; TXT2 = "#5B627D"
MX0, MX1 = 16, 526        # región de la maqueta
LX = 544                  # inicio de la leyenda


# ------------------------------------------------------------------ widgets
def chrome(s, url, h):
    """Marco de navegador genérico para toda la maqueta."""
    s.rect(MX0, 14, MX1 - MX0, h - 60, WHITE, BORDER, 1.8, 12)
    s.add(f'<path d="M{MX0} 52 V26 Q{MX0} 14 {MX0 + 12} 14 H{MX1 - 12} Q{MX1} 14 {MX1} 26 V52 Z" fill="#ECE8DC"/>')
    s.line(MX0, 52, MX1, 52, BORDER, 1.4)
    for i in range(3):
        s.circle(MX0 + 18 + i * 15, 33, 4.5, "#C9C2AD")
    s.rect(MX0 + 70, 22, MX1 - MX0 - 90, 22, WHITE, BORDER, 1.2, 11)
    s.text(MX0 + 84, 38, url, 11.5, 500, TXT2, mono=True)


def button(s, x, y, w, h, label, primary=True, size=13):
    s.rect(x, y, w, h, VIO if primary else WHITE, VIO if primary else BORDER, 1.6, 7)
    s.text(x + w / 2, y + h / 2 + size * 0.35, label, size, 700, WHITE if primary else TXT, "middle")


def field(s, x, y, w, label, value="", hint=None, h=30, mono=False, required=False, dropdown=False):
    s.text(x, y, label + (" *" if required else ""), 12.5, 700, TXT)
    s.rect(x, y + 6, w, h, WHITE, BORDER, 1.5, 6)
    if value:
        s.text(x + 10, y + 6 + h / 2 + 4.5, value, 12.5, 500, TXT2 if value.startswith("‹") else TXT, mono=mono)
    if dropdown:
        s.path(f"M{x + w - 22} {y + 6 + h / 2 - 2} l5 5 l5 -5", "none", TXT2, 2)
    if hint:
        s.text(x, y + 6 + h + 15, hint, 11.5, 400, TXT2)


def checkbox(s, x, y, label, checked=False, radio=False):
    if radio:
        s.circle(x + 8, y, 8, WHITE, BORDER if not checked else VIO, 1.8)
        if checked:
            s.circle(x + 8, y, 4, VIO)
    else:
        s.rect(x, y - 8, 16, 16, VIO if checked else WHITE, VIO if checked else BORDER, 1.6, 4)
        if checked:
            s.path(f"M{x + 3.5} {y} l3.5 3.8 l6 -7", "none", WHITE, 2.2)
    s.text(x + 24, y + 4.5, label, 12.5, 500, TXT)


def pin(s, x, y, n):
    s.pin(x, y, n, ORA, 11.5)


def legend(s, items, y0=60, title="Qué hacer en cada punto"):
    s.text(LX, 36, title.upper(), 11.5, 800, VIOD, spacing=1)
    y = y0
    for n, head, body in items:
        s.pin(LX + 12, y + 2, n, ORA, 11.5)
        s.text(LX + 32, y + 2, head, 13.5, 700, MID)
        last = s.para(LX + 32, y + 20, body, 784 - LX - 36, 12.5, 400, SOFT, lh=16)
        y = last + 30


def footer(s, h, extra=None):
    s.pill(MX0 + (MX1 - MX0) / 2, h - 22, LABEL, 11.5, ORAS, ORA, "#7A3200", 700, h=22)
    if extra:
        s.text(LX, h - 18, extra, 11.5, 500, MUTE)


def new(name_title, desc, h):
    s = Svg(800, h, name_title, desc + " " + LABEL + ".")
    return s


# ------------------------------------------------------------------ esquemas
def openrouter_api_key(OUT, ALT):
    h = 560
    s = new("Esquema: crear una API key en OpenRouter",
            "Pantalla genérica con menú lateral con la opción de claves de API, botón para crear clave, ventana con campos de nombre y límite opcional y botón de confirmar, "
            "y un panel que muestra la clave una sola vez con botón de copiar. Los números 1 a 6 se explican en la lista de la derecha.", h)
    chrome(s, "https://‹sitio-del-proveedor›/…", h)
    # sidebar
    s.rect(MX0 + 1, 53, 116, h - 100, GREY2, None, 0, 0)
    for i, (t, hi) in enumerate([("Modelos", 0), ("Chat", 0), ("Claves de API", 1), ("Créditos", 0), ("Ajustes", 0)]):
        y = 76 + i * 34
        if hi:
            s.rect(MX0 + 8, y - 6, 100, 28, VIOS, VIO, 1.4, 6)
        s.text(MX0 + 18, y + 13, t, 12.5, 700 if hi else 500, VIOD if hi else TXT)
    pin(s, MX0 + 124, 76 + 2 * 34 + 8, 1)
    # main
    s.text(MX0 + 134, 86, "Claves de API", 18, 800, MID)
    button(s, MX1 - 130, 66, 112, 30, "+ Crear clave", True, 12.5)
    pin(s, MX1 - 130, 66, 2)
    s.rect(MX0 + 134, 110, MX1 - MX0 - 152, 44, GREY2, BORDER, 1.2, 6)
    s.text(MX0 + 148, 137, "Aún no tienes claves", 12.5, 500, TXT2)
    # modal
    s.rect(MX0 + 140, 176, 230, 258, WHITE, BORDER, 1.8, 10)
    s.text(MX0 + 156, 202, "Crear clave", 15, 800, MID)
    field(s, MX0 + 156, 228, 198, "Nombre", "puerto-am-demo", h=28)
    pin(s, MX0 + 356, 226, 3)
    field(s, MX0 + 156, 288, 198, "Límite de crédito", "‹opcional›", "si el panel lo ofrece", h=28)
    pin(s, MX0 + 356, 286, 4)
    button(s, MX0 + 156, 384, 88, 30, "Cancelar", False, 12.5)
    button(s, MX0 + 260, 384, 94, 30, "Crear", True, 12.5)
    pin(s, MX0 + 354, 384, 5)
    # result
    s.rect(MX0 + 384, 176, 124, 258, GREY2, BORDER, 1.4, 10, "5 4")
    s.text(MX0 + 392, 196, "DESPUÉS", 10.5, 800, TXT2, spacing=0.8)
    s.text(MX0 + 392, 212, "de crear", 10.5, 800, TXT2, spacing=0.8)
    s.rect(MX0 + 392, 226, 108, 54, WHITE, BORDER, 1.2, 6)
    s.text(MX0 + 398, 246, "sk-or-v1-", 10.5, 600, TXT, mono=True)
    s.text(MX0 + 398, 262, "XXXXXXXX…", 10.5, 600, TXT2, mono=True)
    button(s, MX0 + 392, 290, 108, 28, "Copiar", False, 12)
    pin(s, MX0 + 500, 290, 6)
    s.para(MX0 + 392, 340, "Valor de ejemplo falso. Nunca muestres tu clave real.", 112, 10.5, 600, REDD, lh=13)
    legend(s, [(1, "Abre las claves", "En el menú de tu cuenta busca la opción de claves de API (Keys)."),
               (2, "Crear clave", "Pulsa el botón para crear una nueva clave."),
               (3, "Ponle nombre", "Usa un nombre que te recuerde para qué es, por ejemplo puerto-am-demo."),
               (4, "Límite opcional", "Si el panel lo ofrece, fija un tope de gasto bajo para practicar."),
               (5, "Confirma", "Pulsa Crear. Aparecerá la clave."),
               (6, "Cópiala y guárdala", "Pásala a tu archivo .env o a las variables de entorno. Normalmente no vuelve a mostrarse completa. No la pegues en chats.")])
    footer(s, h)
    s.rect(MX0 + 134, 450, 252, 50, REDS, RED, 1.4, 8)
    s.para(MX0 + 146, 470, "NUNCA pegues la clave en un chat, en el frontend ni en GitHub.", 232, 12, 700, REDD, lh=15)
    s.save(OUT / "esquema_openrouter_crear_api_key.svg")
    ALT["esquema_openrouter_crear_api_key"] = (s.title, s.desc)


def github_new_repository(OUT, ALT):
    h = 560
    s = new("Esquema: crear un repositorio nuevo en GitHub (New repository)",
            "Formulario genérico con propietario y nombre del repositorio, descripción opcional, opciones público o privado, casilla para añadir un README, "
            "listas desplegables de plantilla .gitignore y licencia, y el botón Create repository. Los números 1 a 6 se explican en la lista de la derecha.", h)
    chrome(s, "https://github.com/new", h)
    s.text(MX0 + 22, 86, "Create a new repository", 17, 800, MID)
    s.text(MX0 + 22, 104, "Un repositorio contiene los archivos de tu proyecto.", 12, 400, TXT2)
    field(s, MX0 + 22, 132, 110, "Owner", "‹tu usuario›", h=28, dropdown=True)
    s.text(MX0 + 138, 160, "/", 18, 400, TXT2)
    field(s, MX0 + 152, 132, 250, "Repository name", "puerto-am-demo", h=28, required=True)
    pin(s, MX0 + 408, 130, 1)
    field(s, MX0 + 22, 196, 380, "Description (optional)", "", h=28)
    pin(s, MX0 + 408, 194, 2)
    checkbox(s, MX0 + 24, 268, "Public", True, True)
    checkbox(s, MX0 + 24, 296, "Private", False, True)
    pin(s, MX0 + 130, 268, 3)
    s.rect(MX0 + 22, 320, 440, 0, "none")
    checkbox(s, MX0 + 24, 336, "Add a README file", True)
    pin(s, MX0 + 190, 336, 4)
    field(s, MX0 + 22, 366, 200, "Add .gitignore", "‹.gitignore template: None›", h=28, dropdown=True)
    pin(s, MX0 + 228, 364, 5)
    field(s, MX0 + 250, 366, 200, "Add license", "‹License: None›", h=28, dropdown=True)
    s.line(MX0 + 22, 430, MX1 - 22, 430, BORDER, 1.2)
    button(s, MX1 - 190, 446, 168, 34, "Create repository", True, 13)
    pin(s, MX1 - 190, 446, 6)
    s.para(MX0 + 22, 456, "Los rótulos reales están en inglés o en tu idioma, según tu cuenta.", 260, 11.5, 400, TXT2, lh=14.5)
    legend(s, [(1, "Nombre del repositorio", "Sin espacios ni tildes; por ejemplo puerto-am-demo."),
               (2, "Descripción (opcional)", "Una frase que explique el proyecto."),
               (3, "Público o privado", "Público lo puede ver cualquiera. Privado solo tú. Nunca subas claves a ninguno."),
               (4, "README", "Marcarlo crea un archivo inicial de presentación."),
               (5, ".gitignore", "Una plantilla evita subir archivos como .env o carpetas temporales."),
               (6, "Crear", "Pulsa Create repository.")])
    footer(s, h)
    s.save(OUT / "esquema_github_new_repository.svg")
    ALT["esquema_github_new_repository"] = (s.title, s.desc)


def github_pages(OUT, ALT):
    h = 580
    s = new("Esquema: activar GitHub Pages en Settings → Pages",
            "Pantalla genérica de ajustes de un repositorio con menú lateral y la opción Pages resaltada. En el área principal, la sección Build and deployment con la fuente "
            "Deploy from a branch, selectores de rama y carpeta, botón Save y un aviso con la dirección donde queda publicado el sitio estático. Los números 1 a 6 se explican a la derecha.", h)
    chrome(s, "https://github.com/‹usuario›/‹repositorio›/settings/pages", h)
    s.rect(MX0 + 1, 53, 124, h - 100, GREY2, None, 0, 0)
    items = ["General", "Collaborators", "Branches", "Pages", "Actions"]
    for i, t in enumerate(items):
        y = 76 + i * 32
        hi = t == "Pages"
        if hi:
            s.rect(MX0 + 8, y - 6, 108, 26, VIOS, VIO, 1.4, 6)
        s.text(MX0 + 16, y + 12, t, 12, 700 if hi else 500, VIOD if hi else TXT)
    pin(s, MX0 + 120, 76 + 3 * 32 + 7, 1)
    x0 = MX0 + 144
    s.text(x0, 92, "GitHub Pages", 18, 800, MID)
    s.line(x0, 104, MX1 - 18, 104, BORDER, 1.2)
    s.text(x0, 130, "Build and deployment", 14, 800, TXT)
    s.text(x0, 154, "Source", 12.5, 700, TXT)
    s.rect(x0, 162, 230, 28, WHITE, BORDER, 1.5, 6)
    s.text(x0 + 10, 181, "Deploy from a branch", 12.5, 500, TXT)
    s.path(f"M{x0 + 208} {x0 * 0 + 174} l5 5 l5 -5", "none", TXT2, 2)
    pin(s, x0 + 238, 160, 2)
    s.text(x0, 222, "Branch", 12.5, 700, TXT)
    s.rect(x0, 230, 96, 28, WHITE, BORDER, 1.5, 6)
    s.text(x0 + 10, 249, "‹main›", 12.5, 500, TXT2)
    pin(s, x0 + 104, 228, 3)
    s.rect(x0 + 118, 230, 110, 28, WHITE, BORDER, 1.5, 6)
    s.text(x0 + 128, 249, "/ (root)", 12.5, 500, TXT)
    pin(s, x0 + 236, 228, 4)
    button(s, x0 + 250, 230, 62, 28, "Save", False, 12.5)
    pin(s, x0 + 314, 228, 5)
    s.rect(x0, 300, MX1 - x0 - 18, 82, TEALS, TEAL, 1.5, 8)
    s.icon_check(x0 + 22, 326, 9, TEAL)
    s.text(x0 + 40, 330, "Your site is live at", 12.5, 700, "#06524F")
    s.text(x0 + 40, 350, "https://‹usuario›.github.io/‹repositorio›/", 11, 600, TXT, mono=True)
    s.text(x0 + 40, 370, "Puede tardar unos minutos en aparecer.", 11.5, 400, TXT2)
    pin(s, MX1 - 30, 300, 6)
    s.rect(x0, 400, MX1 - x0 - 18, 62, ORAS, ORA, 1.4, 8)
    s.para(x0 + 12, 420, "Pages sirve archivos estáticos. NO ejecuta Python ni FastAPI y NO protege claves.", MX1 - x0 - 44, 12, 700, "#7A3200", lh=15)
    legend(s, [(1, "Abre Pages", "En el repositorio entra a Settings y, en el menú lateral, a Pages."),
               (2, "Fuente", "Elige publicar desde una rama (Deploy from a branch)."),
               (3, "Rama", "Normalmente la rama principal de tu proyecto."),
               (4, "Carpeta", "La raíz del repositorio o la carpeta que contenga tu index.html."),
               (5, "Guardar", "Pulsa Save y espera a que termine la publicación."),
               (6, "Tu enlace", "Aparece la dirección pública. Ábrela y comprueba que carga.")])
    footer(s, h)
    s.save(OUT / "esquema_github_settings_pages.svg")
    ALT["esquema_github_settings_pages"] = (s.title, s.desc)


def vercel_import(OUT, ALT):
    h = 700
    s = new("Esquema: importar un proyecto desde GitHub en Vercel (Import project)",
            "Dos paneles apilados. Arriba, el menú Add New con la opción Project y una lista de repositorios con un botón Import. Abajo, la pantalla de configuración con "
            "nombre del proyecto, framework preset, directorio raíz, variables de entorno y el botón Deploy. Los números 1 a 7 se explican en la lista de la derecha.", h)
    chrome(s, "https://‹panel-de-vercel›/new", h)
    # panel 1
    s.text(MX0 + 20, 82, "Paso A · Elegir repositorio", 12, 800, VIOD, spacing=0.6)
    button(s, MX0 + 20, 92, 112, 30, "Add New…  ▾", False, 12.5)
    pin(s, MX0 + 146, 107, 1)
    s.rect(MX0 + 20, 134, 470, 128, GREY2, BORDER, 1.4, 8)
    s.text(MX0 + 34, 158, "Import Git Repository", 13.5, 800, TXT)
    for i, nm in enumerate(["‹tu-usuario›/puerto-am-demo", "‹tu-usuario›/otro-repositorio"]):
        y = 172 + i * 42
        s.rect(MX0 + 32, y, 446, 34, WHITE, BORDER, 1.2, 6)
        s.text(MX0 + 44, y + 22, nm, 11.5, 500, TXT, mono=True)
        button(s, MX0 + 400, y + 4, 70, 26, "Import", i == 0, 12)
    pin(s, MX0 + 474, 176, 2)
    # panel 2
    s.text(MX0 + 20, 296, "Paso B · Configurar", 12, 800, VIOD, spacing=0.6)
    s.rect(MX0 + 20, 306, 470, 316, WHITE, BORDER, 1.4, 8)
    field(s, MX0 + 36, 334, 200, "Project Name", "puerto-am-demo", h=26)
    pin(s, MX0 + 244, 332, 3)
    field(s, MX0 + 266, 334, 204, "Framework Preset", "‹Other›", h=26, dropdown=True)
    pin(s, MX0 + 476, 332, 4)
    field(s, MX0 + 36, 392, 200, "Root Directory", "./", h=26)
    pin(s, MX0 + 244, 390, 5)
    s.rect(MX0 + 36, 446, 434, 80, GREY2, BORDER, 1.3, 7)
    s.text(MX0 + 48, 468, "▸ Environment Variables", 12.5, 800, TXT)
    s.text(MX0 + 48, 488, "Key:  OPENROUTER_API_KEY", 11.5, 600, TXT, mono=True)
    s.text(MX0 + 48, 508, "Value: ‹pégala solo aquí›", 11.5, 500, TXT2, mono=True)
    pin(s, MX0 + 476, 446, 6)
    button(s, MX1 - 130, 568, 100, 34, "Deploy", True, 13)
    pin(s, MX1 - 130, 568, 7)
    legend(s, [(1, "Nuevo proyecto", "En el panel elige Add New… y luego Project."),
               (2, "Importa", "Busca tu repositorio de GitHub y pulsa Import. Si no aparece, revisa los permisos de la conexión con GitHub."),
               (3, "Nombre", "Será parte de tu dirección pública."),
               (4, "Framework", "Deja la detección automática o elige la opción que indique tu guía."),
               (5, "Directorio raíz", "Donde está tu proyecto dentro del repositorio."),
               (6, "Variables de entorno", "Aquí (y solo aquí) pegas la API key si tu proyecto tiene backend."),
               (7, "Deploy", "Pulsa Deploy y espera. Comprueba el enlace que se genera.")])
    footer(s, h)
    s.save(OUT / "esquema_vercel_import_project.svg")
    ALT["esquema_vercel_import_project"] = (s.title, s.desc)


def vercel_env(OUT, ALT):
    h = 580
    s = new("Esquema: variables de entorno en un proyecto de Vercel (Environment Variables)",
            "Pantalla genérica de ajustes de proyecto con pestañas superiores y la pestaña Settings resaltada, menú lateral con Environment Variables, formulario con Key, Value, "
            "selección de entornos Production, Preview y Development y botón Save, más un aviso de volver a desplegar. Los números 1 a 7 se explican a la derecha.", h)
    chrome(s, "https://‹panel-de-vercel›/‹proyecto›/settings", h)
    tabs = ["Overview", "Deployments", "Settings"]
    for i, t in enumerate(tabs):
        x = MX0 + 20 + i * 104
        hi = t == "Settings"
        s.text(x, 80, t, 12.5, 800 if hi else 500, VIOD if hi else TXT2)
        if hi:
            s.rect(x - 2, 88, 70, 3, VIO, None, 0, 1)
    s.line(MX0, 91, MX1, 91, BORDER, 1)
    pin(s, MX0 + 20 + 2 * 104 + 78, 76, 1)
    s.rect(MX0 + 1, 92, 126, h - 140, GREY2, None, 0, 0)
    for i, t in enumerate(["General", "Domains", "Environment Variables", "Git"]):
        y = 118 + i * 32
        hi = i == 2
        if hi:
            s.rect(MX0 + 6, y - 6, 116, 40, VIOS, VIO, 1.4, 6)
            s.para(MX0 + 12, y + 8, "Environment Variables", 104, 11, 700, VIOD, lh=13)
        else:
            s.text(MX0 + 14, y + 12, t, 12, 500, TXT)
    pin(s, MX0 + 120, 118 + 2 * 32 - 4, 2)
    x0 = MX0 + 144
    s.text(x0, 124, "Environment Variables", 16, 800, MID)
    field(s, x0, 154, 160, "Key", "OPENROUTER_API_KEY", h=28, mono=True)
    pin(s, x0 + 166, 152, 3)
    field(s, x0 + 186, 154, 164, "Value", "‹pégala aquí›", h=28)
    pin(s, x0 + 356, 152, 4)
    s.text(x0, 222, "Environments", 12.5, 700, TXT)
    checkbox(s, x0 + 2, 244, "Production", True)
    checkbox(s, x0 + 110, 244, "Preview", True)
    checkbox(s, x0 + 200, 244, "Development", True)
    pin(s, x0 + 330, 242, 5)
    button(s, x0, 272, 70, 30, "Save", True, 12.5)
    pin(s, x0 + 74, 270, 6)
    s.rect(x0, 326, MX1 - x0 - 18, 64, ORAS, ORA, 1.4, 8)
    s.para(x0 + 12, 346, "Los cambios aplican a despliegues NUEVOS: vuelve a desplegar para que el backend lea el valor.", MX1 - x0 - 44, 12, 700, "#7A3200", lh=15)
    pin(s, MX1 - 30, 326, 7)
    s.rect(x0, 408, MX1 - x0 - 18, 52, REDS, RED, 1.4, 8)
    s.para(x0 + 12, 428, "Pega la clave SOLO aquí. Nunca en el código, en un chat o en GitHub.", MX1 - x0 - 44, 12, 700, REDD, lh=15)
    legend(s, [(1, "Settings", "Abre tu proyecto y entra a la pestaña de ajustes (Settings)."),
               (2, "Environment Variables", "Elige esta sección en el menú lateral."),
               (3, "Nombre exacto", "Debe coincidir con el que lee tu código: OPENROUTER_API_KEY."),
               (4, "Valor", "Pega tu clave real. Se guarda en la plataforma, no en tu repositorio."),
               (5, "Entornos", "Producción, vista previa y desarrollo. Elige donde la necesitas."),
               (6, "Guardar", "Pulsa Save."),
               (7, "Redespliega", "Haz un nuevo despliegue para que la variable surta efecto.")])
    footer(s, h)
    s.save(OUT / "esquema_vercel_environment_variables.svg")
    ALT["esquema_vercel_environment_variables"] = (s.title, s.desc)


def supabase_new_project(OUT, ALT):
    h = 580
    s = new("Esquema: crear un proyecto nuevo en Supabase (New project)",
            "Formulario genérico con organización, nombre del proyecto, contraseña de la base de datos con opción de generarla, región y el botón Create new project. "
            "Los números 1 a 6 se explican en la lista de la derecha.", h)
    chrome(s, "https://‹panel-de-supabase›/new/‹organización›", h)
    s.text(MX0 + 22, 86, "Create a new project", 17, 800, MID)
    field(s, MX0 + 22, 118, 300, "Organization", "‹tu organización›", h=28, dropdown=True)
    pin(s, MX0 + 330, 116, 1)
    field(s, MX0 + 22, 178, 300, "Project name", "puerto-am-demo", h=28)
    pin(s, MX0 + 330, 176, 2)
    field(s, MX0 + 22, 238, 300, "Database password", "••••••••••••••••", h=28)
    button(s, MX0 + 340, 244, 136, 28, "Generate a password", False, 11.5)
    pin(s, MX0 + 482, 242, 3)
    s.para(MX0 + 22, 296, "Guárdala en un gestor de contraseñas. No la pegues en chats ni en tu repositorio.", 330, 11.5, 600, REDD, lh=14.5)
    field(s, MX0 + 22, 336, 300, "Region", "‹región cercana›", h=28, dropdown=True)
    pin(s, MX0 + 330, 334, 4)
    s.line(MX0 + 22, 404, MX1 - 22, 404, BORDER, 1.2)
    button(s, MX1 - 190, 420, 168, 34, "Create new project", True, 13)
    pin(s, MX1 - 190, 420, 5)
    s.para(MX0 + 22, 430, "Tras crear el proyecto, espera a que termine la preparación.", 250, 11.5, 400, TXT2, lh=14.5)
    legend(s, [(1, "Organización", "Elige tu organización de la lista."),
               (2, "Nombre", "Por ejemplo puerto-am-demo."),
               (3, "Contraseña de la base", "Genera una segura y guárdala en un lugar privado."),
               (4, "Región", "Elige una cercana a tus usuarios."),
               (5, "Crear", "Pulsa Create new project y espera a que termine.")])
    s.para(LX, 400, "Planes y límites cambian: consulta la página oficial con la fecha de verificación de la guía.", 236, 12, 600, SOFT, lh=15.5)
    footer(s, h)
    s.save(OUT / "esquema_supabase_new_project.svg")
    ALT["esquema_supabase_new_project"] = (s.title, s.desc)


def supabase_sql_editor(OUT, ALT):
    h = 580
    s = new("Esquema: SQL Editor de Supabase",
            "Pantalla genérica con barra lateral estrecha que incluye SQL Editor resaltado, pestaña de consulta nueva, área de edición con un comentario de ejemplo, botón Run "
            "y un panel de resultados inferior que muestra el mensaje de éxito o de error. Los números 1 a 5 se explican en la lista de la derecha.", h)
    chrome(s, "https://‹panel-de-supabase›/project/‹id›/sql", h)
    s.rect(MX0 + 1, 53, 112, h - 100, GREY2, None, 0, 0)
    for i, (t, hi) in enumerate([("Table Editor", 0), ("SQL Editor", 1), ("Authentication", 0), ("Database", 0), ("Project Settings", 0)]):
        y = 76 + i * 32
        if hi:
            s.rect(MX0 + 6, y - 6, 100, 26, VIOS, VIO, 1.4, 6)
        s.text(MX0 + 14, y + 12, t, 11.5, 700 if hi else 500, VIOD if hi else TXT)
    pin(s, MX0 + 108, 76 + 32 + 7, 1)
    x0 = MX0 + 128
    s.rect(x0, 66, 92, 28, WHITE, VIO, 1.5, 6)
    s.text(x0 + 46, 85, "New query", 12, 700, VIOD, "middle")
    pin(s, x0 + 96, 66, 2)
    s.rect(x0, 100, MX1 - x0 - 14, 200, "#FBFAFD", BORDER, 1.4, 6)
    for i, (ind, ln, c) in enumerate([(0, "-- Pega aquí el SQL de la guía", MUTE), (0, "create table if not exists", INK), (1, "public.ejemplo (", INK), (2, "id uuid primary key", INK), (1, ");", INK)]):
        s.text(x0 + 12 + ind * 14, 124 + i * 22, ln, 11.5, 500, c, mono=True)
    button(s, MX1 - 90, 312, 68, 30, "Run", True, 13)
    pin(s, MX1 - 90, 312, 3)
    s.rect(x0, 356, MX1 - x0 - 14, 104, GREY2, BORDER, 1.4, 6)
    s.text(x0 + 12, 380, "Results", 12.5, 800, TXT)
    s.icon_check(x0 + 22, 410, 9, TEAL)
    s.text(x0 + 40, 414, "Mensaje de éxito (o de error)", 12.5, 600, TXT)
    s.text(x0 + 40, 434, "aparece en este panel.", 11.5, 400, TXT2)
    pin(s, MX1 - 30, 356, 4)
    legend(s, [(1, "SQL Editor", "En el menú lateral del proyecto elige SQL Editor."),
               (2, "Nueva consulta", "Abre una consulta en blanco (New query)."),
               (3, "Pega y ejecuta", "Pega el SQL de la guía, léelo antes y pulsa Run."),
               (4, "Lee el resultado", "Si hay un error, copia el mensaje exacto (sin claves) y revisa la guía."),
               (5, "Comprueba", "En Table Editor verifica que las tablas existen. No desactives RLS para que funcione.")])
    pin(s, MX0 + 108, 76 + 7, 5)
    footer(s, h)
    s.save(OUT / "esquema_supabase_sql_editor.svg")
    ALT["esquema_supabase_sql_editor"] = (s.title, s.desc)


def run(OUT, ALT):
    for fn in (openrouter_api_key, github_new_repository, github_pages, vercel_import, vercel_env, supabase_new_project, supabase_sql_editor):
        fn(OUT, ALT)
