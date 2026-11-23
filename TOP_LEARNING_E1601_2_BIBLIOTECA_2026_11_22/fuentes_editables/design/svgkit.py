# -*- coding: utf-8 -*-
"""
svgkit.py — Mini-biblioteca para dibujar diagramas SVG originales (sin logos de marcas)
con la paleta de Top Learning. Usada por gen_diagramas.py.

Convenciones:
  * viewBox de 800 unidades de ancho: 1 unidad ≈ 0.21 mm al imprimir a 170 mm.
    Texto mínimo 13 unidades (≈ 7.8 pt). Texto cuerpo 14-15; títulos 16-20.
  * Solo primitivas SVG 1.1 que WeasyPrint renderiza bien (rect, path, circle, line,
    polygon, text). Sin filtros ni foreignObject.
"""
from html import escape
from PIL import ImageFont

# Paleta
MID = "#0B1230"; GRAPH = "#1E2540"; INK = "#171D33"; SOFT = "#454D6B"; MUTE = "#5F6784"
IVORY = "#FBF8F1"; IVORY2 = "#F3EEE1"; RULE = "#DDD6C5"; RULE2 = "#B9B09A"; WHITE = "#FFFFFF"
VIO = "#5B3FD9"; VIOD = "#43299F"; VIOS = "#ECE8FB"; VIOB = "#A592FF"
TEAL = "#0A7C78"; TEALS = "#DDF3F1"; TEALB = "#3DD9CF"
ORA = "#B8500A"; ORAS = "#FDEBD9"; ORAB = "#FF9A3C"
RED = "#B3261E"; REDS = "#FCE9E7"; REDD = "#7F1710"
BLUE = "#1F5FBF"; BLUES = "#E4EEFB"

SANS = "Inter, 'Helvetica Neue', Arial, sans-serif"
MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace"
_FONTS = {}
_FP = {400: "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
       500: "/usr/share/fonts/opentype/inter/Inter-Medium.otf",
       600: "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf",
       700: "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
       800: "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf"}
_MONO_P = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf"


def _font(weight, size, mono=False):
    key = (weight, round(size * 4), mono)
    if key not in _FONTS:
        path = _MONO_P if mono else _FP.get(weight, _FP[400])
        _FONTS[key] = ImageFont.truetype(path, size * 4)
    return _FONTS[key]


def tw(s, size=14, weight=400, mono=False):
    """Ancho aproximado del texto en unidades SVG."""
    return _font(weight, size, mono).getlength(s) / 4.0


