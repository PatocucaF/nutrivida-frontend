// Render del mapa de Leaflet enfocado en Temuco
document.addEventListener('DOMContentLoaded', () => {
    const mapaDiv = document.getElementById('mapa-temuco');
    
    // Validar si la vista actual requiere mapa
    if (mapaDiv) {
        // Coordenadas aproximadas del centro de Temuco
        const coords = [-38.73965, -72.59842];
        const map = L.map('mapa-temuco').setView(coords, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Marcador de la clinica
        L.marker(coords).addTo(map)
            .bindPopup('<b>Clínica NutriVida</b><br>Sede Temuco.')
            .openPopup();
    }
});