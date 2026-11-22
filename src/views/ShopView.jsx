import { useState } from 'react';
import { api } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { formatearPrecio } from '../utils/validators.js';
import { Alert, ErrorBox, Loading } from '../ui/Feedback.jsx';

// Catálogo para el CLIENTE: ver productos activos y agregarlos al carrito.
export default function ShopView({ onGoCart }) {
  const [categoryId, setCategoryId] = useState('');
  const categorias = useFetch('/api/v1/categories');
  const productos = useFetch(`/api/v1/products${categoryId ? `?categoryId=${categoryId}` : ''}`);
  const [cantidades, setCantidades] = useState({});
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState(null);

  const agregar = async (p) => {
    setAviso('');
    setError(null);
    try {
      await api(`/api/v1/cart/items/${p.id}`, { method: 'POST', body: { quantity: Number(cantidades[p.id] ?? 1) } });
      setAviso(`"${p.name}" agregado al carrito.`);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <main>
      <section className="card-box">
        <h2>Tienda NutriVida</h2>
        <div className="form-group" style={{ maxWidth: 280 }}>
          <label htmlFor="cat">Categoría</label>
          <select id="cat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Todas</option>
            {(categorias.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <Alert kind="ok">{aviso}</Alert>
        <ErrorBox error={error} />
        {aviso && (
          <button type="button" className="nv-btn-sec" onClick={onGoCart}>Ir al carrito</button>
        )}
      </section>

      {productos.loading && <Loading />}
      <ErrorBox error={productos.error} />
      {productos.data && productos.data.length === 0 && (
        <p className="nv-muted" style={{ margin: '1rem' }}>No hay productos disponibles todavía.</p>
      )}

      <div className="nv-grid">
        {(productos.data ?? []).map((p) => (
          <article key={p.id} className="card-box nv-product">
            <span className="badge">{p.categoryName}</span>
            <h3>{p.name}</h3>
            <p className="nv-muted">{p.description || 'Sin descripción.'}</p>
            <p className="nv-price">{formatearPrecio(p.price)}</p>
            <p className="nv-muted">{p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}</p>
            <div className="nv-row">
              <input
                type="number"
                min="1"
                max={p.stock || 1}
                aria-label={`Cantidad de ${p.name}`}
                value={cantidades[p.id] ?? 1}
                onChange={(e) => setCantidades({ ...cantidades, [p.id]: e.target.value })}
                style={{ width: 70 }}
              />
              <button type="button" disabled={p.stock <= 0} onClick={() => agregar(p)}>
                Agregar
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
