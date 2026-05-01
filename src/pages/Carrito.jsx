import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getCarrito, saveCarrito, clearCarrito,
  getProductos, saveProductos, registrarVenta
} from '../services/storage';
import Navbar from '../components/Navbar';

export default function Carrito() {
  const { session, puede } = useAuth();
  const navigate = useNavigate();

  const [carrito, setCarrito]       = useState(() => getCarrito());
  const [confirmado, setConfirmado] = useState(null);
  const [toasts, setToasts]         = useState([]);

  const [form, setForm] = useState({
    nombre: '', email: '', direccion: ''
  });
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    if (!puede('comprar')) navigate('/productos');
  }, [puede, navigate]);

  function toast(msg, type = '') {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  function cambiarCantidad(pro_codigo, delta) {
    const productos = getProductos();
    const producto  = productos.find(p => p.pro_codigo === pro_codigo);
    const nuevo = carrito.map(i => {
      if (i.pro_codigo !== pro_codigo) return i;
      const nuevaCantidad = i.cantidad + delta;
      if (nuevaCantidad <= 0) return null;
      if (producto && nuevaCantidad > producto.pro_stock) {
        toast('No hay más stock disponible', 'err');
        return i;
      }
      return { ...i, cantidad: nuevaCantidad };
    }).filter(Boolean);
    saveCarrito(nuevo);
    setCarrito(nuevo);
    window.dispatchEvent(new Event('carritoActualizado'));
  }

  function eliminarItem(pro_codigo) {
    const nuevo = carrito.filter(i => i.pro_codigo !== pro_codigo);
    saveCarrito(nuevo);
    setCarrito(nuevo);
    window.dispatchEvent(new Event('carritoActualizado'));
    toast('Producto eliminado del carrito');
  }

  function vaciar() {
    clearCarrito();
    setCarrito([]);
    window.dispatchEvent(new Event('carritoActualizado'));
    toast('Carrito vaciado');
  }

  const subtotal   = carrito.reduce((s, i) => s + i.pro_precio * i.cantidad, 0);
  const envio      = subtotal > 0 ? 8000 : 0;
  const total      = subtotal + envio;
  const totalItems = carrito.reduce((s, i) => s + i.cantidad, 0);

  function confirmarCompra() {
    if (!form.nombre || !form.email || !form.direccion) {
      setFormErr('Completa todos los campos');
      return;
    }

    const productos = getProductos();

    for (let item of carrito) {
      const p = productos.find(x => x.pro_codigo === item.pro_codigo);
      if (!p || item.cantidad > p.pro_stock) {
        toast('Stock insuficiente en uno de los productos', 'err');
        return;
      }
    }

    carrito.forEach(item => {
      const p = productos.find(x => x.pro_codigo === item.pro_codigo);
      if (p) p.pro_stock = Math.max(0, p.pro_stock - item.cantidad);
    });
    saveProductos(productos);

    const venta = registrarVenta({
    ven_fecha:  new Date().toLocaleDateString('es-CO'),
    ven_total:  total,
    usu_codigo: session?.rol === 'usuario'  ? session?.id : null,
    emp_codigo: session?.rol !== 'usuario'  ? session?.id : null,
    cliente:    form,
    detalle:    carrito.map(i => ({
    pro_codigo: i.pro_codigo,
    cantidad:   i.cantidad,
    subtotal:   i.pro_precio * i.cantidad
  }))
});

    clearCarrito();
    setCarrito([]);
    window.dispatchEvent(new Event('carritoActualizado'));
    setConfirmado(venta);
    setForm({ nombre: '', email: '', direccion: '' });
    setFormErr('');
  }

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(n);
  }

  if (confirmado) {
    return (
      <>
        <Navbar />
        <div className="confirm-view">
          <div className="confirm-icon">🎉</div>
          <div className="confirm-title">¡Pedido confirmado!</div>
          <div className="confirm-sub">Gracias por tu compra. Pronto recibirás tus delicias.</div>

          <div className="confirm-card">
            <div className="confirm-card-title">🧾 Detalle del pedido</div>
            <div className="confirm-row">
              <span className="lbl">N° Pedido</span>
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
            <div className="confirm-card-title">🧁 Productos</div>
            {confirmado.detalle.map((d, i) => {
              const p = getProductos().find(x => x.pro_codigo === d.pro_codigo);
              return (
                <div className="conf-item" key={i}>
                  <span>{p?.emoji} {p?.pro_nombre} ×{d.cantidad}</span>
                  <span>{formatPrecio(d.subtotal)}</span>
                </div>
              );
            })}
            <div className="confirm-total-row">
              <span>Total pagado</span>
              <span style={{ color: 'var(--rose-dk)' }}>{formatPrecio(confirmado.ven_total)}</span>
            </div>
          </div>

          <div className="confirm-actions">
            <button className="btn btn-outline" onClick={() => navigate('/')}>🏠 Volver al inicio</button>
            <button className="btn btn-rose"    onClick={() => navigate('/productos')}>🧁 Seguir comprando</button>
          </div>
        </div>

        <footer className="footer">
          <span className="footer-logo">🎂 Danny's Bakery</span>
          <span>© 2025 · Hecho con 🤍</span>
        </footer>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--peach), var(--butter))' }}>
        <div className="page-header-title">🛒 Tu Carrito</div>
        <div className="page-header-sub">{totalItems} producto{totalItems !== 1 ? 's' : ''}</div>
      </div>

      <div className="carrito-layout">

        <div>
          <div className="carrito-lista-wrap">
            <div className="carrito-lista-hd">
              <span className="carrito-lista-title">Productos seleccionados</span>
              <button className="btn btn-ghost" style={{ fontSize: '0.78rem', padding: '7px 14px' }} onClick={vaciar}>
                🗑️ Vaciar
              </button>
            </div>
            <div className="carrito-lista">
              {carrito.length === 0 ? (
                <div className="empty-state">
                  <span className="ei">🛒</span>
                  <p>Tu carrito está vacío</p>
                  <button className="btn btn-rose" style={{ marginTop: 16 }} onClick={() => navigate('/productos')}>
                    Ver productos
                  </button>
                </div>
              ) : (
                carrito.map(item => (
                  <div className="cart-item" key={item.pro_codigo}>
                    <div className="cart-item-emoji">{item.emoji}</div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.pro_nombre}</div>
                      <div className="cart-item-price">{formatPrecio(item.pro_precio)} c/u</div>
                    </div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.pro_codigo, -1)}>−</button>
                      <span className="qty-num">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => cambiarCantidad(item.pro_codigo, +1)}>+</button>
                    </div>
                    <div className="cart-item-subtotal">{formatPrecio(item.pro_precio * item.cantidad)}</div>
                    <button className="cart-item-del" onClick={() => eliminarItem(item.pro_codigo)}>✕</button>
                  </div>
                ))
              )}
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-outline" onClick={() => navigate('/productos')}>← Seguir comprando</button>
          </div>
        </div>

        {carrito.length > 0 && (
          <div className="panel-right">
            <div className="resumen-card">
              <div className="resumen-hd">📋 Resumen del pedido</div>
              <div className="resumen-body">
                <div className="resumen-row">
                  <span className="lbl">Subtotal</span>
                  <span className="val">{formatPrecio(subtotal)}</span>
                </div>
                <div className="resumen-row">
                  <span className="lbl">Envío</span>
                  <span className="val">{formatPrecio(envio)}</span>
                </div>
              </div>
              <div className="resumen-total">
                <span className="lbl">Total</span>
                <span className="val">{formatPrecio(total)}</span>
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-hd">📦 Datos de entrega</div>
              <div className="form-card-body">
                <div className="form-field">
                  <label className="form-label">Nombre completo *</label>
                  <input className="form-input" type="text" placeholder="Ana Rodríguez"
                    value={form.nombre}
                    onChange={e => { setForm({ ...form, nombre: e.target.value }); setFormErr(''); }} />
                </div>
                <div className="form-field">
                  <label className="form-label">Correo electrónico *</label>
                  <input className="form-input" type="email" placeholder="ana@email.com"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setFormErr(''); }} />
                </div>
                <div className="form-field">
                  <label className="form-label">Dirección de entrega *</label>
                  <input className="form-input" type="text" placeholder="Calle 123 # 45-67"
                    value={form.direccion}
                    onChange={e => { setForm({ ...form, direccion: e.target.value }); setFormErr(''); }} />
                </div>
                {formErr && (
                  <div style={{ color: '#C62828', fontSize: '0.82rem', fontWeight: 600 }}>{formErr}</div>
                )}
                <button
                  className="btn btn-rose"
                  style={{ width: '100%', justifyContent: 'center', padding: 13 }}
                  onClick={confirmarCompra}
                >
                  ✅ Confirmar compra
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
        <span className="footer-logo">🎂 Danny's Bakery</span>
        <span>© 2025 · Hecho con 🤍</span>
      </footer>
    </>
  );
}