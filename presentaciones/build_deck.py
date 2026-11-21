# -*- coding: utf-8 -*-
"""Genera la presentación 'Puerto A&M — Siguientes pasos de la automatización'.
Uso: python3 build_deck.py  (escribe el .pptx junto a este script; el PDF se hace con LibreOffice)."""
import os
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.oxml.ns import qn
from lxml import etree

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "Puerto_AM_Siguientes_Pasos_Automatizacion_Viridiana.pptx")

# Paleta
BLUE = "0081FB"; DEEP = "0064E0"; NAVY = "0A1F44"; SOFT = "E7F3FF"
GRAY = "65676B"; LINE = "E5E5E5"; WHITE = "FFFFFF"; CONN = "B0B3B8"
FONT = "Inter"; FALLBACK = "Segoe UI"

# Medidas
W, H = 13.333, 7.5
MX, MY = 0.9, 0.6
CW = W - 2 * MX            # 11.533
FOOT_Y = 6.62

def rgb(h): return RGBColor.from_string(h)

prs = Presentation()
prs.slide_width = Inches(W); prs.slide_height = Inches(H)
BLANK = prs.slide_layouts[6]

def set_fonts(run, size, bold, color):
    f = run.font
    f.size = Pt(size); f.bold = bold; f.color.rgb = rgb(color); f.name = FONT
    rPr = run._r.get_or_add_rPr()
    for tag in ("a:ea", "a:cs"):
        el = rPr.find(qn(tag))
        if el is None:
            el = etree.SubElement(rPr, qn(tag))
        el.set("typeface", FALLBACK)

def text(slide, x, y, w, h, content, size=18, bold=False, color=NAVY,
         align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, spacing=1.1):
    """content: str o lista de párrafos (str o lista de (texto, dict) runs)."""
    tb = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame; tf.word_wrap = True; tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = anchor
    paras = content if isinstance(content, list) else [content]
    for i, p in enumerate(paras):
        para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        para.alignment = align; para.line_spacing = spacing
        runs = p if isinstance(p, list) else [(p, {})]
        for t, o in runs:
            r = para.add_run(); r.text = t
            set_fonts(r, o.get("size", size), o.get("bold", bold), o.get("color", color))
    return tb

def card(slide, x, y, w, h, fill=WHITE, border=LINE, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = 0.07
    s.fill.solid(); s.fill.fore_color.rgb = rgb(fill)
    if border:
        s.line.color.rgb = rgb(border); s.line.width = Pt(0.75)
    else:
        s.line.fill.background()
    # sin sombra
    spPr = s._element.spPr
    if spPr.find(qn("a:effectLst")) is None:
        etree.SubElement(spPr, qn("a:effectLst"))
    s.text_frame.text = ""
    return s

def shape(slide, kind, x, y, w, h, fill=BLUE, line=None):
    s = slide.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    s.fill.solid(); s.fill.fore_color.rgb = rgb(fill)
    if line:
        s.line.color.rgb = rgb(line); s.line.width = Pt(0.75)
    else:
        s.line.fill.background()
    spPr = s._element.spPr
    if spPr.find(qn("a:effectLst")) is None:
        etree.SubElement(spPr, qn("a:effectLst"))
    return s

def rect(slide, x, y, w, h, fill):
    return shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, h, fill)

def line(slide, x1, y1, x2, y2, color=CONN, width=1.25, arrow=False):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = rgb(color); c.line.width = Pt(width)
    if arrow:
        ln = c.line._get_or_add_ln()
        te = etree.SubElement(ln, qn("a:tailEnd")); te.set("type", "triangle"); te.set("w", "med"); te.set("len", "med")
    return c

def circle_num(slide, x, y, d, label, fill=BLUE, color=WHITE, size=18):
    c = shape(slide, MSO_SHAPE.OVAL, x, y, d, d, fill)
    tf = c.text_frame
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE; tf.word_wrap = False
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = label; set_fonts(r, size, True, color)
    return c

def title(slide, t):
    text(slide, MX, MY, CW, 0.7, t, size=36, bold=True, color=NAVY, anchor=MSO_ANCHOR.TOP)
    rect(slide, MX, 1.42, 0.6, 0.05, BLUE)

