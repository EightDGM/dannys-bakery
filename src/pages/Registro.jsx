import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/storage';
import { registrarUsuarioApi } from '../services/api';

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'];

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usu_nombre: '',
    usu_email: '',
    tipoDocumento: 'CC',
    usu_id: '',
    edad: '',
    pass: '',
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleRegistro(e) {
    e.preventDefault();

    if (!form.usu_nombre || !form.usu_email || !form.usu_id || !form.edad || !form.pass) {
      setError('Completa todos los campos');
      return;
    }

    if (Number.isNaN(Number(form.edad)) || Number(form.edad) < 1 || Number(form.edad) > 120) {
      setError('Ingresa una edad valida');
      return;
    }

    const resultado = registrarUsuario(form);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    try {
      await registrarUsuarioApi(form);
    } catch {
      // Si el backend falla, igual puede iniciar sesión con localStorage
    }

    setExito(true);
  }

  if (exito) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 52, display: 'block', marginBottom: 16 }}>
            <i className="bi bi-check-circle-fill"></i>
          </span>
          <div className="login-title">Registro exitoso</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '12px 0 24px' }}>
            Tu cuenta ha sido creada. Inicia sesion con tu correo y contrasena.
          </p>
          <button
            className="btn btn-rose"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/login')}
          >
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-logo"><i className="bi bi-shop"></i></span>
          <div className="login-title">Crear cuenta</div>
          <div className="login-sub">Unete a Danny's Bakery</div>
        </div>

        <form className="login-form" onSubmit={handleRegistro}>
          {error && (
            <div className="login-err">
              <i className="bi bi-exclamation-triangle-fill"></i> {error}
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Nombre completo *</label>
            <input
              className="form-input"
              type="text"
              name="usu_nombre"
              placeholder="Ana Rodriguez"
              value={form.usu_nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Correo electronico *</label>
            <input
              className="form-input"
              type="email"
              name="usu_email"
              placeholder="ana@email.com"
              value={form.usu_email}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
            <div className="form-field">
              <label className="form-label">Tipo doc. *</label>
              <select
                className="form-input"
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
              >
                {TIPOS_DOCUMENTO.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">No. Documento *</label>
              <input
                className="form-input"
                type="text"
                name="usu_id"
                placeholder="1020304050"
                value={form.usu_id}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Edad *</label>
            <input
              className="form-input"
              type="number"
              name="edad"
              placeholder="25"
              min="1"
              max="120"
              value={form.edad}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contrasena *</label>
            <input
              className="form-input"
              type="password"
              name="pass"
              placeholder="********"
              value={form.pass}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-rose btn-login" type="submit">
            Crear cuenta
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Ya tienes cuenta?{' '}
            <span
              style={{ color: 'var(--rose-dk)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Inicia sesion
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
