/* =========================================================
   FinView — script.js
   Demo educativa: todos los datos son FICTICIOS.

   Organización del archivo:
   1. DATOS ficticios ............ aquí viven los datos
   2. CÁLCULOS ................... fórmulas financieras
   3. FORMATO .................... cómo mostrar números
   4. ESTADO de la aplicación .... qué periodo está seleccionado
   5. RENDER ..................... pintar dashboard, tablas, gráficas, semáforo
   6. FORMULARIO ................. registrar información
   7. REPORTE .................... vista lista para imprimir
   8. NAVEGACIÓN E INICIO
   ========================================================= */
'use strict';

/* =========================================================
   1. DATOS FICTICIOS
   Cada periodo (año) guarda los datos "crudos". Todo lo demás
   (utilidad, margen, capital, semáforo…) se CALCULA a partir de aquí.
   ========================================================= */
const DATOS_EJEMPLO = {
  2024: { ingresos: 1080000, costos: 615000, gastosOp: 330000, activos: 2150000, pasivos: 855000,  efectivo: 310000, flujoOperacion: 168000, flujoInversion: -140000 },
  2025: { ingresos: 1250000, costos: 690000, gastosOp: 375000, activos: 2400000, pasivos: 920000,  efectivo: 420000, flujoOperacion: 236000, flujoInversion: -165000 },
  2026: { ingresos: 1410000, costos: 770000, gastosOp: 410000, activos: 2720000, pasivos: 1010000, efectivo: 465000, flujoOperacion: 262000, flujoInversion: -182000 },
};

// Efectivo con el que inicia el primer periodo de ejemplo (necesario para el flujo de efectivo)
const EFECTIVO_APERTURA = { periodo: 2024, monto: 260000 };

// Umbrales ILUSTRATIVOS del semáforo (no son un estándar contable)
const SEMAFORO = {
  liquidez: {
    nombre: 'Liquidez',
    metrica: 'Efectivo ÷ Pasivos',
    explicacion: 'Cuántos pesos de efectivo hay por cada peso que se debe.',
    evaluar: v => (v >= 0.35 ? 'saludable' : v >= 0.15 ? 'atencion' : 'riesgo'),
    rangos: { saludable: '≥ 0.35x', atencion: '0.15x – 0.35x', riesgo: '< 0.15x' },
  },
  rentabilidad: {
    nombre: 'Rentabilidad',
    metrica: 'Margen neto',
    explicacion: 'Cuántos centavos de utilidad quedan por cada peso vendido.',
    evaluar: v => (v >= 0.12 ? 'saludable' : v >= 0.05 ? 'atencion' : 'riesgo'),
    rangos: { saludable: '≥ 12%', atencion: '5% – 12%', riesgo: '< 5%' },
  },
  endeudamiento: {
    nombre: 'Endeudamiento',
    metrica: 'Pasivos ÷ Activos',
    explicacion: 'Qué parte de lo que tiene la empresa está financiada con deuda.',
    evaluar: v => (v <= 0.5 ? 'saludable' : v <= 0.7 ? 'atencion' : 'riesgo'),
    rangos: { saludable: '≤ 50%', atencion: '50% – 70%', riesgo: '> 70%' },
  },
};

