"""
kpis.py - Lectura robusta del Excel DEMO y calculo de los 10 KPIs (SIMULACION ACADEMICA).

Reglas contables (las mismas del prompt "DASHBOARD CONECTADO A EXCEL" mejorado):
  * Solo cuentan las lineas con estado == "Completada". Cancelada y Devuelta se reportan
    aparte (campo "excluidas") y NO suman a ventas, costos, unidades ni pedidos.
  * ventas_totales = suma(cantidad * precio_unitario)
  * costos         = suma(cantidad * costo_unitario)
  * utilidad_bruta = ventas_totales - costos
  * margen_bruto   = utilidad_bruta / ventas_totales   (None si no hay ventas)
  * pedidos        = id_pedido UNICOS con al menos una linea valida
  * ticket_promedio= ventas_totales / pedidos          (None si no hay pedidos)
  * crecimiento_mensual = ventas(mes) / ventas(mes anterior) - 1  (None = "N/A" si no hay base)
  * cumplimiento de metas = real / meta por mes (N/A si el mes no tiene meta o la meta es 0)
  * id_venta repetido: se avisa en calidad.duplicados y la repeticion se ignora (se queda la 1a).

SOBRE EL "ARCHIVO ABIERTO / BLOQUEADO" (visto en clase, 22/11/2026)
  En Windows, ciertos programas abren el .xlsx con un bloqueo de acceso: mientras Excel lo
  tiene abierto, otro proceso puede recibir PermissionError ([Errno 13]) al leerlo.
  Eso NO es universal: depende de la aplicacion, del modo en que se abrio el archivo
  (edicion, solo lectura, vista protegida), de si esta en OneDrive/red y de como lo lea
  el programa. En Linux/macOS normalmente no hay bloqueo obligatorio. Ademas, los cambios
  no guardados en Excel NO estan en el disco: el dashboard solo ve lo que se guardo.
  Estrategia de este modulo: copiar el archivo a un temporal (rapido, sin tomar bloqueos
  de escritura), abrir la copia con read_only=True y data_only=True, reintentar un
  par de veces y, si sigue bloqueado, lanzar ExcelBloqueadoError con un mensaje claro.
  Esto reduce, pero no garantiza, que la lectura funcione con el archivo abierto.
"""
from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
import time
from collections import OrderedDict
from datetime import date, datetime
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path
from typing import Any, Iterable

from openpyxl import load_workbook

HOJA_VENTAS, HOJA_PRODUCTOS, HOJA_METAS = "Ventas", "Productos", "Metas"
ESTADO_VALIDO = "Completada"
ESTADOS_CONOCIDOS = {"Completada", "Cancelada", "Devuelta"}
COLUMNAS_REQUERIDAS = (
    "fecha", "id_venta", "id_pedido", "producto", "categoria",
    "cantidad", "precio_unitario", "costo_unitario", "canal", "metodo_pago", "estado",
)
REINTENTOS = 3
ESPERA_SEG = 0.5


class ExcelError(Exception):
    """Error legible para el usuario al leer el Excel."""


class ExcelBloqueadoError(ExcelError):
    """El archivo no se pudo leer porque otro programa lo tiene bloqueado."""


# --------------------------------------------------------------------------- lectura
def _copiar_a_temporal(origen: Path) -> Path:
    """Copia el Excel a un archivo temporal con reintentos ante PermissionError."""
    ultimo: Exception | None = None
    for intento in range(1, REINTENTOS + 1):
        try:
            fd, tmp = tempfile.mkstemp(suffix=".xlsx", prefix="puertoam_")
            os.close(fd)
            shutil.copyfile(origen, tmp)
            return Path(tmp)
        except PermissionError as e:  # Windows: archivo en uso
            ultimo = e
            try:
                os.unlink(tmp)
            except OSError:
                pass
            if intento < REINTENTOS:
                time.sleep(ESPERA_SEG * intento)
    raise ExcelBloqueadoError(
        f"No se pudo leer «{origen.name}» porque está en uso por otro programa "
        f"(PermissionError tras {REINTENTOS} intentos). Guarda los cambios, cierra Excel "
        "(o la vista previa del Explorador) y pulsa «Actualizar datos» otra vez. "
        "Los datos mostrados siguen siendo los de la última lectura correcta."
    ) from ultimo


