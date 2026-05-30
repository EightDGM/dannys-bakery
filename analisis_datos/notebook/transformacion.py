def transformar_datos(data_frame_limpio):
    agrupacion_stock_producto = (
        data_frame_limpio.groupby("nombre")["stock"]
        .max()
        .reset_index()
        .sort_values("stock", ascending=False)
    )

    agrupaciones = {
        "stock_por_producto": agrupacion_stock_producto,
    }

    return agrupaciones
