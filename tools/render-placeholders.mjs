#!/usr/bin/env node
/**
 * Renderiza los placeholders 3D de las 24 tomas (tools/placeholder-studio.html) a WebP.
 * Requiere: servidor local en marcha (npm start) y Playwright con Chromium.
 *   node tools/render-placeholders.mjs [--base http://127.0.0.1:4173] [03 05 ...]
 * Salida: assets/placeholders/ph-XX.webp (1600 px) y ph-XX-800.webp (800 px)
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const base = baseIdx >= 0 ? args.splice(baseIdx, 2)[1] : 'http://127.0.0.1:4173';
const only = args;

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs')); }

const out = path.join(root, 'assets/placeholders');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
page.on('console', (m) => m.type() === 'error' && console.error('[console]', m.text()));

await page.goto(`${base}/tools/placeholder-studio.html`);
await page.waitForFunction(() => window.__ready === true);
const ids = only.length ? only : await page.evaluate(() => window.SHOT_IDS);

for (const id of ids) {
  await page.goto(`${base}/tools/placeholder-studio.html`);
  await page.waitForFunction(() => window.__ready === true);
  const { full, small } = await page.evaluate((i) => window.renderShot(i), id);
  const save = (dataUrl, name) => writeFile(path.join(out, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
  await save(full, `ph-${id}.webp`);
  await save(small, `ph-${id}-800.webp`);
  console.log('✓ ph-%s.webp', id);
}
await browser.close();
