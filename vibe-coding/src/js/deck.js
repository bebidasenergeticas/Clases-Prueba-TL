// Navegación de la presentación: escalado del escenario, pasos, teclado,
// enlaces directos (#/n/paso), índice, ayuda y notas en pantalla.
import { NOTES, fmtTime } from '../content/notes.js';

const pad = (n) => String(n).padStart(2, '0');

export class Deck {
  constructor({ stage, exportMode = false }) {
    this.stage = stage;
    this.exportMode = exportMode;
    this.slides = [...stage.querySelectorAll('.slide')];
    this.steps = this.slides.map((s) => {
      const declared = parseInt(s.dataset.steps || '0', 10);
      const found = Math.max(0, ...[...s.querySelectorAll('[data-step]')].map((f) => parseInt(f.dataset.step, 10)));
      return Math.max(declared, found);
    });
    this.index = 0;
    this.step = 0;
    this.listeners = [];
    this.pageNum = document.getElementById('pageNum');
    this.progress = document.querySelector('#progress i');
    this.contentCount = this.slides.filter((s) => !s.dataset.annex).length;
  }

  on(fn) {
    this.listeners.push(fn);
  }

  emit(type) {
    const slide = this.slides[this.index];
    this.listeners.forEach((fn) => fn({ type, index: this.index, step: this.step, slide, steps: this.steps[this.index] }));
  }

  // ------------------------------------------------------------ escalado
  fit() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.min(vw / 1920, vh / 1080);
    this.scale = s;
    this.stage.style.transform = `translate(${-960 * s}px, ${-540 * s}px) scale(${s})`;
    return s;
  }

  // ------------------------------------------------------------ navegación
  go(index, step = 0, { silent = false } = {}) {
    index = Math.max(0, Math.min(this.slides.length - 1, index));
    step = Math.max(0, Math.min(this.steps[index], step));
    const changed = index !== this.index || !this._started;
    this._started = true;
    this.index = index;
    this.step = step;
    this.slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === index);
      s.classList.toggle('is-past', i < index);
      s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    this.applyStep();
    const slide = this.slides[index];
    this.stage.classList.toggle('on-cover', index === 0);
    const annex = !!slide.dataset.annex;
    this.pageNum.textContent = annex ? 'A' : pad(index + 1);
    this.pageNum.parentElement.lastChild.textContent = ` / ${this.contentCount}`;
    const totalSteps = this.steps.reduce((a, b) => a + b + 1, 0);
    const done = this.steps.slice(0, index).reduce((a, b) => a + b + 1, 0) + step + 1;
    this.progress.style.width = `${(done / totalSteps) * 100}%`;
    if (!this.exportMode && !silent) {
      const h = `#/${index + 1}${step ? '/' + step : ''}`;
      if (location.hash !== h) history.replaceState(null, '', h);
    }
    this.emit(changed ? 'slide' : 'step');
  }

  applyStep() {
    const slide = this.slides[this.index];
    const step = this.step;
    slide.querySelectorAll('[data-step]').forEach((f) => {
      const k = parseInt(f.dataset.step, 10);
      f.classList.toggle('is-on', step >= k);
      f.classList.toggle('is-current', step === k);
    });
    for (let k = 0; k <= 8; k++) slide.classList.toggle(`step-${k}`, step === k);
    slide.style.setProperty('--step', step);
    slide.style.setProperty('--p', this.steps[this.index] ? step / this.steps[this.index] : 1);
  }

  next() {
    if (this.step < this.steps[this.index]) this.go(this.index, this.step + 1);
    else if (this.index < this.slides.length - 1) this.go(this.index + 1, 0);
  }

  prev() {
    if (this.step > 0) this.go(this.index, this.step - 1);
    else if (this.index > 0) this.go(this.index - 1, this.steps[this.index - 1]);
  }

  fromHash() {
    const m = location.hash.match(/^#\/(\d+)(?:\/(\d+))?/);
    if (!m) return false;
    this.go(parseInt(m[1], 10) - 1, parseInt(m[2] || '0', 10), { silent: true });
    return true;
  }

  // ------------------------------------------------------------ entrada
  bindInput({ onKey } = {}) {
    window.addEventListener('keydown', (e) => this.handleKey(e, onKey));
    window.addEventListener('hashchange', () => this.fromHash());
    window.addEventListener('resize', () => { this.fit(); this.emit('resize'); });
    let x0 = null, y0 = null;
    window.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? this.next() : this.prev());
      x0 = null;
    });
    this.stage.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      const r = this.stage.getBoundingClientRect();
      (e.clientX - r.left < r.width * 0.25 ? this.prev() : this.next());
    });
  }

  handleKey(e, onKey) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (onKey && onKey(k, e) === true) return;
    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown': case 'Enter':
        e.preventDefault(); this.next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
        e.preventDefault(); this.prev(); break;
      case 'Home': e.preventDefault(); this.go(0, 0); break;
      case 'End': e.preventDefault(); this.go(this.slides.length - 1, 0); break;
      default:
        if (/^[0-9]$/.test(k)) {
          this._num = (this._num || '') + k;
          clearTimeout(this._numT);
          this._numT = setTimeout(() => { this.go(parseInt(this._num, 10) - 1, 0); this._num = ''; }, 450);
        }
    }
  }
}

