import Fastify from "fastify";
import cors from "@fastify/cors";
import videosRoutes from "./routes/videos.js";
import docsRoutes from "./routes/docs.js";
import flashcardsRoutes from "./routes/flashcards.js";

const fastify = Fastify({ logger: true });

// Configuración de puerto y host
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

// CORS para desarrollo local
await fastify.register(cors, { origin: "*" });

// Registrar rutas
fastify.register(videosRoutes, { prefix: "/api/videos" });
fastify.register(docsRoutes, { prefix: "/api/docs" });
fastify.register(flashcardsRoutes, { prefix: "/api/flashcards" });

// Iniciar servidor
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
