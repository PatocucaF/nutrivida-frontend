// Reglas de acceso del frontend: qué vistas puede ver cada rol.
// 'ANON' representa a quien no ha iniciado sesión.
// Ojo: esto controla lo que se MUESTRA; la seguridad real la aplica el backend con @PreAuthorize.

export const VIEWS = {
  inicio: { label: 'Inicio', roles: ['ANON', 'CLIENTE', 'ADMIN'] },
  citas: { label: 'Agendar Cita', roles: ['ANON', 'CLIENTE'] },
  ficha: { label: 'Mi Ficha', roles: ['ANON', 'CLIENTE'] },
  login: { label: 'Ingresar', roles: ['ANON'], hidden: true },
  tienda: { label: 'Tienda', roles: ['CLIENTE'] },
  carrito: { label: 'Carrito', roles: ['CLIENTE'] },
  misPedidos: { label: 'Mis pedidos', roles: ['CLIENTE'] },
  productos: { label: 'Productos', roles: ['ADMIN', 'VENDEDOR'] },
  pedidos: { label: 'Pedidos', roles: ['ADMIN', 'VENDEDOR'] },
  ventas: { label: 'Ventas', roles: ['ADMIN'] },
  usuarios: { label: 'Usuarios', roles: ['ADMIN'] },
  auditoria: { label: 'Auditoría', roles: ['ADMIN'] },
  perfil: { label: 'Mi perfil', roles: ['ADMIN', 'VENDEDOR', 'CLIENTE'] },
};

const DEFAULT_VIEW = { ADMIN: 'usuarios', VENDEDOR: 'pedidos', CLIENTE: 'tienda', ANON: 'inicio' };
const ROLE_PRIORITY = ['ADMIN', 'VENDEDOR', 'CLIENTE'];

export function rolesOf(user) {
  const roles = user?.roles ? [...user.roles] : [];
  return roles.length ? roles : ['ANON'];
}

export function primaryRole(user) {
  return ROLE_PRIORITY.find((r) => rolesOf(user).includes(r)) ?? 'ANON';
}

export function canAccess(viewId, user) {
  const view = VIEWS[viewId];
  if (!view) return false;
  const roles = rolesOf(user);
  return view.roles.some((r) => roles.includes(r));
}

export function visibleViews(user) {
  return Object.keys(VIEWS).filter((id) => !VIEWS[id].hidden && canAccess(id, user));
}

export function defaultView(user) {
  return DEFAULT_VIEW[primaryRole(user)];
}

/** Si la vista pedida no está permitida para el usuario, devuelve la vista por defecto de su rol. */
export function resolveView(viewId, user) {
  return canAccess(viewId, user) ? viewId : defaultView(user);
}