const ESTADOS = {
  saludable: { texto: 'Saludable', icono: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', color: '#3fb27f' },
  atencion:  { texto: 'Atención',  icono: '<path d="M12 7v6M12 17h.01"/>',     color: '#e3a63b' },
  riesgo:    { texto: 'Riesgo',    icono: '<path d="M7 7l10 10M17 7L7 17"/>',  color: '#e5534b' },
};

/* =========================================================
   2. CÁLCULOS
   ========================================================= */

/** Recibe los datos de un periodo y devuelve todos sus indicadores. */
function calcularIndicadores(d) {
  const utilidadBruta = d.ingresos - d.costos;
  const utilidad = d.ingresos - d.costos - d.gastosOp;           // Utilidad = ingresos − costos − gastos
  const margenNeto = d.ingresos > 0 ? utilidad / d.ingresos : 0;  // Margen neto = utilidad / ingresos
  const capital = d.activos - d.pasivos;                          // Capital = activos − pasivos
  const gastosTotales = d.costos + d.gastosOp;

  // Indicadores del semáforo
  const liquidez = d.pasivos > 0 ? d.efectivo / d.pasivos : Infinity;
  const endeudamiento = d.activos > 0 ? d.pasivos / d.activos : (d.pasivos > 0 ? Infinity : 0);

  return {
    utilidadBruta, utilidad, margenNeto, capital, gastosTotales, liquidez, endeudamiento,
    semaforo: {
      liquidez: SEMAFORO.liquidez.evaluar(liquidez),
      rentabilidad: SEMAFORO.rentabilidad.evaluar(margenNeto),
      endeudamiento: SEMAFORO.endeudamiento.evaluar(endeudamiento),
    },
  };
}

/** Variación porcentual entre dos valores (null si no se puede calcular). */
function variacion(actual, anterior) {
  if (anterior === undefined || anterior === null || anterior === 0) return null;
  return (actual - anterior) / Math.abs(anterior);
}

/** Periodo inmediato anterior que exista en los datos (o null). */
function periodoAnterior(p) {
  const previos = periodos().filter(x => x < p);
  return previos.length ? previos[previos.length - 1] : null;
}

/** Flujo de efectivo de un periodo. */
function calcularFlujo(p) {
  const d = datos[p];
  const ant = periodoAnterior(p);
  const inicial = ant !== null ? datos[ant].efectivo
    : (p === EFECTIVO_APERTURA.periodo ? EFECTIVO_APERTURA.monto : null);

  if (inicial === null) return { disponible: false, final: d.efectivo };

  const variacionNeta = d.efectivo - inicial;

  // Datos de ejemplo: traen operación e inversión; financiamiento cuadra la diferencia.
  if (d.origen === 'ejemplo' && typeof d.flujoOperacion === 'number') {
    const financiamiento = variacionNeta - d.flujoOperacion - d.flujoInversion;
    return {
      disponible: true, estimado: false, inicial, final: d.efectivo, variacionNeta,
      operacion: d.flujoOperacion, inversion: d.flujoInversion, financiamiento,
      inversionFinanciamiento: d.flujoInversion + financiamiento,
    };
  }

  // Datos capturados: el formulario no pide los flujos, así que se ESTIMAN.
  const operacion = calcularIndicadores(d).utilidad;
  return {
    disponible: true, estimado: true, inicial, final: d.efectivo, variacionNeta,
    operacion, inversion: null, financiamiento: null,
    inversionFinanciamiento: variacionNeta - operacion,
  };
}

/* =========================================================
   3. FORMATO
   ========================================================= */
const fmtMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

function moneda(v) {
  if (v === null || v === undefined || !isFinite(v)) return '—';
  const s = fmtMoneda.format(Math.abs(Math.round(v)));
  return v < 0 ? '−' + s : s;
}
function monedaCorta(v) {
  const a = Math.abs(v), signo = v < 0 ? '−' : '';
  if (a >= 1e6) return `${signo}$${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${signo}$${Math.round(a / 1e3)}K`;
  return `${signo}$${Math.round(a)}`;
}
function pct(v, dec = 1) {
  if (v === null || !isFinite(v)) return '—';
  return `${(v * 100).toFixed(dec)}%`;
}
function veces(v) {
  if (!isFinite(v)) return 'Sin pasivos';
  return `${v.toFixed(2)}x`;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* =========================================================
   4. ESTADO DE LA APLICACIÓN
   ========================================================= */
let datos = {};               // copia de trabajo (se modifica con el formulario)
let periodoActual = 2025;     // periodo seleccionado
let bitacora = [];            // registros procesados en esta sesión
const graficas = {};          // instancias de Chart.js

function clonarEjemplo() {
  const copia = {};
  Object.keys(DATOS_EJEMPLO).forEach(p => { copia[p] = { ...DATOS_EJEMPLO[p], origen: 'ejemplo' }; });
  return copia;
}
function periodos() {
  return Object.keys(datos).map(Number).sort((a, b) => a - b);
}

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   5. RENDER
   ========================================================= */

/** Vuelve a pintar todo lo que depende de los datos. */
function renderTodo(opciones = {}) {
  renderSelector();
  $$('[data-bind="periodo"]').forEach(el => { el.textContent = periodoActual; });
  renderContexto();
  renderKpis(opciones.resaltar);
  renderSemaforo();
  renderFormulas();
  renderTablas();
  renderTicker();
  actualizarGraficas();
  renderPreview();
}

/* ---- Selector de periodo ---- */
function renderSelector() {
  const cont = $('#periodSelector');
  cont.innerHTML = periodos().map(p => `
    <button type="button" class="seg-btn" data-periodo="${p}" aria-pressed="${p === periodoActual}">
      ${p}${datos[p].origen === 'usuario' ? '<span class="new-dot" title="Capturado por el usuario"></span>' : ''}
    </button>`).join('');
}

function seleccionarPeriodo(p) {
  if (!datos[p] || p === periodoActual) return;
  periodoActual = p;
  renderTodo({ resaltar: true });
  // el selector se vuelve a dibujar: devolvemos el foco al botón elegido (accesibilidad con teclado)
  $(`#periodSelector [data-periodo="${p}"]`)?.focus();
}

/* ---- Contexto ---- */
function renderContexto() {
  const d = datos[periodoActual];
  const badge = $('#dataOrigin');
  badge.textContent = d.origen === 'usuario' ? 'Capturado por ti' : 'Datos de ejemplo';
  badge.classList.toggle('is-user', d.origen === 'usuario');
  const ant = periodoAnterior(periodoActual);
  $('#prevNote').textContent = ant ? `comparado contra ${ant}` : 'sin periodo previo para comparar';
}

/* ---- KPIs ---- */
const KPIS = [
  { clave: 'ingresos',  nombre: 'Ingresos',        valor: (d) => d.ingresos,              tipo: 'moneda', mejor: 'sube', hint: 'Ventas del periodo' },
  { clave: 'utilidad',  nombre: 'Utilidad neta',   valor: (d, i) => i.utilidad,           tipo: 'moneda', mejor: 'sube', hint: 'Ingresos − costos − gastos' },
  { clave: 'activos',   nombre: 'Activos',         valor: (d) => d.activos,               tipo: 'moneda', mejor: 'sube', hint: 'Lo que la empresa tiene' },
  { clave: 'pasivos',   nombre: 'Pasivos',         valor: (d) => d.pasivos,               tipo: 'moneda', mejor: 'baja', hint: 'Lo que la empresa debe' },
  { clave: 'margen',    nombre: 'Margen neto',     valor: (d, i) => i.margenNeto,         tipo: 'pct',    mejor: 'sube', hint: 'Utilidad ÷ ingresos' },
  { clave: 'capital',   nombre: 'Capital contable', valor: (d, i) => i.capital,           tipo: 'moneda', mejor: 'sube', hint: 'Activos − pasivos' },
];

function construirKpis() {
  $('#kpiGrid').innerHTML = KPIS.map((k, idx) => `
    <article class="card kpi reveal" style="--i:${idx + 1}" data-kpi="${k.clave}">
      <div class="kpi-top">
        <span class="eyebrow">${k.nombre}</span>
        <span class="delta" data-delta></span>
      </div>
      <div class="kpi-value" data-value data-current="0">—</div>
      <div class="spark-wrap" aria-hidden="true">
        <svg class="spark" data-spark viewBox="0 0 120 34" preserveAspectRatio="none"></svg>
        <span class="spark-dot" data-spark-dot></span>
      </div>
      <div class="kpi-foot"><span class="kpi-hint">${k.hint}</span></div>
    </article>`).join('');
}

function renderKpis(resaltar) {
  const d = datos[periodoActual];
  const ind = calcularIndicadores(d);
  const ant = periodoAnterior(periodoActual);
  const indAnt = ant ? calcularIndicadores(datos[ant]) : null;

  KPIS.forEach(k => {
    const card = $(`[data-kpi="${k.clave}"]`);
    const valor = k.valor(d, ind);
    animarNumero(card.querySelector('[data-value]'), valor, k.tipo);

    // Variación contra el periodo anterior
    const deltaEl = card.querySelector('[data-delta]');
    deltaEl.className = 'delta';
    if (indAnt) {
      const previo = k.valor(datos[ant], indAnt);
      let texto, dir;
      if (k.tipo === 'pct') {
        const pp = (valor - previo) * 100;
        dir = Math.sign(Math.round(pp * 10));
        texto = `${pp >= 0 ? '+' : '−'}${Math.abs(pp).toFixed(1)} pp`;
      } else {
        const v = variacion(valor, previo);
        dir = v === null ? 0 : Math.sign(Math.round(v * 1000));
        texto = v === null ? 'n/d' : `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(1)}%`;
      }
      const flecha = dir > 0 ? '▲' : dir < 0 ? '▼' : '■';
      deltaEl.textContent = `${flecha} ${texto}`;
      if (dir !== 0) deltaEl.classList.add((dir > 0) === (k.mejor === 'sube') ? 'good' : 'bad');
      deltaEl.title = `vs ${ant}`;
    } else {
      deltaEl.textContent = 'sin comparativo';
      deltaEl.title = '';
    }

    // Mini gráfica (sparkline) de todos los periodos
    const serie = periodos().map(p => k.valor(datos[p], calcularIndicadores(datos[p])));
    dibujarSparkline(card.querySelector('[data-spark]'), card.querySelector('[data-spark-dot]'), serie, periodos().indexOf(periodoActual), k.clave);

    if (resaltar) {
      card.classList.remove('is-updated');
      void card.offsetWidth; // reinicia la animación
      card.classList.add('is-updated');
    }
  });
}

/** Anima un número desde su valor actual hasta el nuevo (efecto "contador"). */
function animarNumero(el, destino, tipo) {
  const origen = parseFloat(el.dataset.current) || 0;
  const formatear = v => (tipo === 'pct' ? pct(v) : moneda(v));
  el.dataset.current = destino;
  if (reduceMotion || origen === destino) { el.textContent = formatear(destino); return; }
  const duracion = 750, inicio = performance.now();
  cancelAnimationFrame(el._raf);
  const paso = (t) => {
    const x = Math.min(1, (t - inicio) / duracion);
    const e = 1 - Math.pow(1 - x, 3); // easeOutCubic
    el.textContent = formatear(origen + (destino - origen) * e);
    if (x < 1) el._raf = requestAnimationFrame(paso);
  };
  el._raf = requestAnimationFrame(paso);
}

function dibujarSparkline(svg, punto, valores, idxActivo, id) {
  const W = 120, H = 34, pad = 4;
  if (valores.length < 2) { svg.innerHTML = ''; punto.hidden = true; return; }
  const min = Math.min(...valores), max = Math.max(...valores);
  const rango = max - min || 1;
  const pts = valores.map((v, i) => [
    pad + (i * (W - pad * 2)) / (valores.length - 1),
    H - pad - ((v - min) / rango) * (H - pad * 2),
  ]);
  const linea = pts.map(p => p.join(',')).join(' ');
  const area = `${pts[0][0]},${H} ${linea} ${pts[pts.length - 1][0]},${H}`;
  svg.innerHTML = `
    <defs><linearGradient id="sg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ede8dd" stop-opacity=".12"/><stop offset="1" stop-color="#ede8dd" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon class="spark-area" points="${area}" fill="url(#sg-${id})"/>
    <polyline points="${linea}"/>`;
  // El punto del periodo seleccionado es HTML para que no se deforme al estirar el SVG
  const [cx, cy] = pts[idxActivo] || pts[pts.length - 1];
  punto.hidden = false;
  punto.style.left = `${(cx / W) * 100}%`;
  punto.style.top = `${(cy / H) * 100}%`;
}

/* ---- Semáforo ---- */
function luces(estado) {
  return `<span class="lights" data-estado="${estado}" aria-hidden="true">
    <span class="lamp lamp-riesgo"></span><span class="lamp lamp-atencion"></span><span class="lamp lamp-saludable"></span></span>`;
}
function pastilla(estado) {
  const e = ESTADOS[estado];
  return `<span class="status-pill ${estado}"><svg viewBox="0 0 24 24" aria-hidden="true">${e.icono}</svg>${e.texto}</span>`;
}
function valorSemaforo(clave, ind) {
  if (clave === 'liquidez') return veces(ind.liquidez);
  if (clave === 'rentabilidad') return pct(ind.margenNeto);
  return pct(ind.endeudamiento);
}
function lecturaSemaforo(clave, estado, ind) {
  const v = valorSemaforo(clave, ind);
  const textos = {
    liquidez: {
      saludable: `Hay ${v} de efectivo por cada peso de pasivo: margen holgado para cubrir obligaciones.`,
      atencion: `Hay ${v} de efectivo por cada peso de pasivo: conviene vigilar el flujo de caja.`,
      riesgo: `Hay ${v} de efectivo por cada peso de pasivo: la caja es escasa frente a las deudas.`,
    },
    rentabilidad: {
      saludable: `De cada $100 vendidos quedan $${(ind.margenNeto * 100).toFixed(1)} de utilidad.`,
      atencion: `De cada $100 vendidos quedan $${(ind.margenNeto * 100).toFixed(1)}: los costos absorben casi todo.`,
      riesgo: `De cada $100 vendidos quedan $${(ind.margenNeto * 100).toFixed(1)}: la operación apenas genera (o pierde) dinero.`,
    },
    endeudamiento: {
      saludable: `El ${v} de los activos se financia con deuda; la mayor parte pertenece a los dueños.`,
      atencion: `El ${v} de los activos se financia con deuda; la dependencia de terceros es alta.`,
      riesgo: `El ${v} de los activos se financia con deuda; el capital propio es reducido.`,
    },
  };
  return textos[clave][estado];
}

function renderSemaforo() {
  const ind = calcularIndicadores(datos[periodoActual]);
  const claves = Object.keys(SEMAFORO);

  $('#semaforoCompact').innerHTML = claves.map(c => `
    <div class="sem-row">
      ${luces(ind.semaforo[c])}
      <div><div class="sem-row-name">${SEMAFORO[c].nombre}</div>
      <div class="sem-row-metric">${SEMAFORO[c].metrica} · ${valorSemaforo(c, ind)}</div></div>
      ${pastilla(ind.semaforo[c])}
    </div>`).join('');

  $('#semaforoFull').innerHTML = claves.map(c => {
    const est = ind.semaforo[c];
    return `
    <div class="sem-card">
      <div class="sem-card-top"><h3>${SEMAFORO[c].nombre}</h3>${luces(est)}</div>
      <div class="sem-card-top"><span class="sem-value">${valorSemaforo(c, ind)}</span>${pastilla(est)}</div>
      <div class="formula-expr"><span class="k">${SEMAFORO[c].nombre}</span> = ${SEMAFORO[c].metrica}</div>
      <p class="sem-reading">${SEMAFORO[c].explicacion} ${lecturaSemaforo(c, est, ind)}</p>
      <ul class="thresholds">
        ${['saludable', 'atencion', 'riesgo'].map(e => `
          <li class="${e === est ? 'is-current' : ''}">
            <span><span class="dot" style="background:${ESTADOS[e].color}"></span>${ESTADOS[e].texto}</span>
            <span class="mono">${SEMAFORO[c].rangos[e]}</span>
          </li>`).join('')}
      </ul>
    </div>`;
  }).join('');
}

/* ---- Fórmulas (indicadores automáticos) ---- */
function datosFormulas(d, ind) {
  return [
    {
      nombre: 'Utilidad',
      expr: '<span class="k">Utilidad</span> = Ingresos − Costos − Gastos',
      sub: `${moneda(d.ingresos)} − ${moneda(d.costos)} − ${moneda(d.gastosOp)}`,
      resultado: moneda(ind.utilidad),
      explica: 'Lo que queda después de pagar lo que cuesta vender y operar el negocio.',
    },
    {
      nombre: 'Margen neto',
      expr: '<span class="k">Margen</span> = Utilidad ÷ Ingresos × 100',
      sub: `${moneda(ind.utilidad)} ÷ ${moneda(d.ingresos)} × 100`,
      resultado: pct(ind.margenNeto),
      explica: `De cada $100 que entran por ventas, $${(ind.margenNeto * 100).toFixed(1)} se convierten en utilidad.`,
    },
    {
      nombre: 'Capital',
      expr: '<span class="k">Capital</span> = Activos − Pasivos',
      sub: `${moneda(d.activos)} − ${moneda(d.pasivos)}`,
      resultado: moneda(ind.capital),
      explica: 'La parte de la empresa que pertenece a los dueños, después de restar las deudas.',
    },
  ];
}

function renderFormulas() {
  const d = datos[periodoActual];
  const ind = calcularIndicadores(d);
  const html = (completo) => datosFormulas(d, ind).map(f => `
    <div class="formula">
      <div class="formula-name"><h3>${f.nombre}</h3><span class="eyebrow">${periodoActual}</span></div>
      <div class="formula-expr">${f.expr}</div>
      <div class="formula-sub">= ${f.sub}</div>
      <div class="formula-result">${f.resultado}</div>
      ${completo ? `<p class="formula-explain">${f.explica}</p>` : ''}
    </div>`).join('');
  $('#formulasCompact').innerHTML = html(false);
  $('#formulasFull').innerHTML = html(true);
}

/* ---- Estados financieros (tablas) ---- */
function celdaNumero(v, extra = '') {
  return `<td class="${extra}">${moneda(v)}</td>`;
}

/**
 * Construye una tabla con una columna por periodo.
 * filas: [{ etiqueta, op, valor: p => número, clase, tipo }]
 */
function construirTabla(tabla, filas, opciones = {}) {
  const ps = periodos();
  const sel = c => (c === periodoActual ? 'is-selected' : '');
  const thead = `<thead><tr><th>Concepto</th>${ps.map(p => `<th class="${sel(p)}">${p}${datos[p].origen === 'usuario' ? '*' : ''}</th>`).join('')}${opciones.columnaPct ? `<th>% ingresos ${periodoActual}</th>` : ''}</tr></thead>`;

  const tbody = filas.map(f => {
    if (f.clase === 'is-section') {
      return `<tr class="is-section"><td colspan="${ps.length + 1 + (opciones.columnaPct ? 1 : 0)}">${f.etiqueta}</td></tr>`;
    }
    const celdas = ps.map(p => {
      const v = f.valor(p);
      if (f.tipo === 'pct') return `<td class="${sel(p)}">${pct(v)}</td>`;
      if (f.tipo === 'texto') return `<td class="${sel(p)} ${v.clase || ''}">${v.texto}</td>`;
      if (v === null) return `<td class="${sel(p)} muted">n/d</td>`;
      const color = f.signo && v !== 0 ? (v > 0 ? 'pos' : 'neg') : '';
      return celdaNumero(v, `${sel(p)} ${color}`);
    }).join('');
    let colPct = '';
    if (opciones.columnaPct) {
      const ing = datos[periodoActual].ingresos;
      colPct = f.tipo === 'pct' || !ing ? '<td class="pct-col"></td>' : `<td class="pct-col">${pct(Math.abs(f.valor(periodoActual)) / ing)}</td>`;
    }
    return `<tr class="${f.clase || ''}"><td>${f.op ? `<span class="op">${f.op}</span>` : ''}${f.etiqueta}</td>${celdas}${colPct}</tr>`;
  }).join('');

  tabla.innerHTML = thead + `<tbody>${tbody}</tbody>`;
}

function renderTablas() {
  const I = p => calcularIndicadores(datos[p]);
  const D = p => datos[p];

  construirTabla($('#tablaResultados'), [
    { etiqueta: 'Ingresos', op: '', valor: p => D(p).ingresos },
    { etiqueta: 'Costos', op: '−', valor: p => D(p).costos },
    { etiqueta: 'Utilidad bruta', op: '=', valor: p => I(p).utilidadBruta, clase: 'is-subtotal' },
    { etiqueta: 'Gastos operativos', op: '−', valor: p => D(p).gastosOp },
    { etiqueta: 'Utilidad neta', op: '=', valor: p => I(p).utilidad, clase: 'is-total' },
    { etiqueta: 'Margen neto', op: '', valor: p => I(p).margenNeto, tipo: 'pct' },
  ], { columnaPct: true });

  construirTabla($('#tablaBalance'), [
    { etiqueta: 'Activos', clase: 'is-section' },
    { etiqueta: 'Efectivo y equivalentes', op: '', valor: p => D(p).efectivo },
    { etiqueta: 'Otros activos', op: '+', valor: p => D(p).activos - D(p).efectivo },
    { etiqueta: 'Total activos', op: '=', valor: p => D(p).activos, clase: 'is-total' },
    { etiqueta: 'Pasivos y capital', clase: 'is-section' },
    { etiqueta: 'Pasivos totales', op: '', valor: p => D(p).pasivos },
    { etiqueta: 'Capital contable', op: '+', valor: p => I(p).capital },
    { etiqueta: 'Total pasivo + capital', op: '=', valor: p => D(p).pasivos + I(p).capital, clase: 'is-total' },
    { etiqueta: 'Ecuación contable', op: '', tipo: 'texto', clase: 'is-check',
      valor: p => (D(p).activos === D(p).pasivos + I(p).capital ? { texto: '✓ cuadra', clase: 'ok' } : { texto: '✕ no cuadra', clase: 'neg' }) },
  ]);

  const F = p => calcularFlujo(p);
  const v = (p, campo) => (F(p).disponible ? F(p)[campo] : null);
  const hayEstimados = periodos().some(p => F(p).estimado);
  const filasFlujo = [
    { etiqueta: 'Efectivo inicial', op: '', valor: p => v(p, 'inicial') },
    { etiqueta: `Flujo de operación${hayEstimados ? ' *' : ''}`, op: '+', valor: p => v(p, 'operacion'), signo: true },
    { etiqueta: 'Flujo de inversión', op: '+', valor: p => v(p, 'inversion'), signo: true },
    { etiqueta: 'Flujo de financiamiento', op: '+', valor: p => v(p, 'financiamiento'), signo: true },
  ];
  if (hayEstimados) {
    filasFlujo.push({ etiqueta: 'Inversión + financiamiento (neto)', op: '+', valor: p => v(p, 'inversionFinanciamiento'), signo: true });
  }
  filasFlujo.push(
    { etiqueta: 'Variación neta del efectivo', op: '=', valor: p => v(p, 'variacionNeta'), clase: 'is-subtotal', signo: true },
    { etiqueta: 'Efectivo final', op: '', valor: p => D(p).efectivo, clase: 'is-total' },
  );
  construirTabla($('#tablaFlujo'), filasFlujo);

  $('#flujoNota').textContent = hayEstimados
    ? '* En periodos capturados por ti, el flujo de operación se estima igual a la utilidad neta y la diferencia restante se muestra como inversión + financiamiento (neto), porque el formulario no captura esos detalles.'
    : 'El efectivo inicial de un periodo es el efectivo final del periodo anterior. Positivo = entra dinero; negativo = sale dinero.';
}

/* ---- Ticker (cinta superior) ---- */
function renderTicker() {
  const d = datos[periodoActual];
  const ind = calcularIndicadores(d);
  const ant = periodoAnterior(periodoActual);
  const indAnt = ant ? calcularIndicadores(datos[ant]) : null;
  const dA = ant ? datos[ant] : null;

  const item = (sigla, valor, actual, previo) => {
    let cambio = '<span class="flat">—</span>';
    const vv = previo !== undefined ? variacion(actual, previo) : null;
    if (vv !== null) {
      const cls = vv > 0 ? 'up' : vv < 0 ? 'down' : 'flat';
      cambio = `<span class="${cls}">${vv > 0 ? '▲' : vv < 0 ? '▼' : '■'} ${Math.abs(vv * 100).toFixed(1)}%</span>`;
    }
    return `<span class="tick"><b>${sigla}</b><span class="v">${valor}</span>${cambio}</span>`;
  };

  const items = [
    `<span class="tick"><b>PERIODO</b><span class="v">FY${periodoActual}</span></span>`,
    item('ING', monedaCorta(d.ingresos), d.ingresos, dA?.ingresos),
    item('COS', monedaCorta(d.costos), d.costos, dA?.costos),
    item('GOP', monedaCorta(d.gastosOp), d.gastosOp, dA?.gastosOp),
    item('UTN', monedaCorta(ind.utilidad), ind.utilidad, indAnt?.utilidad),
    item('MRG', pct(ind.margenNeto), ind.margenNeto, indAnt?.margenNeto),
    item('ACT', monedaCorta(d.activos), d.activos, dA?.activos),
    item('PAS', monedaCorta(d.pasivos), d.pasivos, dA?.pasivos),
    item('CAP', monedaCorta(ind.capital), ind.capital, indAnt?.capital),
    item('EFE', monedaCorta(d.efectivo), d.efectivo, dA?.efectivo),
    `<span class="tick"><b>LIQ</b><span class="v">${veces(ind.liquidez)}</span></span>`,
    `<span class="tick"><b>END</b><span class="v">${pct(ind.endeudamiento)}</span></span>`,
    `<span class="tick"><b>DATOS</b><span class="v">FICTICIOS · DEMO EDUCATIVA</span></span>`,
  ].join('');
  // Se duplica el contenido para que el desplazamiento sea continuo
  $('#tickerTrack').innerHTML = items + items;
}

/* ---- Gráficas (Chart.js) ---- */
const COLORES = {
  ingresos: '#3987e5', gastos: '#d95926', apagado: '#3a3d42',
  texto: '#a8a69f', textoTenue: '#73767b', grid: '#1f2124', superficie: '#121315',
};
const hayChartJs = () => typeof window.Chart !== 'undefined';

function configurarChartJs() {
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = COLORES.texto;
  Chart.defaults.borderColor = COLORES.grid;
  Chart.defaults.animation.duration = reduceMotion ? 0 : 700;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'rectRounded';
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.boxHeight = 10;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Object.assign(Chart.defaults.plugins.tooltip, {
    backgroundColor: '#ede8dd', titleColor: '#0d0e0f', bodyColor: '#2a2b2e',
    borderColor: '#ede8dd', borderWidth: 1, padding: 12, cornerRadius: 10,
    titleFont: { weight: '600' }, bodySpacing: 6, usePointStyle: true, boxPadding: 6,
  });
}

function opcionesBase(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    layout: { padding: { top: 4, right: 12 } },
    plugins: {
      legend: { align: 'start', ...(extra.legend || {}) },
      tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${moneda(c.parsed.y)}`, ...(extra.tooltip || {}) } },
    },
    scales: {
      x: { grid: { display: false }, border: { color: COLORES.grid }, ticks: { color: COLORES.texto, font: { family: 'JetBrains Mono, monospace', size: 11 } } },
      y: { beginAtZero: true, grid: { color: COLORES.grid }, border: { display: false }, ticks: { color: COLORES.textoTenue, callback: v => monedaCorta(v), maxTicksLimit: 6 } },
    },
  };
}

function datosGraficas() {
  const ps = periodos();
  const ind = ps.map(p => calcularIndicadores(datos[p]));
  return {
    etiquetas: ps.map(String),
    ingresos: ps.map(p => datos[p].ingresos),
    gastos: ind.map(i => i.gastosTotales),
    utilidad: ind.map(i => i.utilidad),
    margen: ind.map(i => i.margenNeto),
    efectivo: ps.map(p => datos[p].efectivo),
    idxActual: ps.indexOf(periodoActual),
  };
}

const estiloBarra = { borderRadius: 4, borderSkipped: 'start', maxBarThickness: 34, categoryPercentage: 0.62, barPercentage: 0.86 };

function crearGraficaIngGas(canvas) {
  return new Chart(canvas, {
    type: 'bar',
    data: { labels: [], datasets: [
      { label: 'Ingresos', data: [], backgroundColor: COLORES.ingresos, hoverBackgroundColor: '#5a9bea', ...estiloBarra },
      { label: 'Gastos (costos + operativos)', data: [], backgroundColor: COLORES.gastos, hoverBackgroundColor: '#e2703f', ...estiloBarra },
    ] },
    options: opcionesBase({
      tooltip: { footer: items => `Diferencia (utilidad): ${moneda(items[0].parsed.y - (items[1] ? items[1].parsed.y : 0))}` },
    }),
  });
}

function crearGraficas() {
  if (!hayChartJs()) {
    ['chartDashIngGas', 'chartIngGas', 'chartUtilidad', 'chartEfectivo'].forEach(id => {
      const box = document.getElementById(id).parentElement;
      box.insertAdjacentHTML('beforeend', '<div class="chart-fallback">No se pudo cargar Chart.js (se requiere conexión a internet).<br>Los datos siguen disponibles en "Estados financieros".</div>');
    });
    return;
  }
  configurarChartJs();

  graficas.dash = crearGraficaIngGas($('#chartDashIngGas'));
  graficas.ingGas = crearGraficaIngGas($('#chartIngGas'));

  graficas.utilidad = new Chart($('#chartUtilidad'), {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Utilidad neta', data: [], backgroundColor: [], ...estiloBarra, categoryPercentage: 0.7 }] },
    options: opcionesBase({
      legend: { display: false },
      tooltip: { afterLabel: c => ` Margen neto: ${pct(datosGraficas().margen[c.dataIndex])}` },
    }),
  });

  graficas.efectivo = new Chart($('#chartEfectivo'), {
    type: 'line',
    data: { labels: [], datasets: [{
      label: 'Efectivo al cierre', data: [],
      borderColor: COLORES.ingresos, borderWidth: 2, tension: 0.35, cubicInterpolationMode: 'monotone', fill: true,
      backgroundColor: ctx => {
        const { chart } = ctx;
        if (!chart.chartArea) return 'rgba(57,135,229,.1)';
        const g = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
        g.addColorStop(0, 'rgba(57,135,229,.28)');
        g.addColorStop(1, 'rgba(57,135,229,0)');
        return g;
      },
      pointBackgroundColor: COLORES.ingresos, pointBorderColor: COLORES.superficie, pointBorderWidth: 2,
      pointRadius: [], pointHoverRadius: 7,
    }] },
    options: opcionesBase({ legend: { display: false } }),
  });
}

function actualizarGraficas() {
  if (!hayChartJs() || !graficas.dash) return;
  const g = datosGraficas();

  [graficas.dash, graficas.ingGas].forEach(ch => {
    ch.data.labels = g.etiquetas;
    ch.data.datasets[0].data = g.ingresos;
    ch.data.datasets[1].data = g.gastos;
    ch.update();
  });

  // Énfasis: el periodo seleccionado en azul, el resto en gris
  const u = graficas.utilidad;
  u.data.labels = g.etiquetas;
  u.data.datasets[0].data = g.utilidad;
  u.data.datasets[0].backgroundColor = g.etiquetas.map((_, i) => (i === g.idxActual ? COLORES.ingresos : COLORES.apagado));
  u.update();

  const e = graficas.efectivo;
  e.data.labels = g.etiquetas;
  e.data.datasets[0].data = g.efectivo;
  e.data.datasets[0].pointRadius = g.etiquetas.map((_, i) => (i === g.idxActual ? 6 : 4));
  e.update();
}

/* =========================================================
   6. FORMULARIO — Registrar información
   ========================================================= */
const CAMPOS = ['ingresos', 'costos', 'gastosOp', 'activos', 'pasivos', 'efectivo'];
const NOMBRES = { periodo: 'Periodo', ingresos: 'Ingresos', costos: 'Costos', gastosOp: 'Gastos operativos', activos: 'Activos', pasivos: 'Pasivos', efectivo: 'Efectivo' };

function leerFormulario() {
  const f = $('#finForm');
  const valores = { periodo: f.periodo.value.trim() === '' ? NaN : Number(f.periodo.value) };
  CAMPOS.forEach(c => { valores[c] = f[c].value.trim() === '' ? NaN : Number(f[c].value); });
  return valores;
}

function cargarEnFormulario(p) {
  const f = $('#finForm');
  f.periodo.value = p;
  CAMPOS.forEach(c => { f[c].value = datos[p][c]; });
  limpiarErrores();
  renderPreview();
}

/** Valida los datos y devuelve una lista de errores { campo, mensaje }. */
function validar(v) {
  const errores = [];
  if (!Number.isInteger(v.periodo) || v.periodo < 2020 || v.periodo > 2035) {
    errores.push({ campo: 'periodo', mensaje: 'El periodo debe ser un año entero entre 2020 y 2035.' });
  }
  CAMPOS.forEach(c => {
    if (!isFinite(v[c])) errores.push({ campo: c, mensaje: `${NOMBRES[c]}: escribe un número.` });
    else if (v[c] < 0) errores.push({ campo: c, mensaje: `${NOMBRES[c]}: no puede ser negativo.` });
  });
  if (isFinite(v.ingresos) && v.ingresos === 0) {
    errores.push({ campo: 'ingresos', mensaje: 'Ingresos: debe ser mayor que cero (el margen divide entre ingresos).' });
  }
  if (isFinite(v.efectivo) && isFinite(v.activos) && v.efectivo > v.activos) {
    errores.push({ campo: 'efectivo', mensaje: 'Efectivo: no puede ser mayor que los activos, porque el efectivo forma parte de los activos.' });
  }
  return errores;
}

function limpiarErrores() {
  $$('#finForm .field').forEach(el => el.classList.remove('has-error'));
  const box = $('#formErrors');
  box.hidden = true;
  box.innerHTML = '';
}

function mostrarErrores(errores) {
  limpiarErrores();
  errores.forEach(e => {
    const input = $(`#finForm [name="${e.campo}"]`);
    if (input) input.closest('.field').classList.add('has-error');
  });
  const box = $('#formErrors');
  box.innerHTML = `<strong>Revisa la información antes de procesarla:</strong><ul>${errores.map(e => `<li>${escapeHtml(e.mensaje)}</li>`).join('')}</ul>`;
  box.hidden = false;
  const primero = $(`#finForm [name="${errores[0].campo}"]`);
  if (primero) primero.focus();
}

/** Vista previa: aplica las mismas fórmulas a lo que se está escribiendo. */
function renderPreview() {
  const v = leerFormulario();
  const n = x => (isFinite(x) ? x : 0);
  const d = { ingresos: n(v.ingresos), costos: n(v.costos), gastosOp: n(v.gastosOp), activos: n(v.activos), pasivos: n(v.pasivos), efectivo: n(v.efectivo) };
  const ind = calcularIndicadores(d);
  const fila = (etiqueta, formula, valor, negativo) => `
    <div class="lp-row">
      <div><div class="lp-label">${etiqueta}</div><div class="lp-formula">${formula}</div></div>
      <div class="lp-value ${negativo ? 'neg' : ''}">${valor}</div>
    </div>`;
  $('#livePreview').innerHTML =
    fila('Utilidad', 'ingresos − costos − gastos', moneda(ind.utilidad), ind.utilidad < 0) +
    fila('Margen neto', 'utilidad ÷ ingresos', d.ingresos > 0 ? pct(ind.margenNeto) : '—', ind.margenNeto < 0) +
    fila('Capital', 'activos − pasivos', moneda(ind.capital), ind.capital < 0);
}

function renderBitacora() {
  const ul = $('#bitacora');
  if (!bitacora.length) {
    ul.innerHTML = '<li class="empty">Aún no has procesado información. Captura datos y presiona "Procesar información".</li>';
    return;
  }
  ul.innerHTML = bitacora.slice().reverse().map(r => `
    <li><time>${r.hora}</time><span>${escapeHtml(r.texto)}</span></li>`).join('');
}

const horaActual = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const esperar = ms => new Promise(r => setTimeout(r, reduceMotion ? 0 : ms));

function marcarPaso(n) {
  $$('.pipe-step').forEach(el => {
    const s = Number(el.dataset.step);
    el.classList.toggle('is-done', s < n);
    el.classList.toggle('is-active', s === n);
  });
}

async function procesarFormulario(evento) {
  evento.preventDefault();
  const boton = $('#btnProcesar');
  if (boton.disabled) return;

  // 1. Entrada
  const valores = leerFormulario();
  marcarPaso(1);
  await esperar(250);

  // 2. Validación
  marcarPaso(2);
  const errores = validar(valores);
  if (errores.length) {
    mostrarErrores(errores);
    marcarPaso(0);
    toast('Hay datos por corregir');
    return;
  }
  limpiarErrores();
  boton.disabled = true;
  await esperar(300);

  // 3. Proceso: se guardan los datos y se calculan indicadores
  marcarPaso(3);
  const p = valores.periodo;
  const existia = Boolean(datos[p]);
  datos[p] = { origen: 'usuario' };
  CAMPOS.forEach(c => { datos[p][c] = valores[c]; });
  const ind = calcularIndicadores(datos[p]);
  await esperar(350);

  // 4. Salida: se actualiza toda la interfaz
  marcarPaso(4);
  periodoActual = p;
  renderTodo({ resaltar: true });
  bitacora.push({
    hora: horaActual(),
    texto: `${existia ? 'Actualizado' : 'Creado'} periodo ${p} · utilidad ${moneda(ind.utilidad)} · margen ${pct(ind.margenNeto)}`,
  });
  renderBitacora();
  await esperar(350);
  marcarPaso(5); // todos completados

  boton.disabled = false;
  toast(`Periodo ${p} ${existia ? 'actualizado' : 'creado'} · dashboard actualizado`);
  await esperar(500);
  location.hash = '#dashboard';
  setTimeout(() => marcarPaso(0), 1200);
}

function restaurarEjemplo() {
  datos = clonarEjemplo();
  periodoActual = 2025;
  bitacora.push({ hora: horaActual(), texto: 'Se restauraron los datos de ejemplo' });
  renderTodo({ resaltar: true });
  cargarEnFormulario(periodoActual);
  renderBitacora();
  toast('Datos de ejemplo restaurados');
}

/* =========================================================
   7. REPORTE (vista preparada para impresión)
   ========================================================= */
function abrirReporte() {
  const p = periodoActual;
  const d = datos[p];
  const ind = calcularIndicadores(d);
  const ant = periodoAnterior(p);
  const indAnt = ant ? calcularIndicadores(datos[ant]) : null;
  const flujo = calcularFlujo(p);
  const fecha = new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });

  const vsAnt = (actual, previo) => {
    const v = variacion(actual, previo);
    return v === null ? '' : `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(1)}% vs ${ant}`;
  };

  const textoIngresos = ant
    ? `, ${variacion(d.ingresos, datos[ant].ingresos) >= 0 ? 'un aumento' : 'una disminución'} de ${pct(Math.abs(variacion(d.ingresos, datos[ant].ingresos)))} respecto a ${ant}`
    : '';

  const resumen = `Durante ${p}, la empresa demo registró ingresos por <strong>${moneda(d.ingresos)}</strong>${textoIngresos}.
    Después de costos por ${moneda(d.costos)} y gastos operativos por ${moneda(d.gastosOp)}, la utilidad neta fue de
    <strong>${moneda(ind.utilidad)}</strong>, equivalente a un margen neto de <strong>${pct(ind.margenNeto)}</strong>.
    Al cierre del periodo, los activos sumaron ${moneda(d.activos)} y los pasivos ${moneda(d.pasivos)}, por lo que el capital contable
    fue de <strong>${moneda(ind.capital)}</strong>. El efectivo disponible cerró en ${moneda(d.efectivo)}.`;

  const kpis = [
    ['Ingresos', moneda(d.ingresos), ant ? vsAnt(d.ingresos, datos[ant].ingresos) : ''],
    ['Utilidad neta', moneda(ind.utilidad), indAnt ? vsAnt(ind.utilidad, indAnt.utilidad) : ''],
    ['Margen neto', pct(ind.margenNeto), indAnt ? `${((ind.margenNeto - indAnt.margenNeto) * 100 >= 0 ? '+' : '−')}${Math.abs((ind.margenNeto - indAnt.margenNeto) * 100).toFixed(1)} pp vs ${ant}` : ''],
    ['Activos', moneda(d.activos), ant ? vsAnt(d.activos, datos[ant].activos) : ''],
    ['Pasivos', moneda(d.pasivos), ant ? vsAnt(d.pasivos, datos[ant].pasivos) : ''],
    ['Capital contable', moneda(ind.capital), indAnt ? vsAnt(ind.capital, indAnt.capital) : ''],
  ];

  const filaInd = (nombre, formula, valor, estado) => `
    <tr><td>${nombre}</td><td class="mono" style="text-align:left">${formula}</td><td>${valor}</td>
    <td>${estado ? `<span class="rp-status ${estado}">${ESTADOS[estado].texto}</span>` : '—'}</td></tr>`;

  $('#reportPaper').innerHTML = `
    <header class="rp-head">
      <div>
        <div class="rp-brand"><span class="brand-mark"><svg viewBox="0 0 24 24"><path d="M5 19V9M10 19V5M15 19v-7M20 19V8"/></svg></span>FinView</div>
        <h1 class="rp-title">Reporte financiero</h1>
        <div class="eyebrow" style="color:var(--paper-muted);margin-top:6px">Empresa demo · documento con datos ficticios</div>
      </div>
      <div class="rp-meta">
        Periodo analizado<strong>${p}</strong>
        Generado: ${escapeHtml(fecha)}<br>
        Origen de datos: ${d.origen === 'usuario' ? 'capturados por el usuario' : 'datos de ejemplo'}<br>
        ${ant ? `Comparativo: ${ant}` : 'Sin periodo comparativo'}
      </div>
    </header>

    <section class="rp-section">
      <h2>1 · Resumen financiero</h2>
      <p class="rp-summary">${resumen}</p>
      <div class="rp-kpis">${kpis.map(k => `<div class="rp-kpi"><span>${k[0]}</span><strong>${k[1]}</strong><small>${k[2] || '&nbsp;'}</small></div>`).join('')}</div>
    </section>

    <section class="rp-section">
      <h2>2 · Indicadores</h2>
      <div class="rp-table-wrap"><table class="rp-table">
        <thead><tr><th>Indicador</th><th style="text-align:left">Fórmula</th><th>Resultado</th><th>Semáforo</th></tr></thead>
        <tbody>
          ${filaInd('Utilidad', 'Ingresos − Costos − Gastos', moneda(ind.utilidad))}
          ${filaInd('Margen neto', 'Utilidad ÷ Ingresos', pct(ind.margenNeto), ind.semaforo.rentabilidad)}
          ${filaInd('Capital', 'Activos − Pasivos', moneda(ind.capital))}
          ${filaInd('Liquidez', 'Efectivo ÷ Pasivos', veces(ind.liquidez), ind.semaforo.liquidez)}
          ${filaInd('Endeudamiento', 'Pasivos ÷ Activos', pct(ind.endeudamiento), ind.semaforo.endeudamiento)}
        </tbody>
      </table></div>
    </section>

    <section class="rp-section">
      <h2>3 · Gráficas</h2>
      <div class="rp-charts">
        <div class="rp-chart"><h3>Ingresos vs gastos</h3><canvas id="rpChart1" width="760" height="400"></canvas></div>
        <div class="rp-chart"><h3>Evolución del efectivo</h3><canvas id="rpChart2" width="760" height="400"></canvas></div>
      </div>
    </section>

    <section class="rp-section rp-cols">
      <div>
        <h2>4 · Estado de resultados ${p}</h2>
        <table class="rp-table"><tbody>
          <tr><td>Ingresos</td><td>${moneda(d.ingresos)}</td></tr>
          <tr><td>− Costos</td><td>${moneda(d.costos)}</td></tr>
          <tr><td>= Utilidad bruta</td><td>${moneda(ind.utilidadBruta)}</td></tr>
          <tr><td>− Gastos operativos</td><td>${moneda(d.gastosOp)}</td></tr>
          <tr class="is-total"><td>= Utilidad neta</td><td>${moneda(ind.utilidad)}</td></tr>
        </tbody></table>
      </div>
      <div>
        <h2>5 · Balance general ${p}</h2>
        <table class="rp-table"><tbody>
          <tr><td>Efectivo</td><td>${moneda(d.efectivo)}</td></tr>
          <tr><td>Otros activos</td><td>${moneda(d.activos - d.efectivo)}</td></tr>
          <tr class="is-total"><td>Total activos</td><td>${moneda(d.activos)}</td></tr>
          <tr><td>Pasivos</td><td>${moneda(d.pasivos)}</td></tr>
          <tr><td>Capital contable</td><td>${moneda(ind.capital)}</td></tr>
          <tr class="is-total"><td>Pasivo + capital</td><td>${moneda(d.pasivos + ind.capital)}</td></tr>
        </tbody></table>
      </div>
    </section>

    ${flujo.disponible ? `
    <section class="rp-section">
      <h2>6 · Flujo de efectivo ${p}</h2>
      <table class="rp-table"><tbody>
        <tr><td>Efectivo inicial</td><td>${moneda(flujo.inicial)}</td></tr>
        <tr><td>+ Flujo de operación${flujo.estimado ? ' (estimado)' : ''}</td><td>${moneda(flujo.operacion)}</td></tr>
        ${flujo.estimado
          ? `<tr><td>+ Inversión + financiamiento (neto)</td><td>${moneda(flujo.inversionFinanciamiento)}</td></tr>`
          : `<tr><td>+ Flujo de inversión</td><td>${moneda(flujo.inversion)}</td></tr><tr><td>+ Flujo de financiamiento</td><td>${moneda(flujo.financiamiento)}</td></tr>`}
        <tr class="is-total"><td>Efectivo final</td><td>${moneda(flujo.final)}</td></tr>
      </tbody></table>
    </section>` : ''}

    <footer class="rp-foot">
      Documento generado automáticamente por FinView, una demostración educativa. Todas las cifras son ficticias.
      Este reporte es descriptivo: no constituye asesoría financiera ni recomendación de inversión. Los umbrales del semáforo son ilustrativos.
      Simplificación: la utilidad neta se calcula como ingresos − costos − gastos operativos (sin intereses ni impuestos).
    </footer>`;

  $('#reportOverlay').hidden = false;
  document.body.classList.add('no-scroll');
  tituloPrevio = document.title;
  document.title = `Reporte financiero ${p} · FinView`; // nombre sugerido al guardar como PDF
  $('#reportOverlay').scrollTop = 0;
  dibujarGraficasReporte();
  $('#btnPrint').focus();
}

