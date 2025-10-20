# Sistema de Reservas de Hotel

Sistema full-stack para gestión de reservas construido con Node.js, TypeScript, Express, MongoDB y Docker. Arquitectura limpia: capa de dominio con entidades y casos de uso, backend con controladores y repositorios, y pruebas unitarias sobre la lógica de negocio.

## Características principales

- Registro y autenticación con JWT
- Roles: USER y ADMIN (control de acceso por rol)
- CRUD completo para Habitaciones, Usuarios y Reservas
- Gestión de reservas: crear, confirmar y cancelar
- Backend con MongoDB (soporte Docker/Docker Compose)
- Lógica de dominio testeada con Jest
- Preparado para integraciones (frontend, Postman, Swagger)

## Tecnologías

- Node.js, TypeScript, Express
- MongoDB
- Docker y Docker Compose
- Jest para tests

## Estructura del proyecto (resumen)

- apps/
  - backend/ (servidor Express)
    - src/
      - controllers/
      - middlewares/
      - repositories/
      - routes/
      - server.ts
- domain/ (lógica de negocio)
  - src/
    - entities/
    - types/
    - use-cases/
    - tests/

## Requisitos

- Node.js >= 18
- npm >= 9
- Docker y Docker Compose (opcional)
- MongoDB (local o en Docker)

## Instalación rápida

Clonar repo y moverse al proyecto:

```bash
git clone <repo-url>
cd Proyecto-final
```

Instalar dependencias del backend:

```bash
cd apps/backend
npm install
```

Crear archivo .env en apps/backend:

```env
MONGO_URI=mongodb://127.0.0.1:27017/hotel
JWT_SECRET=TuClaveSecreta
PORT=4000
```

Levantar MongoDB con Docker (opcional):

```bash
docker run -d -p 27017:27017 --name hotel-mongo -v hotel-mongo-data:/data/db mongo:latest
```

Iniciar servidor en modo desarrollo:

```bash
npm run dev
```

## Docker Compose (ejemplo)

docker-compose.yml de ejemplo:

```yaml
version: "3.9"
services:
  mongo:
    image: mongo:latest
    container_name: hotel-mongo
    ports:
      - "27017:27017"
    volumes:
      - hotel-mongo-data:/data/db

volumes:
  hotel-mongo-data:
```

Levantar servicios:

```bash
docker-compose up -d
```

## Tests (capa de dominio)

Ejecutar pruebas unitarias:

```bash
cd domain
npm test
```

## Endpoints principales

Autenticación: usar header Authorization: Bearer <token>

Usuarios

- POST /users/register — Registrar usuario
- POST /users/login — Login y obtención de JWT

Habitaciones

- GET /rooms — Listar
- GET /rooms/:id — Obtener por ID
- POST /rooms — Crear (ADMIN)
- PUT /rooms/:id — Actualizar (ADMIN)
- DELETE /rooms/:id — Eliminar (ADMIN)

Reservas

- POST /reservations — Crear reserva
- GET /reservations — Listar todas (ADMIN)
- GET /reservations/:id — Obtener por ID
- PUT /reservations/:id/confirm — Confirmar (ADMIN o dueño)
- PUT /reservations/:id/cancel — Cancelar (ADMIN o dueño)

## Notas

- Toda la lógica de negocio reside en domain/; los controladores solo exponen HTTP.
- Roles definidos en domain/src/types/Roles.ts (USER, ADMIN).
- JWT asegura acceso a rutas protegidas.
- Como desafio personal decidi desarrollar el proyecto en ingles, pero dejar el readme en español.

## Autor

Jeronimo Cortez — jeronimofcortez3@gmail.com
