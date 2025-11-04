Frontend - Sistema de Reservas de Hotel
🚀 Descripción
Aplicación web para gestionar reservas de hotel desarrollada con React, TypeScript y Tailwind CSS.

🛠️ Tecnologías
React 19
TypeScript
Zustand (manejo de estado)
Tailwind CSS
Vite
Jest + Testing Library
📁 Estructura del Proyecto

frontend/app/├── src/│   ├── components/      # Componentes reutilizables│   ├── features/       # Características principales│   ├── pages/          # Páginas de la aplicación│   ├── store/          # Estado global con Zustand│   ├── types/          # Tipos de TypeScript│   └── utils/          # Utilidades y helpers
⚙️ Instalación
Instalar dependencias:

cd apps/frontend/appnpm install
Configurar variables de entorno:
Crear archivo .env:

VITE_API_URL=http://localhost:3000/api
Iniciar servidor de desarrollo:

npm run dev
📱 Características
Diseño responsive
Gestión de reservas
Panel de administración
Autenticación de usuarios
Visualización de habitaciones disponibles
Calendario de reservas
Historial de reservas por usuario
🧪 Testing
Ejecutar tests:


npm test
📦 Construir para Producción

npm run build
👤 Autor
Jeronimo Cortez - jeronimofcortez3@gmail.com