// Logica general y eventos para el sitio
console.log('Script de NutriVida cargado correctamente.');

document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const iconHamburger = document.getElementById("icon-hamburger");
    const iconClose = document.getElementById("icon-close");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains("hidden");
        
        if (isHidden) {
            mobileMenu.classList.remove("hidden");
            iconHamburger.classList.add("hidden");
            iconClose.classList.remove("hidden");
        } else {
            mobileMenu.classList.add("hidden");
            iconHamburger.classList.remove("hidden");
            iconClose.classList.add("hidden");
        }
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (!mobileMenu.classList.contains("hidden")) {
                    toggleMenu();
                }
            });
        });
    }
});