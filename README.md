# Danny's Bakery

Proyecto integrador de panaderia con frontend en React, backend en Spring Boot y modulo de analisis de datos en Python.

## Requisitos para otro PC

Antes de clonar y ejecutar el proyecto, instalar:

- Git
- Node.js LTS
- JDK 21
- Python 3
- XAMPP con MySQL

Para el backend con XAMPP, encender solamente **MySQL**. Apache no es necesario para Spring Boot.

## Clonar el proyecto

Desde `cmd`:

```bat
git clone URL_DEL_REPOSITORIO
cd dannys-bakery
```

Cambiar `URL_DEL_REPOSITORIO` por la URL real de GitHub cuando ya este subido.

## 1. Ejecutar backend

Abrir una terminal `cmd` en la carpeta del backend:

```bat
cd dannys-bakery-back
mvnw.cmd spring-boot:run
```

El backend queda en:

```text
http://localhost:8080
```

Configuracion de base de datos usada con XAMPP:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dannysbakery?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

La base de datos `dannysbakery` se crea automaticamente si MySQL esta encendido.

### Opcion sin XAMPP

Para probar sin MySQL, usar el perfil local con H2:

```bat
cd dannys-bakery-back
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

## 2. Ejecutar frontend

Abrir otra terminal `cmd` en la raiz del proyecto:

```bat
npm install
npm run dev
```

El frontend normalmente queda en:

```text
http://localhost:5173
```

El frontend consume el backend desde:

```text
http://localhost:8080
```

Por eso primero debe estar encendido el backend.

## 3. Ejecutar analisis de datos

El analisis consume datos reales del backend, por eso tambien necesita que el backend este encendido.

Abrir otra terminal `cmd`:

```bat
cd analisis_datos
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

El analisis genera archivos en:

```text
analisis_datos\data
```

Y la grafica de stock de productos en:

```text
analisis_datos\graficos\barras_stock_productos.svg
```

## Orden recomendado para ejecutar todo

1. Encender MySQL en XAMPP.
2. Ejecutar backend en `dannys-bakery-back`.
3. Ejecutar frontend en la raiz del proyecto.
4. Ejecutar analisis de datos en `analisis_datos`.

## Comandos rapidos

Backend:

```bat
cd dannys-bakery-back
mvnw.cmd spring-boot:run
```

Frontend:

```bat
npm install
npm run dev
```

Analisis:

```bat
cd analisis_datos
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
python main.py
```

## Carpetas que no se deben subir

Estas carpetas se generan en cada PC y no deberian subirse al repositorio:

```text
node_modules
dist
analisis_datos\venv
__pycache__
```

## Endpoints principales del backend

```text
GET    /productos
POST   /productos
GET    /productos/{id}
PUT    /productos/{id}
DELETE /productos/{id}

GET    /usuarios
POST   /usuarios
GET    /usuarios/{id}
PUT    /usuarios/{id}
DELETE /usuarios/{id}

GET    /empleados
POST   /empleados
GET    /empleados/{id}
PUT    /empleados/{id}
DELETE /empleados/{id}

GET    /ventas
POST   /ventas
GET    /ventas/{id}
PUT    /ventas/{id}
DELETE /ventas/{id}
GET    /ventas/cliente/{documento}

GET    /detalleventas
POST   /detalleventas
GET    /detalleventas/{id}
PUT    /detalleventas/{id}
DELETE /detalleventas/{id}
GET    /detalleventas/productos-mas-vendidos
```
