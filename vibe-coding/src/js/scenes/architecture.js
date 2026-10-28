// Diapositiva 5: qué pasa detrás de una instrucción.
// Lenguaje natural → LLM → código → frontend / backend / base de datos.
import { THREE, COL, glassMaterial, makeEdges, makeLines, pointsMaterial, makePoints, glowSprite, canvasTexture, roundRect, Stream, Packet } from './core.js';

// Registra opacidades base para poder atenuar un grupo completo.
function fadeable(obj) {
  const items = [];
  obj.traverse((o) => {
    const m = o.material;
    if (!m) return;
    if (m.uniforms && m.uniforms.uFade) items.push(() => m.uniforms.uFade);
    else {
      if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = m.opacity;
      items.push(m);
    }
  });
  let cur = 1, target = 1;
  return {
    set(t) { target = t; },
    snap() { cur = target; apply(); },
    step(dt) { cur += (target - cur) * Math.min(1, dt * 5); apply(); },
    get value() { return cur; },
  };
  function apply() {
    items.forEach((it) => {
      if (typeof it === 'function') it().value = cur;
      else it.opacity = it.userData.baseOpacity * cur;
    });
  }
}

export function createArchitecture(gl) {
  const lite = gl.lite;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101c27, 0.02);
  const camera = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.1, 200);
  camera.position.set(0.3, 0.9, 14);
  camera.lookAt(0, -0.1, 0);
  camera.setViewOffset(1920, 1080, 262, 0, 1920, 1080);

  scene.add(new THREE.AmbientLight(0xf3f0e5, 0.3));
  const key = new THREE.DirectionalLight(0xf3f0e5, 1.4);
  key.position.set(-5, 6, 8);
  scene.add(key);

  const root = new THREE.Group();
  root.position.y = -0.62;
  root.rotation.x = 0.04;
  scene.add(root);

  // ------------------------------------------------ 1 · lenguaje natural (tarjeta de prompt)
  const prompt = new THREE.Group();
  prompt.position.set(-2.45, 1.32, 0);
  prompt.rotation.y = 0.16;
  {
    const tex = canvasTexture(1400, 420, (ctx, w, h) => {
      roundRect(ctx, 4, 4, w - 8, h - 8, 40);
      ctx.fillStyle = 'rgba(12,22,31,0.92)';
      ctx.fill();
      ctx.font = '500 34px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(169,174,177,0.95)';
      ctx.fillText('PROMPT', 70, 110);
      ctx.font = '500 66px "JetBrains Mono", monospace';
      ctx.fillStyle = '#C8EC88';
      ctx.fillText('›', 70, 250);
      ctx.fillStyle = '#F3F0E5';
      ctx.fillText('Quiero ver mis', 140, 250);
      ctx.fillText('ingresos por mes', 140, 340);
      ctx.fillStyle = '#C8EC88';
      ctx.fillRect(140 + ctx.measureText('ingresos por mes').width + 14, 290, 26, 62);
    }, gl.renderer);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 0.87), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    prompt.add(plane);
    const frame = new THREE.BoxGeometry(2.96, 0.93, 0.08);
    prompt.add(makeEdges(frame, { color: COL.ivory, opacity: 0.45, width: 1.2 }));
  }
  root.add(prompt);

  // ------------------------------------------------ 2 · LLM (núcleo)
  const llm = new THREE.Group();
  llm.position.set(1.55, 1.25, -0.2);
  const ico = new THREE.IcosahedronGeometry(0.92, 1);
  const icoLines = makeEdges(ico, { color: COL.lime, opacity: 0.85, width: 1.4, threshold: 1 });
  llm.add(icoLines);
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.62, 48, 32), glassMaterial({ color: '#1f3326', rim: COL.lime, opacity: 0.3, rimStrength: 0.9, rimPower: 2 }));
  llm.add(inner);
  const llmGlow = glowSprite(COL.lime, 3.8, 0.42);
  llm.add(llmGlow);
  // anillo de «tokens»
  const ringN = lite ? 260 : 520;
  const ring = makePoints(ringN, pointsMaterial({ size: 0.05 }));
  {
    const g = ring.geometry;
    for (let i = 0; i < ringN; i++) {
      const a = (i / ringN) * Math.PI * 2, r = 1.32 + Math.random() * 0.12;
      g.attributes.position.array.set([Math.cos(a) * r, (Math.random() - 0.5) * 0.08, Math.sin(a) * r], i * 3);
      g.attributes.aPhase.array[i] = Math.random() * 6.28;
      const c = i % 7 === 0 ? COL.lime : COL.ivory;
      g.attributes.aColor.array.set([c.r, c.g, c.b], i * 3);
      g.attributes.aAlpha.array[i] = 0.75;
      g.attributes.aShape.array[i] = i % 3 === 0 ? 1 : 0;
    }
  }
  ring.rotation.x = 1.15;
  ring.rotation.z = 0.3;
  llm.add(ring);
  root.add(llm);

  // ------------------------------------------------ 4 · frontend (ventana de navegador)
  const frontend = new THREE.Group();
  frontend.position.set(-2.7, -1.45, 0.2);
  frontend.rotation.y = 0.22;
  {
    const geo = new THREE.BoxGeometry(2.5, 1.6, 0.07);
    frontend.add(new THREE.Mesh(geo, glassMaterial({ color: '#15232e', rim: COL.ivory, opacity: 0.32, rimStrength: 0.5 })));
    frontend.add(makeEdges(geo, { color: COL.ivory, opacity: 0.55, width: 1.3 }));
    const tex = canvasTexture(1250, 800, (ctx, w, h) => {
      ctx.fillStyle = 'rgba(243,240,229,0.08)';
      ctx.fillRect(0, 0, w, 86);
      ctx.fillStyle = 'rgba(243,240,229,0.35)';
      [50, 90, 130].forEach((x) => { ctx.beginPath(); ctx.arc(x, 43, 13, 0, 7); ctx.fill(); });
      ctx.font = '600 50px "Inter Tight", sans-serif';
      ctx.fillStyle = '#F3F0E5';
      ctx.fillText('Ingresos por mes', 60, 180);
      const vals = [0.42, 0.36, 0.5, 0.58, 0.54, 0.66];
      vals.forEach((v, i) => {
        ctx.fillStyle = i === 5 ? '#C8EC88' : 'rgba(243,240,229,0.62)';
        roundRect(ctx, 80 + i * 185, 740 - v * 760, 110, v * 760, 12);
        ctx.fill();
      });
    }, gl.renderer);
    const ui = new THREE.Mesh(new THREE.PlaneGeometry(2.42, 1.55), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    ui.position.z = 0.045;
    frontend.add(ui);
  }
  root.add(frontend);

  // ------------------------------------------------ 5 · backend (servidor)
  const backend = new THREE.Group();
  backend.position.set(0.35, -1.5, -0.1);
  backend.rotation.y = -0.32;
  const leds = [];
  {
    for (let k = 0; k < 3; k++) {
      const geo = new THREE.BoxGeometry(1.6, 0.38, 1.1);
      const m = new THREE.Mesh(geo, glassMaterial({ color: '#17252f', rim: COL.ivory, opacity: 0.3, rimStrength: 0.55 }));
      m.position.y = -0.46 + k * 0.46;
      backend.add(m);
      const e = makeEdges(geo, { color: COL.ivory, opacity: 0.5, width: 1.2 });
      e.position.copy(m.position);
      backend.add(e);
      for (let j = 0; j < 3; j++) {
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), new THREE.MeshBasicMaterial({ color: COL.lime, transparent: true }));
        led.position.set(0.48 + j * 0.13, m.position.y, 0.56);
        backend.add(led);
        leds.push({ led, phase: Math.random() * 6.28 });
      }
      const slot = makeLines([-0.6, m.position.y, 0.56, 0.25, m.position.y, 0.56], { color: COL.ivory, opacity: 0.35, width: 1 });
      backend.add(slot);
    }
  }
  root.add(backend);

  // ------------------------------------------------ 6 · base de datos
  const db = new THREE.Group();
  db.position.set(2.95, -1.55, 0);
  {
    const geo = new THREE.CylinderGeometry(0.62, 0.62, 0.3, 64);
    for (let k = 0; k < 3; k++) {
      const m = new THREE.Mesh(geo, glassMaterial({ color: '#17252f', rim: COL.ivory, opacity: 0.32, rimStrength: 0.6 }));
      m.position.y = -0.4 + k * 0.4;
      db.add(m);
      const e = makeEdges(geo, { color: COL.ivory, opacity: 0.5, width: 1.2, threshold: 30 });
      e.position.copy(m.position);
      db.add(e);
    }
  }
  root.add(db);

  // ------------------------------------------------ flujos
  root.updateMatrixWorld(true);
  const W = (o, v) => o.localToWorld(v.clone());
  const promptOut = W(prompt, new THREE.Vector3(1.5, 0, 0));
  const llmIn = W(llm, new THREE.Vector3(-1.0, 0, 0));
  const nlCurves = [-0.18, 0, 0.18].map((dy) => new THREE.CubicBezierCurve3(
    promptOut.clone().add(new THREE.Vector3(0, dy, 0)),
    promptOut.clone().add(new THREE.Vector3(0.6, dy + 0.35, 0.3)),
    llmIn.clone().add(new THREE.Vector3(-0.6, dy * 0.5 + 0.2, 0.3)),
    llmIn.clone()
  ));
  const nl = new Stream({ curves: nlCurves, count: lite ? 90 : 180, speed: 0.32, size: 0.06, colorA: COL.ivory, colorB: COL.ivory, alpha: 0.9, jitter: 0.08 });
  scene.add(nl.points);

  const llmOut = W(llm, new THREE.Vector3(0, -0.95, 0));
  const targets = [W(frontend, new THREE.Vector3(0.2, 0.85, 0)), W(backend, new THREE.Vector3(0, 0.75, 0)), W(db, new THREE.Vector3(0, 0.6, 0))];
  const codeCurves = targets.map((t) => new THREE.CubicBezierCurve3(llmOut, llmOut.clone().add(new THREE.Vector3(0, -0.8, 0.4)), t.clone().add(new THREE.Vector3(0, 0.9, 0.2)), t));
  const code = new Stream({ curves: codeCurves, count: lite ? 160 : 360, speed: 0.26, size: 0.075, colorA: COL.lime, colorB: COL.lime, shapeFrom: 1, shapeTo: 1, alpha: 0.95, jitter: 0.12 });
  scene.add(code.points);

  // paquetes de datos frontend ↔ backend ↔ base de datos
  const fe = W(frontend, new THREE.Vector3(1.3, -0.2, 0));
  const be1 = W(backend, new THREE.Vector3(-0.85, -0.2, 0));
  const be2 = W(backend, new THREE.Vector3(0.85, -0.25, 0));
  const dbp = W(db, new THREE.Vector3(-0.66, -0.2, 0));
  const lane = (a, b, h) => new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, h, 0.2)), b);
  const lanes = [lane(fe, be1, 0.25), lane(be1, fe, -0.25), lane(be2, dbp, 0.22), lane(dbp, be2, -0.22)];
  const laneLines = new THREE.Group();
  lanes.forEach((c, i) => {
    if (i % 2) return;
    const pts = c.getPoints(30);
    const pairs = [];
    for (let k = 0; k < pts.length - 1; k++) pairs.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z);
    laneLines.add(makeLines(pairs, { color: COL.ivory, opacity: 0.22, width: 1 }));
  });
  scene.add(laneLines);
  const packets = [new Packet(COL.ivory, 0.07, 0.6), new Packet(COL.lime, 0.07, 0.8), new Packet(COL.ivory, 0.07, 0.6), new Packet(COL.lime, 0.07, 0.8)];
  packets.forEach((p) => scene.add(p.group));
  let packetClock = 0;

  // ------------------------------------------------ fondo
  {
    const D = lite ? 200 : 420;
    const dust = makePoints(D, pointsMaterial({ size: 0.03 }));
    const g = dust.geometry;
    for (let i = 0; i < D; i++) {
      g.attributes.position.array.set([(Math.random() - 0.5) * 24, (Math.random() - 0.5) * 12, -3 - Math.random() * 8], i * 3);
      g.attributes.aPhase.array[i] = Math.random() * 6.28;
      g.attributes.aAlpha.array[i] = 0.2 + Math.random() * 0.25;
    }
    scene.add(dust);
    scene.userData.dust = dust;
  }

  // ------------------------------------------------ énfasis por paso
  const groups = {
    prompt: fadeable(prompt),
    nl: fadeable(nl.points),
    llm: fadeable(llm),
    code: fadeable(code.points),
    frontend: fadeable(frontend),
    backend: fadeable(backend),
    db: fadeable(db),
    lanes: fadeable(laneLines),
  };
  const focusMap = { 1: ['prompt', 'nl'], 2: ['llm', 'nl'], 3: ['code', 'llm'], 4: ['frontend', 'lanes'], 5: ['backend', 'lanes'], 6: ['db', 'lanes'] };
  const anchorKey = { prompt: 'prompt', llm: 'llm', frontend: 'frontend', backend: 'backend', db: 'db' };
  let focus = null;

  function setStep(step, instant) {
    focus = instant ? null : focusMap[step] || null;
    Object.entries(groups).forEach(([k, g]) => {
      g.set(!focus || focus.includes(k) ? 1 : 0.22);
      if (instant) g.snap();
    });
  }

  function isDimmed(anchor) {
    if (!focus) return false;
    const k = anchorKey[anchor];
    return k ? !focus.includes(k) : false;
  }

  const tmp = new THREE.Vector3();
  const A = { prompt: new THREE.Vector3(), llm: new THREE.Vector3(), frontend: new THREE.Vector3(), backend: new THREE.Vector3(), db: new THREE.Vector3() };

  function update(t, dt) {
    [nl, code].forEach((s) => { s.mat.uniforms.uTime.value = t; s.update(dt); });
    ring.material.uniforms.uTime.value = t;
    scene.userData.dust.material.uniforms.uTime.value = t;
    llm.rotation.y = t * 0.25;
    icoLines.rotation.x = t * 0.12;
    ring.rotation.y = t * 0.4;
    llmGlow.material.opacity = (0.34 + Math.sin(t * 1.6) * 0.1) * groups.llm.value;
    leds.forEach(({ led, phase }) => { led.material.opacity = (0.35 + 0.65 * (Math.sin(t * 3 + phase) > 0.2 ? 1 : 0.2)) * groups.backend.value; });
    frontend.position.y = -1.45 + Math.sin(t * 0.8) * 0.04;
    db.rotation.y = t * 0.15;
    packetClock -= dt;
    if (packetClock <= 0) {
      packetClock = 1.6;
      const idx = Math.floor(t / 1.6) % 2;
      const p = idx === 0 ? [packets[0], lanes[0], packets[2], lanes[2]] : [packets[3], lanes[3], packets[1], lanes[1]];
      if (!p[0].curve) p[0].launch(p[1], 0.9);
      if (!p[2].curve) setTimeout(() => !p[2].curve && p[2].launch(p[3], 0.9), 0);
    }
    Object.values(groups).forEach((g) => g.step(dt));
    packets.forEach((p) => {
      p.update(dt);
      p.core.material.opacity *= groups.lanes.value;
      p.halo.material.opacity *= groups.lanes.value;
    });
    camera.position.x = 0.3 + Math.sin(t * 0.12) * 0.25;
    camera.lookAt(0, -0.1, 0);
  }

  function anchors() {
    prompt.localToWorld(A.prompt.set(-1.45, 0.62, 0));
    llm.getWorldPosition(A.llm).add(tmp.set(-1.35, 0.75, 0));
    frontend.localToWorld(A.frontend.set(-1.25, -1.05, 0));
    backend.localToWorld(A.backend.set(-0.4, -1.0, 0.5));
    db.getWorldPosition(A.db).add(tmp.set(-0.62, -0.82, 0.6));
    return A;
  }

  return { scene, camera, update, setStep, anchors, isDimmed };
}
