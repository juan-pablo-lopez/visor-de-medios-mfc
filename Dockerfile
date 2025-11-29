# ---------- Etapa 1: Build del frontend ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend
RUN cd frontend && npm run build



# ---------- Etapa 2: Build del backend ----------
FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY backend ./backend



# ---------- Etapa 3: Imagen final super ligera ----------
FROM node:20-alpine

WORKDIR /app

# Copiar backend
COPY --from=backend-builder /app/backend ./backend

# Copiar frontend ya compilado
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copiar definición OpenAPI
COPY --from=backend-builder /app/backend/openapi.yaml ./openapi.yaml

# Copiar documentos inicialmente estáticos
COPY content ./content

EXPOSE 3080

CMD ["node", "backend/src/server.js"]
