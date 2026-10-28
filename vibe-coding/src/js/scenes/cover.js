// Portada y cierre: una idea (núcleo neuronal de partículas) que fluye y se
// convierte en software (estructura de capas de vidrio: interfaz, lógica, datos).
import { THREE, COL, glassMaterial, makeEdges, makeLines, pointsMaterial, makePoints, glowSprite, canvasTexture, roundRect, Stream } from './core.js';

function rand(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function screenTexture(kind, renderer) {
  return canvasTexture(640, 400, (ctx, w, h) => {
    ctx.fillStyle = 'rgba(16,28,39,0.0)';
    ctx.fillRect(0, 0, w, h);
    roundRect(ctx, 6, 6, w - 12, h - 12, 26);
    ctx.fillStyle = 'rgba(20,34,46,0.72)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(243,240,229,0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = 'rgba(243,240,229,0.3)';
    [34, 58, 82].forEach((x) => { ctx.beginPath(); ctx.arc(x, 34, 8, 0, 7); ctx.fill(); });
    if (kind === 'chart') {
      const vals = [0.35, 0.5, 0.42, 0.68, 0.6, 0.85];
      vals.forEach((v, i) => {
        ctx.fillStyle = i === 5 ? '#C8EC88' : 'rgba(243,240,229,0.55)';
        roundRect(ctx, 60 + i * 88, h - 50 - v * 240, 52, v * 240, 8);
        ctx.fill();
      });
    } else if (kind === 'code') {
      ctx.font = '500 26px "JetBrains Mono", monospace';
      const lines = [
        ['#C8EC88', 'const flujo ='],
        ['rgba(243,240,229,.8)', '  ingresos - egresos;'],
        ['rgba(243,240,229,.45)', '// mes a mes'],
        ['#C8EC88', 'render(dashboard)'],
      ];
      lines.forEach(([c, t], i) => { ctx.fillStyle = c; ctx.fillText(t, 44, 110 + i * 62); });
    } else {
      ctx.fillStyle = 'rgba(243,240,229,0.8)';
      roundRect(ctx, 44, 84, 330, 26, 6); ctx.fill();
      ctx.fillStyle = 'rgba(243,240,229,0.25)';
      roundRect(ctx, 44, 130, 520, 14, 5); ctx.fill();
      roundRect(ctx, 44, 160, 420, 14, 5); ctx.fill();
      ctx.strokeStyle = 'rgba(243,240,229,0.35)'; ctx.lineWidth = 3;
      roundRect(ctx, 44, 210, 552, 50, 10); ctx.stroke();
      ctx.fillStyle = '#C8EC88';
      roundRect(ctx, 44, 286, 200, 54, 12); ctx.fill();
    }
  }, renderer);
}

export function createCover(gl, { variant = 'cover' } = {}) {
  const lite = gl.lite;
  const rnd = rand(variant === 'cover' ? 7 : 11);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101c27, 0.028);
  const camera = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.1, 200);

  scene.add(new THREE.AmbientLight(0xf3f0e5, 0.25));
  const key = new THREE.DirectionalLight(0xf3f0e5, 1.6);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const rimL = new THREE.PointLight(0xc8ec88, 18, 20, 1.6);
  scene.add(rimL);

  const root = new THREE.Group();
  scene.add(root);

  // ------------------------------------------------------------ IDEA
  const idea = new THREE.Group();
  root.add(idea);
  const R = 1.55;
  const N = lite ? 3600 : 9000;
  const ideaMat = pointsMaterial({ size: 0.064 });
  const ideaPts = makePoints(N, ideaMat);
  {
    const g = ideaPts.geometry;
    const pos = g.attributes.position.array, sz = g.attributes.aSize.array, ph = g.attributes.aPhase.array, col = g.attributes.aColor.array, al = g.attributes.aAlpha.array;
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const inner = i % 5 === 0;
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = ga * i;
      let x = Math.cos(th) * r, z = Math.sin(th) * r;
      // pliegues tipo corteza: dos hemisferios con surcos
      const fold = 0.06 * Math.sin(9 * Math.atan2(z, x) + 4 * y) * Math.cos(7 * y) + 0.04 * Math.sin(13 * y + 3 * x);
      const groove = 1 - 0.1 * Math.exp(-Math.pow(x * 7, 2));
      let rr = R * (1 + fold) * groove;
      if (inner) rr *= 0.25 + rnd() * 0.65;
      pos[i * 3] = x * rr * 1.08;
      pos[i * 3 + 1] = y * rr * 0.86;
      pos[i * 3 + 2] = z * rr * 0.96;
      sz[i] = inner ? 0.6 + rnd() * 0.7 : 0.7 + rnd() * 0.9;
      ph[i] = rnd() * 6.28;
      const lime = rnd() < (inner ? 0.45 : 0.16);
      const c = lime ? COL.lime : COL.ivory;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      al[i] = inner ? 0.5 : 0.85;
    }
  }
  idea.add(ideaPts);
  // sinapsis
  {
    const pos = ideaPts.geometry.attributes.position.array;
    const pairs = [];
    const M = lite ? 260 : 620;
    for (let tries = 0; pairs.length < M * 6 && tries < M * 40; tries++) {
      const a = Math.floor(rnd() * N), b = Math.floor(rnd() * N);
      const dx = pos[a * 3] - pos[b * 3], dy = pos[a * 3 + 1] - pos[b * 3 + 1], dz = pos[a * 3 + 2] - pos[b * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < 0.25 || d > 1.0) continue;
      pairs.push(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]);
    }
    idea.add(makeLines(pairs, { color: COL.ivory, opacity: 0.09, width: 0.8 }));
  }
  const ideaCore = glowSprite(COL.lime, 3.6, 0.42);
  idea.add(ideaCore);
  const ideaHalo = glowSprite(COL.ivory, 6.5, 0.08);
  idea.add(ideaHalo);

  // ------------------------------------------------------------ SOFTWARE
  const soft = new THREE.Group();
  root.add(soft);
  const plateW = 3.6, plateD = 2.5, gap = 1.25;
  const layers = [];
  for (let L = 0; L < 3; L++) {
    const layer = new THREE.Group();
    layer.position.y = (L - 1) * gap;
    const plateGeo = new THREE.BoxGeometry(plateW, 0.06, plateD);
    const plate = new THREE.Mesh(plateGeo, glassMaterial({ color: '#16242f', rim: L === 2 ? COL.lime : COL.ivory, opacity: 0.22, rimStrength: 0.5 }));
    layer.add(plate);
    layer.add(makeEdges(plateGeo, { color: L === 2 ? COL.lime : COL.ivory, opacity: L === 2 ? 0.7 : 0.38, width: 1.3 }));
    soft.add(layer);
    layers.push(layer);
  }
  // capa de datos: cilindros
  const dbGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.18, 48);
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const m = new THREE.Mesh(dbGeo, glassMaterial({ color: '#1a2a35', rim: COL.ivory, opacity: 0.3, rimStrength: 0.6 }));
      m.position.set(-1.05 + i * 1.05, 0.14 + k * 0.22, 0.2);
      layers[0].add(m);
      const e = makeEdges(dbGeo, { color: COL.ivory, opacity: 0.32, width: 1, threshold: 30 });
      e.position.copy(m.position);
      layers[0].add(e);
    }
  }
  // capa lógica: módulos
  const modGeo = new THREE.BoxGeometry(0.62, 0.62, 0.62);
  const modules = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const lit = (i + j) % 3 === 1;
      const m = new THREE.Mesh(modGeo, glassMaterial({ color: lit ? '#22322a' : '#182632', rim: lit ? COL.lime : COL.ivory, opacity: lit ? 0.32 : 0.22, rimStrength: 0.7 }));
      m.position.set(-1.1 + i * 1.1, 0.36, -0.55 + j * 1.1);
      layers[1].add(m);
      const e = makeEdges(modGeo, { color: lit ? COL.lime : COL.ivory, opacity: lit ? 0.85 : 0.42, width: 1.2 });
      e.position.copy(m.position);
      layers[1].add(e);
      modules.push({ m, e, phase: rnd() * 6.28 });
    }
  }
  // capa de interfaz: pantallas flotantes
  const screens = [];
  ['chart', 'code', 'form'].forEach((kind, i) => {
    const tex = screenTexture(kind, gl.renderer);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.8), mat);
    plane.position.set(-1.2 + i * 1.2, 0.62, -0.1 + (i === 1 ? 0.3 : 0));
    plane.rotation.y = -0.18 + i * 0.12;
    layers[2].add(plane);
    screens.push({ plane, base: plane.position.y, phase: i * 1.7 });
  });
  // conectores verticales entre capas
  {
    const pairs = [];
    [[-1.5, -0.95], [1.5, -0.95], [-1.5, 0.95], [1.5, 0.95]].forEach(([x, z]) => {
      pairs.push(x, -gap, z, x, gap, z);
    });
    soft.add(makeLines(pairs, { color: COL.ivory, opacity: 0.16, width: 1 }));
  }
  const busCurves = [[-1.5, -0.95], [1.5, -0.95], [-1.5, 0.95], [1.5, 0.95]].map(([x, z]) => new THREE.LineCurve3(new THREE.Vector3(x, -gap, z), new THREE.Vector3(x, gap, z)));
  const bus = new Stream({ curves: busCurves, count: lite ? 24 : 48, speed: 0.22, size: 0.08, colorA: COL.ivory, colorB: COL.lime, alpha: 0.9, jitter: 0 });
  soft.add(bus.points);
  const softGlow = glowSprite(COL.lime, 6, 0.1);
  soft.add(softGlow);

  // suelo de retícula
  const grid = new THREE.GridHelper(40, 40, 0xf3f0e5, 0xf3f0e5);
  grid.material.transparent = true;
  grid.material.opacity = 0.05;
  grid.material.depthWrite = false;
  grid.position.y = -2.6;
  root.add(grid);

  // polvo
  {
    const D = lite ? 300 : 700;
    const dust = makePoints(D, pointsMaterial({ size: 0.03 }));
    const g = dust.geometry;
    for (let i = 0; i < D; i++) {
      g.attributes.position.array.set([(rnd() - 0.5) * 26, (rnd() - 0.5) * 12, (rnd() - 0.5) * 14 - 2], i * 3);
      g.attributes.aPhase.array[i] = rnd() * 6.28;
      g.attributes.aAlpha.array[i] = 0.25 + rnd() * 0.3;
    }
    root.add(dust);
    root.userData.dust = dust;
  }

  // ------------------------------------------------------------ composición
  let camBase, lookAt, stream;
  if (variant === 'cover') {
    idea.position.set(-0.45, 0.95, -1.4);
    soft.position.set(2.75, -0.6, 0.6);
    soft.scale.setScalar(0.66);
    soft.rotation.set(0.06, -0.62, 0);
    camBase = new THREE.Vector3(0.6, 1.3, 13.2);
    lookAt = new THREE.Vector3(0.6, 0.15, 0);
    camera.setViewOffset(1920, 1080, -330, 0, 1920, 1080);
  } else {
    idea.position.set(2.35, 1.75, -0.6);
    idea.scale.setScalar(0.5);
    soft.position.set(2.5, -0.95, 0.4);
    soft.scale.setScalar(0.62);
    soft.rotation.set(0.08, -0.5, 0);
    camBase = new THREE.Vector3(-0.4, 1.0, 13.6);
    lookAt = new THREE.Vector3(0.8, 0.25, 0);
    camera.setViewOffset(1920, 1080, -400, 0, 1920, 1080);
  }
  rimL.position.copy(soft.position).add(new THREE.Vector3(-1.5, 2.5, 2.5));
  root.updateMatrixWorld(true);

  // corrientes idea → capas del software
  const curves = [];
  const ideaW = idea.getWorldPosition(new THREE.Vector3());
  const targets = [];
  for (let L = 0; L < 3; L++) {
    for (let k = 0; k < 2; k++) {
      targets.push(layers[L].localToWorld(new THREE.Vector3(-1.2 + k * 0.9, 0.35, -0.2 + k * 0.4)));
    }
  }
  targets.forEach((t, i) => {
    const s = ideaW.clone().add(new THREE.Vector3(0.6 + rnd() * 0.5, (rnd() - 0.5) * 1.2 * idea.scale.y, (rnd() - 0.2) * 0.9));
    const c1 = s.clone().lerp(t, 0.33).add(new THREE.Vector3(0, variant === 'cover' ? 1.4 - i * 0.25 : 0.5, 1.0));
    const c2 = s.clone().lerp(t, 0.72).add(new THREE.Vector3(-0.4, variant === 'cover' ? 0.6 - i * 0.2 : 0.2, 0.6));
    curves.push(new THREE.CubicBezierCurve3(s, c1, c2, t));
  });
  stream = new Stream({ curves, count: lite ? 800 : 2000, speed: variant === 'cover' ? 0.11 : 0.07, size: 0.085, colorA: COL.ivory, colorB: COL.lime, shapeFrom: 0, shapeTo: 1, alpha: 0.85, jitter: 0.32 });
  scene.add(stream.points);

  camera.position.copy(camBase);
  camera.lookAt(lookAt);

  const tmp = new THREE.Vector3();
  const anchorIdea = new THREE.Vector3();
  const anchorSoft = new THREE.Vector3();

  function update(t, dt) {
    ideaMat.uniforms.uTime.value = t;
    stream.mat.uniforms.uTime.value = t;
    bus.mat.uniforms.uTime.value = t;
    root.userData.dust.material.uniforms.uTime.value = t;
    idea.rotation.y = t * 0.09;
    idea.rotation.x = Math.sin(t * 0.21) * 0.08;
    ideaCore.material.opacity = 0.34 + Math.sin(t * 1.3) * 0.08;
    stream.update(dt);
    bus.update(dt);
    modules.forEach(({ m, e, phase }) => {
      const k = 0.5 + 0.5 * Math.sin(t * 1.2 + phase);
      m.material.uniforms.uRimStrength.value = 0.55 + k * 0.35;
    });
    screens.forEach(({ plane, base, phase }) => { plane.position.y = base + Math.sin(t * 0.9 + phase) * 0.05; });
    soft.rotation.y = (variant === 'cover' ? -0.62 : -0.5) + Math.sin(t * 0.17) * 0.06;
    camera.position.set(camBase.x + Math.sin(t * 0.11) * 0.35, camBase.y + Math.sin(t * 0.07) * 0.18, camBase.z);
    camera.lookAt(lookAt);
  }

  function anchors() {
    anchorIdea.copy(idea.position).add(tmp.set(-0.2, 1.75 * idea.scale.y, 0));
    layers[2].localToWorld(anchorSoft.set(-1.75, 1.35, -1.1));
    return { idea: anchorIdea, software: anchorSoft };
  }

  return { scene, camera, update, anchors };
}
