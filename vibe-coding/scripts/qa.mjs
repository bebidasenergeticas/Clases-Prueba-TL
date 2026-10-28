// Control de calidad automático: recorre todas las diapositivas y todos los
// pasos en modo presentación y detecta errores de consola, texto fuera del
// escenario, texto desbordado o superpuesto y tamaños de letra demasiado pequeños.
// Uso: node scripts/qa.mjs [--shots]   (--shots guarda capturas de cada paso)
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shots = process.argv.includes('--shots');
const shotDir = path.join(root, 'build', 'qa');
if (shots) await mkdir(shotDir, { recursive: true });

const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

const url = pathToFileURL(path.join(root, 'dist', 'vibe-coding.html')).href;
await page.goto(url + '#/1');
await page.waitForTimeout(2500);
const steps = await page.evaluate(() => [...document.querySelectorAll('.slide')].map((s) => {
  const declared = parseInt(s.dataset.steps || '0', 10);
  const found = Math.max(0, ...[...s.querySelectorAll('[data-step]')].map((f) => parseInt(f.dataset.step, 10)));
  return Math.max(declared, found);
}));

const problems = [];
let minFont = Infinity, minFontWhere = '';
let states = 0;

for (let i = 0; i < steps.length; i++) {
  for (let s = 0; s <= steps[i]; s++) {
    await page.evaluate((h) => { location.hash = h; }, `#/${i + 1}/${s}`);
    await page.waitForTimeout(s === 0 ? 1700 : 1200);
    states++;
    if (shots) await page.screenshot({ path: path.join(shotDir, `s${String(i + 1).padStart(2, '0')}-p${s}.png`) });
    const res = await page.evaluate(() => {
      const out = { issues: [], minFont: Infinity, minWhere: '' };
      const slide = document.querySelector('.slide.is-active');
      const visible = (el) => {
        for (let e = el; e && e !== document.body; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.1) return false;
        }
        return true;
      };
      const label = (el) => (el.className && el.className.baseVal === undefined ? el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0] : el.tagName.toLowerCase()) + ' «' + el.textContent.trim().slice(0, 40) + '»';
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
      const boxes = [];
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (!visible(el) || el.closest('[data-qa-ignore]')) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        const rects = [...r.getClientRects()].filter((q) => q.width > 1 && q.height > 1);
        if (!rects.length) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        const inMock = !!el.closest('svg, .mini');
        if (!inMock && fs < out.minFont) { out.minFont = fs; out.minWhere = label(el); }
        for (const q of rects) {
          if (q.left < -1 || q.top < -1 || q.right > 1921 || q.bottom > 1081) out.issues.push(`fuera del escenario: ${label(el)}`);
          boxes.push({ el, q });
        }
        // desborde del contenedor inmediato
        const box = el.closest('p, li, h2, h3, dd, dt, blockquote, figcaption, span, b, div');
        if (box && box.scrollWidth > box.clientWidth + 2 && getComputedStyle(box).overflow !== 'visible') out.issues.push(`texto desbordado: ${label(box)}`);
      }
      // superposición entre fragmentos de texto distintos
      for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
          const A = boxes[a], B = boxes[b];
          if (A.el === B.el) continue;
          const w = Math.min(A.q.right, B.q.right) - Math.max(A.q.left, B.q.left);
          const h = Math.min(A.q.bottom, B.q.bottom) - Math.max(A.q.top, B.q.top);
          if (w > 3 && h > 3 && w * h > 40) out.issues.push(`superposición: ${label(A.el)} ↔ ${label(B.el)}`);
        }
      }
      return out;
    });
    res.issues.forEach((m) => problems.push(`diapositiva ${i + 1}, paso ${s}: ${m}`));
    if (res.minFont < minFont) { minFont = res.minFont; minFontWhere = `diapositiva ${i + 1}: ${res.minWhere}`; }
  }
}

// teclado y navegación básica
await page.evaluate(() => { location.hash = '#/1/0'; });
await page.waitForTimeout(800);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(400);
const afterKey = await page.evaluate(() => location.hash);
if (afterKey !== '#/2') problems.push(`navegación con teclado: se esperaba #/2 y se obtuvo ${afterKey}`);
await page.keyboard.press('g');
await page.waitForTimeout(400);
const indexOpen = await page.evaluate(() => !!document.querySelector('.overlay.open'));
if (!indexOpen) problems.push('el índice (G) no se abrió');
await page.keyboard.press('Escape');

await browser.close();

const uniq = [...new Set(problems)];
console.log(`Estados revisados: ${states} · tamaño mínimo de texto (fuera de maquetas): ${minFont}px en ${minFontWhere}`);
if (errors.length) console.log('Errores de consola:\n  ' + [...new Set(errors)].join('\n  '));
if (uniq.length) console.log('Problemas:\n  ' + uniq.join('\n  '));
if (!errors.length && !uniq.length) console.log('✓ Sin errores de consola, desbordes, superposiciones ni texto fuera del escenario.');
process.exitCode = errors.length || uniq.length ? 1 : 0;
