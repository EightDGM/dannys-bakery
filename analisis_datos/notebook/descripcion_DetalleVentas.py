def describir_detalle_ventas(df_detalles):
    print("\n=== DETALLE DE VENTAS ===")
    print(f"Registros: {len(df_detalles)}")
    if not df_detalles.empty:
        print(df_detalles.info())
        missing = df_detalles.isna().sum()
        if missing.any():
            print("\nValores faltantes por columna:")
            print(missing[missing > 0])
            print("\nFilas con valores faltantes:")
            print(df_detalles[df_detalles.isna().any(axis=1)].head())
        print(df_detalles.describe(include="all"))
        print("\nPrimeros detalles de venta:")
        print(df_detalles.head())
