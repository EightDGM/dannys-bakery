package com.Cesde.dannysBakery.Modelo;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class MUsuario {

    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usu_codigo")
    private Integer usuCodigo;

    @Column(name = "usu_nombre", length = 30, nullable = false)
    private String usuNombre;

    @Column(name = "usu_email", length = 30, nullable = false)
    private String usuEmail;

    @Column(name = "usu_id", length = 10, nullable = false)
    private String usuId;

    // Constructores
    public MUsuario() {}

    public MUsuario(String usuNombre, String usuEmail, String usuId) {
        this.usuNombre = usuNombre;
        this.usuEmail = usuEmail;
        this.usuId = usuId;
    }

    // Getters y Setters
    public Integer getUsuCodigo() {
        return usuCodigo;
    }

    public void setUsuCodigo(Integer usuCodigo) {
        this.usuCodigo = usuCodigo;
    }

    public String getUsuNombre() {
        return usuNombre;
    }

    public void setUsuNombre(String usuNombre) {
        this.usuNombre = usuNombre;
    }

    public String getUsuEmail() {
        return usuEmail;
    }

    public void setUsuEmail(String usuEmail) {
        this.usuEmail = usuEmail;
    }

    public String getUsuId() {
        return usuId;
    }

    public void setUsuId(String usuId) {
        this.usuId = usuId;
    }
}