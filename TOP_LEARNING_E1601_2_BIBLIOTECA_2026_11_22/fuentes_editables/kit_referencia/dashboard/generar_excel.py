"""
generar_excel.py - Crea Puerto_AM_Base_Datos_DEMO.xlsx (SIMULACION ACADEMICA).

Genera un libro de Excel con cuatro hojas (Ventas, Productos, Metas, Instrucciones)
usando openpyxl y una semilla fija: si lo ejecutas dos veces obtienes el mismo archivo.

Uso (PowerShell o terminal):
    python generar_excel.py                      # crea el archivo junto a este script
    python generar_excel.py otra_ruta.xlsx       # o en la ruta que indiques

IMPORTANTE
- Todos los datos son inventados para practicar. NO son datos reales de Puerto A&M.
- El catalogo sale de ../menu_demo.json (menu costero ficticio unico del kit) cuando ese
  archivo existe; si no, se usa CATALOGO_RESPALDO (mariscos propios de este kit). Asi la hoja
  Productos coincide con el menu de la landing y del asistente.
- Las hojas contienen valores, no formulas. Las formulas creadas por openpyxl no guardan
  resultado calculado hasta que Excel abre y guarda el archivo, y el dashboard lee los
  valores guardados (data_only=True). Por eso los datos se escriben como valores.
"""
from __future__ import annotations

import json
import random
import sys
from datetime import date, timedelta
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.table import Table, TableStyleInfo

SEMILLA = 20261122
ARCHIVO_DEFAULT = Path(__file__).with_name("Puerto_AM_Base_Datos_DEMO.xlsx")
LEYENDA = "SIMULACIÓN ACADÉMICA — no son datos reales de Puerto A&M"

FECHA_INICIO = date(2026, 1, 1)
FECHA_FIN = date(2026, 3, 31)
N_PEDIDOS = 170  # con 1 a 4 lineas por pedido salen ~400 lineas de venta

ESTADOS = ("Completada", "Cancelada", "Devuelta")
CANALES = ("Salón", "Para llevar", "Domicilio propio", "App de reparto")
METODOS = ("Efectivo", "Tarjeta", "Transferencia", "Vales")

# (id_producto, producto, categoria, precio_unitario MXN, costo_unitario MXN, popularidad)
CATALOGO_RESPALDO = [
    ("P01", "Guacamole con chicharrón de camarón", "Entradas", 139, 48, 6),
    ("P02", "Aguachile verde de camarón", "Entradas", 189, 74, 8),
    ("P03", "Cóctel de camarón", "Cocteles y ceviches", 179, 66, 9),
    ("P04", "Ceviche de pescado", "Cocteles y ceviches", 165, 58, 8),
    ("P05", "Tostada de atún", "Cocteles y ceviches", 95, 36, 10),
    ("P06", "Filete de huachinango a la veracruzana", "Platos fuertes", 289, 118, 6),
    ("P07", "Camarones al mojo de ajo", "Platos fuertes", 259, 102, 9),
    ("P08", "Pulpo a la parrilla", "Platos fuertes", 329, 140, 5),
    ("P09", "Arroz a la tumbada", "Platos fuertes", 299, 121, 5),
    ("P10", "Parrillada Puerto A&M (2 personas)", "Platos fuertes", 689, 290, 3),
    ("P11", "Tacos de pescado (3 pzas)", "Tacos", 149, 52, 12),
    ("P12", "Tacos gobernador (3 pzas)", "Tacos", 169, 64, 10),
    ("P13", "Agua de jamaica", "Bebidas", 45, 9, 14),
    ("P14", "Limonada mineral", "Bebidas", 55, 11, 12),
    ("P15", "Cerveza artesanal", "Bebidas", 85, 30, 10),
    ("P16", "Michelada", "Bebidas", 95, 32, 8),
    ("P17", "Flan de cajeta", "Postres", 79, 24, 4),
    ("P18", "Helado de coco", "Postres", 69, 20, 4),
]

MENU_JSON = Path(__file__).resolve().parent.parent / "menu_demo.json"
_PESO_CATEGORIA = {"tacos": 11, "bebidas": 11, "crudos": 8, "mar": 6, "postres": 4}


