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


def obtener_empleados():
    datos = _get("/empleados")
    return [
        {
            "empleado_id": e.get("empCodigo"),
            "empleado": e.get("empNombre"),
            "correo": e.get("empEmail"),
            "documento": e.get("empId"),
            "cargo": e.get("empCargo"),
            "salario": e.get("empSalario"),
        }
        for e in datos
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


def obtener_ventas():
    datos = _get("/ventas")
    ventas = []

    for v in datos:
        usuario = v.get("usuario") or {}
        empleado = v.get("empleado") or {}

        ventas.append({
            "venta_id": v.get("venCodigo"),
            "fecha": v.get("venFecha"),
            "totalcompra": v.get("venTotal"),
            "usuario_id": usuario.get("usuCodigo"),
            "cliente": _string_or_default(v.get("clienteNombre") or usuario.get("usuNombre")),
            "correo_cliente": _string_or_default(v.get("clienteEmail") or usuario.get("usuEmail")),
            "direccion": _string_or_default(v.get("clienteDireccion")),
            "empleado_id": empleado.get("empCodigo"),
            "empleado": _string_or_default(empleado.get("empNombre")),
            "estado": _string_or_default(v.get("estado"), "pendiente"),
            "plataforma_entrega": _string_or_default(v.get("plataformaEntrega"), "pendiente"),
        })

    return ventas


def obtener_detalles_venta():
    datos = _get("/detalleventas")
    detalles = []

    for d in datos:
        venta = d.get("venta") or {}
        producto = d.get("producto") or {}

        detalles.append({
            "detalle_id": d.get("detCodigo"),
            "venta_id": venta.get("venCodigo"),
            "producto_id": producto.get("proCodigo"),
            "producto": producto.get("proNombre"),
            "precio_unitario": producto.get("proPrecio"),
            "cantidad": d.get("cantidad"),
            "subtotal": d.get("subtotal"),
        })

    return detalles


def obtener_ventas_cliente(documento_o_correo):
    datos = _get(f"/ventas/cliente/{documento_o_correo}")
    return [
        {
            "venta_id": v.get("venCodigo"),
            "fecha": v.get("venFecha"),
            "totalcompra": v.get("venTotal"),
            "usuario_id": v.get("usuCodigo"),
            "cliente": _string_or_default(v.get("usuNombre")),
            "correo_cliente": _string_or_default(v.get("usuEmail")),
            "direccion": _string_or_default(v.get("clienteDireccion")),
            "empleado": _string_or_default(v.get("empleadoNombre")),
            "estado": _string_or_default(v.get("estado"), "pendiente"),
            "plataforma_entrega": _string_or_default(v.get("plataformaEntrega"), "pendiente"),
        }
        for v in datos
    ]


def obtener_productos_mas_vendidos():
    datos = _get("/detalleventas/productos-mas-vendidos")
    return [
        {
            "producto_id": p.get("proCodigo"),
            "producto": p.get("proNombre"),
            "precio": p.get("proPrecio"),
            "cantidad_vendida": p.get("cantidadVendida"),
            "total_vendido": p.get("totalVendido"),
        }
        for p in datos
    ]
