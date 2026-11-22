import { useState } from 'react';
import { api } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { formatearPrecio } from '../utils/validators.js';
import { Alert, ErrorBox, Loading } from '../ui/Feedback.jsx';

export default function CartView({ onGoOrders }) {
  const carrito = useFetch('/api/v1/cart');
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState('');

  const ejecutar = async (accion) => {
    setError(null);
    setAviso('');
    try {
      await accion();
      carrito.reload();
    } catch (err) {
      setError(err);
    }
  };

  const cambiarCantidad = (l, q) =>
    ejecutar(() => api(`/api/v1/cart/items/${l.productId}`, { method: 'PUT', body: { quantity: q } }));
  const quitar = (l) => ejecutar(() => api(`/api/v1/cart/items/${l.productId}`, { method: 'DELETE' }));
  const vaciar = () => ejecutar(() => api('/api/v1/cart', { method: 'DELETE' }));
  const comprar = () =>
    ejecutar(async () => {
      const pedido = await api('/api/v1/orders/checkout', { method: 'POST' });
      setAviso(`¡Compra confirmada! Pedido #${pedido.id} por ${formatearPrecio(pedido.total)}.`);
    });

  const items = carrito.data?.items ?? [];

  return (
    <main>
      <section className="card-box">
        <h2>Mi carrito</h2>
        {carrito.loading && <Loading />}
        <ErrorBox error={carrito.error} />
        <ErrorBox error={error} />
        <Alert kind="ok">{aviso}</Alert>
        {aviso && (
          <button type="button" className="nv-btn-sec" onClick={onGoOrders}>Ver mis pedidos</button>
        )}

        {carrito.data && items.length === 0 && !aviso && <p className="nv-muted">Tu carrito está vacío.</p>}

        {items.length > 0 && (
          <>
            <table>
              <thead>
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l.productId}>
                    <td>{l.name}<br /><small className="nv-muted">{l.sku}</small></td>
                    <td>{formatearPrecio(l.unitPrice)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={l.availableStock}
                        defaultValue={l.quantity}
                        aria-label={`Cantidad de ${l.name}`}
                        style={{ width: 70 }}
                        onBlur={(e) => {
                          const q = Number(e.target.value);
                          if (q >= 1 && q !== l.quantity) cambiarCantidad(l, q);
                        }}
                      />
                    </td>
                    <td>{formatearPrecio(l.subtotal)}</td>
                    <td><button type="button" className="nv-btn-danger" onClick={() => quitar(l)}>Quitar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="nv-total">Total: {formatearPrecio(carrito.data.total)}</p>
            <div className="nv-row">
              <button type="button" onClick={comprar}>Confirmar compra</button>
              <button type="button" className="nv-btn-sec" onClick={vaciar}>Vaciar carrito</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
