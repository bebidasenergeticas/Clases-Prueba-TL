#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build.py — Compila una guía HTML de Top Learning (E1601.2) a PDF con WeasyPrint.

Uso:
    python3 build.py <ruta_guia.html> <salida.pdf> [--no-render] [--depth 2|3] [--ua]

Qué hace:
  1. Inyecta theme.css y normaliza el HTML (charset, lang, base_url para imágenes).
  2. Genera IDs que falten (capítulos, h2/h3, prompts, errores, ejercicios).
  3. Numera capítulos (01, 02…) y secciones (1.1, 1.2…) -> atributo data-num.
  4. Genera la TOC si existe <nav class="toc" data-auto></nav> y los índices cortos
     <nav class="toc-mini" data-auto="prompts|errors|exercises"></nav>.
  5. Rellena etiquetas .tag vacías con su texto oficial (EN CLASE, etc.).
  6. Convierte prompts largos a tabla con cabecera repetible (partición limpia).
  7. Marcadores PDF (bookmark-level en el CSS), metadatos y enlaces clicables.
  8. Escribe el PDF y renderiza TODAS las páginas a PNG (pdftoppm -r 60) en
     <raiz>/evidencias_qa/render/<nombre>/ más hojas de contactos (PIL).
  9. Imprime páginas, advertencias de WeasyPrint, enlaces internos rotos,
     imágenes sin alt, páginas casi vacías y la lista de enlaces externos.
