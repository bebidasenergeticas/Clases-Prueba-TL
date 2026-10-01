/**
 * DULCERA · escena 3D del HERO (Three.js + GSAP).
 *
 * Historia ligada al scroll (progress 0 → 1):
 *   0.00–0.14  la caja flota; se rompe el sello
 *   0.10–0.36  la caja gira hacia el espectador y se abre la tapa (interior Jamaica con el slogan)
 *   0.32–0.62  las tres charolas suben en escalera: CLASSIC · FRUIT · CACAO
 *   0.62–0.92  las piezas se reordenan en cinco "colecciones": las tres charolas, el Recuerdo (EVENTOS)
 *              y la propia caja, que se oscurece hasta Piloncillo y se vuelve la Caja Corporativa
 *   0.90–1.00  reposo: el DOM muestra los nombres de las líneas debajo de cada objeto
 *
 * La escena no decide el scroll: main.js le pasa el progreso con setProgress(); aquí solo se suaviza.
 */
import { THREE, PALETTE, makeRenderer, setupLighting, giftBox, tray, favorBox, contactShadow, CANDY, svgTexture } from './three/kit.js';

const gsap = window.gsap;

/** Posición de cada "colección" en pantalla (fracción del viewport). main.js coloca las etiquetas con estos mismos valores. */
export const SLOTS = {
  wide: [0, 1, 2, 3, 4].map((i) => ({ x: 0.1 + 0.8 * ((i + 0.5) / 5), y: 0.5 })),
  tall: [
    { x: 0.2, y: 0.33 }, { x: 0.5, y: 0.33 }, { x: 0.8, y: 0.33 },
    { x: 0.32, y: 0.6 }, { x: 0.68, y: 0.6 },
  ],
};
export const SLOT_ORDER = ['classic', 'fruit', 'cacao', 'eventos', 'corporativo'];

