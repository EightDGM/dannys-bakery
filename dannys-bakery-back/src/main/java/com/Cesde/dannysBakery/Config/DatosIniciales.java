package com.Cesde.dannysBakery.Config;

import com.Cesde.dannysBakery.Modelo.MEmpleado;
import com.Cesde.dannysBakery.Modelo.MProducto;
import com.Cesde.dannysBakery.Modelo.MUsuario;
import com.Cesde.dannysBakery.Repositorio.IEmpleado;
import com.Cesde.dannysBakery.Repositorio.IProducto;
import com.Cesde.dannysBakery.Repositorio.IUsuario;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DatosIniciales {

    @Bean
    CommandLineRunner cargarDatosIniciales(
            IProducto productos,
            IUsuario usuarios,
            IEmpleado empleados
    ) {
        return args -> {
            if (productos.count() == 0) {
                crearProducto(productos, "Torta de Chocolate", 45000, 8, "/products/torta_de_chocolate.png");
                crearProducto(productos, "Cupcake de Vainilla", 8500, 24, "/products/cupcake.png");
                crearProducto(productos, "Galletas de Mantequilla", 12000, 3, "/products/galletas_artesanales.png");
                crearProducto(productos, "Croissant de Jamon", 9000, 15, "/products/croassant_relleno.png");
                crearProducto(productos, "Donut Glaseada", 6500, 0, "/products/donut.png");
                crearProducto(productos, "Pie de Limon", 38000, 5, "/products/lemon_pie.png");
                crearProducto(productos, "Cheesecake de Fresa", 42000, 6, "/products/cheese_cake.png");
                crearProducto(productos, "Pan de Queso", 4500, 20, "/products/pan_de_queso.png");
            }

            if (usuarios.count() == 0) {
                usuarios.save(new MUsuario("Ana Rodriguez", "cliente@bakery.com", "1020304050"));
            }

            if (empleados.count() == 0) {
                empleados.save(new MEmpleado("Danny Lopez", "admin@bakery.com", "1000000001", "admin", new BigDecimal("2500000")));
                empleados.save(new MEmpleado("Carlos Mendoza", "vendedor@bakery.com", "1000000002", "vendedor", new BigDecimal("1800000")));
            }
        };
    }

    private void crearProducto(IProducto productos, String nombre, int precio, int stock, String imagen) {
        MProducto producto = new MProducto(nombre, new BigDecimal(precio), stock);
        producto.setProImagen(imagen);
        productos.save(producto);
    }
}
