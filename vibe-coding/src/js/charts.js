// Gráficos SVG generados a partir de los datos del caso (una sola fuente de cifras).
import { COMPANY, MONTHS, INGRESOS, EGRESOS, FLUJO, TOTALS, money, fmt } from '../content/data.js';
import { SOURCES } from '../content/sources.js';

const C = { ink: '#101C27', lime: '#C8EC88', ivory: '#F3F0E5', g300: '#A9AEB1', g400: '#858C92', g500: '#5C646B', g600: '#3A434B' };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function dashboard() {
  const W = 980, H = 540, P = 30;
  const kW = (W - P * 2 - 32) / 3;
  const kpis = [
    { label: 'Ingresos', value: money(TOTALS.ingresos), color: C.ivory },
    { label: 'Egresos', value: money(TOTALS.egresos), color: C.ivory },
    { label: 'Flujo neto', value: money(TOTALS.flujo), color: C.lime, hl: true },
  ];
  const cardY = 92, cardH = 108;
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Dashboard de referencia">`;
  s += `<defs><linearGradient id="dashCard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ivory}" stop-opacity=".07"/><stop offset="1" stop-color="${C.ivory}" stop-opacity=".02"/></linearGradient>
  <linearGradient id="flowArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lime}" stop-opacity=".22"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></linearGradient></defs>`;
  s += `<text x="${P}" y="46" font-family="Inter Tight" font-weight="600" font-size="24" fill="${C.ivory}">${COMPANY}</text>`;
  s += `<text x="${P}" y="72" font-family="JetBrains Mono" font-size="13" fill="${C.g400}" letter-spacing="1.2">FLUJO DE EFECTIVO · ENE–JUN 2026 · MXN</text>`;
  s += `<circle cx="${W - P - 200}" cy="41" r="5" fill="${C.lime}"/><text x="${W - P}" y="46" text-anchor="end" font-family="JetBrains Mono" font-size="13" fill="${C.g300}">Última lectura 10:42:05</text>`;
  s += `<text x="${W - P}" y="70" text-anchor="end" font-family="JetBrains Mono" font-size="12" fill="${C.g400}">fuente: movimientos.xlsx</text>`;
  kpis.forEach((k, i) => {
    const x = P + i * (kW + 16);
    s += `<rect x="${x}" y="${cardY}" width="${kW}" height="${cardH}" rx="14" fill="url(#dashCard)" stroke="${k.hl ? C.lime : C.ivory}" stroke-opacity="${k.hl ? 0.55 : 0.14}"/>`;
    s += `<text x="${x + 20}" y="${cardY + 32}" font-family="JetBrains Mono" font-size="12.5" letter-spacing="1.6" fill="${C.g300}">${k.label.toUpperCase()}</text>`;
    s += `<text x="${x + 20}" y="${cardY + 80}" font-family="Inter Tight" font-weight="600" font-size="38" letter-spacing="-0.6" fill="${k.color}">${k.value}</text>`;
  });
  // gráfica
  const gx = P + 64, gy = 248, gw = W - P - gx, gh = 230, max = 600000;
  const y = (v) => gy + gh - (v / max) * gh;
  for (let t = 0; t <= max; t += 200000) {
    s += `<line x1="${gx}" x2="${gx + gw}" y1="${y(t)}" y2="${y(t)}" stroke="${C.ivory}" stroke-opacity="${t ? 0.08 : 0.2}"/>`;
    s += `<text x="${gx - 12}" y="${y(t) + 4}" text-anchor="end" font-family="JetBrains Mono" font-size="12" fill="${C.g400}">${t ? fmt(t / 1000) + 'k' : '0'}</text>`;
  }
  const slot = gw / MONTHS.length, bw = 30;
  const pts = [];
  MONTHS.forEach((m, i) => {
    const cx = gx + slot * i + slot / 2;
    s += `<rect x="${cx - bw - 3}" y="${y(INGRESOS[i])}" width="${bw}" height="${gh - (y(INGRESOS[i]) - gy)}" rx="4" fill="${C.ivory}" fill-opacity=".86"/>`;
    s += `<rect x="${cx + 3}" y="${y(EGRESOS[i])}" width="${bw}" height="${gh - (y(EGRESOS[i]) - gy)}" rx="4" fill="${C.g500}"/>`;
    s += `<text x="${cx}" y="${gy + gh + 26}" text-anchor="middle" font-family="JetBrains Mono" font-size="13" fill="${C.g300}">${m}</text>`;
    pts.push([cx, y(FLUJO[i])]);
  });
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  s += `<path d="${line} L${pts[pts.length - 1][0]} ${gy + gh} L${pts[0][0]} ${gy + gh} Z" fill="url(#flowArea)"/>`;
  s += `<path d="${line}" fill="none" stroke="${C.lime}" stroke-width="3" stroke-linejoin="round"/>`;
  pts.forEach((p) => (s += `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="${C.ink}" stroke="${C.lime}" stroke-width="2.5"/>`));
  // leyenda
  const lx = gx + gw - 360, ly = gy - 22;
  s += `<rect x="${lx}" y="${ly - 10}" width="12" height="12" rx="2" fill="${C.ivory}" fill-opacity=".86"/><text x="${lx + 20}" y="${ly + 1}" font-family="JetBrains Mono" font-size="12.5" fill="${C.g300}">Ingresos</text>`;
  s += `<rect x="${lx + 112}" y="${ly - 10}" width="12" height="12" rx="2" fill="${C.g500}"/><text x="${lx + 132}" y="${ly + 1}" font-family="JetBrains Mono" font-size="12.5" fill="${C.g300}">Egresos</text>`;
  s += `<line x1="${lx + 222}" x2="${lx + 246}" y1="${ly - 4}" y2="${ly - 4}" stroke="${C.lime}" stroke-width="3"/><text x="${lx + 254}" y="${ly + 1}" font-family="JetBrains Mono" font-size="12.5" fill="${C.g300}">Flujo neto</text>`;
  return s + '</svg>';
}

