"""
test_kpis.py - Pruebas del kit (pytest). SIMULACION ACADEMICA.

La verificacion es INDEPENDIENTE: el resultado de kpis.py (Decimal, openpyxl) se compara con
  (a) un recalculo con pandas leyendo el mismo Excel con otro camino, y
  (b) un conjunto "dorado" pequeno con resultados calculados a mano.
El bloqueo de archivo en Windows se SIMULA con PermissionError (en Linux no se puede
reproducir el bloqueo real de Excel); ver las notas en kpis.py.
Ejecuta:  pytest -v
"""
from __future__ import annotations

import json
import shutil
from datetime import date
from pathlib import Path

import pandas as pd
import pytest
from openpyxl import Workbook, load_workbook

import generar_excel as G
import kpis as K

APROX = dict(abs=0.01)


@pytest.fixture(scope="module")
def excel_demo(tmp_path_factory) -> Path:
    return G.generar(tmp_path_factory.mktemp("xlsx") / "demo.xlsx")


@pytest.fixture
def copia(excel_demo, tmp_path) -> Path:
    destino = tmp_path / "trabajo.xlsx"
    shutil.copyfile(excel_demo, destino)
    return destino


def _pandas_ventas(ruta: Path) -> pd.DataFrame:
    """Lectura independiente con pandas: localiza el encabezado sin usar kpis.py."""
    crudo = pd.read_excel(ruta, sheet_name="Ventas", header=None)
    fila = crudo.index[crudo.iloc[:, 1] == "id_venta"][0]
    df = pd.read_excel(ruta, sheet_name="Ventas", header=int(fila))
    df["importe"] = df["cantidad"] * df["precio_unitario"]
    df["costo"] = df["cantidad"] * df["costo_unitario"]
    return df


# ---------------------------------------------------------------- estructura del Excel
def test_excel_estructura(excel_demo):
    wb = load_workbook(excel_demo)
    assert wb.sheetnames == ["Ventas", "Productos", "Metas", "Instrucciones"]
    assert "SIMULACIÓN ACADÉMICA" in wb["Ventas"]["A1"].value
    assert "tblVentas" in wb["Ventas"].tables
    df = _pandas_ventas(excel_demo)
    assert len(df) >= 300
    assert df["id_venta"].is_unique
    assert df["fecha"].min() >= pd.Timestamp("2026-01-01") and df["fecha"].max() <= pd.Timestamp("2026-03-31")
    assert set(df["estado"]) == {"Completada", "Cancelada", "Devuelta"}
    assert (df["id_pedido"].value_counts() > 1).any(), "debe haber pedidos con varias líneas"
    assert (df["costo_unitario"] < df["precio_unitario"]).all()


def test_generador_es_determinista(tmp_path):
    a = _pandas_ventas(G.generar(tmp_path / "a.xlsx"))
    b = _pandas_ventas(G.generar(tmp_path / "b.xlsx"))
    pd.testing.assert_frame_equal(a, b)


# ---------------------------------------------------------------- kpis vs pandas
def test_kpis_coinciden_con_pandas(excel_demo):
    k = K.calcular_kpis(K.leer_excel(excel_demo))
    df = _pandas_ventas(excel_demo)
    v = df[df["estado"] == "Completada"]
    ventas, costos = v["importe"].sum(), v["costo"].sum()
    assert k["ventas_totales"] == pytest.approx(ventas, **APROX)
    assert k["costos"] == pytest.approx(costos, **APROX)
    assert k["utilidad_bruta"] == pytest.approx(ventas - costos, **APROX)
    assert k["margen_bruto"] == pytest.approx((ventas - costos) / ventas, abs=1e-4)
    assert k["pedidos"] == v["id_pedido"].nunique()
    assert k["ticket_promedio"] == pytest.approx(ventas / v["id_pedido"].nunique(), **APROX)
    assert k["unidades_vendidas"] == v["cantidad"].sum()
    # las excluidas NO deben sumar
    assert k["ventas_totales"] < df["importe"].sum()
    for estado in ("Cancelada", "Devuelta"):
        x = df[df["estado"] == estado]
        assert k["excluidas"][estado]["lineas"] == len(x)
        assert k["excluidas"][estado]["importe"] == pytest.approx(x["importe"].sum(), **APROX)


