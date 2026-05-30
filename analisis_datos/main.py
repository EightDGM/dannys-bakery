import pandas as pd

from notebook.consumo import consumir_productos
from notebook.descripcion import describir_datos
from notebook.graficacion import graficar_barras
from notebook.limpieza import limpiar_datos
from notebook.transformacion import transformar_datos
from utils.guardado_JSON_CSV import guardar_data
from utils.simulacion import generar_simulacion_productos


def main():
    print("Consumiendo productos desde el backend...")
    datos_productos = consumir_productos()

    print("Generando simulaciones basadas en los productos reales...")
    datos_simulados = generar_simulacion_productos(datos_productos, numero_simulaciones=80)

    data_frame_productos = pd.DataFrame(datos_simulados)
    data_frame_limpio = limpiar_datos(data_frame_productos, datos_productos)
    agrupaciones = transformar_datos(data_frame_limpio)

    describir_datos(data_frame_limpio)

    guardar_data(data_frame_productos, "productos_simulados")
    guardar_data(data_frame_limpio, "productos_limpios")
    guardar_data(agrupaciones["stock_por_producto"], "stock_por_producto")

    graficar_barras(
        agrupaciones["stock_por_producto"],
        columna_categorias="nombre",
        columna_eje_y="stock",
        titulo="Stock actual por producto",
        color_barras="#B45F06",
        nombre_archivo="barras_stock_productos.svg",
    )

    print("\nAnalisis de stock de productos terminado.")


if __name__ == "__main__":
    main()
