const KEYS = {
  usuarios:  'bakery_usuarios',
  productos: 'bakery_productos',
  ventas:    'bakery_ventas',
  carrito:   'bakery_carrito',
  authUsers: 'bakery_auth_users',
  session:   'bakery_session',
};

//SEED – datos demo al primer arranque 
export function initStorage() {

  if (!localStorage.getItem(KEYS.authUsers)) {
    localStorage.setItem(KEYS.authUsers, JSON.stringify([
      { id: 1, email: 'admin@bakery.com',    pass: 'admin123', rol: 'admin',    nombre: 'Danny López'    },
      { id: 2, email: 'vendedor@bakery.com', pass: 'vend123',  rol: 'vendedor', nombre: 'Carlos Mendoza' },
      { id: 3, email: 'cliente@bakery.com',  pass: 'usu123',   rol: 'usuario',  nombre: 'Ana Rodríguez'  },
    ]));
  }

  // usuario(usu_codigo, usu_nombre, usu_email, usu_id)
  if (!localStorage.getItem(KEYS.usuarios)) {
    localStorage.setItem(KEYS.usuarios, JSON.stringify([
      { usu_codigo: 1, usu_nombre: 'Ana Rodríguez', usu_email: 'ana@email.com',  usu_id: '1020304050' },
      { usu_codigo: 2, usu_nombre: 'Luis Torres',   usu_email: 'luis@email.com', usu_id: '9876543210' },
    ]));
  }

  // producto(pro_codigo, pro_nombre, pro_precio, pro_stock)
  if (!localStorage.getItem(KEYS.productos)) {
    localStorage.setItem(KEYS.productos, JSON.stringify([
      { pro_codigo: 1, pro_nombre: 'Torta de Chocolate',      pro_precio: 45000, pro_stock: 8,  emoji: '🎂' },
      { pro_codigo: 2, pro_nombre: 'Cupcake de Vainilla',     pro_precio: 8500,  pro_stock: 24, emoji: '🧁' },
      { pro_codigo: 3, pro_nombre: 'Galletas de Mantequilla', pro_precio: 12000, pro_stock: 3,  emoji: '🍪' },
      { pro_codigo: 4, pro_nombre: 'Croissant de Jamón',      pro_precio: 9000,  pro_stock: 15, emoji: '🥐' },
      { pro_codigo: 5, pro_nombre: 'Donut Glaseada',          pro_precio: 6500,  pro_stock: 0,  emoji: '🍩' },
      { pro_codigo: 6, pro_nombre: 'Pie de Limón',            pro_precio: 38000, pro_stock: 5,  emoji: '🥧' },
      { pro_codigo: 7, pro_nombre: 'Cheesecake de Fresa',     pro_precio: 42000, pro_stock: 6,  emoji: '🍰' },
      { pro_codigo: 8, pro_nombre: 'Pan de Queso',            pro_precio: 4500,  pro_stock: 20, emoji: '🥖' },
    ]));
  }

  if (!localStorage.getItem(KEYS.ventas)) {
    localStorage.setItem(KEYS.ventas, JSON.stringify([]));
  }

  if (!localStorage.getItem(KEYS.carrito)) {
    localStorage.setItem(KEYS.carrito, JSON.stringify([]));
  }
}

//AUTH
export function getAuthUsers() {
  return JSON.parse(localStorage.getItem(KEYS.authUsers) || '[]');
}

export function getSession() {
  return JSON.parse(localStorage.getItem(KEYS.session) || 'null');
}

export function setSession(user) {
  localStorage.setItem(KEYS.session, JSON.stringify({
    id:     user.id,
    email:  user.email,
    rol:    user.rol,
    nombre: user.nombre,
  }));
}

export function clearSession() {
  localStorage.removeItem(KEYS.session);
}

//PRODUCTOS
export function getProductos() {
  return JSON.parse(localStorage.getItem(KEYS.productos) || '[]');
}

export function saveProductos(lista) {
  localStorage.setItem(KEYS.productos, JSON.stringify(lista));
}

export function agregarProducto(producto) {
  const lista  = getProductos();
  const nextId = lista.length ? Math.max(...lista.map(p => p.pro_codigo)) + 1 : 1;
  const nuevo  = { pro_codigo: nextId, ...producto };
  lista.push(nuevo);
  saveProductos(lista);
  return nuevo;
}

export function editarProducto(pro_codigo, cambios) {
  const lista = getProductos();
  const idx   = lista.findIndex(p => p.pro_codigo === pro_codigo);
  if (idx < 0) return false;
  lista[idx] = { ...lista[idx], ...cambios };
  saveProductos(lista);
  return lista[idx];
}

export function eliminarProducto(pro_codigo) {
  const lista = getProductos().filter(p => p.pro_codigo !== pro_codigo);
  saveProductos(lista);
}

//CARRITO
export function getCarrito() {
  return JSON.parse(localStorage.getItem(KEYS.carrito) || '[]');
}

export function saveCarrito(carrito) {
  localStorage.setItem(KEYS.carrito, JSON.stringify(carrito));
}

export function clearCarrito() {
  localStorage.setItem(KEYS.carrito, JSON.stringify([]));
}

//VENTAS
export function getVentas() {
  return JSON.parse(localStorage.getItem(KEYS.ventas) || '[]');
}

export function registrarVenta(venta) {
  const ventas = getVentas();
  const nextId = ventas.length ? Math.max(...ventas.map(v => v.ven_codigo)) + 1 : 1;

  /* Agregar det_codigo y ven_codigo a cada detalle */
  const detalle = venta.detalle.map((d, i) => ({
    det_codigo: i + 1,
    ven_codigo: nextId,
    pro_codigo: d.pro_codigo,
    cantidad:   d.cantidad,
    subtotal:   d.subtotal
  }));

  const nueva = {
    ven_codigo:  nextId,
    ven_fecha:   venta.ven_fecha,
    ven_total:   venta.ven_total,
    usu_codigo:  venta.usu_codigo || null,
    emp_codigo:  venta.emp_codigo || null,
    cliente:     venta.cliente,
    detalle
  };

  ventas.push(nueva);
  localStorage.setItem(KEYS.ventas, JSON.stringify(ventas));
  return nueva;
}

//PERMISOS POR ROL
export const PERMISOS = {
  usuario: {
    verProductos:      true,
    comprar:           true,
    agregarProductos:  false,
    editarProductos:   false,
    eliminarProductos: false,
    verVentas:         false,
  },
  vendedor: {
    verProductos:      true,
    comprar:           false,
    agregarProductos:  true,
    editarProductos:   true,
    eliminarProductos: false,
    verVentas:         true,
  },
  admin: {
    verProductos:      true,
    comprar:           false,
    agregarProductos:  true,
    editarProductos:   true,
    eliminarProductos: true,
    verVentas:         true,
  },
};

export function puede(session, permiso) {
  if (!session) return false;
  return PERMISOS[session.rol]?.[permiso] === true;
}