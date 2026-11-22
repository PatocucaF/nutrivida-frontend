export function Alert({ kind = 'error', children }) {
  if (!children) return null;
  return (
    <p className={`nv-alert nv-alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

/** Muestra un ApiError con sus errores por campo (si los trae). */
export function ErrorBox({ error }) {
  if (!error) return null;
  const fields = error.fields ? Object.entries(error.fields) : [];
  return (
    <div className="nv-alert nv-alert-error" role="alert">
      <strong>{error.message}</strong>
      {fields.length > 0 && (
        <ul>
          {fields.map(([campo, msg]) => (
            <li key={campo}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Loading({ children = 'Cargando…' }) {
  return <p className="nv-muted">{children}</p>;
}

/** Paginación sobre PagedModel de Spring: { content, page: { number, totalPages, totalElements } } */
export function Pager({ page, onChange }) {
  if (!page || page.totalPages <= 1) return null;
  return (
    <div className="nv-pager">
      <button type="button" className="nv-btn-sec" disabled={page.number <= 0} onClick={() => onChange(page.number - 1)}>
        ← Anterior
      </button>
      <span>
        Página {page.number + 1} de {page.totalPages} ({page.totalElements} registros)
      </span>
      <button
        type="button"
        className="nv-btn-sec"
        disabled={page.number >= page.totalPages - 1}
        onClick={() => onChange(page.number + 1)}
      >
        Siguiente →
      </button>
    </div>
  );
}
