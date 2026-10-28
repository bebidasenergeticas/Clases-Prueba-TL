# Prompt de referencia · Dashboard financiero empresarial

**Clase:** Vibe Coding · Inteligencia Artificial y Automatización con n8n · Top Learning
**Uso:** práctica guiada de la diapositiva 14. Todos los datos son **ficticios** (Comercializadora Nébula, empresa ficticia).

> Este documento es material de apoyo elaborado para la clase; no es una política ni un requisito institucional. Ajusta el stack sugerido si la herramienta que uses propone otro, siempre que se cumplan los criterios de validación.

---

## 1 · Antes de empezar: ¿qué herramienta conviene?

| Herramienta | ¿Puede leer un Excel guardado en tu computadora? | Recomendación para este ejercicio |
|---|---|---|
| Agentes de código que trabajan en tu equipo (Claude Code, Codex CLI, OpenCode) o editor con IA (Cursor) | **Sí**: crean y ejecutan un backend local que lee el archivo. | ✔ Recomendado |
| Constructores web en la nube (Lovable, Bolt, v0) | **No directamente**: la app corre en la nube y no ve tus archivos locales. | Solo si subes el archivo manualmente o usas una hoja en la nube (Google Sheets o Excel en OneDrive) con su API, lo cual requiere credenciales y más configuración. |

## 2 · Prepara el Excel ficticio

Crea `movimientos.xlsx` con una hoja llamada `Movimientos` y estas columnas en la fila 1: **Fecha · Concepto · Tipo · Monto**.
El **Monto siempre es positivo**; el **Tipo** (Ingreso o Egreso) define si suma o resta.

Opción rápida: copia el bloque CSV, pégalo en Excel (Datos → Texto en columnas, separador «coma») y guarda como `.xlsx`. También puedes pedirle a la IA que genere el archivo con estos datos.

<details><summary>Datos completos (30 movimientos)</summary>

| Fila | Fecha | Concepto | Tipo | Monto |
|---:|---|---|---|---:|
| 2 | 31/01/2026 | Ventas mostrador | Ingreso | 260,000 |
| 3 | 31/01/2026 | Ventas en línea | Ingreso | 160,000 |
| 4 | 31/01/2026 | Nómina | Egreso | 150,000 |
| 5 | 31/01/2026 | Proveedores | Egreso | 125,000 |
| 6 | 31/01/2026 | Renta y servicios | Egreso | 35,000 |
| 7 | 28/02/2026 | Ventas mostrador | Ingreso | 235,000 |
| 8 | 28/02/2026 | Ventas en línea | Ingreso | 150,000 |
| 9 | 28/02/2026 | Nómina | Egreso | 150,000 |
| 10 | 28/02/2026 | Proveedores | Egreso | 113,000 |
| 11 | 28/02/2026 | Renta y servicios | Egreso | 35,000 |
| 12 | 31/03/2026 | Ventas mostrador | Ingreso | 280,000 |
| 13 | 31/03/2026 | Ventas en línea | Ingreso | 180,000 |
| 14 | 31/03/2026 | Nómina | Egreso | 155,000 |
| 15 | 31/03/2026 | Proveedores | Egreso | 150,000 |
| 16 | 31/03/2026 | Renta y servicios | Egreso | 37,000 |
| 17 | 30/04/2026 | Ventas mostrador | Ingreso | 300,000 |
| 18 | 30/04/2026 | Ventas en línea | Ingreso | 198,000 |
| 19 | 30/04/2026 | Nómina | Egreso | 155,000 |
| 20 | 30/04/2026 | Proveedores | Egreso | 172,000 |
| 21 | 30/04/2026 | Renta y servicios | Egreso | 38,000 |
| 22 | 31/05/2026 | Ventas mostrador | Ingreso | 287,000 |
| 23 | 31/05/2026 | Ventas en línea | Ingreso | 185,000 |
| 24 | 31/05/2026 | Nómina | Egreso | 160,000 |
| 25 | 31/05/2026 | Proveedores | Egreso | 153,000 |
| 26 | 31/05/2026 | Renta y servicios | Egreso | 38,000 |
| 27 | 30/06/2026 | Ventas mostrador | Ingreso | 310,000 |
| 28 | 30/06/2026 | Ventas en línea | Ingreso | 205,000 |
| 29 | 30/06/2026 | Nómina | Egreso | 160,000 |
| 30 | 30/06/2026 | Proveedores | Egreso | 172,000 |
| 31 | 30/06/2026 | Renta y servicios | Egreso | 40,000 |

</details>

