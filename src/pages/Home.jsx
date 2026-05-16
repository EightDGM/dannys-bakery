import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getProductos } from '../services/storage';
import { listarProductosApi } from '../services/api';
import Navbar from '../components/Navbar';
import heroImage from '../assets/vitrina.png';


const DEFAULT_PRODUCT_IMAGE = '/products/placeholder.svg';

export default function Home() {
  const { puede } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState(() => getProductos());
  const destacados = productos.slice(0, 4);

  useEffect(() => {
    let cancelado = false;

    async function cargarProductos() {
      try {
        const productosApi = await listarProductosApi();
        if (!cancelado) setProductos(productosApi);
      } catch {
        if (!cancelado) setProductos(getProductos());
      }
    }

    cargarProductos();
    return () => { cancelado = true; };
  }, []);

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }

  function stockLabel(stock) {
    if (stock === 0) return <span className="tag-stock-out">Agotado</span>;
    if (stock <= 3) return <span className="tag-stock-low">Pocas unidades ({stock})</span>;
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

      <section className="hero">
        <div className="hero-content">
          <p className="hero-sub">Hecho con amor, horneado cada dia</p>
          <h1 className="hero-title">Bienvenido a<br />Danny's Bakery</h1>
          <p className="hero-desc">
            Pasteles, cupcakes y delicias artesanales preparadas con los mejores
            ingredientes. Cada bocado cuenta una historia dulce.
          </p>
          <button className="btn btn-rose" onClick={() => navigate('/productos')}>
            Ver productos <i className="bi bi-arrow-right"></i>
          </button>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="Productos de Danny's Bakery" />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Lo mas popular</h2>
        <div className="featured-grid">
          {destacados.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <span className="ei"><i className="bi bi-bag"></i></span>
              <p>No hay productos disponibles</p>
            </div>
          ) : (
            destacados.map(p => (
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
                      onClick={() => navigate('/productos')}
                    >
                      <i className="bi bi-bag"></i> Ver productos
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section-alt">
        <h2 className="section-title">Por que elegirnos?</h2>
        <div className="perks-grid">
          {[
            { icon: 'bi-flower1', title: 'Ingredientes naturales', desc: 'Sin conservantes ni artificiales.' },
            { icon: 'bi-heart', title: 'Hecho a pedido', desc: 'Personalizamos para tu ocasion.' },
            { icon: 'bi-truck', title: 'Entrega rapida', desc: 'Fresco directo a tu puerta.' },
            { icon: 'bi-star', title: 'Calidad garantizada', desc: 'Mas de 500 clientes felices.' },
          ].map((p, i) => (
            <div className="perk-card" key={i}>
              <div className="perk-icon"><i className={`bi ${p.icon}`}></i></div>
              <div className="perk-title">{p.title}</div>
              <div className="perk-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo">Danny's Bakery</span>
        <span>2025 - Hecho con dedicacion</span>
      </footer>
    </>
  );
}
