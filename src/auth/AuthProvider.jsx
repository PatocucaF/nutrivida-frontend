import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, setUnauthorizedHandler } from '../api/client.js';
import { AuthContext } from './AuthContext.js';
import { clearSession, loadSession, msUntilExpiry, saveSession } from './session.js';

const MAX_TIMEOUT = 2 ** 31 - 1; // límite de setTimeout

export function AuthProvider({ children }) {
  // La sesión se recupera de localStorage al cargar: así sobrevive a recargar la página.
  const [session, setSession] = useState(() => loadSession());

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // Si el backend responde 401 con un token enviado, la sesión ya no sirve: se cierra.
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // Cierra la sesión sola cuando el token vence.
  useEffect(() => {
    if (!session) return undefined;
    const ms = Math.min(msUntilExpiry(session.token), MAX_TIMEOUT);
    const id = setTimeout(logout, ms);
    return () => clearTimeout(id);
  }, [session, logout]);

  const startSession = useCallback((data) => {
    const next = { token: data.token, user: data.user };
    saveSession(next);
    setSession(next);
    return data.user;
  }, []);

  const login = useCallback(
    async (email, password) =>
      startSession(await api('/api/v1/auth/login', { method: 'POST', body: { email, password }, auth: false })),
    [startSession],
  );

  const register = useCallback(
    async (name, email, password) =>
      startSession(await api('/api/v1/auth/register', { method: 'POST', body: { name, email, password }, auth: false })),
    [startSession],
  );

  /** Actualiza datos del usuario ya guardados (por ejemplo, el nombre tras editar el perfil). */
  const updateUser = useCallback((changes) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...changes } };
      saveSession(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      login,
      register,
      logout,
      updateUser,
    }),
    [session, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