def footer(slide, n):
    line(slide, MX, FOOT_Y, W - MX, FOOT_Y, color=LINE, width=0.75)
    text(slide, MX, FOOT_Y + 0.1, 6, 0.25, "Puerto A&M · Seguimiento del proyecto", size=12, color=GRAY)
    text(slide, W - MX - 1, FOOT_Y + 0.1, 1, 0.25, str(n), size=12, color=GRAY, align=PP_ALIGN.RIGHT)

def notes(slide, t):
    slide.notes_slide.notes_text_frame.text = t

def new(n, ttl=None):
    s = prs.slides.add_slide(BLANK)
    if ttl: title(s, ttl)
    footer(s, n)
    return s

# ---------- 1 Portada ----------
s = new(1)
rect(s, MX, 2.35, 1.4, 0.05, BLUE)
text(s, MX, 2.65, 10.6, 1.5, "Puerto A&M — Siguientes pasos de la automatización",
     size=40, bold=True, color=NAVY, spacing=1.08)
text(s, MX, 4.35, 10, 0.5, "Seguimiento del flujo de n8n con Viridiana", size=20, color=GRAY)
# motivo discreto: cadena de nodos
x0, y0 = MX, 5.65
line(s, x0 + 0.1, y0 + 0.1, x0 + 4.1, y0 + 0.1, color=LINE, width=1.25)
for i in range(5):
    d = 0.2
    shape(s, MSO_SHAPE.OVAL, x0 + i * 1.0, y0, d, d, BLUE if i == 4 else SOFT, line=None if i == 4 else BLUE)
notes(s, "Damos la bienvenida a Viridiana y presentamos el objetivo de la sesión: repasar los siguientes pasos de la automatización con n8n para Puerto A&M. "
         "Es una sesión de seguimiento para alinear qué sigue y en qué orden.")

# ---------- 2 Objetivo ----------
s = new(2, "Objetivo del proyecto")
items = ["Automatizar egresos, ingresos y ventas", "Reducir captura manual",
         "Mejorar control financiero", "Reportes claros para administración, socios y contadores"]
gap = 0.3; cw = (CW - 3 * gap) / 4; cy, ch = 2.1, 3.5

def icon(slide, kind, cx, cy_):
    d = 0.8
    shape(slide, MSO_SHAPE.OVAL, cx, cy_, d, d, SOFT)
    if kind == 0:
        shape(slide, MSO_SHAPE.GEAR_6, cx + 0.2, cy_ + 0.2, 0.4, 0.4, BLUE)
    elif kind == 1:
        shape(slide, MSO_SHAPE.DOWN_ARROW, cx + 0.26, cy_ + 0.2, 0.28, 0.4, BLUE)
    elif kind == 2:
        shape(slide, MSO_SHAPE.DONUT, cx + 0.2, cy_ + 0.2, 0.4, 0.4, BLUE)
        shape(slide, MSO_SHAPE.OVAL, cx + 0.33, cy_ + 0.33, 0.14, 0.14, BLUE)
    else:
        for j, hh in enumerate((0.16, 0.28, 0.4)):
            shape(slide, MSO_SHAPE.RECTANGLE, cx + 0.22 + j * 0.14, cy_ + 0.6 - hh, 0.1, hh, BLUE)

for i, t in enumerate(items):
    x = MX + i * (cw + gap)
    card(s, x, cy, cw, ch, fill=WHITE)
    icon(s, i, x + 0.3, cy + 0.35)
    text(s, x + 0.3, cy + 1.5, cw - 0.6, 1.6, t, size=18, bold=True, color=NAVY)
notes(s, "El proyecto busca automatizar egresos, ingresos y ventas para reducir la captura manual. "
         "Con ello mejoramos el control financiero y entregamos reportes claros a administración, socios y contadores.")

# ---------- 3 Ya definido ----------
s = new(3, "Qué ya está definido")
g = 0.4; pw = (CW - 2 * g) / 3; py, ph = 1.95, 1.65
phases = [("FASE 1", "Egresos"), ("FASE 2", "Ingresos, cobros y ventas"), ("FASE 3", "Control y decisiones")]
for i, (lb, t) in enumerate(phases):
    x = MX + i * (pw + g)
    card(s, x, py, pw, ph, fill=SOFT if i == 0 else WHITE)
    text(s, x + 0.3, py + 0.28, pw - 0.6, 0.3, lb, size=12, bold=True, color=BLUE)
    text(s, x + 0.3, py + 0.68, pw - 0.6, 0.8, t, size=18, bold=True, color=NAVY)
    if i < 2:
        line(s, x + pw + 0.08, py + ph / 2, x + pw + g - 0.08, py + ph / 2, color=CONN, width=1.25, arrow=True)
