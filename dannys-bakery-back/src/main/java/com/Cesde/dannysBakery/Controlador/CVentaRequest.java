package com.Cesde.dannysBakery.Controlador;

import com.Cesde.dannysBakery.Modelo.MDetalleVenta;
import com.Cesde.dannysBakery.Modelo.MVenta;

import java.util.List;

public class CVentaRequest {

    // Atributos
    private MVenta venta;
    private List<MDetalleVenta> detalles;

    // Constructor vacío
    public CVentaRequest() {
    }

    // Getters y Setters
    public MVenta getVenta() {
        return venta;
    }

    public void setVenta(MVenta venta) {
        this.venta = venta;
    }

    public List<MDetalleVenta> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<MDetalleVenta> detalles) {
        this.detalles = detalles;
    }
}