```csv
Fecha,Concepto,Tipo,Monto
31/01/2026,Ventas mostrador,Ingreso,260000
31/01/2026,Ventas en línea,Ingreso,160000
31/01/2026,Nómina,Egreso,150000
31/01/2026,Proveedores,Egreso,125000
31/01/2026,Renta y servicios,Egreso,35000
28/02/2026,Ventas mostrador,Ingreso,235000
28/02/2026,Ventas en línea,Ingreso,150000
28/02/2026,Nómina,Egreso,150000
28/02/2026,Proveedores,Egreso,113000
28/02/2026,Renta y servicios,Egreso,35000
31/03/2026,Ventas mostrador,Ingreso,280000
31/03/2026,Ventas en línea,Ingreso,180000
31/03/2026,Nómina,Egreso,155000
31/03/2026,Proveedores,Egreso,150000
31/03/2026,Renta y servicios,Egreso,37000
30/04/2026,Ventas mostrador,Ingreso,300000
30/04/2026,Ventas en línea,Ingreso,198000
30/04/2026,Nómina,Egreso,155000
30/04/2026,Proveedores,Egreso,172000
30/04/2026,Renta y servicios,Egreso,38000
31/05/2026,Ventas mostrador,Ingreso,287000
31/05/2026,Ventas en línea,Ingreso,185000
31/05/2026,Nómina,Egreso,160000
31/05/2026,Proveedores,Egreso,153000
31/05/2026,Renta y servicios,Egreso,38000
30/06/2026,Ventas mostrador,Ingreso,310000
30/06/2026,Ventas en línea,Ingreso,205000
30/06/2026,Nómina,Egreso,160000
30/06/2026,Proveedores,Egreso,172000
30/06/2026,Renta y servicios,Egreso,40000
```

**Valores de control (deben coincidir con tu dashboard):**

| Mes | Ingresos | Egresos | Flujo neto |
|---|---:|---:|---:|
| Enero | 420,000 | 310,000 | 110,000 |
| Febrero | 385,000 | 298,000 | 87,000 |
| Marzo | 460,000 | 342,000 | 118,000 |
| Abril | 498,000 | 365,000 | 133,000 |
| Mayo | 472,000 | 351,000 | 121,000 |
| Junio | 515,000 | 372,000 | 143,000 |
| **Total** | **2,750,000** | **2,038,000** | **712,000** |

## 3 · Prompt (cópialo completo)

```text
Actúa como desarrollador full-stack y como mi tutor. Quiero construir, en mi computadora, un dashboard financiero web que lea un archivo de Excel local y se actualice cuando guardo cambios en ese archivo. Soy principiante: explícame cada paso y cómo ejecutarlo.

USUARIO
Dirección de finanzas de una pyme, sin conocimientos técnicos.

OBJETIVO
Ver ingresos, egresos y flujo neto por mes (enero–junio 2026) y los totales del periodo.

DATOS
- Archivo: movimientos.xlsx, en la carpeta del proyecto, hoja «Movimientos».
- Columnas (fila 1 = encabezados): Fecha (dd/mm/aaaa) | Concepto | Tipo (Ingreso o Egreso) | Monto (número positivo, MXN).
- Convención de signos: el Monto SIEMPRE es positivo y el Tipo define si suma o resta. Si encuentras un monto negativo, vacío o un Tipo distinto, no lo calcules en silencio: muéstralo como advertencia.
- Si el archivo no existe, créalo con los DATOS DE EJEMPLO (CSV) que aparecen al final de este mensaje, respetando el orden de las filas.

FUNCIONES
1. Backend local en Python 3 con Flask y openpyxl que vuelva a leer el archivo en cada solicitud y calcule por mes: ingresos, egresos y flujo neto (ingresos − egresos), además de los totales.
2. Endpoint GET /api/resumen que devuelva JSON con: meses (lista), totales, leido_en (hora de la lectura) y advertencias (lista).
3. Frontend (HTML, CSS y JavaScript) servido por el mismo backend en http://127.0.0.1:8000 con: tres indicadores (Ingresos, Egresos, Flujo neto), gráfica mensual de barras de ingresos y egresos con una línea de flujo neto, y el texto «Última lectura: hh:mm:ss».
4. Actualización: el frontend consulta /api/resumen cada 5 segundos. Al guardar el Excel, el cambio debe verse en 10 segundos o menos, sin recargar la página.
5. Si el archivo está bloqueado o a medio guardar, conserva los últimos datos válidos y muestra un aviso discreto; nunca muestres ceros por error.

DISEÑO
Fondo oscuro (#101C27), texto marfil (#F3F0E5), acento verde lima (#C8EC88) para el flujo neto, tipografía grande y legible en una videollamada. Cantidades con formato $2,750,000.

RESTRICCIONES
- Solo lectura del Excel: la aplicación nunca lo modifica.
- Datos ficticios. Ninguna clave, contraseña ni servicio externo.
- Debe funcionar solo en mi computadora (127.0.0.1) y con el mínimo de dependencias. Lista las dependencias y el comando exacto para instalarlas.

CRITERIOS DE VALIDACIÓN (obligatorios)
- Con los datos de ejemplo: Ingresos = 2,750,000; Egresos = 2,038,000; Flujo neto = 712,000.
- Junio: Ingresos = 515,000; Egresos = 372,000; Flujo neto = 143,000.
- Si cambio Proveedores de junio de 172,000 a 202,000 y guardo: Egresos = 2,068,000; Flujo neto = 682,000; flujo de junio = 113,000.
- Incluye un script prueba_totales.py que lea el Excel de ejemplo y compruebe automáticamente los totales esperados.

FORMA DE TRABAJO
1. Antes de escribir código, muéstrame un plan breve (qué archivos crearás y para qué sirve cada uno) y espera mi confirmación.
2. Después crea los archivos, instala las dependencias y ejecuta la prueba.
3. Al final dime cómo iniciar y detener la aplicación, y cómo verificar cada criterio de validación paso a paso.

DATOS DE EJEMPLO (CSV)
Fecha,Concepto,Tipo,Monto
31/01/2026,Ventas mostrador,Ingreso,260000
31/01/2026,Ventas en línea,Ingreso,160000
31/01/2026,Nómina,Egreso,150000
31/01/2026,Proveedores,Egreso,125000
31/01/2026,Renta y servicios,Egreso,35000
28/02/2026,Ventas mostrador,Ingreso,235000
28/02/2026,Ventas en línea,Ingreso,150000
28/02/2026,Nómina,Egreso,150000
28/02/2026,Proveedores,Egreso,113000
28/02/2026,Renta y servicios,Egreso,35000
31/03/2026,Ventas mostrador,Ingreso,280000
31/03/2026,Ventas en línea,Ingreso,180000
31/03/2026,Nómina,Egreso,155000
31/03/2026,Proveedores,Egreso,150000
31/03/2026,Renta y servicios,Egreso,37000
30/04/2026,Ventas mostrador,Ingreso,300000
30/04/2026,Ventas en línea,Ingreso,198000
30/04/2026,Nómina,Egreso,155000
30/04/2026,Proveedores,Egreso,172000
30/04/2026,Renta y servicios,Egreso,38000
31/05/2026,Ventas mostrador,Ingreso,287000
31/05/2026,Ventas en línea,Ingreso,185000
31/05/2026,Nómina,Egreso,160000
31/05/2026,Proveedores,Egreso,153000
31/05/2026,Renta y servicios,Egreso,38000
30/06/2026,Ventas mostrador,Ingreso,310000
30/06/2026,Ventas en línea,Ingreso,205000
30/06/2026,Nómina,Egreso,160000
30/06/2026,Proveedores,Egreso,172000
30/06/2026,Renta y servicios,Egreso,40000
```

