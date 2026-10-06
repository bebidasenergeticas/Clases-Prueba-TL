# Clases-Prueba-TL

## FinView — Centro de Información Financiera

Demo educativa: una web app que **recibe** datos financieros, los **procesa** con JavaScript y los **convierte** en información útil (KPIs, estados financieros, gráficas, semáforo y reporte imprimible).

> Todos los datos son **ficticios**. No hay backend, login ni base de datos: la información vive en memoria y se restaura al recargar la página.

### Cómo abrirla

Abre `index.html` en el navegador (doble clic) o sirve la carpeta:

```bash
python3 -m http.server 8000   # luego visita http://localhost:8000
```

Las gráficas usan Chart.js desde CDN, así que necesitan conexión a internet. Si no hay conexión, el resto de la app sigue funcionando y aparece un aviso en lugar de cada gráfica.

### Estructura

| Archivo | Rol |
|---|---|
| `index.html` | **Frontend**: estructura de la interfaz (sidebar, dashboard, pestañas, formulario, reporte) |
| `styles.css` | **Diseño**: tema grafito / blanco hueso, tablas, animaciones, responsive y estilos de impresión |
| `script.js` | **Datos + lógica**: datos ficticios (`DATOS_EJEMPLO`), fórmulas, render, gráficas, formulario y reporte |

### Fórmulas que calcula JavaScript

| Indicador | Fórmula |
|---|---|
| Utilidad | Ingresos − Costos − Gastos operativos |
| Margen neto | Utilidad ÷ Ingresos |
| Capital | Activos − Pasivos |
| Liquidez (semáforo) | Efectivo ÷ Pasivos |
| Endeudamiento (semáforo) | Pasivos ÷ Activos |

Los umbrales del semáforo son ilustrativos (no son un estándar contable ni una recomendación de inversión). Simplificación: la utilidad neta no descuenta intereses ni impuestos.