def _a_fecha(valor: Any) -> date | None:
    if isinstance(valor, datetime):
        return valor.date()
    if isinstance(valor, date):
        return valor
    if isinstance(valor, str):
        for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
            try:
                return datetime.strptime(valor.strip(), fmt).date()
            except ValueError:
                pass
    return None


def _a_decimal(valor: Any) -> Decimal | None:
    if isinstance(valor, bool) or valor is None:
        return None
    try:
        return Decimal(str(valor).strip().replace(",", "")) if isinstance(valor, str) else Decimal(str(valor))
    except Exception:
        return None


def _filas_con_encabezado(ws, requeridas: Iterable[str]):
    """Busca la fila de encabezados (las primeras filas pueden traer la leyenda) y
    devuelve (numero_de_fila_del_encabezado, lista_de_dicts_con_numero_de_fila)."""
    requeridas = tuple(requeridas)
    encabezado: list[str] | None = None
    fila_enc = 0
    filas = []
    for n, row in enumerate(ws.iter_rows(values_only=True), start=1):
        if encabezado is None:
            nombres = [str(c).strip() if c is not None else "" for c in row]
            if all(r in nombres for r in requeridas):
                encabezado, fila_enc = nombres, n
            elif n >= 15:
                break
            continue
        if all(c is None or (isinstance(c, str) and not c.strip()) for c in row):
            continue
        d = {encabezado[i]: row[i] for i in range(min(len(encabezado), len(row))) if encabezado[i]}
        d["_fila"] = n
        filas.append(d)
    if encabezado is None:
        raise ExcelError(
            f"No encontré los encabezados esperados ({', '.join(requeridas)}) en la hoja "
            f"«{ws.title}». No cambies los nombres de las columnas."
        )
    return fila_enc, filas


def leer_excel(ruta: str | Path) -> dict:
    """Lee Ventas, Productos y Metas. Devuelve:
       {"ventas": [...], "metas": {"YYYY-MM": {...}}, "productos": [...], "calidad": {...}}
    Cada venta ya viene normalizada (Decimal para dinero)."""
    ruta = Path(ruta)
    if not ruta.exists():
        raise ExcelError(f"No encuentro el archivo Excel: {ruta}")
    advertencias: list[str] = []
    candado = ruta.with_name("~$" + ruta.name)
    if candado.exists():
        advertencias.append(
            "Se detectó el archivo de bloqueo de Excel (~$...): el libro parece estar abierto. "
            "Solo se leen los cambios GUARDADOS en disco."
        )
    tmp = _copiar_a_temporal(ruta)
    try:
        try:
            wb = load_workbook(tmp, read_only=True, data_only=True)
        except PermissionError as e:
            raise ExcelBloqueadoError(f"No se pudo abrir la copia de «{ruta.name}»: {e}") from e
        except Exception as e:
            raise ExcelError(f"«{ruta.name}» no parece un .xlsx válido o está dañado ({e}).") from e
        try:
            faltan = [h for h in (HOJA_VENTAS, HOJA_METAS) if h not in wb.sheetnames]
            if faltan:
                raise ExcelError(f"Faltan las hojas: {', '.join(faltan)}. No renombres las hojas.")
            _, filas_v = _filas_con_encabezado(wb[HOJA_VENTAS], COLUMNAS_REQUERIDAS)
            _, filas_m = _filas_con_encabezado(
                wb[HOJA_METAS], ("mes", "meta_ventas", "meta_pedidos", "meta_utilidad_bruta"))
            filas_p = []
            if HOJA_PRODUCTOS in wb.sheetnames:
                try:
                    _, filas_p = _filas_con_encabezado(wb[HOJA_PRODUCTOS], ("producto", "categoria"))
                except ExcelError:
                    advertencias.append("La hoja Productos no tiene el formato esperado; se ignora.")
        finally:
            wb.close()
    finally:
        try:
            tmp.unlink()
        except OSError:
            pass

    ventas, vistos, duplicados, invalidas = [], set(), [], []
    for f in filas_v:
        fila = f["_fila"]
        idv = str(f.get("id_venta") or "").strip()
        fecha = _a_fecha(f.get("fecha"))
        cant, precio, costo = (_a_decimal(f.get(k)) for k in ("cantidad", "precio_unitario", "costo_unitario"))
        estado = str(f.get("estado") or "").strip()
        problema = None
        if not idv:
            problema = "id_venta vacío"
        elif fecha is None:
            problema = "fecha no válida"
        elif cant is None or precio is None or costo is None:
            problema = "cantidad/precio/costo no numéricos"
        elif cant < 0 or precio < 0 or costo < 0:
            problema = "valores negativos"
        elif estado not in ESTADOS_CONOCIDOS:
            problema = f"estado desconocido «{estado}»"
        if problema:
            invalidas.append({"fila": fila, "id_venta": idv or None, "problema": problema})
            continue
        if idv in vistos:
            duplicados.append({"fila": fila, "id_venta": idv})
            continue
        vistos.add(idv)
        ventas.append({
            "fila": fila, "fecha": fecha, "id_venta": idv,
            "id_pedido": str(f.get("id_pedido") or "").strip(),
            "producto": str(f.get("producto") or "").strip(),
            "categoria": str(f.get("categoria") or "").strip(),
            "cantidad": cant, "precio_unitario": precio, "costo_unitario": costo,
            "canal": str(f.get("canal") or "").strip(),
            "metodo_pago": str(f.get("metodo_pago") or "").strip(), "estado": estado,
        })
    if duplicados:
        advertencias.append(f"{len(duplicados)} id_venta duplicado(s) ignorado(s): "
                            + ", ".join(sorted({d['id_venta'] for d in duplicados})[:10]))
    if invalidas:
        advertencias.append(f"{len(invalidas)} fila(s) inválida(s) ignorada(s) (ver calidad.filas_invalidas).")

    metas: dict[str, dict] = {}
    for m in filas_m:
        mes = _a_fecha(m.get("mes"))
        if mes is None:
            continue
        metas[mes.strftime("%Y-%m")] = {
            "meta_ventas": _a_decimal(m.get("meta_ventas")),
            "meta_pedidos": _a_decimal(m.get("meta_pedidos")),
            "meta_utilidad_bruta": _a_decimal(m.get("meta_utilidad_bruta")),
        }
    return {
        "ventas": ventas, "metas": metas,
        "productos": [{"producto": p.get("producto"), "categoria": p.get("categoria")} for p in filas_p],
        "calidad": {
            "filas_leidas": len(filas_v), "filas_usadas": len(ventas),
            "duplicados": duplicados, "filas_invalidas": invalidas, "advertencias": advertencias,
        },
    }


