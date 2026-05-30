const KEYS = {
  usuarios: 'bakery_usuarios',
  productos: 'bakery_productos',
  ventas: 'bakery_ventas',
  authUsers: 'bakery_auth_users',
  session: 'bakery_session',
};

const DEFAULT_PRODUCT_IMAGE = '/products/placeholder.svg';
const PRODUCT_IMAGES = {
  'Torta de Chocolate': '/products/torta_de_chocolate.png',
  'Cupcake de Vainilla': '/products/cupcake.png',
  'Galletas de Mantequilla': '/products/galletas_artesanales.png',
  'Croissant de Jamon': '/products/croassant_relleno.png',
  'Donut Glaseada': '/products/donut.png',
  'Pie de Limon': '/products/lemon_pie.png',
  'Cheesecake de Fresa': '/products/cheese_cake.png',
  'Pan de Queso': '/products/pan_de_queso.png',
};

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function carritoKey(session) {
  return session?.id ? `bakery_carrito_usuario_${session.id}` : 'bakery_carrito_invitado';
}

function normalizeProducto(producto) {
  const imagenPorNombre = PRODUCT_IMAGES[producto.pro_nombre];
  const imagenActual = producto.pro_imagen;

  return {
    ...producto,
    pro_imagen: !imagenActual || imagenActual === DEFAULT_PRODUCT_IMAGE
      ? imagenPorNombre || DEFAULT_PRODUCT_IMAGE
      : imagenActual,
  };
}

// Datos demo al primer arranque. Esta capa simula la API mientras se conecta el backend real.
export function initStorage() {
  if (!localStorage.getItem(KEYS.authUsers)) {
    writeJson(KEYS.authUsers, [
      { id: 1, email: 'admin@bakery.com', pass: 'admin123', rol: 'admin', nombre: 'Danny Lopez' },
      { id: 2, email: 'vendedor@bakery.com', pass: 'vend123', rol: 'vendedor', nombre: 'Carlos Mendoza' },
      { id: 3, email: 'cliente@bakery.com', pass: 'usu123', rol: 'usuario', nombre: 'Ana Rodriguez' },
    ]);
  }

  if (!localStorage.getItem(KEYS.usuarios)) {
    writeJson(KEYS.usuarios, [
      { usu_codigo: 3, auth_id: 3, usu_nombre: 'Ana Rodriguez', usu_email: 'cliente@bakery.com', usu_id: '1020304050' },
      { usu_codigo: 4, auth_id: null, usu_nombre: 'Luis Torres', usu_email: 'luis@email.com', usu_id: '9876543210' },
    ]);
  }

  if (!localStorage.getItem(KEYS.productos)) {
    writeJson(KEYS.productos, [
      { pro_codigo: 1, pro_nombre: 'Torta de Chocolate', pro_precio: 45000, pro_stock: 8, pro_imagen: PRODUCT_IMAGES['Torta de Chocolate'] },
      { pro_codigo: 2, pro_nombre: 'Cupcake de Vainilla', pro_precio: 8500, pro_stock: 24, pro_imagen: PRODUCT_IMAGES['Cupcake de Vainilla'] },
      { pro_codigo: 3, pro_nombre: 'Galletas de Mantequilla', pro_precio: 12000, pro_stock: 3, pro_imagen: PRODUCT_IMAGES['Galletas de Mantequilla'] },
      { pro_codigo: 4, pro_nombre: 'Croissant de Jamon', pro_precio: 9000, pro_stock: 15, pro_imagen: PRODUCT_IMAGES['Croissant de Jamon'] },
      { pro_codigo: 5, pro_nombre: 'Donut Glaseada', pro_precio: 6500, pro_stock: 0, pro_imagen: PRODUCT_IMAGES['Donut Glaseada'] },
      { pro_codigo: 6, pro_nombre: 'Pie de Limon', pro_precio: 38000, pro_stock: 5, pro_imagen: PRODUCT_IMAGES['Pie de Limon'] },
      { pro_codigo: 7, pro_nombre: 'Cheesecake de Fresa', pro_precio: 42000, pro_stock: 6, pro_imagen: PRODUCT_IMAGES['Cheesecake de Fresa'] },
      { pro_codigo: 8, pro_nombre: 'Pan de Queso', pro_precio: 4500, pro_stock: 20, pro_imagen: PRODUCT_IMAGES['Pan de Queso'] },
    ]);
  }

  if (!localStorage.getItem(KEYS.ventas)) {
    writeJson(KEYS.ventas, []);
  }
}

// Auth
export function getAuthUsers() {
  return readJson(KEYS.authUsers, []);
}

export function saveAuthUsers(users) {
  writeJson(KEYS.authUsers, users);
}

export function getSession() {
  return readJson(KEYS.session, null);
}

export function setSession(user) {
  writeJson(KEYS.session, {
    id: user.id,
    email: user.email,
    rol: user.rol,
    nombre: user.nombre,
  });
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}

// Usuarios
export function getUsuarios() {
  return readJson(KEYS.usuarios, []);
}

export function saveUsuarios(usuarios) {
  writeJson(KEYS.usuarios, usuarios);
}

