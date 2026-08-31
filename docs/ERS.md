# Especificación de Requisitos del Sistema (ERS)

## 1. Introducción
El proyecto **NutriVida** es una plataforma web para la gestión de pacientes, fichas antropométricas y administración de usuarios de una clínica nutricional, construida con tecnologías web estándar (HTML5, CSS3, JavaScript nativo).

## 2. Requisitos Funcionales
- **RF-01 (Ficha Clínica):** Registro de datos del paciente, cálculo automático del Índice de Masa Corporal (IMC) e historial antropométrico.
- **RF-02 (Panel de Administración):** Visualización de usuarios registrados y modificación dinámica de roles (Administrador, Nutricionista, Asistente) en la interfaz.

## 3. Requisitos No Funcionales
- **RNF-01 (Arquitectura):** Desarrollo frontend nativo sin librerías ni frameworks externos.
- **RNF-02 (Compatibilidad):** Diseño adaptativo (*responsive*) para pantallas de escritorio y dispositivos móviles.

## 4. Diseño de Interfaz y Estilos (CSS)
- **Tema Visual:** Paleta cromática médica basada en verdes y azules institucionales mediante variables CSS (`:root`).
- **Navegación:** Barra superior flotante (*sticky header*) con desenfoque de fondo y estados interactivos (*hover* y *focus*).
- **Componentes:** Tarjetas contenedoras con sombras suaves, badges de estado e inputs editables en tablas.