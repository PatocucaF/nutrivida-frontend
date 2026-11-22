// Validaciones del formulario. Replican las reglas del backend (RegisterRequest)
// para avisar antes de enviar; el backend vuelve a validar igual.

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

export function validarNombre(nombre) {
  const n = nombre.trim();
  return n.length >= 2 && n.length <= 80 && /^[\p{L}][\p{L} .'-]*$/u.test(n);
}

export function validarPassword(password) {
  return password.length >= 6 && password.length <= 72;
}

/** Devuelve un objeto { campo: mensaje } con los errores; vacío si todo está bien. */
export function validarRegistro({ name, email, password }) {
  const errores = {};
  if (!validarNombre(name)) errores.name = 'El nombre debe tener entre 2 y 80 caracteres y solo letras.';
  if (!validarEmail(email)) errores.email = 'Ingresa un correo válido.';
  if (!validarPassword(password)) errores.password = 'La contraseña debe tener entre 6 y 72 caracteres.';
  return errores;
}

export function formatearPrecio(valor) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
    .format(Number(valor ?? 0));
}

export function formatearFechaHora(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}
