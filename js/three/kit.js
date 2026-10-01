/**
 * DULCERA · kit 3D compartido.
 * Fábricas de packaging y dulces estilizados (no fotorealistas) construidas con primitivas.
 * Lo usan la escena del hero (js/hero-scene.js) y el estudio de placeholders (tools/placeholder-studio.html).
 * Colores: brand/design-tokens.css · Catálogo: brand/BRAND_GUIDE.md §9.
 */
import * as THREE from '../../vendor/three/three.bundle.min.js';

export { THREE };

export const PALETTE = {
  piloncillo: '#2A1A14',
  nata: '#F5EDE1',
  jamaica: '#C8274A',
  mango: '#E39A2D',
  pitaya: '#F2B8C6',
  cacao: '#5B3A2C',
  arcilla: '#E4D5C3',
  azucar: '#FFFBF5',
};

export const LINE_COLORS = {
  classic: PALETTE.mango,
  fruit: PALETTE.jamaica,
  cacao: PALETTE.cacao,
  eventos: PALETTE.pitaya,
  corporativo: PALETTE.piloncillo,
};

const geoCache = new Map();
function roundedBox(w, h, d, r, seg = 4) {
  const key = [w, h, d, r, seg].join('|');
  if (!geoCache.has(key)) geoCache.set(key, new THREE.RoundedBoxGeometry(w, h, d, seg, r));
  return geoCache.get(key);
}

/* ------------------------------------------------------------ texturas */

/** Textura de motas (chile, sal, tostado) generada en canvas. */
export function speckleTexture(base, specks, { density = 900, size = [0.6, 2.2], seed = 7, res = 256 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = res;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, res, res);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < density; i++) {
    g.fillStyle = specks[i % specks.length];
    g.globalAlpha = 0.55 + rnd() * 0.45;
    const r = size[0] + rnd() * (size[1] - size[0]);
    g.beginPath();
    g.arc(rnd() * res, rnd() * res, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Carga un SVG oficial de /brand como textura (vector rasterizado al vuelo, en alta resolución). */
export function svgTexture(url, { width = 1024, height = 1024, background = null, padding = 0, tint = null } = {}) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const img = new Image();
  img.decoding = 'async';
  tex.ready = new Promise((resolve) => {
    img.onload = () => {
      const g = c.getContext('2d');
      if (background) {
        g.fillStyle = background;
        g.fillRect(0, 0, width, height);
      }
      const iw = img.naturalWidth || width;
      const ih = img.naturalHeight || height;
      const k = Math.min((width - padding * 2) / iw, (height - padding * 2) / ih);
      g.drawImage(img, (width - iw * k) / 2, (height - ih * k) / 2, iw * k, ih * k);
      if (tint) {
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = tint;
        g.fillRect(0, 0, width, height);
        g.globalCompositeOperation = 'source-over';
      }
      tex.needsUpdate = true;
      resolve(tex);
    };
    img.onerror = () => resolve(tex);
  });
  img.src = url;
  return tex;
}

/** Texto en Fraunces sobre color sólido (interior de tapa: slogan). */
export function textTexture(lines, { width = 1024, height = 1024, bg = PALETTE.jamaica, fg = PALETTE.nata, font = 'italic 500 120px Fraunces, Georgia, serif', lineHeight = 1.05 } = {}) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const draw = () => {
    const g = c.getContext('2d');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, height);
    g.fillStyle = fg;
    g.font = font;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const px = parseFloat(font.match(/(\d+)px/)[1]);
    const total = lines.length * px * lineHeight;
    lines.forEach((l, i) => g.fillText(l, width / 2, height / 2 - total / 2 + px * lineHeight * (i + 0.5)));
    tex.needsUpdate = true;
  };
  draw();
  tex.ready = (document.fonts ? document.fonts.load(font).catch(() => {}) : Promise.resolve()).then(() => {
    draw();
    return tex;
  });
  return tex;
}

/** Sombra de contacto suave (plano con degradado radial), más barata y bonita que un shadow map. */
export function contactShadow(size = 4, opacity = 0.32, color = PALETTE.piloncillo) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,1)');
  grd.addColorStop(0.45, 'rgba(0,0,0,.45)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity, depthWrite: false });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = -1;
  return m;
}

/* ------------------------------------------------------------ materiales */

export function paper(color, rough = 0.8) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
}

function glossy(color, { rough = 0.3, clearcoat = 0.6, map = null, sheen = 0 } = {}) {
  return new THREE.MeshPhysicalMaterial({
    color, map, roughness: rough, metalness: 0, clearcoat, clearcoatRoughness: 0.25,
    sheen, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.6,
  });
}

/* ------------------------------------------------------------ dulces (unidad ≈ 1) */

