package com.Cesde.dannysBakery.DTO;

import java.math.BigDecimal;

public class ProductoVendidoDTO {

    private Integer proCodigo;
    private String proNombre;
    private BigDecimal proPrecio;
    private Integer cantidadVendida;
    private BigDecimal totalVendido;

    public ProductoVendidoDTO(
            Integer proCodigo,
            String proNombre,
            BigDecimal proPrecio,
            Long cantidadVendida,
            BigDecimal totalVendido
    ) {
        this.proCodigo = proCodigo;
        this.proNombre = proNombre;
        this.proPrecio = proPrecio;
        this.cantidadVendida = cantidadVendida == null ? 0 : cantidadVendida.intValue();
        this.totalVendido = totalVendido;
    }

    public Integer getProCodigo() { return proCodigo; }
    public void setProCodigo(Integer proCodigo) { this.proCodigo = proCodigo; }

    public String getProNombre() { return proNombre; }
    public void setProNombre(String proNombre) { this.proNombre = proNombre; }

    public BigDecimal getProPrecio() { return proPrecio; }
    public void setProPrecio(BigDecimal proPrecio) { this.proPrecio = proPrecio; }

    public Integer getCantidadVendida() { return cantidadVendida; }
    public void setCantidadVendida(Integer cantidadVendida) { this.cantidadVendida = cantidadVendida; }

    public BigDecimal getTotalVendido() { return totalVendido; }
    public void setTotalVendido(BigDecimal totalVendido) { this.totalVendido = totalVendido; }
}
