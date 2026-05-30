package com.Cesde.dannysBakery.Controlador;

import com.Cesde.dannysBakery.Modelo.MDetalleVenta;
import com.Cesde.dannysBakery.Servicio.SDetalleVenta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/detalleventas")
@CrossOrigin("*")
public class CDetalleVenta {

    @Autowired
    SDetalleVenta sDetalleVenta;

    // GUARDAR
    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody MDetalleVenta detalleVenta
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(sDetalleVenta.adicionarDetalleVenta(detalleVenta));
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
                    .body(sDetalleVenta.consultaGeneral());
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // BUSQUEDA AVANZADA CON DTO: productos mas vendidos
    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<?> consultaProductosMasVendidos() {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sDetalleVenta.consultaProductosMasVendidos());
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // CONSULTAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Integer id
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sDetalleVenta.consultaPorId(id));
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
            @RequestBody MDetalleVenta detalleVenta
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sDetalleVenta.modificarDetalleVenta(id, detalleVenta));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer id
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sDetalleVenta.eliminarDetalleVenta(id));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }
}
