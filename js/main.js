// Logica general y eventos para el sitio
console.log('Script de NutriVida cargado correctamente.');

// funciones de inicio de sesion

document.addEventListener("DOMContentLoaded", () => {
    // Elementos del Modal
    const modal = document.getElementById("auth-modal");
    const btnOpenLogin = document.getElementById("btn-open-login");
    const btnOpenRegister = document.getElementById("btn-open-register");
    const btnCloseModal = document.getElementById("btn-close-modal");

    // Pestañas y Formularios
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    // Elemento para mensajes de respuesta
    const authMessage = document.getElementById("auth-message");

    // Función auxiliar para resetear y ocultar mensajes
    const clearMessage = () => {
        if (authMessage) {
            authMessage.textContent = "";
            authMessage.className = "auth-message hidden";
        }
    };

    // Mostrar formulario Login
    const showLogin = () => {
        clearMessage();
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        formLogin.classList.remove("hidden");
        formLogin.classList.add("active");
        formRegister.classList.remove("active");
        formRegister.classList.add("hidden");
    };

    // Mostrar formulario Registro
    const showRegister = () => {
        clearMessage();
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
        formRegister.classList.remove("hidden");
        formRegister.classList.add("active");
        formLogin.classList.remove("active");
        formLogin.classList.add("hidden");
    };

    // Abrir Modal
    btnOpenLogin?.addEventListener("click", (e) => {
        e.preventDefault();
        showLogin();
        modal.style.display = "flex";
    });

    btnOpenRegister?.addEventListener("click", (e) => {
        e.preventDefault();
        showRegister();
        modal.style.display = "flex";
    });

    // Pestañas
    tabLogin?.addEventListener("click", showLogin);
    tabRegister?.addEventListener("click", showRegister);

    // Cerrar Modal
    const closeModal = () => {
        modal.style.display = "none";
        clearMessage();
    };

    btnCloseModal?.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Función genérica para mostrar el mensaje de éxito
    const showSuccessMessage = (message, formToReset) => {
        authMessage.textContent = message;
        authMessage.className = "auth-message success";
        
        // Limpiar inputs del formulario enviado
        formToReset.reset();

        // Cerrar modal automáticamente después de 1.8 segundos
        setTimeout(() => {
            closeModal();
        }, 1800);
    };

    // Procesar Inicio de Sesión
    formLogin?.addEventListener("submit", (e) => {
        e.preventDefault();
        showSuccessMessage("¡Sesión iniciada con éxito! Bienvenido(a).", formLogin);
    });

    // Procesar Registro
    formRegister?.addEventListener("submit", (e) => {
        e.preventDefault();
        showSuccessMessage("¡Cuenta registrada con éxito!", formRegister);
    });
});