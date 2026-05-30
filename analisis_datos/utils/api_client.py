import requests


BASE_URL = "http://localhost:8080"
TIMEOUT = 10


def _get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    try:
        respuesta = requests.get(url, timeout=TIMEOUT)
        respuesta.raise_for_status()
        return respuesta.json()
    except requests.exceptions.RequestException as error:
        raise RuntimeError(
            f"No se pudo consumir {url}. Verifica que el backend este encendido."
        ) from error


def _string_or_default(valor, defecto=""):
    if valor is None:
        return defecto
    texto = str(valor).strip()
    return texto if texto else defecto


def obtener_usuarios():
    datos = _get("/usuarios")
    return [
        {
            "usuario_id": u.get("usuCodigo"),
            "cliente": u.get("usuNombre"),
            "correo": u.get("usuEmail"),
            "documento": u.get("usuId"),
        }
        for u in datos
    ]


def obtener_productos():
    datos = _get("/productos")
    return [
        {
            "producto_id": p.get("proCodigo"),
            "nombre": p.get("proNombre"),
            "precio": p.get("proPrecio"),
            "stock": p.get("proStock"),
            "imagen": p.get("proImagen"),
        }
        for p in datos
    ]
