package com.Cesde.dannysBakery.Servicio;

import com.Cesde.dannysBakery.Modelo.MUsuario;
import com.Cesde.dannysBakery.Repositorio.IUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SUsuario {

    @Autowired
    IUsuario iUsuario;

    // GUARDAR
    public MUsuario adicionarUsuario(MUsuario usuario) throws Exception {
        try {
            return iUsuario.save(usuario);
        } catch (Exception e) {
            throw new Exception("Error al guardar usuario");
        }
    }

    // LISTAR
    public List<MUsuario> consultaGeneral() throws Exception {
        try {
            return iUsuario.findAll();
        } catch (Exception e) {
            throw new Exception("Error al listar usuarios");
        }
    }

    // CONSULTAR POR ID
    public MUsuario consultaPorId(Integer id) throws Exception {

        try {

            Optional<MUsuario> encontrado = iUsuario.findById(id);

            if(encontrado.isPresent()){
                return encontrado.get();
            }else{
                throw new Exception("Usuario no encontrado");
            }

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // MODIFICAR
    public MUsuario modificarUsuario(Integer id, MUsuario usuario) throws Exception {

        try {

            Optional<MUsuario> encontrado = iUsuario.findById(id);

            if(encontrado.isPresent()){

                MUsuario nuevo = encontrado.get();

                nuevo.setUsuNombre(usuario.getUsuNombre());
                nuevo.setUsuEmail(usuario.getUsuEmail());
                nuevo.setUsuId(usuario.getUsuId());

                return iUsuario.save(nuevo);

            }else{
                throw new Exception("Usuario no encontrado");
            }

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public Boolean eliminarUsuario(Integer id) throws Exception {

        try {

            Optional<MUsuario> encontrado = iUsuario.findById(id);

            if(encontrado.isPresent()){

                iUsuario.deleteById(id);
                return true;

            }else{
                throw new Exception("Usuario no encontrado");
            }

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}