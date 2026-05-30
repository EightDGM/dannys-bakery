# Danny's Bakery Backend

API Spring Boot para Danny's Bakery.

## Ejecutar con MySQL

Requiere MySQL encendido en `localhost:3306`.

```bash
.\mvnw.cmd spring-boot:run
```

Configuracion principal:

- Base de datos: `dannysbakery`
- Usuario: `root`
- Password: vacio
- Puerto API: `8080`

## Ejecutar sin MySQL para entrega/local

Usa H2 en memoria y carga datos iniciales automaticamente.

```bash
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

Tambien se puede ejecutar el JAR:

```bash
java -jar target\dannysBakery-0.0.1-SNAPSHOT.jar --spring.profiles.active=local
```

Consola H2:

`http://localhost:8080/h2-console`

JDBC URL:

`jdbc:h2:mem:dannysbakery`

## Endpoints

- `GET /productos`
- `POST /productos`
- `PUT /productos/{id}`
- `DELETE /productos/{id}`
- `GET /usuarios`
- `POST /usuarios`
- `GET /empleados`
- `GET /ventas`
- `POST /ventas`
- `GET /detalleventas`
- `POST /detalleventas`
