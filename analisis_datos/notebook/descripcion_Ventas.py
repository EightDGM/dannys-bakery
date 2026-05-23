def describir_ventas(df_ventas):
    print("\n=== VENTAS ===")
    print(f"Registros: {len(df_ventas)}")
    if not df_ventas.empty:
        print(df_ventas.info())
        missing = df_ventas.isna().sum()
        if missing.any():
            print("\nValores faltantes por columna:")
            print(missing[missing > 0])
            print("\nFilas con valores faltantes:")
            print(df_ventas[df_ventas.isna().any(axis=1)].head())
        print("\nResumen numérico:")
        print(df_ventas.describe(include=["number"]))
        print("\nResumen categórico:")
        print(df_ventas.describe(include=["object", "string"]))
        print("\nPrimeras ventas:")
        print(df_ventas.head())
