import os


RUTA_ANALISIS = os.path.dirname(os.path.dirname(__file__))


def guardar_data(data_frame, nombre_archivo, carpeta="data"):
    ruta_carpeta = os.path.join(RUTA_ANALISIS, carpeta)
    os.makedirs(ruta_carpeta, exist_ok=True)

    ruta_csv = os.path.join(ruta_carpeta, f"{nombre_archivo}.csv")
    ruta_json = os.path.join(ruta_carpeta, f"{nombre_archivo}.json")

    data_frame.to_csv(ruta_csv, index=False, encoding="utf-8")
    data_frame.to_json(ruta_json, orient="records", force_ascii=False, indent=2)

    print(f"  Guardado: {ruta_csv}")
    print(f"  Guardado: {ruta_json}")
