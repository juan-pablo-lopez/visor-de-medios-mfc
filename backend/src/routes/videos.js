
import { listVideos } from "../services/videos.js";
import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("../content/videos");

export default async function routes(fastify) {

  // Lista de videos
  fastify.get("/", async () => listVideos());

  // Servir thumbnails
  fastify.get("/thumbnails/:id", async (req, reply) => {
    const filePath = path.join(BASE_PATH, `${req.params.id}`);
    console.log(">>> " + filePath);
    if (!fs.existsSync(filePath)) {
      return reply.code(404).send("Thumbnail no encontrada");
    }
    reply.type("image/jpeg");
    return fs.createReadStream(filePath);
  });

  // Streaming con soporte de rangos
  fastify.get("/stream/:filename", async (req, reply) => {
    const { filename } = req.params;
    const filePath = path.join(BASE_PATH, filename);

    let stat;
    try {
      stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `Video '${filename}' no encontrado.`,
        });
      }
    } catch (err) {
      const status = err.code === "ENOENT" ? 404 : 500;
      return reply.code(status).send({
        statusCode: status,
        error: status === 404 ? "Not Found" : "Internal Server Error",
        message:
          status === 404
            ? `Video '${filename}' no encontrado.`
            : `Error al acceder al video.`,
      });
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    reply.header("Accept-Ranges", "bytes");
    //reply.header("Content-Type", "video/mp4"); //TODO: descomentar si falla

    if (req.method === "HEAD") {
      reply.header("Content-Length", fileSize);
      return reply.code(200).send();
    }

    if (range) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (!match) {
        reply.header("Content-Range", `bytes */${fileSize}`);
        return reply.code(416).send();
      }

      let start = match[1] ? parseInt(match[1], 10) : 0;
      let end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      if (start < 0) start = 0;
      if (end >= fileSize) end = fileSize - 1;
      if (start > end || start >= fileSize) {
        reply.header("Content-Range", `bytes */${fileSize}`);
        return reply.code(416).send();
      }

      const chunkSize = end - start + 1;
      reply.header("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      reply.header("Content-Length", chunkSize);
      reply.code(206);

      const stream = fs.createReadStream(filePath, { start, end });
      stream.on("error", (err) => {
        req.log?.error({ err }, "Error en stream parcial");
        reply.raw.destroy(err);
      });

      return reply.send(stream);
    }

    reply.header("Content-Length", fileSize);
    reply.code(200);

    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
      req.log?.error({ err }, "Error en stream completo");
      reply.raw.destroy(err);
    });

    return reply.send(stream);
  });
}
