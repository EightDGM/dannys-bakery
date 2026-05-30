import os

try:
    import matplotlib.pyplot as plt
except ModuleNotFoundError:
    plt = None


RUTA_GRAFICOS = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "graficos"))


def crear_ruta_si_no_existe(ruta_destino):
    os.makedirs(ruta_destino, exist_ok=True)


def graficar_barras(
    datos_agrupados,
    columna_categorias,
    columna_eje_y,
    titulo="Grafico de barras",
    color_barras="#2196F3",
    nombre_archivo="barras.svg",
    ruta_destino=RUTA_GRAFICOS,
):
    crear_ruta_si_no_existe(ruta_destino)
    ruta_completa = os.path.join(ruta_destino, nombre_archivo)

    if plt is None:
        _graficar_barras_svg(
            datos_agrupados,
            columna_categorias,
            columna_eje_y,
            titulo,
            color_barras,
            ruta_completa,
        )
        print(f"Grafico de barras guardado en: {ruta_completa}")
        return

    figura, area_dibujo = plt.subplots(figsize=(10, 5))
    area_dibujo.bar(
        datos_agrupados[columna_categorias],
        datos_agrupados[columna_eje_y],
        color=color_barras,
        edgecolor="black",
    )

    area_dibujo.set_title(titulo, fontsize=14)
    area_dibujo.set_xlabel(columna_categorias, fontsize=12)
    area_dibujo.set_ylabel(columna_eje_y, fontsize=12)
    area_dibujo.grid(True, linestyle="--", alpha=0.6)

    plt.xticks(rotation=45)
    plt.tight_layout()

    figura.savefig(ruta_completa)
    plt.close(figura)

    print(f"Grafico de barras guardado en: {ruta_completa}")


def _graficar_barras_svg(datos_agrupados, columna_categorias, columna_eje_y, titulo, color_barras, ruta_completa):
    datos = datos_agrupados[[columna_categorias, columna_eje_y]].copy()
    datos[columna_categorias] = datos[columna_categorias].astype(str)
    datos[columna_eje_y] = datos[columna_eje_y].astype(float)
    if datos.empty:
        with open(ruta_completa, "w", encoding="utf-8") as archivo:
            archivo.write('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="460"></svg>')
        return

    ancho = 900
    alto = 460
    margen_izquierdo = 70
    margen_derecho = 30
    margen_superior = 60
    margen_inferior = 95
    area_ancho = ancho - margen_izquierdo - margen_derecho
    area_alto = alto - margen_superior - margen_inferior

    categorias = datos[columna_categorias].tolist()
    valores_y = datos[columna_eje_y].tolist()
    max_y = max(valores_y) if valores_y else 1
    max_y = max(max_y, 1)
    total_barras = max(len(categorias), 1)
    espacio_barra = area_ancho / total_barras
    ancho_barra = espacio_barra * 0.55

    barras = []
    etiquetas_x = []
    for indice, categoria in enumerate(categorias):
        valor_y = valores_y[indice]
        x = margen_izquierdo + indice * espacio_barra + (espacio_barra - ancho_barra) / 2
        alto_barra = (valor_y / max_y) * area_alto
        y = margen_superior + area_alto - alto_barra
        centro_x = x + ancho_barra / 2

        barras.append(
            f'<rect x="{x:.2f}" y="{y:.2f}" width="{ancho_barra:.2f}" height="{alto_barra:.2f}" '
            f'fill="{color_barras}" stroke="#1f1f1f" />'
            f'<text x="{centro_x:.2f}" y="{y - 8:.2f}" font-size="11" text-anchor="middle">{valor_y:.0f}</text>'
        )
        etiquetas_x.append(
            f'<text x="{centro_x:.2f}" y="{alto - 55}" font-size="11" text-anchor="end" '
            f'transform="rotate(-35 {centro_x:.2f},{alto - 55})">{categoria[:18]}</text>'
        )

    lineas_y = []
    for paso in range(0, 6):
        valor = (max_y / 5) * paso
        y = margen_superior + area_alto - (valor / max_y) * area_alto
        lineas_y.append(
            f'<line x1="{margen_izquierdo}" y1="{y:.2f}" x2="{ancho - margen_derecho}" y2="{y:.2f}" '
            f'stroke="#dddddd" stroke-dasharray="4 4" />'
            f'<text x="{margen_izquierdo - 10}" y="{y + 4:.2f}" font-size="11" text-anchor="end">{valor:.0f}</text>'
        )

    contenido_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{ancho}" height="{alto}" viewBox="0 0 {ancho} {alto}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="{ancho / 2}" y="32" font-size="22" font-family="Arial" text-anchor="middle" fill="#222222">{titulo}</text>
  <g font-family="Arial" fill="#333333">
    {"".join(lineas_y)}
    <line x1="{margen_izquierdo}" y1="{margen_superior}" x2="{margen_izquierdo}" y2="{alto - margen_inferior}" stroke="#222222"/>
    <line x1="{margen_izquierdo}" y1="{alto - margen_inferior}" x2="{ancho - margen_derecho}" y2="{alto - margen_inferior}" stroke="#222222"/>
    {"".join(barras)}
    {"".join(etiquetas_x)}
    <text x="{ancho / 2}" y="{alto - 15}" font-size="13" text-anchor="middle">{columna_categorias}</text>
    <text x="20" y="{alto / 2}" font-size="13" text-anchor="middle" transform="rotate(-90 20,{alto / 2})">{columna_eje_y}</text>
  </g>
</svg>'''

    with open(ruta_completa, "w", encoding="utf-8") as archivo:
        archivo.write(contenido_svg)
