# ◈ FiberDesk

### Network Management System

**FiberDesk** es una aplicación web de gestión administrativa diseñada para empresas de telecomunicaciones y proveedores de servicios de fibra óptica.

Su objetivo es centralizar y simplificar la gestión de clientes, instalaciones, técnicos e incidencias desde una interfaz moderna, intuitiva y adaptable.

<p align="center">
  <img src="https://img.shields.io/badge/Angular-Standalone-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

---

## ✨ Características principales

- **Dashboard:** panel principal con indicadores y resumen general de la actividad.
- **Gestión de clientes:** administración de información, planes y estados de clientes.
- **Gestión de instalaciones:** seguimiento de instalaciones y sus estados.
- **Gestión de técnicos:** administración de técnicos, especialidades y disponibilidad.
- **Gestión de incidencias:** creación, seguimiento, edición y resolución de incidencias.
- **Gestión de usuarios:** administración de cuentas y asignación de roles.
- **Sistema de permisos:** control de funcionalidades según el rol del usuario.
- **Perfil personal:** consulta y modificación de información personal y contraseña.
- **Configuración:** preferencias operativas, apariencia, registro de actividad e información del sistema.
- **Modo claro y oscuro:** interfaz adaptable con preferencia de tema guardada.
- **Diseño responsive:** interfaz adaptada a diferentes tamaños de pantalla.

## 🖥️ Capturas de pantalla

<!-- Añade aquí tus capturas de pantalla -->
<!-- Puedes guardarlas en una carpeta /screenshots -->

| Dashboard | Gestión de clientes |
|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Clientes](screenshots/clientes.png) |

| Modo oscuro | Modo claro |
|:---:|:---:|
| ![Modo oscuro](screenshots/modo-oscuro.png) | ![Modo claro](screenshots/modo-claro.png) |

## 🔐 Roles y permisos

FiberDesk incorpora un sistema de control de acceso basado en tres roles:

| Rol | Descripción |
|---|---|
| Administrador | Acceso completo a la aplicación y gestión de usuarios. |
| Supervisor | Supervisión y gestión de las operaciones. |
| Técnico | Acceso a las funcionalidades relacionadas con su trabajo. |

Los permisos determinan qué apartados y acciones están disponibles para cada usuario.

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Angular | Framework principal |
| TypeScript | Lenguaje de programación |
| Tailwind CSS | Diseño y estilos |
| HTML5 | Estructura de la aplicación |
| CSS3 | Estilos y personalización |
| LocalStorage | Almacenamiento local de preferencias y datos de desarrollo |
| Git y GitHub | Control de versiones |

## 📁 Estructura del proyecto

```text
src/
└── app/
    ├── core/
    │   ├── guards/
    │   ├── interceptors/
    │   └── services/
    │
    ├── shared/
    │   ├── components/
    │   └── models/
    │
    ├── features/
    │   ├── dashboard/
    │   ├── clients/
    │   ├── installations/
    │   ├── technicians/
    │   ├── incidents/
    │   ├── users/
    │   ├── profile/
    │   ├── configuration/
    │   └── login/
    │
    └── routes/
        └── app.routes.ts
```

La aplicación utiliza una arquitectura modular basada en componentes standalone de Angular, separando funcionalidades, servicios, modelos y componentes compartidos.

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js
- npm
- Angular CLI

### 1. Clonar el repositorio

```bash
git clone https://github.com/ortizmoldef/fiberdesk.git
```

### 2. Acceder al proyecto

```bash
cd fiberdesk
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm start
```

También puedes utilizar:

```bash
ng serve
```

### 5. Abrir la aplicación

Accede desde el navegador a:

```text
http://localhost:4200
```

## 🎨 Diseño e interfaz

FiberDesk apuesta por una interfaz moderna basada en:

- Diseño oscuro con tonalidades Slate.
- Acentos en color Cyan.
- Alternancia entre tema claro y oscuro.
- Tarjetas con bordes suaves y esquinas redondeadas.
- Tablas y formularios organizados.
- Navegación lateral para acceder rápidamente a los módulos.

## 🗺️ Próximas mejoras

El proyecto continúa en desarrollo. Entre los objetivos previstos se encuentran:

- [ ] Implementar backend y API REST.
- [ ] Integrar una base de datos.
- [ ] Implementar autenticación real y segura.
- [ ] Conectar los módulos con datos persistentes.
- [ ] Completar el registro de actividad.
- [ ] Aplicar las preferencias operativas a todas las tablas.
- [ ] Incorporar pruebas automatizadas.
- [ ] Mejorar la monitorización del sistema.

## 👨‍💻 Autor

**Fernando Ortiz Molde**

Desarrollador web interesado en la creación de aplicaciones, el desarrollo de software y las nuevas tecnologías.

- GitHub: [@ortizmoldef](https://github.com/ortizmoldef)
- LinkedIn: [Fernando Ortiz Molde](https://www.linkedin.com/in/fernando-ortiz-molde-25b9b7177/)
- Email: [ortizmoldef@gmail.com](mailto:ortizmoldef@gmail.com)

---

<p align="center">
  Desarrollado con dedicación por <strong>Fernando Ortiz Molde</strong>.
  <br>
  ◈ FiberDesk · Network Management
</p>

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
