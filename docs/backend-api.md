# Backend API - Herramientas y conceptos

## Axios

Axios es una librería de JavaScript para hacer peticiones HTTP.

Se usa para:
- GET, POST, PATCH, DELETE
- Manejar respuestas más fácil que fetch
- Controlar errores

Se usa porque simplifica el código.

---

## Postman

Postman sirve para probar APIs.

Se usa para:
- Enviar peticiones al backend
- Ver respuestas JSON
- Probar errores (400, 404, 500)

Ejemplo:
- GET /api/v1/tasks
- POST sin title → error 400
- DELETE id inexistente → error 404

---

## Sentry

Sentry sirve para detectar errores en producción.

Se usa para:
- Ver fallos en tiempo real
- Registrar errores del backend

---

## Swagger

Swagger sirve para documentar APIs.

Se usa para:
- Ver endpoints
- Probar la API desde navegador
- Entender cómo funciona la API

---

## En este proyecto

- Axios → alternativa a fetch
- Postman → probar backend
- Sentry → detectar errores
- Swagger → documentar API