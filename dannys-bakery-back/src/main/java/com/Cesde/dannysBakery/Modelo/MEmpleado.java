package com.Cesde.dannysBakery.Modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "empleado")
public class MEmpleado {

    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_codigo")
    private Integer empCodigo;

    @Column(name = "emp_nombre", length = 30, nullable = false)
    private String empNombre;

    @Column(name = "emp_email", length = 30, nullable = false, unique = true)
    private String empEmail;

    @Column(name = "emp_id", length = 10, nullable = false)
    private String empId;

    @Column(name = "emp_cargo", length = 30, nullable = false)
    private String empCargo;

    @Column(name = "emp_salario", precision = 10, scale = 2, nullable = false)
    private BigDecimal empSalario;

    // Constructores
    public MEmpleado() {}

    public MEmpleado(String empNombre, String empEmail, String empId, String empCargo, BigDecimal empSalario) {
        this.empNombre = empNombre;
        this.empEmail = empEmail;
        this.empId = empId;
        this.empCargo = empCargo;
        this.empSalario = empSalario;
    }

    // Getters y Setters
    public Integer getEmpCodigo() { return empCodigo; }
    public void setEmpCodigo(Integer empCodigo) { this.empCodigo = empCodigo; }

    public String getEmpNombre() { return empNombre; }
    public void setEmpNombre(String empNombre) { this.empNombre = empNombre; }

    public String getEmpEmail() { return empEmail; }
    public void setEmpEmail(String empEmail) { this.empEmail = empEmail; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getEmpCargo() { return empCargo; }
    public void setEmpCargo(String empCargo) { this.empCargo = empCargo; }

    public BigDecimal getEmpSalario() { return empSalario; }
    public void setEmpSalario(BigDecimal empSalario) { this.empSalario = empSalario; }
}