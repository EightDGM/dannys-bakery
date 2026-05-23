import os
import pandas as pd
import argparse

from notebook.descripcion_DetalleVentas import describir_detalle_ventas
from notebook.descripcion_Empleados import describir_empleados
from notebook.descripcion_Productos import describir_productos
from notebook.descripcion_Usuarios import describir_usuarios
from notebook.descripcion_Ventas import describir_ventas
from utils.api_client import (
    obtener_detalles_venta,
    obtener_empleados,
    obtener_productos_mas_vendidos,
    obtener_productos,
    obtener_usuarios,
    obtener_ventas,
    obtener_ventas_cliente,
)
from utils.guardado_JSON_CSV import guardar_data
from utils.limpieza import limpiar_datos


def construir_agrupaciones_ventas(df_ventas):
    # Agrupaciones basadas en las ventas reales de la panadería, consumidas desde el backend.
    df = df_ventas.dropna(subset=["fecha"]).copy()
    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")
    df = df.dropna(subset=["fecha"])
    df["fecha"] = df["fecha"].dt.date

    agrupaciones = {
        "agrupacion1": df.groupby("fecha").size().reset_index(name="conteo"),
        "agrupacion2": df[df["cliente"].str.contains("michael", case=False, na=False)]
            .groupby("fecha")
            .size()
            .reset_index(name="conteo"),
        "agrupacion3": df[df["empleado"].str.contains("danny lopez", case=False, na=False)]
            .groupby("fecha")
            .size()
            .reset_index(name="conteo"),
        "agrupacion4": df[df["empleado"].str.contains("carlos mendoza", case=False, na=False)]
            .groupby("fecha")
            .size()
            .reset_index(name="conteo"),
        "agrupacion5": df[df["correo_cliente"].str.contains("@bakery.com", case=False, na=False)]
            .groupby("fecha")
            .size()
            .reset_index(name="conteo"),
    }

    titulos = {
        "agrupacion1": "Ventas totales por fecha",
        "agrupacion2": "Ventas del cliente Michael por fecha",
        "agrupacion3": "Ventas de Danny Lopez por fecha",
        "agrupacion4": "Ventas de Carlos Mendoza por fecha",
        "agrupacion5": "Ventas de clientes @bakery.com por fecha",
    }

    return agrupaciones, titulos


def main():
    parser = argparse.ArgumentParser(description="Transforma datos reales de la API de Danny's Bakery.")
    parser.add_argument(
        "--graficos",
        action="store_true",
        help="Genera graficos con matplotlib. Requiere instalar matplotlib.",
    )
    args = parser.parse_args()

    project_root = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(project_root, "data")
    graficos_dir = os.path.join(project_root, "graficos")

    print("Conectando con la API de Danny's Bakery...")

    data_usuarios = obtener_usuarios()
    data_empleados = obtener_empleados()
    data_productos = obtener_productos()
    data_ventas = obtener_ventas()
    data_detalles = obtener_detalles_venta()
    data_ventas_cliente = obtener_ventas_cliente("cliente@bakery.com")
    data_productos_mas_vendidos = obtener_productos_mas_vendidos()

    print(f"  Usuarios: {len(data_usuarios)}")
    print(f"  Empleados: {len(data_empleados)}")
    print(f"  Productos: {len(data_productos)}")
    print(f"  Ventas: {len(data_ventas)}")
    print(f"  Detalles venta: {len(data_detalles)}")
    print(f"  Ventas cliente DTO: {len(data_ventas_cliente)}")
    print(f"  Productos mas vendidos DTO: {len(data_productos_mas_vendidos)}")

    df_usuarios = limpiar_datos(pd.DataFrame(data_usuarios))
    df_empleados = limpiar_datos(pd.DataFrame(data_empleados))
    df_productos = limpiar_datos(pd.DataFrame(data_productos))
    df_ventas = limpiar_datos(pd.DataFrame(data_ventas))
    df_detalles = limpiar_datos(pd.DataFrame(data_detalles))
    df_ventas_cliente = limpiar_datos(pd.DataFrame(data_ventas_cliente))
    df_productos_mas_vendidos = limpiar_datos(pd.DataFrame(data_productos_mas_vendidos))

    describir_usuarios(df_usuarios)
    describir_empleados(df_empleados)
    describir_productos(df_productos)
    describir_ventas(df_ventas)
    describir_detalle_ventas(df_detalles)

    guardar_data(df_usuarios, "usuarios", carpeta=data_dir)
    guardar_data(df_empleados, "empleados", carpeta=data_dir)
    guardar_data(df_productos, "productos", carpeta=data_dir)
    guardar_data(df_ventas, "ventas", carpeta=data_dir)
    guardar_data(df_detalles, "detalle_ventas", carpeta=data_dir)
    guardar_data(df_ventas_cliente, "ventas_cliente_dto", carpeta=data_dir)
    guardar_data(df_productos_mas_vendidos, "productos_mas_vendidos_dto", carpeta=data_dir)

    if args.graficos:
        from notebook.graficacion import graficar_barras

        print("\nGenerando solo el gráfico de barras de stock de productos en:", graficos_dir)

        if not df_productos.empty:
            df_productos_stock = df_productos.sort_values("stock", ascending=False)
            graficar_barras(
                df_productos_stock.head(10),
                columna_categorias="nombre",
                columna_valores="stock",
                titulo="Stock de productos más altos",
                color_barras="#FF9800",
                nombre_archivo="barras_stock_productos.png",
                ruta_destino=graficos_dir,
            )
        else:
            print("No hay datos de productos para generar el gráfico de barras.")
    else:
        print("\nGráficos omitidos. Usa --graficos cuando necesites generarlos.")

    print("\nAnalisis terminado.")


if __name__ == "__main__":
    main()
