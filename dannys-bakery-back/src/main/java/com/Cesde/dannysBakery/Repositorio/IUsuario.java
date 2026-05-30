package com.Cesde.dannysBakery.Repositorio;

import com.Cesde.dannysBakery.Modelo.MUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IUsuario extends JpaRepository<MUsuario, Integer> {

    List<MUsuario> findByUsuNombre(String usuNombre);

}