rows = [("FUENTES", "Gmail, Drive, BBVA / Banamex / HSBC / Amex, National Soft, SAT/contador, gastos sin factura"),
        ("LÓGICA", "Clasificar, detectar duplicados, conciliar y excepciones con revisión humana"),
        ("REPORTES", "Contadores, socios y dashboard privado de Viridiana")]
g2 = 0.25; rw = (CW - 2 * g2) / 3; ry, rh = 4.0, 2.2
for i, (lb, t) in enumerate(rows):
    x = MX + i * (rw + g2)
    card(s, x, ry, rw, rh, fill=WHITE)
    text(s, x + 0.3, ry + 0.28, rw - 0.6, 0.3, lb, size=12, bold=True, color=BLUE)
    text(s, x + 0.3, ry + 0.7, rw - 0.6, 1.4, t, size=14, color=NAVY, spacing=1.2)
notes(s, "Ya tenemos definidas tres fases: egresos, ingresos con cobros y ventas, y control con decisiones. "
         "También están definidas las fuentes de información, la lógica de clasificación y conciliación con revisión humana, y los reportes para contadores, socios y el dashboard privado de Viridiana.")

# ---------- 4 Flujo ----------
s = new(4, "Cómo funcionará el flujo")
n = 5; g = 0.34; nw = (CW - (n - 1) * g) / n; ny, nh = 2.0, 3.2
nodes = [("Fuentes", "Gmail, Drive, bancos, National Soft, SAT/contador, gastos manuales"),
         ("Procesamiento en n8n", "Flujos automatizados"),
         ("Clasificación y conciliación", "Clasificar, detectar duplicados y conciliar"),
         ("Revisión humana", "Excepciones"),
         ("Reportes y dashboard", "Contadores, socios y dashboard de Viridiana")]
for i, (t, d) in enumerate(nodes):
    x = MX + i * (nw + g)
    card(s, x, ny, nw, nh, fill=SOFT if i == 3 else WHITE)
    circle_num(s, x + 0.22, ny + 0.25, 0.46, str(i + 1), size=14)
    text(s, x + 0.2, ny + 0.95, nw - 0.3, 0.9, t, size=16, bold=True, color=NAVY)
    text(s, x + 0.2, ny + 1.95, nw - 0.3, 1.1, d, size=12, color=GRAY, spacing=1.15)
    if i < n - 1:
        line(s, x + nw + 0.06, ny + nh / 2, x + nw + g - 0.06, ny + nh / 2, arrow=True)
text(s, MX, 5.6, CW, 0.6,
     [[("También contempla: ", {"bold": True, "color": NAVY}),
       ("cuentas por pagar, CFDI y sin CFDI, pagos parciales, retiros y caja, alzas de precio por proveedor", {})]],
     size=14, color=GRAY, spacing=1.2)
notes(s, "El flujo parte de las fuentes de información, pasa por el procesamiento en n8n y luego por la clasificación y conciliación. "
         "Lo que no cuadre pasa a revisión humana antes de llegar a los reportes y al dashboard. También contempla cuentas por pagar, CFDI y sin CFDI, pagos parciales, retiros y caja, y alzas de precio por proveedor.")

# ---------- 5 Checklist ----------
s = new(5, "Qué hace falta completar")
todo = ["Hostinger, dominio y n8n estables", "Carpeta central de Drive", "Conectar Gmail y Drive",
        "Integrar archivos bancarios reales", "Integrar National Soft", "Reportes SAT/contador",
        "Plantilla de gastos sin factura", "Probar con datos reales", "Ajustar conciliación, excepciones y dashboard"]
colg = 0.4; colw = (CW - colg) / 2; rh = 0.72; rg = 0.12; y0 = 1.95
for i, t in enumerate(todo):
    col, row = (0, i) if i < 5 else (1, i - 5)
    x = MX + col * (colw + colg); y = y0 + row * (rh + rg)
    card(s, x, y, colw, rh, fill=WHITE)
    cb = shape(s, MSO_SHAPE.ROUNDED_RECTANGLE, x + 0.28, y + (rh - 0.3) / 2, 0.3, 0.3, WHITE, line=BLUE)
    cb.adjustments[0] = 0.18; cb.line.width = Pt(1.5)
    text(s, x + 0.8, y, colw - 1.0, rh, t, size=18, color=NAVY, anchor=MSO_ANCHOR.MIDDLE, spacing=1.0)