def test_serie_mensual_y_crecimiento(excel_demo):
    k = K.calcular_kpis(K.leer_excel(excel_demo))
    v = _pandas_ventas(excel_demo)
    v = v[v["estado"] == "Completada"]
    mensual = v.groupby(v["fecha"].dt.strftime("%Y-%m"))[["importe", "costo"]].sum()
    assert [s["mes"] for s in k["serie_mensual"]] == list(mensual.index)
    for s in k["serie_mensual"]:
        assert s["ventas"] == pytest.approx(mensual.loc[s["mes"], "importe"], **APROX)
        assert s["costos"] == pytest.approx(mensual.loc[s["mes"], "costo"], **APROX)
    assert k["serie_mensual"][0]["crecimiento"] is None  # enero: no hay base
    esperado = mensual["importe"].iloc[2] / mensual["importe"].iloc[1] - 1
    assert k["crecimiento_mensual"]["valor"] == pytest.approx(esperado, abs=1e-4)
    assert (k["crecimiento_mensual"]["mes_actual"], k["crecimiento_mensual"]["mes_anterior"]) == ("2026-03", "2026-02")


def test_top_productos_y_categorias(excel_demo):
    k = K.calcular_kpis(K.leer_excel(excel_demo))
    v = _pandas_ventas(excel_demo)
    v = v[v["estado"] == "Completada"]
    g = v.groupby("producto").agg(u=("cantidad", "sum"), s=("importe", "sum")).reset_index()
    g = g.sort_values(["u", "s", "producto"], ascending=[False, False, True]).head(5)
    assert [t["producto"] for t in k["top_productos"]] == list(g["producto"])
    assert [t["unidades"] for t in k["top_productos"]] == list(g["u"])
    cat = v.groupby("categoria")["importe"].sum()
    for c in k["ventas_por_categoria"]:
        assert c["ventas"] == pytest.approx(cat[c["categoria"]], **APROX)
    assert sum(c["ventas"] for c in k["ventas_por_categoria"]) == pytest.approx(k["ventas_totales"], **APROX)


def test_cumplimiento_metas(excel_demo):
    k = K.calcular_kpis(K.leer_excel(excel_demo))
    metas = pd.read_excel(excel_demo, sheet_name="Metas", header=3)
    v = _pandas_ventas(excel_demo)
    v = v[v["estado"] == "Completada"]
    mensual = v.groupby(v["fecha"].dt.strftime("%Y-%m"))["importe"].sum()
    metas["mes"] = pd.to_datetime(metas["mes"]).dt.strftime("%Y-%m")
    metas = metas.set_index("mes")
    for fila in k["cumplimiento_metas"]["por_mes"]:
        assert fila["meta_ventas"] == metas.loc[fila["mes"], "meta_ventas"]
        assert fila["cumplimiento_ventas"] == pytest.approx(mensual[fila["mes"]] / metas.loc[fila["mes"], "meta_ventas"], abs=1e-4)
    tot = k["cumplimiento_metas"]["total"]
    assert tot["cumplimiento_ventas"] == pytest.approx(mensual.sum() / metas["meta_ventas"].sum(), abs=1e-4)


def test_filtros(excel_demo):
    datos = K.leer_excel(excel_demo)
    f = {"categoria": "Bebidas", "desde": "2026-02-01", "hasta": "2026-02-28"}
    k = K.calcular_kpis(datos, f)
    v = _pandas_ventas(excel_demo)
    v = v[(v["estado"] == "Completada") & (v["categoria"] == "Bebidas")
          & (v["fecha"] >= "2026-02-01") & (v["fecha"] <= "2026-02-28")]
    assert k["ventas_totales"] == pytest.approx(v["importe"].sum(), **APROX)
    assert k["pedidos"] == v["id_pedido"].nunique()
    # con filtro de categoria las metas del negocio no son comparables
    assert k["cumplimiento_metas"]["comparable"] is False and k["cumplimiento_metas"]["total"] is None
    # un solo mes => no hay mes anterior => N/A (nunca 0 ni infinito)
    assert k["crecimiento_mensual"]["valor"] is None and "N/A" in k["crecimiento_mensual"]["nota"]


