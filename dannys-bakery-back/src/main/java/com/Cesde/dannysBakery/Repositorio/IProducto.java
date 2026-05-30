package com.Cesde.dannysBakery.Repositorio;

import com.Cesde.dannysBakery.Modelo.MProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProducto extends JpaRepository<MProducto, Integer> {

    List<MProducto> findByProNombre(String proNombre);

}