// ------------------------------------------------------------ overlays
export function buildOverlays(deck) {
  const help = document.createElement('div');
  help.className = 'overlay';
  help.innerHTML = `<div class="panel"><h3>Atajos de teclado</h3><div class="keys">
    <kbd>→ · Espacio · AvPág</kbd><span>Siguiente paso o diapositiva (también clic o deslizar)</span>
    <kbd>← · RePág</kbd><span>Paso o diapositiva anterior</span>
    <kbd>Inicio · Fin</kbd><span>Primera / última diapositiva</span>
    <kbd>número + pausa</kbd><span>Ir a la diapositiva (por ejemplo 9)</span>
    <kbd>F</kbd><span>Pantalla completa</span>
    <kbd>P</kbd><span>Vista de presentador en otra ventana (notas, cronómetro, siguiente)</span>
    <kbd>N</kbd><span>Notas docentes en esta ventana</span>
    <kbd>G</kbd><span>Índice de diapositivas con tiempos</span>
    <kbd>T</kbd><span>Iniciar / pausar cronómetro</span>
    <kbd>L</kbd><span>Modo ligero (menos partículas; útil en equipos modestos o en Meet)</span>
    <kbd>?</kbd><span>Mostrar / ocultar esta ayuda</span>
  </div></div>`;
  document.body.appendChild(help);

  const index = document.createElement('div');
  index.className = 'overlay';
  const items = deck.slides
    .map((s, i) => {
      const n = NOTES[i];
      return `<button data-go="${i}"><span class="n">${s.dataset.annex ? 'A' : pad(i + 1)}</span><span>${s.dataset.title}</span><span class="t">${n && n.seconds ? fmtTime(n.seconds) : '—'}</span></button>`;
    })
    .join('');
  index.innerHTML = `<div class="panel"><h3>Índice · 25:00</h3><div class="index-list">${items}</div></div>`;
  document.body.appendChild(index);
  index.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) { deck.go(parseInt(b.dataset.go, 10), 0); index.classList.remove('open'); }
    else if (e.target === index) index.classList.remove('open');
  });
  help.addEventListener('click', () => help.classList.remove('open'));

  const notes = document.createElement('aside');
  notes.id = 'notesbar';
  document.body.appendChild(notes);

  const hud = document.getElementById('hud');
  let hudT;
  const toast = (msg) => {
    hud.textContent = msg;
    hud.hidden = false;
    clearTimeout(hudT);
    hudT = setTimeout(() => (hud.hidden = true), 2400);
  };

  const renderNotes = () => {
    const n = NOTES[deck.index];
    if (!n || !notes.classList.contains('open')) return;
    notes.innerHTML = `<div class="meta">${deck.slides[deck.index].dataset.annex ? 'Anexo' : pad(n.n)} · ${n.title} · ${n.seconds ? fmtTime(n.seconds) : 'fuera de tiempo'} · paso ${deck.step}/${deck.steps[deck.index]}</div>
      <h4>Guion</h4>${n.guion.map((p) => `<p>${p}</p>`).join('')}
      ${n.transicion ? `<h4>Transición</h4><p>${n.transicion}</p>` : ''}`;
  };

  deck.on(() => {
    renderNotes();
    index.querySelectorAll('[data-go]').forEach((b) => b.classList.toggle('cur', +b.dataset.go === deck.index));
  });

  return {
    toggleHelp: () => help.classList.toggle('open'),
    toggleIndex: () => index.classList.toggle('open'),
    toggleNotes: () => { notes.classList.toggle('open'); renderNotes(); },
    closeAll: () => { [help, index].forEach((o) => o.classList.remove('open')); notes.classList.remove('open'); },
    toast,
  };
}
