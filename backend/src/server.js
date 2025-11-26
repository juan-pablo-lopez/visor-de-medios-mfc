import Fastify from "fastify";
import cors from "@fastify/cors";
import videosRoutes from "./routes/videos.js";
import docsRoutes from "./routes/docs.js";
import flashcardsRoutes from "./routes/flashcards.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

/**
 * Build server instance — used by tests and by the runtime.
 */
export function buildServer() {
  const fastify = Fastify({ logger: true });

  // CORS para desarrollo local
  fastify.register(cors, { origin: "*" });

  // Registrar rutas
  fastify.register(videosRoutes, { prefix: "/api/videos" });
  fastify.register(docsRoutes, { prefix: "/api/docs" });
  fastify.register(flashcardsRoutes, { prefix: "/api/flashcards" });
  fastify.register(swagger, {mode: "static", specification: {path: "./openapi.yaml", baseDir: process.cwd()}});
  fastify.register(swaggerUI, {routePrefix: "/docs"});

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
