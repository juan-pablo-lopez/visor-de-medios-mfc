# Visor de Medios MFC

## Descripción

Proyecto completo que incluye:

### 1. **Backend Fastify**

API para videos, documentos y tarjetas; gestión de contenido multimedia
y documentación OpenAPI.

### 2. **Frontend React**

Interfaz SPA que consume el backend y presenta todos los módulos.

------------------------------------------------------------------------

## Arquitectura

    /backend
      server.js
      routes/
      content/
      openapi.yaml

    /frontend
      src/
      public/
      vite.config.js

## Flujo de despliegue

1.  Frontend genera un build estático.
2.  Backend sirve API y contenido dinámico.
3.  Nginx o Docker multistage sirven el frontend.
4.  Backend se consume vía `/api/...`.

------------------------------------------------------------------------

## Comandos de uso

### Levantar backend

``` bash
cd backend
npm install
npm run dev
```

### Levantar frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

## Docker

Ambos servicios se ejecutan en un Dockerfile.

``` bash
docker pull jplopezs/visor-medios-mfc
```