def cargar_catalogo(ruta: Path = MENU_JSON) -> list[tuple]:
    """(id, producto, categoria, precio, costo, popularidad). Usa menu_demo.json si existe."""
    if not ruta.exists():
        return list(CATALOGO_RESPALDO)
    menu = json.loads(ruta.read_text(encoding="utf-8"))
    nombres = {c["id"]: c["nombre"] for c in menu["categorias"]}
    return [
        (p["id"], p["nombre"], nombres[p["categoria"]], p["precio_mxn"], p["costo_demo_mxn"],
         _PESO_CATEGORIA.get(p["categoria"], 6))
        for p in menu["platillos"]
    ]


CATALOGO = cargar_catalogo()

# Metas HIPOTETICAS por mes (MXN / pedidos). Se explican en la hoja Instrucciones.
METAS = [
    (date(2026, 1, 1), 32000, 40, 20000),
    (date(2026, 2, 1), 45000, 55, 29000),
    (date(2026, 3, 1), 44000, 60, 28000),
]

COLOR_PETROLEO = "0E4A5C"
COLOR_GRAFITO = "2B2F33"
COLOR_DORADO = "C9A24B"
COLOR_BLANCO_CALIDO = "FBF8F2"
FMT_MXN = '"$"#,##0.00'
FMT_FECHA = "dd/mm/yyyy"

COLUMNAS_VENTAS = [
    ("fecha", 12), ("id_venta", 12), ("id_pedido", 12), ("producto", 40),
    ("categoria", 22), ("cantidad", 10), ("precio_unitario", 16),
    ("costo_unitario", 16), ("canal", 18), ("metodo_pago", 16), ("estado", 13),
]
FILA_ENCABEZADO_VENTAS = 4  # filas 1-2: leyenda; fila 4: encabezados de la tabla


def _estilo_encabezado(celda) -> None:
    celda.font = Font(bold=True, color="FFFFFF")
    celda.fill = PatternFill("solid", fgColor=COLOR_PETROLEO)
    celda.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)


def _leyenda(ws, texto_extra: str = "") -> None:
    ws["A1"] = LEYENDA
    ws["A1"].font = Font(bold=True, color=COLOR_DORADO, size=12)
    ws["A2"] = texto_extra
    ws["A2"].font = Font(italic=True, color=COLOR_GRAFITO)


def generar_filas_ventas(rng: random.Random) -> list[list]:
    """Crea las lineas de venta. Cada pedido tiene fecha, canal y metodo de pago propios
    y entre 1 y 4 lineas (productos distintos)."""
    dias = (FECHA_FIN - FECHA_INICIO).days + 1
    # Crecimiento suave: mas pedidos conforme avanza el trimestre y mas en fin de semana.
    pesos_dia = []
    for i in range(dias):
        d = FECHA_INICIO + timedelta(days=i)
        peso = 1.0 + 1.4 * (i / dias) + (0.5 if d.weekday() >= 4 else 0.0)
        pesos_dia.append(peso)
    fechas_pedidos = sorted(
        FECHA_INICIO + timedelta(days=rng.choices(range(dias), weights=pesos_dia)[0])
        for _ in range(N_PEDIDOS)
    )
    pesos_prod = [p[5] for p in CATALOGO]
    filas: list[list] = []
    n_venta = 0
    for n_pedido, fecha in enumerate(fechas_pedidos, start=1):
        id_pedido = f"PED-{n_pedido:04d}"
        canal = rng.choices(CANALES, weights=[5, 3, 2, 2])[0]
        metodo = rng.choices(METODOS, weights=[3, 5, 2, 1])[0]
        n_lineas = rng.choices([1, 2, 3, 4], weights=[2, 4, 3, 1])[0]
        indices = []
        while len(indices) < n_lineas:
            i = rng.choices(range(len(CATALOGO)), weights=pesos_prod)[0]
            if i not in indices:
                indices.append(i)
        # Estado por linea: casi todo Completada; algunas canceladas/devueltas.
        estado_pedido = rng.choices(ESTADOS, weights=[90, 5, 5])[0]
        for i in indices:
            _, producto, categoria, precio, costo, _pop = CATALOGO[i]
            cantidad = rng.choices([1, 2, 3, 4], weights=[5, 4, 2, 1])[0]
            n_venta += 1
            # Una linea suelta puede salir Devuelta aunque el pedido este completado.
            estado = estado_pedido
            if estado_pedido == "Completada" and rng.random() < 0.03:
                estado = "Devuelta"
            filas.append([
                fecha, f"VTA-{n_venta:05d}", id_pedido, producto, categoria,
                cantidad, precio, costo, canal, metodo, estado,
            ])
    return filas


