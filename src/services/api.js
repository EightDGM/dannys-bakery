const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const DEFAULT_PRODUCT_IMAGE = '/products/placeholder.svg';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error API ${response.status} en ${path}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function productoDesdeApi(producto) {
  return {
    pro_codigo: producto.proCodigo,
    pro_nombre: producto.proNombre,
    pro_precio: Number(producto.proPrecio),
    pro_stock: producto.proStock,
    pro_imagen: producto.proImagen || DEFAULT_PRODUCT_IMAGE,
  };
}

export function productoParaApi(producto) {
  return {
    proNombre: producto.pro_nombre,
    proPrecio: producto.pro_precio,
    proStock: producto.pro_stock,
    proImagen: producto.pro_imagen || DEFAULT_PRODUCT_IMAGE,
  };
}

export function usuarioDesdeApi(usuario) {
  return {
    usu_codigo: usuario.usuCodigo,
    usu_nombre: usuario.usuNombre,
    usu_email: usuario.usuEmail,
    usu_id: usuario.usuId,
  };
}

export function usuarioParaApi(usuario) {
  return {
    usuNombre: usuario.usu_nombre,
    usuEmail: usuario.usu_email,
    usuId: usuario.usu_id,
  };
}

function ventaDesdeApi(venta) {
  return {
    ven_codigo: venta.venCodigo,
    ven_fecha: venta.venFecha,
    ven_total: Number(venta.venTotal),
    usu_codigo: venta.usuario?.usuCodigo || null,
    emp_codigo: venta.empleado?.empCodigo || null,
    cliente: {
      nombre: venta.clienteNombre || venta.usuario?.usuNombre || '',
      email: venta.clienteEmail || venta.usuario?.usuEmail || '',
      direccion: venta.clienteDireccion || '',
    },
    estado: venta.estado || 'pendiente',
    plataforma_entrega: venta.plataformaEntrega || 'pendiente',
    detalle: [],
  };
}

function detalleDesdeApi(detalle) {
  const producto = detalle.producto ? productoDesdeApi(detalle.producto) : null;

  return {
    det_codigo: detalle.detCodigo,
    ven_codigo: detalle.venta?.venCodigo,
    pro_codigo: producto?.pro_codigo,
    pro_nombre: producto?.pro_nombre || `Producto #${producto?.pro_codigo || ''}`,
    pro_precio: producto?.pro_precio || 0,
    pro_imagen: producto?.pro_imagen || DEFAULT_PRODUCT_IMAGE,
    cantidad: detalle.cantidad,
    subtotal: Number(detalle.subtotal),
  };
}

async function buscarUsuarioPorEmail(email) {
  const usuarios = await request('/usuarios');
  return usuarios.map(usuarioDesdeApi).find(usuario => usuario.usu_email === email) || null;
}

async function buscarEmpleadoPorEmail(email) {
  const empleados = await request('/empleados');
  return empleados.find(empleado => empleado.empEmail === email) || null;
}

export async function listarProductosApi() {
  const productos = await request('/productos');
  return productos.map(productoDesdeApi);
}

export async function crearProductoApi(producto) {
  const creado = await request('/productos', {
    method: 'POST',
    body: JSON.stringify(productoParaApi(producto)),
  });
  return productoDesdeApi(creado);
}

export async function actualizarProductoApi(proCodigo, producto) {
  const actualizado = await request(`/productos/${proCodigo}`, {
    method: 'PUT',
    body: JSON.stringify(productoParaApi(producto)),
  });
  return productoDesdeApi(actualizado);
}

export async function eliminarProductoApi(proCodigo) {
  await request(`/productos/${proCodigo}`, { method: 'DELETE' });
  return true;
}

export async function registrarUsuarioApi(form) {
  const usuario = await request('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuarioParaApi({
      usu_nombre: form.usu_nombre,
      usu_email: form.usu_email,
      usu_id: form.usu_id,
    })),
  });

  return usuarioDesdeApi(usuario);
}

export async function listarVentasApi() {
  const [ventas, detalles] = await Promise.all([
    request('/ventas'),
    request('/detalleventas'),
  ]);

  const detallePorVenta = detalles.map(detalleDesdeApi).reduce((acc, detalle) => {
    if (!detalle.ven_codigo) return acc;
    acc[detalle.ven_codigo] = acc[detalle.ven_codigo] || [];
    acc[detalle.ven_codigo].push(detalle);
    return acc;
  }, {});

  return ventas.map(venta => {
    const normalizada = ventaDesdeApi(venta);
    normalizada.detalle = detallePorVenta[normalizada.ven_codigo] || [];
    return normalizada;
  });
}

export async function registrarVentaApi(venta, session) {
  const usuario = session?.email ? await buscarUsuarioPorEmail(session.email) : null;
  const empleado = await buscarEmpleadoPorEmail('vendedor@bakery.com');

  const ventaCreada = await request('/ventas', {
    method: 'POST',
    body: JSON.stringify({
      venFecha: new Date().toISOString().slice(0, 10),
      venTotal: venta.ven_total,
      clienteNombre: venta.cliente?.nombre,
      clienteEmail: venta.cliente?.email,
      clienteDireccion: venta.cliente?.direccion,
      estado: venta.estado || 'pendiente',
      plataformaEntrega: venta.plataforma_entrega || 'pendiente',
      usuario: usuario ? { usuCodigo: usuario.usu_codigo } : null,
      empleado: empleado ? { empCodigo: empleado.empCodigo } : null,
    }),
  });

  const detalles = await Promise.all(venta.detalle.map(detalle =>
    request('/detalleventas', {
      method: 'POST',
      body: JSON.stringify({
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
        venta: { venCodigo: ventaCreada.venCodigo },
        producto: { proCodigo: detalle.pro_codigo },
      }),
    })
  ));

  const normalizada = ventaDesdeApi(ventaCreada);
  normalizada.detalle = detalles.map(detalleDesdeApi);
  return normalizada;
}
