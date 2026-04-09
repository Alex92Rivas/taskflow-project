# Backend - TaskFlow API

## Descripción

Backend desarrollado con Node.js y Express que proporciona una API RESTful para la gestión de tareas (películas).

Forma parte de la Fase 3 del proyecto TaskFlow, donde el frontend deja de usar localStorage y consume datos desde el servidor.

---

## Tecnologías

- Node.js
- Express
- CORS
- dotenv

---

## Arquitectura

Estructura basada en separación de responsabilidades:

```text
src/
├── config/
├── controllers/
├── routes/
├── services/
└── index.js
Routes: definen endpoints
Controllers: gestionan peticiones y validaciones
Services: contienen la lógica de negocio


- API REST

Base URL:

/api/v1/tasks


Endpoints

GET /tasks → obtener tareas
POST /tasks → crear tarea
PATCH /tasks/:id → actualizar tarea
DELETE /tasks/:id → eliminar tarea

- Middleware

express.json() → parseo de JSON
cors() → acceso desde frontend
loggerAcademico → registro de peticiones
Manejo de errores

- Middleware global:

400 → datos inválidos
404 → recurso no encontrado
500 → error interno

- Persistencia

Los datos se almacenan en memoria:

let tasks = [];

No existe base de datos en esta fase.

- Variables de entorno

PORT=3000

- Ejecución en local

npm install
npm run dev

- Servidor en:

http://localhost:3000

- Despliegue

Backend desplegado en Vercel:

https://taskflow-project-backend-alpha.vercel.app