// Cliente HTTP único para hablar con el backend Spring Boot.
// Agrega el token JWT en la cabecera Authorization y traduce los errores.
import { getToken } from '../auth/session.js';

export const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(status, message, fields = null) {
    super(message);
    this.status = status;
    this.fields = fields; // errores por campo cuando el backend responde 400 con validaciones
  }
}

let onUnauthorized = () => {};

/** El AuthProvider registra aquí qué hacer cuando el backend responde 401 con un token enviado. */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

function mensajePara(status, data) {
  if (status === 401) return data?.message || 'Tu sesión expiró o las credenciales no son válidas.';
  if (status === 403) return 'No tienes permisos para realizar esta acción.';
  return data?.message || `Error inesperado (${status}).`;
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized();
    throw new ApiError(res.status, mensajePara(res.status, data), data?.fields ?? null);
  }
  return data;
}

/** Arma ?a=1&b=2 ignorando valores vacíos. */
export function query(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}