def test_periodo_sin_ventas_no_divide_entre_cero(excel_demo):
    k = K.calcular_kpis(K.leer_excel(excel_demo), {"desde": "2027-01-01"})
    assert k["ventas_totales"] == 0 and k["pedidos"] == 0
    assert k["ticket_promedio"] is None and k["margen_bruto"] is None
    assert k["crecimiento_mensual"]["valor"] is None and k["top_productos"] == []


# ---------------------------------------------------------------- conjunto dorado (a mano)
def _libro_dorado(ruta: Path) -> Path:
    wb = Workbook()
    ws = wb.active
    ws.title = "Ventas"
    ws["A1"] = "leyenda"
    ws.append([])
    ws.append([])
    ws.append(list(G_COLS))
    filas = [
        # fecha, id_venta, id_pedido, producto, categoria, cant, precio, costo, canal, pago, estado
        (date(2026, 1, 10), "V1", "A", "Taco", "Tacos", 2, 100, 40, "Salón", "Efectivo", "Completada"),
        (date(2026, 1, 10), "V2", "A", "Agua", "Bebidas", 1, 50, 10, "Salón", "Efectivo", "Completada"),
        (date(2026, 1, 11), "V3", "B", "Taco", "Tacos", 1, 100, 40, "Salón", "Tarjeta", "Cancelada"),
        (date(2026, 1, 12), "V4", "C", "Taco", "Tacos", 3, 100, 40, "Salón", "Tarjeta", "Devuelta"),
        (date(2026, 2, 5), "V5", "D", "Taco", "Tacos", 6, 100, 40, "Salón", "Tarjeta", "Completada"),
    ]
    for f in filas:
        ws.append(list(f))
    wm = wb.create_sheet("Metas")
    wm.append([]); wm.append([]); wm.append([])
    wm.append(["mes", "meta_ventas", "meta_pedidos", "meta_utilidad_bruta"])
    wm.append([date(2026, 1, 1), 500, 2, 300])
    wm.append([date(2026, 2, 1), 1000, 1, 300])
    wb.save(ruta)
    return ruta


G_COLS = [c for c, _ in G.COLUMNAS_VENTAS]


def test_conjunto_dorado_a_mano(tmp_path):
    k = K.calcular_kpis(K.leer_excel(_libro_dorado(tmp_path / "d.xlsx")))
    # Validas: V1 (200), V2 (50) en enero; V5 (600) en febrero. Cancelada y Devuelta NO cuentan.
    assert k["ventas_totales"] == 850
    assert k["costos"] == 2 * 40 + 10 + 6 * 40 == 330
    assert k["utilidad_bruta"] == 520
    assert k["margen_bruto"] == pytest.approx(520 / 850, abs=1e-4)
    assert k["pedidos"] == 2  # pedidos A y D (B y C no tienen lineas validas)
    assert k["ticket_promedio"] == 425
    assert k["unidades_vendidas"] == 9
    assert k["crecimiento_mensual"]["valor"] == pytest.approx(600 / 250 - 1)  # 1.4 = +140 %
    assert k["cumplimiento_metas"]["por_mes"][0]["cumplimiento_ventas"] == pytest.approx(250 / 500)
    assert k["cumplimiento_metas"]["por_mes"][1]["cumplimiento_ventas"] == pytest.approx(0.6)
    assert k["cumplimiento_metas"]["total"]["cumplimiento_ventas"] == pytest.approx(850 / 1500, abs=1e-4)
    assert k["excluidas"]["Cancelada"] == {"lineas": 1, "importe": 100.0}
    assert k["excluidas"]["Devuelta"] == {"lineas": 1, "importe": 300.0}
    assert k["top_productos"][0] == {"producto": "Taco", "unidades": 8.0, "ventas": 800.0}


