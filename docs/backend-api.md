# Backend API - Herramientas y conceptos

## Introducción

En el desarrollo de APIs REST es habitual utilizar herramientas que facilitan el consumo, testeo y monitorización de servicios backend.

---

## Axios

Axios es una librería de JavaScript para realizar peticiones HTTP.

Se utiliza para:
- Enviar peticiones GET, POST, PATCH y DELETE
- Manejar automáticamente datos en formato JSON
- Gestionar errores de forma más sencilla que con fetch

En este proyecto se utiliza `fetch`, pero Axios es una alternativa muy común en entornos profesionales.

---

## Postman

Postman es una herramienta para probar APIs de forma visual.

Permite:
- Enviar peticiones al backend
- Ver respuestas en formato JSON
- Probar distintos escenarios de error

Ejemplos utilizados en este proyecto:
- GET /api/v1/tasks → 200
- POST sin title → 400
- DELETE con id inexistente → 404

---

## Thunder Client

Thunder Client es una extensión de Visual Studio Code similar a Postman.

Ventajas:
- Integración directa en el editor
- Interfaz ligera y rápida
- Ideal para pruebas durante el desarrollo

Se ha utilizado en este proyecto para validar los endpoints de la API.

---

## Sentry

Sentry es una herramienta de monitorización de errores en tiempo real.

Se utiliza para:
- Detectar fallos en producción
- Analizar errores del backend
- Mejorar la estabilidad de la aplicación

---

## Swagger

Swagger es una herramienta para documentar APIs de forma interactiva.

Permite:
- Visualizar endpoints disponibles
- Probar peticiones desde el navegador
- Generar documentación automática

Es muy utilizada en proyectos profesionales para mantener la documentación actualizada.

---

## En este proyecto

- Fetch → consumo de la API desde el frontend  
- Postman / Thunder Client → testeo de endpoints  
- Axios → alternativa común a fetch  
- Swagger → documentación de APIs  
- Sentry → monitorización de errores  

---

## Conclusión

Estas herramientas son fundamentales en el desarrollo backend moderno, ya que permiten validar el funcionamiento de la API, documentarla correctamente y detectar errores de forma eficiente.