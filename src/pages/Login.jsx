import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getAuthUsers } from '../services/storage';

export default function Login() {
  const { login, session } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [verPass, setVerPass] = useState(false);

  if (session) {
    return <Navigate to={session.rol === 'usuario' ? '/productos' : '/'} replace />;
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
      setError('Correo o contrasena incorrectos');
      return;
    }

    login(found);
    navigate(found.rol === 'usuario' ? '/productos' : '/');
  }

  return (
    <div className="login-page">
      <div className="login-card" id="loginForm">
        <div className="login-brand">
          <span className="login-logo"><i className="bi bi-shop"></i></span>
          <div className="login-title">Danny's Bakery</div>
          <div className="login-sub">Inicia sesion para continuar</div>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="login-err">
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Correo electronico</label>
            <input
              className="form-input"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contrasena</label>
            <div className="pass-wrap">
              <input
                className="form-input"
                type={verPass ? 'text' : 'password'}
                placeholder="********"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
              />
              <button
                type="button"
                className="pass-toggle"
                onClick={() => setVerPass(!verPass)}
                aria-label={verPass ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              >
                {verPass ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
              </button>
            </div>
          </div>

          <button className="btn btn-rose btn-login" type="submit">
            Ingresar
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            No tienes cuenta?{' '}
            <span
              style={{ color: 'var(--rose-dk)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/registro')}
            >
              Registrate
            </span>
          </div>
        </form>

      </div>
    </div>
  );
}