export function registrarUsuario(form) {
  const authUsers = getAuthUsers();
  const existe = authUsers.find(u => u.email === form.usu_email);
  if (existe) return { ok: false, error: 'Ya existe una cuenta con ese correo' };

  const nextAuthId = authUsers.length ? Math.max(...authUsers.map(u => u.id)) + 1 : 1;
  const nuevoAuthUser = {
    id: nextAuthId,
    email: form.usu_email,
    pass: form.pass,
    rol: 'usuario',
    nombre: form.usu_nombre,
  };

  const usuarios = getUsuarios();
  const nextUsuarioId = usuarios.length ? Math.max(...usuarios.map(u => u.usu_codigo)) + 1 : 1;
  const nuevoUsuario = {
    usu_codigo: nextUsuarioId,
    auth_id: nextAuthId,
    usu_nombre: form.usu_nombre,
    usu_email: form.usu_email,
    usu_id: form.usu_id,
    tipoDocumento: form.tipoDocumento,
    edad: Number.parseInt(form.edad, 10),
  };

  saveAuthUsers([...authUsers, nuevoAuthUser]);
  saveUsuarios([...usuarios, nuevoUsuario]);

  return { ok: true, user: nuevoAuthUser, usuario: nuevoUsuario };
}

// Productos
export function getProductos() {
  return readJson(KEYS.productos, []).map(normalizeProducto);
}

export function saveProductos(lista) {
  writeJson(KEYS.productos, lista.map(normalizeProducto));
}

export function agregarProducto(producto) {
  const lista = getProductos();
  const nextId = lista.length ? Math.max(...lista.map(p => p.pro_codigo)) + 1 : 1;
  const nuevo = normalizeProducto({ pro_codigo: nextId, ...producto });
  saveProductos([...lista, nuevo]);
  return nuevo;
}

export function editarProducto(pro_codigo, cambios) {
  const lista = getProductos();
  const idx = lista.findIndex(p => p.pro_codigo === pro_codigo);
  if (idx < 0) return false;
  lista[idx] = normalizeProducto({ ...lista[idx], ...cambios });
  saveProductos(lista);
  return lista[idx];
}

export function eliminarProducto(pro_codigo) {
  saveProductos(getProductos().filter(p => p.pro_codigo !== pro_codigo));
}

// Carrito por usuario
export function getCarrito(session = getSession()) {
  return readJson(carritoKey(session), []);
}

export function saveCarrito(carrito, session = getSession()) {
  writeJson(carritoKey(session), carrito);
}

export function clearCarrito(session = getSession()) {
  writeJson(carritoKey(session), []);
}

// Ventas
export function getVentas() {
  return readJson(KEYS.ventas, []);
}

export function registrarVenta(venta) {
  const ventas = getVentas();
  const nextId = ventas.length ? Math.max(...ventas.map(v => v.ven_codigo)) + 1 : 1;

  const detalle = venta.detalle.map((d, i) => ({
    det_codigo: i + 1,
    ven_codigo: nextId,
    pro_codigo: d.pro_codigo,
    pro_nombre: d.pro_nombre,
    pro_precio: d.pro_precio,
    pro_imagen: d.pro_imagen || DEFAULT_PRODUCT_IMAGE,
    cantidad: d.cantidad,
    subtotal: d.subtotal,
  }));

  const nueva = {
    ven_codigo: nextId,
    ven_fecha: venta.ven_fecha,
    ven_total: venta.ven_total,
    usu_codigo: venta.usu_codigo || null,
    emp_codigo: venta.emp_codigo || null,
    cliente: venta.cliente,
    estado: venta.estado || 'pendiente',
    plataforma_entrega: venta.plataforma_entrega || 'pendiente',
    detalle,
  };

  writeJson(KEYS.ventas, [...ventas, nueva]);
  return nueva;
}

export function actualizarEntregaVenta(venCodigo, plataformaEntrega) {
  const ventas = getVentas();
  const actualizadas = ventas.map(venta =>
    venta.ven_codigo === venCodigo
      ? { ...venta, plataforma_entrega: plataformaEntrega }
      : venta
  );

  writeJson(KEYS.ventas, actualizadas);
  return actualizadas.find(venta => venta.ven_codigo === venCodigo) || null;
}

// Permisos por rol
export const PERMISOS = {
  usuario: {
    verProductos: true,
    comprar: true,
    agregarProductos: false,
    editarProductos: false,
    eliminarProductos: false,
    verVentas: false,
    verHistorialPropio: true,
  },
  vendedor: {
    verProductos: true,
    comprar: false,
    agregarProductos: true,
    editarProductos: true,
    eliminarProductos: false,
    verVentas: true,
    verHistorialPropio: false,
  },
  admin: {
    verProductos: true,
    comprar: false,
    agregarProductos: true,
    editarProductos: true,
    eliminarProductos: true,
    verVentas: true,
    verHistorialPropio: false,
  },
};

export function puede(session, permiso) {
  if (!session) return false;
  return PERMISOS[session.rol]?.[permiso] === true;
}