export async function createHeroScene({ canvas, container, reducedMotion = false, onFrame } = {}) {
  const isSmall = () => container.clientWidth < 760;
  const renderer = makeRenderer(canvas, { dprMax: 1.75 });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const lights = setupLighting(renderer, scene);

  // Jerarquía: rig (parallax del puntero) → stage (línea de tiempo) → objetos
  const rig = new THREE.Group();
  const stage = new THREE.Group();
  rig.add(stage);
  scene.add(rig);

  const bob = new THREE.Group(); // flotación suave de la caja
  stage.add(bob);
  const box = giftBox();
  bob.add(box);
  const { shell, lidPivot, seal, outer, wordmark, dims } = box.userData;

  // Wordmark claro para cuando la caja se vuelve Piloncillo (corporativo)
  const wmLight = wordmark.clone();
  wmLight.material = wordmark.material.clone();
  wmLight.material.map = svgTexture('brand/concepts/concept-a-wordmark.svg', { width: 1024, height: 200, tint: PALETTE.nata });
  wmLight.material.opacity = 0;
  wordmark.parent.add(wmLight);

  const trays = {
    cacao: tray('cacao', { options: { transmission: 0 } }),
    fruit: tray('fruit', { options: { transmission: 0 } }),
    classic: tray('classic'),
  };
  const trayRest = { cacao: 0.1, fruit: 0.44, classic: 0.78 };
  Object.entries(trays).forEach(([k, t]) => {
    t.position.y = trayRest[k];
    box.add(t);
  });

  const favor = favorBox();
  stage.add(favor);

  const shadow = contactShadow(5.2, 0.28);
  shadow.position.y = -1.35;
  stage.add(shadow);

  // Dulces suspendidos alrededor de la caja
  const floaterDefs = [
    ['jamaica', [-2.9, 1.9, -1.2], 0.62], ['mangoChile', [2.8, 2.2, -0.8], 0.55], ['lecheQuemada', [-2.4, -0.6, 1.4], 0.5],
    ['bombon', [3.1, -0.2, 1.0], 0.5], ['tamarindo', [-0.9, 2.9, -2.2], 0.42], ['jamaica', [1.6, 3.1, 0.6], 0.36],
    ['cocada', [0.6, -1.25, 2.4], 0.4],
  ];
  const floaters = floaterDefs.map(([kind, pos, s], i) => {
    const outerG = new THREE.Group();
    const inner = CANDY[kind]({ transmission: 0 }); // sin transmisión: evita un pase de render extra
    inner.scale.multiplyScalar(s);
    inner.rotation.set(i * 0.7, i * 1.3, i * 0.4);
    outerG.add(inner);
    outerG.position.set(...pos);
    outerG.userData = { base: new THREE.Vector3(...pos), inner, phase: i * 1.7, scale0: 1 };
    stage.add(outerG);
    return outerG;
  });

  /* ---------------------------------------------------------------- layout */
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const tmp = new THREE.Vector3();
  function screenToWorld(fx, fy, z = 0) {
    raycaster.setFromCamera(new THREE.Vector2(fx * 2 - 1, -(fy * 2 - 1)), camera);
    plane.constant = -z;
    return raycaster.ray.intersectPlane(plane, new THREE.Vector3()) || new THREE.Vector3();
  }

  let L = null; // parámetros de layout actuales
  function computeLayout() {
    const w = container.clientWidth, h = container.clientHeight;
    const aspect = w / Math.max(h, 1);
    const tall = aspect < 1.05;
    camera.aspect = aspect;
    camera.fov = tall ? 38 : 30;
    camera.position.set(0, 2.2, tall ? 15.5 : 12.5);
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    renderer.setSize(w, h, false);

    const slots = (tall ? SLOTS.tall : SLOTS.wide).map((s) => screenToWorld(s.x, s.y));
    const slotW = slots[1].x - slots[0].x;
    L = {
      tall,
      slots,
      slotW,
      // pose inicial y abierta de la caja (en el stage)
      start: tall ? { x: 0, y: 1.35, s: 0.72 } : { x: aspect > 1.6 ? 2.15 : 1.7, y: 0.25, s: 1 },
      open: tall ? { x: 0, y: 0.35, s: 0.6 } : { x: aspect > 1.6 ? 1.5 : 1.2, y: -0.95, s: 0.8 },
    };
    floaters.forEach((f) => {
      const b = f.userData.base;
      f.userData.home = tall ? new THREE.Vector3(b.x * 0.55, b.y * 0.8 + 1.2, b.z) : new THREE.Vector3(b.x + L.start.x * 0.6, b.y, b.z);
    });
    return L;
  }

  /* --------------------------------------------------------------- timeline */
  let tl = null;
  const colorProxy = { k: 0 };
  const cNata = new THREE.Color(PALETTE.nata), cPil = new THREE.Color(PALETTE.piloncillo);

  function buildTimeline() {
    const keep = tl ? tl.progress() : 0;
    if (tl) tl.kill();
    computeLayout();
    const { start, open, slots, slotW, tall } = L;

    // estado inicial
    box.position.set(start.x, start.y, 0);
    box.rotation.set(0.2, -0.68, 0.02);
    box.scale.setScalar(start.s);
    shell.position.set(0, 0, 0);
    shell.scale.setScalar(1);
    lidPivot.rotation.x = 0;
    seal.scale.setScalar(1);
    Object.entries(trays).forEach(([k, t]) => {
      t.position.set(0, trayRest[k], 0);
      t.rotation.set(0, 0, 0);
      t.scale.setScalar(1);
    });
    favor.position.set(slots[3].x, slots[3].y + 9, 0);
    favor.rotation.set(0.3, -0.6, 0);
    favor.scale.setScalar(0.6 * slotW / 1.1);
    floaters.forEach((f) => {
      f.position.copy(f.userData.home);
      f.scale.setScalar(1);
    });
    colorProxy.k = 0;
    applyColor();
    shadow.position.set(start.x, -1.35, 0);
    shadow.scale.setScalar(start.s);
    shadow.material.opacity = 0.28;

    // pose final de la caja: centrada, casi frontal
    const end = { pos: new THREE.Vector3(0, 0, 0), rot: new THREE.Euler(0.32, 0, 0), s: 1 };
    const endM = new THREE.Matrix4().compose(end.pos, new THREE.Quaternion().setFromEuler(end.rot), new THREE.Vector3(1, 1, 1));
    const inv = endM.clone().invert();
    const local = (v, dy = 0) => v.clone().add(new THREE.Vector3(0, dy, 0)).applyMatrix4(inv);

    const trayScale = (0.78 * slotW) / 2.72;
    const shellScale = (0.7 * slotW) / 3;

    tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
    tl.set({}, {}, 1); // duración fija = 1

    // A · sello y giro
    tl.to(seal.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.07, ease: 'power3.in' }, 0.06);
    tl.to(seal.position, { z: dims.D / 2 + 0.3, duration: 0.07 }, 0.06);
    tl.to(box.rotation, { x: 0.5, y: -0.16, z: 0, duration: 0.28 }, 0.06);
    tl.to(box.position, { x: open.x, y: open.y, duration: 0.3 }, 0.06);
    tl.to(box.scale, { x: open.s, y: open.s, z: open.s, duration: 0.3 }, 0.06);
    tl.to(shadow.position, { x: open.x, duration: 0.3 }, 0.06);

    // B · tapa
    tl.to(lidPivot.rotation, { x: -1.95, duration: 0.24 }, 0.12);

    // C · charolas en escalera (cacao al frente y abajo, classic atrás y arriba)
    const H = dims.H;
    tl.to(trays.cacao.position, { y: H + 0.25, z: 1.3, duration: 0.26 }, 0.34);
    tl.to(trays.fruit.position, { y: H + 1.25, z: 0.1, duration: 0.26 }, 0.37);
    tl.to(trays.classic.position, { y: H + 2.25, z: -1.1, duration: 0.26 }, 0.4);
    tl.to(trays.cacao.rotation, { x: -0.18, duration: 0.26 }, 0.34);
    tl.to(trays.fruit.rotation, { x: -0.2, duration: 0.26 }, 0.37);
    tl.to(trays.classic.rotation, { x: -0.22, duration: 0.26 }, 0.4);
    floaters.forEach((f, i) => {
      const h = f.userData.home;
      tl.to(f.position, { x: h.x * 1.25, y: h.y + 0.6, z: h.z + 0.6, duration: 0.3 }, 0.3 + i * 0.01);
      tl.to(f.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.14, ease: 'power2.in' }, 0.62 + i * 0.012);
    });

    // D · cinco colecciones
    const D0 = 0.64;
    tl.to(box.position, { x: end.pos.x, y: end.pos.y, z: 0, duration: 0.26 }, D0);
    tl.to(box.rotation, { x: end.rot.x, y: 0, z: 0, duration: 0.26 }, D0);
    tl.to(box.scale, { x: 1, y: 1, z: 1, duration: 0.26 }, D0);
    tl.to(lidPivot.rotation, { x: 0, duration: 0.18 }, D0 + 0.04);
    const sh = local(slots[4], -(dims.H * shellScale) / 2);
    tl.to(shell.position, { x: sh.x, y: sh.y, z: sh.z, duration: 0.26 }, D0);
    tl.to(shell.scale, { x: shellScale, y: shellScale, z: shellScale, duration: 0.26 }, D0);
    tl.to(colorProxy, { k: 1, duration: 0.2, onUpdate: applyColor }, D0 + 0.06);
    ['classic', 'fruit', 'cacao'].forEach((k, i) => {
      const p = local(slots[i], -0.15 * trayScale);
      tl.to(trays[k].position, { x: p.x, y: p.y, z: p.z, duration: 0.26 }, D0 + i * 0.015);
      tl.to(trays[k].scale, { x: trayScale, y: trayScale, z: trayScale, duration: 0.26 }, D0 + i * 0.015);
      tl.to(trays[k].rotation, { x: 0.42, y: -0.3, duration: 0.26 }, D0 + i * 0.015);
    });
    tl.to(favor.position, { y: slots[3].y, duration: 0.24, ease: 'power3.out' }, D0 + 0.06);
    tl.to(favor.rotation, { x: 0.42, y: -0.5, duration: 0.24 }, D0 + 0.06);
    tl.to(shadow.material, { opacity: 0, duration: 0.12 }, D0);

    tl.progress(keep);
    return tl;
  }

  function applyColor() {
    outer.color.copy(cNata).lerp(cPil, colorProxy.k);
    wordmark.material.opacity = 1 - colorProxy.k;
    wmLight.material.opacity = colorProxy.k;
  }

  /* ------------------------------------------------------------- loop */
  let target = 0, current = 0, running = false, raf = 0, t0 = performance.now(), last = performance.now();
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let needsRender = true;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    const prev = current;
    // suavizado exponencial basado en tiempo: igual a 30, 60 o 120 fps
    current += (target - current) * (reducedMotion ? 1 : 1 - Math.exp(-dt * 7));
    if (Math.abs(target - current) < 0.0004) current = target;
    if (current !== prev || needsRender) tl.progress(current);

    if (!reducedMotion) {
      const kp = 1 - Math.exp(-dt * 3);
      pointer.sx += (pointer.x - pointer.sx) * kp;
      pointer.sy += (pointer.y - pointer.sy) * kp;
      const settle = 1 - Math.min(Math.max((current - 0.6) / 0.3, 0), 1); // menos movimiento al final
      rig.rotation.y = pointer.sx * 0.14 * (0.4 + 0.6 * settle);
      rig.rotation.x = pointer.sy * 0.06 * (0.4 + 0.6 * settle);
      bob.position.y = Math.sin(t * 0.8) * 0.08 * settle;
      bob.rotation.z = Math.sin(t * 0.5) * 0.015 * settle;
      floaters.forEach((f) => {
        const { inner, phase } = f.userData;
        inner.position.y = Math.sin(t * 0.7 + phase) * 0.16;
        inner.rotation.y += 0.15 * dt;
        inner.rotation.x += 0.07 * dt;
      });
    }
    renderer.render(scene, camera);
    needsRender = false;
    onFrame && onFrame(current);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  buildTimeline();
  await box.userData.ready.catch(() => {});
  await wmLight.material.map.ready;
  renderer.render(scene, camera); // primer frame (compila shaders)

  let resizeT = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      buildTimeline();
      needsRender = true;
      if (!running) renderer.render(scene, camera);
    }, 120);
  });
  ro.observe(container);

  return {
    get layout() { return L; },
    setProgress(p) { target = Math.min(Math.max(p, 0), 1); if (!running) { current = target; tl.progress(current); renderer.render(scene, camera); } },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    start, stop,
    renderOnce() { tl.progress(current); renderer.render(scene, camera); },
    dispose() { stop(); ro.disconnect(); renderer.dispose(); lights.pmrem.dispose(); },
    debug: { scene, camera, box, trays, favor, renderer, rig, get progress() { return [target, current]; } },
  };
}
