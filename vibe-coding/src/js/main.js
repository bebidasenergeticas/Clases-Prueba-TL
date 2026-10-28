import { Deck, buildOverlays } from './deck.js';
import { Presenter, Timer } from './presenter.js';
import { renderIcons } from './icons.js';
import { renderCharts } from './charts.js';
import { GLManager } from './scenes/core.js';
import { createCover } from './scenes/cover.js';
import { createArchitecture } from './scenes/architecture.js';
import { createExcelFlow } from './scenes/excel-flow.js';

const params = new URLSearchParams(location.search);
const EXPORT = params.has('export');
const LITE = params.get('lite') === '1';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function boot() {
  if (EXPORT) document.body.classList.add('export');
  renderIcons();
  renderCharts();
  try { await document.fonts.ready; } catch (_) { /* sin soporte: continúa */ }
  await Promise.all(['600 40px "Inter Tight"', '500 40px "Inter"', '500 40px "JetBrains Mono"'].map((f) => document.fonts.load(f).catch(() => null)));

  const stage = document.getElementById('stage');
  const canvas = document.getElementById('gl');
  const deck = new Deck({ stage, exportMode: EXPORT });

  let gl = null;
  try {
    gl = new GLManager(canvas, { exportMode: EXPORT, lite: LITE });
    gl.register('cover', (m) => createCover(m, { variant: 'cover' }));
    gl.register('closing', (m) => createCover(m, { variant: 'closing' }));
    gl.register('architecture', createArchitecture);
    gl.register('excel', createExcelFlow);
  } catch (err) {
    console.warn('WebGL no disponible; la presentación sigue sin escenas 3D.', err);
    gl = null;
  }

  const applyScale = () => {
    const s = deck.fit();
    if (gl) {
      const cap = LITE ? 1 : 2;
      gl.setPixelRatio(Math.max(0.75, Math.min(cap, s * (window.devicePixelRatio || 1))));
    }
  };
  applyScale();

  deck.on(({ type, slide, step, index }) => {
    if (type === 'resize') { applyScale(); return; }
    // estados específicos por diapositiva
    if (slide.classList.contains('s-flow')) {
      slide.classList.toggle('loop-on', step >= 7);
      slide.style.setProperty('--p', Math.max(0, (step - 1) / 6));
    }
    if (gl) {
      gl.show(slide.dataset.scene || null, slide, EXPORT ? 99 : step);
      const nextScene = deck.slides[index + 1] && deck.slides[index + 1].dataset.scene;
      if (!EXPORT && nextScene) setTimeout(() => gl.warm(nextScene), 900);
    }
  });

  if (EXPORT) {
    const n = parseInt(params.get('slide') || '1', 10) - 1;
    deck.go(n, 99);
    if (gl && deck.slides[n].dataset.scene) gl.renderStill(parseFloat(params.get('t') || '9'));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    window.__ready = true;
    return;
  }

  const ui = buildOverlays(deck);
  const timer = new Timer();
  const presenter = new Presenter(deck, timer, ui.toast);

  deck.bindInput({
    onKey: (k) => {
      switch (k) {
        case 'f': case 'F':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen().catch(() => ui.toast('Pantalla completa no disponible'));
          return true;
        case 'p': case 'P': presenter.open(); return true;
        case 'n': case 'N': ui.toggleNotes(); return true;
        case 'g': case 'G': ui.toggleIndex(); return true;
        case '?': case 'h': case 'H': ui.toggleHelp(); return true;
        case 't': case 'T': presenter.markStart(); timer.toggle(); ui.toast(timer.running ? 'Cronómetro en marcha' : 'Cronómetro en pausa'); presenter.render(); return true;
        case 'l': case 'L': {
          const u = new URL(location.href);
          if (LITE) u.searchParams.delete('lite'); else u.searchParams.set('lite', '1');
          location.replace(u.toString());
          return true;
        }
        case 'Escape': ui.closeAll(); return true;
        default: return false;
      }
    },
  });

  if (!deck.fromHash()) deck.go(0, 0);
  if (gl) gl.start();
  if (!sessionStorageGet('vc-help')) {
    setTimeout(() => ui.toast('Pulsa ? para ver los atajos · P abre la vista de presentador'), 1200);
    sessionStorageSet('vc-help', '1');
  }
  if (reduceMotion && gl) gl.time = 0;
}

function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } }
function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (_) { /* almacenamiento bloqueado */ } }

boot();
