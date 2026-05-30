package com.Cesde.dannysBakery.Controlador;

import com.Cesde.dannysBakery.Modelo.MUsuario;
import com.Cesde.dannysBakery.Servicio.SUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class CUsuario {

    @Autowired
    SUsuario sUsuario;

    // GUARDAR
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody MUsuario usuario) {
        try {
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(sUsuario.adicionarUsuario(usuario));
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
                    .body(sUsuario.consultaGeneral());
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
                    .body(sUsuario.consultaPorId(id));
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
            @RequestBody MUsuario usuario
    ) {
        try {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(sUsuario.modificarUsuario(id, usuario));
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
                    .body(sUsuario.eliminarUsuario(id));
        } catch (Exception error) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error.getMessage());
        }
    }
}
