// Lógica para el cálculo y registro de mediciones en la Ficha Clínica

document.addEventListener('DOMContentLoaded', () => {
    const inputPeso = document.getElementById('peso');
    const inputTalla = document.getElementById('talla');
    const inputIMC = document.getElementById('imc-calculado');
    const formFicha = document.getElementById('form-ficha');
    const tablaBody = document.querySelector('#tabla-ficha tbody');

    // Función para calcular IMC automáticamente
    function calcularIMC(){
        const peso = parseFloat(inputPeso.value);
        const talla = parseFloat(inputTalla.value);

        if (peso > 0 && talla > 0) {
            const imc = (peso / (talla * talla)).toFixed(1);
            inputIMC.value = imc;
        } else {
            inputIMC.value = '';
        }
    }

    inputPeso.addEventListener('input', calcularIMC);
    inputTalla.addEventListener('input', calcularIMC);

    // Agregar nueva fila a la tabla al enviar el formulario
    formFicha.addEventListener('submit', (e) => {
        e.preventDefault();

        const fecha = document.getElementById('fecha-medicion').value;
        const peso = parseFloat(inputPeso.value).toFixed(1);
        const talla = parseFloat(inputTalla.value).toFixed(2);
        const grasa = parseFloat(document.getElementById('grasa').value).toFixed(1);
        const imc = inputIMC.value;

        // Formatear fecha
        const [year, month, day] = fecha.split('-');
        const fechaFormateada = `${day}/${month}/${year}`;

        // Crear nueva fila en la tabla del historial
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${peso}</td>
            <td>${talla}</td>
            <td>${imc}</td>
            <td>${grasa}%</td>
        `;

        tablaBody.appendChild(tr);

        // Limpiar el formulario
        formFicha.reset();
        inputIMC.value = '';
        alert('Nueva evaluación registrada con éxito');

    });
});