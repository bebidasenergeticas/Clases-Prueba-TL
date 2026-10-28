// Datos 100 % ficticios del caso práctico. Son la única fuente de cifras para
// las diapositivas 8, 9, 10 y 14, el guion y el prompt de referencia.

export const COMPANY = 'Comercializadora Nébula';
export const COMPANY_FULL = 'Comercializadora Nébula, S.A. de C.V. (empresa ficticia)';
export const PERIOD = 'enero–junio 2026';

export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
export const MONTHS_LONG = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
export const MONTH_END = ['31/01/2026', '28/02/2026', '31/03/2026', '30/04/2026', '31/05/2026', '30/06/2026'];

// Movimientos por mes (MXN, montos siempre positivos; el Tipo define el signo).
export const MOVEMENTS = {
  ingresos: {
    'Ventas mostrador': [260000, 235000, 280000, 300000, 287000, 310000],
    'Ventas en línea': [160000, 150000, 180000, 198000, 185000, 205000],
  },
  egresos: {
    'Nómina': [150000, 150000, 155000, 155000, 160000, 160000],
    'Proveedores': [125000, 113000, 150000, 172000, 153000, 172000],
    'Renta y servicios': [35000, 35000, 37000, 38000, 38000, 40000],
  },
};

const sumCols = (groups) =>
  MONTHS.map((_, i) => Object.values(groups).reduce((acc, row) => acc + row[i], 0));

export const INGRESOS = sumCols(MOVEMENTS.ingresos); // [420000, 385000, 460000, 498000, 472000, 515000]
export const EGRESOS = sumCols(MOVEMENTS.egresos); // [310000, 298000, 342000, 365000, 351000, 372000]
export const FLUJO = INGRESOS.map((v, i) => v - EGRESOS[i]);

export const sum = (a) => a.reduce((x, y) => x + y, 0);

export const TOTALS = {
  ingresos: sum(INGRESOS), // 2,750,000
  egresos: sum(EGRESOS), // 2,038,000
  flujo: sum(FLUJO), // 712,000
};

// Simulación de la diapositiva 9: se edita «Proveedores» de junio y se guarda el archivo.
export const SIM = {
  concept: 'Proveedores',
  monthIndex: 5,
  from: 172000,
  to: 202000,
};
SIM.delta = SIM.to - SIM.from; // +30,000
SIM.egresosJunFrom = EGRESOS[5]; // 372,000
SIM.egresosJunTo = EGRESOS[5] + SIM.delta; // 402,000
SIM.flujoJunFrom = FLUJO[5]; // 143,000
SIM.flujoJunTo = FLUJO[5] - SIM.delta; // 113,000
SIM.egresosTotalTo = TOTALS.egresos + SIM.delta; // 2,068,000
SIM.flujoTotalTo = TOTALS.flujo - SIM.delta; // 682,000

// Error de la diapositiva 10: egresos capturados con signo negativo y restados otra vez.
export const BUG = {
  shown: TOTALS.ingresos - -TOTALS.egresos, // 4,788,000
  expected: TOTALS.ingresos - TOTALS.egresos, // 712,000
};

// Formato es-MX determinista (separador de miles con coma).
export const fmt = (n) => {
  const s = Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (n < 0 ? '−' : '') + s;
};
export const money = (n) => (n < 0 ? '−$' : '$') + fmt(Math.abs(n));

// Comprobaciones que el build ejecuta antes de generar la presentación.
export function verifyData() {
  const expect = (label, got, want) => {
    if (got !== want) throw new Error(`Dato inconsistente: ${label} = ${got}, se esperaba ${want}`);
  };
  expect('Ingresos totales', TOTALS.ingresos, 2750000);
  expect('Egresos totales', TOTALS.egresos, 2038000);
  expect('Flujo neto total', TOTALS.flujo, 712000);
  expect('Flujo neto = suma mensual', sum(FLUJO), TOTALS.ingresos - TOTALS.egresos);
  expect('Ingresos mensuales', INGRESOS.join(), '420000,385000,460000,498000,472000,515000');
  expect('Egresos mensuales', EGRESOS.join(), '310000,298000,342000,365000,351000,372000');
  expect('Flujo mensual', FLUJO.join(), '110000,87000,118000,133000,121000,143000');
  expect('Proveedores junio', MOVEMENTS.egresos['Proveedores'][5], SIM.from);
  expect('Egresos junio simulados', SIM.egresosJunTo, 402000);
  expect('Flujo junio simulado', SIM.flujoJunTo, 113000);
  expect('Egresos totales simulados', SIM.egresosTotalTo, 2068000);
  expect('Flujo total simulado', SIM.flujoTotalTo, 682000);
  expect('Flujo total simulado (recalculado)', TOTALS.ingresos - SIM.egresosTotalTo, 682000);
  expect('Error de signo', BUG.shown, 4788000);
  return true;
}
