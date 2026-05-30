from utils.api_client import obtener_productos


def consumir_productos():
    datos = obtener_productos()
    print(f"Productos recibidos del backend: {len(datos)}")
    return datos
