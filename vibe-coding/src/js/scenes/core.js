// Motor WebGL compartido: un solo renderer, una escena activa a la vez y
// etiquetas HTML proyectadas desde posiciones 3D.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export const COL = {
  ink: new THREE.Color('#101C27'),
  graphite: new THREE.Color('#222522'),
  lime: new THREE.Color('#C8EC88'),
  ivory: new THREE.Color('#F3F0E5'),
  g400: new THREE.Color('#858C92'),
  g600: new THREE.Color('#3A434B'),
};

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ------------------------------------------------------------------ materiales
export function glassMaterial({ color = '#1b2a36', rim = COL.ivory, opacity = 0.16, rimStrength = 0.75, rimPower = 2.4 } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uRim: { value: rim.clone ? rim.clone() : new THREE.Color(rim) },
      uOpacity: { value: opacity },
      uRimStrength: { value: rimStrength },
      uRimPower: { value: rimPower },
      uFade: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        vec4 wp = modelMatrix * vec4(position,1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        vP = position;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform vec3 uRim; uniform float uOpacity; uniform float uRimStrength; uniform float uRimPower; uniform float uFade;
      varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main(){
        vec3 n = normalize(vN);
        if (!gl_FrontFacing) n = -n;
        float f = pow(1.0 - clamp(abs(dot(n, normalize(vV))), 0.0, 1.0), uRimPower);
        float sheen = 0.5 + 0.5 * n.y;
        vec3 col = mix(uColor * (0.8 + 0.4 * sheen), uRim, f * uRimStrength);
        float a = (uOpacity + f * uRimStrength * 0.55) * uFade;
        gl_FragColor = vec4(col, a);
      }`,
  });
}

export function makeEdges(geometry, { color = COL.ivory, opacity = 0.5, width = 1.4, threshold = 20 } = {}) {
  const edges = new THREE.EdgesGeometry(geometry, threshold);
  const geo = new LineSegmentsGeometry().fromEdgesGeometry(edges);
  const mat = new LineMaterial({ color: new THREE.Color(color), linewidth: width, transparent: true, opacity, depthWrite: false, worldUnits: false });
  mat.userData.baseWidth = width;
  mat.userData.baseOpacity = opacity;
  const line = new LineSegments2(geo, mat);
  line.userData.isFatLine = true;
  return line;
}

export function makeLines(pairs, { color = COL.ivory, opacity = 0.3, width = 1 } = {}) {
  const geo = new LineSegmentsGeometry().setPositions(pairs);
  const mat = new LineMaterial({ color: new THREE.Color(color), linewidth: width, transparent: true, opacity, depthWrite: false, worldUnits: false });
  mat.userData.baseWidth = width;
  mat.userData.baseOpacity = opacity;
  const line = new LineSegments2(geo, mat);
  line.userData.isFatLine = true;
  return line;
}

// Puntos suaves con tamaño, color, fase y «morfología» (círculo → cuadrado) por vértice.
export function pointsMaterial({ size = 1, additive = true } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uSize: { value: size }, uFade: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSize; attribute float aPhase; attribute vec3 aColor; attribute float aAlpha; attribute float aShape;
      uniform float uTime; uniform float uPR; uniform float uSize;
      varying vec3 vColor; varying float vAlpha; varying float vShape;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        float tw = 0.72 + 0.28 * sin(uTime * 1.6 + aPhase);
        gl_PointSize = aSize * uSize * uPR * tw * (300.0 / -mv.z);
        vColor = aColor; vAlpha = aAlpha * (0.55 + 0.45 * tw); vShape = aShape;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFade;
      varying vec3 vColor; varying float vAlpha; varying float vShape;
      void main(){
        vec2 p = gl_PointCoord - 0.5;
        float circ = smoothstep(0.5, 0.08, length(p));
        float sq = smoothstep(0.5, 0.36, max(abs(p.x), abs(p.y)));
        float a = mix(circ, sq, vShape) * vAlpha * uFade;
        if (a < 0.003) discard;
        gl_FragColor = vec4(vColor, a);
      }`,
  });
}

export function makePoints(count, material) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(count).fill(1), 1));
  g.setAttribute('aPhase', new THREE.BufferAttribute(new Float32Array(count), 1));
  g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3));
  g.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(count).fill(1), 1));
  g.setAttribute('aShape', new THREE.BufferAttribute(new Float32Array(count), 1));
  const pts = new THREE.Points(g, material);
  pts.frustumCulled = false;
  return pts;
}

// Halo aditivo (sprite con degradado radial).
let glowTex = null;
export function glowSprite(color = COL.lime, scale = 1, opacity = 0.6) {
  if (!glowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.18, 'rgba(255,255,255,.55)');
    grd.addColorStop(0.45, 'rgba(255,255,255,.12)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    glowTex = new THREE.CanvasTexture(c);
    glowTex.colorSpace = THREE.SRGBColorSpace;
  }
  const m = new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(color), transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
  m.userData.baseOpacity = opacity;
  const s = new THREE.Sprite(m);
  s.scale.setScalar(scale);
  return s;
}