notes(s, "Esta es la lista de pendientes para completar el flujo: infraestructura estable, carpeta central en Drive, conexión de Gmail y Drive, e integración de archivos bancarios, National Soft y reportes SAT/contador. "
         "También falta la plantilla de gastos sin factura, probar con datos reales y ajustar la conciliación, las excepciones y el dashboard.")

# ---------- 6 Timeline ----------
s = new(6, "Cómo seguiremos trabajando")
steps = ["Preparar estructura documental", "Conectar herramientas", "Probar flujo base",
         "Validar resultados", "Ajustar errores", "Escalar a más módulos"]
n = 6; colw = CW / n; ty = 2.15; d = 0.7
line(s, MX + d / 2, ty + d / 2, MX + CW - colw + d / 2, ty + d / 2, color=CONN, width=1.5)
for i, t in enumerate(steps):
    x = MX + i * colw
    circle_num(s, x, ty, d, str(i + 1), fill=BLUE, size=18)
    text(s, x, ty + 1.05, colw - 0.2, 1.5, t, size=18, bold=True, color=NAVY)
band = card(s, MX, 5.0, CW, 1.1, fill=SOFT, border=None)
text(s, MX + 0.4, 5.0, CW - 0.8, 1.1, "Acompañamiento por etapas: avanzamos cuando cada pieza funciona.",
     size=18, bold=True, color=NAVY, anchor=MSO_ANCHOR.MIDDLE)
notes(s, "Trabajaremos en seis pasos: preparar la estructura documental, conectar herramientas, probar el flujo base, validar resultados, ajustar errores y escalar a más módulos. "
         "La idea es acompañar por etapas y avanzar solo cuando cada pieza funcione.")

# ---------- 7 Prioridades ----------
s = new(7, "Prioridades inmediatas")
pr = ["Dejar lista la carpeta principal", "Validar conexión con n8n", "Cargar primeros archivos reales",
      "Probar extracción de facturas", "Probar gastos sin factura", "Revisar resultados de conciliación"]
g = 0.3; cw = (CW - 2 * g) / 3; ch = 2.0; y0 = 1.95
for i, t in enumerate(pr):
    r, c = divmod(i, 3)
    x = MX + c * (cw + g); y = y0 + r * (ch + g)
    card(s, x, y, cw, ch, fill=WHITE)
    text(s, x + 0.3, y + 0.25, 1.2, 0.6, f"{i + 1:02d}", size=36, bold=True, color=BLUE)
    text(s, x + 0.3, y + 1.0, cw - 0.6, 0.9, t, size=18, bold=True, color=NAVY)
notes(s, "Estas son las seis prioridades inmediatas, en orden: dejar lista la carpeta principal, validar la conexión con n8n y cargar los primeros archivos reales. "
         "Después probamos la extracción de facturas y los gastos sin factura, y revisamos los resultados de la conciliación.")

# ---------- 8 Cierre ----------
s = new(8)
rect(s, MX, 1.55, 1.4, 0.05, BLUE)
text(s, MX, 1.9, CW, 2.0,
     [[("Primero que funcione.", {})], [("Después, refinarlo.", {"color": BLUE})]],
     size=40, bold=True, color=NAVY, spacing=1.1)
pts = ["No complicar el proceso", "Un sistema útil, claro y confiable", "Próximas asesorías: implementación y validación"]
g = 0.4; pw = (CW - 2 * g) / 3
for i, t in enumerate(pts):
    x = MX + i * (pw + g)
    line(s, x, 4.6, x + pw, 4.6, color=LINE, width=1)
    rect(s, x, 4.58, 0.5, 0.045, BLUE)
    text(s, x, 4.85, pw - 0.1, 1.2, t, size=18, color=NAVY)
notes(s, "Cerramos con la idea central: primero lograr que el flujo funcione y después refinarlo. "
         "Buscamos no complicar el proceso y tener un sistema útil, claro y confiable. Las próximas asesorías se enfocarán en implementación y validación.")

# Quitar sombras heredadas del tema (effectRef idx=0) en todas las formas y conectores
for sl in prs.slides:
    for er in sl.shapes._spTree.iter(qn("a:effectRef")):
        er.set("idx", "0")

prs.save(OUT)
print("OK", OUT)
