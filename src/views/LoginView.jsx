import { useState } from 'react';
import { useAuth } from '../auth/useAuth.js';
import { validarRegistro, validarEmail } from '../utils/validators.js';
import { ErrorBox } from '../ui/Feedback.jsx';

export default function LoginView({ onSuccess }) {
  const { login, register } = useAuth();
  const [modo, setModo] = useState('registro'); // 'login' | 'registro'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);

    const local = modo === 'registro' ? validarRegistro(form) : {};
    if (modo === 'login' && !validarEmail(form.email)) local.email = 'Ingresa un correo válido.';
    if (modo === 'login' && !form.password) local.password = 'Ingresa tu contraseña.';
    setErrores(local);
    if (Object.keys(local).length) return;

    setEnviando(true);
    try {
      const user =
        modo === 'login'
          ? await login(form.email.trim(), form.password)
          : await register(form.name.trim(), form.email.trim(), form.password);
      onSuccess(user);
    } catch (err) {
      setError(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main>
      <section className="card-box nv-narrow">
        <h2>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta de cliente'}</h2>
        <p className="nv-muted">
          {modo === 'login'
            ? 'Ingresa con tu correo y contraseña.'
            : 'Las cuentas nuevas se crean con rol Cliente.'}
        </p>

        <form onSubmit={enviar} noValidate className="nv-form">
          {modo === 'registro' && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input id="nombre" type="text" value={form.name} onChange={cambiar('name')} autoComplete="name" />
              {errores.name && <small className="nv-field-error">{errores.name}</small>}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" value={form.email} onChange={cambiar('email')} autoComplete="email" />
            {errores.email && <small className="nv-field-error">{errores.email}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={cambiar('password')}
              autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            />
            {errores.password && <small className="nv-field-error">{errores.password}</small>}
          </div>
          <ErrorBox error={error} />
          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando…' : modo === 'login' ? 'Ingresar' : 'Registrarme'}
          </button>
        </form>

        <p className="nv-muted" style={{ marginTop: '1rem' }}>
          {modo === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            type="button"
            className="nv-link"
            onClick={() => {
              setModo(modo === 'login' ? 'registro' : 'login');
              setErrores({});
              setError(null);
            }}
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </section>
    </main>
  );
}
