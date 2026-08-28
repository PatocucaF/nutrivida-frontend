import React, { useState } from 'react';

export const Citas = () => {
  const [form, setForm] = useState({ nombre: '', email: '', nutricionista: '', servicio: '', fecha: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre completo es requerido.';
    if (!form.email.includes('@')) errs.email = 'Ingrese un correo electrónico válido.';
    if (!form.nutricionista) errs.nutricionista = 'Debe seleccionar un profesional.';
    if (!form.servicio) errs.servicio = 'Seleccione un servicio del catálogo.';
    if (!form.fecha) errs.fecha = 'Indique la fecha de la consulta.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      alert('¡Solicitud de cita procesada exitosamente!');
      setForm({ nombre: '', email: '', nutricionista: '', servicio: '', fecha: '' });
    }
  };

  return (
    <main className="container">
      <section className="form-card">
        <h2>Solicitud de Cita Nutricional</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo:</label>
            <input
              type="text"
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            {errors.nombre && <p className="error-msg">{errors.nombre}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="nutricionista">Nutricionista:</label>
            <select
              id="nutricionista"
              value={form.nutricionista}
              onChange={(e) => setForm({ ...form, nutricionista: e.target.value })}
            >
              <option value="">-- Seleccionar --</option>
              <option value="NUT001">Nut. Carolina Fuentes (Obesidad/Metabólico)</option>
              <option value="NUT002">Nut. Rodrigo Sepúlveda (Deportiva)</option>
              <option value="NUT003">Nut. Daniela Morales (Vegetariana/Veganismo)</option>
            </select>
            {errors.nutricionista && <p className="error-msg">{errors.nutricionista}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="servicio">Servicio / Plan:</label>
            <select
              id="servicio"
              value={form.servicio}
              onChange={(e) => setForm({ ...form, servicio: e.target.value })}
            >
              <option value="">-- Seleccionar --</option>
              <option value="CN001">Primera consulta ($35.000)</option>
              <option value="CN002">Control mensual ($25.000)</option>
              <option value="CN003">Control quincenal ($22.000)</option>
            </select>
            {errors.servicio && <p className="error-msg">{errors.servicio}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            />
            {errors.fecha && <p className="error-msg">{errors.fecha}</p>}
          </div>

          <button type="submit" className="btn-submit">Agendar Cita</button>
        </form>
      </section>
    </main>
  );
};