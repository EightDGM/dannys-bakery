# Analisis de datos - Danny's Bakery

Este modulo consume los productos reales del backend Spring Boot, genera simulaciones basadas en esa informacion, limpia los datos, transforma la tabla y crea una grafica de barras del stock por producto.

La estructura sigue el orden del proyecto de muestra:

- `main.py`: coordina todo el proceso.
- `notebook/consumo.py`: consume productos desde la API.
- `utils/simulacion.py`: simula datos usando productos reales del backend.
- `notebook/limpieza.py`: corrige errores controlados.
- `notebook/transformacion.py`: agrupa el stock por producto.
- `notebook/descripcion.py`: describe el dataset limpio.
- `notebook/graficacion.py`: genera una grafica de barras.

## Uso

1. Encender el backend:

```powershell
cd C:\Users\Usuario\Desktop\dannys-bakery\dannys-bakery-back
java -jar target\dannysBakery-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

2. En otra terminal, activar el entorno virtual:

```powershell
cd C:\Users\Usuario\Desktop\dannys-bakery\analisis_datos
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\venv\Scripts\Activate.ps1
```

3. Instalar dependencias:

```powershell
.\venv\Scripts\pip.exe install -r requirements.txt
```

4. Ejecutar el analisis:

```powershell
.\venv\Scripts\python.exe main.py
```

El proceso guarda los CSV y JSON en `data/`, y la grafica en `graficos/barras_stock_productos.svg`.
