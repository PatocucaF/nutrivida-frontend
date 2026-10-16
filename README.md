##  Descripción del Proyecto

**NutriVida** es un sistema de gestión clínica y agendamiento web diseñado para optimizar la atención de consultas nutricionales en la ciudad de Temuco. El desarrollo está construido bajo una arquitectura limpia utilizando estándares web nativos (**HTML5, CSS3 y Vanilla JavaScript**), garantizando ligereza, alto rendimiento y fácil mantenibilidad sin dependencia de librerías externas o frameworks.

---

##  Arquitectura y Componentes Desarrollados

Actualmente se encuentra implementada la infraestructura base del sistema, la interfaz responsive global y los módulos funcionales primarios:

* **Estructura Web Unificada:** Maquetación modular y semántica de las vistas principales del sistema (`index.html`, `citas.html`, `ficha.html`, `admin.html`), asegurando cohesión visual y navegación intuitiva.
  * **Hero Carousel:** Carrusel de presentación institucional con controles de navegación transparentes y transiciones suaves.
  * **Servicios y Especialidades:** Cuadrícula interactiva 2x2 (*Pediatría, Clínica, Deportiva, Psiconutrición*) con descripción detallada del abordaje en cada sesión.
  * **Acceso a Mi Ficha:** Módulo de consulta directa para pacientes vigentes.
  * **Catálogo del Equipo Médico:** Fichas horizontales con modalidad de atención (*Presencial/Online*), especialidad y enlace directo a reserva.
* **Sistema de Estilos Globales (`css/estilo.css`):** Hojas de estilo estructuradas bajo metodología moderna, asegurando un diseño totalmente adaptativo (*mobile-first*) y consistente en toda la plataforma.
* **Módulo de Agendamiento Clínico (`citas.html`):** Formulario para la gestión y captura de citas médicas, parametrizado con validación de datos en tiempo real, selección de profesionales y catálogo de servicios nutricionales.
* **Portal del Paciente (`ficha.html`):** Interfaz preparada para la visualización de pautas alimentarias y evolución clínica.
* **Panel de Administración (`admin.html`):** Módulo de control interno para la supervisión de citas y gestión de horas del equipo médico.
* **Geolocalización e Interacción (`js/mapa.js`):** Integración de mapas interactivos utilizando **Leaflet.js** y capas de **OpenStreetMap** para la ubicación precisa de la sede central en Temuco.
* **Lógica de Control (`js/main.js`):** Script principal en Vanilla JavaScript preparado para la manipulación del DOM, control de eventos, validaciones y futuras integraciones con servicios backend.
* **Repositorio Documental (`docs/`):** Estructura dedicada al almacenamiento de la documentación técnica y las Especificaciones de Requisitos de Software (ERS).

---

##  Despliegue en Entorno Local

Para ejecutar y explorar el proyecto en un entorno local:

1. Clonar este repositorio mediante el terminal:
   ```bash
   git clone <URL_DEL_REPOSITORIO>



## Estado del Proyecto
- Design & UI: Completado (Paleta clínica, responsive y microinteracciones).
- Documentación: ERS actualizada en `docs/ERS.md`.


## Sistema de Diseño e Identidad Visual

La interfaz se estructuró bajo un sistema de diseño propio orientado al sector salud, implementando microinteracciones, bordes redondeados y componentes de cápsulas flotantes (*floating capsules*) para brindar una experiencia limpia y reducir la fatiga visual:

| Color | Código Hex | Aplicación en la Interfaz |
| :--- | :--- | :--- |
| **Soft Blue** | `#80A1D4` | Títulos de secciones, bordes de botones y acentos visuales |
| **Light Teal** | `#75C9C8` | Encabezados principales de equipo y elementos de acento |
| **Warm Coral** | `#E76F51` | Estados interactivos (*hover*), llamadas a la acción y confirmaciones |
| **Off-White** | `#F7FAFC` | Fondos de secciones y superficies de bajo contraste |
| **Card White**| `#FFFFFF` | Contenedores modulares, tarjetas clínicas y formularios |

---


## Estructura de Archivos del Repositorio

```text
nutrivida/
├── docs/
│   └── ERS.md                 # Especificación de Requisitos de Software
├── css/
│   └── estilo.css             # Hoja de estilos global, layouts y media queries
├── js/
│   ├── main.js                # Lógica de interfaz y validaciones DOM
│   └── mapa.js                # Instanciación y marcadores Leaflet
├── img/                       # Fotografías del equipo y recursos gráficos
├── index.html                 # Página principal / Landing page
├── citas.html                 # Módulo de reserva de horas
├── ficha.html                 # Portal de seguimiento del paciente
├── admin.html                 # Panel de administración clínica
└── README.md                  # Documentación técnica del proyecto

