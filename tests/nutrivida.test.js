// Pruebas unitarias sobre el código REAL de la aplicación (se importa desde src/, no se copia).
// Ejecutar con: npm test
import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';

import { calcularIMC } from '../src/utils/clinica.js';
import { formatearPrecio, validarEmail, validarNombre, validarPassword, validarRegistro } from '../src/utils/validators.js';
import { clearSession, decodeJwt, isExpired, loadSession, saveSession } from '../src/auth/session.js';
import { canAccess, defaultView, resolveView, visibleViews } from '../src/auth/permissions.js';
import { ApiError, api, query, setUnauthorizedHandler } from '../src/api/client.js';

// --- utilidades de prueba ---------------------------------------------------
function fakeStorage() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
}
const crearToken = (payload) => `x.${btoa(JSON.stringify(payload))}.y`;
const enSegundos = (ms) => Math.floor(ms / 1000);
const admin = { id: 1, name: 'Admin', email: 'admin@nutrivida.cl', roles: ['ADMIN'] };
const vendedor = { id: 2, name: 'Vera', email: 'v@nutrivida.cl', roles: ['VENDEDOR'] };
const cliente = { id: 3, name: 'Cata', email: 'c@nutrivida.cl', roles: ['CLIENTE'] };

// --- IMC --------------------------------------------------------------------
test('IMC: calcula con peso y talla válidos (82.5 kg, 1.75 m -> 26.9)', () => {
  assert.equal(calcularIMC(82.5, 1.75), '26.9');
});
test('IMC: devuelve vacío si peso o talla no son positivos', () => {
  assert.equal(calcularIMC(0, 1.75), '');
  assert.equal(calcularIMC(70, 0), '');
});

// --- validaciones (mismas reglas que el backend) -----------------------------
test('validarEmail acepta correos correctos y rechaza incorrectos', () => {
  assert.equal(validarEmail('cmorales@nutrivida.cl'), true);
  assert.equal(validarEmail('correo-invalido.cl'), false);
});
test('validarNombre exige letras y largo mínimo', () => {
  assert.equal(validarNombre('Catalina Vargas'), true);
  assert.equal(validarNombre('A'), false);
  assert.equal(validarNombre('Cata123'), false);
});
test('validarPassword exige entre 6 y 72 caracteres', () => {
  assert.equal(validarPassword('12345'), false);
  assert.equal(validarPassword('123456'), true);
});
test('validarRegistro devuelve un error por cada campo inválido', () => {
  const errores = validarRegistro({ name: '', email: 'x', password: '1' });
  assert.deepEqual(Object.keys(errores).sort(), ['email', 'name', 'password']);
  assert.deepEqual(validarRegistro({ name: 'Cata', email: 'c@x.cl', password: 'abcdef' }), {});
});
test('formatearPrecio usa pesos chilenos', () => {
  assert.match(formatearPrecio(12990), /12\.990/);
});

// --- sesión y JWT -----------------------------------------------------------
test('decodeJwt lee el payload y devuelve null si el token está mal formado', () => {
  assert.equal(decodeJwt(crearToken({ sub: 'a@b.cl' })).sub, 'a@b.cl');
  assert.equal(decodeJwt('basura'), null);
});
test('isExpired distingue token vigente, vencido y sin exp', () => {
  const ahora = Date.now();
  assert.equal(isExpired(crearToken({ exp: enSegundos(ahora) + 3600 }), ahora), false);
  assert.equal(isExpired(crearToken({ exp: enSegundos(ahora) - 10 }), ahora), true);
  assert.equal(isExpired(crearToken({ sub: 'sin-exp' }), ahora), true);
});
test('la sesión se guarda y se recupera (persiste al recargar la página)', () => {
  const storage = fakeStorage();
  const token = crearToken({ exp: enSegundos(Date.now()) + 3600 });
  saveSession({ token, user: admin }, storage);
  assert.deepEqual(loadSession(storage), { token, user: admin });
});
test('una sesión con token vencido no se recupera y se borra', () => {
  const storage = fakeStorage();
  saveSession({ token: crearToken({ exp: enSegundos(Date.now()) - 60 }), user: admin }, storage);
  assert.equal(loadSession(storage), null);
  assert.equal(storage.getItem('nutrivida.session'), null);
});
test('una sesión corrupta se descarta sin lanzar error', () => {
  const storage = fakeStorage();
  storage.setItem('nutrivida.session', '{no es json');
  assert.equal(loadSession(storage), null);
});
test('clearSession elimina la sesión (cerrar sesión)', () => {
  const storage = fakeStorage();
  saveSession({ token: crearToken({ exp: enSegundos(Date.now()) + 60 }), user: admin }, storage);
  clearSession(storage);
  assert.equal(loadSession(storage), null);
});

