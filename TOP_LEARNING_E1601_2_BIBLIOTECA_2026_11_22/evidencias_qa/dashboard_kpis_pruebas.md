# Evidencia QA — Kit dashboard: KPIs y pruebas

> SIMULACIÓN ACADÉMICA — datos ficticios generados con semilla fija (`generar_excel.py`, catálogo tomado de `kit_referencia/menu_demo.json`).

- Fecha de ejecución: 23/11/2026 · Entorno: Linux, Python 3.13.18 (no se probó en Windows; el bloqueo de archivo se SIMULA con PermissionError)
- Versiones: fastapi 0.165.0 · httpx 0.28.1 · openpyxl 3.1.5 · pandas 3.1.1 · pytest 9.2.0 · python-dotenv 1.2.4 · uvicorn 0.54.0 · 
- Comando: `pytest -v` en `fuentes_editables/kit_referencia/dashboard`

## Valores reales de los KPIs (archivo DEMO, sin filtros; 403 líneas de venta)

```json
{
 "ventas_totales": 116860.0,
 "pedidos": 154,
 "ticket_promedio": 758.83,
 "unidades_vendidas": 688,
 "costos": 39921.0,
 "utilidad_bruta": 76939.0,
 "margen_bruto": 0.6584,
 "crecimiento_mensual": {
  "valor": -0.1776,
  "mes_actual": "2026-03",
  "mes_anterior": "2026-02",
  "nota": null
 },
 "top_productos": [
  {
   "producto": "Agua mineral con limón",
   "unidades": 48,
   "ventas": 1920.0
  },
  {
   "producto": "Tacos de hongos y rajas",
   "unidades": 47,
   "ventas": 6345.0
  },
  {
   "producto": "Tostadas de atún",
   "unidades": 46,
   "ventas": 6670.0
  },
  {
   "producto": "Pulpo a la parrilla",
   "unidades": 43,
   "ventas": 13760.0
  },
  {
   "producto": "Tacos de pescado",
   "unidades": 42,
   "ventas": 6510.0
  }
 ],
 "cumplimiento_metas": {
  "comparable": true,
  "por_mes": [
   {
    "mes": "2026-01",
    "ventas_real": 28420.0,
    "meta_ventas": 32000.0,
    "cumplimiento_ventas": 0.8881,
    "pedidos_real": 39,
    "meta_pedidos": 40,
    "cumplimiento_pedidos": 0.975,
    "utilidad_real": 18749.0,
    "meta_utilidad_bruta": 20000.0,
    "cumplimiento_utilidad": 0.9375
   },
   {
    "mes": "2026-02",
    "ventas_real": 48530.0,
    "meta_ventas": 45000.0,
    "cumplimiento_ventas": 1.0784,
    "pedidos_real": 58,
    "meta_pedidos": 55,
    "cumplimiento_pedidos": 1.0545,
    "utilidad_real": 31813.0,
    "meta_utilidad_bruta": 29000.0,
    "cumplimiento_utilidad": 1.097
   },
   {
    "mes": "2026-03",
    "ventas_real": 39910.0,
    "meta_ventas": 44000.0,
    "cumplimiento_ventas": 0.907,
    "pedidos_real": 57,
    "meta_pedidos": 60,
    "cumplimiento_pedidos": 0.95,
    "utilidad_real": 26377.0,
    "meta_utilidad_bruta": 28000.0,
    "cumplimiento_utilidad": 0.942
   }
  ],
  "total": {
   "ventas_real": 116860.0,
   "meta_ventas": 121000.0,
   "cumplimiento_ventas": 0.9658
  },
  "nota": null
 },
 "excluidas": {
  "Cancelada": {
   "lineas": 20,
   "importe": 7865.0
  },
  "Devuelta": {
   "lineas": 22,
   "importe": 6230.0
  }
 },
 "contexto": {
  "moneda": "MXN",
  "filtros": {},
  "lineas_validas": 361,
  "lineas_en_filtro": 403,
  "criterio": "Solo estado = Completada. Margen = utilidad/ventas. Crecimiento = mes/mes anterior - 1.",
  "aviso": "SIMULACIÓN ACADÉMICA — no son datos reales de Puerto A&M"
 }
}
```

### Serie mensual, categorías y calidad de datos
```json
{
 "serie_mensual": [
  {
   "mes": "2026-01",
   "ventas": 28420.0,
   "costos": 9671.0,
   "utilidad_bruta": 18749.0,
   "pedidos": 39,
   "unidades": 179,
   "crecimiento": null
  },
  {
   "mes": "2026-02",
   "ventas": 48530.0,
   "costos": 16717.0,
   "utilidad_bruta": 31813.0,
   "pedidos": 58,
   "unidades": 273,
   "crecimiento": 0.7076
  },
  {
   "mes": "2026-03",
   "ventas": 39910.0,
   "costos": 13533.0,
   "utilidad_bruta": 26377.0,
   "pedidos": 57,
   "unidades": 236,
   "crecimiento": -0.1776
  }
 ],
 "ventas_por_categoria": [
  {
   "categoria": "Del mar",
   "ventas": 49195.0
  },
  {
   "categoria": "Crudos y ceviches",
   "ventas": 34470.0
  },
  {
   "categoria": "Tacos",
   "ventas": 19505.0
  },
  {
   "categoria": "Bebidas",
   "ventas": 9725.0
  },
  {
   "categoria": "Postres",
   "ventas": 3965.0
  }
 ],
 "calidad": {
  "filas_leidas": 403,
  "filas_usadas": 403,
  "duplicados": [],
  "filas_invalidas": [],
  "advertencias": []
 }
}
```

