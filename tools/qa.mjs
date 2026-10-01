#!/usr/bin/env node
/**
 * DULCERA · QA automatizado en Chromium (Playwright).
 *   npm start            (en otra terminal)
 *   node tools/qa.mjs [--base http://127.0.0.1:4173] [--out ./qa-output] [--quick]
 *
 * Verifica por viewport: carga sin errores de consola, ausencia de 404, sin scroll horizontal,
 * logos SVG cargados, hero (WebGL + historia de scroll), navegación, hoja de línea, menú móvil,
 * formulario (validación + handleLeadSubmission) y modos de respaldo (movimiento reducido, sin WebGL).
 * Guarda capturas por sección en --out.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('--base', 'http://127.0.0.1:4173');
const OUT = path.resolve(opt('--out', 'qa-output'));
const QUICK = args.includes('--quick');

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const GL_ARGS = ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--use-angle=swiftshader'];
const VIEWPORTS = [
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1366', width: 1366, height: 768 },
  { name: 'tablet-820', width: 820, height: 1180, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
];
const SECTIONS = ['#productos', '#experiencia', '#proceso', '#eventos', '#empresas', '#mayoreo', '#cotizar', '.site-footer'];

const report = { base: BASE, date: new Date().toISOString(), runs: [], failures: [] };
const fail = (run, msg) => { run.failures.push(msg); report.failures.push(`[${run.name}] ${msg}`); };
await mkdir(OUT, { recursive: true });

async function openPage(browser, vp, { reducedMotion = 'no-preference' } = {}) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const log = { errors: [], warnings: [], failed: [] };
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error') log.errors.push(t);
    if (m.type() === 'warning' && !/GPU stall|ReadPixels|swiftshader|WebGL/i.test(t)) log.warnings.push(t);
  });
  page.on('pageerror', (e) => log.errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => log.failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) log.failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 45000 });
  await page.waitForTimeout(400);
  return { ctx, page, log };
}

async function scrollTo(page, y, settle = 1300) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(settle);
}
const overflowX = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function shot(page, run, label) {
  const file = path.join(OUT, `${run.name}--${label}.png`);
  await page.screenshot({ path: file });
  run.shots.push(path.basename(file));
}

const browser = await chromium.launch({ args: GL_ARGS });

for (const vp of QUICK ? [VIEWPORTS[1], VIEWPORTS[4]] : VIEWPORTS) {
  const run = { name: vp.name, failures: [], shots: [], checks: {} };
  report.runs.push(run);
  const { ctx, page, log } = await openPage(browser, vp);


  // hero + historia
  run.checks.webgl = await page.evaluate(() => window.__dulcera.webgl);
  if (!run.checks.webgl) fail(run, 'WebGL no inicializó');
  await shot(page, run, '01-hero');
  const heroH = await page.evaluate(() => document.querySelector('#inicio').offsetHeight - window.innerHeight);
  for (const p of [0.22, 0.5, 0.97]) {
    await scrollTo(page, Math.round(heroH * p), 1600);
    await shot(page, run, `01-hero-${String(Math.round(p * 100)).padStart(2, '0')}`);
  }
  run.checks.heroStoryActive = await page.evaluate(() => document.querySelector('#inicio').classList.contains('is-story'));

  // secciones
  let maxOverflow = await overflowX(page);
  for (const sel of SECTIONS) {
    const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);
    await scrollTo(page, y + 2);
    if (sel === '#productos' && !vp.mobile) {
      await shot(page, run, '02-productos-a');
      await scrollTo(page, y + vp.height * 1.6);
      await shot(page, run, '02-productos-b');
      continue;
    }
    if (sel === '#experiencia' || sel === '#proceso') {
      await scrollTo(page, y + vp.height * 0.9);
    }
    await shot(page, run, sel.replace(/[#.]/g, '').replace('site-footer', '09-footer'));
    maxOverflow = Math.max(maxOverflow, await overflowX(page));
  }
  // logos SVG (después de recorrer la página: el del footer es lazy)
  await page.waitForTimeout(500);
  run.checks.logos = await page.evaluate(() => [...document.querySelectorAll('img[src^="brand/"]')].map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 })));
  run.checks.logos.filter((l) => !l.ok).forEach((l) => fail(run, `logo no cargó: ${l.src}`));
  run.checks.overflowX = maxOverflow;
  if (maxOverflow > 1) fail(run, `scroll horizontal de ${maxOverflow}px`);

  // elementos que se salen del viewport (posibles overflow visuales)
  run.checks.offenders = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    return [...document.querySelectorAll('main *, footer *')].filter((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || el.closest('.products__track, .products__rail, .marquee, .hero__wordmark, .site-footer__giant, .hp, .sr-only, dialog')) return false;
      return r.right > W + 1 || r.left < -1;
    }).slice(0, 8).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
  });
  if (run.checks.offenders.length) fail(run, `elementos fuera del viewport: ${run.checks.offenders.join(', ')}`);

  // navegación: cada enlace del menú lleva a su sección
  run.checks.nav = [];
  await scrollTo(page, 0, 600);
  const targets = ['#productos', '#eventos', '#empresas', '#mayoreo', '#cotizar'];
  for (const hash of targets) {
    await page.evaluate(() => document.querySelector('[data-header]').classList.remove('is-hidden'));
    await page.waitForTimeout(600);
    if (vp.mobile) {
      await page.click('[data-menu-toggle]');
      await page.waitForTimeout(700);
      await page.click(`.mobile-menu a[href="${hash}"]`);
    } else {
      await page.evaluate(() => document.querySelector('[data-header]').classList.remove('is-hidden'));
      await page.click(`.site-nav a[href="${hash}"], .site-header__cta[href="${hash}"]`);
    }
    await page.waitForTimeout(2600);
    const inView = await page.evaluate((h) => {
      const r = document.querySelector(h).getBoundingClientRect();
      return r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.3;
    }, hash);
    run.checks.nav.push({ hash, inView });
    if (!inView) fail(run, `navegación a ${hash} no llegó a la sección`);
  }

  // CTA del hero con intención (Cotizar mayoreo) prellena el mensaje
  await scrollTo(page, 0, 800);
  await page.click('.hero__ctas a[data-intent="mayoreo"]');
  await page.waitForTimeout(2600);
  run.checks.intentPrefill = await page.evaluate(() => document.querySelector('#lead-message').value.includes('distribuir'));
  if (!run.checks.intentPrefill) fail(run, 'CTA "Cotizar mayoreo" no prellenó el mensaje');

  // hoja de línea
  const prodY = await page.evaluate(() => document.querySelector('#productos').getBoundingClientRect().top + window.scrollY);
  await scrollTo(page, prodY + (vp.mobile ? 300 : vp.height * 1.1));
  const btn = await page.$('[data-open-line="fruit"]');
  await btn.scrollIntoViewIfNeeded().catch(() => {});
  await btn.click({ force: true });
  await page.waitForTimeout(1300);
  run.checks.sheetOpen = await page.evaluate(() => document.querySelector('[data-line-sheet]').open && document.querySelector('[data-sheet-title]').textContent);
  await shot(page, run, '02-hoja-linea');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  run.checks.sheetClosed = await page.evaluate(() => !document.querySelector('[data-line-sheet]').open);
  if (!run.checks.sheetOpen || !run.checks.sheetClosed) fail(run, 'la hoja de línea no abre/cierra');

  // formulario
  const formY = await page.evaluate(() => document.querySelector('#cotizar').getBoundingClientRect().top + window.scrollY);
  await scrollTo(page, formY);
  await page.fill('#lead-message', '');
  await page.click('[data-submit]');
  await page.waitForTimeout(300);
  run.checks.formErrors = await page.evaluate(() => [...document.querySelectorAll('.field.is-invalid')].map((f) => f.dataset.field));
  if (!['name', 'email', 'message'].every((k) => run.checks.formErrors.includes(k))) fail(run, `validación vacía incompleta: ${run.checks.formErrors}`);
  await page.fill('#lead-name', 'Mariana Demo');
  await page.fill('#lead-company', 'Empresa Demo');
  await page.fill('#lead-email', 'mariana@empresa');
  await page.fill('#lead-message', 'Corto');
  await page.click('[data-submit]');
  await page.waitForTimeout(300);
  run.checks.formErrors2 = await page.evaluate(() => [...document.querySelectorAll('.field.is-invalid')].map((f) => f.dataset.field));
  if (!(run.checks.formErrors2.includes('email') && run.checks.formErrors2.includes('message'))) fail(run, 'no detectó correo o mensaje inválidos');
  await shot(page, run, '08-form-errores');
  await page.fill('#lead-email', 'mariana@empresa.com');
  await page.fill('#lead-message', 'Necesitamos 600 cajas para un evento empresarial en noviembre y queremos personalizar el empaque.');
  await page.click('[data-submit]');
  await page.waitForSelector('[data-lead-success]:not([hidden])', { timeout: 5000 }).catch(() => {});
  run.checks.lead = await page.evaluate(() => window.__dulceraLeads && window.__dulceraLeads[window.__dulceraLeads.length - 1]);
  const keys = run.checks.lead ? Object.keys(run.checks.lead).filter((k) => k !== 'id').sort().join(',') : '';
  if (keys !== 'company,email,message,name') fail(run, `objeto del lead inesperado: ${keys}`);
  await shot(page, run, '08-form-exito');

  // menú móvil
  if (vp.mobile) {
    await page.evaluate(() => document.querySelector('[data-header]').classList.remove('is-hidden'));
    await page.waitForTimeout(600);
    await page.click('[data-menu-toggle]');
    await page.waitForTimeout(800);
    run.checks.menuOpen = await page.evaluate(() => document.querySelector('[data-mobile-menu]').classList.contains('is-open'));
    await shot(page, run, '00-menu');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
    if (!run.checks.menuOpen) fail(run, 'menú móvil no abrió');
  }

  // consola
  run.checks.console = { errors: log.errors, warnings: log.warnings.slice(0, 10), failed: log.failed };
  if (log.errors.length) fail(run, `errores de consola: ${log.errors.slice(0, 3).join(' | ')}`);
  if (log.failed.length) fail(run, `peticiones fallidas: ${log.failed.slice(0, 3).join(' | ')}`);
  await ctx.close();
}

// movimiento reducido
{
  const vp = VIEWPORTS[1];
  const run = { name: 'reduced-motion-1440', failures: [], shots: [], checks: {} };
  report.runs.push(run);
  const { ctx, page, log } = await openPage(browser, vp, { reducedMotion: 'reduce' });
  run.checks.heroStory = await page.evaluate(() => document.querySelector('#inicio').classList.contains('is-story'));
  if (run.checks.heroStory) fail(run, 'la historia del hero no debe activarse con movimiento reducido');
  await shot(page, run, '01-hero');
  for (const sel of ['#productos', '#experiencia', '#proceso']) {
    const y = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY, sel);
    await scrollTo(page, y + 2, 500);
    await shot(page, run, sel.slice(1));
  }
  run.checks.overflowX = await overflowX(page);
  if (run.checks.overflowX > 1) fail(run, 'scroll horizontal en movimiento reducido');
  if (log.errors.length) fail(run, `errores de consola: ${log.errors.join(' | ')}`);
  await ctx.close();
}
await browser.close();

// sin WebGL
{
  const b2 = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
  const vp = VIEWPORTS[4];
  const run = { name: 'no-webgl-390', failures: [], shots: [], checks: {} };
  report.runs.push(run);
  const { ctx, page, log } = await openPage(b2, vp);
  run.checks.noWebglClass = await page.evaluate(() => document.documentElement.classList.contains('no-webgl'));
  run.checks.fallbackVisible = await page.evaluate(() => getComputedStyle(document.querySelector('.hero__fallback')).display !== 'none');
  if (!run.checks.noWebglClass || !run.checks.fallbackVisible) fail(run, 'el respaldo sin WebGL no se activó');
  await shot(page, run, '01-hero');
  if (log.errors.length) fail(run, `errores de consola: ${log.errors.join(' | ')}`);
  await ctx.close();
  await b2.close();
}

await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\nQA DULCERA · ${report.runs.length} corridas · ${report.failures.length} fallas`);
report.runs.forEach((r) => console.log(`${r.failures.length ? '✗' : '✓'} ${r.name}${r.failures.length ? '\n   - ' + r.failures.join('\n   - ') : ''}`));
process.exitCode = report.failures.length ? 1 : 0;
