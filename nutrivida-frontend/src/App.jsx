import React, { useState } from 'react';
import './styles/global.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Mapa } from './components/Mapa';
import { Citas } from './pages/Citas';

export default function App() {
  const [page, setPage] = useState('citas');

  return (
    <div>
      <Navbar setPage={setPage} />
      {page === 'citas' && <Citas />}
      {page === 'inicio' && (
        <main className="container">
          <section>
            <h2>Bienvenidos a Clínica NutriVida</h2>
            <p>Atención nutricional especializada en Temuco.</p>
            <Mapa />
          </section>
        </main>
      )}
      {page === 'ficha' && (
        <main className="container">
          <h2>Mi Historial y Ficha Clínica</h2>
          <p>Módulo de consulta de mediciones para pacientes.</p>
        </main>
      )}
      {page === 'admin' && (
        <main className="container">
          <h2>Panel Administrativo</h2>
          <p>Gestión global de usuarios y roles del sistema.</p>
        </main>
      )}
      <Footer />
    </div>
  );
}