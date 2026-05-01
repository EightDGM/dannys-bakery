Danny's Bakery

Aplicación web de panadería desarrollada con React + Vite. Permite a los usuarios explorar productos, gestionar el carrito de compras y registrar pedidos. Los administradores y vendedores pueden gestionar el inventario.

---

# Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/EightDGM/dannys-bakery.git

# Entrar a la carpeta
cd dannys-bakery

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

#Protección de Rutas

Las rutas privadas están envueltas en el componente `RutaProtegida.jsx`. Este componente lee la sesión activa desde `localStorage` a través del contexto `AuthContext`. Si no hay sesión, redirige automáticamente a `/login`.

```jsx
// App.jsx
<Route path="/" element={<RutaProtegida><Home /></RutaProtegida>} />
```

```jsx
// RutaProtegida.jsx
if (!session) return <Navigate to="/login" replace />;
return children;
```

---

# Roles y Permisos

| Permiso | Usuario | Vendedor | Admin |
| Ver productos | ✅ | ✅ | ✅ |
| Comprar | ✅ | X | X |
| Agregar/editar productos | X | ✅ | ✅ |
| Eliminar productos | X | X | ✅ |
| Ver historial de ventas | X | ✅ | ✅ |

# Cuentas demo

| Correo | Contraseña | Rol |
| admin@bakery.com | admin123 | Admin |
| vendedor@bakery.com | vend123 | Vendedor |
| cliente@bakery.com | usu123 | Usuario |

---

# Arquitectura de Datos

Toda la lógica de datos está centralizada en `src/services/storage.js`. Los componentes nunca acceden directamente a `localStorage` — siempre importan las funciones del servicio.

# Modelo de datos (alineado con el backend)
usuario     ->   usu_codigo, usu_nombre, usu_email, usu_id
producto    ->   pro_codigo, pro_nombre, pro_precio, pro_stock
venta       ->   ven_codigo, ven_fecha, ven_total, usu_codigo, emp_codigo
detalle_venta -> det_codigo, ven_codigo, pro_codigo, cantidad, subtotal