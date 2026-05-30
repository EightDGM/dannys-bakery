package com.Cesde.dannysBakery.Controlador;

import com.Cesde.dannysBakery.Modelo.MEmpleado;
import com.Cesde.dannysBakery.Servicio.SEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/empleados")
@CrossOrigin("*")
public class CEmpleado {

    @Autowired
    SEmpleado sEmpleado;

    // GUARDAR
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody MEmpleado empleado) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(sEmpleado.adicionarEmpleado(empleado));
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
                    .body(sEmpleado.consultaGeneral());
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
                    .body(sEmpleado.consultaPorId(id));
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
            @RequestBody MEmpleado empleado
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sEmpleado.modificarEmpleado(id, empleado));
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
                    .body(sEmpleado.eliminarEmpleado(id));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }
}