# ---------------------------------------------------------------- modificar celda => cambia KPI
def test_modificar_celda_y_guardar_cambia_el_kpi(copia):
    antes = K.calcular_kpis(K.leer_excel(copia))
    wb = load_workbook(copia)
    ws = wb["Ventas"]
    # Buscar la primera linea Completada y subirle la cantidad en 10 unidades.
    fila = next(r for r in range(G.FILA_ENCABEZADO_VENTAS + 1, ws.max_row + 1) if ws.cell(r, 11).value == "Completada")
    cant0, precio, costo = ws.cell(fila, 6).value, ws.cell(fila, 7).value, ws.cell(fila, 8).value
    ws.cell(fila, 6).value = cant0 + 10
    wb.save(copia)
    despues = K.calcular_kpis(K.leer_excel(copia))
    assert despues["ventas_totales"] == pytest.approx(antes["ventas_totales"] + 10 * precio, **APROX)
    assert despues["costos"] == pytest.approx(antes["costos"] + 10 * costo, **APROX)
    assert despues["unidades_vendidas"] == antes["unidades_vendidas"] + 10
    assert despues["ventas_totales"] != antes["ventas_totales"]


def test_cancelar_una_venta_la_saca_de_los_kpis(copia):
    antes = K.calcular_kpis(K.leer_excel(copia))
    wb = load_workbook(copia); ws = wb["Ventas"]
    fila = next(r for r in range(G.FILA_ENCABEZADO_VENTAS + 1, ws.max_row + 1) if ws.cell(r, 11).value == "Completada")
    importe = ws.cell(fila, 6).value * ws.cell(fila, 7).value
    ws.cell(fila, 11).value = "Cancelada"
    wb.save(copia)
    despues = K.calcular_kpis(K.leer_excel(copia))
    assert despues["ventas_totales"] == pytest.approx(antes["ventas_totales"] - importe, **APROX)


# ---------------------------------------------------------------- IDs duplicados / datos sucios
def test_id_duplicado_se_detecta_y_no_se_cuenta_dos_veces(copia):
    base = K.calcular_kpis(K.leer_excel(copia))
    wb = load_workbook(copia); ws = wb["Ventas"]
    fila = G.FILA_ENCABEZADO_VENTAS + 1
    id_repetido = ws.cell(fila, 2).value
    nueva = ws.max_row + 1
    for c in range(1, 12):
        ws.cell(nueva, c).value = ws.cell(fila, c).value  # copia exacta => mismo id_venta
    wb.save(copia)
    datos = K.leer_excel(copia)
    dup = datos["calidad"]["duplicados"]
    assert [d["id_venta"] for d in dup] == [id_repetido] and dup[0]["fila"] == nueva
    assert any(id_repetido in a for a in datos["calidad"]["advertencias"])
    k = K.calcular_kpis(datos)
    assert k["ventas_totales"] == base["ventas_totales"], "el duplicado no debe inflar las ventas"


def test_filas_invalidas_se_reportan(copia):
    wb = load_workbook(copia); ws = wb["Ventas"]
    n = ws.max_row + 1
    ws.append([date(2026, 2, 2), "VTA-X1", "PED-X", "Taco", "Tacos", "muchos", 10, 5, "Salón", "Efectivo", "Completada"])
    ws.append([date(2026, 2, 2), "VTA-X2", "PED-X", "Taco", "Tacos", 1, 10, 5, "Salón", "Efectivo", "En camino"])
    wb.save(copia)
    cal = K.leer_excel(copia)["calidad"]
    assert {i["id_venta"]: i["problema"] for i in cal["filas_invalidas"]} == {
        "VTA-X1": "cantidad/precio/costo no numéricos", "VTA-X2": "estado desconocido «En camino»"}


