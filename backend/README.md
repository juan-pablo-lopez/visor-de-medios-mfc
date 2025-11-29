# Backend -- API Service

## Descripción

Servicio backend construido con **Fastify**, encargado de servir la API,
manejar assets dinámicos, y exponer el esquema **OpenAPI**. Gestiona
videos, documentos y tarjetas.

## Características principales

-   API basada en Fastify.
-   Rutas para videos (streaming, miniaturas).
-   Rutas para documentos y tarjetas.
-   Servido en el puerto configurado mediante variables de entorno.
-   Swagger UI disponible en `/openapi`.

## Estructura básica

-   `/routes` -- controladores de API.
-   `/content` -- archivos estáticos (videos, imágenes, documentos).
-   `server.js` -- punto de entrada.
-   `openapi.yaml` -- definición OpenAPI.

## Comandos

``` bash
npm install
npm run dev
npm run build
```

## Variables de entorno

-   `PORT` -- Puerto donde arranca el backend.
-   `BASE_PATH` -- Ruta donde se almacenan los contenidos del backend.
