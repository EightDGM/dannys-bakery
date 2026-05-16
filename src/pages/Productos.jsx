import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  getProductos,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  getCarrito,
  saveCarrito,
} from '../services/storage';
import {
  actualizarProductoApi,
  crearProductoApi,
  eliminarProductoApi,
  listarProductosApi,
} from '../services/api';
import Navbar from '../components/Navbar';

const DEFAULT_PRODUCT_IMAGE = '/products/placeholder.svg';
let nextToastId = 0;

export default function Productos() {
  const { session, puede } = useAuth();
  const [productos, setProductos] = useState(() => getProductos());
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [apiActiva, setApiActiva] = useState(false);

  const [form, setForm] = useState({
    pro_nombre: '',
    pro_precio: '',
    pro_stock: '',
    pro_imagen: DEFAULT_PRODUCT_IMAGE,
  });
  const [formErr, setFormErr] = useState('');

  function toast(msg, type = '') {
    const id = ++nextToastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        const productosApi = await listarProductosApi();
        if (cancelado) return;
        setProductos(productosApi);
        setApiActiva(true);
      } catch {
        if (cancelado) return;
        setProductos(getProductos());
        setApiActiva(false);
      }
    }

    cargarProductos();
    return () => { cancelado = true; };
  }, []);

  const lista = productos.filter(p =>
    p.pro_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  function agregarAlCarrito(pro_codigo) {
    const producto = productos.find(p => p.pro_codigo === pro_codigo);
    if (!producto || producto.pro_stock === 0) return;

    const carrito = getCarrito(session);
    const existe = carrito.find(i => i.pro_codigo === pro_codigo);

    if (existe) {
      if (existe.cantidad >= producto.pro_stock) {
        toast('No hay mas stock disponible', 'err');
        return;
      }
      existe.cantidad++;
    } else {
      carrito.push({
        pro_codigo: producto.pro_codigo,
        pro_nombre: producto.pro_nombre,
        pro_precio: producto.pro_precio,
        pro_imagen: producto.pro_imagen || DEFAULT_PRODUCT_IMAGE,
        cantidad: 1,
      });
    }

    saveCarrito(carrito, session);
    toast(`${producto.pro_nombre} agregado al carrito`, 'ok');
    window.dispatchEvent(new Event('carritoActualizado'));
  }

  function abrirAgregar() {
    setEditando(null);
    setForm({ pro_nombre: '', pro_precio: '', pro_stock: '', pro_imagen: DEFAULT_PRODUCT_IMAGE });
    setFormErr('');
    setModal(true);
  }

  function abrirEditar(p) {
    setEditando(p.pro_codigo);
    setForm({
      pro_nombre: p.pro_nombre,
      pro_precio: p.pro_precio,
      pro_stock: p.pro_stock,
      pro_imagen: p.pro_imagen || DEFAULT_PRODUCT_IMAGE,
    });
    setFormErr('');
    setModal(true);
  }

  async function guardar() {
    if (!form.pro_nombre || !form.pro_precio || form.pro_stock === '') {
      setFormErr('Completa todos los campos obligatorios');
      return;
    }

    const precio = Number.parseFloat(form.pro_precio);
    const stock = Number.parseInt(form.pro_stock, 10);
    if (Number.isNaN(precio) || precio < 0 || Number.isNaN(stock) || stock < 0) {
      setFormErr('El precio y el stock deben ser valores validos');
      return;
    }

    const datos = {
      pro_nombre: form.pro_nombre.trim(),
      pro_precio: precio,
      pro_stock: stock,
      pro_imagen: form.pro_imagen.trim() || DEFAULT_PRODUCT_IMAGE,
    };

    if (editando) {
      if (apiActiva) {
        await actualizarProductoApi(editando, datos);
        setProductos(await listarProductosApi());
      } else {
        editarProducto(editando, datos);
        setProductos(getProductos());
      }
      toast('Producto actualizado', 'ok');
    } else {
      if (apiActiva) {
        await crearProductoApi(datos);
        setProductos(await listarProductosApi());
      } else {
        agregarProducto(datos);
        setProductos(getProductos());
      }
      toast('Producto agregado', 'ok');
    }

    setModal(false);
  }

  async function handleEliminar(pro_codigo) {
    if (!confirm('Eliminar este producto?')) return;

    if (apiActiva) {
      await eliminarProductoApi(pro_codigo);
      setProductos(await listarProductosApi());
    } else {
      eliminarProducto(pro_codigo);
      setProductos(getProductos());
    }

    toast('Producto eliminado');
  }

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }

  function stockLabel(stock) {
    if (stock === 0) return <span className="tag-stock-out">Agotado</span>;
    if (stock <= 3) return <span className="tag-stock-low">Pocas ({stock})</span>;
    return <span className="tag-stock-ok">Disponible</span>;
  }

  function productImage(src, alt) {
    return (
      <img
        src={src || DEFAULT_PRODUCT_IMAGE}
        alt={alt}
        onError={e => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }}
      />
    );
  }

  return (
    <>
      <Navbar />

      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--rose), var(--peach))' }}>
        <div className="page-header-title">Nuestros Productos</div>
        <div className="page-header-sub">Delicias frescas horneadas cada dia</div>
      </div>

      {puede('editarProductos') && (
        <div className="gestion-bar">
          <div className="gestion-bar-inner">
            <span className="gestion-label"><i className="bi bi-gear"></i> Modo gestion de inventario</span>
            <button className="btn btn-rose" onClick={abrirAgregar}>
              <i className="bi bi-plus-lg"></i> Agregar producto
            </button>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <span className="filter-count">{lista.length} producto{lista.length !== 1 ? 's' : ''}</span>
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="productos-wrap">
        <div className="productos-grid">
          {lista.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <span className="ei"><i className="bi bi-search"></i></span>
              <p>No se encontraron productos</p>
            </div>
          ) : (
            lista.map(p => (
              <div className="product-card" key={p.pro_codigo}>
                <div className="product-card-img">{productImage(p.pro_imagen, p.pro_nombre)}</div>
                <div className="product-card-body">
                  <div className="product-card-name">{p.pro_nombre}</div>
                  <div className="product-card-price">{formatPrecio(p.pro_precio)}</div>
                  <div className="product-card-stock">{stockLabel(p.pro_stock)}</div>
                </div>
                {puede('comprar') && (
                  <div className="product-card-footer">
                    <button
                      className="btn btn-rose"
                      disabled={p.pro_stock === 0}
                      onClick={() => agregarAlCarrito(p.pro_codigo)}
                    >
                      <i className="bi bi-cart-plus"></i> Agregar al carrito
                    </button>
                  </div>
                )}
                {puede('editarProductos') && (
                  <div className="product-card-actions">
                    <button
                      className="btn btn-outline"
                      style={{ flex: 1, justifyContent: 'center', padding: '7px' }}
                      onClick={() => abrirEditar(p)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                    {puede('eliminarProductos') && (
                      <button
                        className="btn btn-danger"
                        style={{ padding: '7px 12px' }}
                        onClick={() => handleEliminar(p.pro_codigo)}
                        aria-label="Eliminar producto"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay open" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-hd">
              <div className="modal-title">{editando ? 'Editar producto' : 'Agregar producto'}</div>
              <button className="modal-close" onClick={() => setModal(false)} aria-label="Cerrar">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label className="form-label">Nombre *</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.pro_nombre}
                  onChange={e => setForm({ ...form, pro_nombre: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-field">
                  <label className="form-label">Precio (COP) *</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.pro_precio}
                    onChange={e => setForm({ ...form, pro_precio: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Stock *</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.pro_stock}
                    onChange={e => setForm({ ...form, pro_stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: 20 }}>
                <label className="form-label">URL de imagen</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="/products/torta-chocolate.jpg"
                  value={form.pro_imagen}
                  onChange={e => setForm({ ...form, pro_imagen: e.target.value })}
                />
              </div>
              {formErr && (
                <div style={{ color: '#C62828', fontSize: '0.8rem', marginBottom: 12, fontWeight: 600 }}>
                  {formErr}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
                <button className="btn btn-rose" onClick={guardar}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
