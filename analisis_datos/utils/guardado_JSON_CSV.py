import os


def guardar_data(data_frame, nombre_archivo, carpeta=None):
    if carpeta is None:
        carpeta = os.path.join(os.path.dirname(__file__), "..", "data")
    carpeta = os.path.abspath(carpeta)
    os.makedirs(carpeta, exist_ok=True)

    ruta_csv = os.path.join(carpeta, f"{nombre_archivo}.csv")
    ruta_json = os.path.join(carpeta, f"{nombre_archivo}.json")

    data_frame.to_csv(ruta_csv, index=False, encoding="utf-8")
    data_frame.to_json(ruta_json, orient="records", force_ascii=False, indent=2)

    print(f"  Guardado: {ruta_csv}")
    print(f"  Guardado: {ruta_json}")
