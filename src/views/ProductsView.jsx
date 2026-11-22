import { useState } from 'react';
import { api } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { useAuth } from '../auth/useAuth.js';
import { formatearPrecio } from '../utils/validators.js';
import { Alert, ErrorBox, Loading } from '../ui/Feedback.jsx';

const VACIO = { sku: '', name: '', description: '', price: '', categoryId: '', initialStock: 0, active: true };

// VENDEDOR: solo ve lista y detalle.  ADMIN: además crea/edita productos, categorías y repone stock.
export default function ProductsView() {
  const { user } = useAuth();
  const esAdmin = user.roles.includes('ADMIN');
  const productos = useFetch(`/api/v1/products${esAdmin ? '?includeInactive=true' : ''}`);
  const categorias = useFetch('/api/v1/categories');

  const [detalle, setDetalle] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [categoriaNueva, setCategoriaNueva] = useState({ name: '', description: '' });
  const [reposicion, setReposicion] = useState({ quantity: 1, note: '' });
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState('');

  const cambiar = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const ejecutar = async (accion, mensaje) => {
    setError(null);
    setAviso('');
    try {
      await accion();
      setAviso(mensaje);
      productos.reload();
      categorias.reload();
    } catch (err) {
      setError(err);
    }
  };

  const guardar = (e) => {
    e.preventDefault();
    const base = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      active: form.active,
    };
    if (editandoId) {
      ejecutar(async () => {
        await api(`/api/v1/products/${editandoId}`, { method: 'PUT', body: base });
        setEditandoId(null);
        setForm(VACIO);
      }, 'Producto actualizado.');
    } else {
      ejecutar(async () => {
        await api('/api/v1/products', { method: 'POST', body: { ...base, initialStock: Number(form.initialStock) } });
        setForm(VACIO);
      }, 'Producto creado.');
    }
  };

  const editar = (p) => {
    setEditandoId(p.id);
    setForm({
      sku: p.sku, name: p.name, description: p.description ?? '', price: p.price,
      categoryId: p.categoryId, initialStock: 0, active: p.active,
    });
  };

  const crearCategoria = (e) => {
    e.preventDefault();
    ejecutar(async () => {
      await api('/api/v1/categories', { method: 'POST', body: categoriaNueva });
      setCategoriaNueva({ name: '', description: '' });
    }, 'Categoría creada.');
  };

  const reponer = (p) =>
    ejecutar(
      () =>
        api(`/api/v1/inventory/products/${p.id}/adjustments`, {
          method: 'POST',
          body: { quantity: Number(reposicion.quantity), type: 'RESTOCK', note: reposicion.note },
        }),
      `Stock de "${p.name}" repuesto.`,
    );

  const lista = productos.data ?? [];

  return (
    <main>
      <section className="card-box">
        <h2>Productos</h2>
        {!esAdmin && <p className="nv-muted">Vista de consulta: lista y detalle de productos.</p>}
        <ErrorBox error={error} />
        <Alert kind="ok">{aviso}</Alert>
        {productos.loading && <Loading />}
        <ErrorBox error={productos.error} />

        {lista.length > 0 && (
          <table>
            <thead>
              <tr><th>SKU</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td><td>{p.name}</td><td>{p.categoryName}</td>
                  <td>{formatearPrecio(p.price)}</td><td>{p.stock}</td>
                  <td><span className="badge">{p.active ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="nv-row">
                    <button type="button" className="nv-btn-sec" onClick={() => setDetalle(detalle?.id === p.id ? null : p)}>
                      Detalle
                    </button>
                    {esAdmin && <button type="button" className="nv-btn-sec" onClick={() => editar(p)}>Editar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {productos.data && lista.length === 0 && <p className="nv-muted">Aún no hay productos.</p>}
      </section>

      {detalle && (
        <section className="card-box" style={{ marginTop: '1.5rem' }}>
          <h3>Detalle: {detalle.name}</h3>
          <p><strong>SKU:</strong> {detalle.sku}</p>
          <p><strong>Categoría:</strong> {detalle.categoryName}</p>
          <p><strong>Descripción:</strong> {detalle.description || '—'}</p>
          <p><strong>Precio:</strong> {formatearPrecio(detalle.price)} · <strong>Stock:</strong> {detalle.stock}</p>
          {esAdmin && (
            <div className="nv-row">
              <input type="number" min="1" aria-label="Unidades a reponer" style={{ width: 90 }}
                value={reposicion.quantity} onChange={(e) => setReposicion({ ...reposicion, quantity: e.target.value })} />
              <input placeholder="Nota (opcional)" aria-label="Nota de reposición"
                value={reposicion.note} onChange={(e) => setReposicion({ ...reposicion, note: e.target.value })} />
              <button type="button" onClick={() => reponer(detalle)}>Reponer stock</button>
            </div>
          )}
        </section>
      )}

      {esAdmin && (
        <>
          <section className="card-box" style={{ marginTop: '1.5rem' }}>
            <h3>{editandoId ? `Editando producto #${editandoId}` : 'Nuevo producto'}</h3>
            <form onSubmit={guardar} className="nv-form">
              <div className="nv-formgrid">
                <div className="form-group"><label htmlFor="p-sku">SKU</label>
                  <input id="p-sku" required value={form.sku} onChange={cambiar('sku')} /></div>
                <div className="form-group"><label htmlFor="p-name">Nombre</label>
                  <input id="p-name" required value={form.name} onChange={cambiar('name')} /></div>
                <div className="form-group"><label htmlFor="p-price">Precio</label>
                  <input id="p-price" type="number" min="1" step="any" required value={form.price} onChange={cambiar('price')} /></div>
                <div className="form-group"><label htmlFor="p-cat">Categoría</label>
                  <select id="p-cat" required value={form.categoryId} onChange={cambiar('categoryId')}>
                    <option value="">Selecciona…</option>
                    {(categorias.data ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
                {!editandoId && (
                  <div className="form-group"><label htmlFor="p-stock">Stock inicial</label>
                    <input id="p-stock" type="number" min="0" value={form.initialStock} onChange={cambiar('initialStock')} /></div>
                )}
              </div>
              <div className="form-group"><label htmlFor="p-desc">Descripción</label>
                <textarea id="p-desc" rows="2" value={form.description} onChange={cambiar('description')} /></div>
              <label><input type="checkbox" checked={form.active} onChange={cambiar('active')} /> Activo (visible en la tienda)</label>
              <div className="nv-row">
                <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear producto'}</button>
                {editandoId && (
                  <button type="button" className="nv-btn-sec" onClick={() => { setEditandoId(null); setForm(VACIO); }}>Cancelar</button>
                )}
              </div>
            </form>
          </section>

          <section className="card-box" style={{ marginTop: '1.5rem' }}>
            <h3>Categorías</h3>
            <p className="nv-muted">
              {(categorias.data ?? []).map((c) => c.name).join(' · ') || 'Aún no hay categorías: crea una para poder registrar productos.'}
            </p>
            <form onSubmit={crearCategoria} className="nv-row">
              <input required placeholder="Nombre" aria-label="Nombre de categoría" value={categoriaNueva.name}
                onChange={(e) => setCategoriaNueva({ ...categoriaNueva, name: e.target.value })} />
              <input placeholder="Descripción" aria-label="Descripción de categoría" value={categoriaNueva.description}
                onChange={(e) => setCategoriaNueva({ ...categoriaNueva, description: e.target.value })} />
              <button type="submit">Crear categoría</button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
