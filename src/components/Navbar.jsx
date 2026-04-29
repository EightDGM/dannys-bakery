import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCarrito } from '../services/storage';

export default function Navbar() {
  const { session, logout, puede } = useAuth();
  const navigate = useNavigate();
  const carrito  = getCarrito();
  const totalItems = carrito.reduce((sum, i) => sum + i.cantidad, 0);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">🎂</span>
        <span className="nav-name">Danny's Bakery</span>
      </div>

      <div className="nav-links">
        {puede('verProductos') && (
          <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Inicio
          </NavLink>
        )}

        {puede('verProductos') && (
          <NavLink to="/productos" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Productos
          </NavLink>
        )}

        {puede('comprar') && (
          <NavLink to="/carrito" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            🛒 Carrito
            <span className="cart-badge">{totalItems}</span>
          </NavLink>
        )}

        <div className="nav-divider"></div>

        <span className="nav-user-nombre">{session?.nombre}</span>
        <span className={`tag-rol-${session?.rol}`}>{session?.rol}</span>

        <button className="nav-logout" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}