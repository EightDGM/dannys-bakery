import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthUsers } from '../services/storage';

export default function Login() {
  const { login, session } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]     = useState('');
  const [pass, setPass]       = useState('');
  const [error, setError]     = useState('');
  const [verPass, setVerPass] = useState(false);

  /* Si ya hay sesión, redirigir */
  if (session) {
    navigate(session.rol === 'usuario' ? '/productos' : '/');
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!email || !pass) {
      setError('Completa todos los campos');
      return;
    }
    const users = getAuthUsers();
    const found = users.find(u => u.email === email && u.pass === pass);
    if (!found) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    login(found);
    navigate(found.rol === 'usuario' ? '/productos' : '/');
  }

  function usarDemo(rol) {
    const demos = {
      admin:    { email: 'admin@bakery.com',    pass: 'admin123' },
      vendedor: { email: 'vendedor@bakery.com', pass: 'vend123'  },
      usuario:  { email: 'cliente@bakery.com',  pass: 'usu123'   },
    };
    setEmail(demos[rol].email);
    setPass(demos[rol].pass);
    setError('');
  }

  return (
    <div className="login-page">
      <div className="login-card" id="loginForm">

        <div className="login-brand">
          <span className="login-logo">🎂</span>
          <div className="login-title">Danny's Bakery</div>
          <div className="login-sub">Inicia sesión para continuar</div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>

          {error && (
            <div className="login-err">
              ⚠️ {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <div className="pass-wrap">
              <input
                className="form-input"
                type={verPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setVerPass(!verPass)}
              >
                {verPass ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>
          </div>

          <button className="btn btn-rose btn-login" type="submit">
            Ingresar →
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <span
              style={{ color: 'var(--rose-dk)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/registro')}
            >
              Regístrate
            </span>
          </div>

        </form>

        <div className="demo-section">
          <div className="demo-label">Acceso rápido demo</div>
          <div className="demo-btns">
            <button className="demo-btn" onClick={() => usarDemo('admin')}>
              <span className="demo-btn-icon">👑</span>
              <span className="demo-btn-label">Admin</span>
            </button>
            <button className="demo-btn" onClick={() => usarDemo('vendedor')}>
              <span className="demo-btn-icon">🏪</span>
              <span className="demo-btn-label">Vendedor</span>
            </button>
            <button className="demo-btn" onClick={() => usarDemo('usuario')}>
              <span className="demo-btn-icon">🛒</span>
              <span className="demo-btn-label">Usuario</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}