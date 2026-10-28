// Vista de presentador en una ventana aparte. Se controla desde esta ventana
// (funciona también al abrir el archivo con doble clic, sin servidor).
import { NOTES, TOTAL_SECONDS, fmtTime } from '../content/notes.js';
import { sourceById } from '../content/sources.js';

const pad = (n) => String(n).padStart(2, '0');
const mmss = (s) => {
  const neg = s < 0;
  s = Math.abs(Math.round(s));
  return (neg ? '−' : '') + `${Math.floor(s / 60)}:${pad(s % 60)}`;
};

export class Timer {
  constructor() {
    this.running = false;
    this.elapsed = 0;
    this.slideElapsed = 0;
    this.t0 = 0;
    this.slide0 = 0;
  }
  now() { return performance.now() / 1000; }
  toggle() { this.running ? this.pause() : this.start(); }
  start() { if (!this.running) { this.running = true; this.t0 = this.now(); this.slide0 = this.t0; } }
  pause() { if (this.running) { const n = this.now(); this.elapsed += n - this.t0; this.slideElapsed += n - this.slide0; this.running = false; } }
  reset() { this.elapsed = 0; this.slideElapsed = 0; this.t0 = this.slide0 = this.now(); }
  newSlide() { this.slideElapsed = 0; this.slide0 = this.now(); }
  total() { return this.elapsed + (this.running ? this.now() - this.t0 : 0); }
  slide() { return this.slideElapsed + (this.running ? this.now() - this.slide0 : 0); }
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#101C27;color:#F3F0E5;font:16px/1.5 Inter,system-ui,sans-serif;padding:24px 28px;-webkit-font-smoothing:antialiased}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
header{display:grid;grid-template-columns:1fr auto auto;gap:28px;align-items:end;padding-bottom:18px;border-bottom:1px solid rgba(243,240,229,.14)}
.cur small{display:block;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#C8EC88}
.cur h1{font:600 30px/1.15 'Inter Tight',Inter,sans-serif;letter-spacing:-.01em;margin-top:4px}
.cur .next{margin-top:6px;color:#A9AEB1;font-size:14px}
.clock{text-align:right}
.clock b{display:block;font:600 44px/1 'JetBrains Mono',monospace;letter-spacing:-.02em}
.clock span{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#858C92}
.clock.warn b{color:#C8EC88}
.bar{grid-column:1/-1;height:6px;border-radius:9px;background:rgba(243,240,229,.1);position:relative;overflow:hidden}
.bar i{position:absolute;left:0;top:0;bottom:0;background:#C8EC88;border-radius:9px}
.bar s{position:absolute;top:-2px;bottom:-2px;width:2px;background:#F3F0E5}
.ctrls{display:flex;gap:8px;margin:14px 0 4px;flex-wrap:wrap}
button{all:unset;cursor:pointer;font:500 13px 'JetBrains Mono',monospace;padding:8px 14px;border-radius:99px;border:1px solid rgba(243,240,229,.22);color:#F3F0E5}
button:hover{border-color:#C8EC88;color:#C8EC88}
main{display:grid;grid-template-columns:1.35fr 1fr;gap:28px;margin-top:16px}
h4{font:600 12px 'JetBrains Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:#C8EC88;margin:18px 0 6px}
p,li{color:#D9DBD6;font-size:16px;line-height:1.55}
p+p{margin-top:8px}
ul{padding-left:18px}
li+li{margin-top:4px}
.q{border-left:3px solid #C8EC88;padding-left:12px}
.step{font-size:13px;color:#858C92}
.src li{font-size:13px;color:#A9AEB1;word-break:break-all}
`;

export class Presenter {
  constructor(deck, timer, toast) {
    this.deck = deck;
    this.timer = timer;
    this.toast = toast;
    this.win = null;
    this.startIndex = 0;
    deck.on(({ type }) => {
      if (type === 'slide') this.timer.newSlide();
      this.render();
    });
    setInterval(() => this.tick(), 250);
  }

  open() {
    if (this.win && !this.win.closed) { this.win.focus(); return; }
    const w = window.open('', 'vibe-coding-presentador', 'width=1280,height=860');
    if (!w) { this.toast('Permite las ventanas emergentes para abrir la vista de presentador'); return; }
    this.win = w;
    w.document.open();
    w.document.write(`<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>Presentador · Vibe Coding</title><style>${this.fontFaces()}${CSS}</style></head><body>
      <header><div class="cur"><small id="pNum"></small><h1 id="pTitle"></h1><div class="next" id="pNext"></div></div>
      <div class="clock" id="pSlideClock"><b id="pSlide">0:00</b><span id="pSlideBudget"></span></div>
      <div class="clock" id="pTotalClock"><b id="pTotal">0:00</b><span id="pPlan"></span></div>
      <div class="bar"><i id="pBar"></i><s id="pPlanMark"></s></div></header>
      <div class="ctrls"><button id="bPrev">◀ Anterior</button><button id="bNext">Siguiente ▶</button><button id="bTimer">Iniciar cronómetro</button><button id="bReset">Reiniciar</button><span class="step" id="pStep"></span></div>
      <main><section id="pLeft"></section><section id="pRight"></section></main></body></html>`);
    w.document.close();
    const $ = (id) => w.document.getElementById(id);
    $('bPrev').onclick = () => this.deck.prev();
    $('bNext').onclick = () => this.deck.next();
    $('bTimer').onclick = () => { this.markStart(); this.timer.toggle(); this.render(); };
    $('bReset').onclick = () => { this.timer.reset(); this.startIndex = this.deck.index; this.render(); };
    w.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') { this.markStart(); this.timer.toggle(); this.render(); return; }
      this.deck.handleKey(e);
    });
    if (!this.timer.running && this.timer.total() === 0) { this.markStart(); this.timer.start(); }
    this.render();
  }

  // El plan de tiempo se mide desde la diapositiva en la que arrancó el cronómetro.
  markStart() {
    if (this.timer.total() === 0) this.startIndex = this.deck.index;
  }

  fontFaces() {
    // Reutiliza las fuentes incrustadas de la presentación.
    return [...document.querySelectorAll('style')].map((s) => (s.textContent.match(/@font-face\s*{[^}]*}/g) || []).join('\n')).join('\n');
  }

  render() {
    const w = this.win;
    if (!w || w.closed) return;
    const d = w.document;
    const i = this.deck.index;
    const n = NOTES[i];
    const nx = NOTES[i + 1];
    d.getElementById('pNum').textContent = `${n.annex ? 'Anexo' : 'Diapositiva ' + pad(n.n) + ' / 15'} · ${n.seconds ? fmtTime(n.seconds) : 'fuera de tiempo'}`;
    d.getElementById('pTitle').textContent = n.title;
    const nextLabel = this.deck.step < this.deck.steps[i] ? `Siguiente: paso ${this.deck.step + 1} de ${this.deck.steps[i]} en esta diapositiva` : nx ? `Siguiente diapositiva: ${nx.title}` : 'Fin de la presentación';
    d.getElementById('pNext').textContent = nextLabel;
    d.getElementById('pStep').textContent = this.deck.steps[i] ? `Paso ${this.deck.step} / ${this.deck.steps[i]}` : '';
    d.getElementById('bTimer').textContent = this.timer.running ? 'Pausar cronómetro (T)' : 'Iniciar cronómetro (T)';
    const sec = (title, html) => (html ? `<h4>${title}</h4>${html}` : '');
    const ps = (arr) => arr.map((p) => `<p>${p}</p>`).join('');
    d.getElementById('pLeft').innerHTML = sec('Guion oral', ps(n.guion)) + sec('Transición', n.transicion ? `<p>${n.transicion}</p>` : '');
    d.getElementById('pRight').innerHTML =
      sec('Pregunta de participación', n.pregunta ? `<p class="q">${n.pregunta}</p>` : '') +
      sec('Explicación técnica', n.tecnica ? `<p>${n.tecnica}</p>` : '') +
      sec('Analogía', n.analogia ? `<p>${n.analogia}</p>` : '') +
      sec('Errores conceptuales que evitar', n.evitar.length ? `<ul>${n.evitar.map((e) => `<li>${e}</li>`).join('')}</ul>` : '') +
      sec('Rigor', n.rigor ? `<p>${n.rigor}</p>` : '') +
      sec('Fuentes', n.fuentes.length ? `<ul class="src">${n.fuentes.map((f) => `<li>${sourceById[f].cite}<br>${sourceById[f].url}</li>`).join('')}</ul>` : '');
    this.tick();
  }

  tick() {
    const w = this.win;
    if (!w || w.closed) return;
    const d = w.document;
    const i = this.deck.index;
    const n = NOTES[i];
    const total = this.timer.total();
    const slide = this.timer.slide();
    const planUntil = NOTES.slice(Math.min(this.startIndex, i), i).reduce((a, x) => a + x.seconds, 0);
    d.getElementById('pSlide').textContent = mmss(slide);
    d.getElementById('pSlideBudget').textContent = n.seconds ? `esta diapositiva · meta ${fmtTime(n.seconds)}` : 'anexo';
    d.getElementById('pSlideClock').classList.toggle('warn', n.seconds && slide > n.seconds);
    d.getElementById('pTotal').textContent = mmss(total);
    const diff = total - planUntil - Math.min(slide, n.seconds || 0);
    d.getElementById('pPlan').textContent = `de 25:00 · ${Math.abs(diff) < 15 ? 'en tiempo' : diff > 0 ? 'atrasado ' + mmss(diff) : 'adelantado ' + mmss(-diff)}`;
    d.getElementById('pBar').style.width = `${Math.min(100, (total / TOTAL_SECONDS) * 100)}%`;
    d.getElementById('pPlanMark').style.left = `${Math.min(100, (planUntil / TOTAL_SECONDS) * 100)}%`;
  }
}
