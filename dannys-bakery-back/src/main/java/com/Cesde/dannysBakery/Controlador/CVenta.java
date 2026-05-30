package com.Cesde.dannysBakery.Controlador;

import com.Cesde.dannysBakery.Modelo.MVenta;
import com.Cesde.dannysBakery.Servicio.SVenta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ventas")
@CrossOrigin("*")
public class CVenta {

    @Autowired
    SVenta sVenta;

    // GUARDAR
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody MVenta venta) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(sVenta.adicionarVenta(venta));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // LISTAR
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sVenta.consultaGeneral());
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // BUSQUEDA AVANZADA CON DTO: ventas por cliente
    @GetMapping("/cliente/{documento}")
    public ResponseEntity<?> consultaVentasPorCliente(@PathVariable String documento) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sVenta.consultaVentasPorCliente(documento));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // CONSULTAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sVenta.consultaPorId(id));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error.getMessage());
        }
    }

    // MODIFICAR
    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(
            @PathVariable Integer id,
            @RequestBody MVenta venta
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sVenta.modificarVenta(id, venta));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sVenta.eliminarVenta(id));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }
}
