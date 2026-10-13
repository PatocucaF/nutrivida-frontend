import { useState } from 'react';
import './index.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('inicio');

  // --- CARRUSEL REACTIVO ---
  const [slideActual, setSlideActual] = useState(0);
  const slides = [
    {
      img: '/img/IMG1.jpg',
      titulo: 'Nutrición con Base Científica en Temuco',
      desc: 'Planes 100% personalizados para potenciar tu salud, rendimiento y bienestar.'
    },
    {
      img: '/img/IMG2.jpg',
      titulo: 'Especialistas en Salud Metabólica y Deporte',
      desc: 'Acompañamiento clínico integral adaptado a tus objetivos reales.'
    },
    {
      img: '/img/IMG3.jpg',
      titulo: 'Salud infantil guiada por especialistas',
      desc: 'Consulta únicamente presencial, con la mayor calidez y cuidado.'
    }
  ];

  const siguienteSlide = () => setSlideActual((prev) => (prev + 1) % slides.length);
  const anteriorSlide = () => setSlideActual((prev) => (prev - 1 + slides.length) % slides.length);

  // --- FICHA CLÍNICA (IMC REACTIVO) ---
  const [fechaMedicion, setFechaMedicion] = useState('2026-10-12');
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [grasa, setGrasa] = useState('');
  const [historial, setHistorial] = useState([
    { fecha: '10/01/2026', peso: '82.5', talla: '1.75', imc: '26.9', grasa: '24.5%' },
    { fecha: '15/02/2026', peso: '80.1', talla: '1.75', imc: '26.1', grasa: '23.0%' }
  ]);

  const p = parseFloat(peso);
  const t = parseFloat(talla);
  const imcCalculado = (p > 0 && t > 0) ? (p / (t * t)).toFixed(1) : '';

  const handleAgregarMedicion = (e) => {
    e.preventDefault();
    if (!imcCalculado) return;
    const [y, m, d] = fechaMedicion.split('-');
    const nuevaEvaluacion = {
      fecha: `${d}/${m}/${y}`,
      peso: p.toFixed(1),
      talla: t.toFixed(2),
      imc: imcCalculado,
      grasa: `${parseFloat(grasa || 0).toFixed(1)}%`
    };
    setHistorial([nuevaEvaluacion, ...historial]);
    setPeso('');
    setTalla('');
    setGrasa('');
    alert('Evaluación guardada exitosamente.');
  };

  // --- AGENDAR CITA ---
  const [citaData, setCitaData] = useState({ nombre: '', email: '', nutricionista: '', servicio: '', fecha: '' });
  const [mensajeCita, setMensajeCita] = useState('');

  const handleCitaSubmit = (e) => {
    e.preventDefault();
    setMensajeCita(`¡Solicitud confirmada para ${citaData.nombre}! Nos comunicaremos pronto.`);
    setCitaData({ nombre: '', email: '', nutricionista: '', servicio: '', fecha: '' });
  };

  // --- ADMINISTRACIÓN ---
  const [adminAuth, setAdminAuth] = useState(false);
  const [credenciales, setCredenciales] = useState({ user: '', pass: '' });
  const [errorLogin, setErrorLogin] = useState(false);
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Camila Morales', email: 'cmorales@nutrivida.cl', rol: 'Nutricionista', estado: 'Activo' },
    { id: 2,  nombre: 'Javier Pérez', email: 'javier.perez@gmail.com', rol: 'Paciente', estado: 'Activo' }
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: 'Nutricionista' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (credenciales.user === 'admin' && credenciales.pass === 'nutrivida2026') {
      setAdminAuth(true);
      setErrorLogin(false);
    } else {
      setErrorLogin(true);
    }
  };

  const handleAgregarUsuario = (e) => {
    e.preventDefault();
    setUsuarios([...usuarios, { ...nuevoUsuario, id: Date.now(), estado: 'Activo' }]);
    setNuevoUsuario({ nombre: '', email: '', rol: 'Nutricionista' });
  };

  const cambiarRolUsuario = (id) => {
    const rolesDisponibles = ['Nutricionista', 'Administrador', 'Paciente'];
    setUsuarios(usuarios.map(u => {
      if (u.id === id) {
        const index = rolesDisponibles.indexOf(u.rol);
        const proxRol = rolesDisponibles[(index + 1) % rolesDisponibles.length];
        return { ...u, rol: proxRol };
      }
      return u;
    }));
  };

  return (
    <div>
      {/* HEADER ORIGINAL */}
      <header>
        <div className="header-container">
          <h1 className="logo" onClick={() => setCurrentTab('inicio')}>Clínica NutriVida</h1>
          <nav className="header-nav">
            <div className="nav-links-desktop">
              <button className={currentTab === 'inicio' ? 'active' : ''} onClick={() => setCurrentTab('inicio')}>Inicio</button>
              <button className={currentTab === 'citas' ? 'active' : ''} onClick={() => setCurrentTab('citas')}>Agendar Cita</button>
              <button className={currentTab === 'ficha' ? 'active' : ''} onClick={() => setCurrentTab('ficha')}>Mi Ficha</button>
              <button className={currentTab === 'admin' ? 'active' : ''} onClick={() => setCurrentTab('admin')}>Administración</button>
            </div>
          </nav>
        </div>
      </header>

      {/* AURAS FLOTANTES DE FONDO */}
      <div className="nv-aura nv-aura-1"></div>
      <div className="nv-aura nv-aura-2"></div>
      <div className="nv-aura nv-aura-3"></div>
      <div className="nv-aura nv-aura-4"></div>

      {/* 1. VISTA INICIO */}
      {currentTab === 'inicio' && (
        <>
          <section className="nv-carousel-wrapper">
            <div className="carousel-container">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className={`carousel-slide ${idx === slideActual ? 'active' : ''}`}
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('${s.img}')`
                  }}
                >
                  <div className="slide-content">
                    <h2>{s.titulo}</h2>
                    <p>{s.desc}</p>
                    <button className="btn-hero" onClick={() => setCurrentTab('citas')}>Agendar Consulta</button>
                  </div>
                </div>
              ))}

              <button className="carousel-btn prev-btn" onClick={anteriorSlide} aria-label="Anterior">&#10094;</button>
              <button className="carousel-btn next-btn" onClick={siguienteSlide} aria-label="Siguiente">&#10095;</button>

              <div className="carousel-dots">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === slideActual ? 'active' : ''}`}
                    onClick={() => setSlideActual(idx)}
                  />
                ))}
              </div>
            </div>
          </section>

          <main>
            {/* SERVICIOS */}
            <section id="servicios" className="nv-servicios-seccion">
              <div className="nv-servicios-contenedor">
                <h3 className="nv-servicios-titulo">Servicios y Especialidades</h3>
                <div className="nv-grilla-servicios">
                  <div className="nv-capsula-servicio">
                    <h4 className="nv-capsula-nombre">Pediatría</h4>
                    <p className="nv-capsula-desc">
                      Evaluación de crecimiento, transición alimentaria, método BLW y pautas para crear hábitos saludables sin presiones desde la infancia.
                    </p>
                  </div>
                  <div className="nv-capsula-servicio">
                    <h4 className="nv-capsula-nombre">Deportiva</h4>
                    <p className="nv-capsula-desc">
                      Optimización de energía, planes de carga, suplementación estratégica y recomposición corporal según tu disciplina y entrenamientos.
                    </p>
                  </div>
                  <div className="nv-capsula-servicio">
                    <h4 className="nv-capsula-nombre">Clínica</h4>
                    <p className="nv-capsula-desc">
                      Tratamiento nutricional de patologías crónicas, salud digestiva, resistencia a la insulina y control de parámetros bioquímicos.
                    </p>
                  </div>
                  <div className="nv-capsula-servicio">
                    <h4 className="nv-capsula-nombre">Psiconutrición</h4>
                    <p className="nv-capsula-desc">
                      Herramientas para gestionar la ansiedad por comer, romper ciclos de restricción y construir una relación consciente y en paz con la comida.
                    </p>
                  </div>
                </div>

                <div className="nv-franja-ficha-wrap">
                  <div className="nv-franja-ficha">
                    <div className="nv-franja-texto">
                      <h4>Si ya perteneces a nuestra familia</h4>
                      <p>Revisa tus pautas y progreso clínico aquí</p>
                    </div>
                    <button className="nv-btn-franja-ficha" onClick={() => setCurrentTab('ficha')}>Mi Ficha &rarr;</button>
                  </div>
                </div>
              </div>
            </section>

            {/* EQUIPO MÉDICO */}
            <section id="equipo" className="nv-equipo-seccion">
              <div className="nv-equipo-header">
                <h3>EQUIPO MÉDICO - NUTRIVIDA</h3>
                <p>Especialistas dedicados a construir tu bienestar integral.</p>
              </div>

              <div className="nv-equipo-grid-nodulos">
                <article className="nv-nodulo-doc">
                  <div className="nv-nodulo-foto">
                    <img src="/img/Constanza_Diaz.jpg" alt="Constanza Díaz" />
                  </div>
                  <div className="nv-nodulo-info">
                    <div className="nv-nodulo-top">
                      <span className="nv-badge-modalidad">Presencial & Online</span>
                      <h4>Constanza Díaz <span>— Clínica</span></h4>
                    </div>
                    <p className="nv-nodulo-desc">
                      Manejo nutricional de patologías crónicas y digestivas. Tratamiento personalizado en resistencia a la insulina y salud metabólica.
                    </p>
                    <div className="nv-nodulo-footer">
                      <button className="nv-btn-agendar-card" onClick={() => setCurrentTab('citas')}>Agendar cita &rarr;</button>
                    </div>
                  </div>
                </article>

                <article className="nv-nodulo-doc">
                  <div className="nv-nodulo-foto">
                    <img src="/img/Andrea_Muñoz.jpg" alt="Andrea Muñoz" />
                  </div>
                  <div className="nv-nodulo-info">
                    <div className="nv-nodulo-top">
                      <span className="nv-badge-modalidad">Atención Presencial</span>
                      <h4>Andrea Muñoz <span>— Pediátrica</span></h4>
                    </div>
                    <p className="nv-nodulo-desc">
                      Acompañamiento cercano en etapas clave de crecimiento y método BLW. Hábitos familiares saludables y relación positiva con la comida.
                    </p>
                    <div className="nv-nodulo-footer">
                      <button className="nv-btn-agendar-card" onClick={() => setCurrentTab('citas')}>Agendar cita &rarr;</button>
                    </div>
                  </div>
                </article>

                <article className="nv-nodulo-doc">
                  <div className="nv-nodulo-foto">
                    <img src="/img/Kevin_Carrasco.jpg" alt="Kevin Carrasco" />
                  </div>
                  <div className="nv-nodulo-info">
                    <div className="nv-nodulo-top">
                      <span className="nv-badge-modalidad">Presencial & Online</span>
                      <h4>Kevin Carrasco <span>— Deportivo</span></h4>
                    </div>
                    <p className="nv-nodulo-desc">
                      Especializado en ganancia de masa muscular y fuerza. Estrategias con base científica para atletas y entrenamiento físico.
                    </p>
                    <div className="nv-nodulo-footer">
                      <button className="nv-btn-agendar-card" onClick={() => setCurrentTab('citas')}>Agendar cita &rarr;</button>
                    </div>
                  </div>
                </article>

                <article className="nv-nodulo-doc">
                  <div className="nv-nodulo-foto">
                    <img src="/img/Marco_Valencia.jpg" alt="Marco Valencia" />
                  </div>
                  <div className="nv-nodulo-info">
                    <div className="nv-nodulo-top">
                      <span className="nv-badge-modalidad">Atención Online</span>
                      <h4>Marco Valencia <span>— Psiconutrición</span></h4>
                    </div>
                    <p className="nv-nodulo-desc">
                      Abordaje integrativo en la relación emocional y mental con la comida. Herramientas prácticas contra la ansiedad y alimentación consciente.
                    </p>
                    <div className="nv-nodulo-footer">
                      <button className="nv-btn-agendar-card" onClick={() => setCurrentTab('citas')}>Agendar cita &rarr;</button>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* MISIÓN Y VISIÓN */}
            <section id="nosotros" className="nv-mision-vision-seccion">
              <div className="nv-mv-header">
                <h3>NUESTRO COMPROMISO</h3>
                <p>Pilares fundamentales que guían nuestra labor en La Araucanía.</p>
              </div>
              <div className="nv-mv-grid">
                <div className="nv-mv-card">
                  <h4>Nuestra Misión</h4>
                  <p>
                    Brindar atención nutricional personalizada con estricta base científica, 
                    acompañando a cada paciente en la adopción de hábitos sostenibles que fomenten una salud 
                    integral duradera, empática y sin restricciones innecesarias.
                  </p>
                </div>
                <div className="nv-mv-card">
                  <h4>Nuestra Visión</h4>
                  <p>
                    Ser el centro de referencia en bienestar nutricional y salud preventiva en Temuco y 
                    el sur de Chile, reconocidos por nuestra excelencia clínica, calidez humana y enfoque integrador.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTACTO, UBICACIÓN Y MAPA */}
            <section id="contacto" className="nv-contacto-seccion">
              <div className="nv-contacto-grid">
                <div className="nv-contacto-info">
                  <h3>Encuéntranos</h3>
                  <p className="nv-contacto-bajada">Visítanos en nuestra sede central o comunícate directamente con nuestro equipo de atención.</p>

                  <div className="nv-info-item">
                    <div className="nv-info-icono">◎</div>
                    <div>
                      <h5>Ubicación</h5>
                      <p>Av. Alemania 0420, Temuco, Región de La Araucanía</p>
                    </div>
                  </div>

                  <div className="nv-info-item">
                    <div className="nv-info-icono">⏱</div>
                    <div>
                      <h5>Horarios de Atención</h5>
                      <p>Lunes a Viernes: 08:30 – 19:30 hrs<br />Sábados: 09:00 – 14:00 hrs</p>
                    </div>
                  </div>

                  <div className="nv-info-item">
                    <div className="nv-info-icono">☏</div>
                    <div>
                      <h5>Contacto Directo</h5>
                      <p>Teléfono: +56 45 234 5678<br />WhatsApp: +56 9 8765 4321</p>
                    </div>
                  </div>

                  <div className="nv-contacto-acciones">
                    <a href="https://wa.me/56987654321" target="_blank" rel="noreferrer" className="nv-btn-wsp">Escribir por WhatsApp</a>
                  </div>
                </div>

                <div className="nv-mapa-columna">
                  <div className="nv-mapa-contenedor">
                    <iframe
                      title="Mapa Temuco"
                      src="https://maps.google.com/maps?q=Av.+Alemania+0420,+Temuco&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
      )}

      {/* 2. VISTA AGENDAR CITA */}
      {currentTab === 'citas' && (
        <main>
          <section className="card-box" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Solicitud de Cita Nutricional</h2>
            {mensajeCita && (
              <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                {mensajeCita}
              </div>
            )}
            <form onSubmit={handleCitaSubmit}>
              <div className="form-group">
                <label>Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                  value={citaData.nombre}
                  onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  value={citaData.email}
                  onChange={(e) => setCitaData({ ...citaData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Nutricionista:</label>
                <select
                  required
                  value={citaData.nutricionista}
                  onChange={(e) => setCitaData({ ...citaData, nutricionista: e.target.value })}
                >
                  <option value="">-- Seleccionar Profesional --</option>
                  <option value="Constanza Díaz">Dra. Constanza Díaz</option>
                  <option value="Andrea Muñoz">Dra. Andrea Muñoz</option>
                  <option value="Kevin Carrasco">Dr. Kevin Carrasco</option>
                  <option value="Marco Valencia">Dr. Marco Valencia</option>
                </select>
              </div>

              <div className="form-group">
                <label>Servicio / Plan:</label>
                <select
                  required
                  value={citaData.servicio}
                  onChange={(e) => setCitaData({ ...citaData, servicio: e.target.value })}
                >
                  <option value="">-- Seleccionar Servicio --</option>
                  <option value="inicial">Consulta Nutricional Inicial ($35.000)</option>
                  <option value="control">Control Nutricional ($25.000)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fecha de la Cita:</label>
                <input
                  type="date"
                  required
                  value={citaData.fecha}
                  onChange={(e) => setCitaData({ ...citaData, fecha: e.target.value })}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
                Confirmar Cita
              </button>
            </form>
          </section>
        </main>
      )}

      {/* 3. VISTA FICHA CLÍNICA (IMC) */}
      {currentTab === 'ficha' && (
        <main>
          <section className="card-box">
            <h2>Ficha Clínica del Paciente</h2>
            <p style={{ marginTop: '0.5rem' }}>
              <strong>Paciente:</strong> Juan Pérez | <strong>RUT:</strong> 18.123.456-7 | <strong>Edad:</strong> 28 años
            </p>
          </section>

          <section className="card-box">
            <h3>Registrar Nueva Evaluación Antropométrica</h3>
            <form onSubmit={handleAgregarMedicion} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    required
                    value={fechaMedicion}
                    onChange={(e) => setFechaMedicion(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Peso (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 75.5"
                    required
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Talla / Estatura (m):</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 1.75"
                    required
                    value={talla}
                    onChange={(e) => setTalla(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>% Grasa Corporal:</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 22.0"
                    required
                    value={grasa}
                    onChange={(e) => setGrasa(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>IMC Calculado (en tiempo real):</label>
                <input
                  type="text"
                  placeholder="Se calcula automáticamente"
                  readOnly
                  style={{ backgroundColor: '#e9ecef', fontWeight: 'bold', color: '#0288d1' }}
                  value={imcCalculado ? `${imcCalculado} kg/m²` : ''}
                />
              </div>

              <button type="submit" style={{ marginTop: '0.5rem' }}>Guardar Evaluación</button>
            </form>
          </section>

          <section className="card-box">
            <h3>Historial de Mediciones</h3>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Peso (kg)</th>
                  <th>Talla (m)</th>
                  <th>IMC</th>
                  <th>% Grasa</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i}>
                    <td>{h.fecha}</td>
                    <td>{h.peso}</td>
                    <td>{h.talla}</td>
                    <td><span className="badge">{h.imc}</span></td>
                    <td>{h.grasa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {/* 4. VISTA ADMINISTRACIÓN */}
      {currentTab === 'admin' && (
        <main>
          {!adminAuth ? (
            <section className="card-box" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
              <h2>Acceso Restringido</h2>
              <p style={{ marginTop: '0.5rem', color: '#555' }}>Ingrese sus credenciales de Administrador para acceder al panel.</p>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Usuario (admin)"
                  required
                  value={credenciales.user}
                  onChange={(e) => setCredenciales({ ...credenciales, user: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Contraseña (nutrivida2026)"
                  required
                  value={credenciales.pass}
                  onChange={(e) => setCredenciales({ ...credenciales, pass: e.target.value })}
                />
                <button type="submit">Ingresar al Panel</button>
              </form>

              {errorLogin && (
                <p style={{ color: '#d32f2f', marginTop: '1rem', fontWeight: 'bold' }}>
                  Credenciales incorrectas. Pruebe admin / nutrivida2026
                </p>
              )}
            </section>
          ) : (
            <div>
              <section className="card-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2>Panel de Gestión de Usuarios y Roles</h2>
                  <p style={{ marginTop: '0.5rem' }}>Administración de accesos y permisos del personal médico y pacientes.</p>
                </div>
                <button onClick={() => setAdminAuth(false)} style={{ background: '#d32f2f', padding: '0.5rem 1rem' }}>
                  Cerrar Sesión
                </button>
              </section>

              <section className="card-box" style={{ marginTop: '1.5rem' }}>
                <h3>Registrar nuevo usuario</h3>
                <form onSubmit={handleAgregarUsuario} style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Nombre Completo:</label>
                      <input
                        type="text"
                        placeholder="Ej: Roberto Gómez"
                        required
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Correo Electrónico:</label>
                      <input
                        type="email"
                        placeholder="Ej: roberto.gomez@gmail.com"
                        required
                        value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Rol asignado:</label>
                      <select
                        value={nuevoUsuario.rol}
                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })}
                      >
                        <option value="Nutricionista">Nutricionista</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Paciente">Paciente</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" style={{ marginTop: '1rem' }}>Agregar Usuario</button>
                </form>
              </section>

              <section className="card-box" style={{ marginTop: '1.5rem' }}>
                <h3>Usuarios Registrados</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Correo</th>
                      <th>Rol actual</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td>{u.nombre}</td>
                        <td>{u.email}</td>
                        <td><span className="badge">{u.rol}</span></td>
                        <td>{u.estado}</td>
                        <td>
                          <button className="btn-cambiar-rol" onClick={() => cambiarRolUsuario(u.id)}>Cambiar Rol</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          )}
        </main>
      )}

      {/* FOOTER ORIGINAL */}
      <footer>
        <p>&copy; 2026 Clínica NutriVida - Temuco, Región de La Araucanía</p>
      </footer>
    </div>
  );
}