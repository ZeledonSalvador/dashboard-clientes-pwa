# Quickpass Dashboard PWA

Quickpass Dashboard PWA es una aplicación web desarrollada con **ASP.NET Core MVC (.NET 8)** para la visualización de información operativa en tiempo real mediante dashboards.  
El proyecto fue adaptado para funcionar como **Progressive Web App (PWA)** con un enfoque **online-first**, priorizando siempre la consulta de datos actualizados desde el servidor.

## Descripción

El sistema permite monitorear indicadores operativos a través de dashboards interactivos y gráficos dinámicos.  
La implementación PWA no busca almacenar datos del negocio para uso offline, sino mejorar la experiencia de acceso, instalación y carga del shell visual de la aplicación.

Esto significa que:

- la aplicación puede instalarse como PWA en navegadores compatibles
- los recursos estáticos principales se gestionan mediante un **service worker**
- los datos del dashboard siempre se consultan desde la red
- si no hay conexión, la interfaz muestra un aviso de **“sin conexión”** en lugar de reutilizar datos anteriores

## Características principales

- Aplicación desarrollada con **ASP.NET Core MVC**
- Renderizado del lado del servidor con **Razor Views**
- Dashboards con gráficos dinámicos
- Integración PWA con:
  - `manifest.webmanifest`
  - `service-worker.js`
  - iconos de aplicación
  - banner de instalación
  - aviso visual de conectividad
- Estrategia **online-first**
- Caché únicamente de recursos estáticos
- Librerías frontend servidas localmente para mayor robustez

## Tecnologías utilizadas

### Backend
- ASP.NET Core MVC
- .NET 8

### Frontend
- Razor Views
- JavaScript
- jQuery
- Bootstrap
- Chart.js
- chartjs-plugin-zoom
- SweetAlert2
- Font Awesome

### PWA
- Web App Manifest
- Service Worker
- Iconos PWA
- Caché de shell estático

## Enfoque PWA adoptado

Este proyecto implementa una estrategia **online-first**, por lo que:

- **sí** se cachean archivos estáticos como CSS, JS, imágenes, fuentes e iconos
- **no** se cachean endpoints dinámicos del dashboard
- **no** se almacenan respuestas JSON del backend
- **no** se implementa modo offline para datos operativos

La razón de esta decisión es que el sistema funciona como un dashboard de monitoreo en tiempo real, por lo que mostrar datos desactualizados podría generar inconsistencias en la operación.

## Estructura general

```bash
Quickpass-DEV/
├── Controllers/
├── Helpers/
├── Models/
├── Views/
│   ├── Dashboard/
│   ├── Login/
│   └── Shared/
├── wwwroot/
│   ├── assets/
│   ├── css/
│   ├── icons/
│   ├── js/
│   ├── lib/
│   ├── manifest.webmanifest
│   └── service-worker.js
├── Program.cs
└── README.md