"""
import argparse
import datetime
import html as htmllib
import logging
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]                      # <raiz>/fuentes_editables/design -> <raiz>
THEME = HERE / "theme.css"
AUTHOR = "Kevin Daniel Martínez Orozco · Top Learning"
DEFAULT_SUBJECT = ("Guía de la clase E1601.2 — Inteligencia Artificial (Top Learning). "
                   "Clase del 22/11/2026; verificación técnica del 23/11/2026.")
DEFAULT_KEYWORDS = "Top Learning, E1601.2, inteligencia artificial, vibe coding, Puerto A&M, guía"
PRODUCTION_DATE = "2026-11-23"

TAG_LABELS = {
    "en-clase": "EN CLASE",
    "prompt-mejorado": "PROMPT MEJORADO",
    "complemento": "COMPLEMENTO DEL PROFESOR",
    "actualizacion": "ACTUALIZACIÓN EXTERNA",
    "demo": "DEMO SIMULADA",
    "pendiente": "PENDIENTE DE COMPROBAR",
    "aclaracion": "ACLARACIÓN TÉCNICA POSTERIOR",
    "reconstruccion": "RECONSTRUCCIÓN PEDAGÓGICA",
}
DIFF_LABELS = {"d1": "Básica", "d2": "Intermedia", "d3": "Avanzada"}
LONG_PROMPT_LINES = 17     # a partir de aquí el prompt se maqueta como tabla partible


# ----------------------------------------------------------------- utilidades
def slugify(text: str, maxlen: int = 48) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return (text[:maxlen].strip("-")) or "sec"


class IdGen:
    def __init__(self, soup):
        self.used = {t["id"] for t in soup.find_all(id=True)}

    def make(self, base: str, prefix: str = "") -> str:
        base = (prefix + slugify(base)) if base else prefix + "x"
        cand, n = base, 2
        while cand in self.used:
            cand = f"{base}-{n}"
            n += 1
        self.used.add(cand)
        return cand


def text_of(el) -> str:
    """Texto del elemento sin insignias (.sim-badge, .tag) ni espacios sobrantes."""
    clone = BeautifulSoup(str(el), "html.parser")
    for junk in clone.select(".sim-badge, .tag, .verified"):
        junk.decompose()
    return re.sub(r"\s+", " ", clone.get_text(" ", strip=True)).strip()


def new_tag(soup, name, **attrs):
    cls = attrs.pop("cls", None)
    t = soup.new_tag(name, **attrs)
    if cls:
        t["class"] = cls.split()
    return t


# ------------------------------------------------------------------ portada
def cover_art_svg() -> str:
    """Ilustración abstracta original (red de nodos + rejilla) para la portada."""
    import random
    rnd = random.Random(1601)
    pts = []
    cols, rows = 9, 4
    for r in range(rows):
        for c in range(cols):
            x = 18 + c * 22 + rnd.uniform(-5, 5) + (r % 2) * 7
            y = 12 + r * 22 + rnd.uniform(-5, 5)
            pts.append((round(x, 1), round(y, 1)))
    lines, dots = [], []
    for i, (x, y) in enumerate(pts):
        for j in (i + 1, i + cols, i + cols + 1):
            if j < len(pts) and (i + j) % 3 != 0:
                x2, y2 = pts[j]
                if abs(x2 - x) < 32 and abs(y2 - y) < 32:
                    op = 0.18 + 0.25 * ((i * 7 + j) % 4) / 3
                    lines.append(f'<line x1="{x}" y1="{y}" x2="{x2}" y2="{y2}" '
                                 f'stroke="#A592FF" stroke-opacity="{op:.2f}" stroke-width="0.35"/>')
        k = (i * 5) % 7
        if k == 0:
            dots.append(f'<circle cx="{x}" cy="{y}" r="1.9" fill="#3DD9CF"/>')
        elif k == 3:
            dots.append(f'<circle cx="{x}" cy="{y}" r="1.5" fill="#FF9A3C"/>')
        else:
            dots.append(f'<circle cx="{x}" cy="{y}" r="0.9" fill="#C9B8FF" fill-opacity="0.8"/>')
    return ('<svg class="cover-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 96" '
            'preserveAspectRatio="xMaxYMin slice" role="img" aria-label="Ilustración abstracta de nodos conectados">'
            + "".join(lines) + "".join(dots) + "</svg>")


# --------------------------------------------------------------- transformaciones
def ensure_document(soup: BeautifulSoup, src: Path):
    html = soup.find("html")
    if html is None:
        raise SystemExit("El archivo no contiene <html>.")
    html["lang"] = html.get("lang", "es")
    head = soup.find("head")
    if head is None:
        head = soup.new_tag("head")
        html.insert(0, head)
    if not head.find("meta", charset=True):
        m = soup.new_tag("meta", charset="utf-8")
        head.insert(0, m)
    # theme.css primero (el CSS propio de la guía puede sobreescribir después)
    link = soup.new_tag("link", rel="stylesheet", href=THEME.as_uri())
    head.insert(1, link)
    body = soup.find("body")
    if body is None:
        raise SystemExit("El archivo no contiene <body>.")
    title_tag = head.find("title")
    if not body.get("data-guide-title"):
        body["data-guide-title"] = text_of(title_tag) if title_tag else src.stem
    if title_tag is None:
        t = soup.new_tag("title")
        t.string = body["data-guide-title"]
        head.append(t)

    def meta(name, content):
        if not head.find("meta", attrs={"name": name}):
            head.append(soup.new_tag("meta", attrs={"name": name, "content": content}))

    meta("author", AUTHOR)
    meta("description", DEFAULT_SUBJECT)
    meta("keywords", DEFAULT_KEYWORDS)
    meta("dcterms.created", PRODUCTION_DATE)
    meta("dcterms.modified", PRODUCTION_DATE)
    meta("generator", "Top Learning · build.py + WeasyPrint")
    return head, body


def mark_splittable_code(soup, limit=26):
    """Bloques de código/terminal muy largos pueden partirse entre páginas (class .split)."""
    for pre in soup.select("pre.code, .terminal pre"):
        box = pre if "code" in pre.get("class", []) else pre.find_parent(class_="terminal")
        if box is None:
            continue
        txt = pre.get_text()
        n = sum(max(1, -(-len(l) // 88)) for l in txt.split("\n"))
        if n > limit and "split" not in box.get("class", []):
            box["class"] = box.get("class", []) + ["split"]


def fill_tags(soup):
    for t in soup.select(".tag"):
        if t.get_text(strip=True):
            continue
        for k, label in TAG_LABELS.items():
            if k in t.get("class", []):
                t.string = label
                break
    for d in soup.select(".diff"):
        if d.get_text(strip=True):
            continue
        for k, label in DIFF_LABELS.items():
            if k in d.get("class", []):
                d.string = label


def enrich_cover(soup):
    for cover in soup.select(".cover"):
        if not cover.select_one(".cover-art"):
            art = BeautifulSoup(cover_art_svg(), "html.parser")
            cover.insert(0, art)
        num = cover.get("data-guide-number")
        if num and not cover.select_one(".cover-num"):
            n = new_tag(soup, "div", cls="cover-num")
            n.string = num
            cover.insert(1, n)


def assign_ids_and_numbers(soup, ids: IdGen):
    chapters = soup.select("section.chapter")
    n_ch = 0
    for ch in chapters:
        head = ch.select_one(".chapter-head")
        h1 = ch.select_one("h1.chapter-title")
        if h1 is None:
            continue
        unnumbered = "unnumbered" in ch.get("class", [])
        if not h1.get("id"):
            h1["id"] = ids.make(text_of(h1), "cap-")
        if not ch.get("id"):
            ch["id"] = ids.make(text_of(h1), "sec-")
        if not unnumbered:
            n_ch += 1
            num = f"{n_ch:02d}"
            ch["data-num"] = num
            h1["data-num"] = num
            if head is not None:
                span = head.select_one(".chapter-num")
                if span is None:
                    span = new_tag(soup, "span", cls="chapter-num")
                    head.insert(0, span)
                span["data-num"] = num
                span.string = ""
            sub = 0
            for h2 in ch.find_all("h2"):
                if "no-toc" in h2.get("class", []):
                    continue
                sub += 1
                h2["data-num"] = f"{n_ch}.{sub}"
        else:
            if head is not None:
                span = head.select_one(".chapter-num")
                if span is not None:
                    span.decompose()
        for h in ch.find_all(["h2", "h3"]):
            if not h.get("id"):
                h["id"] = ids.make(text_of(h), "s-")
    # h2/h3 fuera de capítulos (p. ej. rescate)
    for h in soup.find_all(["h2", "h3"]):
        if not h.get("id"):
            h["id"] = ids.make(text_of(h), "s-")


def assign_component_ids(soup, ids: IdGen):
    for sel, prefix, title_sel in (
        (".prompt-box", "P-", ".prompt-title"),
        (".error-card", "E-", ".error-title"),
        (".exercise", "X-", ".exercise-title"),
    ):
        for el in soup.select(sel):
            if not el.get("id"):
                t = el.select_one(title_sel)
                el["id"] = ids.make(text_of(t) if t else "", prefix)


def build_toc(soup, depth: int):
    navs = soup.select("nav.toc[data-auto]")
    if not navs:
        return 0
    entries = []   # (level, id, num, text)
    for el in soup.body.descendants:
        if not isinstance(el, Tag):
            continue
        cls = el.get("class", [])
        if el.name == "h1" and "chapter-title" in cls:
            entries.append((1, el["id"], el.get("data-num", ""), text_of(el)))
        elif el.name == "h2" and (el.find_parent(class_="rescue-head") or el.find_parent(class_="credits")):
            if not el.get("id"):
                continue
            entries.append((1, el["id"], "", text_of(el)))
        elif el.name == "h2" and "no-toc" not in cls and el.find_parent("section", class_="chapter"):
            entries.append((2, el["id"], el.get("data-num", ""), text_of(el)))
        elif el.name == "h3" and depth >= 3 and "no-toc" not in cls and el.find_parent("section", class_="chapter"):
            entries.append((3, el["id"], "", text_of(el)))
    for nav in navs:
        nav.clear()
        ol = new_tag(soup, "ol")
        cur_li, cur_sub = None, None
        for level, eid, num, txt in entries:
            a = new_tag(soup, "a", href="#" + eid)
            n = new_tag(soup, "span", cls="n")
            n.string = num
            a.append(n)
            a.append(NavigableString(txt))
            if level == 1:
                cur_li = new_tag(soup, "li", cls="toc-ch")
                cur_li.append(a)
                ol.append(cur_li)
                cur_sub = None
            else:
                if cur_li is None:
                    cur_li = new_tag(soup, "li", cls="toc-ch")
                    ol.append(cur_li)
                if cur_sub is None:
                    cur_sub = new_tag(soup, "ol", cls="toc-sub")
                    cur_li.append(cur_sub)
                li = new_tag(soup, "li")
                li.append(a)
                cur_sub.append(li)
        nav.append(ol)
    return len(entries)


def build_mini_tocs(soup):
    spec = {
        "prompts": (".prompt-box", ".prompt-id", ".prompt-title", ".prompt-meta"),
        "errors": (".error-card", ".error-id", ".error-title", None),
        "exercises": (".exercise", ".exercise-id", ".exercise-title", ".exercise-level"),
    }
    for nav in soup.select("nav.toc-mini[data-auto]"):
        kind = nav["data-auto"]
        if kind not in spec:
            continue
        sel, id_sel, title_sel, meta_sel = spec[kind]
        classes = nav.get("class", [])
        if kind not in classes:
            nav["class"] = classes + [kind]
        nav.clear()
        titles = {"prompts": "Índice de prompts", "errors": "Índice de errores", "exercises": "Índice de ejercicios"}
        h3 = new_tag(soup, "h3")
        h3["class"] = ["no-toc"]
        h3.string = nav.get("data-title", titles[kind])
        nav.append(h3)
        ul = new_tag(soup, "ul")
        for el in soup.select(sel):
            idspan = el.select_one(id_sel)
            tt = el.select_one(title_sel)
            li = new_tag(soup, "li")
            a = new_tag(soup, "a", href="#" + el["id"])
            s = new_tag(soup, "span", cls="id")
            s.string = text_of(idspan) if idspan else el["id"]
            a.append(s)
            a.append(NavigableString(text_of(tt) if tt else ""))
            li.append(a)
            ul.append(li)
        nav.append(ul)


def long_prompts_to_tables(soup):
    n = 0
    for box in soup.select("div.prompt-box"):
        pre = box.find("pre")
        if pre is None:
            continue
        lines = pre.get_text().count("\n") + 1
        wrapped = sum(max(1, -(-len(l) // 88)) for l in pre.get_text().split("\n"))
        if "splittable" not in box.get("class", []) and max(lines, wrapped) < LONG_PROMPT_LINES:
            continue
        head = box.select_one(".prompt-head")
        foot = box.select_one(".prompt-foot")
        table = new_tag(soup, "table", cls="prompt-table")
        table["id"] = box.get("id", "")
        table["class"] = ["prompt-table"] + [c for c in box.get("class", []) if c not in ("prompt-box", "splittable")]
        thead = new_tag(soup, "thead")
        tr = new_tag(soup, "tr")
        th = new_tag(soup, "th")
        if head is not None:
            th.append(head.extract())
        tr.append(th)
        thead.append(tr)
        tbody = new_tag(soup, "tbody")
        tr2 = new_tag(soup, "tr")
        td = new_tag(soup, "td")
        td.append(pre.extract())
        tr2.append(td)
        tbody.append(tr2)
        if foot is not None:
            tr3 = new_tag(soup, "tr")
            td3 = new_tag(soup, "td")
            td3["class"] = ["prompt-foot"]
            td3.append(foot.extract())
            tr3.append(td3)
            tbody.append(tr3)
        table.append(thead)
        table.append(tbody)
        box.replace_with(table)
        n += 1
    return n


# ------------------------------------------------------------------ chequeos
def check_links(soup):
    ids = {t["id"] for t in soup.find_all(id=True)}
    broken, external = [], []
    for a in soup.find_all("a", href=True):
        h = a["href"]
        if h.startswith("#"):
            if h[1:] not in ids:
                broken.append(h)
        elif h.startswith(("http://", "https://")):
            external.append(h)
    return sorted(set(broken)), sorted(set(external))


def check_images(soup):
    return [im.get("src", "?") for im in soup.find_all("img") if not im.get("alt")]


def page_count(pdf: Path) -> int:
    try:
        from pypdf import PdfReader
        return len(PdfReader(str(pdf)).pages)
    except Exception:
        out = subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout
        m = re.search(r"Pages:\s+(\d+)", out)
        return int(m.group(1)) if m else -1


def pdf_text_per_page(pdf: Path):
    try:
        from pypdf import PdfReader
        return [(p.extract_text() or "") for p in PdfReader(str(pdf)).pages]
    except Exception:
        return []


def render_pages(pdf: Path, outdir: Path, dpi: int = 60):
    if outdir.exists():
        shutil.rmtree(outdir)
    outdir.mkdir(parents=True)
    subprocess.run(["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(outdir / "p")], check=True)
    return sorted(outdir.glob("p-*.png"))


def contact_sheets(pngs, outdir: Path, per_sheet: int = 24, cols: int = 6):
    try:
        from PIL import Image, ImageDraw, ImageFont
    except Exception:
        print("  (PIL no disponible: sin hojas de contactos)")
        return []
    if not pngs:
        return []
    thumbs_w = 190
    first = Image.open(pngs[0])
    ratio = first.height / first.width
    thumbs_h = int(thumbs_w * ratio)
    pad, label_h = 14, 22
    try:
        font = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf", 13)
    except Exception:
        font = ImageFont.load_default()
    sheets = []
    for s in range(0, len(pngs), per_sheet):
        chunk = pngs[s:s + per_sheet]
        rows = -(-len(chunk) // cols)
        W = cols * (thumbs_w + pad) + pad
        H = rows * (thumbs_h + label_h + pad) + pad
        sheet = Image.new("RGB", (W, H), (30, 36, 64))
        d = ImageDraw.Draw(sheet)
        for i, p in enumerate(chunk):
            im = Image.open(p).convert("RGB").resize((thumbs_w, thumbs_h), Image.LANCZOS)
            x = pad + (i % cols) * (thumbs_w + pad)
            y = pad + (i // cols) * (thumbs_h + label_h + pad)
            sheet.paste(im, (x, y))
            d.rectangle([x - 1, y - 1, x + thumbs_w, y + thumbs_h], outline=(120, 110, 200))
            d.text((x, y + thumbs_h + 4), f"p. {s + i + 1}", fill=(235, 232, 250), font=font)
        path = outdir / f"contactos_{s // per_sheet + 1:02d}.png"
        sheet.save(path)
        sheets.append(path)
    return sheets


def near_blank_pages(pngs, texts):
    """Páginas con casi nada de contenido (excluye la portada y la última)."""
    flagged = []
    try:
        from PIL import Image, ImageStat
    except Exception:
        return flagged
    for i, p in enumerate(pngs):
        if i == 0 or i == len(pngs) - 1:
            continue
        im = Image.open(p).convert("L")
        w, h = im.size
        body = im.crop((int(w * 0.08), int(h * 0.10), int(w * 0.92), int(h * 0.90)))
        sd = ImageStat.Stat(body).stddev[0]
        t = texts[i] if i < len(texts) else ""
        if sd < 3 or len(t.strip()) < 60:
            flagged.append((i + 1, round(sd, 1), len(t.strip())))
    return flagged


# --------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html", type=Path)
    ap.add_argument("pdf", type=Path)
    ap.add_argument("--no-render", action="store_true", help="no generar PNG ni hojas de contactos")
    ap.add_argument("--depth", type=int, default=2, choices=(2, 3), help="profundidad de la TOC (2 = capítulos + h2)")
    ap.add_argument("--ua", action="store_true", help="intentar PDF/UA-1 (etiquetado de accesibilidad)")
    ap.add_argument("--dump-html", action="store_true", help="guarda el HTML procesado junto al PDF (depuración)")
    args = ap.parse_args()

    src = args.html.resolve()
    if not src.exists():
        raise SystemExit(f"No existe {src}")
    args.pdf.parent.mkdir(parents=True, exist_ok=True)

    raw = src.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")
    ensure_document(soup, src)
    ids = IdGen(soup)
    fill_tags(soup)
    mark_splittable_code(soup)
    enrich_cover(soup)
    assign_ids_and_numbers(soup, ids)
    assign_component_ids(soup, ids)
    n_toc = build_toc(soup, args.depth)
    build_mini_tocs(soup)
    n_tables = long_prompts_to_tables(soup)
    broken, external = check_links(soup)
    no_alt = check_images(soup)

    # ---- WeasyPrint
    from weasyprint import HTML
    warns = []

    class Collector(logging.Handler):
        def emit(self, record):
            msg = record.getMessage()
            if "HarfBuzz-Subset" in msg:      # aviso informativo, sin efecto en el PDF
                return
            warns.append(msg)

    handler = Collector(level=logging.WARNING)
    for name in ("weasyprint", "fontTools"):
        lg = logging.getLogger(name)
        lg.addHandler(handler)
        lg.setLevel(logging.WARNING)

    final_html = str(soup)
    if args.dump_html:
        args.pdf.with_suffix(".processed.html").write_text(final_html, encoding="utf-8")
    doc = HTML(string=final_html, base_url=str(src.parent) + "/")
    kwargs = {}
    if args.ua:
        kwargs["pdf_variant"] = "pdf/ua-1"
    else:
        kwargs["pdf_tags"] = True
    try:
        doc.write_pdf(str(args.pdf), **kwargs)
    except TypeError:
        doc.write_pdf(str(args.pdf))

    pages = page_count(args.pdf)
    size_kb = args.pdf.stat().st_size / 1024
    texts = pdf_text_per_page(args.pdf)

    print("=" * 66)
    print(f"PDF:        {args.pdf}  ({size_kb:,.0f} KB)")
    print(f"Páginas:    {pages}")
    print(f"TOC:        {n_toc} entradas | prompts largos como tabla: {n_tables}")
    print(f"Enlaces:    {len(external)} externos únicos | internos rotos: {len(broken)}")
    for b in broken:
        print(f"  [ROTO] {b}")
    for s in no_alt:
        print(f"  [SIN ALT] <img src='{s}'>")
    print(f"Advertencias de WeasyPrint: {len(warns)}")
    for w in warns[:40]:
        print("  [WARN]", w)

    if args.no_render:
        return

    name = args.pdf.stem
    outdir = ROOT / "evidencias_qa" / "render" / name
    pngs = render_pages(args.pdf, outdir, 60)
    sheets = contact_sheets(pngs, outdir)
    (outdir / "enlaces_externos.txt").write_text("\n".join(external) + ("\n" if external else ""), encoding="utf-8")
    flagged = near_blank_pages(pngs, texts)
    print(f"Render:     {len(pngs)} PNG en {outdir}")
    for s in sheets:
        print(f"Contactos:  {s}")
    if flagged:
        print("Páginas casi vacías (página, desv.est., caracteres):")
        for f in flagged:
            print("  ", f)
    else:
        print("Páginas casi vacías: ninguna")
    if pages != len(pngs):
        print(f"  [AVISO] páginas PDF ({pages}) != PNG ({len(pngs)})")
    print("=" * 66)


if __name__ == "__main__":
    main()
