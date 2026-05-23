def describir_productos(df_productos):
    print("\n=== PRODUCTOS ===")
    print(f"Registros: {len(df_productos)}")
    if not df_productos.empty:
        print(df_productos.info())
        missing = df_productos.isna().sum()
        if missing.any():
            print("\nValores faltantes por columna:")
            print(missing[missing > 0])
            print("\nFilas con valores faltantes:")
            print(df_productos[df_productos.isna().any(axis=1)].head())
        print(df_productos.describe(include="all"))
        print("\nPrimeros productos:")
        print(df_productos.head())
        if "stock" in df_productos.columns:
            disponibles = df_productos[df_productos["stock"] > 0]
            print(f"\nProductos disponibles: {len(disponibles)}")
            if not disponibles.empty:
                print(disponibles[["producto_id", "nombre", "precio", "stock"]].head(10))