def test_encabezados_cambiados_dan_error_claro(copia):
    wb = load_workbook(copia)
    wb["Ventas"].cell(G.FILA_ENCABEZADO_VENTAS, 6).value = "cantidad_vendida"
    wb.save(copia)
    with pytest.raises(K.ExcelError, match="encabezados"):
        K.leer_excel(copia)


def test_archivo_inexistente_mensaje_claro(tmp_path):
    with pytest.raises(K.ExcelError, match="No encuentro"):
        K.leer_excel(tmp_path / "no_existe.xlsx")


# ---------------------------------------------------------------- archivo bloqueado (simulado)
def test_archivo_bloqueado_simulado_da_mensaje_claro(copia, monkeypatch):
    llamadas = []
    monkeypatch.setattr(K.time, "sleep", lambda s: None)
    def bloqueado(origen, destino):
        llamadas.append(origen)
        raise PermissionError(13, "Permission denied")
    monkeypatch.setattr(K.shutil, "copyfile", bloqueado)
    with pytest.raises(K.ExcelBloqueadoError) as e:
        K.leer_excel(copia)
    assert len(llamadas) == K.REINTENTOS
    assert "cierra Excel" in str(e.value) and copia.name in str(e.value)


def test_bloqueo_transitorio_se_recupera_con_reintentos(copia, monkeypatch):
    monkeypatch.setattr(K.time, "sleep", lambda s: None)
    real = shutil.copyfile
    estado = {"n": 0}
    def intermitente(origen, destino):
        estado["n"] += 1
        if estado["n"] < 3:
            raise PermissionError(13, "Permission denied")
        return real(origen, destino)
    monkeypatch.setattr(K.shutil, "copyfile", intermitente)
    assert K.calcular_kpis(K.leer_excel(copia))["pedidos"] > 0 and estado["n"] == 3


def test_deteccion_de_archivo_de_bloqueo_de_excel(copia):
    (copia.parent / ("~$" + copia.name)).write_bytes(b"x")  # Excel crea este archivo al abrir el libro
    adv = K.leer_excel(copia)["calidad"]["advertencias"]
    assert any("abierto" in a for a in adv)


def test_no_quedan_temporales(copia):
    import tempfile
    tmpdir = Path(tempfile.gettempdir())
    antes = set(tmpdir.glob("puertoam_*.xlsx"))
    K.leer_excel(copia)
    assert set(tmpdir.glob("puertoam_*.xlsx")) == antes


# ---------------------------------------------------------------- API (FastAPI TestClient)
@pytest.fixture
def cliente(copia, monkeypatch):
    from fastapi.testclient import TestClient
    import app as A
    monkeypatch.setenv("EXCEL_PATH", str(copia))
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("OPENROUTER_MODEL", raising=False)
    A._estado.update(datos=None, leido_en=None, ruta=None)
    return TestClient(A.app)


def test_api_kpis_ventas_y_filtros(cliente, copia):
    r = cliente.get("/api/kpis")
    assert r.status_code == 200
    assert r.json()["ventas_totales"] == K.calcular_kpis(K.leer_excel(copia))["ventas_totales"]
    assert "Bebidas" in r.json()["opciones"]["categorias"]
    r = cliente.get("/api/ventas", params={"categoria": "Bebidas", "limite": 5})
    j = r.json()
    assert len(j["items"]) == 5 and all(x["categoria"] == "Bebidas" for x in j["items"]) and j["total"] > 5
    assert cliente.get("/api/ventas", params={"estado": "Cancelada"}).json()["total"] > 0
    assert cliente.get("/api/kpis", params={"desde": "mañana"}).status_code == 422