/** Gráficas del reporte con colores para papel claro; se convierten en imagen para imprimir bien. */
function dibujarGraficasReporte() {
  if (!hayChartJs()) {
    $$('.rp-chart canvas').forEach(c => c.replaceWith(Object.assign(document.createElement('p'), { textContent: 'Gráfica no disponible sin conexión.' })));
    return;
  }
  const g = datosGraficas();
  const base = {
    responsive: false, animation: false, devicePixelRatio: 2,
    plugins: { legend: { align: 'start', labels: { color: '#3a3b3e', usePointStyle: true, pointStyle: 'rectRounded', boxWidth: 10, boxHeight: 10, font: { size: 18 } } }, tooltip: { enabled: false } },
    scales: {
      x: { grid: { display: false }, border: { color: '#cfc8ba' }, ticks: { color: '#3a3b3e', font: { size: 18 } } },
      y: { beginAtZero: true, grid: { color: '#e4dfd4' }, border: { display: false }, ticks: { color: '#6b6a66', font: { size: 16 }, callback: v => monedaCorta(v), maxTicksLimit: 5 } },
    },
  };
  const convertir = (canvas, config) => {
    const ch = new Chart(canvas, config);
    const img = new Image();
    img.alt = canvas.parentElement.querySelector('h3').textContent;
    img.src = ch.toBase64Image('image/png', 1);
    ch.destroy();
    canvas.replaceWith(img);
  };
  convertir($('#rpChart1'), {
    type: 'bar',
    data: { labels: g.etiquetas, datasets: [
      { label: 'Ingresos', data: g.ingresos, backgroundColor: '#2a78d6', ...estiloBarra, maxBarThickness: 60 },
      { label: 'Gastos', data: g.gastos, backgroundColor: '#eb6834', ...estiloBarra, maxBarThickness: 60 },
    ] },
    options: base,
  });
  convertir($('#rpChart2'), {
    type: 'line',
    data: { labels: g.etiquetas, datasets: [{
      label: 'Efectivo al cierre', data: g.efectivo, borderColor: '#2a78d6', borderWidth: 4, tension: 0.35, cubicInterpolationMode: 'monotone',
      pointRadius: g.etiquetas.map((_, i) => (i === g.idxActual ? 9 : 6)), pointBackgroundColor: '#2a78d6', pointBorderColor: '#fbf9f4', pointBorderWidth: 3,
      fill: true, backgroundColor: 'rgba(42,120,214,.12)',
    }] },
    options: { ...base, plugins: { ...base.plugins, legend: { display: false } } },
  });
}

