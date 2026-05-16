import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
  getCarrito,
  saveCarrito,
  clearCarrito,
  getProductos,
  saveProductos,
  registrarVenta,
} from '../services/storage';
import {
  actualizarProductoApi,
  listarProductosApi,
  registrarVentaApi,
} from '../services/api';
import Navbar from '../components/Navbar';

const DEFAULT_PRODUCT_IMAGE = '/products/placeholder.svg';
let nextToastId = 0;

export default function Carrito() {
  const { session, puede } = useAuth();
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(() => getCarrito(session));
  const [confirmado, setConfirmado] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({
    nombre: session?.nombre || '',
    email: session?.email || '',
    direccion: '',
  });
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    if (!puede('comprar')) navigate('/productos');
  }, [puede, navigate]);

  function toast(msg, type = '') {
    const id = ++nextToastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  function persistirCarrito(nuevo) {
    saveCarrito(nuevo, session);
    setCarrito(nuevo);
    window.dispatchEvent(new Event('carritoActualizado'));
  }

  function cambiarCantidad(pro_codigo, delta) {
    const productos = getProductos();
    const producto = productos.find(p => p.pro_codigo === pro_codigo);
    const nuevo = carrito.map(i => {
      if (i.pro_codigo !== pro_codigo) return i;
      const nuevaCantidad = i.cantidad + delta;
      if (nuevaCantidad <= 0) return null;
      if (producto && nuevaCantidad > producto.pro_stock) {
        toast('No hay mas stock disponible', 'err');
        return i;
      }
      return { ...i, cantidad: nuevaCantidad };
    }).filter(Boolean);

    persistirCarrito(nuevo);
  }

  function eliminarItem(pro_codigo) {
    persistirCarrito(carrito.filter(i => i.pro_codigo !== pro_codigo));
    toast('Producto eliminado del carrito');
  }

  function vaciar() {
    clearCarrito(session);
    setCarrito([]);
    window.dispatchEvent(new Event('carritoActualizado'));
    toast('Carrito vaciado');
  }

  const subtotal = carrito.reduce((s, i) => s + i.pro_precio * i.cantidad, 0);
  const envio = subtotal > 0 ? 8000 : 0;
  const total = subtotal + envio;
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  async function confirmarCompra() {
    if (!form.nombre || !form.email || !form.direccion) {
      setFormErr('Completa todos los campos');
      return;
    }

    let productos = getProductos();
    let apiActiva;

    try {
      productos = await listarProductosApi();
      apiActiva = true;
    } catch {
      apiActiva = false;
    }

    for (const item of carrito) {
      const p = productos.find(x => x.pro_codigo === item.pro_codigo);
      if (!p || item.cantidad > p.pro_stock) {
        toast('Stock insuficiente en uno de los productos', 'err');
        return;
      }
    }

    const productosActualizados = productos.map(producto => {
      const item = carrito.find(i => i.pro_codigo === producto.pro_codigo);
      if (!item) return producto;
      return {
        ...producto,
        pro_stock: Math.max(0, producto.pro_stock - item.cantidad),
      };
    });

    if (apiActiva) {
      await Promise.all(productosActualizados.map(producto => {
        const original = productos.find(p => p.pro_codigo === producto.pro_codigo);
        if (original?.pro_stock === producto.pro_stock) return Promise.resolve();
        return actualizarProductoApi(producto.pro_codigo, producto);
      }));
    } else {
      carrito.forEach(item => {
      const p = productos.find(x => x.pro_codigo === item.pro_codigo);
      if (p) p.pro_stock = Math.max(0, p.pro_stock - item.cantidad);
      });
      saveProductos(productos);
    }

    const ventaData = {
      ven_fecha: new Date().toLocaleDateString('es-CO'),
      ven_total: total,
      usu_codigo: session?.id,
      emp_codigo: null,
      cliente: form,
      detalle: carrito.map(i => ({
        pro_codigo: i.pro_codigo,
        pro_nombre: i.pro_nombre,
        pro_precio: i.pro_precio,
        pro_imagen: i.pro_imagen || DEFAULT_PRODUCT_IMAGE,
        cantidad: i.cantidad,
        subtotal: i.pro_precio * i.cantidad,
      })),
    };

    const venta = apiActiva
      ? await registrarVentaApi(ventaData, session)
      : registrarVenta(ventaData);

    clearCarrito(session);
    setCarrito([]);
    window.dispatchEvent(new Event('carritoActualizado'));
    setConfirmado(venta);
    setForm({ nombre: session?.nombre || '', email: session?.email || '', direccion: '' });
    setFormErr('');
  }

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }

  function image(src, alt) {
    return (
      <img
        src={src || DEFAULT_PRODUCT_IMAGE}
        alt={alt}
        onError={e => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
      />
    );
  }

  if (confirmado) {
    return (
      <>
        <Navbar />
        <div className="confirm-view">
          <div className="confirm-icon"><i className="bi bi-check-circle-fill"></i></div>
          <div className="confirm-title">Pedido confirmado</div>
          <div className="confirm-sub">Gracias por tu compra. Pronto recibiras tus productos.</div>

          <div className="confirm-card">
            <div className="confirm-card-title">Detalle del pedido</div>
            <div className="confirm-row">
              <span className="lbl">No. Pedido</span>
              <span style={{ fontWeight: 700, color: 'var(--rose-dk)' }}>
                #PED-{String(confirmado.ven_codigo).padStart(4, '0')}
              </span>
            </div>
            <div className="confirm-row">
              <span className="lbl">Fecha</span>
              <span>{confirmado.ven_fecha}</span>
            </div>
            <div className="confirm-row">
              <span className="lbl">Cliente</span>
              <span>{confirmado.cliente.nombre}</span>
            </div>
            <div className="confirm-row">
              <span className="lbl">Email</span>
              <span>{confirmado.cliente.email}</span>
            </div>
          </div>

          <div className="confirm-card">
            <div className="confirm-card-title">Productos</div>
            {confirmado.detalle.map(d => (
              <div className="conf-item" key={d.det_codigo}>
                <span>{d.pro_nombre} x{d.cantidad}</span>
                <span>{formatPrecio(d.subtotal)}</span>
              </div>
            ))}
            <div className="confirm-total-row">
              <span>Total pagado</span>
              <span style={{ color: 'var(--rose-dk)' }}>{formatPrecio(confirmado.ven_total)}</span>
            </div>
          </div>

          <div className="confirm-actions">
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              <i className="bi bi-house"></i> Volver al inicio
            </button>
            <button className="btn btn-rose" onClick={() => navigate('/productos')}>
              <i className="bi bi-bag"></i> Seguir comprando
            </button>
          </div>
        </div>

        <footer className="footer">
          <span className="footer-logo">Danny's Bakery</span>
          <span>2025 - Hecho con dedicacion</span>
        </footer>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--peach), var(--butter))' }}>
        <div className="page-header-title">Tu Carrito</div>
        <div className="page-header-sub">{totalItems} producto{totalItems !== 1 ? 's' : ''}</div>
      </div>

      <div className="carrito-layout">
        <div>
          <div className="carrito-lista-wrap">
            <div className="carrito-lista-hd">
              <span className="carrito-lista-title">Productos seleccionados</span>
              <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '7px 14px' }} onClick={vaciar}>
                <i className="bi bi-trash"></i> Vaciar
              </button>
            </div>
            <div className="carrito-lista">
              {carrito.length === 0 ? (
                <div className="empty-state">
                  <span className="ei"><i className="bi bi-cart3"></i></span>
                  <p>Tu carrito esta vacio</p>
                  <button className="btn btn-rose" style={{ marginTop: 16 }} onClick={() => navigate('/productos')}>
                    Ver productos
                  </button>
                </div>
              ) : (
                carrito.map(item => (
                  <div className="cart-item" key={item.pro_codigo}>
                    <div className="cart-item-emoji">{image(item.pro_imagen, item.pro_nombre)}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.pro_nombre}</div>
                      <div className="cart-item-price">{formatPrecio(item.pro_precio)} c/u</div>
                    </div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.pro_codigo, -1)}>-</button>
                      <span className="qty-num">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.pro_codigo, +1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">{formatPrecio(item.pro_precio * item.cantidad)}</div>
                    <button className="cart-item-del" onClick={() => eliminarItem(item.pro_codigo)} aria-label="Eliminar">
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-outline" onClick={() => navigate('/productos')}>
              <i className="bi bi-arrow-left"></i> Seguir comprando
            </button>
          </div>
        </div>

        {carrito.length > 0 && (
          <div className="panel-right">
            <div className="resumen-card">
              <div className="resumen-hd">Resumen del pedido</div>
              <div className="resumen-body">
                <div className="resumen-row">
                  <span className="lbl">Subtotal</span>
                  <span className="val">{formatPrecio(subtotal)}</span>
                </div>
                <div className="resumen-row">
                  <span className="lbl">Envio</span>
                  <span className="val">{formatPrecio(envio)}</span>
                </div>
              </div>
              <div className="resumen-total">
                <span className="lbl">Total</span>
                <span className="val">{formatPrecio(total)}</span>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-hd">Datos de entrega</div>
              <div className="form-card-body">
                <div className="form-field">
                  <label className="form-label">Nombre completo *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Ana Rodriguez"
                    value={form.nombre}
                    onChange={e => { setForm({ ...form, nombre: e.target.value }); setFormErr(''); }}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Correo electronico *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="ana@email.com"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setFormErr(''); }}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Direccion de entrega *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Calle 123 # 45-67"
                    value={form.direccion}
                    onChange={e => { setForm({ ...form, direccion: e.target.value }); setFormErr(''); }}
                  />
                </div>
                {formErr && (
                  <div style={{ color: '#C62828', fontSize: '0.82rem', fontWeight: 600 }}>{formErr}</div>
                )}
                <button
                  className="btn btn-rose"
                  style={{ width: '100%', justifyContent: 'center', padding: 13 }}
                  onClick={confirmarCompra}
                >
                  <i className="bi bi-check2-circle"></i> Confirmar compra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="toasts-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>

      <footer className="footer">
        <span className="footer-logo">Danny's Bakery</span>
        <span>2025 - Hecho con dedicacion</span>
      </footer>
    </>
  );
}
