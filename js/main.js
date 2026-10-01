/**
 * DULCERA · orquestación de la landing.
 * Librerías (vendorizadas en /vendor): GSAP + ScrollTrigger (globals), Lenis (global), Three.js (ESM, carga diferida).
 * Todo es mejora progresiva: sin JS, sin GSAP o sin WebGL la página sigue siendo legible y navegable.
 */
import { initMedia, buildMedia } from './media.js';
import { initLeadForm, handleLeadSubmission } from './lead-form.js';
import { LINES } from './data.js';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const root = document.documentElement;
const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = mqReduced.matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

window.handleLeadSubmission = handleLeadSubmission; // disponible en consola para pruebas
window.__dulcera = { errors: [] };
window.addEventListener('error', (e) => window.__dulcera.errors.push(String(e.message)));

let lenis = null;
let leadForm = null;
let heroScene = null;

/* ================================================================== arranque */
init().catch((err) => {
  console.error('[DULCERA] init', err);
  finishLoader(true);
});

async function init() {
  const mediaReady = initMedia();
  leadForm = initLeadForm({ onSuccess: successAnimation });
  initMenu();
  initDemoLinks();
  initPersonalize();
  initCobrand();
  initLineSheet();

  if (!gsap || !ScrollTrigger) {
    root.classList.add('no-gsap');
    initNavigation();
    finishLoader(true);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  initSmoothScroll();
  initNavigation();
  initHeader();
  splitHeadings();

  await Promise.race([mediaReady, wait(1200)]);
  await document.fonts?.ready?.catch?.(() => {});

  const heroReady = initHero();
  initProducts();
  initSensorial();
  initProcess();
  initEvents();
  initCorporate();
  initReveals();
  initCursor();

  await Promise.race([heroReady, wait(2500)]);
  await introSequence();
  ScrollTrigger.refresh();
  window.__ready = true;
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ================================================================== Lenis */
function initSmoothScroll() {
  if (reduced || !window.Lenis) return;
  lenis = new window.Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target, { immediate = false } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  if (lenis) lenis.scrollTo(y, { immediate, force: true, duration: 1.4 });
  else window.scrollTo({ top: y, behavior: immediate || reduced ? 'auto' : 'smooth' });
}

/* ================================================================== intro */
function finishLoader(force = false) {
  const loader = $('[data-loader]');
  if (!loader) return;
  if (force || !gsap) { loader.classList.add('is-done'); return; }
}

function introSequence() {
  const loader = $('[data-loader]');
  const letters = $$('.hero__letter');
  const copy = $$('[data-hero-copy] > *');
  if (reduced || !loader) {
    loader && loader.classList.add('is-done');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl.fromTo('.loader__layer', { scaleX: 0 }, { scaleX: 1, duration: 0.55, stagger: 0.12, ease: 'power3.out' })
      .to('.loader__mark', { scale: 0.86, duration: 0.3, ease: 'power2.in' }, '+=0.12')
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power3.inOut' }, '-=0.05')
      .set(loader, { className: 'loader is-done' })
      .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'power4.out' }, '-=0.55')
      .fromTo(copy, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.85')
      .fromTo('[data-hero-cue]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, '-=0.4');
  });
}

/* ================================================================== header + secciones */
function initHeader() {
  const header = $('[data-header]');
  const idx = $('[data-section-index]');
  const name = $('[data-section-name]');
  const navLinks = $$('.site-nav a');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (goingDown && y > window.innerHeight * 0.9 && !document.body.classList.contains('menu-open')) header.classList.add('is-hidden');
    if (goingUp || y < 200) header.classList.remove('is-hidden');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $$('[data-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return;
        idx.textContent = sec.dataset.section;
        name.textContent = sec.dataset.sectionLabel;
        navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${sec.id}`)));
      },
    });
  });
}

/* ================================================================== navegación + transición de capas */
function initNavigation() {
  const curtain = $('[data-curtain]');
  const bars = curtain ? [...curtain.children] : [];

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash === '#' || hash.length < 2) return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const intent = a.dataset.intent;
    if (intent && leadForm) leadForm.applyIntent(intent);
    go(target, hash, intent);
  });

  function go(target, hash, intent) {
    const distance = Math.abs(target.getBoundingClientRect().top);
    const useCurtain = gsap && !reduced && distance > window.innerHeight * 2.2;
    const after = () => {
      history.replaceState(null, '', hash);
      focusTarget(target, intent);
    };
    if (!useCurtain) {
      scrollToTarget(target);
      setTimeout(after, reduced ? 50 : 900);
      return;
    }
    gsap.timeline({ onComplete: after })
      .set(bars, { transformOrigin: 'left center' })
      .to(bars, { scaleX: 1, duration: 0.45, stagger: 0.07, ease: 'power3.inOut' })
      .add(() => { scrollToTarget(target, { immediate: true }); ScrollTrigger.update(); })
      .set(bars, { transformOrigin: 'right center' }, '+=0.08')
      .to(bars, { scaleX: 0, duration: 0.5, stagger: 0.07, ease: 'power3.inOut' });
  }
}

function focusTarget(target, intent) {
  if (target.id === 'cotizar') {
    const form = $('[data-lead-form]');
    const field = form && !form.hidden ? (intent ? form.elements.name : form.elements.name) : $('[data-lead-success]');
    field && field.focus({ preventScroll: true });
    return;
  }
  const heading = target.querySelector('h1, h2');
  const el = heading || target;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/* ================================================================== menú móvil */
let menuOpen = false;
function initMenu() {
  const btn = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { closeMenu(); btn.focus(); } });
  function openMenu() {
    menuOpen = true;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    btn.setAttribute('aria-expanded', 'true');
    btn.querySelector('.sr-only').textContent = 'Cerrar menú';
    document.body.classList.add('menu-open');
    $('#contenido').setAttribute('inert', '');
    lenis && lenis.stop();
    setTimeout(() => menu.querySelector('a').focus(), 150);
  }
  window.__openMenu = openMenu;
}
function closeMenu() {
  if (!menuOpen) return;
  const btn = $('[data-menu-toggle]');
  const menu = $('[data-mobile-menu]');
  menuOpen = false;
  menu.classList.remove('is-open');
  btn.setAttribute('aria-expanded', 'false');
  btn.querySelector('.sr-only').textContent = 'Abrir menú';
  document.body.classList.remove('menu-open');
  $('#contenido').removeAttribute('inert');
  lenis && lenis.start();
  setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 650);
}

/* ================================================================== titulares partidos en palabras */
function splitHeadings() {
  $$('[data-split]').forEach((el) => {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'split-word';
            w.setAttribute('aria-hidden', 'true');
            const inner = document.createElement('span');
            inner.textContent = p;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    el.setAttribute('aria-label', label);
  });
}

function initReveals() {
  if (reduced) return;
  $$('[data-split]').forEach((el) => {
    gsap.from(el.querySelectorAll('.split-word > span'), {
      yPercent: 110, duration: 1.05, ease: 'power4.out', stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
  const groups = [
    ['.section-head .body-l, .events__head .body-l', {}],
    ['.corp-item', { stagger: 0.08 }],
    ['.w-card', { stagger: 0.08 }],
    ['.mini-steps li', { stagger: 0.06 }],
    ['.quote__next li, .demo-note', { stagger: 0.06 }],
    ['.lead-form', {}],
    ['.site-footer__grid > *', { stagger: 0.06 }],
    ['.personalize', {}],
  ];
  groups.forEach(([sel, opts]) => {
    const els = $$(sel);
    if (!els.length) return;
    ScrollTrigger.batch(els, {
      start: 'top 90%', once: true,
      onEnter: (batch) => gsap.fromTo(batch, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: opts.stagger || 0 }),
    });
    gsap.set(els, { autoAlpha: 0 });
  });

  // revelado de imágenes con máscara (clip-path) + escala
  $$('.events__grid .media, .corp-item__media, .wholesale__media, .wholesale__band, .process__media').forEach((fig) => {
    gsap.fromTo(fig, { clipPath: 'inset(18% 0% 0% 0% round 14px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: fig, start: 'top 88%', once: true },
    });
    const img = fig.querySelector('.media__img');
    if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: fig, start: 'top 88%', once: true } });
  });

  // parallax suave por velocidad
  $$('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed);
    gsap.fromTo(el, { yPercent: -speed * 100 }, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ================================================================== 01 HERO */
async function initHero() {
  const hero = $('#inicio');
  const canvas = $('[data-hero-canvas]');
  const sticky = $('.hero__sticky', hero);
  let webgl = false;
  try {
    const { hasWebGL } = await import('./three/kit.js');
    webgl = hasWebGL();
    if (webgl) {
      const { createHeroScene, SLOTS } = await import('./hero-scene.js');
      heroScene = await createHeroScene({ canvas, container: sticky, reducedMotion: reduced });
      window.__dulcera.hero = heroScene;
      positionSlots(SLOTS);
      window.addEventListener('resize', () => positionSlots(SLOTS));
    }
  } catch (err) {
    console.warn('[DULCERA] WebGL no disponible; se usa la imagen de respaldo.', err);
    webgl = false;
    heroScene = null;
  }
  if (!webgl) {
    root.classList.add('no-webgl');
    canvas.remove();
  }
  window.__dulcera.webgl = webgl;

  // Sin movimiento reducido y con WebGL: la caja cuenta la historia con el scroll
  if (!reduced && heroScene) {
    hero.classList.add('is-story');
    ScrollTrigger.refresh();
    const dom = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    dom.set({}, {}, 1);
    dom.to('[data-hero-cue]', { autoAlpha: 0, duration: 0.04 }, 0.0);
    dom.to('[data-hero-copy]', { autoAlpha: 0, y: -40, duration: 0.08, ease: 'power1.in' }, 0.03);
    $$('.hero__letter').forEach((g, i) => {
      dom.to(g, { x: (i - 3) * 12, duration: 0.3, ease: 'power1.inOut' }, 0.1);
    });
    dom.to('.hero__wordmark', { autoAlpha: 0.07, scale: 1.04, duration: 0.3 }, 0.1);
    const steps = $$('[data-hero-steps] li');
    const marks = [[0.06, 0.18], [0.18, 0.34], [0.36, 0.6]];
    steps.forEach((li, i) => {
      const [a, b] = marks[i];
      dom.fromTo(li, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.04 }, a);
      dom.to(li, { autoAlpha: i === 2 ? 0 : 0.28, duration: 0.04 }, b);
    });
    dom.to(steps, { autoAlpha: 0, duration: 0.04 }, 0.6);
    dom.fromTo('[data-hero-collections]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.86);
    dom.fromTo('.slot-label', { y: 16 }, { y: 0, duration: 0.06, stagger: 0.008 }, 0.86);
    dom.to('.hero__wordmark', { autoAlpha: 0, duration: 0.06 }, 0.8);

    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.5, animation: dom,
      onUpdate: (self) => heroScene.setProgress(self.progress),
    });
    if (finePointer) {
      window.addEventListener('pointermove', (e) => {
        heroScene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      }, { passive: true });
    }
  } else if (heroScene) {
    heroScene.setProgress(0.5); // movimiento reducido: caja abierta, estática
    $('[data-hero-cue]') && ($('[data-hero-cue]').style.display = 'none');
  }

  if (heroScene) {
    // renderiza solo mientras el hero es visible y la pestaña está activa
    let visible = true;
    const sync = () => (!reduced && visible && !document.hidden ? heroScene.start() : heroScene.stop());
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: '100px' }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    if (reduced) { heroScene.stop(); heroScene.renderOnce(); } else sync();
  }
}

function positionSlots(SLOTS) {
  if (!heroScene) return;
  const tall = heroScene.layout && heroScene.layout.tall;
  const set = tall ? SLOTS.tall : SLOTS.wide;
  $$('.slot-label').forEach((el) => {
    const s = set[+el.dataset.slot];
    el.style.left = `${s.x * 100}%`;
    el.style.top = `calc(${s.y * 100}% + ${tall ? 7 : 11}vh)`;
  });
}

/* ================================================================== 02 PRODUCTOS */
function initProducts() {
  const pin = $('[data-products-pin]');
  const track = $('[data-products-track]');
  const rail = $('[data-products-rail]');
  const bars = $$('[data-products-progress] i');
  const panels = $$('.line-panel');
  const setActive = (i) => bars.forEach((b, k) => b.classList.toggle('is-active', k <= i));
  setActive(0);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => setActive(Math.min(4, Math.floor(self.progress * 5.2))),
      },
    });
    panels.forEach((p) => {
      const img = p.querySelector('.media__img');
      const body = p.querySelectorAll('.line-panel__body > *');
      gsap.fromTo(p.querySelector('.line-panel__media'), { clipPath: 'inset(0% 0% 0% 30%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true },
      });
      if (img) gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, { xPercent: 8, scale: 1.05, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(body, { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 70%', once: true } });
    });
    return () => gsap.set(track, { x: 0 });
  });
  mm.add('(max-width: 1023px)', () => {
    const onScroll = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setActive(Math.round((rail.scrollLeft / Math.max(max, 1)) * 4));
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => rail.removeEventListener('scroll', onScroll);
  });

  // abrir hoja de línea desde la imagen
  panels.forEach((p) => p.querySelector('.line-panel__media').addEventListener('click', () => p.querySelector('[data-open-line]').click()));
}

/* ================================================================== 03 EXPERIENCIA: capas que se apilan */
function initSensorial() {
  if (reduced) return;
  const items = $$('.sensorial__item');
  items.forEach((item, i) => {
    const img = item.querySelector('.media__img');
    const text = item.querySelectorAll('.sensorial__text > *');
    if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: item, start: 'top bottom', end: 'top top', scrub: true } });
    gsap.from(text, { y: 40, autoAlpha: 0, stagger: 0.06, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 40%', once: true } });
    if (i < items.length - 1) {
      gsap.to(item, {
        scale: 0.93, borderRadius: 18, ease: 'none',
        scrollTrigger: { trigger: items[i + 1], start: 'top bottom', end: 'top top', scrub: true },
      });
    }
  });
}

/* ================================================================== 04 PROCESO */
function initProcess() {
  const svg = $('[data-process-svg]');
  if (!svg) return;
  const steps = $$('.process__step');
  const dots = $$('.process__dots li');
  const q = (s) => svg.querySelector(s);
  const bands = svg.querySelectorAll('.ps-band');
  let current = -1;

  function setStep(i) {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k <= i));
    const d = reduced ? 0 : 0.9;
    const e = 'power3.inOut';
    gsap.to(q('.ps-grid'), { autoAlpha: i === 1 ? 1 : 0.35, duration: d });
    // mordida: punto central (idea) → posición de la mordida (diseño) → desaparece
    gsap.to(q('.ps-bite'), {
      attr: { cx: i === 0 ? 200 : 296, cy: i === 0 ? 200 : 89.6 },
      fill: i === 0 ? '#C8274A' : 'rgba(200,39,74,0)', stroke: '#C8274A', strokeWidth: i === 1 ? 1.6 : 0,
      autoAlpha: i <= 1 ? 1 : 0, scale: i === 0 ? 1 : 1, duration: d, ease: e,
    });
    gsap.to(q('.ps-outline'), { strokeDashoffset: i >= 1 && i < 4 ? 0 : 1, autoAlpha: i >= 2 ? 0.35 : 1, duration: d * 1.4, ease: e });
    gsap.to(bands, { scaleX: i >= 2 ? 1 : 0, fill: (k) => (i === 4 ? '#F5EDE1' : ['#E39A2D', '#C8274A', '#F2B8C6'][k]), duration: d, stagger: i >= 2 ? 0.14 : 0, ease: e });
    gsap.to([q('.ps-box'), q('.ps-lid')], { strokeDashoffset: i === 3 ? 0 : 1, autoAlpha: i === 3 ? 1 : 0, duration: d * 1.3, stagger: 0.15, ease: e });
    gsap.to(q('.ps-seal'), { scale: i === 4 ? 1 : 0, duration: d, ease: i === 4 ? 'power3.out' : e });
    gsap.to(svg.querySelectorAll('.ps-motion line'), { autoAlpha: i === 4 ? 1 : 0, x: i === 4 ? 0 : -20, duration: d, stagger: 0.08 });
  }
  gsap.set(svg.querySelectorAll('.ps-motion line'), { autoAlpha: 0 });
  setStep(0);
  steps.forEach((step, i) => {
    ScrollTrigger.create({ trigger: step, start: 'top 62%', end: 'bottom 62%', onToggle: (self) => self.isActive && setStep(i) });
  });
}

/* ================================================================== 05 EVENTOS: personalización */
function initPersonalize() {
  const wrap = $('[data-personalize]');
  if (!wrap) return;
  const text = $('[data-favor-text]', wrap);
  const date = $('[data-favor-date]', wrap);
  const body = $('[data-favor-body]', wrap);
  $('[data-favor-input]', wrap).addEventListener('input', (e) => { text.textContent = e.target.value.trim() || 'Tu nombre'; });
  $('[data-favor-date-input]', wrap).addEventListener('input', (e) => { date.textContent = e.target.value.trim(); });
  $$('input[name="favor-color"]', wrap).forEach((r) => r.addEventListener('change', () => {
    body.style.setProperty('--favor', r.value);
    const dark = r.value === '#5B3A2C';
    wrap.querySelector('.favor-svg__band').style.fill = dark ? '#E4D5C3' : '';
  }));
}
function initEvents() { /* parallax y revelados cubiertos por initReveals */ }

/* ================================================================== 06 CORPORATIVO */
function initCobrand() {
  const input = $('[data-cobrand-input]');
  const name = $('[data-cobrand-name]');
  if (!input) return;
  input.addEventListener('input', () => { name.textContent = input.value.trim().toUpperCase() || 'TU MARCA'; });
}
function initCorporate() {
  if (reduced) return;
  const hero = $('.corporate__hero');
  if (!hero) return;
  gsap.fromTo(hero, { clipPath: 'inset(0% 14% 0% 14% round 14px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 14px)', ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top 90%', end: 'center 55%', scrub: true },
  });
  const img = hero.querySelector('.media__img');
  if (img) gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ================================================================== hoja de línea (transición interna) */
function initLineSheet() {
  const sheet = $('[data-line-sheet]');
  if (!sheet || typeof sheet.showModal !== 'function') return;
  const fig = $('[data-sheet-media]', sheet);
  let opener = null;
  let currentLine = null;

  $$('[data-open-line]').forEach((btn) => btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    open(btn.dataset.openLine, x, y, btn);
  }));

  function fill(key) {
    const L = LINES[key];
    currentLine = key;
    $('[data-sheet-index]', sheet).textContent = `${L.index} / 05 · ${L.name}`;
    $('[data-sheet-title]', sheet).textContent = L.claim;
    $('[data-sheet-intro]', sheet).textContent = L.intro;
    $('[data-sheet-products]', sheet).innerHTML = L.products.map((p) => `
      <li><h3>${p.name}</h3><p>${p.desc}</p><p class="notes">${p.notes}</p><p class="format">${p.format}</p></li>`).join('');
    buildMedia(fig, L.shot);
    sheet.style.setProperty('--line', L.color);
  }

  function open(key, x, y, btn) {
    opener = btn;
    fill(key);
    sheet.style.setProperty('--ox', `${x}px`);
    sheet.style.setProperty('--oy', `${y}px`);
    sheet.showModal();
    document.body.classList.add('sheet-open');
    lenis && lenis.stop();
    if (gsap && !reduced) {
      gsap.fromTo(sheet, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(150vmax at ${x}px ${y}px)`, duration: 0.9, ease: 'power3.inOut' });
      gsap.from(sheet.querySelectorAll('.line-sheet__body > *'), { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.7, delay: 0.35, ease: 'power3.out' });
    } else sheet.style.clipPath = 'none';
    sheet.querySelector('[data-close-sheet]').focus();
  }

  function close(then) {
    const done = () => {
      sheet.close();
      document.body.classList.remove('sheet-open');
      lenis && lenis.start();
      if (then) then(); else opener && opener.focus();
    };
    if (gsap && !reduced) {
      const ox = sheet.style.getPropertyValue('--ox'), oy = sheet.style.getPropertyValue('--oy');
      gsap.to(sheet, { clipPath: `circle(0px at ${ox} ${oy})`, duration: 0.6, ease: 'power3.inOut', onComplete: done });
    } else done();
  }

  sheet.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  $('[data-close-sheet]', sheet).addEventListener('click', () => close());
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  $('[data-sheet-quote]', sheet).addEventListener('click', () => {
    const L = LINES[currentLine];
    close(() => {
      const intent = { eventos: 'evento', corporativo: 'corporativo' }[currentLine];
      if (intent) leadForm.applyIntent(intent);
      else leadForm.setMessage(`Me interesa la línea ${L.name} (${L.products.map((p) => p.name).join(', ')}). Quisiera saber formatos y disponibilidad.`);
      const link = document.createElement('a');
      link.href = '#cotizar';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });
}

/* ================================================================== cursor sutil */
function initCursor() {
  const el = $('[data-cursor]');
  if (!el || !finePointer || reduced) return;
  const label = el.querySelector('.cursor__label');
  const pos = { x: -100, y: -100 }, cur = { x: -100, y: -100 };
  window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; el.classList.add('is-visible'); }, { passive: true });
  document.addEventListener('pointerleave', () => el.classList.remove('is-visible'));
  gsap.ticker.add(() => {
    cur.x += (pos.x - cur.x) * 0.2;
    cur.y += (pos.y - cur.y) * 0.2;
    el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
  });
  document.addEventListener('pointerover', (e) => {
    const lab = e.target.closest('[data-cursor-label]');
    const hot = e.target.closest('a, button, input, textarea, label, summary');
    el.classList.toggle('is-label', !!lab);
    el.classList.toggle('is-hover', !lab && !!hot);
    label.textContent = lab ? lab.dataset.cursorLabel : '';
  });
}

/* ================================================================== varios */
function initDemoLinks() {
  const toast = $('[data-toast]');
  let t = 0;
  $$('[data-demo-link]').forEach((b) => b.addEventListener('click', () => {
    toast.textContent = `${b.dataset.demoLink}: enlace de demostración. DULCERA es una marca ficticia.`;
    toast.classList.add('is-visible');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }));
}

function successAnimation(success) {
  if (!gsap || reduced) return;
  gsap.fromTo(success.querySelectorAll('.lead-success__mark path'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' });
  gsap.from(success.querySelectorAll(':scope > :not(svg)'), { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out' });
}