export function lecheQuemada() {
  const map = speckleTexture('#C98B45', ['#F6EEDF', '#FFFFFF'], { density: 120, size: [0.5, 1.4], seed: 11 });
  const m = new THREE.Mesh(roundedBox(1, 0.88, 1, 0.14), glossy('#ffffff', { rough: 0.34, clearcoat: 0.55, map }));
  m.name = 'leche-quemada';
  return m;
}

export function cocada() {
  const map = speckleTexture('#EAD7B6', ['#C99358', '#B37A42', '#F7EBD4'], { density: 1600, size: [0.5, 1.8], seed: 5 });
  const m = new THREE.Mesh(roundedBox(1.2, 0.7, 0.9, 0.12), paper('#ffffff', 0.9));
  m.material.map = map;
  m.name = 'cocada';
  return m;
}

export function jamaica({ transmission = 0.3 } = {}) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.jamaica, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
    transmission, thickness: 0.9, ior: 1.46, attenuationColor: new THREE.Color('#6E0B22'), attenuationDistance: 0.7,
    emissive: new THREE.Color('#3A0414'), emissiveIntensity: 0.35,
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 32), mat);
  m.scale.set(1, 0.8, 1);
  m.name = 'jamaica-cristal';
  return m;
}

export function mangoChile() {
  const map = speckleTexture('#E9A23B', ['#B3271E', '#7E1A12', '#F4D9B0'], { density: 2200, size: [0.4, 1.3], seed: 3 });
  const m = new THREE.Mesh(roundedBox(0.9, 0.9, 0.9, 0.24), glossy('#ffffff', { rough: 0.6, clearcoat: 0.15, map, sheen: 0.6 }));
  m.name = 'mango-chile';
  return m;
}

export function tamarindo() {
  const map = speckleTexture('#7B4526', ['#FFFFFF', '#F2E6D6'], { density: 160, size: [0.6, 2.4], seed: 19 });
  const m = new THREE.Mesh(roundedBox(1, 0.52, 1, 0.08), glossy('#ffffff', { rough: 0.48, clearcoat: 0.3, map }));
  m.name = 'tamarindo-sal';
  return m;
}

export function bombon() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(roundedBox(1, 0.74, 1, 0.22), paper('#F7F0E6', 0.96));
  top.position.y = 0.12;
  const base = new THREE.Mesh(roundedBox(1.04, 0.26, 1.04, 0.08), glossy('#4B2A1D', { rough: 0.38, clearcoat: 0.5 }));
  base.position.y = -0.36;
  g.add(top, base);
  g.name = 'bombon-cacao-vainilla';
  return g;
}

export function tableta() {
  const g = new THREE.Group();
  const cacao = glossy('#4A291C', { rough: 0.32, clearcoat: 0.5 });
  const cajeta = glossy('#C8862F', { rough: 0.18, clearcoat: 0.9 });
  [[cacao, -0.17], [cajeta, 0], [cacao, 0.17]].forEach(([mat, y], i) => {
    const s = new THREE.Mesh(roundedBox(1.5, i === 1 ? 0.12 : 0.16, 0.9, 0.05), mat);
    s.position.y = y;
    g.add(s);
  });
  g.name = 'tableta-capa-cajeta';
  return g;
}

/** Recuerdo DULCERA: cajita deslizable con ventana de sticker. */
export function favorBox(color = PALETTE.pitaya) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(roundedBox(1.1, 0.62, 0.7, 0.06), paper(color, 0.78));
  const band = new THREE.Mesh(roundedBox(0.36, 0.64, 0.72, 0.03), paper(PALETTE.nata, 0.8));
  const sticker = new THREE.Mesh(new THREE.CircleGeometry(0.13, 40), paper(PALETTE.jamaica, 0.6));
  sticker.position.set(0, 0, 0.362);
  g.add(body, band, sticker);
  g.userData.body = body;
  g.name = 'recuerdo-dulcera';
  return g;
}

export const CANDY = { lecheQuemada, cocada, jamaica, mangoChile, tamarindo, bombon, tableta };

/** Mapa de capas de la Caja Capas · Degustación (BRAND_GUIDE §13.1). */
export const TRAY_MAP = {
  classic: [lecheQuemada, cocada, lecheQuemada],
  fruit: [jamaica, mangoChile, tamarindo],
  cacao: [bombon, tableta, bombon],
};

/** Charola de 3 piezas en el color de su línea. */
export function tray(line, { width = 2.72, depth = 2.72, piece = 0.5, options = {} } = {}) {
  const g = new THREE.Group();
  const slab = new THREE.Mesh(roundedBox(width, 0.08, depth, 0.03), paper(LINE_COLORS[line], 0.7));
  g.add(slab);
  const pieces = [];
  TRAY_MAP[line].forEach((make, i) => {
    const c = make(options);
    c.scale.multiplyScalar(piece);
    if (c.name === 'tableta-capa-cajeta') c.scale.multiplyScalar(0.8);
    c.position.set((i - 1) * width * 0.31, 0.04 + piece * 0.42, 0);
    c.rotation.y = (i - 1) * 0.08;
    g.add(c);
    pieces.push(c);
  });
  g.userData = { line, slab, pieces };
  return g;
}

