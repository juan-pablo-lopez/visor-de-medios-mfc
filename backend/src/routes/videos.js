import { listVideos, getVideoStream } from "../services/videos.js";

export default async function routes(fastify) {

  fastify.get("/", async () => listVideos());

  fastify.get("/stream/:filename", async (req, reply) => {
    const { filename } = req.params;

    const stream = getVideoStream(filename);

    reply.headers({
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    });

    return reply.send(stream);
  });
}
