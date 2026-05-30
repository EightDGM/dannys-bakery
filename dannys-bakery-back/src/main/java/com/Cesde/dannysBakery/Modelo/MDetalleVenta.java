package com.Cesde.dannysBakery.Modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_venta")
public class MDetalleVenta {

    //Atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "det_codigo")
    private Integer detCodigo;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;

    //Relaciones
    @ManyToOne
    @JoinColumn(name = "ven_codigo", nullable = false)
    private MVenta venta;

    @ManyToOne
    @JoinColumn(name = "pro_codigo", nullable = false)
    private MProducto producto;

    //Constructores
    public MDetalleVenta(Integer detCodigo, Integer cantidad, BigDecimal subtotal, MVenta venta, MProducto producto) {
        this.detCodigo = detCodigo;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
        this.venta = venta;
        this.producto = producto;
    }

    public MDetalleVenta() {}

    // Encapsular
    public Integer getDetCodigo() { return detCodigo; }
    public void setDetCodigo(Integer detCodigo) { this.detCodigo = detCodigo; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public MVenta getVenta() { return venta; }
    public void setVenta(MVenta venta) { this.venta = venta; }

    public MProducto getProducto() { return producto; }
    public void setProducto(MProducto producto) { this.producto = producto; }
}