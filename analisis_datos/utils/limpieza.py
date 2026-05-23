import pandas as pd


def limpiar_datos(data_frame_sucio):
    if data_frame_sucio.empty:
        return data_frame_sucio

    df = data_frame_sucio.copy()
    df.columns = [str(col).strip().lower() for col in df.columns]

    columnas_texto = [
        "cliente",
        "correo",
        "correo_cliente",
        "direccion",
        "empleado",
        "cargo",
        "nombre",
        "producto",
        "estado",
        "plataforma_entrega",
        "imagen",
    ]

    for columna in columnas_texto:
        if columna in df.columns and df[columna].dtype == object:
            df[columna] = df[columna].astype("string").str.strip()

    # Normaliza cadenas vacías como valores faltantes para que sean visibles en el análisis.
    df = df.replace(r"^\s*$", pd.NA, regex=True)

    columnas_numericas = [
        "precio",
        "stock",
        "salario",
        "totalcompra",
        "cantidad",
        "subtotal",
        "precio_unitario",
    ]

    for columna in columnas_numericas:
        if columna in df.columns:
            df[columna] = pd.to_numeric(df[columna], errors="coerce")

    if "fecha" in df.columns:
        df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce")

    df = df.drop_duplicates()
    return df
