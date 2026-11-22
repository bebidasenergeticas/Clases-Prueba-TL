#!/usr/bin/env python3
"""Compila la Guía Maestra Semana 12 a PDF.
Uso: python3 build.py   (desde la carpeta fuente/)
1) Une capitulos/*.html (orden alfabético) + anexo generado desde los .md del subagente.
2) Genera índice con marcadores invisibles, renderiza con Chromium (Playwright),
   localiza la página real de cada marcador con pdftotext y vuelve a renderizar con números.
"""
import re, subprocess, pathlib, html, json, sys
import markdown

ROOT = pathlib.Path(__file__).resolve().parent
OUT_DIR = ROOT.parent
PDF = OUT_DIR / "E1601_2_GUIA_MAESTRA_SEMANA_12_OPENCODE_CLAUDE_GITHUB.pdf"
BUILD = ROOT / "_build"; BUILD.mkdir(exist_ok=True)

def md_annex():
    """Convierte los archivos de auditoría del subagente en el Anexo B (HTML)."""
    d = OUT_DIR / "auditoria_prompts"
    f = ROOT / "capitulos" / "_anexo_auto.html"
    parts = []
    spec = [("03_PROMPTS_MEJORADOS_PRINCIPIANTES.md", "B1", "Prompts mejorados · versión sencilla (principiantes)", "mej"),
            ("04_PROMPTS_MEJORADOS_AVANZADOS.md", "B2", "Prompts mejorados · versión profesional avanzada", "adv")]
    for fn, code, title, cls in spec:
        p = d / fn
        if not p.exists():
            continue
        txt = p.read_text(encoding="utf-8")
        txt = re.sub(r"\A#\s.*\n", "", txt)  # quita el título de primer nivel
        h = markdown.markdown(txt, extensions=["fenced_code", "tables", "sane_lists"])
        # bloques de código -> cajas de prompt copiables
        def rep(m):
            body = m.group(2)
            return f'<div class="prompt {cls}"><div class="ph"><span class="id">{code}</span> Prompt listo para copiar<span class="src">Generado por el subagente PROMPT_AUDITOR_E1601</span></div><pre>{body}</pre></div>'
        h = re.sub(r'<pre><code( class="[^"]*")?>(.*?)</code></pre>', rep, h, flags=re.S)
        h = h.replace("<h1>", "<h2>").replace("</h1>", "</h2>")
        h = re.sub(r"<table>", '<table class="compact">', h)
        aid = "anexo" + code.lower()
        parts.append(f'<section class="chap annex-auto"><div class="chap-head"><div class="big">{code}</div><div class="k">Anexo {code}</div>'
                     f'<h1 id="{aid}" data-toc="{code}|{html.escape(title)}">{html.escape(title)}</h1>'
                     f'<p class="d">Texto íntegro entregado por el subagente auditor. <span class="tag t-mej">Prompt mejorado</span> No son instrucciones pronunciadas en clase.</p></div>{h}</section>')
    f.write_text("\n".join(parts), encoding="utf-8")

def assemble(pages=None):
    caps = sorted((ROOT / "capitulos").glob("*.html"))
    body = "\n".join(c.read_text(encoding="utf-8") for c in caps if not c.name.startswith("_"))
    auto = (ROOT / "capitulos" / "_anexo_auto.html")
    if auto.exists():
        body = body.replace("<!--ANEXO_AUTO-->", auto.read_text(encoding="utf-8"))
    for rp in (ROOT / "prompts_originales").glob("*.txt"):
        body = body.replace(f"<!--RAW:{rp.stem}-->", html.escape(rp.read_text(encoding="utf-8")))
    toc = []
    # h1 de capítulo y h2 de sección con id
    def h1(m):
        attrs, inner = m.group(1), m.group(2)
        i = re.search(r'id="([^"]+)"', attrs); t = re.search(r'data-toc="([^"]+)"', attrs)
        if not (i and t): return m.group(0)
        n, title = t.group(1).split("|", 1)
        toc.append((1, i.group(1), n, title))
        return f'<h1{attrs}><span class="mk">@@{i.group(1)}@@</span>{inner}</h1>'
    def h2(m):
        attrs, inner = m.group(1), m.group(2)
        i = re.search(r'id="([^"]+)"', attrs)
        if not i or 'data-notoc' in attrs: return m.group(0)
        toc.append((2, i.group(1), "", re.sub(r"<[^>]+>", "", inner)))
        return f'<h2{attrs}><span class="mk">@@{i.group(1)}@@</span>{inner}</h2>'
    body = re.sub(r"<h1([^>]*)>(.*?)</h1>", h1, body, flags=re.S)
    body = re.sub(r"<h2([^>]*)>(.*?)</h2>", h2, body, flags=re.S)
    rows = []
    for lvl, i, n, t in toc:
        pg = (pages or {}).get(i, "—")
        if lvl == 1:
            rows.append(f'<div class="te l1"><a class="tt" href="#{i}"><span class="n">{n}</span>{t}</a><span class="dots"></span><span class="pg">{pg}</span></div>')
        else:
            rows.append(f'<div class="te l2"><a class="tt" href="#{i}">{t}</a><span class="dots"></span><span class="pg">{pg}</span></div>')
    body = body.replace("<!--TOC-->", "\n".join(rows))
    css = (ROOT / "estilos.css").read_text(encoding="utf-8")
    doc = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Guía Maestra Semana 12 · E1601.2</title><style>{css}</style></head><body>{body}</body></html>'
    out = BUILD / "guia.html"; out.write_text(doc, encoding="utf-8")
    return out, toc

def render(src, dst):
    subprocess.run(["node", str(ROOT / "render.js"), str(src), str(dst)], check=True)

def locate(pdf, toc):
    n = int(re.search(r"Pages:\s+(\d+)", subprocess.run(["pdfinfo", str(pdf)], capture_output=True, text=True).stdout).group(1))
    pages = {}
    for p in range(1, n + 1):
        t = subprocess.run(["pdftotext", "-f", str(p), "-l", str(p), str(pdf), "-"], capture_output=True, text=True).stdout
        for m in re.finditer(r"@@([A-Za-z0-9_\-]+)@@", t):
            pages.setdefault(m.group(1), p)
    return pages, n

if __name__ == "__main__":
    md_annex()
    html1, toc = assemble()
    tmp = BUILD / "pass1.pdf"; render(html1, tmp)
    pages, n1 = locate(tmp, toc)
    html2, _ = assemble(pages)
    render(html2, PDF)
    pages2, n2 = locate(PDF, toc)
    miss = [i for _, i, _, _ in toc if i not in pages2]
    drift = [i for i in pages if pages.get(i) != pages2.get(i)]
    json.dump({"paginas": n2, "secciones": len(toc), "sin_marcador": miss, "desplazadas": drift, "mapa": pages2}, open(BUILD / "toc.json", "w"), ensure_ascii=False, indent=1)
    print(f"PDF: {PDF}  páginas={n2}  entradas índice={len(toc)}  sin marcador={miss}  desplazadas={drift}")
