/** IMC = peso / talla². Devuelve '' si los datos no son válidos (evita dividir por cero). */
export function calcularIMC(peso, talla) {
  const p = parseFloat(peso);
  const t = parseFloat(talla);
  return p > 0 && t > 0 ? (p / (t * t)).toFixed(1) : '';
}
