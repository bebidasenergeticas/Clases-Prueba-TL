// Exporta cada diapositiva a PNG 3840×2160 (estado final de todos los pasos),
// arma dist/vibe-coding.pdf y dist/guion-docente.pdf.
// Uso: node scripts/export.mjs [--only 1,5,9] [--scale 1] [--no-pdf]
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

// Playwright preinstalado de forma global (NODE_PATH) o como dependencia local.
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'build', 'slides');
await mkdir(out, { recursive: true });

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const only = opt('--only', null);
const scale = parseFloat(opt('--scale', '2'));
const noPdf = args.includes('--no-pdf') || !!only;
const TOTAL = 16;
const list = only ? only.split(',').map(Number) : Array.from({ length: TOTAL }, (_, i) => i + 1);

export const LAUNCH = { args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] };

const browser = await chromium.launch(LAUNCH);
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const file = pathToFileURL(path.join(dist, 'vibe-coding.html')).href;
const shots = [];
for (const n of list) {
  await page.goto(`${file}?export=1&slide=${n}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  await page.waitForTimeout(150);
  const p = path.join(out, `slide-${String(n).padStart(2, '0')}.png`);
  await page.screenshot({ path: p, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
  shots.push(p);
  console.log(`✓ diapositiva ${n} → ${path.relative(root, p)}`);
}

if (errors.length) {
  console.error('Errores en la página:\n' + [...new Set(errors)].join('\n'));
  process.exitCode = 1;
}

if (!noPdf) {
  // PDF de diapositivas (imágenes 4K, JPEG de alta calidad)
  execFileSync('python3', ['-I', path.join(root, 'scripts', 'images_to_pdf.py'), path.join(dist, 'vibe-coding.pdf'), ...shots], { stdio: 'inherit' });

  // Guion docente imprimible (HTML → PDF) con miniaturas
  const { notes, sources } = JSON.parse(await readFile(path.join(dist, 'notes.json'), 'utf8'));
  const thumbs = {};
  const thumbCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  const tp = await thumbCtx.newPage();
  for (const n of list) {
    await tp.goto(`${file}?export=1&slide=${n}`);
    await tp.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
    thumbs[n] = (await tp.screenshot({ type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1920, height: 1080 } })).toString('base64');
  }
  await thumbCtx.close();
  const fonts = (await readFile(path.join(dist, 'vibe-coding.html'), 'utf8')).match(/@font-face\s*{[^}]*}/g).join('\n');
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const byId = Object.fromEntries(sources.map((s) => [s.id, s]));
  let acc = 0;
  const rows = notes.filter((n) => !n.annex).map((n) => { acc += n.seconds; return `<tr><td>${n.n}</td><td>${esc(n.title)}</td><td>${fmt(n.seconds)}</td><td>${fmt(acc)}</td></tr>`; }).join('');
  const blocks = notes.map((n) => `
    <article>
      <header><img src="data:image/jpeg;base64,${thumbs[n.n]}"><div><span class="k">${n.annex ? 'Anexo' : 'Diapositiva ' + n.n}</span><h2>${esc(n.title)}</h2><span class="t">${n.seconds ? fmt(n.seconds) : 'Fuera de los 25 minutos'}</span></div></header>
      <h3>Guion oral</h3>${n.guion.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${n.tecnica ? `<h3>Explicación técnica</h3><p>${esc(n.tecnica)}</p>` : ''}
      ${n.analogia ? `<h3>Analogía</h3><p>${esc(n.analogia)}</p>` : ''}
      ${n.pregunta ? `<h3>Pregunta de participación</h3><p class="q">${esc(n.pregunta)}</p>` : ''}
      ${n.transicion ? `<h3>Transición</h3><p>${esc(n.transicion)}</p>` : ''}
      ${n.evitar.length ? `<h3>Errores conceptuales que evitar</h3><ul>${n.evitar.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${n.rigor ? `<h3>Rigor: hecho e interpretación</h3><p>${esc(n.rigor)}</p>` : ''}
      ${n.fuentes.length ? `<h3>Fuentes</h3><ul class="src">${n.fuentes.map((f) => `<li>${esc(byId[f].cite)} — ${esc(byId[f].url)}</li>`).join('')}</ul>` : ''}
    </article>`).join('');
  const html = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><style>${fonts}
    @page{size:Letter;margin:16mm 16mm 18mm}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font:10.5pt/1.5 Inter,sans-serif;color:#101C27}
    .cover{padding-top:4mm}
    .cover .k{font:600 9pt 'JetBrains Mono';letter-spacing:.16em;text-transform:uppercase;color:#5C646B}
    .cover h1{font:700 40pt/0.9 'Inter Tight';letter-spacing:-.04em;text-transform:uppercase;margin-top:6mm}
    .cover p{font-size:13pt;max-width:140mm;margin-top:6mm;color:#3A434B}
    table{width:100%;border-collapse:collapse;margin-top:6mm;font-size:9.5pt}
    td{padding:1.15mm 2mm;border-bottom:.3mm solid #ddd}
    td:nth-child(1){width:10mm;color:#5C646B} td:nth-child(3),td:nth-child(4){width:22mm;text-align:right;font-family:'JetBrains Mono'}
    .note{margin-top:6mm;padding:4mm 5mm;background:#F3F0E5;border-left:1.2mm solid #101C27;font-size:9.5pt}
    article{break-before:page}
    article header{display:grid;grid-template-columns:78mm 1fr;gap:6mm;align-items:center;padding-bottom:4mm;border-bottom:.4mm solid #101C27;margin-bottom:3mm}
    article img{width:78mm;border-radius:2mm;display:block}
    .k{font:600 8.5pt 'JetBrains Mono';letter-spacing:.14em;text-transform:uppercase;color:#5C646B}
    h2{font:600 17pt/1.15 'Inter Tight';letter-spacing:-.01em;margin:1.5mm 0}
    .t{font:600 10pt 'JetBrains Mono';background:#C8EC88;padding:.6mm 2.4mm;border-radius:3mm}
    h3{font:600 8.5pt 'JetBrains Mono';letter-spacing:.14em;text-transform:uppercase;color:#3A434B;margin:4mm 0 1.2mm}
    p+p{margin-top:2mm} ul{padding-left:5mm} li+li{margin-top:1mm}
    .q{padding-left:3mm;border-left:.8mm solid #C8EC88}
    .src{font-size:8.5pt;color:#3A434B;word-break:break-all}
  </style></head><body>
    <section class="cover"><div><span class="k">Top Learning · Inteligencia Artificial y Automatización con n8n</span><h1>Vibe<br>Coding</h1>
    <p>Guion docente de la presentación «De una idea escrita a una aplicación funcional». Clase en vivo · 27 de octubre de 2026 · 25 minutos.</p>
    <div class="note">El guion está escrito a 65–120 palabras por minuto para dejar margen a preguntas, pausas y animaciones. Teclas: → avanza · ← retrocede · P vista de presentador · N notas · G índice · F pantalla completa · L modo ligero.</div></div>
    <div><table><tr><td>#</td><td>Diapositiva</td><td>Tiempo</td><td>Acumulado</td></tr>${rows}<tr><td></td><td><b>Total</b></td><td><b>${fmt(acc)}</b></td><td></td></tr></table></div></section>
    ${blocks}</body></html>`;
  const gp = await browser.newPage();
  await gp.setContent(html, { waitUntil: 'load' });
  await gp.evaluate(() => document.fonts.ready);
  await gp.pdf({ path: path.join(dist, 'guion-docente.pdf'), format: 'Letter', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="width:100%;font:8px Inter,sans-serif;color:#858C92;text-align:center">Vibe Coding · Guion docente · <span class="pageNumber"></span>/<span class="totalPages"></span></div>', margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  console.log('✓ dist/guion-docente.pdf');
}

await browser.close();