## 4 · Prueba de actualización (pasos 4 a 6 del ejercicio)

1. Con la app abierta, anota los indicadores: Egresos **2,038,000**, Flujo neto **712,000**.
2. En Excel, cambia la celda **D30** (Proveedores, junio) de **172,000** a **202,000**.
3. **Guarda** el archivo (Ctrl + S). Escribir la cifra sin guardar no cambia nada.
4. Espera la siguiente lectura (≤ 10 s) y comprueba: Egresos **2,068,000**, Flujo neto **682,000**, flujo de junio **113,000**.
5. Verifica a mano: 2,750,000 − 2,068,000 = 682,000.

**Evidencia de aprendizaje**

| | Antes | Después |
|---|---:|---:|
| Celda modificada | 172,000 | 202,000 |
| Egresos totales | 2,038,000 | 2,068,000 |
| Flujo neto | 712,000 | 682,000 |
| Cálculo de verificación | | 2,750,000 − 2,068,000 = 682,000 |

Adjunta una captura del dashboard antes y otra después.

## 5 · Errores frecuentes

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| Cambié la cifra y el dashboard no cambia | No guardaste, o el backend lee otro archivo u otra ruta | Guarda; pide a la IA que muestre en pantalla la ruta completa del archivo que lee |
| El flujo neto es enorme (por ejemplo, 4,788,000) | Egresos capturados con signo negativo y restados otra vez | Montos siempre positivos; revisa la columna Tipo |
| Algunos montos no suman | Celdas con formato de texto o con «$» escrito a mano | Convierte la columna Monto a número |
| Error al leer el archivo mientras Excel está abierto | Bloqueo temporal al guardar o archivo sincronizándose (OneDrive) | El backend debe reintentar y conservar los últimos datos válidos; usa una copia local, no «solo en línea» |
| «ModuleNotFoundError: flask» | Dependencias instaladas en otro entorno de Python | Ejecuta el comando de instalación que indicó la IA en la misma terminal donde corres la app |
| «Address already in use» | El puerto 8000 ya está ocupado | Detén la otra app o pide usar otro puerto |
| El dashboard se ve bien pero los números no coinciden | Error de lógica | Compara con la tabla de valores de control y corre `prueba_totales.py` |

## 6 · Para ir más lejos (opcional)

- Vigilancia del archivo (por ejemplo, con la biblioteca `watchdog`) en lugar de consultar cada 5 s.
- Filtro por mes y exportación del resumen a CSV.
- Automatizar con n8n un aviso cuando el flujo neto mensual sea negativo.
