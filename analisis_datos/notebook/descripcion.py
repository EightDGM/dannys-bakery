def describir_datos(data_frame_limpio):
    print("\n*** DESCRIPCION DEL DATASET DE PRODUCTOS ***")
    print(f"Numero de filas del dataset: {data_frame_limpio.shape[0]}")
    print(f"Numero de columnas del dataset: {data_frame_limpio.shape[1]}")
    print(f"Columnas disponibles: {list(data_frame_limpio.columns)}")
    print(f"Tipos de dato por columna:\n{data_frame_limpio.dtypes}")

    print("\n*** ESTADISTICAS NUMERICAS ***")
    print(data_frame_limpio[["producto_id", "precio", "stock"]].describe())

    print("\n*** STOCK POR PRODUCTO ***")
    print(data_frame_limpio.groupby("nombre")["stock"].max().sort_values(ascending=False))

    print("\n*** MUESTRA DE PRODUCTOS LIMPIOS ***")
    print(data_frame_limpio.head())
