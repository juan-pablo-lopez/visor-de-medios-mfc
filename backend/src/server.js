import Fastify from "fastify";
import cors from "@fastify/cors";
import videosRoutes from "./routes/videos.js";
import docsRoutes from "./routes/docs.js";
import flashcardsRoutes from "./routes/flashcards.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Build server instance — used by tests and by the runtime.
 */
export function buildServer() {
  const fastify = Fastify({ logger: true });

  // CORS
  fastify.register(cors, { origin: "*" });

  // Rutas API
  fastify.register(videosRoutes, { prefix: "/api/videos" });
  fastify.register(docsRoutes, { prefix: "/api/docs" });
  fastify.register(flashcardsRoutes, { prefix: "/api/flashcards" });

  // Swagger
  fastify.register(swagger, {
    mode: "static",
    specification: {
      path: "./openapi.yaml",
      baseDir: process.cwd()
    }
  });
  fastify.register(swaggerUI, { routePrefix: "/openapi" });

  // Frontend
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Ruta absoluta al dist del frontend al copiarlo en Docker
  const frontendDistPath = path.join(__dirname, "../../frontend/dist");

  fastify.register(fastifyStatic, {
    root: frontendDistPath,
    prefix: "/", // sirve archivos estáticos desde la raíz
  });

  // Catch-all para SPA — solo si NO es /api/*
  fastify.setNotFoundHandler((req, reply) => {
    const url = req.raw.url;

    if (req.raw.method === "GET" && !url.startsWith("/api")) {
      return reply.sendFile("index.html");
    }

    reply.code(404).send({ message: "Not Found" });
  });

  return fastify;
}

/**
 * Ejecutar el servidor solo cuando este archivo es la entrada principal.
 */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const PORT = process.env.PORT || 3080;
  const HOST = process.env.HOST || "0.0.0.0";

  const fastify = buildServer();

  const start = async () => {
    try {
      await fastify.listen({ port: PORT, host: HOST });
      console.log(`Server running on http://${HOST}:${PORT}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

  start();
}
