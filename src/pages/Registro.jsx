import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUsers } from '../services/storage';

const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'];

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usu_nombre:    '',
    usu_email:     '',
    tipoDocumento: 'CC',
    usu_id:        '',
    edad:          '',
    pass:          ''
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  function handleRegistro(e) {
    e.preventDefault();

    if (!form.usu_nombre || !form.usu_email || !form.usu_id || !form.edad || !form.pass) {
      setError('Completa todos los campos');
      return;
    }

    if (isNaN(form.edad) || form.edad < 1 || form.edad > 120) {
      setError('Ingresa una edad válida');
      return;
    }

    const authUsers = getAuthUsers();
    const existe = authUsers.find(u => u.email === form.usu_email);
    if (existe) {
      setError('Ya existe una cuenta con ese correo');
      return;
    }

    /* Guardar en auth_users */
    const nuevoAuthUser = {
      id:     authUsers.length + 1,
      email:  form.usu_email,
      pass:   form.pass,
      rol:    'usuario',
      nombre: form.usu_nombre
    };

    authUsers.push(nuevoAuthUser);
    localStorage.setItem('bakery_auth_users', JSON.stringify(authUsers));

    /* Guardar en tabla usuarios con modelo del backend */
    const usuarios = JSON.parse(localStorage.getItem('bakery_usuarios') || '[]');
    const nextId   = usuarios.length ? Math.max(...usuarios.map(u => u.usu_codigo)) + 1 : 1;

    usuarios.push({
      usu_codigo:    nextId,
      usu_nombre:    form.usu_nombre,
      usu_email:     form.usu_email,
      usu_id:        form.usu_id,
      tipoDocumento: form.tipoDocumento,
      edad:          parseInt(form.edad)
    });

    localStorage.setItem('bakery_usuarios', JSON.stringify(usuarios));
    setExito(true);
  }

  if (exito) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 52, display: 'block', marginBottom: 16 }}>🎉</span>
          <div className="login-title">¡Registro exitoso!</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '12px 0 24px' }}>
            Tu cuenta ha sido creada. Inicia sesión con tu correo y contraseña.
          </p>
          <button className="btn btn-rose" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => navigate('/login')}>
            Ir al login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-brand">
          <span className="login-logo">🎂</span>
          <div className="login-title">Crear cuenta</div>
          <div className="login-sub">Únete a Danny's Bakery</div>
        </div>

        <form className="login-form" onSubmit={handleRegistro}>

          {error && <div className="login-err">⚠️ {error}</div>}

          <div className="form-field">
            <label className="form-label">Nombre completo *</label>
            <input
              className="form-input"
              type="text"
              name="usu_nombre"
              placeholder="Ana Rodríguez"
              value={form.usu_nombre}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Correo electrónico *</label>
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
              <label className="form-label">N° Documento *</label>
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
            <label className="form-label">Contraseña *</label>
            <input
              className="form-input"
              type="password"
              name="pass"
              placeholder="••••••••"
              value={form.pass}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-rose btn-login" type="submit">
            Crear cuenta →
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <span
              style={{ color: 'var(--rose-dk)', fontWeight: 700, cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Inicia sesión
            </span>
          </div>

        </form>
      </div>
    </div>
  );
}