import { useCallback, useEffect, useState } from 'react';
import { api } from './client.js';

/**
 * Carga un GET y expone { data, error, loading, reload }.
 * Si path es null no hace nada (útil para cargas condicionales).
 */
export function useFetch(path) {
  const [state, setState] = useState({ path: null, data: null, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    let cancelled = false;
    api(path)
      .then((data) => !cancelled && setState({ path, data, error: null }))
      .catch((error) => !cancelled && setState({ path, data: null, error }));
    return () => {
      cancelled = true;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const loading = Boolean(path) && state.path !== path;
  return { data: state.path === path ? state.data : null, error: state.path === path ? state.error : null, loading, reload };
}
