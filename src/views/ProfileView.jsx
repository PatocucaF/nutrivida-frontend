import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../auth/useAuth.js';
import { validarNombre, validarPassword } from '../utils/validators.js';
import { Alert, ErrorBox } from '../ui/Feedback.jsx';

export default function ProfileView() {
  const { user, updateUser } = useAuth();
  const [nombre, setNombre] = useState(user.name);
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '' });
  const [msgPerfil, setMsgPerfil] = useState('');
  const [msgPass, setMsgPass] = useState('');
  const [errPerfil, setErrPerfil] = useState(null);
  const [errPass, setErrPass] = useState(null);

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setMsgPerfil('');
    setErrPerfil(null);
    if (!validarNombre(nombre)) {
      setErrPerfil({ message: 'El nombre debe tener entre 2 y 80 caracteres y solo letras.' });
      return;
    }
    try {
      const res = await api('/api/v1/users/me', { method: 'PUT', body: { name: nombre.trim() } });
      updateUser({ name: res.name });
      setMsgPerfil('Perfil actualizado.');
    } catch (err) {
      setErrPerfil(err);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setMsgPass('');
    setErrPass(null);
    if (!validarPassword(pass.newPassword)) {
      setErrPass({ message: 'La nueva contraseña debe tener entre 6 y 72 caracteres.' });
      return;
    }
    try {
      await api('/api/v1/users/me/password', { method: 'PUT', body: pass });
      setPass({ currentPassword: '', newPassword: '' });
      setMsgPass('Contraseña actualizada.');
    } catch (err) {
      setErrPass(err);
    }
  };

  return (
    <main>
      <section className="card-box">
        <h2>Mi perfil</h2>
        <p>
          <strong>Correo:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong> {[...user.roles].map((r) => <span key={r} className="badge">{r}</span>)}
        </p>
      </section>

      <section className="card-box" style={{ marginTop: '1.5rem' }}>
        <h3>Editar nombre</h3>
        <form onSubmit={guardarPerfil} className="nv-form">
          <div className="form-group">
            <label htmlFor="perfil-nombre">Nombre</label>
            <input id="perfil-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <ErrorBox error={errPerfil} />
          <Alert kind="ok">{msgPerfil}</Alert>
          <button type="submit">Guardar</button>
        </form>
      </section>

      <section className="card-box" style={{ marginTop: '1.5rem' }}>
        <h3>Cambiar contraseña</h3>
        <form onSubmit={cambiarPassword} className="nv-form">
          <div className="form-group">
            <label htmlFor="pass-actual">Contraseña actual</label>
            <input
              id="pass-actual"
              type="password"
              value={pass.currentPassword}
              onChange={(e) => setPass({ ...pass, currentPassword: e.target.value })}
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="pass-nueva">Nueva contraseña</label>
            <input
              id="pass-nueva"
              type="password"
              value={pass.newPassword}
              onChange={(e) => setPass({ ...pass, newPassword: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <ErrorBox error={errPass} />
          <Alert kind="ok">{msgPass}</Alert>
          <button type="submit">Cambiar contraseña</button>
        </form>
      </section>
    </main>
  );
}
