package com.Cesde.dannysBakery.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ClienteVentaDTO {

    private Integer venCodigo;
    private LocalDate venFecha;
    private BigDecimal venTotal;
    private Integer usuCodigo;
    private String usuNombre;
    private String usuEmail;
    private String clienteDireccion;
    private String empleadoNombre;
    private String estado;
    private String plataformaEntrega;

    public ClienteVentaDTO(
            Integer venCodigo,
            LocalDate venFecha,
            BigDecimal venTotal,
            Integer usuCodigo,
            String usuNombre,
            String usuEmail,
            String clienteDireccion,
            String empleadoNombre,
            String estado,
            String plataformaEntrega
    ) {
        this.venCodigo = venCodigo;
        this.venFecha = venFecha;
        this.venTotal = venTotal;
        this.usuCodigo = usuCodigo;
        this.usuNombre = usuNombre;
        this.usuEmail = usuEmail;
        this.clienteDireccion = clienteDireccion;
        this.empleadoNombre = empleadoNombre;
        this.estado = estado;
        this.plataformaEntrega = plataformaEntrega;
    }

    public Integer getVenCodigo() { return venCodigo; }
    public void setVenCodigo(Integer venCodigo) { this.venCodigo = venCodigo; }

    public LocalDate getVenFecha() { return venFecha; }
    public void setVenFecha(LocalDate venFecha) { this.venFecha = venFecha; }

    public BigDecimal getVenTotal() { return venTotal; }
    public void setVenTotal(BigDecimal venTotal) { this.venTotal = venTotal; }

    public Integer getUsuCodigo() { return usuCodigo; }
    public void setUsuCodigo(Integer usuCodigo) { this.usuCodigo = usuCodigo; }

    public String getUsuNombre() { return usuNombre; }
    public void setUsuNombre(String usuNombre) { this.usuNombre = usuNombre; }

    public String getUsuEmail() { return usuEmail; }
    public void setUsuEmail(String usuEmail) { this.usuEmail = usuEmail; }

    public String getClienteDireccion() { return clienteDireccion; }
    public void setClienteDireccion(String clienteDireccion) { this.clienteDireccion = clienteDireccion; }

    public String getEmpleadoNombre() { return empleadoNombre; }
    public void setEmpleadoNombre(String empleadoNombre) { this.empleadoNombre = empleadoNombre; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getPlataformaEntrega() { return plataformaEntrega; }
    public void setPlataformaEntrega(String plataformaEntrega) { this.plataformaEntrega = plataformaEntrega; }
}
