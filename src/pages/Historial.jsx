import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getVentas } from '../services/storage';
import { listarVentasApi } from '../services/api';
import Navbar from '../components/Navbar';

export default function Historial() {
  const { session, puede } = useAuth();
  const [todasLasVentas, setTodasLasVentas] = useState(() => getVentas());

  useEffect(() => {
    let cancelado = false;

    async function cargarVentas() {
      try {
        const ventasApi = await listarVentasApi();
        if (!cancelado) setTodasLasVentas(ventasApi);
      } catch {
        if (!cancelado) setTodasLasVentas(getVentas());
      }
    }

    cargarVentas();
    return () => { cancelado = true; };
  }, []);

  const ventas = puede('verVentas')
    ? todasLasVentas
    : todasLasVentas.filter(v =>
      v.usu_codigo === session?.id ||
      v.cliente?.email === session?.email
    );

  const [busqueda, setBusqueda] = useState('');
  const [expandido, setExpandido] = useState(null);

  const lista = ventas.filter(v =>
    v.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    String(v.ven_codigo).includes(busqueda)
  );

  function formatPrecio(n) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(n);
  }

  function toggleExpandido(id) {
    setExpandido(expandido === id ? null : id);
  }

  return (
    <>
      <Navbar />

      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--sage), var(--butter))' }}>
        <div className="page-header-title">
          Historial de {puede('verVentas') ? 'Ventas' : 'Pedidos'}
        </div>
        <div className="page-header-sub">{lista.length} registro{lista.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="historial-wrap">
        <div className="historial-bar">
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder={puede('verVentas') ? 'Buscar por cliente o No. pedido...' : 'Buscar por No. pedido...'}
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {lista.length === 0 ? (
          <div className="empty-state">
            <span className="ei"><i className="bi bi-clipboard2"></i></span>
            <p>{busqueda ? 'No se encontraron resultados' : 'No hay registros aun'}</p>
          </div>
        ) : (
          <div className="historial-lista">
            {[...lista].reverse().map(v => (
              <div className="historial-card" key={v.ven_codigo}>
                <div className="historial-card-hd" onClick={() => toggleExpandido(v.ven_codigo)}>
                  <div className="historial-card-left">
                    <span className="historial-id">
                      #PED-{String(v.ven_codigo).padStart(4, '0')}
                    </span>
                    <span className="historial-fecha">{v.ven_fecha}</span>
                    <span className="historial-cliente">{v.cliente?.nombre}</span>
                  </div>
                  <div className="historial-card-right">
                    <span className="historial-total">{formatPrecio(v.ven_total)}</span>
                    <i className={`bi bi-chevron-${expandido === v.ven_codigo ? 'up' : 'down'} historial-chevron`}></i>
                  </div>
                </div>

                {expandido === v.ven_codigo && (
                  <div className="historial-card-body">
                    <div className="historial-detalle-title">Productos</div>
                    {v.detalle?.map((d, i) => (
                      <div className="historial-detalle-row" key={d.det_codigo || i}>
                        <span>{d.pro_nombre || `Producto #${d.pro_codigo}`} x{d.cantidad}</span>
                        <span>{formatPrecio(d.subtotal)}</span>
                      </div>
                    ))}
                    <div className="historial-detalle-row" style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Envio</span>
                      <span>{formatPrecio(v.ven_total - v.detalle?.reduce((s, d) => s + d.subtotal, 0))}</span>
                    </div>
                    <div className="historial-detalle-row">
                      <span style={{ color: 'var(--text-muted)' }}>Estado</span>
                      <span>{v.estado || 'pendiente'}</span>
                    </div>
                    <div className="historial-detalle-row">
                      <span style={{ color: 'var(--text-muted)' }}>Entrega</span>
                      <span>{v.plataforma_entrega || 'pendiente'}</span>
                    </div>
                    <div className="historial-detalle-row historial-total-row">
                      <span>Total</span>
                      <span>{formatPrecio(v.ven_total)}</span>
                    </div>
                    {puede('verVentas') && (
                      <div className="historial-cliente-info">
                        <span><i className="bi bi-envelope"></i> {v.cliente?.email}</span>
                        <span><i className="bi bi-geo-alt"></i> {v.cliente?.direccion}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <span className="footer-logo">Danny's Bakery</span>
        <span>2025 - Hecho con dedicacion</span>
      </footer>
    </>
  );
}
