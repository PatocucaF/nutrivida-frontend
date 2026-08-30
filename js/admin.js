// Lógica para la gestión de usuarios y roles en la vista Admin

document.addEventListener('DOMContentLoaded', () => {
    const formAdmin = document.getElementById('form-admin');
    const tablaUsuarios = document.querySelector('#tabla-usuarios tbody');

    if (formAdmin) {
        formAdmin.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('admin-nombre').value;
            const email = document.getElementById('admin-email').value;
            const rol = document.getElementById('admin-rol').value;
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${nombre}</td>
                <td>${email}</td>
                <td><span class="badge">${rol}</span></td>
                <td>Activo</td>
                <td><button type="button" class="btn-cambiar-rol">Cambiar Rol</button></td>
            `;

            tablaUsuarios.appendChild(tr);
            formAdmin.reset();
            alert(`Usuario ${nombre} agregado con éxito como ${rol}.`);
        });
    }

    if (tablaUsuarios) {
        tablaUsuarios.addEventListener('click', (e) => {

            if (e.target && e.target.classList.contains('btn-cambiar-rol')) {
                const fila = e.target.closest('tr');
                const usuarioNombre = fila.cells[0].innerText;
                const rolBadge = fila.cells[2].querySelector('.badge') || fila.cells[2];
                const rolActual = rolBadge.innerText.trim();
                const nuevoRol = prompt(
                    `Cambiar rol para ${usuarioNombre}.\n` +
                    `Rol actual: ${rolActual}\n\n` +
                    `Ingresa el número de la opción elegida:\n` +
                    `1. Nutricionista\n` +
                    `2. Administrador\n` +
                    `3. Paciente`,
                    "1"
                );

                if (nuevoRol === "1") {
                    rolBadge.innerText = "Nutricionista";
                    alert(`El rol de ${usuarioNombre} cambió a Nutricionista.`);
                } else if (nuevoRol === "2") {
                    rolBadge.innerText = "Administrador";
                    alert(`El rol de ${usuarioNombre} cambió a Administrador.`);
                } else if (nuevoRol === "3") {
                    rolBadge.innerText = "Paciente";
                    alert(`El rol de ${usuarioNombre} cambió a Paciente.`);
                } else if (nuevoRol !== null) {
                    alert("Opción no válida. Debes ingresar 1, 2 o 3.");
                }
            }
        });
    }
});