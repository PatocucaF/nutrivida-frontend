##  Descripción del Proyecto

**NutriVida** es un sistema de gestión clínica y agendamiento web diseñado para optimizar la atención de consultas nutricionales en la ciudad de Temuco. El desarrollo está construido bajo una arquitectura limpia utilizando estándares web nativos (**HTML5, CSS3 y Vanilla JavaScript**), garantizando ligereza, alto rendimiento y fácil mantenibilidad sin dependencia de librerías externas o frameworks.

---

##  Arquitectura y Componentes Desarrollados

Actualmente se encuentra implementada la infraestructura base del sistema, la interfaz responsive global y los módulos funcionales primarios:

* **Estructura Web Unificada:** Maquetación modular de las vistas principales del sistema (`index.html`, `citas.html`, `ficha.html`, `admin.html`), asegurando la cohesión visual y navegabilidad fluida.
* **Sistema de Estilos Globales (`css/estilo.css`):** Hojas de estilo estructuradas bajo metodología moderna, asegurando un diseño adaptativo (*mobile-first*) y consistente en toda la plataforma.
* **Módulo de Agendamiento Clínico (`citas.html`):** Formulario para la gestión y captura de citas médicas, parametrizado con validación de datos, selección de profesionales y catálogo de servicios nutricionales.
* **Geolocalización e Interacción (`js/mapa.js`):** Integración de mapas interactivos utilizando **Leaflet.js** y capas de **OpenStreetMap** para la ubicación precisa de la clínica en Temuco.
* **Lógica de Control (`js/main.js`):** Script principal preparado para la manipulación del DOM, control de eventos y futuras integraciones con servicios backend.
* **Repositorio Documental (`docs/`):** Estructura dedicada al almacenamiento de la documentación técnica y las Especificaciones de Requisitos de Software (ERS).

---

##  Despliegue en Entorno Local

Para ejecutar y explorar el proyecto en un entorno local:

1. Clonar este repositorio mediante el terminal:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
