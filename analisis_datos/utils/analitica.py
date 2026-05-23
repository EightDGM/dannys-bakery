import os
import matplotlib.pyplot as plt


def generar_graficos(df_ventas, df_productos, df_detalles):
    ruta_graficos = "graficos"
    os.makedirs(ruta_graficos, exist_ok=True)

    if not df_ventas.empty and "fecha" in df_ventas.columns and "totalcompra" in df_ventas.columns:
        df = df_ventas.dropna(subset=["fecha"]).copy()
        if not df.empty:
            df["mes"] = df["fecha"].dt.to_period("M").astype(str)
            ingresos_mes = df.groupby("mes")["totalcompra"].sum()

            plt.figure()
            ingresos_mes.plot(kind="bar")
            plt.title("Ingresos por mes")
            plt.xlabel("Mes")
            plt.ylabel("Total COP")
            plt.xticks(rotation=45, ha="right")
            plt.tight_layout()
            plt.savefig(os.path.join(ruta_graficos, "ingresos_por_mes.png"))
            plt.close()
            print("  Guardado: graficos/ingresos_por_mes.png")

    if not df_ventas.empty and "fecha" in df_ventas.columns and "venta_id" in df_ventas.columns:
        df = df_ventas.dropna(subset=["fecha"]).copy()
        if not df.empty:
            df["mes"] = df["fecha"].dt.to_period("M").astype(str)
            ventas_mes = df.groupby("mes")["venta_id"].count()

            plt.figure()
            ventas_mes.plot(kind="bar")
            plt.title("Pedidos por mes")
            plt.xlabel("Mes")
            plt.ylabel("Cantidad")
            plt.xticks(rotation=45, ha="right")
            plt.tight_layout()
            plt.savefig(os.path.join(ruta_graficos, "pedidos_por_mes.png"))
            plt.close()
            print("  Guardado: graficos/pedidos_por_mes.png")

    if not df_productos.empty and {"nombre", "precio"}.issubset(df_productos.columns):
        plt.figure()
        plt.bar(df_productos["nombre"], df_productos["precio"])
        plt.title("Precio por producto")
        plt.xlabel("Producto")
        plt.ylabel("Precio COP")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(os.path.join(ruta_graficos, "precios_productos.png"))
        plt.close()
        print("  Guardado: graficos/precios_productos.png")

    if not df_productos.empty and {"nombre", "stock"}.issubset(df_productos.columns):
        plt.figure()
        plt.bar(df_productos["nombre"], df_productos["stock"])
        plt.title("Stock por producto")
        plt.xlabel("Producto")
        plt.ylabel("Unidades")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(os.path.join(ruta_graficos, "stock_productos.png"))
        plt.close()
        print("  Guardado: graficos/stock_productos.png")

    if not df_detalles.empty and {"producto", "cantidad"}.issubset(df_detalles.columns):
        vendidos = df_detalles.groupby("producto")["cantidad"].sum().sort_values(ascending=False)

        plt.figure()
        vendidos.plot(kind="bar")
        plt.title("Productos mas vendidos")
        plt.xlabel("Producto")
        plt.ylabel("Cantidad vendida")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.savefig(os.path.join(ruta_graficos, "productos_mas_vendidos.png"))
        plt.close()
        print("  Guardado: graficos/productos_mas_vendidos.png")
