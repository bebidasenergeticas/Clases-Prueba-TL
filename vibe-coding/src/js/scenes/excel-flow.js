// Diapositiva 9: ARCHIVO EXCEL → BACKEND → API → DASHBOARD.
// Simulación didáctica del ciclo de relectura (polling) y actualización.
import { THREE, COL, glassMaterial, makeEdges, makeLines, pointsMaterial, makePoints, glowSprite, canvasTexture, roundRect, Packet } from './core.js';
import { COMPANY, MONTHS, INGRESOS, EGRESOS, TOTALS, SIM, MOVEMENTS, money, fmt } from '../../content/data.js';

const IVORY = '#F3F0E5', LIME = '#C8EC88', G300 = '#A9AEB1', G400 = '#858C92', G500 = '#5C646B';

// ------------------------------------------------------------------ texturas
function drawExcel(ctx, w, h, s) {
  roundRect(ctx, 3, 3, w - 6, h - 6, 34);
  ctx.fillStyle = 'rgba(14,24,33,0.94)';
  ctx.fill();
  // barra de título
  ctx.fillStyle = 'rgba(243,240,229,0.06)';
  ctx.fillRect(3, 3, w - 6, 104);
  ctx.strokeStyle = 'rgba(243,240,229,0.6)';
  ctx.lineWidth = 3;
  roundRect(ctx, 40, 30, 46, 50, 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(40, 47); ctx.lineTo(86, 47); ctx.moveTo(40, 63); ctx.lineTo(86, 63); ctx.moveTo(60, 30); ctx.lineTo(60, 80); ctx.stroke();
  ctx.font = '500 40px "JetBrains Mono", monospace';
  ctx.fillStyle = IVORY;
  ctx.fillText('movimientos.xlsx', 110, 70);
  if (s.saved > 0) {
    ctx.globalAlpha = Math.min(1, s.saved);
    ctx.font = '600 32px "JetBrains Mono", monospace';
    ctx.fillStyle = LIME;
    ctx.textAlign = 'right';
    ctx.fillText('Guardado ✓', w - 44, 68);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  const cols = [[0, 96], [96, 420], [420, 860], [860, 1110], [1110, w - 3]];
  const headY = 108, rowH = 138, firstRow = 27;
  // encabezados
  ctx.fillStyle = 'rgba(243,240,229,0.04)';
  ctx.fillRect(3, headY, w - 6, 70);
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillStyle = G400;
  ['', 'A', 'B', 'C', 'D'].forEach((l, i) => { ctx.fillText(l, cols[i][0] + 22, headY + 46); });
  ctx.font = '600 34px "Inter", sans-serif';
  ctx.fillStyle = G300;
  ctx.fillText('1', 30, headY + 120);
  ['Fecha', 'Concepto', 'Tipo', 'Monto'].forEach((l, i) => { ctx.fillText(l, cols[i + 1][0] + 22, headY + 120); });
  const rows = [
    ['30/06/2026', 'Ventas mostrador', 'Ingreso', MOVEMENTS.ingresos['Ventas mostrador'][5]],
    ['30/06/2026', 'Ventas en línea', 'Ingreso', MOVEMENTS.ingresos['Ventas en línea'][5]],
    ['30/06/2026', 'Nómina', 'Egreso', MOVEMENTS.egresos['Nómina'][5]],
    ['30/06/2026', 'Proveedores', 'Egreso', s.edited ? SIM.to : SIM.from],
    ['30/06/2026', 'Renta y servicios', 'Egreso', MOVEMENTS.egresos['Renta y servicios'][5]],
  ];
  const top = headY + 150;
  // rejilla
  ctx.strokeStyle = 'rgba(243,240,229,0.12)';
  ctx.lineWidth = 2;
  for (let r = 0; r <= rows.length; r++) { ctx.beginPath(); ctx.moveTo(3, top + r * rowH); ctx.lineTo(w - 3, top + r * rowH); ctx.stroke(); }
  cols.slice(1).forEach(([x]) => { ctx.beginPath(); ctx.moveTo(x, headY); ctx.lineTo(x, top + rows.length * rowH); ctx.stroke(); });
  ctx.fillStyle = 'rgba(243,240,229,0.25)';
  ctx.fillRect(3, top - 6, w - 6, 3);
  ctx.font = '500 30px "JetBrains Mono", monospace';
  ctx.fillStyle = G400;
  ctx.fillText('⋮', 30, top - 14);
  rows.forEach((r, i) => {
    const y = top + i * rowH + 86;
    const hl = i === 3;
    if (hl && s.edited) {
      ctx.fillStyle = `rgba(200,236,136,${0.14 + 0.18 * s.flash})`;
      ctx.fillRect(cols[4][0] + 2, top + i * rowH + 2, cols[4][1] - cols[4][0] - 4, rowH - 4);
      ctx.strokeStyle = LIME;
      ctx.lineWidth = 6;
      ctx.strokeRect(cols[4][0] + 4, top + i * rowH + 4, cols[4][1] - cols[4][0] - 8, rowH - 8);
    }
    ctx.font = '500 30px "JetBrains Mono", monospace';
    ctx.fillStyle = G400;
    ctx.fillText(String(firstRow + i), 22, y);
    ctx.fillStyle = 'rgba(243,240,229,0.78)';
    ctx.font = '500 32px "JetBrains Mono", monospace';
    ctx.fillText(r[0], cols[1][0] + 22, y);
    ctx.font = '500 38px "Inter", sans-serif';
    ctx.fillStyle = IVORY;
    ctx.fillText(r[1], cols[2][0] + 22, y);
    ctx.fillStyle = r[2] === 'Ingreso' ? IVORY : G300;
    ctx.fillText(r[2], cols[3][0] + 22, y);
    ctx.font = '600 44px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = hl && s.edited ? LIME : IVORY;
    ctx.fillText(fmt(r[3]), cols[4][1] - 30, y + 2);
    ctx.textAlign = 'left';
  });
  ctx.strokeStyle = 'rgba(243,240,229,0.35)';
  ctx.lineWidth = 3;
  roundRect(ctx, 3, 3, w - 6, h - 6, 34);
  ctx.stroke();
}

function drawDash(ctx, w, h, s) {
  roundRect(ctx, 3, 3, w - 6, h - 6, 34);
  ctx.fillStyle = 'rgba(14,24,33,0.95)';
  ctx.fill();
  ctx.font = '600 50px "Inter Tight", sans-serif';
  ctx.fillStyle = IVORY;
  ctx.fillText(COMPANY, 56, 92);
  ctx.font = '500 26px "JetBrains Mono", monospace';
  ctx.fillStyle = G400;
  ctx.fillText('FLUJO DE EFECTIVO · ENE–JUN 2026', 56, 140);
  ctx.textAlign = 'right';
  ctx.fillStyle = s.pulse > 0 ? LIME : G300;
  ctx.fillText('Última lectura ' + s.clock, w - 56, 92);
  ctx.textAlign = 'left';
  ctx.beginPath();
  ctx.fillStyle = LIME;
  ctx.globalAlpha = 0.5 + 0.5 * Math.max(s.pulse, 0.3);
  ctx.arc(w - 56 - ctx.measureText('Última lectura ' + s.clock).width - 28, 83, 11, 0, 7);
  ctx.fill();
  ctx.globalAlpha = 1;
  const kpis = [
    ['INGRESOS', TOTALS.ingresos, IVORY, false],
    ['EGRESOS', s.egresos, IVORY, s.changed],
    ['FLUJO NETO', s.flujo, LIME, s.changed],
  ];
  const kw = (w - 112 - 48) / 3;
  kpis.forEach(([l, v, c, hl], i) => {
    const x = 56 + i * (kw + 24), y = 180;
    roundRect(ctx, x, y, kw, 200, 22);
    ctx.fillStyle = 'rgba(243,240,229,0.05)';
    ctx.fill();
    ctx.strokeStyle = hl ? `rgba(200,236,136,${0.45 + 0.55 * s.pulse})` : i === 2 ? 'rgba(200,236,136,0.5)' : 'rgba(243,240,229,0.16)';
    ctx.lineWidth = hl ? 5 : 3;
    ctx.stroke();
    ctx.font = '500 26px "JetBrains Mono", monospace';
    ctx.fillStyle = G300;
    ctx.fillText(l, x + 32, y + 56);
    ctx.font = '600 64px "Inter Tight", sans-serif';
    ctx.fillStyle = c;
    ctx.fillText(money(v), x + 32, y + 148);
  });
  // gráfica
  const gx = 120, gy = 450, gw = w - gx - 56, gh = 460, max = 600000;
  const Y = (v) => gy + gh - (v / max) * gh;
  ctx.font = '500 22px "JetBrains Mono", monospace';
  for (let t = 0; t <= max; t += 200000) {
    ctx.strokeStyle = t ? 'rgba(243,240,229,0.08)' : 'rgba(243,240,229,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(gx, Y(t)); ctx.lineTo(gx + gw, Y(t)); ctx.stroke();
    ctx.fillStyle = G400;
    ctx.textAlign = 'right';
    ctx.fillText(t ? fmt(t / 1000) + 'k' : '0', gx - 16, Y(t) + 8);
    ctx.textAlign = 'left';
  }
  const slot = gw / 6, bw = 50;
  const egr = EGRESOS.slice();
  egr[5] = s.junEgr;
  const pts = [];
  MONTHS.forEach((m, i) => {
    const cx = gx + slot * i + slot / 2;
    ctx.fillStyle = 'rgba(243,240,229,0.86)';
    roundRect(ctx, cx - bw - 5, Y(INGRESOS[i]), bw, gy + gh - Y(INGRESOS[i]), 6); ctx.fill();
    ctx.fillStyle = i === 5 && s.changed ? `rgba(200,236,136,${0.35 + 0.4 * s.pulse})` : G500;
    roundRect(ctx, cx + 5, Y(egr[i]), bw, gy + gh - Y(egr[i]), 6); ctx.fill();
    ctx.fillStyle = G300;
    ctx.font = '500 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(m, cx, gy + gh + 40);
    ctx.textAlign = 'left';
    pts.push([cx, Y(INGRESOS[i] - egr[i])]);
  });
  ctx.strokeStyle = LIME;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  pts.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fillStyle = '#101C27'; ctx.fill(); ctx.lineWidth = 5; ctx.stroke(); });
  ctx.strokeStyle = 'rgba(243,240,229,0.35)';
  ctx.lineWidth = 3;
  roundRect(ctx, 3, 3, w - 6, h - 6, 34);
  ctx.stroke();
}