## Salida de pytest
```
============================= test session starts ==============================
platform linux -- Python 3.13.18, pytest-9.2.0, pluggy-1.7.0 -- <scratchpad>/venv/bin/python
cachedir: .pytest_cache
rootdir: /workspace/Clases-Prueba-TL/TOP_LEARNING_E1601_2_BIBLIOTECA_2026_11_22/fuentes_editables/kit_referencia/dashboard
plugins: anyio-4.16.0
collecting ... collected 26 items

test_kpis.py::test_excel_estructura PASSED                               [  3%]
test_kpis.py::test_generador_es_determinista PASSED                      [  7%]
test_kpis.py::test_kpis_coinciden_con_pandas PASSED                      [ 11%]
test_kpis.py::test_serie_mensual_y_crecimiento PASSED                    [ 15%]
test_kpis.py::test_top_productos_y_categorias PASSED                     [ 19%]
test_kpis.py::test_cumplimiento_metas PASSED                             [ 23%]
test_kpis.py::test_filtros PASSED                                        [ 26%]
test_kpis.py::test_periodo_sin_ventas_no_divide_entre_cero PASSED        [ 30%]
test_kpis.py::test_conjunto_dorado_a_mano PASSED                         [ 34%]
test_kpis.py::test_modificar_celda_y_guardar_cambia_el_kpi PASSED        [ 38%]
test_kpis.py::test_cancelar_una_venta_la_saca_de_los_kpis PASSED         [ 42%]
test_kpis.py::test_id_duplicado_se_detecta_y_no_se_cuenta_dos_veces PASSED [ 46%]
test_kpis.py::test_filas_invalidas_se_reportan PASSED                    [ 50%]
test_kpis.py::test_encabezados_cambiados_dan_error_claro PASSED          [ 53%]
test_kpis.py::test_archivo_inexistente_mensaje_claro PASSED              [ 57%]
test_kpis.py::test_archivo_bloqueado_simulado_da_mensaje_claro PASSED    [ 61%]
test_kpis.py::test_bloqueo_transitorio_se_recupera_con_reintentos PASSED [ 65%]
test_kpis.py::test_deteccion_de_archivo_de_bloqueo_de_excel PASSED       [ 69%]
test_kpis.py::test_no_quedan_temporales PASSED                           [ 73%]
test_kpis.py::test_api_kpis_ventas_y_filtros PASSED                      [ 76%]
test_kpis.py::test_api_refresh_recoge_cambios_del_excel PASSED           [ 80%]
test_kpis.py::test_api_refresh_bloqueado_da_423_y_conserva_datos PASSED  [ 84%]
test_kpis.py::test_chat_sin_key_devuelve_503_explicito PASSED            [ 88%]
test_kpis.py::test_chat_con_key_envia_solo_kpis_y_soul PASSED            [ 92%]
test_kpis.py::test_chat_error_del_proveedor_da_502_sin_inventar PASSED   [ 96%]
test_kpis.py::test_api_ventas_orden_descendente PASSED                   [100%]

=============================== warnings summary ===============================
test_kpis.py::test_api_kpis_ventas_y_filtros
  <scratchpad>/venv/lib/python3.13/site-packages/fastapi/testclient.py:1: StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated; install `httpx2` instead.
    from starlette.testclient import TestClient as TestClient  # noqa

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 26 passed, 1 warning in 4.25s =========================
```

## Qué se verificó y cómo
- **Independencia:** los tests recalculan con pandas (lectura por otro camino) y con un libro «dorado» de 5 líneas con resultados hechos a mano (ventas 850, costos 330, utilidad 520, 2 pedidos, ticket 425, crecimiento +140 %).
- **Mutación de control:** al hacer que `kpis.py` contara todos los estados, fallaron 8 pruebas; al dejar pasar IDs duplicados, falló la prueba de duplicados. Se restauró el código y vuelven a pasar.
- **Cambio en Excel:** pruebas que modifican una cantidad / cancelan una venta con openpyxl, guardan y comprueban el delta exacto del KPI; también vía `POST /api/refresh` (sin refresh se conserva la lectura anterior). Prueba manual adicional con uvicorn y curl (versión previa del catálogo): ventas 104,069.00 → 108,569.00 tras sumar 100 unidades × $45 y refrescar.
- **Servidor real + curl:** `GET /api/kpis`, `/api/ventas`, `POST /api/refresh`, `POST /api/chat` sin key → HTTP 503 «IA no configurada…».
- **No verificado:** bloqueo real de Excel en Windows (solo simulado); llamada real a OpenRouter con clave (solo servidor simulado en pytest); Chart.js desde jsDelivr (la CDN no es accesible desde este entorno; las capturas usan el mismo paquete npm `chart.js@4.4.1` servido localmente); ejecución en PowerShell/Windows.
