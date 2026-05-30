package com.Cesde.dannysBakery.Repositorio;

import com.Cesde.dannysBakery.DTO.ClienteVentaDTO;
import com.Cesde.dannysBakery.Modelo.MVenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVenta extends JpaRepository<MVenta, Integer> {

    @Query("""
            SELECT new com.Cesde.dannysBakery.DTO.ClienteVentaDTO(
                v.venCodigo,
                v.venFecha,
                v.venTotal,
                u.usuCodigo,
                COALESCE(v.clienteNombre, u.usuNombre),
                COALESCE(v.clienteEmail, u.usuEmail),
                v.clienteDireccion,
                e.empNombre,
                v.estado,
                v.plataformaEntrega
            )
            FROM MVenta v
            LEFT JOIN v.usuario u
            LEFT JOIN v.empleado e
            WHERE u.usuId = :documento
               OR u.usuEmail = :documento
               OR v.clienteEmail = :documento
            ORDER BY v.venFecha DESC
            """)
    List<ClienteVentaDTO> buscarVentasPorCliente(@Param("documento") String documento);

}