def _hoja_ventas(wb: Workbook, filas: list[list]) -> None:
    ws = wb.active
    ws.title = "Ventas"
    ws.sheet_properties.tabColor = COLOR_PETROLEO
    _leyenda(ws, "Una fila = una línea de venta. Edita los valores, guarda y cierra el archivo "
                 "antes de pulsar «Actualizar datos» en el dashboard.")
    for c, (nombre, ancho) in enumerate(COLUMNAS_VENTAS, start=1):
        celda = ws.cell(row=FILA_ENCABEZADO_VENTAS, column=c, value=nombre)
        _estilo_encabezado(celda)
        ws.column_dimensions[get_column_letter(c)].width = ancho
    for r, fila in enumerate(filas, start=FILA_ENCABEZADO_VENTAS + 1):
        for c, valor in enumerate(fila, start=1):
            ws.cell(row=r, column=c, value=valor)
        ws.cell(row=r, column=1).number_format = FMT_FECHA
        ws.cell(row=r, column=7).number_format = FMT_MXN
        ws.cell(row=r, column=8).number_format = FMT_MXN
    ultima = FILA_ENCABEZADO_VENTAS + len(filas)
    tabla = Table(displayName="tblVentas",
                  ref=f"A{FILA_ENCABEZADO_VENTAS}:{get_column_letter(len(COLUMNAS_VENTAS))}{ultima}")
    tabla.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(tabla)  # la tabla trae filtros automaticos en los encabezados
    ws.freeze_panes = ws.cell(row=FILA_ENCABEZADO_VENTAS + 1, column=1)
    # Listas desplegables para evitar errores de captura.
    dv_estado = DataValidation(type="list", formula1='"' + ",".join(ESTADOS) + '"', allow_blank=False)
    dv_estado.error = "Usa Completada, Cancelada o Devuelta."
    dv_canal = DataValidation(type="list", formula1='"' + ",".join(CANALES) + '"', allow_blank=False)
    dv_cant = DataValidation(type="whole", operator="greaterThan", formula1="0")
    dv_cant.error = "La cantidad debe ser un entero mayor que 0."
    for dv, col in ((dv_estado, "K"), (dv_canal, "I"), (dv_cant, "F")):
        ws.add_data_validation(dv)
        dv.add(f"{col}{FILA_ENCABEZADO_VENTAS + 1}:{col}2000")


def _hoja_productos(wb: Workbook) -> None:
    ws = wb.create_sheet("Productos")
    ws.sheet_properties.tabColor = COLOR_DORADO
    _leyenda(ws, "Catálogo ficticio de cocina costera (viene de menu_demo.json). Si usas otro menú, "
                 "edita esta hoja y la de Ventas.")
    cols = [("id_producto", 12), ("producto", 40), ("categoria", 22),
            ("precio_unitario", 16), ("costo_unitario", 16), ("margen_unitario_pct", 20)]
    for c, (n, w) in enumerate(cols, start=1):
        _estilo_encabezado(ws.cell(row=4, column=c, value=n))
        ws.column_dimensions[get_column_letter(c)].width = w
    for r, (pid, prod, cat, precio, costo, _p) in enumerate(CATALOGO, start=5):
        ws.cell(row=r, column=1, value=pid)
        ws.cell(row=r, column=2, value=prod)
        ws.cell(row=r, column=3, value=cat)
        ws.cell(row=r, column=4, value=precio).number_format = FMT_MXN
        ws.cell(row=r, column=5, value=costo).number_format = FMT_MXN
        c = ws.cell(row=r, column=6, value=round((precio - costo) / precio, 4))
        c.number_format = "0.0%"
    t = Table(displayName="tblProductos", ref=f"A4:F{4 + len(CATALOGO)}")
    t.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(t)
    ws.freeze_panes = "A5"


