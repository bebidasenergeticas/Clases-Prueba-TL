#!/usr/bin/env node
/**
 * Escanea /assets/generated y reescribe manifest.json con las tomas disponibles.
 *   node tools/scan-assets.mjs
 * Reconoce: dulcera-img-XX-<descriptor>.<ext>  y  dulcera-img-XX-<descriptor>-<ancho>.<ext>
 */
import { readdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'assets/generated');
const dataSrc = await readFile(path.join(root, 'js/data.js'), 'utf8');
const files = Object.fromEntries([...dataSrc.matchAll(/'(\d{2})': \{ file: '([^']+)'/g)].map((m) => [m[1], m[2]]));

const images = {};
for (const name of await readdir(dir)) {
  const m = name.match(/^dulcera-img-(\d{2})-.+?(?:-(\d{3,4}))?\.(webp|avif|jpe?g|png)$/i);
  if (!m) continue;
  const [, id, width, ext] = m;
  const expected = files[id];
  if (!expected || !name.startsWith(expected)) {
    console.warn(`⚠ ${name}: no coincide con el nombre esperado (${expected || 'id desconocido'}).*`);
    continue;
  }
  images[id] = images[id] || { ext: ext.toLowerCase() };
  if (width) (images[id].widths = images[id].widths || []).push(Number(width));
  else images[id].src = name;
}
Object.values(images).forEach((e) => e.widths && e.widths.sort((a, b) => a - b));

const manifest = {
  _comment: 'Imágenes finales listas en /assets/generated. Regenerar con: node tools/scan-assets.mjs. Vacío = la web usa los renders provisionales de /assets/placeholders.',
  images,
};
await writeFile(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest.json: ${Object.keys(images).length} / 24 tomas con imagen final`, Object.keys(images).join(' '));