# --------------------------------------------------------------------------- calculo
def _q(x: Decimal | None, nd: int = 2) -> float | None:
    if x is None:
        return None
    r = x.quantize(Decimal(1).scaleb(-nd), rounding=ROUND_HALF_UP)
    return int(r) if nd == 0 else float(r)


def _div(a: Decimal, b: Decimal) -> Decimal | None:
    return None if b == 0 else a / b


def filtrar(ventas: list[dict], filtros: dict | None = None) -> list[dict]:
    """Filtros opcionales: desde, hasta (date o 'YYYY-MM-DD'), producto, categoria, canal."""
    f = filtros or {}
    desde, hasta = _a_fecha(f.get("desde")), _a_fecha(f.get("hasta"))
    out = []
    for v in ventas:
        if desde and v["fecha"] < desde:
            continue
        if hasta and v["fecha"] > hasta:
            continue
        if f.get("producto") and v["producto"] != f["producto"]:
            continue
        if f.get("categoria") and v["categoria"] != f["categoria"]:
            continue
        if f.get("canal") and v["canal"] != f["canal"]:
            continue
        out.append(v)
    return out


def _importe(v: dict) -> Decimal:
    return v["cantidad"] * v["precio_unitario"]


def _costo(v: dict) -> Decimal:
    return v["cantidad"] * v["costo_unitario"]


def _agregar(lineas: list[dict]) -> dict:
    ventas = sum((_importe(v) for v in lineas), Decimal(0))
    costos = sum((_costo(v) for v in lineas), Decimal(0))
    return {
        "ventas": ventas, "costos": costos, "utilidad": ventas - costos,
        "unidades": sum((v["cantidad"] for v in lineas), Decimal(0)),
        "pedidos": len({v["id_pedido"] for v in lineas}),
    }


