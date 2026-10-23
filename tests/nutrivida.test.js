import assert from 'node:assert/strict';
import { test } from 'node:test';

// --- FUNCIONES LÓGICAS BAJO PRUEBA ---
function calcularIMC(peso, talla) {
  const p = parseFloat(peso);
  const t = parseFloat(talla);
  if (p > 0 && t > 0) {
    return (p / (t * t)).toFixed(1);
  }
  return '';
}

function autenticar(usuario, clave) {
  return usuario === 'admin' && clave === 'nutrivida2026';
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return '';
  const [y, m, d] = fechaIso.split('-');
  return `${d}/${m}/${y}`;
}

function filtrarUsuariosPorRol(lista, rol) {
  return lista.filter(u => u.rol === rol);
}

// --- SUITE DE 10 TESTS UNITARIOS EXIGIDOS ---
test('1. Calcula correctamente el IMC con peso y talla válidos (82.5 kg, 1.75 m -> 26.9)', () => {
  assert.equal(calcularIMC(82.5, 1.75), '26.9');
});

test('2. Retorna cadena vacía si el peso es menor o igual a cero', () => {
  assert.equal(calcularIMC(0, 1.75), '');
});

test('3. Retorna cadena vacía si la talla es menor o igual a cero evitando división por cero', () => {
  assert.equal(calcularIMC(70, 0), '');
});

test('4. Redondea el cálculo del IMC exactamente a un decimal con toFixed(1)', () => {
  assert.equal(calcularIMC(80.1, 1.75), '26.2');
});

test('5. Autentica con éxito al administrador con credenciales válidas', () => {
  assert.equal(autenticar('admin', 'nutrivida2026'), true);
});

test('6. Rechaza el acceso con contraseña incorrecta', () => {
  assert.equal(autenticar('admin', 'password_erronea'), false);
});

test('7. Rechaza el acceso con usuario no registrado', () => {
  assert.equal(autenticar('desconocido', 'nutrivida2026'), false);
});

test('8. Valida formato de correo electrónico institucional correcto', () => {
  assert.equal(validarEmail('cmorales@nutrivida.cl'), true);
});

test('9. Rechaza formato de correo electrónico sin formato válido', () => {
  assert.equal(validarEmail('correo-invalido.cl'), false);
});

test('10. Filtra y recupera correctamente usuarios según su rol asignado en el sistema', () => {
  const usuariosMock = [
    { nombre: 'Camila', rol: 'Nutricionista' },
    { nombre: 'Javier', rol: 'Paciente' },
    { nombre: 'Roberto', rol: 'Nutricionista' }
  ];
  const resultado = filtrarUsuariosPorRol(usuariosMock, 'Nutricionista');
  assert.equal(resultado.length, 2);
  assert.equal(resultado[0].nombre, 'Camila');
});