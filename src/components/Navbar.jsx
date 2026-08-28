import React from 'react';

export const Navbar = ({ setPage }) => {
  return (
    <header>
      <nav className="navbar">
        <h2>Clínica NutriVida</h2>
        <ul className="nav-menu">
          <li><button onClick={() => setPage('inicio')}>Inicio</button></li>
          <li><button onClick={() => setPage('citas')}>Agendar Cita</button></li>
          <li><button onClick={() => setPage('ficha')}>Mi Ficha</button></li>
          <li><button onClick={() => setPage('admin')}>Administración</button></li>
        </ul>
      </nav>
    </header>
  );
};