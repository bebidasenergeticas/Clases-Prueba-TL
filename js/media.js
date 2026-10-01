/**
 * DULCERA · imágenes.
 *
 * Cada <figure class="media" data-shot="XX"> recibe su imagen aquí:
 *   1. Si assets/generated/manifest.json marca la toma XX como lista → usa la imagen final de /assets/generated.
 *   2. Si no → usa el render provisional 3D de /assets/placeholders (ph-XX.webp), con etiqueta visible "Provisional".
 *
 * Para reemplazar imágenes: copia el archivo a /assets/generated y ejecuta `node tools/scan-assets.mjs`
 * (o edita el manifest a mano). Ver TECHNICAL_README.md.
 */
import { SHOTS } from './data.js';

const GENERATED = 'assets/generated/';
const PLACEHOLDERS = 'assets/placeholders/';
let manifest = null;

export async function loadManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch(`${GENERATED}manifest.json`, { cache: 'no-cache' });
    manifest = res.ok ? (await res.json()).images || {} : {};
  } catch {
    manifest = {};
  }
  return manifest;
}

/** Construye (o reconstruye) la imagen de una figura. `id` permite reasignar la toma (p. ej., en la hoja de línea). */
export function buildMedia(fig, id = fig.dataset.shot) {
  const shot = SHOTS[id];
  if (!shot) return null;
  fig.dataset.shot = id;
  fig.querySelectorAll('.media__img, .media__badge, .media__illustrative').forEach((n) => n.remove());

  const entry = manifest && manifest[id];
  const img = new Image();
  img.className = 'media__img';
  img.decoding = 'async';
  img.loading = fig.dataset.eager !== undefined || fig.closest('.hero') ? 'eager' : 'lazy';
  img.sizes = fig.dataset.sizes || sizesFor(fig);
  img.draggable = false;

  if (entry) {
    const ext = entry.ext || 'webp';
    if (entry.widths && entry.widths.length) {
      img.srcset = entry.widths.map((w) => `${GENERATED}${shot.file}-${w}.${ext} ${w}w`).join(', ');
      img.src = `${GENERATED}${shot.file}-${entry.widths[entry.widths.length - 1]}.${ext}`;
    } else {
      img.src = `${GENERATED}${entry.src || `${shot.file}.${ext}`}`;
    }
    img.alt = shot.decorative ? '' : shot.alt;
    fig.classList.add('media--ready');
  } else {
    img.srcset = `${PLACEHOLDERS}ph-${id}-800.webp 800w, ${PLACEHOLDERS}ph-${id}.webp 1600w`;
    img.src = `${PLACEHOLDERS}ph-${id}.webp`;
    img.alt = shot.decorative ? '' : `Render provisional. Representa: ${shot.alt}`;
    const badge = document.createElement('span');
    badge.className = 'media__badge';
    badge.textContent = `Provisional · img-${id}`;
    badge.setAttribute('aria-hidden', 'true');
    fig.appendChild(badge);
    fig.classList.remove('media--ready');
  }
  img.width = 1600;
  img.height = 1000;
  img.addEventListener('error', () => fig.classList.add('media--missing'), { once: true });
  fig.prepend(img);

  if (shot.illustrative) {
    const note = document.createElement('span');
    note.className = 'media__illustrative';
    note.textContent = 'Imagen ilustrativa';
    fig.appendChild(note);
  }
  return img;
}

function sizesFor(fig) {
  if (fig.closest('.hero, .corporate__hero, .wholesale__band, .events__a')) return '100vw';
  if (fig.closest('.corp-item, .process__step, .site-footer')) return '(max-width: 900px) 100vw, 25vw';
  return '(max-width: 900px) 100vw, 55vw';
}

export async function initMedia(root = document) {
  await loadManifest();
  root.querySelectorAll('figure.media[data-shot]').forEach((fig) => buildMedia(fig));
}
