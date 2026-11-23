#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gen_diagramas.py — Genera los diagramas SVG ORIGINALES de la biblioteca E1601.2.
Uso:  python3 gen_diagramas.py        (escribe en <raiz>/recursos_visuales/diagramas/)
Los esquemas de interfaz están en gen_esquemas_ui.py (se invoca al final de este script).
"""
from pathlib import Path
from svgkit import *

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "recursos_visuales" / "diagramas"
OUT.mkdir(parents=True, exist_ok=True)
ALT = {}   # nombre -> (título, descripción)


def done(svg, name):
    svg.save(OUT / f"{name}.svg")
    ALT[name] = (svg.title, svg.desc)


def footer(s, text, y=None):
    y = y or s.h - 12
    s.text(s.w - 16, y, text, 11.5, 500, MUTE, "end")


# =========================================================================
def arquitectura_general():
    s = Svg(800, 560,
            "Arquitectura general: navegador, frontend, backend seguro, OpenRouter y Supabase",
            "Diagrama de izquierda a derecha. En la zona pública están el navegador y el frontend (HTML, CSS y JavaScript). "
            "El frontend envía la petición POST /api/chat al backend seguro, que está en la zona privada con un candado y lee la "
            "API key de las variables de entorno. El backend llama a OpenRouter con la clave para obtener la respuesta del modelo "
            "y a Supabase para leer y guardar la memoria. La clave nunca llega al navegador ni a GitHub.")
    s.text(16, 30, "Arquitectura general de la práctica", 20, 800, MID)
    s.text(16, 50, "Quién habla con quién, y dónde vive el secreto", 13.5, 500, SOFT)
    # Zonas
    zones = [(12, 232, "ZONA PÚBLICA", "lo que cualquiera puede inspeccionar", ORAS, ORA),
             (300, 232, "ZONA PRIVADA", "tu servidor (backend)", TEALS, TEAL),
             (588, 200, "SERVICIOS EXTERNOS", "con sus propias políticas", VIOS, VIO)]
    for x, w, t, sub, f, st in zones:
        s.rect(x, 68, w, 420, f, st, 1.8, rx=16, dash="7 5")
        s.text(x + 14, 92, t, 12.5, 800, st, spacing=1.2)
        s.text(x + 14, 109, sub, 12, 500, SOFT)
    # Zona A
    s.rect(32, 128, 192, 92, WHITE, ORA, 2, 12)
    s.icon_person(46, 144, 34, ORA)
    s.text(92, 158, "Navegador", 17, 700, MID)
    s.para(92, 177, "de la persona usuaria", 120, 13, 400, SOFT)
    s.rect(32, 270, 192, 140, WHITE, ORA, 2, 12)
    s.icon_browser(46, 284, 44, 34, ORA)
    s.text(100, 306, "Frontend", 17, 700, MID)
    s.lines_(46, 340, ["HTML + CSS +", "JavaScript:", "landing y chat"], 13.5, 400, SOFT)
    s.arrow([(128, 222), (128, 268)], ORA, 2.6)
    s.pill(128, 245, "abre la página", 12, WHITE, ORA, ORA)
    # etiqueta roja
    s.rect(32, 428, 192, 46, REDS, RED, 1.8, 10)
    s.icon_cross(52, 451, 10)
    s.text(70, 447, "La API key NO", 13.5, 700, REDD)
    s.text(70, 464, "va en esta zona", 13.5, 700, REDD)
    # Zona B
    s.rect(320, 128, 192, 120, MID, None, 0, 12)
    s.icon_key(334, 142, 30, ORAB)
    s.text(374, 160, "Variables de", 14, 700, WHITE)
    s.text(374, 177, "entorno", 14, 700, WHITE)
    s.text(334, 205, "OPENROUTER_API_KEY", 11.5, 600, TEALB, mono=True)
    s.text(334, 225, "=  ••••••••••••", 12, 600, ORAB, mono=True)
    s.rect(320, 280, 192, 130, WHITE, TEAL, 2.4, 12)
    s.icon_lock(334, 292, 30, TEAL)
    s.text(374, 314, "Backend", 17, 700, MID)
    s.text(374, 333, "seguro", 17, 700, MID)
    s.lines_(334, 364, ["Python / FastAPI:", "valida, guarda y", "llama al modelo"], 13.5, 400, SOFT)
    s.arrow([(416, 250), (416, 278)], ORAB, 2.6)
    s.pill(416, 264, "lee la clave", 11.5, WHITE, ORA, ORA, 600, h=19)
    # Zona C
    s.rect(608, 128, 160, 110, WHITE, VIO, 2, 12)
    s.text(688, 162, "OpenRouter", 17, 700, MID, "middle")
    s.para(618, 184, "Enruta la petición", 140, 13.5, 400, SOFT, "middle")
    s.para(618, 201, "al modelo de lenguaje", 140, 13.5, 400, SOFT, "middle")
    s.rect(608, 290, 160, 120, WHITE, VIO, 2, 12)
    s.icon_db(626, 306, 30, 34, VIO)
    s.text(666, 322, "Supabase", 17, 700, MID)
    s.lines_(622, 360, ["PostgreSQL: memoria,", "pedidos y reservas", "(con RLS)"], 13.5, 400, SOFT)
    # Flechas principales
    s.arrow([(224, 330), (318, 330)], VIO, 3)
    s.pill(271, 313, "POST /api/chat", 11.5, WHITE, VIO, VIOD, 600, mono=False, h=20)
    s.arrow([(318, 372), (224, 372)], SOFT, 2.4, "6 4")
    s.pill(271, 391, "respuesta", 11.5, WHITE, RULE2, SOFT, 600, h=20)
    s.arrow([(512, 318), (550, 318), (550, 190), (606, 190)], TEAL, 3)
    s.pill(550, 254, "con la clave", 11.5, WHITE, TEAL, TEAL, 600, h=20)
    s.arrow([(512, 372), (606, 372)], TEAL, 3, both=True)
    s.pill(559, 390, "memoria", 11.5, WHITE, TEAL, TEAL, 600, h=20)
    # leyenda
    s.icon_check(30, 516, 9, TEAL)
    s.text(46, 521, "La clave solo existe en el backend (variable de entorno) y viaja únicamente hacia OpenRouter.", 13.5, 600, INK)
    s.text(46, 541, "Vercel, GitHub Pages o tu computadora alojan el frontend; GitHub Pages no ejecuta el backend.", 13, 400, SOFT)
    done(s, "arquitectura_general")


# =========================================================================
def localhost_vs_pages_vs_vercel():
    s = Svg(800, 566,
            "Comparación: localhost, GitHub Pages y Vercel",
            "Tabla visual de tres columnas. Localhost: solo tu computadora, ejecuta el backend mientras el servidor esté encendido, "
            "las claves viven en un archivo .env local. GitHub Pages: sitio estático público, no ejecuta Python ni FastAPI y no protege claves. "
            "Vercel: URL pública con despliegues de vista previa y producción, permite variables de entorno y funciones de servidor según la configuración del proyecto.")
    s.text(16, 30, "¿Dónde vive tu proyecto?", 20, 800, MID)
    s.text(16, 50, "Tres lugares, tres capacidades distintas", 13.5, 500, SOFT)
    cols = [("Localhost", "tu computadora", VIO, VIOS),
            ("GitHub Pages", "hosting estático", ORA, ORAS),
            ("Vercel", "despliegue en la nube", TEAL, TEALS)]
    x0, cw, gap = 170, 196, 12
    rows = [
        ("¿Quién puede abrirlo?", [("ok", "Solo tú (mientras el servidor corre)"), ("ok", "Cualquiera con el enlace (según tu configuración)"), ("ok", "Cualquiera con el enlace (según tu configuración)")]),
        ("¿Ejecuta Python / FastAPI?", [("ok", "Sí, en tu equipo"), ("no", "No: solo archivos HTML, CSS y JS"), ("warn", "Funciones de servidor; verifica compatibilidad")]),
        ("¿Dónde va la API key?", [("warn", "Archivo .env local, fuera de Git"), ("no", "En ningún lado: no protege secretos"), ("ok", "Variables de entorno del proyecto")]),
        ("¿Para qué sirve?", [("ok", "Desarrollar y probar"), ("ok", "Landing o dashboard sin backend"), ("ok", "Landing + backend seguro en línea")]),
    ]
    for i, (t, sub, c, cs) in enumerate(cols):
        x = x0 + i * (cw + gap)
        s.rect(x, 70, cw, 72, c, None, 0, 12)
        s.text(x + cw / 2, 102, t, 18, 800, WHITE, "middle")
        s.text(x + cw / 2, 124, sub, 13, 500, "#F2EFFF", "middle")
    y = 156
    rh = 90
    for r, (label, cells) in enumerate(rows):
        s.rect(12, y, 148, rh - 8, IVORY2, None, 0, 10)
        s.para(24, y + 34, label, 124, 15, 700, MID, lh=19)
        for i, (k, txt) in enumerate(cells):
            x = x0 + i * (cw + gap)
            s.rect(x, y, cw, rh - 8, WHITE, RULE, 1.5, 10)
            ic = {"ok": s.icon_check, "no": s.icon_cross, "warn": s.icon_warn}[k]
            ic(x + 22, y + 28, 11, {"ok": TEAL, "no": RED, "warn": ORA}[k])
            s.para(x + 42, y + 33, txt, cw - 54, 13.5, 500, INK, lh=17.5)
        y += rh
    s.icon_warn(30, 540, 9, ORA)
    s.text(46, 545, "Un enlace publicado no garantiza una app que funcione de extremo a extremo: sin backend, el chat no responde.", 12.5, 600, INK)
    done(s, "localhost_vs_pages_vs_vercel")


# =========================================================================
def excel_fastapi_dashboard_asistente():
    s = Svg(800, 470,
            "Flujo local: Excel, FastAPI, dashboard y asistente",
            "Cuatro pasos de izquierda a derecha. Un archivo Excel con datos simulados de Puerto A&M se lee con FastAPI, que calcula los KPIs y "
            "los expone como endpoints. El dashboard los muestra con tarjetas y gráficas. El asistente responde preguntas usando esas cifras como contexto. "
            "Una nota aclara que el Excel vive en la computadora; en un despliegue público se necesita almacenamiento accesible en la nube.")
    s.text(16, 30, "De Excel a dashboard con asistente", 20, 800, MID)
    s.text(16, 50, "Nivel 1 · versión local · datos de Puerto A&M (simulación académica)", 13.5, 500, SOFT)
    xs = [16, 222, 428, 634]
    w = 150
    items = [
        ("1", "Excel", ["Archivo .xlsx con ventas, costos y pedidos simulados"], VIO, VIOS),
        ("2", "FastAPI", ["Lee el Excel, valida y calcula los KPIs"], TEAL, TEALS),
        ("3", "Dashboard", ["Tarjetas y gráficas (Chart.js) en el navegador"], ORA, ORAS),
        ("4", "Asistente", ["Chat que responde con las cifras como contexto"], BLUE, BLUES),
    ]
    for (n, t, l, c, cs), x in zip(items, xs):
        s.rect(x, 90, w, 190, cs, c, 2.2, 14)
        s.circle(x + 26, 118, 14, c)
        s.text(x + 26, 123.5, n, 15, 800, WHITE, "middle")
        s.text(x + 50, 124, t, 18, 800, MID)
        s.para(x + 12, 160, l[0], w - 24, 13.5, 400, INK, lh=17.5)
    # mini iconos
    s.icon_db(xs[0] + 14, 215, 30, 34, VIO, WHITE)
    s.icon_server(xs[1] + 14, 215, 40, 36, TEAL, WHITE)
    s.icon_browser(xs[2] + 14, 218, 44, 32, ORA, WHITE)
    s.rect(xs[3] + 14, 216, 46, 34, WHITE, BLUE, 2.2, 8)
    s.text(xs[3] + 37, 238, "···", 16, 800, BLUE, "middle")
    labels = ["lee", "endpoints /api/…", "pregunta"]
    for i in range(3):
        x1 = xs[i] + w
        s.arrow([(x1 + 2, 185), (xs[i + 1] - 2, 185)], SOFT, 3)
    s.pill(xs[0] + w + 28, 165, "lee", 11.5, WHITE, RULE2, SOFT, 600, h=19)
    s.pill(xs[1] + w + 28, 165, "JSON", 11.5, WHITE, RULE2, SOFT, 600, h=19)
    s.pill(xs[2] + w + 28, 165, "cifras", 11.5, WHITE, RULE2, SOFT, 600, h=19)
    # cajas inferiores
    s.rect(16, 306, 768, 62, ORAS, ORA, 1.8, 12)
    s.icon_warn(40, 337, 12, ORA)
    s.para(64, 342, "Todo corre en TU computadora. Si apagas el equipo, el Excel y el servidor dejan de estar disponibles.", 700, 14, 700, "#7A3200", lh=19)
    s.rect(16, 382, 768, 62, TEALS, TEAL, 1.8, 12)
    s.icon_check(40, 413, 12, TEAL)
    s.para(64, 407, "Para publicarlo hace falta almacenamiento accesible desde la nube (por ejemplo, una base de datos) y un backend en línea: eso es el Nivel 2 y 3.", 700, 14, 600, INK, lh=19)
    done(s, "excel_fastapi_dashboard_asistente")


# =========================================================================
def _table(s, x, y, w, name, cols, hdr=VIO, hdr2=VIOD, rowh=25, ghost=False):
    h = 34 + rowh * len(cols) + 6
    s.rect(x, y, w, h, WHITE, hdr, 2, 10, dash="6 4" if ghost else None)
    s.add(f'<path d="M{x} {y + 34} V{y + 10} Q{x} {y} {x + 10} {y} H{x + w - 10} Q{x + w} {y} {x + w} {y + 10} V{y + 34} Z" fill="{hdr}"/>')
    s.text(x + 12, y + 23, name, 15.5, 700, WHITE, mono=True)
    for i, (key, cname, ctype) in enumerate(cols):
        yy = y + 34 + 6 + i * rowh + 15
        if i % 2 == 0:
            s.rect(x + 2, yy - 17, w - 4, rowh, "#F7F4FD", None, 0, 0)
        if key:
            col = {"PK": ORA, "FK": TEAL}[key.split()[0]]
            s.rect(x + 8, yy - 14, 30, 19, col, None, rx=4)
            s.text(x + 23, yy, key, 11.5, 800, WHITE, "middle")
        s.text(x + 46, yy, cname, 13, 600, INK, mono=True)
        s.text(x + w - 10, yy, ctype, 12, 500, MUTE, "end", mono=True)
    return h


def modelo_datos_memoria():
    s = Svg(800, 624,
            "Modelo de datos de la memoria: conversations, messages, orders, order_items y reservations",
            "Cinco tablas de PostgreSQL. conversations tiene id (clave primaria) y owner_id, que apunta a auth.users. messages tiene conversation_id que apunta a "
            "conversations. reservations y orders también apuntan a conversations mediante conversation_id y tienen owner_id. order_items tiene order_id que apunta a orders. "
            "Todas las tablas llevan seguridad por filas (RLS). Los datos son una simulación académica de Puerto A&M.")
    s.text(16, 30, "Modelo de datos: memoria, pedidos y reservas", 20, 800, MID)
    s.text(16, 50, "Esquema ilustrativo; el SQL probado está en fuentes_editables/sql/ · datos de Puerto A&M = simulación académica", 12.5, 500, SOFT)
    W = 236
    ax, bx, cx = 12, 282, 552
    y1, y2 = 92, 340
    _table(s, ax, y1, W, "messages", [("PK", "id", "uuid"), ("FK", "conversation_id", "uuid"), ("", "role", "text"), ("", "body", "text"), ("", "created_at", "timestamptz")])
    _table(s, bx, y1, W, "conversations", [("PK", "id", "uuid"), ("FK", "owner_id", "uuid"), ("", "channel", "text"), ("", "created_at", "timestamptz"), ("", "updated_at", "timestamptz")], hdr=VIOD)
    _table(s, cx, y1, W, "reservations", [("PK", "id", "uuid"), ("FK", "owner_id", "uuid"), ("FK", "conversation_id", "uuid"), ("", "personas", "integer"), ("", "fecha", "date"), ("", "hora", "time"), ("", "estado", "text")])
    _table(s, bx, y2, W, "orders", [("PK", "id", "uuid"), ("FK", "owner_id", "uuid"), ("FK", "conversation_id", "uuid"), ("", "estado", "text"), ("", "total", "numeric")], hdr=VIOD)
    _table(s, cx, y2, W, "order_items", [("PK", "id", "uuid"), ("FK", "order_id", "uuid"), ("", "producto", "text"), ("", "cantidad", "integer"), ("", "precio_unitario", "numeric")])
    # auth.users fantasma
    _table(s, ax, y2, W, "auth.users", [("PK", "id", "uuid"), ("", "Gestionada por", ""), ("", "Supabase Auth.", ""), ("", "owner_id apunta", ""), ("", "aquí desde 4 tablas", "")], hdr=MUTE, ghost=True)
    # flechas FK
    # messages.conversation_id -> conversations.id
    s.arrow([(ax + W, 172), (bx - 2, 172)], TEAL, 2.6)
    s.pill((ax + W + bx) / 2, 154, "N : 1", 11.5, WHITE, TEAL, TEAL, 700, h=19)
    # reservations.conversation_id -> conversations
    s.arrow([(cx, 198), (bx + W + 2, 198)], TEAL, 2.6)
    s.pill((bx + W + cx) / 2, 180, "N : 1", 11.5, WHITE, TEAL, TEAL, 700, h=19)
    # orders.conversation_id -> conversations  (vertical)
    s.arrow([(bx + W / 2, y2 - 2), (bx + W / 2, 92 + 34 + 6 + 25 * 5 + 6 + 3)], TEAL, 2.6)
    s.pill(bx + W / 2, (y2 + 265) / 2, "N : 1", 11.5, WHITE, TEAL, TEAL, 700, h=19)
    # order_items.order_id -> orders.id
    s.arrow([(cx, y2 + 74), (bx + W + 2, y2 + 74)], TEAL, 2.6)
    s.pill((bx + W + cx) / 2, y2 + 56, "N : 1", 11.5, WHITE, TEAL, TEAL, 700, h=19)
    # leyenda
    ly = 556
    s.rect(12, ly - 18, 776, 62, IVORY2, None, 0, 10)
    s.rect(24, ly - 6, 30, 19, ORA, None, rx=4); s.text(39, ly + 8, "PK", 11.5, 800, WHITE, "middle")
    s.text(62, ly + 8, "Clave primaria: identifica una fila de forma única.", 13, 500, INK)
    s.rect(24, ly + 20, 30, 19, TEAL, None, rx=4); s.text(39, ly + 34, "FK", 11.5, 800, WHITE, "middle")
    s.text(62, ly + 34, "Clave foránea: apunta a la PK de otra tabla (la flecha va hacia la tabla referenciada).", 13, 500, INK)
    s.text(788, ly + 8, "RLS activado", 12.5, 700, TEAL, "end")
    s.text(788, ly + 34, "en todas las tablas", 12.5, 600, SOFT, "end")
    done(s, "modelo_datos_memoria")


# =========================================================================
def linea_tiempo_sesion():
    s = Svg(800, 560,
            "Línea de tiempo aproximada de la sesión del 22/11/2026",
            "Línea horizontal de 00:00 a 03:15 con nueve hitos aproximados: 00:00 teoría; 00:20 dashboard; 00:40 landing; 01:05 OpenRouter; "
            "01:30 GitHub; 01:55 Supabase; 02:30 Claude Code y Vercel; 03:00 dudas; 03:15 cierre. Los minutos son aproximados y se reconstruyeron a partir de la transcripción.")
    s.text(16, 30, "Línea de tiempo de la sesión", 20, 800, MID)
    s.text(16, 50, "Domingo 22/11/2026 · sesión extendida de ≈ 3 h 15 min · minutos aproximados", 13.5, 500, SOFT)
    events = [(0, "00:00", "Teoría", "vibe coding", VIO),
              (20, "00:20", "Dashboard", "Excel + KPIs", TEAL),
              (40, "00:40", "Landing", "página y chat", ORA),
              (65, "01:05", "OpenRouter", "primer modelo", BLUE),
              (90, "01:30", "GitHub", "repositorio", VIOD),
              (115, "01:55", "Supabase", "memoria", TEAL),
              (150, "02:30", "Claude Code", "+ Vercel", ORA),
              (180, "03:00", "Dudas", "preguntas", BLUE),
              (195, "03:15", "Cierre", "", VIO)]
    X0, X1 = 44, 756
    sc = (X1 - X0) / 195.0
    yb = 296
    # barra segmentada
    for i, (m, t, a, b, c) in enumerate(events[:-1]):
        nx = events[i + 1][0]
        s.rect(X0 + m * sc, yb - 7, (nx - m) * sc, 14, c, WHITE, 1.5, rx=0 if i else 7)
    s.rect(X1 - 7, yb - 7, 7, 14, VIO, None, 0, 0)
    s.add(f'<rect x="{X0}" y="{yb - 7}" width="{X1 - X0}" height="14" rx="7" fill="none" stroke="{WHITE}" stroke-width="0"/>')
    levels = [(-1, 84), (1, 84), (-1, 168), (1, 168)]   # (lado, distancia)
    for i, (m, t, a, b, c) in enumerate(events):
        x = X0 + m * sc
        side, dist = levels[i % 4]
        yl = yb + side * dist
        bw = 126
        bx = min(max(x - bw / 2, 8), 800 - bw - 8)
        by = yl - 58 if side < 0 else yl
        edge = by + 58 if side < 0 else by
        s.line(x, yb + side * 8, x, edge, c, 2, "3 3" if dist > 100 else None)
        s.circle(x, yb, 9, WHITE, c, 3.4)
        s.rect(bx, by, bw, 58, WHITE, c, 2, 10)
        s.text(bx + 10, by + 20, t, 14, 800, c, mono=True)
        s.text(bx + 10, by + 38, a, 14.5, 700, MID)
        if b:
            s.text(bx + 10, by + 53, b, 12, 500, SOFT)
    s.pill(400, 540, "≈ Los minutos son aproximados y se reconstruyeron de la transcripción", 12.5, IVORY2, RULE2, SOFT, 600)
    done(s, "linea_tiempo_sesion")


# =========================================================================
def flujo_depuracion_chat():
    s = Svg(800, 930,
            "Flujo de depuración cuando el chat no responde",
            "Diagrama de decisión vertical con cinco preguntas. 1) ¿Responde la interfaz? Si no, revisa el servidor del frontend y la consola. "
            "2) ¿La petición llega al backend? Si no, revisa URL, puerto y CORS. 3) ¿El backend tiene la API key? Si no, define la variable de entorno y reinicia. "
            "4) ¿Qué código HTTP devuelve el proveedor? 401 o 403: clave inválida; 402 o 429: saldo o límite; 404: modelo o URL equivocados; 5xx: falla del proveedor. "
            "5) ¿La interfaz muestra el campo reply? Si no, revisa cómo el frontend lee la respuesta.")
    s.text(16, 30, "El chat no responde: sigue este orden", 20, 800, MID)
    s.text(16, 50, "Cada pregunta descarta una causa. No saltes pasos.", 13.5, 500, SOFT)

    def diamond(cx, cy, w, h, n, q, color=VIO):
        pts = f"{cx},{cy - h / 2} {cx + w / 2},{cy} {cx},{cy + h / 2} {cx - w / 2},{cy}"
        s.add(f'<polygon points="{pts}" fill="{WHITE}" stroke="{color}" stroke-width="2.4" stroke-linejoin="round"/>')
        s.circle(cx - w / 2 + 34, cy - h / 2 + 30, 12, color)
        s.text(cx - w / 2 + 34, cy - h / 2 + 35, str(n), 14, 800, WHITE, "middle")
        lines = wrap(q, w * 0.56, 14.5, 700)
        yy = cy - (len(lines) - 1) * 9 + 5
        for ln in lines:
            s.text(cx, yy, ln, 14.5, 700, MID, "middle")
            yy += 18

    def fixbox(x, y, w, h, title, body, color=ORA, soft=ORAS):
        s.rect(x, y, w, h, soft, color, 1.8, 10)
        s.text(x + 12, y + 22, title, 13.5, 800, color)
        s.para(x + 12, y + 41, body, w - 24, 13, 400, INK, lh=16.5)

    cx, dw, dh = 220, 300, 104
    ys = [150, 300, 450, 600, 750]
    qs = ["¿Responde la interfaz? (carga y escribe)", "¿La petición llega al backend?", "¿El backend tiene la API key?",
          "¿Qué código HTTP devuelve el proveedor?", "¿La interfaz muestra el campo reply?"]
    fixes = [("NO → revisa el frontend", "Recarga con Ctrl+F5. Abre la consola del navegador (F12) y lee el primer error en rojo."),
             ("NO → revisa la conexión", "URL y puerto del backend, que esté encendido (/docs) y la configuración CORS. Mira la pestaña Red."),
             ("NO → define la variable", "Crea OPENROUTER_API_KEY en .env (local) o en las variables de entorno de la plataforma y reinicia."),
             ("≠ 200 → mira el código", None),
             ("NO → revisa el parseo", "El frontend debe leer el campo reply del JSON. Inspecciona la respuesta en la pestaña Red.")]
    # inicio
    s.rect(cx - 90, 68, 180, 30, MID, None, 0, 15)
    s.text(cx, 88, "Envías un mensaje al chat", 13.5, 700, WHITE, "middle")
    s.arrow([(cx, 98), (cx, ys[0] - dh / 2)], SOFT)
    for i, y in enumerate(ys):
        diamond(cx, y, dw, dh, i + 1, qs[i])
        if i < 4:
            s.arrow([(cx, y + dh / 2), (cx, ys[i + 1] - dh / 2)], TEAL, 2.6)
            s.pill(cx + 26, y + dh / 2 + 15, "SÍ", 11.5, WHITE, TEAL, TEAL, 800, h=18)
        if fixes[i][1]:
            s.arrow([(cx + dw / 2, y), (466, y)], ORA, 2.6)
            s.pill(cx + dw / 2 + 24, y - 12, "NO", 11.5, WHITE, ORA, ORA, 800, h=18)
            fixbox(470, y - 44, 322, 88, fixes[i][0], fixes[i][1])
    # caja códigos
    y = ys[3]
    s.arrow([(cx + dw / 2, y), (466, y)], ORA, 2.6)
    s.pill(cx + dw / 2 + 28, y - 12, "≠ 200", 11.5, WHITE, ORA, ORA, 800, h=18)
    s.rect(470, y - 62, 322, 124, ORAS, ORA, 1.8, 10)
    s.text(482, y - 42, "Lee el código y actúa", 13.5, 800, ORA)
    rows = [("401 · 403", "clave inválida, revocada o sin permiso"), ("402 · 429", "saldo o límite (panel del proveedor)"),
            ("400 · 404", "petición, modelo o URL incorrectos"), ("5xx", "falla del proveedor: reintenta")]
    for i, (c, t) in enumerate(rows):
        yy = y - 22 + i * 22
        s.text(482, yy, c, 12.5, 800, MID, mono=True)
        s.text(556, yy, t, 12, 400, INK)
    # final
    s.arrow([(cx, ys[4] + dh / 2), (cx, 846)], TEAL, 2.6)
    s.pill(cx + 26, ys[4] + dh / 2 + 15, "SÍ", 11.5, WHITE, TEAL, TEAL, 800, h=18)
    s.rect(cx - 150, 846, 300, 40, TEALS, TEAL, 2, 20)
    s.icon_check(cx - 124, 866, 10)
    s.text(cx + 14, 871, "Funciona: guarda y celebra", 14, 700, TEAL, "middle")
    s.text(790, 914, "Plan B: copia el error EXACTO (sin claves) y pídele ayuda a tu asistente.", 12.5, 600, SOFT, "end")
    done(s, "flujo_depuracion_chat")


# =========================================================================
def flujo_turno_memoria():
    s = Svg(800, 530,
            "Flujo de un turno de chat con memoria",
            "Seis pasos. 1) El navegador envía el ID de sesión y el mensaje. 2) El backend lee los últimos N mensajes de esa sesión en Supabase, "
            "filtrando por el usuario antes de llamar al modelo. 3) Construye el prompt con el system prompt (soul.md), el historial y el mensaje nuevo. "
            "4) Llama a OpenRouter. 5) Guarda el turno completo en Supabase. 6) Devuelve la respuesta al navegador.")
    s.text(16, 30, "Un turno de chat con memoria", 20, 800, MID)
    s.text(16, 50, "Lo que hace el backend cada vez que la persona escribe", 13.5, 500, SOFT)
    steps = [("1", "ID de sesión", "El navegador envía session_id y el mensaje nuevo.", VIO),
             ("2", "Leer los últimos N", "Consulta Supabase, solo filas de ESA sesión y usuario.", TEAL),
             ("3", "Construir el prompt", "System prompt (soul.md) + historial + mensaje nuevo.", ORA),
             ("4", "Llamar a OpenRouter", "Petición con la API key leída del entorno.", BLUE),
             ("5", "Guardar el turno", "Inserta mensaje de usuario y respuesta en messages.", TEAL),
             ("6", "Responder", "Devuelve reply al frontend, que lo muestra.", VIO)]
    w, h = 230, 124
    pos = [(16, 84), (285, 84), (554, 84), (554, 260), (285, 260), (16, 260)]
    for (n, t, b, c), (x, y) in zip(steps, pos):
        s.rect(x, y, w, h, WHITE, c, 2.4, 14)
        s.rect(x, y, w, 42, c, None, 0, 14)
        s.rect(x, y + 28, w, 14, c, None, 0, 0)
        s.circle(x + 26, y + 21, 13, WHITE)
        s.text(x + 26, y + 26.5, n, 15, 800, c, "middle")
        s.text(x + 48, y + 27, t, 16, 700, WHITE)
        s.para(x + 14, y + 66, b, w - 28, 14, 400, INK, lh=19)
    s.arrow([(247, 146), (283, 146)], SOFT, 3)
    s.arrow([(516, 146), (552, 146)], SOFT, 3)
    s.arrow([(669, 210), (669, 258)], SOFT, 3)
    s.arrow([(552, 322), (516, 322)], SOFT, 3)
    s.arrow([(283, 322), (247, 322)], SOFT, 3)
    for cx_ in (400,):
        s.pill(cx_, 84 + 124, "Supabase", 11.5, TEALS, TEAL, TEAL, 700, h=19)
        s.pill(cx_, 260 + 124, "Supabase", 11.5, TEALS, TEAL, TEAL, 700, h=19)
    s.pill(669, 84 + 124 + 24, "OpenRouter", 11.5, VIOS, VIO, VIOD, 700, h=19) if False else None
    s.text(16, 428, "Un turno completo = una pregunta y su respuesta, ambas guardadas.", 13, 600, SOFT)
    s.text(16, 446, "Abrir Supabase no significa que la memoria ya funcione: hay que leer y escribir de verdad.", 13, 600, SOFT)
    s.rect(16, 462, 768, 50, REDS, RED, 1.6, 10)
    s.icon_warn(38, 487, 10, RED)
    s.para(58, 483, "Orden de seguridad: filtra por la sesión del usuario ANTES de llamar al modelo; nunca uses datos de otra sesión.", 712, 13, 700, REDD, lh=17)
    done(s, "flujo_turno_memoria")


# =========================================================================
def arquitectura_4_niveles():
    s = Svg(800, 584,
            "Arquitectura progresiva de cuatro niveles",
            "Escalera ascendente de cuatro niveles. Nivel 1: Excel y dashboard local. Nivel 2: landing local con chat simulado. "
            "Nivel 3: landing y API backend segura desplegada. Nivel 4: memoria y datos persistentes en Supabase con reglas de acceso (RLS). "
            "Arriba, en línea punteada, una arquitectura opcional futura con n8n, marcada como no implementada en la práctica.")
    s.text(16, 30, "Arquitectura progresiva en 4 niveles", 20, 800, MID)
    s.text(16, 50, "Cada nivel conserva lo anterior y agrega una capacidad", 13.5, 500, SOFT)
    lv = [("1", "Excel + dashboard local", "Datos simulados en .xlsx, FastAPI y gráficas en tu equipo.", "Corre en: tu computadora", VIO, VIOS),
          ("2", "Landing local + chat simulado", "Página del restaurante; el chat contesta con reglas, sin modelo real.", "Corre en: tu computadora", TEAL, TEALS),
          ("3", "Landing + API backend segura", "Backend desplegado; la API key vive en variables de entorno.", "Corre en: nube (p. ej. Vercel)", ORA, ORAS),
          ("4", "Memoria y datos persistentes", "Supabase con tablas y reglas de acceso (RLS) por usuario.", "Corre en: nube + base de datos", BLUE, BLUES)]
    w = 560
    for i, (n, t, b, where, c, cs) in enumerate(lv):
        x = 16 + i * 56
        y = 470 - i * 108
        s.rect(x, y, w, 92, cs, c, 2.4, 14)
        s.circle(x + 32, y + 46, 20, c)
        s.text(x + 32, y + 53, n, 21, 800, WHITE, "middle")
        s.text(x + 66, y + 28, t, 16.5, 800, MID)
        s.para(x + 66, y + 49, b, w - 90, 13.5, 400, INK, lh=17.5)
        s.text(x + 66, y + 82, where, 12.5, 700, c)
    s.para(16, 92, "Subir de nivel es AGREGAR una capacidad, no rehacerlo todo.", 160, 14, 700, MID, lh=19)
    s.para(16, 168, "Cada nivel puede explicarse, probarse y detenerse ahí con un resultado útil.", 160, 13, 400, SOFT, lh=17)
    s.rect(414, 60, 370, 70, "none", MUTE, 1.8, 12, "7 5")
    s.text(428, 84, "OPCIONAL FUTURO · n8n", 12.5, 800, MUTE, spacing=0.8)
    s.para(428, 104, "Automatizaciones con webhooks. NO se implementó en esta práctica.", 345, 13, 500, MUTE, lh=17)
    s.arrow([(600, 132), (600, 144)], MUTE, 2, "4 4", head=8)
    done(s, "arquitectura_4_niveles")


# =========================================================================
def flujo_seguro_api_key():
    s = Svg(800, 560,
            "Dónde guardar la API key: incorrecto frente a correcto",
            "Dos paneles. A la izquierda, el camino incorrecto en rojo: la clave escrita en el código del frontend, pegada en un chat o prompt, "
            "o dentro de un archivo .env subido a un repositorio público; cualquiera puede leerla. A la derecha, el camino correcto en verde azulado: el navegador llama a "
            "tu backend, que lee la clave de una variable de entorno y es el único que habla con OpenRouter. Si una clave se expone, hay que revocarla y crear otra.")
    s.text(16, 30, "¿Dónde vive la API key?", 20, 800, MID)
    s.text(16, 50, "La regla no tiene excepciones: solo en el backend, solo en variables de entorno", 13.5, 500, SOFT)
    # Izquierda: incorrecto
    s.rect(12, 70, 382, 400, REDS, RED, 2, 16)
    s.rect(12, 70, 382, 42, RED, None, 0, 16); s.rect(12, 96, 382, 16, RED, None, 0, 0)
    s.icon_cross(38, 91, 11, WHITE); s.add(f'<path d="M32.5 85.5 L43.5 96.5 M43.5 85.5 L32.5 96.5" stroke="{RED}" stroke-width="2.6" stroke-linecap="round"/>')
    s.text(60, 98, "INCORRECTO", 16, 800, WHITE, spacing=1.2)
    bad = [("script.js", "const KEY = \"sk-or-…\"", "Clave dentro del frontend"),
           ("Chat / prompt", "“Usa mi clave sk-or-…”", "Clave pegada en un chat"),
           (".env en GitHub", "OPENROUTER_API_KEY=…", "Archivo secreto en el repositorio")]
    for i, (a, b, c) in enumerate(bad):
        y = 130 + i * 92
        s.rect(28, y, 350, 78, WHITE, RED, 1.6, 10)
        s.text(42, y + 24, a, 13, 700, RED, mono=True)
        s.text(42, y + 45, b, 12.5, 500, INK, mono=True)
        s.text(42, y + 65, c, 13, 600, SOFT)
    s.rect(28, 408, 350, 50, WHITE, RED, 1.6, 10)
    s.icon_warn(52, 433, 11, RED)
    s.para(72, 428, "Cualquiera puede leerla: la verán otras personas, bots y registros públicos.", 296, 13, 700, REDD, lh=16.5)
    # Derecha: correcto
    s.rect(406, 70, 382, 400, TEALS, TEAL, 2, 16)
    s.rect(406, 70, 382, 42, TEAL, None, 0, 16); s.rect(406, 96, 382, 16, TEAL, None, 0, 0)
    s.icon_check(432, 91, 11, WHITE); s.add(f'<path d="M426.8 91 L430.6 95 L437.5 87" fill="none" stroke="{TEAL}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
    s.text(454, 98, "CORRECTO", 16, 800, WHITE, spacing=1.2)
    # navegador
    s.rect(424, 134, 130, 70, WHITE, TEAL, 1.8, 10)
    s.icon_browser(434, 148, 30, 24, TEAL)
    s.text(472, 165, "Navegador", 13, 700, MID)
    s.text(436, 190, "sin ninguna clave", 12, 500, SOFT)
    s.rect(630, 134, 142, 70, WHITE, TEAL, 1.8, 10)
    s.icon_lock(642, 146, 28, TEAL)
    s.text(678, 164, "Backend", 14, 700, MID)
    s.text(642, 190, "único con la clave", 12, 500, SOFT)
    s.arrow([(554, 169), (628, 169)], TEAL, 2.8)
    s.pill(591, 152, "/api/chat", 11.5, WHITE, TEAL, TEAL, 700, h=19)
    s.rect(630, 238, 142, 64, MID, None, 0, 10)
    s.icon_key(642, 250, 24, ORAB)
    s.text(672, 266, "Variable de", 12.5, 700, WHITE)
    s.text(672, 282, "entorno", 12.5, 700, WHITE)
    s.text(642, 296, "", 11, 400, WHITE)
    s.arrow([(701, 236), (701, 207)], ORAB, 2.6)
    s.rect(630, 336, 142, 56, WHITE, VIO, 1.8, 10)
    s.text(701, 360, "OpenRouter", 14, 700, MID, "middle")
    s.text(701, 378, "recibe la clave", 12, 500, SOFT, "middle")
    s.arrow([(701, 302), (701, 334)], TEAL, 2.8)
    s.para(424, 252, "En local: archivo .env ignorado por Git (.gitignore).", 190, 13, 500, INK, lh=17)
    s.para(424, 302, "En la nube: Environment Variables del proyecto en la plataforma.", 190, 13, 500, INK, lh=17)
    s.rect(422, 408, 350, 50, WHITE, TEAL, 1.6, 10)
    s.icon_check(446, 433, 11, TEAL)
    s.para(466, 428, "El navegador nunca ve la clave; solo ve la respuesta del backend.", 296, 13, 700, "#06524F", lh=16.5)
    # banner inferior
    s.rect(12, 486, 776, 56, MID, None, 0, 12)
    s.icon_warn(40, 514, 13, ORAB)
    s.para(64, 508, "¿Se expuso una clave? Revócala de inmediato en el panel del proveedor, crea otra y actualiza la variable de entorno. Borrar el mensaje no basta.", 712, 13.5, 600, WHITE, lh=18)
    done(s, "flujo_seguro_api_key")


# =========================================================================
def github_web_vs_cli():
    s = Svg(800, 560,
            "GitHub: ruta web frente a GitHub CLI",
            "Dos rutas hacia el mismo resultado, un repositorio en GitHub. Ruta A, web sin terminal: New repository, nombrar y crear, subir archivos con Upload files y confirmar con Commit changes. "
            "Ruta B, GitHub CLI en Windows: gh auth login, git init, git add, git commit y gh repo create o git push. Los pasos detallados están en la guía 02.")
    s.text(16, 30, "Dos rutas, un mismo repositorio", 20, 800, MID)
    s.text(16, 50, "Elige según tu comodidad; el resultado es el mismo", 13.5, 500, SOFT)
    cols = [(12, "RUTA A · GitHub WEB", "Sin terminal · en el navegador", VIO, VIOS,
             [("New repository", "Botón en la página principal de GitHub"),
              ("Nombrar y crear", "Nombre, público o privado, Create repository"),
              ("Upload files", "Arrastra tus archivos a la página"),
              ("Commit changes", "Confirma el guardado")]),
            (406, "RUTA B · GitHub CLI", "Terminal PowerShell en Windows", TEAL, TEALS,
             [("gh auth login", "Inicia sesión desde la terminal"),
              ("git init", "Prepara la carpeta como repositorio"),
              ("git add . + git commit", "Prepara y guarda una versión"),
              ("gh repo create", "Crea el repositorio remoto y sube")])]
    for x, t, sub, c, cs, steps in cols:
        s.rect(x, 70, 382, 380, cs, c, 2, 16)
        s.rect(x, 70, 382, 56, c, None, 0, 16); s.rect(x, 100, 382, 26, c, None, 0, 0)
        s.text(x + 18, 96, t, 16.5, 800, WHITE, spacing=0.4)
        s.text(x + 18, 116, sub, 12.5, 500, "#F2EFFF")
        for i, (a, b) in enumerate(steps):
            y = 142 + i * 74
            s.circle(x + 38, y + 30, 15, c)
            s.text(x + 38, y + 36, str(i + 1), 15, 800, WHITE, "middle")
            if i < 3:
                s.line(x + 38, y + 46, x + 38, y + 90, "#C9C1E8" if c == VIO else "#9FD6D2", 2.2)
            s.rect(x + 66, y, 300, 62, WHITE, RULE, 1.4, 10)
            mono = (c == TEAL)
            s.text(x + 80, y + 26, a, 14.5 if not mono else 13.5, 700, MID, mono=mono)
            s.para(x + 80, y + 46, b, 276, 12.5, 400, SOFT, lh=15)
    s.rect(12, 470, 776, 72, MID, None, 0, 14)
    s.icon_db(34, 485, 28, 32, TEALB, MID)
    s.text(78, 500, "Resultado: un repositorio con tu proyecto en GitHub", 16, 800, WHITE)
    s.text(78, 521, "Los pasos exactos y capturas están en la guía 02. Nunca subas .env ni claves.", 13, 500, "#D9D6EE")
    done(s, "github_web_vs_cli")


# =========================================================================
def vercel_preview_vs_production():
    s = Svg(800, 500,
            "Vercel: despliegue de vista previa frente a producción",
            "Flujo de un repositorio de GitHub conectado a Vercel. Un push a una rama de trabajo genera un despliegue de vista previa con una URL propia para probar. "
            "Un push o fusión a la rama de producción, normalmente main, genera el despliegue de producción en el dominio del proyecto. "
            "Las variables de entorno se configuran por entorno: Production, Preview y Development.")
    s.text(16, 30, "Vercel: vista previa vs. producción", 20, 800, MID)
    s.text(16, 50, "Cada push al repositorio dispara un nuevo despliegue", 13.5, 500, SOFT)
    # repo
    s.rect(16, 190, 150, 110, WHITE, VIOD, 2.2, 14)
    s.icon_db(30, 204, 28, 32, VIOD)
    s.text(68, 224, "GitHub", 16, 800, MID)
    s.text(30, 262, "Repositorio", 13, 600, SOFT)
    s.text(30, 280, "del proyecto", 13, 500, SOFT)
    # ramas
    s.rect(236, 92, 190, 82, VIOS, VIO, 2, 12)
    s.text(250, 118, "Rama de trabajo", 15, 800, VIOD)
    s.text(250, 140, "ej. mejora-chat", 12.5, 500, VIOD, mono=True)
    s.text(250, 160, "push / pull request", 12, 500, SOFT)
    s.rect(236, 316, 190, 82, TEALS, TEAL, 2, 12)
    s.text(250, 342, "Rama de producción", 15, 800, TEAL)
    s.text(250, 364, "normalmente main", 12.5, 500, TEAL, mono=True)
    s.text(250, 384, "push o merge", 12, 500, SOFT)
    s.arrow([(166, 220), (200, 220), (200, 133), (234, 133)], VIOD, 2.6)
    s.arrow([(166, 270), (200, 270), (200, 357), (234, 357)], TEAL, 2.6)
    # build
    s.rect(486, 92, 126, 82, WHITE, RULE2, 1.8, 12)
    s.icon_gear(522, 122, 13, SOFT)
    s.text(549, 128, "Build", 14, 700, MID)
    s.text(549, 148, "en Vercel", 12, 500, SOFT)
    s.rect(486, 316, 126, 82, WHITE, RULE2, 1.8, 12)
    s.icon_gear(522, 346, 13, SOFT)
    s.text(549, 352, "Build", 14, 700, MID)
    s.text(549, 372, "en Vercel", 12, 500, SOFT)
    s.arrow([(426, 133), (484, 133)], VIO, 2.6)
    s.arrow([(426, 357), (484, 357)], TEAL, 2.6)
    # resultados
    s.rect(660, 78, 128, 110, VIOS, VIO, 2.2, 12)
    s.text(724, 108, "VISTA PREVIA", 12.5, 800, VIOD, "middle", spacing=0.8)
    s.para(668, 130, "URL única para probar sin tocar producción", 112, 12.5, 500, INK, "middle", lh=15.5)
    s.rect(660, 302, 128, 110, TEALS, TEAL, 2.2, 12)
    s.text(724, 332, "PRODUCCIÓN", 12.5, 800, TEAL, "middle", spacing=0.8)
    s.para(668, 354, "Dominio del proyecto que comparte tu audiencia", 112, 12.5, 500, INK, "middle", lh=15.5)
    s.arrow([(612, 133), (658, 133)], VIO, 2.6)
    s.arrow([(612, 357), (658, 357)], TEAL, 2.6)
    # env vars
    s.rect(16, 428, 768, 56, MID, None, 0, 12)
    s.icon_key(34, 442, 24, ORAB)
    s.text(70, 452, "Environment Variables se definen por entorno:", 13.5, 700, WHITE)
    for i, (t, c) in enumerate([("Production", TEALB), ("Preview", VIOB), ("Development", ORAB)]):
        s.pill(110 + i * 112 + 40, 470, t, 12, WHITE, c, MID, 700, h=20) if False else None
    s.text(70, 471, "Production  ·  Preview  ·  Development", 13, 700, TEALB)
    s.text(776, 471, "Tras cambiarlas, vuelve a desplegar.", 12.5, 500, "#D9D6EE", "end")
    done(s, "vercel_preview_vs_production")


# =========================================================================
def n8n_futuro_no_implementado():
    s = Svg(800, 460,
            "Arquitectura futura con n8n — no implementada en la práctica",
            "Diagrama punteado y atenuado. La landing o el chat envía un evento a un webhook de n8n; el flujo de trabajo procesa con un modelo de lenguaje, "
            "guarda en una base de datos o una hoja y avisa por correo o mensajería. Está rotulado como arquitectura futura, no implementada en la práctica de la clase.")
    s.rect(0, 0, 800, 460, IVORY, None, 0, 0)
    s.rect(12, 12, 776, 436, "none", MUTE, 2, 16, "10 7")
    s.badge(28, 26, "ARQUITECTURA FUTURA", MUTE, WHITE, 12.5, 800, 1.2)
    s.text(28, 78, "Arquitectura futura — no implementada en la práctica", 20, 800, MID)
    s.text(28, 100, "Idea para el Nivel 2 del curso: conectar n8n con tus creaciones de vibe coding", 13.5, 500, SOFT)
    nodes = [("Landing o chat", "El usuario escribe o envía un formulario", 28),
             ("Webhook", "Punto de entrada del flujo en n8n", 222),
             ("Procesar", "Modelo de lenguaje y reglas", 416),
             ("Guardar y avisar", "Base de datos u hoja + notificación", 610)]
    for t, b, x in nodes:
        s.rect(x, 150, 160, 130, WHITE, MUTE, 2, 12, "6 4")
        s.text(x + 80, 186, t, 16.5, 800, "#2E3555", "middle")
        s.para(x + 12, 210, b, 136, 13, 400, SOFT, "middle", lh=16.5)
    for i in range(3):
        s.arrow([(190 + i * 194 + 2, 215), (220 + i * 194 - 2, 215)], MUTE, 2.6, "5 4")
    s.rect(28, 316, 744, 100, ORAS, ORA, 1.8, 12)
    s.icon_warn(54, 366, 13, ORA)
    s.para(80, 346, "NO se construyó ni se probó en la sesión. Un webhook vacío no es un flujo funcional.", 672, 14.5, 800, "#7A3200", lh=19)
    s.para(80, 388, "PENDIENTE DE COMPROBAR: nodos, credenciales y límites del plan se verificarán en la documentación oficial antes de enseñarlo.", 672, 13.5, 500, INK, lh=18)
    done(s, "n8n_futuro_no_implementado")


def main():
    for fn in (arquitectura_general, localhost_vs_pages_vs_vercel, excel_fastapi_dashboard_asistente, modelo_datos_memoria,
               linea_tiempo_sesion, flujo_depuracion_chat, flujo_turno_memoria, arquitectura_4_niveles, flujo_seguro_api_key,
               github_web_vs_cli, vercel_preview_vs_production, n8n_futuro_no_implementado):
        fn()
    try:
        import gen_esquemas_ui
        gen_esquemas_ui.run(OUT, ALT)
    except ImportError:
        print("(sin gen_esquemas_ui todavía)")
    # ALT_TEXT.md
    lines = ["# Texto alternativo de los diagramas", "",
             "Cada SVG incluye `<title>` y `<desc>` equivalentes. Úsalo como `alt` en `<img>` (resumen breve) y como descripción larga en fuentes editables.", ""]
    for name in sorted(ALT):
        t, d = ALT[name]
        lines += [f"## {name}.svg", "", f"**Título:** {t}", "", f"**Descripción:** {d}", ""]
    (OUT / "ALT_TEXT.md").write_text("\n".join(lines), encoding="utf-8")
    print("SVG generados:", len(ALT), "->", OUT)


if __name__ == "__main__":
    main()
