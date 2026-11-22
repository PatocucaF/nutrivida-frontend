import { useState } from 'react';
import { query } from '../api/client.js';
import { useFetch } from '../api/useFetch.js';
import { formatearFechaHora, formatearPrecio } from '../utils/validators.js';
import { ErrorBox, Loading, Pager } from '../ui/Feedback.jsx';

export function SalesView() {
  const [pagina, setPagina] = useState(0);
  const ventas = useFetch(`/api/v1/sales${query({ page: pagina, size: 10 })}`);
  const filas = ventas.data?.content ?? [];
  return (
    <main>
      <section className="card-box">
        <h2>Ventas</h2>
        {ventas.loading && <Loading />}
        <ErrorBox error={ventas.error} />
        {ventas.data && filas.length === 0 && <p className="nv-muted">Aún no hay ventas registradas.</p>}
        {filas.length > 0 && (
          <table>
            <thead><tr><th>Venta</th><th>Pedido</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead>
            <tbody>
              {filas.map((v) => (
                <tr key={v.id}>
                  <td>#{v.id}</td><td>#{v.orderId}</td><td>{v.customerEmail}</td>
                  <td>{formatearPrecio(v.total)}</td><td><span className="badge">{v.status}</span></td>
                  <td>{formatearFechaHora(v.soldAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pager page={ventas.data?.page} onChange={setPagina} />
      </section>
    </main>
  );
}

export function AuditView() {
  const [pagina, setPagina] = useState(0);
  const registros = useFetch(`/api/v1/admin/audit${query({ page: pagina, size: 10 })}`);
  const filas = registros.data?.content ?? [];
  return (
    <main>
      <section className="card-box">
        <h2>Historial de acciones sobre usuarios</h2>
        {registros.loading && <Loading />}
        <ErrorBox error={registros.error} />
        {registros.data && filas.length === 0 && <p className="nv-muted">Sin registros todavía.</p>}
        {filas.length > 0 && (
          <table>
            <thead><tr><th>Fecha</th><th>Quién</th><th>Acción</th><th>Detalle</th></tr></thead>
            <tbody>
              {filas.map((a) => (
                <tr key={a.id}>
                  <td>{formatearFechaHora(a.createdAt)}</td><td>{a.actorEmail}</td>
                  <td><span className="badge">{a.action}</span></td><td>{a.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pager page={registros.data?.page} onChange={setPagina} />
      </section>
    </main>
  );
}