// Textura a partir de un lienzo 2D (texto nítido en paneles 3D).
export function canvasTexture(w, h, draw, renderer) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer ? renderer.capabilities.getMaxAnisotropy() : 8;
  tex.userData.redraw = (fn = draw) => {
    ctx.clearRect(0, 0, w, h);
    fn(ctx, w, h);
    tex.needsUpdate = true;
  };
  return tex;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Partículas que viajan por curvas (flujos de datos / código).
export class Stream {
  constructor({ curves, count, speed = 0.12, size = 1, colorA = COL.ivory, colorB = COL.lime, shapeFrom = 0, shapeTo = 0, alpha = 0.9, jitter = 0.05 }) {
    this.curves = curves;
    this.count = count;
    this.speed = speed;
    this.jitter = jitter;
    this.mat = pointsMaterial({ size });
    this.points = makePoints(count, this.mat);
    const g = this.points.geometry;
    this.u = new Float32Array(count);
    this.ci = new Uint16Array(count);
    this.off = new Float32Array(count * 3);
    this.spd = new Float32Array(count);
    this.colorA = colorA;
    this.colorB = colorB;
    this.shapeFrom = shapeFrom;
    this.shapeTo = shapeTo;
    this.alpha = alpha;
    const ph = g.attributes.aPhase.array, sz = g.attributes.aSize.array;
    for (let i = 0; i < count; i++) {
      this.u[i] = Math.random();
      this.ci[i] = i % curves.length;
      this.spd[i] = speed * (0.7 + Math.random() * 0.6);
      this.off[i * 3] = (Math.random() - 0.5) * jitter;
      this.off[i * 3 + 1] = (Math.random() - 0.5) * jitter;
      this.off[i * 3 + 2] = (Math.random() - 0.5) * jitter;
      ph[i] = Math.random() * 6.28;
      sz[i] = 0.55 + Math.random() * 0.9;
    }
    this._v = new THREE.Vector3();
    this.update(0);
  }
  update(dt) {
    const g = this.points.geometry;
    const pos = g.attributes.position.array, col = g.attributes.aColor.array, al = g.attributes.aAlpha.array, sh = g.attributes.aShape.array;
    const a = this.colorA, b = this.colorB;
    for (let i = 0; i < this.count; i++) {
      let u = this.u[i] + this.spd[i] * dt;
      if (u > 1) u -= 1;
      this.u[i] = u;
      this.curves[this.ci[i]].getPoint(u, this._v);
      const spread = Math.sin(u * Math.PI);
      pos[i * 3] = this._v.x + this.off[i * 3] * spread;
      pos[i * 3 + 1] = this._v.y + this.off[i * 3 + 1] * spread;
      pos[i * 3 + 2] = this._v.z + this.off[i * 3 + 2] * spread;
      const k = THREE.MathUtils.smoothstep(u, 0.25, 0.8);
      col[i * 3] = a.r + (b.r - a.r) * k;
      col[i * 3 + 1] = a.g + (b.g - a.g) * k;
      col[i * 3 + 2] = a.b + (b.b - a.b) * k;
      al[i] = this.alpha * Math.min(1, u * 8) * Math.min(1, (1 - u) * 8);
      sh[i] = this.shapeFrom + (this.shapeTo - this.shapeFrom) * k;
    }
    g.attributes.position.needsUpdate = true;
    g.attributes.aColor.needsUpdate = true;
    g.attributes.aAlpha.needsUpdate = true;
    g.attributes.aShape.needsUpdate = true;
  }
}

// Paquetes individuales (esferas con halo) que recorren una curva una vez.
export class Packet {
  constructor(color = COL.lime, size = 0.12, glow = 0.9) {
    this.group = new THREE.Group();
    this.core = new THREE.Mesh(new THREE.SphereGeometry(size, 20, 14), new THREE.MeshBasicMaterial({ color, transparent: true }));
    this.halo = glowSprite(color, size * 9, glow);
    this.group.add(this.core, this.halo);
    this.group.visible = false;
    this.curve = null;
    this.t = 0;
    this.dur = 1;
    this.onDone = null;
  }
  launch(curve, dur, onDone) {
    this.curve = curve;
    this.t = 0;
    this.dur = dur;
    this.onDone = onDone || null;
    this.group.visible = true;
  }
  update(dt) {
    if (!this.curve) return;
    this.t += dt / this.dur;
    const u = Math.min(1, this.t);
    const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    this.curve.getPoint(e, this.group.position);
    const fade = Math.min(1, u * 6, (1 - u) * 6 + 0.15);
    this.core.material.opacity = fade;
    this.halo.material.opacity = this.halo.material.userData.baseOpacity * fade;
    if (u >= 1) {
      this.curve = null;
      this.group.visible = false;
      const cb = this.onDone;
      this.onDone = null;
      if (cb) cb();
    }
  }
}

