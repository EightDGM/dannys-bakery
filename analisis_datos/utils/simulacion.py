import random


def generar_simulacion_productos(productos_backend, numero_simulaciones=80):
    simulaciones = []

    for _ in range(numero_simulaciones):
        producto = random.choice(productos_backend)
        simulacion = {
            "producto_id": producto.get("producto_id"),
            "nombre": producto.get("nombre"),
            "precio": producto.get("precio"),
            "stock": producto.get("stock"),
            "imagen": producto.get("imagen"),
        }

        probabilidad_error = random.random()
        if probabilidad_error < 0.15:
            simulacion["producto_id"] = None
        elif probabilidad_error < 0.30:
            simulacion["nombre"] = random.choice(["producto inventado", "pan prueba"])
        elif probabilidad_error < 0.45:
            simulacion["precio"] = random.choice([0, -5000, None])
        elif probabilidad_error < 0.60:
            simulacion["stock"] = random.choice([-10, None])
        elif probabilidad_error < 0.75:
            simulacion["nombre"] = f"  {str(simulacion['nombre']).upper()}  "

        simulaciones.append(simulacion)

    return simulaciones
