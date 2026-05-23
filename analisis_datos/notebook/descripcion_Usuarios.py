def describir_usuarios(df_usuarios):
    print("\n=== USUARIOS ===")
    print(f"Registros: {len(df_usuarios)}")
    if not df_usuarios.empty:
        print(df_usuarios.info())
        missing = df_usuarios.isna().sum()
        if missing.any():
            print("\nValores faltantes por columna:")
            print(missing[missing > 0])
            print("\nFilas con valores faltantes:")
            print(df_usuarios[df_usuarios.isna().any(axis=1)].head())
        print(df_usuarios.head())