def calcular_kpis(datos: dict, filtros: dict | None = None, top_n: int = 5) -> dict:
    """Calcula los 10 KPIs a partir de lo que devuelve leer_excel()."""
    filtradas = filtrar(datos["ventas"], filtros)
    validas = [v for v in filtradas if v["estado"] == ESTADO_VALIDO]
    t = _agregar(validas)
    margen = _div(t["utilidad"], t["ventas"])
    ticket = _div(t["ventas"], Decimal(t["pedidos"]))

    # Serie mensual (solo meses con lineas validas, en orden cronologico)
    por_mes: "OrderedDict[str, list[dict]]" = OrderedDict()
    for v in sorted(validas, key=lambda x: x["fecha"]):
        por_mes.setdefault(v["fecha"].strftime("%Y-%m"), []).append(v)
    serie, previo = [], None
    for mes, lineas in por_mes.items():
        a = _agregar(lineas)
        # Base = mes calendario inmediatamente anterior (si no hay datos ahi, N/A).
        y, m = int(mes[:4]), int(mes[5:])
        ant = f"{y - 1}-12" if m == 1 else f"{y}-{m - 1:02d}"
        base = _agregar(por_mes[ant])["ventas"] if ant in por_mes else None
        crec = _div(a["ventas"] - base, base) if base is not None else None
        serie.append({
            "mes": mes, "ventas": _q(a["ventas"]), "costos": _q(a["costos"]),
            "utilidad_bruta": _q(a["utilidad"]), "pedidos": a["pedidos"],
            "unidades": _q(a["unidades"], 0), "crecimiento": _q(crec, 4),
        })
    if serie:
        ult = serie[-1]
        crecimiento = {
            "valor": ult["crecimiento"], "mes_actual": ult["mes"],
            "mes_anterior": None,
            "nota": None if ult["crecimiento"] is not None else
            "N/A: no hay datos válidos del mes anterior para comparar.",
        }
        if ult["crecimiento"] is not None:
            y, m = int(ult["mes"][:4]), int(ult["mes"][5:])
            crecimiento["mes_anterior"] = f"{y - 1}-12" if m == 1 else f"{y}-{m - 1:02d}"
    else:
        crecimiento = {"valor": None, "mes_actual": None, "mes_anterior": None,
                       "nota": "N/A: no hay ventas válidas en el periodo."}

    # Productos y categorias
    prod: dict[str, dict] = {}
    cat: dict[str, Decimal] = {}
    for v in validas:
        p = prod.setdefault(v["producto"], {"unidades": Decimal(0), "ventas": Decimal(0)})
        p["unidades"] += v["cantidad"]
        p["ventas"] += _importe(v)
        cat[v["categoria"]] = cat.get(v["categoria"], Decimal(0)) + _importe(v)
    ranking = sorted(prod.items(), key=lambda kv: (-kv[1]["unidades"], -kv[1]["ventas"], kv[0]))
    top = [{"producto": k, "unidades": _q(p["unidades"], 0), "ventas": _q(p["ventas"])}
           for k, p in ranking[:top_n]]
    por_categoria = [{"categoria": k, "ventas": _q(x)} for k, x in sorted(cat.items(), key=lambda kv: -kv[1])]

    # Cumplimiento de metas (solo comparable si no se filtro por producto/categoria/canal)
    comparable = not any((filtros or {}).get(k) for k in ("producto", "categoria", "canal"))
    metas_out: dict[str, Any] = {"comparable": comparable, "por_mes": [], "total": None, "nota": None}
    if not comparable:
        metas_out["nota"] = ("N/A: las metas son del negocio completo; con filtro de producto, "
                             "categoría o canal no son comparables.")
    else:
        real_total = Decimal(0)
        meta_total = Decimal(0)
        hay = False
        for fila in serie:
            mes = fila["mes"]
            meta = datos["metas"].get(mes)
            a = _agregar(por_mes[mes])
            item = {"mes": mes, "ventas_real": _q(a["ventas"]), "meta_ventas": None,
                    "cumplimiento_ventas": None, "pedidos_real": a["pedidos"], "meta_pedidos": None,
                    "cumplimiento_pedidos": None, "utilidad_real": _q(a["utilidad"]),
                    "meta_utilidad_bruta": None, "cumplimiento_utilidad": None}
            if meta:
                item["meta_ventas"] = _q(meta["meta_ventas"])
                item["meta_pedidos"] = _q(meta["meta_pedidos"], 0)
                item["meta_utilidad_bruta"] = _q(meta["meta_utilidad_bruta"])
                if meta["meta_ventas"]:
                    item["cumplimiento_ventas"] = _q(_div(a["ventas"], meta["meta_ventas"]), 4)
                    real_total += a["ventas"]
                    meta_total += meta["meta_ventas"]
                    hay = True
                if meta["meta_pedidos"]:
                    item["cumplimiento_pedidos"] = _q(_div(Decimal(a["pedidos"]), meta["meta_pedidos"]), 4)
                if meta["meta_utilidad_bruta"]:
                    item["cumplimiento_utilidad"] = _q(_div(a["utilidad"], meta["meta_utilidad_bruta"]), 4)
            metas_out["por_mes"].append(item)
        if hay:
            metas_out["total"] = {"ventas_real": _q(real_total), "meta_ventas": _q(meta_total),
                                  "cumplimiento_ventas": _q(_div(real_total, meta_total), 4)}
        else:
            metas_out["nota"] = "N/A: no hay metas cargadas para los meses del periodo."

    # Lo excluido (informativo)
    excluidas = {}
    for estado in sorted(ESTADOS_CONOCIDOS - {ESTADO_VALIDO}):
        lin = [v for v in filtradas if v["estado"] == estado]
        excluidas[estado] = {"lineas": len(lin), "importe": _q(sum((_importe(v) for v in lin), Decimal(0)))}

    return {
        "ventas_totales": _q(t["ventas"]), "pedidos": t["pedidos"],
        "ticket_promedio": _q(ticket), "unidades_vendidas": _q(t["unidades"], 0),
        "costos": _q(t["costos"]), "utilidad_bruta": _q(t["utilidad"]),
        "margen_bruto": _q(margen, 4),
        "crecimiento_mensual": crecimiento, "top_productos": top,
        "cumplimiento_metas": metas_out,
        "serie_mensual": serie, "ventas_por_categoria": por_categoria,
        "excluidas": excluidas,
        "contexto": {
            "moneda": "MXN", "filtros": {k: v for k, v in (filtros or {}).items() if v},
            "lineas_validas": len(validas), "lineas_en_filtro": len(filtradas),
            "criterio": "Solo estado = Completada. Margen = utilidad/ventas. Crecimiento = mes/mes anterior - 1.",
            "aviso": "SIMULACIÓN ACADÉMICA — no son datos reales de Puerto A&M",
        },
        "calidad": datos["calidad"],
    }


