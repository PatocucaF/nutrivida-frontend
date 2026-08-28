import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Mapa = () => {
  const position = [-38.73965, -72.59842]; // Coordenadas Temuco

  return (
    <section style={{ marginTop: '2rem' }}>
      <h3>Nuestra Ubicación en Temuco</h3>
      <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
        <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <Marker position={position}>
            <Popup>Clínica NutriVida - Temuco.</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};