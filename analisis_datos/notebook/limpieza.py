import pandas as pd


def limpiar_datos(data_frame_sucio, productos_reales):
    data_frame_limpio = data_frame_sucio.copy()
    nombres_validos = [
        str(producto["nombre"]).strip().lower()
        for producto in productos_reales
        if producto.get("nombre")
    ]

    data_frame_limpio["nombre"] = data_frame_limpio["nombre"].astype("string").str.strip().str.lower()
    data_frame_limpio["imagen"] = data_frame_limpio["imagen"].astype("string").str.strip()

    data_frame_limpio["nombre"] = data_frame_limpio["nombre"].where(
        data_frame_limpio["nombre"].isin(nombres_validos),
        pd.NA,
    )

    data_frame_limpio["producto_id"] = pd.to_numeric(data_frame_limpio["producto_id"], errors="coerce")
    data_frame_limpio["precio"] = pd.to_numeric(data_frame_limpio["precio"], errors="coerce")
    data_frame_limpio["stock"] = pd.to_numeric(data_frame_limpio["stock"], errors="coerce")

    data_frame_limpio = data_frame_limpio[data_frame_limpio["producto_id"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["precio"] > 0]
    data_frame_limpio = data_frame_limpio[data_frame_limpio["stock"] >= 0]

    columnas_obligatorias = ["producto_id", "nombre", "precio", "stock", "imagen"]
    data_frame_limpio = data_frame_limpio.dropna(subset=columnas_obligatorias)

    return data_frame_limpio
