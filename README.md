# NutriVida — Frontend

Aplicación React (Vite) conectada al backend Spring Boot
([nutrivida-backend](https://github.com/PatocucaF/nutrivida-backend)) mediante API REST con autenticación JWT.

## Cómo ejecutarlo

1. Levantar el backend (`.\mvnw.cmd spring-boot:run`, puerto 8080).
2. En este repositorio:

```bash
npm install
npm run dev        # http://localhost:5173
```

La URL del backend se toma de `VITE_API_URL` (por defecto `http://localhost:8080`).
El backend solo acepta peticiones desde `http://localhost:5173` (CORS).

Otros comandos: `npm test` (pruebas unitarias), `npm run lint`, `npm run build`.

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | admin@nutrivida.cl | Admin12345 |
| VENDEDOR | lo crea el ADMIN en *Usuarios* | — |
| CLIENTE | se crea desde *Ingresar → Regístrate* | — |

## Qué ve cada rol

| Rol | Vistas |
|---|---|
| Sin sesión | Inicio, Agendar Cita, Mi Ficha, Ingresar/Registrarse |
| CLIENTE | Inicio, Agendar Cita, Mi Ficha, **Tienda, Carrito, Mis pedidos**, Mi perfil |
| VENDEDOR | **Productos** (lista y detalle), **Pedidos** (lista y detalle), Mi perfil |
| ADMIN | Inicio, Productos (crear/editar/reponer stock/categorías), Pedidos (anular), Ventas, **Usuarios** (crear/editar/activar/eliminar), Auditoría, Mi perfil |

Las restricciones del frontend (`src/auth/permissions.js`) controlan qué se muestra;
la seguridad real la aplica el backend con `@PreAuthorize` y responde 401/403.

## Estructura

```
src/
  api/client.js          fetch + cabecera Authorization + manejo de errores (401/403/400)
  api/useFetch.js        hook para cargar datos
  auth/session.js        token y usuario en localStorage (sesión persistente al recargar)
  auth/AuthProvider.jsx  login, registro, logout, cierre automático al vencer el token
  auth/permissions.js    qué vistas puede ver cada rol
  views/                 una pantalla por funcionalidad
  utils/                 validaciones (mismas reglas que el backend) y formatos
tests/                   pruebas unitarias del código real (node:test)
```