def test_api_refresh_recoge_cambios_del_excel(cliente, copia):
    antes = cliente.get("/api/kpis").json()["ventas_totales"]
    wb = load_workbook(copia); ws = wb["Ventas"]
    fila = next(r for r in range(G.FILA_ENCABEZADO_VENTAS + 1, ws.max_row + 1) if ws.cell(r, 11).value == "Completada")
    ws.cell(fila, 6).value += 5
    precio = ws.cell(fila, 7).value
    wb.save(copia)
    # Sin refresh, el dashboard sigue mostrando la lectura anterior (cache)...
    assert cliente.get("/api/kpis").json()["ventas_totales"] == antes
    # ...y con «Actualizar datos» se ven los cambios.
    assert cliente.post("/api/refresh").status_code == 200
    assert cliente.get("/api/kpis").json()["ventas_totales"] == pytest.approx(antes + 5 * precio, **APROX)


def test_api_refresh_bloqueado_da_423_y_conserva_datos(cliente, monkeypatch):
    antes = cliente.get("/api/kpis").json()["ventas_totales"]
    monkeypatch.setattr(K.time, "sleep", lambda s: None)
    monkeypatch.setattr(K.shutil, "copyfile", lambda a, b: (_ for _ in ()).throw(PermissionError(13, "denied")))
    r = cliente.post("/api/refresh")
    assert r.status_code == 423 and "cierra Excel" in r.json()["detail"]
    assert cliente.get("/api/kpis").json()["ventas_totales"] == antes


def test_chat_sin_key_devuelve_503_explicito(cliente):
    r = cliente.post("/api/chat", json={"pregunta": "¿Cómo van las ventas?"})
    assert r.status_code == 503
    assert "IA no configurada" in r.json()["detail"]


def test_chat_con_key_envia_solo_kpis_y_soul(cliente, monkeypatch):
    import app as A
    monkeypatch.setenv("OPENROUTER_API_KEY", "sk-or-v1-XXXXXXXXXXXXXXXXFALSA")
    monkeypatch.setenv("OPENROUTER_MODEL", "modelo/de-prueba")
    capturado = {}
    class Resp:
        status_code = 200
        def json(self): return {"choices": [{"message": {"content": "Respuesta simulada."}}]}
    def falso_post(url, headers=None, json=None, timeout=None):
        capturado.update(url=url, headers=headers, json=json); return Resp()
    monkeypatch.setattr(A.httpx, "post", falso_post)
    r = cliente.post("/api/chat", json={"pregunta": "¿Margen?"})
    assert r.status_code == 200 and r.json()["respuesta"] == "Respuesta simulada."
    assert capturado["url"].endswith("/chat/completions")
    msgs = capturado["json"]["messages"]
    assert msgs[0]["role"] == "system" and "soul_financiero" in msgs[0]["content"]
    contenido = msgs[1]["content"]
    ventas = cliente.get("/api/kpis").json()["ventas_totales"]
    assert json.dumps(ventas) in contenido or str(ventas) in contenido  # el JSON de KPIs viaja al LLM
    assert "VTA-0" not in contenido, "no deben viajar filas crudas del Excel"
    assert "sk-or-v1" not in r.text, "la clave nunca sale en la respuesta"


def test_chat_error_del_proveedor_da_502_sin_inventar(cliente, monkeypatch):
    import app as A
    monkeypatch.setenv("OPENROUTER_API_KEY", "sk-or-v1-XXXXXXXXXXXXXXXXFALSA")
    monkeypatch.setenv("OPENROUTER_MODEL", "modelo/de-prueba")
    class Resp:
        status_code = 429
        text = "detalle interno"
    monkeypatch.setattr(A.httpx, "post", lambda *a, **k: Resp())
    r = cliente.post("/api/chat", json={"pregunta": "hola"})
    assert r.status_code == 502 and "429" in r.json()["detail"] and "detalle interno" not in r.text


def test_api_ventas_orden_descendente(cliente):
    asc = cliente.get("/api/ventas", params={"limite": 3}).json()["items"]
    desc = cliente.get("/api/ventas", params={"limite": 3, "orden": "desc"}).json()["items"]
    assert asc[0]["fecha"] <= asc[-1]["fecha"] and desc[0]["fecha"] >= desc[-1]["fecha"]
    assert desc[0]["fecha"] >= asc[0]["fecha"]
