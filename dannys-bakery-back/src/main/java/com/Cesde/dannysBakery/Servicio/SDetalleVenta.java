package com.Cesde.dannysBakery.Servicio;

import com.Cesde.dannysBakery.DTO.ProductoVendidoDTO;
import com.Cesde.dannysBakery.Modelo.MDetalleVenta;
import com.Cesde.dannysBakery.Repositorio.IDetalleVenta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SDetalleVenta {

    @Autowired
    IDetalleVenta iDetalleVenta;

    // GUARDAR
    public MDetalleVenta adicionarDetalleVenta(MDetalleVenta detalleVenta) throws Exception {

        try {

            return iDetalleVenta.save(detalleVenta);

        } catch (Exception e) {

            throw new Exception("Error al guardar detalle venta");
        }
    }

    // LISTAR
    public List<MDetalleVenta> consultaGeneral() throws Exception {

        try {

            return iDetalleVenta.findAll();

        } catch (Exception e) {

            throw new Exception("Error al listar detalles venta");
        }
    }

    // BUSQUEDA AVANZADA CON DTO: productos mas vendidos
    public List<ProductoVendidoDTO> consultaProductosMasVendidos() throws Exception {
        try {
            return iDetalleVenta.buscarProductosMasVendidos();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    // CONSULTAR POR ID
    public MDetalleVenta consultaPorId(Integer id) throws Exception {

        try {

            Optional<MDetalleVenta> encontrado = iDetalleVenta.findById(id);

            if(encontrado.isPresent()){

                return encontrado.get();

            }else{

                throw new Exception("Detalle venta no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // MODIFICAR
    public MDetalleVenta modificarDetalleVenta(
            Integer id,
            MDetalleVenta detalleVenta
    ) throws Exception {

        try {

            Optional<MDetalleVenta> encontrado = iDetalleVenta.findById(id);

            if(encontrado.isPresent()){

                MDetalleVenta nuevo = encontrado.get();

                nuevo.setCantidad(detalleVenta.getCantidad());
                nuevo.setSubtotal(detalleVenta.getSubtotal());
                nuevo.setProducto(detalleVenta.getProducto());
                nuevo.setVenta(detalleVenta.getVenta());

                return iDetalleVenta.save(nuevo);

            }else{

                throw new Exception("Detalle venta no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public Boolean eliminarDetalleVenta(Integer id) throws Exception {

        try {

            Optional<MDetalleVenta> encontrado = iDetalleVenta.findById(id);

            if(encontrado.isPresent()){

                iDetalleVenta.deleteById(id);

                return true;

            }else{

                throw new Exception("Detalle venta no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }
}
