import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductos } from '../services/storage';
import Navbar from '../components/Navbar';

export default function Home() {
  const { puede } = useAuth();
  const navigate  = useNavigate();
  const productos = getProductos();
  const destacados = productos.slice(0, 4);

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(n);
  }

  function stockLabel(stock) {
    if (stock === 0) return <span className="tag-stock-out">✕ Agotado</span>;
    if (stock <= 3)  return <span className="tag-stock-low">⚠ Pocas unidades ({stock})</span>;
    return             <span className="tag-stock-ok">✓ Disponible</span>;
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-sub">Hecho con amor, horneado cada día</p>
          <h1 className="hero-title">Bienvenido a<br />Danny's Bakery</h1>
          <p className="hero-desc">
            Pasteles, cupcakes y delicias artesanales preparadas con los mejores
            ingredientes. Cada bocado cuenta una historia dulce.
          </p>
          <button className="btn btn-rose" onClick={() => navigate('/productos')}>
            Ver productos 🧁
          </button>
        </div>
        <div className="hero-visual">
          <div className="hero-circle">🎂</div>
          <div className="hero-float f1">🧁</div>
          <div className="hero-float f2">🍪</div>
          <div className="hero-float f3">🥐</div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="section">
        <h2 className="section-title">Lo más popular</h2>
        <div className="featured-grid">
          {destacados.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <span className="ei">🧁</span>
              <p>No hay productos disponibles</p>
            </div>
          ) : (
            destacados.map(p => (
              <div className="product-card" key={p.pro_codigo}>
                <div className="product-card-img">{p.emoji}</div>
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
                      🛒 Ver productos
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* PERKS */}
      <section className="section-alt">
        <h2 className="section-title">¿Por qué elegirnos?</h2>
        <div className="perks-grid">
          {[
            { icon: '🌿', title: 'Ingredientes naturales', desc: 'Sin conservantes ni artificiales.' },
            { icon: '🤝', title: 'Hecho a pedido',         desc: 'Personalizamos para tu ocasión.' },
            { icon: '🚚', title: 'Entrega rápida',         desc: 'Fresco directo a tu puerta.'     },
            { icon: '⭐', title: 'Calidad garantizada',    desc: 'Más de 500 clientes felices.'    },
          ].map((p, i) => (
            <div className="perk-card" key={i}>
              <div className="perk-icon">{p.icon}</div>
              <div className="perk-title">{p.title}</div>
              <div className="perk-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span className="footer-logo">🎂 Danny's Bakery</span>
        <span>© 2025 · Hecho con 🤍</span>
      </footer>
    </>
  );
}