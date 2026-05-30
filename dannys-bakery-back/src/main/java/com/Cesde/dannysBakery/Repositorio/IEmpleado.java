package com.Cesde.dannysBakery.Repositorio;

import com.Cesde.dannysBakery.Modelo.MEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IEmpleado extends JpaRepository<MEmpleado, Integer> {

    List<MEmpleado> findByEmpNombre(String empNombre);
    List<MEmpleado> findByEmpCargo(String empCargo);

}