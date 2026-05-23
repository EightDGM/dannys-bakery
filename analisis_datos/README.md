# Analisis de datos - Danny's Bakery

Este modulo consume los datos reales del backend Spring Boot en `http://localhost:8080`.

Por defecto solo transforma y guarda datos. Los graficos son opcionales para no exigir `matplotlib` durante la entrega basica.

## Uso recomendado

1. Encender el backend con H2 local:

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

3. Instalar las dependencias de transformacion:

```powershell
.\venv\Scripts\pip.exe install -r requirements.txt
```

4. Ejecutar el analisis sin graficos:

```powershell
.\venv\Scripts\python.exe main.py
```

El script guarda archivos transformados en `data/`.

## Graficos opcionales

Solo si se necesitan graficos, instalar la dependencia extra y ejecutar con `--graficos`:

```powershell
.\venv\Scripts\pip.exe install -r requirements-graficos.txt
.\venv\Scripts\python.exe main.py --graficos
```

Los graficos se guardan en `graficos/`.