def _hoja_metas(wb: Workbook) -> None:
    ws = wb.create_sheet("Metas")
    ws.sheet_properties.tabColor = "6B7B83"
    _leyenda(ws, "Metas HIPOTÉTICAS para practicar (las inventó el kit; no vienen de ningún negocio real).")
    cols = [("mes", 12), ("meta_ventas", 18), ("meta_pedidos", 16), ("meta_utilidad_bruta", 22)]
    for c, (n, w) in enumerate(cols, start=1):
        _estilo_encabezado(ws.cell(row=4, column=c, value=n))
        ws.column_dimensions[get_column_letter(c)].width = w
    for r, (mes, mv, mp, mu) in enumerate(METAS, start=5):
        ws.cell(row=r, column=1, value=mes).number_format = "mmm-yyyy"
        ws.cell(row=r, column=2, value=mv).number_format = FMT_MXN
        ws.cell(row=r, column=3, value=mp)
        ws.cell(row=r, column=4, value=mu).number_format = FMT_MXN
    t = Table(displayName="tblMetas", ref=f"A4:D{4 + len(METAS)}")
    t.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(t)


def _hoja_instrucciones(wb: Workbook) -> None:
    ws = wb.create_sheet("Instrucciones")
    ws.sheet_properties.tabColor = COLOR_GRAFITO
    ws.column_dimensions["A"].width = 120
    lineas = [
        (LEYENDA, "leyenda"),
        ("", None),
        ("CÓMO USAR ESTE ARCHIVO CON EL DASHBOARD", "titulo"),
        ("1. Edita la hoja Ventas (por ejemplo, cambia una cantidad) y GUARDA el archivo (Ctrl+S).", None),
        ("2. Si el dashboard muestra un aviso de archivo bloqueado, cierra Excel y vuelve a intentar: "
         "el bloqueo depende de la aplicación y del modo en que se abrió el archivo; no siempre ocurre.", None),
        ("3. En el dashboard pulsa «Actualizar datos». Los indicadores se recalculan sin tocar el código.", None),
        ("", None),
        ("REGLAS DE LOS DATOS", "titulo"),
        ("• Solo cuentan para ventas, costos y utilidad las filas con estado = Completada.", None),
        ("• Cancelada y Devuelta se muestran aparte y NO suman a los indicadores.", None),
        ("• id_venta debe ser único (una fila = una línea). Un id repetido se avisa y la repetición se ignora.", None),
        ("• Un pedido (id_pedido) puede tener varias líneas; «pedidos» cuenta pedidos únicos con alguna línea Completada.", None),
        ("• No cambies los nombres de las columnas ni de las hojas. Usa fechas reales de Excel (dd/mm/aaaa).", None),
        ("• La hoja Metas contiene objetivos hipotéticos: cámbialos libremente.", None),
        ("• No escribas fórmulas en Ventas: el dashboard lee los valores guardados.", None),
        ("", None),
        ("DEFINICIONES", "titulo"),
        ("Ventas totales = suma(cantidad × precio_unitario) · Costos = suma(cantidad × costo_unitario)", None),
        ("Utilidad bruta = ventas − costos · Margen bruto = utilidad bruta ÷ ventas", None),
        ("Ticket promedio = ventas ÷ pedidos únicos · Crecimiento mensual = (mes actual ÷ mes anterior) − 1 (N/A si no hay mes anterior)", None),
        ("", None),
        ("Excel de tu computadora NO es una base de datos del despliegue en la nube: para publicar el dashboard "
         "necesitarás almacenamiento accesible desde el servidor (por ejemplo una base de datos).", "nota"),
    ]
    for r, (texto, tipo) in enumerate(lineas, start=1):
        c = ws.cell(row=r, column=1, value=texto)
        c.alignment = Alignment(wrap_text=True, vertical="top")
        if tipo == "leyenda":
            c.font = Font(bold=True, color=COLOR_DORADO, size=13)
        elif tipo == "titulo":
            c.font = Font(bold=True, color="FFFFFF")
            c.fill = PatternFill("solid", fgColor=COLOR_PETROLEO)
        elif tipo == "nota":
            c.font = Font(italic=True, color=COLOR_GRAFITO)


def generar(destino: Path | str = ARCHIVO_DEFAULT) -> Path:
    """Genera el archivo DEMO y devuelve su ruta. Determinista (semilla fija)."""
    rng = random.Random(SEMILLA)
    filas = generar_filas_ventas(rng)
    wb = Workbook()
    _hoja_ventas(wb, filas)
    _hoja_productos(wb)
    _hoja_metas(wb)
    _hoja_instrucciones(wb)
    destino = Path(destino)
    wb.save(destino)
    return destino


if __name__ == "__main__":
    ruta = generar(sys.argv[1] if len(sys.argv) > 1 else ARCHIVO_DEFAULT)
    print(f"Archivo creado: {ruta}")