def wrap(s, maxw, size=14, weight=400, mono=False):
    words = s.split(" ")
    lines, cur = [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if tw(t, size, weight, mono) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


class Svg:
    def __init__(self, w, h, title, desc, bg=WHITE):
        self.w, self.h, self.title, self.desc = w, h, title, desc
        self.parts = []
        if bg:
            self.parts.append(f'<rect x="0" y="0" width="{w}" height="{h}" fill="{bg}"/>')

    # ---- primitivas
    def add(self, s):
        self.parts.append(s)

    def rect(self, x, y, w, h, fill="none", stroke=None, sw=1.5, rx=10, dash=None, opacity=None):
        a = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{sw}"'
        if dash:
            a += f' stroke-dasharray="{dash}"'
        if opacity is not None:
            a += f' opacity="{opacity}"'
        self.add(a + "/>")

    def circle(self, cx, cy, r, fill="none", stroke=None, sw=1.5):
        a = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"'
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{sw}"'
        self.add(a + "/>")

    def line(self, x1, y1, x2, y2, color=RULE2, w=1.5, dash=None):
        a = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"'
        if dash:
            a += f' stroke-dasharray="{dash}"'
        self.add(a + "/>")

    def path(self, d, fill="none", stroke=None, sw=1.5, dash=None, cap="round", join="round"):
        a = f'<path d="{d}" fill="{fill}"'
        if stroke:
            a += f' stroke="{stroke}" stroke-width="{sw}" stroke-linecap="{cap}" stroke-linejoin="{join}"'
        if dash:
            a += f' stroke-dasharray="{dash}"'
        self.add(a + "/>")

    def text(self, x, y, s, size=14, weight=400, fill=INK, anchor="start", mono=False, spacing=None, italic=False):
        fam = MONO if mono else SANS
        a = (f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" font-weight="{weight}" '
             f'fill="{fill}" text-anchor="{anchor}"')
        if spacing:
            a += f' letter-spacing="{spacing}"'
        if italic:
            a += ' font-style="italic"'
        self.add(a + f'>{escape(s)}</text>')

    def para(self, x, y, s, maxw, size=14, weight=400, fill=INK, anchor="start", lh=None, mono=False):
        """Texto con salto automático. Devuelve la y de la última línea."""
        lh = lh or size * 1.35
        lines = wrap(s, maxw, size, weight, mono)
        cx = x if anchor == "start" else (x + maxw / 2 if anchor == "middle" else x + maxw)
        for i, ln in enumerate(lines):
            self.text(cx, y + i * lh, ln, size, weight, fill, anchor, mono)
        return y + (len(lines) - 1) * lh

    def lines_(self, x, y, lines, size=14, weight=400, fill=INK, anchor="start", lh=None, mono=False):
        lh = lh or size * 1.35
        for i, ln in enumerate(lines):
            self.text(x, y + i * lh, ln, size, weight, fill, anchor, mono)
        return y + (len(lines) - 1) * lh

    # ---- composiciones
    def pill(self, cx, cy, s, size=12.5, fill=WHITE, stroke=RULE2, color=INK, weight=600, mono=False, padx=9, h=None):
        w = tw(s, size, weight, mono) + padx * 2
        h = h or size + 9
        self.rect(cx - w / 2, cy - h / 2, w, h, fill, stroke, 1.2, rx=h / 2)
        self.text(cx, cy + size * 0.35, s, size, weight, color, "middle", mono)
        return w

    def badge(self, x, y, s, fill=VIO, color=WHITE, size=12, weight=700, spacing=0.8, anchor="start"):
        w = tw(s, size, weight) + len(s) * spacing + 16
        x0 = x if anchor == "start" else x - w
        self.rect(x0, y, w, size + 10, fill, None, rx=5)
        self.text(x0 + 8, y + size + 1.5, s, size, weight, color, "start", spacing=spacing)
        return w

    def pin(self, cx, cy, n, fill=ORA, r=12, color=WHITE):
        self.circle(cx, cy, r, fill, WHITE, 2)
        self.text(cx, cy + 5, str(n), 14, 800, color, "middle")

    def arrow(self, pts, color=SOFT, w=2.6, dash=None, head=10, both=False):
        d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        self.path(d, "none", color, w, dash, cap="round", join="round")
        self._head(pts[-1], pts[-2], color, head)
        if both:
            self._head(pts[0], pts[1], color, head)

    def _head(self, tip, prev, color, size):
        import math
        (x, y), (px, py) = tip, prev
        a = math.atan2(y - py, x - px)
        s = size
        p1 = (x, y)
        p2 = (x - s * math.cos(a) + s * 0.55 * math.sin(a), y - s * math.sin(a) - s * 0.55 * math.cos(a))
        p3 = (x - s * math.cos(a) - s * 0.55 * math.sin(a), y - s * math.sin(a) + s * 0.55 * math.cos(a))
        self.add(f'<polygon points="{p1[0]:.1f},{p1[1]:.1f} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}" fill="{color}"/>')

    def node(self, x, y, w, h, title, lines=(), fill=WHITE, stroke=VIO, tcolor=MID, scolor=SOFT,
             tsize=17, ssize=13.5, sw=2, dash=None, rx=12, align="middle", pad=14, icon_space=0, title_weight=700):
        self.rect(x, y, w, h, fill, stroke, sw, rx, dash)
        cx = x + w / 2 if align == "middle" else x + pad + icon_space
        anchor = "middle" if align == "middle" else "start"
        tl = wrap(title, w - 2 * pad - icon_space, tsize, title_weight)
        body = []
        for ln in lines:
            body += wrap(ln, w - 2 * pad - icon_space, ssize)
        total = len(tl) * tsize * 1.25 + (6 if body else 0) + len(body) * ssize * 1.38
        yy = y + (h - total) / 2 + tsize * 0.95
        for t in tl:
            self.text(cx, yy, t, tsize, title_weight, tcolor, anchor)
            yy += tsize * 1.25
        yy += 6 - 3
        for b in body:
            self.text(cx, yy + ssize * 0.4, b, ssize, 400, scolor, anchor)
            yy += ssize * 1.38

    # ---- iconos (geométricos, originales)
    def icon_lock(self, x, y, s=28, color=TEAL, body_fill=None):
        """Candado con esquina superior izquierda en (x, y), tamaño s."""
        bw, bh = s * 0.82, s * 0.56
        bx, by = x + (s - bw) / 2, y + s * 0.44
        self.path(f"M{bx + bw * 0.2:.1f} {by:.1f} V{y + s * 0.30:.1f} A{bw * 0.3:.1f} {bw * 0.3:.1f} 0 0 1 {bx + bw * 0.8:.1f} {y + s * 0.30:.1f} V{by:.1f}",
                  "none", color, max(2.2, s * 0.1))
        self.rect(bx, by, bw, bh, body_fill or color, None, rx=s * 0.1)
        self.circle(x + s / 2, by + bh * 0.42, s * 0.07, WHITE)
        self.rect(x + s / 2 - s * 0.025, by + bh * 0.42, s * 0.05, bh * 0.28, WHITE, None, rx=1)

    def icon_key(self, x, y, s=28, color=ORAB):
        r = s * 0.2
        self.circle(x + r + 1, y + s / 2, r, "none", color, max(2.2, s * 0.09))
        self.line(x + 2 * r + 1, y + s / 2, x + s, y + s / 2, color, max(2.2, s * 0.09))
        self.line(x + s * 0.78, y + s / 2, x + s * 0.78, y + s / 2 + s * 0.16, color, max(2.2, s * 0.09))
        self.line(x + s * 0.93, y + s / 2, x + s * 0.93, y + s / 2 + s * 0.12, color, max(2.2, s * 0.09))

    def icon_db(self, x, y, w=36, h=40, color=TEAL, fill=WHITE):
        e = h * 0.16
        self.path(f"M{x} {y + e} V{y + h - e} A{w / 2} {e} 0 0 0 {x + w} {y + h - e} V{y + e}", fill, color, 2.2)
        self.add(f'<ellipse cx="{x + w / 2}" cy="{y + e}" rx="{w / 2}" ry="{e}" fill="{fill}" stroke="{color}" stroke-width="2.2"/>')
        self.path(f"M{x} {y + h * 0.5} A{w / 2} {e} 0 0 0 {x + w} {y + h * 0.5}", "none", color, 2)

    def icon_browser(self, x, y, w=44, h=34, color=VIO, fill=WHITE):
        self.rect(x, y, w, h, fill, color, 2.2, rx=5)
        self.line(x, y + h * 0.28, x + w, y + h * 0.28, color, 2)
        for i in range(3):
            self.circle(x + 6 + i * 6.5, y + h * 0.14, 1.7, color)

    def icon_server(self, x, y, w=40, h=36, color=TEAL, fill=WHITE):
        for i in range(2):
            yy = y + i * (h / 2 + 2)
            self.rect(x, yy, w, h / 2 - 2, fill, color, 2.2, rx=4)
            self.circle(x + 8, yy + (h / 2 - 2) / 2, 2.2, color)
            self.line(x + 16, yy + (h / 2 - 2) / 2, x + w - 8, yy + (h / 2 - 2) / 2, color, 2)

    def icon_person(self, x, y, s=34, color=VIO):
        self.circle(x + s / 2, y + s * 0.3, s * 0.2, "none", color, 2.4)
        self.path(f"M{x + s * 0.1} {y + s} Q{x + s * 0.1} {y + s * 0.58} {x + s / 2} {y + s * 0.58} Q{x + s * 0.9} {y + s * 0.58} {x + s * 0.9} {y + s}", "none", color, 2.4)

    def icon_check(self, cx, cy, r=11, fill=TEAL):
        self.circle(cx, cy, r, fill)
        self.path(f"M{cx - r * 0.5} {cy + r * 0.02} L{cx - r * 0.12} {cy + r * 0.4} L{cx + r * 0.52} {cy - r * 0.38}", "none", WHITE, 2.6)

    def icon_cross(self, cx, cy, r=11, fill=RED):
        self.circle(cx, cy, r, fill)
        k = r * 0.42
        self.path(f"M{cx - k} {cy - k} L{cx + k} {cy + k} M{cx + k} {cy - k} L{cx - k} {cy + k}", "none", WHITE, 2.6)

    def icon_warn(self, cx, cy, r=11, fill=ORA):
        self.circle(cx, cy, r, fill)
        self.text(cx, cy + r * 0.45, "!", r * 1.5, 800, WHITE, "middle")

    def icon_gear(self, cx, cy, r=14, color=VIO):
        import math
        pts = []
        n = 8
        for i in range(n * 2):
            a = math.pi * i / n
            rr = r if i % 2 == 0 else r * 0.74
            pts.append(f"{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}")
        self.add(f'<polygon points="{" ".join(pts)}" fill="none" stroke="{color}" stroke-width="2.2" stroke-linejoin="round"/>')
        self.circle(cx, cy, r * 0.3, "none", color, 2.2)

    def render(self):
        head = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" '
                f'width="{self.w}" height="{self.h}" role="img" aria-labelledby="t d">\n'
                f'<title id="t">{escape(self.title)}</title>\n<desc id="d">{escape(self.desc)}</desc>\n')
        return head + "\n".join(self.parts) + "\n</svg>\n"

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.render())