// --- restricciones por rol (Anexo 1 de la evaluación) ------------------------
test('ANON solo ve contenido público y la pantalla de ingreso', () => {
  assert.equal(canAccess('inicio', null), true);
  assert.equal(canAccess('usuarios', null), false);
  assert.equal(canAccess('tienda', null), false);
});
test('CLIENTE solo accede a la tienda y a lo suyo', () => {
  assert.equal(canAccess('tienda', cliente), true);
  assert.equal(canAccess('carrito', cliente), true);
  assert.equal(canAccess('productos', cliente), false);
  assert.equal(canAccess('pedidos', cliente), false);
  assert.equal(canAccess('usuarios', cliente), false);
});
test('VENDEDOR solo ve productos, pedidos y su perfil', () => {
  assert.deepEqual(visibleViews(vendedor), ['productos', 'pedidos', 'perfil']);
  assert.equal(canAccess('ventas', vendedor), false);
  assert.equal(canAccess('usuarios', vendedor), false);
});
test('ADMIN accede a administración pero no al carrito de compras', () => {
  ['usuarios', 'productos', 'pedidos', 'ventas', 'auditoria', 'perfil'].forEach((v) =>
    assert.equal(canAccess(v, admin), true, v));
  assert.equal(canAccess('carrito', admin), false);
});
test('resolveView redirige a la vista por defecto si no hay permiso', () => {
  assert.equal(resolveView('usuarios', cliente), 'tienda');
  assert.equal(resolveView('usuarios', null), 'inicio');
  assert.equal(resolveView('pedidos', vendedor), 'pedidos');
  assert.equal(defaultView(admin), 'usuarios');
});

// --- cliente HTTP (fetch simulado) --------------------------------------------
const respuesta = (status, body) => ({ ok: status >= 200 && status < 300, status, text: async () => (body === undefined ? '' : JSON.stringify(body)) });

beforeEach(() => {
  globalThis.localStorage = fakeStorage();
  setUnauthorizedHandler(() => {});
});

test('api envía el token JWT en la cabecera Authorization', async () => {
  saveSession({ token: crearToken({ exp: enSegundos(Date.now()) + 3600 }), user: admin });
  let enviado;
  globalThis.fetch = async (url, opts) => { enviado = { url, opts }; return respuesta(200, [{ id: 1 }]); };
  const data = await api('/api/v1/products');
  assert.deepEqual(data, [{ id: 1 }]);
  assert.match(enviado.opts.headers.Authorization, /^Bearer x\./);
  assert.match(enviado.url, /\/api\/v1\/products$/);
});
test('api no envía Authorization en login (auth: false)', async () => {
  saveSession({ token: crearToken({ exp: enSegundos(Date.now()) + 3600 }), user: admin });
  let headers;
  globalThis.fetch = async (_u, opts) => { headers = opts.headers; return respuesta(200, {}); };
  await api('/api/v1/auth/login', { method: 'POST', body: { email: 'a', password: 'b' }, auth: false });
  assert.equal(headers.Authorization, undefined);
});
test('api cierra la sesión (handler) cuando el backend responde 401 con token', async () => {
  saveSession({ token: crearToken({ exp: enSegundos(Date.now()) + 3600 }), user: admin });
  let cerrada = false;
  setUnauthorizedHandler(() => { cerrada = true; });
  globalThis.fetch = async () => respuesta(401);
  await assert.rejects(() => api('/api/v1/cart'), (e) => e instanceof ApiError && e.status === 401);
  assert.equal(cerrada, true);
});
test('api entrega errores por campo cuando el backend responde 400', async () => {
  globalThis.fetch = async () => respuesta(400, { status: 400, message: 'Datos inválidos', fields: { email: 'Email inválido' } });
  await assert.rejects(() => api('/api/v1/auth/register', { method: 'POST', body: {}, auth: false }),
    (e) => e.status === 400 && e.fields.email === 'Email inválido');
});
test('api traduce 403 y la caída del servidor a mensajes claros', async () => {
  globalThis.fetch = async () => respuesta(403);
  await assert.rejects(() => api('/api/v1/admin/users'), (e) => e.status === 403 && /permisos/.test(e.message));
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  await assert.rejects(() => api('/api/v1/products'), (e) => e.status === 0 && /backend/.test(e.message));
});
test('query arma parámetros e ignora los vacíos', () => {
  assert.equal(query({ page: 0, size: 10, enabled: '' }), '?page=0&size=10');
  assert.equal(query({}), '');
});
