// Construye dist/vibe-coding.html: un único archivo autocontenido (JS, CSS,
// fuentes y Three.js incrustados) que funciona sin conexión con doble clic.
// También genera dist/notes.json (para el PPTX) y dist/guion-docente.md.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });

// 1 · comprobaciones de contenido (datos y tiempos)
const data = await import(path.join(src, 'content/data.js'));
const notesMod = await import(path.join(src, 'content/notes.js'));
const { SOURCES } = await import(path.join(src, 'content/sources.js'));
data.verifyData();
const total = notesMod.verifyTiming();
console.log(`✓ datos coherentes · tiempos = ${notesMod.fmtTime(total)}`);

// 2 · JavaScript empaquetado (IIFE, sin módulos externos)
const js = await build({
  entryPoints: [path.join(src, 'js/main.js')],
  bundle: true,
  format: 'iife',
  minify: true,
  target: ['chrome100', 'safari15', 'firefox100'],
  write: false,
  legalComments: 'none',
});
let code = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');

// 3 · CSS con fuentes incrustadas
let css = await readFile(path.join(src, 'styles/deck.css'), 'utf8');
const fontRefs = [...css.matchAll(/url\((\.\.\/assets\/fonts\/[^)]+\.woff2)\)/g)].map((m) => m[1]);
for (const ref of new Set(fontRefs)) {
  const b64 = (await readFile(path.join(src, 'styles', ref))).toString('base64');
  css = css.split(`url(${ref})`).join(`url(data:font/woff2;base64,${b64})`);
}

// 4 · HTML final
let html = await readFile(path.join(src, 'index.html'), 'utf8');
html = html.replace('<!-- @inline-css -->', () => `<style>\n${css}\n</style>`);
html = html.replace('<!-- @inline-js -->', () => `<script>\n${code}\n</script>`);
await writeFile(path.join(dist, 'vibe-coding.html'), html);
console.log(`✓ dist/vibe-coding.html (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);

// 5 · notas para el PPTX y guion docente en Markdown
const { NOTES, fmtTime } = notesMod;
const byId = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
await writeFile(path.join(dist, 'notes.json'), JSON.stringify({ notes: NOTES, sources: SOURCES }, null, 2));

let md = `# Vibe Coding — Guion docente\n\n`;
md += `**Programa:** Inteligencia Artificial y Automatización con n8n · Top Learning  \n**Sesión:** 27 de octubre de 2026 · exposición de 25 minutos · español de México  \n**Audiencia:** personas adultas sin experiencia obligatoria en programación\n\n`;
md += `## Distribución del tiempo\n\n| # | Diapositiva | Tiempo | Acumulado |\n|---|---|---|---|\n`;
let acc = 0;
NOTES.filter((n) => !n.annex).forEach((n) => { acc += n.seconds; md += `| ${n.n} | ${n.title} | ${fmtTime(n.seconds)} | ${fmtTime(acc)} |\n`; });
md += `| | **Total** | **${fmtTime(acc)}** | |\n\n`;
md += `> El guion oral está escrito a un ritmo de 65–120 palabras por minuto: deja margen para las preguntas de participación, las animaciones y las pausas. Si vas atrasado, acorta las analogías; nunca las aclaraciones de rigor.\n\n`;
md += `**Arco didáctico.** La secuencia pedida es PROBLEMA → CONCEPTO → EJEMPLO → FUNCIONAMIENTO → LIMITACIONES → APLICACIÓN REAL. El orden de diapositivas solicitado la recorre así: problema (2) → concepto (3, 6) → funcionamiento (4, 5) → ejemplo y verificación (8, 9, 10) → aplicaciones (11) → limitaciones (12, 13) → aplicación real en la práctica (14). Se conservó el orden de diapositivas solicitado; el funcionamiento aparece antes del ejemplo y las aplicaciones (11) antes de las limitaciones (12–13).\n\n`;
md += `**Navegación:** → / Espacio avanza · ← retrocede · P vista de presentador · N notas · G índice · F pantalla completa · L modo ligero · ? ayuda.\n\n---\n\n`;
for (const n of NOTES) {
  md += `## ${n.annex ? 'Anexo' : n.n + '.'} ${n.title}\n\n`;
  md += `**Tiempo:** ${n.seconds ? fmtTime(n.seconds) : 'fuera de los 25 minutos'}\n\n`;
  md += `**Guion oral**\n\n${n.guion.map((p) => `> ${p}`).join('\n>\n')}\n\n`;
  if (n.tecnica) md += `**Explicación técnica para principiantes.** ${n.tecnica}\n\n`;
  if (n.analogia) md += `**Analogía.** ${n.analogia}\n\n`;
  if (n.pregunta) md += `**Pregunta de participación.** ${n.pregunta}\n\n`;
  if (n.transicion) md += `**Transición.** ${n.transicion}\n\n`;
  if (n.evitar.length) md += `**Errores conceptuales que evitar**\n\n${n.evitar.map((e) => `- ${e}`).join('\n')}\n\n`;
  if (n.rigor) md += `**Rigor (hecho / interpretación).** ${n.rigor}\n\n`;
  if (n.fuentes.length) md += `**Fuentes:** ${n.fuentes.map((f) => `[${byId[f].cite}](${byId[f].url})`).join(' · ')}\n\n`;
  md += `---\n\n`;
}
md += `## Fuentes\n\n${SOURCES.map((s) => `- ${s.cite} <${s.url}>`).join('\n')}\n`;
await writeFile(path.join(dist, 'guion-docente.md'), md);
console.log('✓ dist/notes.json · dist/guion-docente.md');

// 6 · prompt de referencia (mismas cifras que las diapositivas)
const { buildPrompt } = await import('./prompt.mjs');
await mkdir(path.join(root, 'materiales'), { recursive: true });
await writeFile(path.join(root, 'materiales', 'prompt-referencia.md'), buildPrompt());
console.log('✓ materiales/prompt-referencia.md');
