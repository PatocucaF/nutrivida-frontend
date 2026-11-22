import { Fragment, useState } from 'react';
import { api, query } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { useAuth } from '../auth/useAuth.js';
import { formatearFechaHora, formatearPrecio } from '../utils/validators.js';
import { Alert, ErrorBox, Loading, Pager } from '../ui/Feedback.jsx';

// Una sola vista para tres casos:
//  - CLIENTE  -> /orders          (solo sus pedidos)
//  - VENDEDOR -> /admin/orders    (lista y detalle, sin acciones)
//  - ADMIN    -> /admin/orders    (lista, detalle y anular pedido)
export default function OrdersView({ mode }) {
  const { user } = useAuth();
  const esAdmin = user.roles.includes('ADMIN');
  const base = mode === 'cliente' ? '/api/v1/orders' : '/api/v1/admin/orders';
  const [pagina, setPagina] = useState(0);
  const pedidos = useFetch(`${base}${query({ page: pagina, size: 10 })}`);
  const [abierto, setAbierto] = useState(null);
  const [error, setError] = useState(null);
  const [aviso, setAviso] = useState('');

  const anular = async (p) => {
    setError(null);
    setAviso('');
    try {
      await api(`/api/v1/admin/orders/${p.id}/cancel`, { method: 'PATCH' });
      setAviso(`Pedido #${p.id} anulado. El stock fue devuelto al inventario.`);
      pedidos.reload();
    } catch (err) {
      setError(err);
    }
  };

  const filas = pedidos.data?.content ?? [];

  return (
    <main>
      <section className="card-box">
        <h2>{mode === 'cliente' ? 'Mis pedidos' : 'Pedidos'}</h2>
        {pedidos.loading && <Loading />}
        <ErrorBox error={pedidos.error} />
        <ErrorBox error={error} />
        <Alert kind="ok">{aviso}</Alert>
        {pedidos.data && filas.length === 0 && <p className="nv-muted">No hay pedidos.</p>}

        {filas.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>N°</th>
                {mode !== 'cliente' && <th>Cliente</th>}
                <th>Fecha</th><th>Total</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filas.map((p) => (
                <Fragment key={p.id}>
                  <tr>
                    <td>#{p.id}</td>
                    {mode !== 'cliente' && <td>{p.customerEmail}</td>}
                    <td>{formatearFechaHora(p.createdAt)}</td>
                    <td>{formatearPrecio(p.total)}</td>
                    <td><span className="badge">{p.status === 'CONFIRMED' ? 'Confirmado' : 'Anulado'}</span></td>
                    <td className="nv-row">
                      <button type="button" className="nv-btn-sec" onClick={() => setAbierto(abierto === p.id ? null : p.id)}>
                        {abierto === p.id ? 'Ocultar' : 'Ver detalle'}
                      </button>
                      {esAdmin && mode !== 'cliente' && p.status === 'CONFIRMED' && (
                        <button type="button" className="nv-btn-danger" onClick={() => anular(p)}>Anular</button>
                      )}
                    </td>
                  </tr>
                  {abierto === p.id && (
                    <tr>
                      <td colSpan={mode !== 'cliente' ? 6 : 5}>
                        <table className="nv-subtable">
                          <thead><tr><th>SKU</th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
                          <tbody>
                            {p.items.map((i) => (
                              <tr key={i.productId}>
                                <td>{i.sku}</td><td>{i.productName}</td><td>{i.quantity}</td>
                                <td>{formatearPrecio(i.unitPrice)}</td><td>{formatearPrecio(i.subtotal)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
        <Pager page={pedidos.data?.page} onChange={setPagina} />
      </section>
    </main>
  );
}
