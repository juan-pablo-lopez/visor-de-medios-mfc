# Frontend -- React + Vite

## Descripción

Aplicación frontend construida con **React + Vite**, que consume el
backend y renderiza módulos para: - Inicio - Documentos - Tarjetas -
Videos

## Características

-   Enrutamiento SPA.
-   Resolución de assets vía alias `@/assets`.
-   Integración automática con el backend en producción.

## Scripts

``` bash
npm install
npm run dev
npm run build
npm run preview
```

## Alias `@`

Configurado en `vite.config.js`:

``` js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```
