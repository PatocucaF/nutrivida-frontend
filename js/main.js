console.log('Script de NutriVida cargado correctamente.');

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconHamburger = document.getElementById('icon-hamburger');
    const iconClose = document.getElementById('icon-close');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
           
            mobileMenu.classList.toggle('hidden');

            if (iconHamburger && iconClose) {
                iconHamburger.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });
    }
});