// ------------------------------------------------------------------ manager
export class GLManager {
  constructor(canvas, { exportMode = false, lite = false } = {}) {
    this.canvas = canvas;
    this.exportMode = exportMode;
    this.lite = lite;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: exportMode });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.factories = {};
    this.instances = {};
    this.active = null;
    this.activeId = null;
    this.slideEl = null;
    this.anchorsEls = [];
    this.pixelRatio = 1;
    this.time = 0;
    this.last = performance.now();
    this.running = false;
    this.resolution = new THREE.Vector2(STAGE_W, STAGE_H);
    this._v = new THREE.Vector3();
  }

  register(id, factory) {
    this.factories[id] = factory;
  }

  get(id) {
    if (!this.instances[id] && this.factories[id]) {
      const inst = this.factories[id](this);
      inst.scene.environment = this.envMap;
      this.instances[id] = inst;
      this.applyResolution(inst);
      this.renderer.compile(inst.scene, inst.camera);
    }
    return this.instances[id];
  }

  // Precarga (compila shaders) para que la transición no tenga tirones.
  warm(id) {
    if (id && this.factories[id] && !this.instances[id]) this.get(id);
  }

  setPixelRatio(pr) {
    this.pixelRatio = pr;
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(STAGE_W, STAGE_H, false);
    this.resolution.set(STAGE_W * pr, STAGE_H * pr);
    Object.values(this.instances).forEach((inst) => this.applyResolution(inst));
  }

  applyResolution(inst) {
    inst.scene.traverse((o) => {
      if (o.userData.isFatLine) {
        o.material.resolution.copy(this.resolution);
        o.material.linewidth = o.material.userData.baseWidth * this.pixelRatio;
      }
      if (o.material && o.material.uniforms && o.material.uniforms.uPR) o.material.uniforms.uPR.value = this.pixelRatio;
    });
  }

  show(id, slideEl, step) {
    this.slideEl = slideEl;
    this.anchorsEls = slideEl ? [...slideEl.querySelectorAll('[data-anchor]')] : [];
    if (!id) {
      this.canvas.classList.remove('on');
      this.activeId = null;
      clearTimeout(this._swap);
      if (!this.exportMode) this._swap = setTimeout(() => { if (!this.activeId) this.active = null; }, 650);
      else this.active = null;
      return;
    }
    const inst = this.get(id);
    if (!inst) return;
    const changed = this.activeId !== id;
    this.activeId = id;
    if (changed) {
      clearTimeout(this._swap);
      const swap = () => {
        this.active = inst;
        inst.enter && inst.enter(step);
        this.canvas.classList.add('on');
      };
      if (this.canvas.classList.contains('on') && !this.exportMode) {
        this.canvas.classList.remove('on');
        this._swap = setTimeout(swap, 380);
      } else swap();
    }
    inst.setStep && inst.setStep(step, this.exportMode);
  }

  setStep(step) {
    if (this.active && this.active.setStep) this.active.setStep(step, this.exportMode);
  }

  projectAnchors() {
    const inst = this.active;
    if (!inst || !inst.anchors) return;
    const anchors = inst.anchors();
    for (const el of this.anchorsEls) {
      const p = anchors[el.dataset.anchor];
      if (!p) continue;
      this._v.copy(p).project(inst.camera);
      const x = (this._v.x * 0.5 + 0.5) * STAGE_W;
      const y = (-this._v.y * 0.5 + 0.5) * STAGE_H;
      el.style.setProperty('--x', x.toFixed(1));
      el.style.setProperty('--y', y.toFixed(1));
      el.classList.add('placed');
      const dim = inst.isDimmed ? inst.isDimmed(el.dataset.anchor) : false;
      el.classList.toggle('dim', !!dim);
    }
  }

  frame(dt) {
    const inst = this.active;
    if (!inst) return;
    this.time += dt;
    inst.update(this.time, dt);
    this.renderer.render(inst.scene, inst.camera);
    this.projectAnchors();
  }

  start() {
    if (this.running) return;
    this.running = true;
    const tick = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      if (!document.hidden) this.frame(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Exportación: estado final determinista.
  renderStill(seconds = 8) {
    const inst = this.active;
    if (!inst) return;
    this.time = 0;
    const steps = Math.round(seconds * 30);
    for (let i = 0; i < steps; i++) {
      this.time += 1 / 30;
      inst.update(this.time, 1 / 30);
    }
    this.renderer.render(inst.scene, inst.camera);
    this.projectAnchors();
  }
}

export { THREE };
