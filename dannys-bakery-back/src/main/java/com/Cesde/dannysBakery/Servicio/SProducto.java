package com.Cesde.dannysBakery.Servicio;

import com.Cesde.dannysBakery.Modelo.MProducto;
import com.Cesde.dannysBakery.Repositorio.IProducto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SProducto {

    @Autowired
    IProducto iProducto;

    // GUARDAR
    public MProducto adicionarProducto(MProducto producto) throws Exception {

        try {

            return iProducto.save(producto);

        } catch (Exception e) {

            throw new Exception("Error al guardar producto");
        }
    }

    // LISTAR
    public List<MProducto> consultaGeneral() throws Exception {

        try {

            return iProducto.findAll();

        } catch (Exception e) {

            throw new Exception("Error al listar productos");
        }
    }

    // CONSULTAR POR ID
    public MProducto consultaPorId(Integer id) throws Exception {

        try {

            Optional<MProducto> encontrado = iProducto.findById(id);

            if(encontrado.isPresent()){

                return encontrado.get();

            }else{

                throw new Exception("Producto no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // MODIFICAR
    public MProducto modificarProducto(Integer id, MProducto producto) throws Exception {

        try {

            Optional<MProducto> encontrado = iProducto.findById(id);

            if(encontrado.isPresent()){

                MProducto nuevo = encontrado.get();

                nuevo.setProNombre(producto.getProNombre());
                nuevo.setProPrecio(producto.getProPrecio());
                nuevo.setProStock(producto.getProStock());
                nuevo.setProImagen(producto.getProImagen());

                return iProducto.save(nuevo);

            }else{

                throw new Exception("Producto no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public Boolean eliminarProducto(Integer id) throws Exception {

        try {

            Optional<MProducto> encontrado = iProducto.findById(id);

            if(encontrado.isPresent()){

                iProducto.deleteById(id);

                return true;

            }else{

                throw new Exception("Producto no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }
}