def listar_ventas(datos: dict, filtros: dict | None = None, estado: str | None = None,
                  limite: int = 50, desplazamiento: int = 0, orden: str = "asc") -> dict:
    """Lineas de venta (todas las del filtro, o solo las de un estado) para la tabla."""
    filas = filtrar(datos["ventas"], filtros)
    if estado:
        filas = [v for v in filas if v["estado"] == estado]
    filas = sorted(filas, key=lambda v: (v["fecha"], v["id_venta"]), reverse=(orden == "desc"))
    items = [{
        "fecha": v["fecha"].isoformat(), "id_venta": v["id_venta"], "id_pedido": v["id_pedido"],
        "producto": v["producto"], "categoria": v["categoria"], "cantidad": _q(v["cantidad"], 0),
        "precio_unitario": _q(v["precio_unitario"]), "importe": _q(_importe(v)),
        "canal": v["canal"], "metodo_pago": v["metodo_pago"], "estado": v["estado"],
    } for v in filas[desplazamiento: desplazamiento + limite]]
    return {"total": len(filas), "limite": limite, "desplazamiento": desplazamiento, "items": items}


def opciones_filtros(datos: dict) -> dict:
    v = datos["ventas"]
    fechas = [x["fecha"] for x in v]
    return {
        "productos": sorted({x["producto"] for x in v}),
        "categorias": sorted({x["categoria"] for x in v}),
        "canales": sorted({x["canal"] for x in v}),
        "fecha_min": min(fechas).isoformat() if fechas else None,
        "fecha_max": max(fechas).isoformat() if fechas else None,
    }


if __name__ == "__main__":
    ruta = sys.argv[1] if len(sys.argv) > 1 else Path(__file__).with_name("Puerto_AM_Base_Datos_DEMO.xlsx")
    try:
        print(json.dumps(calcular_kpis(leer_excel(ruta)), ensure_ascii=False, indent=2))
    except ExcelError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
