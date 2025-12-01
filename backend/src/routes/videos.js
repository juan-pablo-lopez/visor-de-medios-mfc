import { listVideos } from "../services/videos.js";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_PATH = path.resolve(__dirname, "../../../content/videos");

export default async function routes(fastify) {

  fastify.get("/", async () => listVideos());

  fastify.get("/thumbnails/:id", async (req, reply) => {
    const filePath = path.join(BASE_PATH, req.params.id);
    if (!fs.existsSync(filePath)) {
      return reply.code(404).send("Thumbnail no encontrada");
    }
    reply.type("image/jpeg");
    return fs.createReadStream(filePath);
  });

  fastify.get("/stream/:filename", async (req, reply) => {
    const filePath = path.join(BASE_PATH, req.params.filename);

    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch (err) {
      return reply.code(404).send("Video no encontrado");
    }

    reply.header("Accept-Ranges", "bytes");

    const range = req.headers.range;
    const fileSize = stat.size;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

      reply.code(206);
      reply.header("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      reply.header("Content-Length", end - start + 1);

      return reply.send(fs.createReadStream(filePath, { start, end }));
    }

    reply.header("Content-Length", fileSize);
    return reply.send(fs.createReadStream(filePath));
  });
}