/**
 * Caja rígida con tapa (Caja Capas). Tapa con bisagra trasera: lidPivot.rotation.x < 0 abre.
 * Decals: símbolo en la tapa, wordmark en el canto frontal, slogan en el interior, sello en el frente.
 */
export function giftBox({ W = 3, D = 3, H = 1.2, lidH = 0.4, overlap = 0.3, color = PALETTE.nata, interior = PALETTE.jamaica, brandBase = 'brand/' } = {}) {
  const t = 0.06;
  const group = new THREE.Group();
  const shell = new THREE.Group();
  group.add(shell);

  const outer = paper(color, 0.82);
  const inner = paper(interior, 0.72);
  const base = new THREE.Group();
  const bottom = new THREE.Mesh(roundedBox(W, t, D, 0.02), outer);
  bottom.position.y = t / 2;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W - t * 2, D - t * 2), inner);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = t + 0.002;
  base.add(bottom, floor);
  const walls = [
    [W, H, t, 0, H / 2, D / 2 - t / 2],
    [W, H, t, 0, H / 2, -D / 2 + t / 2],
    [t, H, D - t * 2, W / 2 - t / 2, H / 2, 0],
    [t, H, D - t * 2, -W / 2 + t / 2, H / 2, 0],
  ];
  walls.forEach(([w, h, d, x, y, z]) => {
    const m = new THREE.Mesh(roundedBox(w, h, d, 0.02, 2), outer);
    m.position.set(x, y, z);
    base.add(m);
  });
  shell.add(base);

  // Tapa con bisagra en el borde superior trasero
  const lidPivot = new THREE.Group();
  const LW = W + 0.08, LD = D + 0.08;
  lidPivot.position.set(0, H - overlap + lidH, -LD / 2);
  const lid = new THREE.Group();
  lid.position.set(0, -lidH / 2, LD / 2);
  const lidMesh = new THREE.Mesh(roundedBox(LW, lidH, LD, 0.03), outer);
  lid.add(lidMesh);
  lidPivot.add(lid);
  shell.add(lidPivot);

  const markTex = svgTexture(`${brandBase}logo-mark.svg`, { width: 512, height: 512 });
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.15), new THREE.MeshStandardMaterial({ map: markTex, transparent: true, roughness: 0.6 }));
  mark.rotation.x = -Math.PI / 2;
  mark.position.y = lidH / 2 + 0.003;
  lid.add(mark);

  const wmTex = svgTexture(`${brandBase}concepts/concept-a-wordmark.svg`, { width: 1024, height: 200 });
  const wordmark = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.29), new THREE.MeshStandardMaterial({ map: wmTex, transparent: true, roughness: 0.7 }));
  wordmark.position.set(0, (H - overlap) * 0.46, D / 2 + 0.003);
  shell.add(wordmark);

  const sloganTex = textTexture(['México,', 'en capas.']);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(LW - 0.14, LD - 0.14), new THREE.MeshStandardMaterial({ map: sloganTex, roughness: 0.75 }));
  under.rotation.x = Math.PI / 2;
  under.position.y = -lidH / 2 - 0.004;
  lid.add(under);

  const sealTex = svgTexture(`${brandBase}concepts/concept-c-monograma.svg`, { width: 512, height: 512 });
  const seal = new THREE.Mesh(new THREE.CircleGeometry(0.24, 48), new THREE.MeshStandardMaterial({ map: sealTex, transparent: true, roughness: 0.5 }));
  seal.position.set(0, H - overlap, D / 2 + 0.045);
  shell.add(seal);

  group.userData = {
    shell, base, lidPivot, lid, seal, outer, inner, mark, wordmark, under,
    dims: { W, D, H, lidH, overlap },
    ready: Promise.all([markTex.ready, wmTex.ready, sloganTex.ready, sealTex.ready]),
  };
  return group;
}

/** Luces y entorno comunes: clave cálida lateral + relleno, estilo "ventana de tarde" (BRAND_GUIDE §11). */
export function setupLighting(renderer, scene, { intensity = 1 } = {}) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.42 * intensity;
  const key = new THREE.DirectionalLight('#FFE7C7', 1.75 * intensity);
  key.position.set(-6, 7, 4);
  const rim = new THREE.DirectionalLight('#FFD7C2', 0.7 * intensity);
  rim.position.set(5, 3, -5);
  const fill = new THREE.HemisphereLight('#FFF6EA', '#B8957C', 0.45 * intensity);
  scene.add(key, rim, fill);
  return { key, rim, fill, pmrem };
}

export function makeRenderer(canvas, { alpha = true, dprMax = 1.75, preserveDrawingBuffer = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, powerPreference: 'high-performance', preserveDrawingBuffer });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  return renderer;
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
