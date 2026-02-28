# SAT Parts Manager

Sistema de gestión y búsqueda de repuestos técnicos con sincronización en tiempo real y panel de administración.

## 🚀 Características Principales

- **Buscador "Mágico"**: Interfaz optimizada para búsquedas rápidas de referencias y descripciones.
- **Sincronización en Tiempo Real**: Visualización de usuarios conectados y estado de la base de datos mediante Supabase Presence.
- **Moderación de Administrador**: Sistema de validación de registros nuevos o editados antes de su publicación definitiva.
- **Diseño Glassmorphism**: Estética moderna y premium con soporte para modo oscuro natural.
- **Optimización Móvil**: Interfaz adaptativa que se ajusta a smartphones y tablets.

## 🛠️ Tecnologías

- **Frontend**: React.js, Vite, Lucide Icons.
- **Backend/DB**: Supabase (PostgreSQL + Realtime).
- **Estilos**: Vanilla CSS con variables avanzadas.

## 📦 Estructura del Proyecto

```text
web_sat/
├── dropbox-csv-manager/   # Aplicación web (React)
├── check_csv.js           # Scripts de utilidad y validación
├── final_sync.js          # Script de sincronización masiva CSV -> Supabase
└── sat_repuestos.csv      # Archivo de datos base (ejemplo)
```

## ⚙️ Configuración

1. Entra en `dropbox-csv-manager` y ejecuta `npm install`.
2. Inicia el servidor de desarrollo con `npm run dev`.
3. Configura tus credenciales de Supabase en la interfaz web (se guardan de forma local y segura).

## 🛡️ Moderación
Los registros añadidos por usuarios externos aparecen como **Pendientes** y requieren la aprobación de un administrador (icono de llave) para ser visibles para todos.

---
Desarrollado para la gestión eficiente de repuestos técnicos.
