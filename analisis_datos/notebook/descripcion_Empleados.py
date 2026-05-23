def describir_empleados(df_empleados):
    print("\n=== EMPLEADOS ===")
    print(f"Registros: {len(df_empleados)}")
    if not df_empleados.empty:
        print(df_empleados.info())
        missing = df_empleados.isna().sum()
        if missing.any():
            print("\nValores faltantes por columna:")
            print(missing[missing > 0])
            print("\nFilas con valores faltantes:")
            print(df_empleados[df_empleados.isna().any(axis=1)].head())
        print(df_empleados.head())