let tituloPrevio = document.title;
function cerrarReporte() {
  $('#reportOverlay').hidden = true;
  document.title = tituloPrevio;
  document.body.classList.remove('no-scroll');
  $('#reportBtn').focus();
}

/* =========================================================
   8. NAVEGACIÓN E INICIO
   ========================================================= */
const VISTAS = ['dashboard', 'estados', 'graficas', 'indicadores', 'registrar'];

function irA(vista) {
  if (!VISTAS.includes(vista)) vista = 'dashboard';
  $$('.view').forEach(v => v.classList.toggle('is-active', v.id === `view-${vista}`));
  $$('.nav-item').forEach(a => {
    if (a.dataset.view === vista) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const titulo = $(`#view-${vista}`).dataset.title;
  $('#viewTitle').textContent = titulo;
  $('#viewEyebrow').textContent = `FinView / ${titulo}`;
  document.title = `${titulo} · FinView`;
  cerrarMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Las gráficas se recalculan al hacerse visibles (Chart.js necesita medir su contenedor)
  Object.values(graficas).forEach(ch => ch.resize());
  if (vista === 'estados') moverIndicadorTab();
}

/* ---- Menú móvil ---- */
function abrirMenu() {
  $('#sidebar').classList.add('is-open');
  $('#sidebarBackdrop').hidden = false;
  $('#menuBtn').setAttribute('aria-expanded', 'true');
}
function cerrarMenu() {
  $('#sidebar').classList.remove('is-open');
  $('#sidebarBackdrop').hidden = true;
  $('#menuBtn').setAttribute('aria-expanded', 'false');
}

/* ---- Pestañas ---- */
function activarTab(nombre) {
  $$('.tab').forEach(t => {
    const activa = t.dataset.tab === nombre;
    t.setAttribute('aria-selected', activa);
    t.tabIndex = activa ? 0 : -1;
  });
  $$('.tab-panel').forEach(panel => {
    const activa = panel.id === `panel-${nombre}`;
    panel.hidden = !activa;
    panel.classList.toggle('is-active', activa);
  });
  moverIndicadorTab();
}
function moverIndicadorTab() {
  const activa = $('.tab[aria-selected="true"]');
  const ind = $('.tab-indicator');
  if (!activa || !ind) return;
  ind.style.left = `${activa.offsetLeft}px`;
  ind.style.width = `${activa.offsetWidth}px`;
}

/* ---- Toast ---- */
let toastTimer;
function toast(mensaje) {
  const el = $('#toast');
  el.textContent = mensaje;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2800);
}

/* ---- Eventos ---- */
function conectarEventos() {
  // Selector de periodo (delegación de eventos)
  $('#periodSelector').addEventListener('click', e => {
    const b = e.target.closest('[data-periodo]');
    if (b) seleccionarPeriodo(Number(b.dataset.periodo));
  });

  // Navegación por hash (#dashboard, #estados…) — también funciona el botón "atrás"
  window.addEventListener('hashchange', () => irA(location.hash.slice(1)));

  $$('.nav-item').forEach(a => a.addEventListener('click', cerrarMenu));
  $('#menuBtn').addEventListener('click', abrirMenu);
  $('#sidebarBackdrop').addEventListener('click', cerrarMenu);

  // Pestañas (clic y flechas del teclado)
  $$('.tab').forEach(t => t.addEventListener('click', () => activarTab(t.dataset.tab)));
  $('.tabs').addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const tabs = $$('.tab');
    const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    activarTab(sig.dataset.tab);
    sig.focus();
  });
  window.addEventListener('resize', moverIndicadorTab);

  // Formulario
  $('#finForm').addEventListener('submit', procesarFormulario);
  $('#finForm').addEventListener('input', e => {
    renderPreview();
    e.target.closest('.field')?.classList.remove('has-error');
  });
  $('#btnCargar').addEventListener('click', () => { cargarEnFormulario(periodoActual); toast(`Valores de ${periodoActual} cargados en el formulario`); });
  $('#btnReset').addEventListener('click', restaurarEjemplo);

  // Reporte
  $('#reportBtn').addEventListener('click', abrirReporte);
  $('#btnCloseReport').addEventListener('click', cerrarReporte);
  $('#btnPrint').addEventListener('click', () => window.print());
  $('#reportOverlay').addEventListener('click', e => { if (e.target.id === 'reportOverlay') cerrarReporte(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!$('#reportOverlay').hidden) cerrarReporte();
    else cerrarMenu();
  });
}

/* ---- Inicio ---- */
function iniciar() {
  datos = clonarEjemplo();
  construirKpis();
  crearGraficas();
  conectarEventos();
  renderTodo();
  cargarEnFormulario(periodoActual);
  renderBitacora();
  irA(location.hash.slice(1) || 'dashboard');
  activarTab('resultados');
}

document.addEventListener('DOMContentLoaded', iniciar);