function spark() {
  // Serie «equivocada»: ingresos + egresos (el error de signo de la diapositiva 10).
  const wrong = INGRESOS.map((v, i) => v + EGRESOS[i]);
  const W = 400, H = 120, min = 600000, max = 920000;
  const pts = wrong.map((v, i) => [10 + (i * (W - 20)) / (wrong.length - 1), H - 10 - ((v - min) / (max - min)) * (H - 20)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="spk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lime}" stop-opacity=".28"/><stop offset="1" stop-color="${C.lime}" stop-opacity="0"/></linearGradient></defs>
  <path d="${d} L${W - 10} ${H} L10 ${H} Z" fill="url(#spk)"/><path d="${d}" fill="none" stroke="${C.lime}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
  ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${C.lime}"/>`).join('')}</svg>`;
}

function minibars() {
  const vals = [0.45, 0.62, 0.55, 0.78, 0.7, 0.92];
  const W = 300, H = 130;
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${vals
    .map((v, i) => `<rect x="${8 + i * 49}" y="${H - v * (H - 8)}" width="30" height="${v * (H - 8)}" rx="4" fill="${i === vals.length - 1 ? C.lime : C.ivory}" fill-opacity="${i === vals.length - 1 ? 1 : 0.32}"/>`)
    .join('')}</svg>`;
}

function stairs() {
  const u = 80, c = Math.cos(Math.PI / 6), sn = Math.sin(Math.PI / 6);
  const W = 2.4, D = 1.55, Hs = [1.1, 2.2, 3.3];
  const ox = 136, oy = 457;
  const P = (x, y, z) => [ox + (x - y) * c * u, oy + (x + y) * sn * u - z * u];
  const poly = (pts) => pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  let s = `<svg viewBox="0 0 760 560" aria-hidden="true"><defs>
    <linearGradient id="stTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ivory}" stop-opacity=".16"/><stop offset="1" stop-color="${C.ivory}" stop-opacity=".05"/></linearGradient>
    <linearGradient id="stTopL" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.lime}" stop-opacity=".5"/><stop offset="1" stop-color="${C.lime}" stop-opacity=".16"/></linearGradient>
    <linearGradient id="stFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2b37"/><stop offset="1" stop-color="#0f1922"/></linearGradient>
    <linearGradient id="stSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16222c"/><stop offset="1" stop-color="#0b131a"/></linearGradient></defs>`;
  // sombra de piso
  for (let k = 2; k >= 0; k--) {
    const y0 = -(k + 1) * D, y1 = -k * D, z = Hs[k];
    const top = [P(0, y0, z), P(W, y0, z), P(W, y1, z), P(0, y1, z)];
    const front = [P(0, y1, 0), P(W, y1, 0), P(W, y1, z), P(0, y1, z)];
    const side = [P(W, y1, 0), P(W, y0, 0), P(W, y0, z), P(W, y1, z)];
    s += `<g class="st st-${k}">`;
    s += `<polygon class="st-front" points="${poly(front)}" fill="url(#stFront)" stroke="${C.ivory}" stroke-opacity=".16"/>`;
    s += `<polygon class="st-side" points="${poly(side)}" fill="url(#stSide)" stroke="${C.ivory}" stroke-opacity=".1"/>`;
    s += `<polygon class="st-top" points="${poly(top)}" fill="url(#${k === 2 ? 'stTopL' : 'stTop'})" stroke="${k === 2 ? C.lime : C.ivory}" stroke-opacity="${k === 2 ? 0.8 : 0.3}"/>`;
    const [tx, ty] = P(W / 2, (y0 + y1) / 2, z);
    s += `<text x="${tx}" y="${ty + 12}" text-anchor="middle" font-family="Inter Tight" font-weight="600" font-size="38" fill="${k === 2 ? C.lime : C.ivory}">${k + 1}</text>`;
    s += `</g>`;
  }
  return s + '</svg>';
}

function sources() {
  const groups = [...new Set(SOURCES.map((s) => s.group))];
  return groups
    .map(
      (g) =>
        `<section><h4>${esc(g)}</h4><ul>${SOURCES.filter((s) => s.group === g)
          .map((s) => `<li><p>${esc(s.cite)}</p><a href="${s.url}" target="_blank" rel="noopener">${esc(s.url)}</a></li>`)
          .join('')}</ul></section>`
    )
    .join('');
}

const RENDERERS = { dashboard, spark, minibars, stairs, sources };

export function renderCharts(root = document) {
  root.querySelectorAll('[data-chart]').forEach((el) => {
    const fn = RENDERERS[el.dataset.chart];
    if (fn) el.innerHTML = fn();
  });
}
