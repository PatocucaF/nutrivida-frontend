// Manejo de la sesión (token JWT + datos del usuario) en localStorage.
// Está escrito sin dependencias de React para poder probarlo con node:test.

const KEY = 'nutrivida.session';

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // modo privado o almacenamiento bloqueado
  }
}

/** Lee el payload (la parte del medio) de un JWT. Devuelve null si el token está mal formado. */
export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/** Un token sin fecha de expiración legible se considera vencido (más seguro). */
export function isExpired(token, now = Date.now()) {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return payload.exp * 1000 <= now;
}

/** Milisegundos que le quedan al token (0 si ya venció). */
export function msUntilExpiry(token, now = Date.now()) {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== 'number') return 0;
  return Math.max(0, payload.exp * 1000 - now);
}

export function saveSession({ token, user }, storage = getStorage()) {
  try {
    storage?.setItem(KEY, JSON.stringify({ token, user }));
  } catch {
    /* si no se puede guardar, la sesión dura hasta recargar la página */
  }
}

export function clearSession(storage = getStorage()) {
  try {
    storage?.removeItem(KEY);
  } catch {
    /* nada que hacer */
  }
}

/** Recupera la sesión guardada. Si está corrupta o el token venció, la borra y devuelve null. */
export function loadSession(storage = getStorage(), now = Date.now()) {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.token || !session?.user || isExpired(session.token, now)) {
      clearSession(storage);
      return null;
    }
    return session;
  } catch {
    clearSession(storage);
    return null;
  }
}

export function getToken() {
  return loadSession()?.token ?? null;
}
