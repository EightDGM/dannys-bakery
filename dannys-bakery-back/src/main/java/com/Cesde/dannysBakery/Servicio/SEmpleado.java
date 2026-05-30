package com.Cesde.dannysBakery.Servicio;

import com.Cesde.dannysBakery.Modelo.MEmpleado;
import com.Cesde.dannysBakery.Repositorio.IEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SEmpleado {

    @Autowired
    IEmpleado iEmpleado;

    // GUARDAR
    public MEmpleado adicionarEmpleado(MEmpleado empleado) throws Exception {

        try {

            return iEmpleado.save(empleado);

        } catch (Exception e) {

            throw new Exception("Error al guardar empleado");
        }
    }

    // LISTAR
    public List<MEmpleado> consultaGeneral() throws Exception {

        try {

            return iEmpleado.findAll();

        } catch (Exception e) {

            throw new Exception("Error al listar empleados");
        }
    }

    // CONSULTAR POR ID
    public MEmpleado consultaPorId(Integer id) throws Exception {

        try {

            Optional<MEmpleado> encontrado = iEmpleado.findById(id);

            if(encontrado.isPresent()){

                return encontrado.get();

            }else{

                throw new Exception("Empleado no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // MODIFICAR
    public MEmpleado modificarEmpleado(Integer id, MEmpleado empleado) throws Exception {

        try {

            Optional<MEmpleado> encontrado = iEmpleado.findById(id);

            if(encontrado.isPresent()){

                MEmpleado nuevo = encontrado.get();

                nuevo.setEmpNombre(empleado.getEmpNombre());
                nuevo.setEmpEmail(empleado.getEmpEmail());
                nuevo.setEmpId(empleado.getEmpId());
                nuevo.setEmpCargo(empleado.getEmpCargo());
                nuevo.setEmpSalario(empleado.getEmpSalario());

                return iEmpleado.save(nuevo);

            }else{

                throw new Exception("Empleado no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }

    // ELIMINAR
    public Boolean eliminarEmpleado(Integer id) throws Exception {

        try {

            Optional<MEmpleado> encontrado = iEmpleado.findById(id);

            if(encontrado.isPresent()){

                iEmpleado.deleteById(id);

                return true;

            }else{

                throw new Exception("Empleado no encontrado");
            }

        } catch (Exception e) {

            throw new Exception(e.getMessage());
        }
    }
}