# SAT - Gestión de Repuestos

Sistema profesional de gestión, búsqueda y moderación de repuestos técnicos con sincronización en tiempo real.

🌐 **Demo en vivo**: [https://alexrequeni81.github.io/satpartsmanager/](https://alexrequeni81.github.io/satpartsmanager/)

## 🚀 Características Principales

- **🔍 Buscador "Mágico"**: Interfaz ultra-rápida optimizada para localizar referencias, máquinas o descripciones al instante.
- **⚡ Sincronización Realtime**: Panel de estado con conteo de usuarios online, registros totales y estado de conexión mediante **Supabase Presence**.
- **🛡️ Sistema de Moderación**: Los registros añadidos por usuarios externos entran en modo "Pendiente", requiriendo validación de administrador para ser públicos.
- **✨ Diseño Premium (UI/UX)**: Estética moderna basada en **Glassmorphism**, con efectos de desenfoque, gradientes y tipografía refinada.
- **🎨 Branding Personalizado**: Logo de alta calidad integrado con efectos de resplandor (glow) y animaciones de interacción.
- **📱 Responsive Design**: Experiencia optimizada para escritorio, tablets y smartphones.

## 🛠️ Tecnologías

- **Frontend**: React.js (Vite)
- **Backend/Base de Datos**: Supabase (PostgreSQL + Realtime)
- **Iconografía**: Lucide React
- **Estilos**: Vanilla CSS con variables CSS3 avanzadas

## 📦 Estructura del Proyecto

```text
web_sat/
├── dropbox-csv-manager/   # Aplicación principal (React + Vite)
├── README.md               # Documentación general
├── .gitignore              # Configuración de seguridad Git
├── check_csv.js            # Scripts de utilidad
└── sat_repuestos.csv       # Fuente de datos inicial
```

## 🚀 Despliegue y Desarrollo

### Local
1. Clona el repositorio.
2. Navega a `dropbox-csv-manager` y ejecuta `npm install`.
3. Inicia con `npm run dev`.

### Producción (GitHub Pages)
El proyecto está configurado para desplegarse automáticamente:
```bash
npm run deploy
```

## � Seguridad y Moderación
El acceso de administrador está protegido por una clave de sesión. Solo los administradores pueden:
1. Validar registros pendientes.
2. Editar información existente.
3. Eliminar entradas obsoletas.

---
© 2026 - Herramienta desarrollada para la optimización del servicio técnico SAT.
