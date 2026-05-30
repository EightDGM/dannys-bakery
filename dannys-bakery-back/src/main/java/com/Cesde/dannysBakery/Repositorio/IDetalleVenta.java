package com.Cesde.dannysBakery.Repositorio;

import com.Cesde.dannysBakery.DTO.ProductoVendidoDTO;
import com.Cesde.dannysBakery.Modelo.MDetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDetalleVenta extends JpaRepository<MDetalleVenta, Integer> {

    @Query("""
            SELECT new com.Cesde.dannysBakery.DTO.ProductoVendidoDTO(
                p.proCodigo,
                p.proNombre,
                p.proPrecio,
                SUM(d.cantidad),
                SUM(d.subtotal)
            )
            FROM MDetalleVenta d
            JOIN d.producto p
            GROUP BY p.proCodigo, p.proNombre, p.proPrecio
            ORDER BY SUM(d.cantidad) DESC
            """)
    List<ProductoVendidoDTO> buscarProductosMasVendidos();

}
