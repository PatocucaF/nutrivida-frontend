import { useState } from 'react';
import { api, query } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { useAuth } from '../auth/useAuth.js';
import { validarEmail, validarNombre, validarPassword } from '../utils/validators.js';
import { Alert, ErrorBox, Loading, Pager } from '../ui/Feedback.jsx';

const ROLES = ['ADMIN', 'VENDEDOR', 'CLIENTE'];
const NUEVO = { name: '', email: '', password: '', role: 'CLIENTE' };

// Solo ADMIN: crear, editar, activar/desactivar y eliminar (lógicamente) usuarios.
export default function UsersView() {
  const { user: yo } = useAuth();
  const [pagina, setPagina] = useState(0);
  const [filtro, setFiltro] = useState(''); // '' | 'true' | 'false'
  const usuarios = useFetch(`/api/v1/admin/users${query({ page: pagina, size: 10, enabled: filtro })}`);

  const [form, setForm] = useState(NUEVO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState('');

  const ejecutar = async (accion, mensaje) => {
    setError(null);
    setAviso('');
    try {
      await accion();
      setAviso(mensaje);
      usuarios.reload();
    } catch (err) {
      setError(err);
    }
  };

  const guardar = (e) => {
    e.preventDefault();
    const problemas = [];
    if (!validarNombre(form.name)) problemas.push('Nombre inválido (2 a 80 caracteres, solo letras).');
    if (!validarEmail(form.email)) problemas.push('Correo inválido.');
    if (!editandoId && !validarPassword(form.password)) problemas.push('La contraseña debe tener entre 6 y 72 caracteres.');
    if (problemas.length) {
      setError({ message: 'Revisa el formulario', fields: Object.fromEntries(problemas.map((p, i) => [i, p])) });
      return;
    }
    if (editandoId) {
      ejecutar(async () => {
        await api(`/api/v1/admin/users/${editandoId}`, {
          method: 'PUT', body: { name: form.name.trim(), email: form.email.trim(), role: form.role },
        });
        setEditandoId(null);
        setForm(NUEVO);
      }, 'Usuario actualizado.');
    } else {
      ejecutar(async () => {
        await api('/api/v1/admin/users', {
          method: 'POST', body: { name: form.name.trim(), email: form.email.trim(), password: form.password, role: form.role },
        });
        setForm(NUEVO);
      }, 'Usuario creado.');
    }
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ name: u.name, email: u.email, password: '', role: [...u.roles][0] });
  };

  const cambiarEstado = (u) =>
    ejecutar(
      () => api(`/api/v1/admin/users/${u.id}/status`, { method: 'PATCH', body: { enabled: !u.enabled } }),
      u.enabled ? `${u.email} desactivado.` : `${u.email} activado.`,
    );

  const eliminar = (u) => {
    if (!window.confirm(`¿Eliminar a ${u.email}? El usuario dejará de poder ingresar.`)) return;
    ejecutar(() => api(`/api/v1/admin/users/${u.id}`, { method: 'DELETE' }), `${u.email} eliminado.`);
  };

  const filas = usuarios.data?.content ?? [];

  return (
    <main>
      <section className="card-box">
        <h2>Gestión de usuarios y roles</h2>
        <div className="form-group" style={{ maxWidth: 240 }}>
          <label htmlFor="f-estado">Estado</label>
          <select id="f-estado" value={filtro} onChange={(e) => { setFiltro(e.target.value); setPagina(0); }}>
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Desactivados</option>
          </select>
        </div>
        <ErrorBox error={error} />
        <Alert kind="ok">{aviso}</Alert>
        {usuarios.loading && <Loading />}
        <ErrorBox error={usuarios.error} />

        {filas.length > 0 && (
          <table>
            <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {filas.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{[...u.roles].map((r) => <span key={r} className="badge">{r}</span>)}</td>
                  <td>{u.enabled ? 'Activo' : 'Desactivado'}</td>
                  <td className="nv-row">
                    <button type="button" className="nv-btn-sec" onClick={() => editar(u)}>Editar</button>
                    <button type="button" className="nv-btn-sec" disabled={u.email === yo.email} onClick={() => cambiarEstado(u)}>
                      {u.enabled ? 'Desactivar' : 'Activar'}
                    </button>
                    <button type="button" className="nv-btn-danger" disabled={u.email === yo.email} onClick={() => eliminar(u)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {usuarios.data && filas.length === 0 && <p className="nv-muted">No hay usuarios con ese filtro.</p>}
        <Pager page={usuarios.data?.page} onChange={setPagina} />
      </section>

      <section className="card-box" style={{ marginTop: '1.5rem' }}>
        <h3>{editandoId ? `Editando usuario #${editandoId}` : 'Crear usuario'}</h3>
        <form onSubmit={guardar} noValidate className="nv-form">
          <div className="nv-formgrid">
            <div className="form-group"><label htmlFor="u-name">Nombre</label>
              <input id="u-name" autoComplete="off" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label htmlFor="u-email">Correo</label>
              <input id="u-email" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            {!editandoId && (
              <div className="form-group"><label htmlFor="u-pass">Contraseña inicial</label>
                <input id="u-pass" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            )}
            <div className="form-group"><label htmlFor="u-role">Rol</label>
              <select id="u-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select></div>
          </div>
          <div className="nv-row">
            <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear usuario'}</button>
            {editandoId && (
              <button type="button" className="nv-btn-sec" onClick={() => { setEditandoId(null); setForm(NUEVO); }}>Cancelar</button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