function drawJson(ctx, w, h, s) {
  roundRect(ctx, 3, 3, w - 6, h - 6, 26);
  ctx.fillStyle = 'rgba(14,24,33,0.92)';
  ctx.fill();
  ctx.strokeStyle = s.changed ? LIME : 'rgba(243,240,229,0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = '500 34px "JetBrains Mono", monospace';
  ctx.fillStyle = G400;
  ctx.fillText('{ "flujo_neto":', 30, 62);
  ctx.fillStyle = s.changed ? LIME : IVORY;
  ctx.font = '600 34px "JetBrains Mono", monospace';
  ctx.fillText(String(s.changed ? SIM.flujoTotalTo : TOTALS.flujo) + ' }', 30, 112);
}

// ------------------------------------------------------------------ escena
export function createExcelFlow(gl) {
  const lite = gl.lite;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x101c27, 0.018);
  const camera = new THREE.PerspectiveCamera(30, 1920 / 1080, 0.1, 200);
  const camBase = new THREE.Vector3(0, 0.82, 14);
  const lookAt = new THREE.Vector3(0, -0.16, 0);
  camera.position.copy(camBase);
  camera.lookAt(lookAt);

  scene.add(new THREE.AmbientLight(0xf3f0e5, 0.3));
  const key = new THREE.DirectionalLight(0xf3f0e5, 1.3);
  key.position.set(-4, 6, 9);
  scene.add(key);

  const state = { edited: false, saved: 0, flash: 0, changed: false, pulse: 0, egresos: TOTALS.egresos, flujo: TOTALS.flujo, junEgr: EGRESOS[5], clock: '10:41:58' };

  // Excel
  const excel = new THREE.Group();
  excel.position.set(-4.12, 0.18, 0);
  excel.rotation.y = 0.3;
  const exTex = canvasTexture(1500, 1020, (c, w, h) => drawExcel(c, w, h, state), gl.renderer);
  const exW = 3.25, exH = (exW * 1020) / 1500;
  const exPlane = new THREE.Mesh(new THREE.PlaneGeometry(exW, exH), new THREE.MeshBasicMaterial({ map: exTex, transparent: true, toneMapped: false, depthWrite: false }));
  excel.add(exPlane);
  const exSlab = new THREE.BoxGeometry(exW + 0.06, exH + 0.06, 0.08);
  const exGlass = new THREE.Mesh(exSlab, glassMaterial({ color: '#15232e', rim: COL.ivory, opacity: 0.08, rimStrength: 0.35 }));
  exGlass.position.z = -0.06;
  excel.add(exGlass);
  scene.add(excel);

  // Backend
  const backend = new THREE.Group();
  backend.position.set(-1.12, 0.05, -0.4);
  backend.rotation.y = -0.35;
  const leds = [];
  for (let k = 0; k < 3; k++) {
    const geo = new THREE.BoxGeometry(1.25, 0.34, 0.95);
    const m = new THREE.Mesh(geo, glassMaterial({ color: '#17252f', rim: COL.ivory, opacity: 0.3, rimStrength: 0.55 }));
    m.position.y = -0.4 + k * 0.4;
    backend.add(m);
    const e = makeEdges(geo, { color: COL.ivory, opacity: 0.5, width: 1.2 });
    e.position.copy(m.position);
    backend.add(e);
    for (let j = 0; j < 3; j++) {
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), new THREE.MeshBasicMaterial({ color: COL.lime, transparent: true }));
      led.position.set(0.32 + j * 0.11, m.position.y, 0.485);
      backend.add(led);
      leds.push({ led, phase: Math.random() * 6.28 });
    }
  }
  const beGlow = glowSprite(COL.lime, 3, 0);
  backend.add(beGlow);
  scene.add(backend);

  // API: anillo-puerta + chip JSON
  const api = new THREE.Group();
  api.position.set(1.05, 0.1, -0.3);
  const ringGeo = new THREE.TorusGeometry(0.62, 0.035, 16, 96);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: COL.lime, transparent: true, opacity: 0.9 }));
  ring.rotation.y = Math.PI / 2 - 0.75;
  api.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: COL.ivory, transparent: true, opacity: 0.35 }));
  ring2.rotation.y = Math.PI / 2 - 0.75;
  api.add(ring2);
  const apiGlow = glowSprite(COL.lime, 2.6, 0.18);
  api.add(apiGlow);
  const jsonTex = canvasTexture(440, 140, (c, w, h) => drawJson(c, w, h, state), gl.renderer);
  const json = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 0.42), new THREE.MeshBasicMaterial({ map: jsonTex, transparent: true, toneMapped: false, depthWrite: false }));
  json.position.set(0, -1.12, 0.3);
  api.add(json);
  scene.add(api);

  // Dashboard
  const dash = new THREE.Group();
  dash.position.set(4.12, 0.18, 0);
  dash.rotation.y = -0.3;
  const dTex = canvasTexture(1500, 1000, (c, w, h) => drawDash(c, w, h, state), gl.renderer);
  const dW = 3.35, dH = (dW * 1000) / 1500;
  dash.add(new THREE.Mesh(new THREE.PlaneGeometry(dW, dH), new THREE.MeshBasicMaterial({ map: dTex, transparent: true, toneMapped: false, depthWrite: false })));
  const dGlass = new THREE.Mesh(new THREE.BoxGeometry(dW + 0.06, dH + 0.06, 0.08), glassMaterial({ color: '#15232e', rim: COL.ivory, opacity: 0.08, rimStrength: 0.35 }));
  dGlass.position.z = -0.06;
  dash.add(dGlass);
  scene.add(dash);

  // Rieles
  scene.updateMatrixWorld(true);
  const W = (o, x, y, z) => o.localToWorld(new THREE.Vector3(x, y, z));
  const exR = W(excel, exW / 2 + 0.05, -0.05, 0);
  const beL = W(backend, -0.66, 0, 0), beR = W(backend, 0.66, 0, 0);
  const apiC = api.position.clone();
  const dL = W(dash, -dW / 2 - 0.05, -0.05, 0);
  const path = (pts) => new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const resp = path([exR, exR.clone().lerp(beL, 0.5).add(new THREE.Vector3(0, -0.12, 0.2)), beL, beR, apiC.clone().add(new THREE.Vector3(0, -0.05, 0)), dL.clone().lerp(apiC, 0.5).add(new THREE.Vector3(0, -0.1, 0.2)), dL]);
  const req = path([dL.clone().add(new THREE.Vector3(0, 0.32, 0)), dL.clone().lerp(apiC, 0.5).add(new THREE.Vector3(0, 0.5, 0.2)), apiC.clone().add(new THREE.Vector3(0, 0.2, 0)), beR.clone().add(new THREE.Vector3(0, 0.3, 0))]);
  const read = path([beL.clone().add(new THREE.Vector3(0, 0.25, 0)), exR.clone().lerp(beL, 0.5).add(new THREE.Vector3(0, 0.45, 0.2)), exR.clone().add(new THREE.Vector3(0, 0.3, 0))]);
  const rail = (curve, op) => {
    const p = curve.getPoints(80);
    const pairs = [];
    for (let i = 0; i < p.length - 1; i++) pairs.push(p[i].x, p[i].y, p[i].z, p[i + 1].x, p[i + 1].y, p[i + 1].z);
    return makeLines(pairs, { color: COL.ivory, opacity: op, width: 1.1 });
  };
  scene.add(rail(resp, 0.28), rail(req, 0.12), rail(read, 0.12));

  const pReq = new Packet(COL.ivory, 0.065, 0.55);
  const pRead = new Packet(COL.ivory, 0.065, 0.55);
  const pResp = new Packet(COL.lime, 0.09, 0.95);
  const trail = [new Packet(COL.lime, 0.05, 0.5), new Packet(COL.lime, 0.04, 0.35)];
  [pReq, pRead, pResp, ...trail].forEach((p) => scene.add(p.group));

  // polvo
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

  // ------------------------------------------------ lógica de simulación
  let step = 0;
  let pollTimer = 1.2;
  let cycleBusy = false;
  let anim = null; // interpolación del dashboard
  let token = 0;

  const redrawExcel = () => exTex.userData.redraw((c, w, h) => drawExcel(c, w, h, state));
  const redrawDash = () => dTex.userData.redraw((c, w, h) => drawDash(c, w, h, state));
  const redrawJson = () => jsonTex.userData.redraw((c, w, h) => drawJson(c, w, h, state));

  function applyTarget(updated, instant) {
    const to = updated ? { egresos: SIM.egresosTotalTo, flujo: SIM.flujoTotalTo, junEgr: SIM.egresosJunTo } : { egresos: TOTALS.egresos, flujo: TOTALS.flujo, junEgr: EGRESOS[5] };
    state.changed = updated;
    state.clock = updated ? '10:42:05' : '10:41:58';
    if (instant) {
      Object.assign(state, to);
      state.pulse = updated ? 0.6 : 0;
      anim = null;
      redrawDash();
      redrawJson();
    } else {
      anim = { from: { egresos: state.egresos, flujo: state.flujo, junEgr: state.junEgr }, to, t: 0 };
      state.pulse = 1;
      redrawJson();
    }
  }

  function cycle(onArrive) {
    if (cycleBusy) return;
    cycleBusy = true;
    const my = token;
    pReq.launch(req, 0.9, () => {
      if (my !== token) return;
      beGlow.material.opacity = 0.5;
      pRead.launch(read, 0.6, () => {
        if (my !== token) return;
        pResp.launch(resp, 1.5, () => {
          if (my !== token) return;
          cycleBusy = false;
          onArrive && onArrive();
        });
        trail[0].launch(resp, 1.62);
        trail[1].launch(resp, 1.74);
      });
    });
  }

  function cancelCycles() {
    token++;
    cycleBusy = false;
    [pReq, pRead, pResp, ...trail].forEach((p) => { p.curve = null; p.group.visible = false; });
  }

  function setStep(s, instant) {
    const prev = step;
    step = s;
    if (instant) {
      cancelCycles();
      state.edited = s >= 1;
      state.saved = s >= 1 ? 1 : 0;
      state.flash = s >= 1 ? 0.4 : 0;
      redrawExcel();
      applyTarget(s >= 2, true);
      return;
    }
    if (s === 0) {
      cancelCycles();
      if (state.edited) { state.edited = false; state.saved = 0; redrawExcel(); }
      if (state.changed) applyTarget(false, true);
      pollTimer = 1.0;
    } else if (s === 1) {
      cancelCycles();
      if (state.changed) applyTarget(false, true);
      if (!state.edited || prev === 0) { state.edited = true; state.saved = 1; state.flash = 1; redrawExcel(); }
    } else if (s >= 2) {
      if (!state.edited) { state.edited = true; state.saved = 1; state.flash = 1; redrawExcel(); }
      if (!state.changed && prev < 2) {
        cancelCycles();
        cycle(() => applyTarget(true, false));
      }
    }
  }

  const tmp = new THREE.Vector3();
  const A = { excel: new THREE.Vector3(), backend: new THREE.Vector3(), api: new THREE.Vector3(), dash: new THREE.Vector3(), cell: new THREE.Vector3() };

  function update(t, dt) {
    scene.userData.dust.material.uniforms.uTime.value = t;
    [pReq, pRead, pResp, ...trail].forEach((p) => p.update(dt));
    leds.forEach(({ led, phase }) => { led.material.opacity = 0.3 + 0.7 * (Math.sin(t * 3.2 + phase) > 0.1 ? 1 : 0.15); });
    beGlow.material.opacity = Math.max(0, beGlow.material.opacity - dt * 0.6);
    ring.rotation.z = t * 0.6;
    apiGlow.material.opacity = 0.16 + Math.sin(t * 2) * 0.05;
    // relectura periódica en reposo (solo en el paso 0)
    if (step === 0) {
      pollTimer -= dt;
      if (pollTimer <= 0 && !cycleBusy) { pollTimer = 3.4; cycle(() => { state.pulse = 0.5; }); }
    }
    let dirty = false;
    if (state.flash > 0 && step >= 1) { state.flash = Math.max(0, state.flash - dt * 0.7); redrawExcel(); }
    if (anim) {
      anim.t = Math.min(1, anim.t + dt / 1.3);
      const e = 1 - Math.pow(1 - anim.t, 3);
      state.egresos = Math.round(anim.from.egresos + (anim.to.egresos - anim.from.egresos) * e);
      state.flujo = Math.round(anim.from.flujo + (anim.to.flujo - anim.from.flujo) * e);
      state.junEgr = Math.round(anim.from.junEgr + (anim.to.junEgr - anim.from.junEgr) * e);
      if (anim.t >= 1) { Object.assign(state, anim.to); anim = null; }
      dirty = true;
    }
    if (state.pulse > 0) {
      state.pulse = Math.max(state.changed ? 0.35 : 0, state.pulse - dt * 0.5);
      dirty = true;
    }
    if (dirty) redrawDash();
    camera.position.set(camBase.x + Math.sin(t * 0.1) * 0.3, camBase.y + Math.sin(t * 0.13) * 0.08, camBase.z);
    camera.lookAt(lookAt);
  }

  function enter(s) {
    pollTimer = 0.8;
  }

  function anchors() {
    excel.localToWorld(A.excel.set(0, exH / 2 + 0.08, 0));
    backend.localToWorld(A.backend.set(0, 0.62, 0));
    api.localToWorld(A.api.set(0, 0.95, 0));
    dash.localToWorld(A.dash.set(0, dH / 2 + 0.08, 0));
    // borde inferior de la celda D30 en coordenadas del lienzo: x≈1295/1500, y≈(258 + 4·138)/1020
    excel.localToWorld(A.cell.set((1295 / 1500 - 0.5) * exW, (0.5 - (258 + 4 * 138) / 1020) * exH, 0.02));
    return A;
  }

  return { scene, camera, update, setStep, anchors, enter };
}
