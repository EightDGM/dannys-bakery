package com.Cesde.dannysBakery.Modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "producto")
public class MProducto {

    // Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pro_codigo")
    private Integer proCodigo;

    @Column(name = "pro_nombre", length = 30, nullable = false, unique = true)
    private String proNombre;

    @Column(name = "pro_precio", precision = 10, scale = 2, nullable = false)
    private BigDecimal proPrecio;

    @Column(name = "pro_stock", nullable = false)
    private Integer proStock;

    @Column(name = "pro_imagen", length = 255)
    private String proImagen;

    // Constructores
    public MProducto() {}

    public MProducto(String proNombre, BigDecimal proPrecio, Integer proStock) {
        this.proNombre = proNombre;
        this.proPrecio = proPrecio;
        this.proStock = proStock;
    }

    // Getters y Setters
    public Integer getProCodigo() { return proCodigo; }
    public void setProCodigo(Integer proCodigo) { this.proCodigo = proCodigo; }

    public String getProNombre() { return proNombre; }
    public void setProNombre(String proNombre) { this.proNombre = proNombre; }

    public BigDecimal getProPrecio() { return proPrecio; }
    public void setProPrecio(BigDecimal proPrecio) { this.proPrecio = proPrecio; }

    public Integer getProStock() { return proStock; }
    public void setProStock(Integer proStock) { this.proStock = proStock; }

    public String getProImagen() { return proImagen; }
    public void setProImagen(String proImagen) { this.proImagen = proImagen; }
}
