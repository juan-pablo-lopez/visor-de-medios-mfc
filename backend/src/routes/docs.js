import Fastify from "fastify";
import { listDocs, getDocument } from "../services/docs.js";

export default async function routes(fastify) {

  fastify.get("/", async () => listDocs());

  fastify.get("/:id", async (req, reply) => {
    const id = req.params.id;

    try {
      const { type, content } = await getDocument(id);

      if (type === "md") {
        reply.header("Content-Type", "text/markdown; charset=UTF-8");
        reply.send(content);
        return;
      }

      if (type === "pdf") {
        reply.header("Content-Type", "application/pdf");
        reply.send(content);
        return;
      }

    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Fastify.errorCodes.FST_ERR_NOT_FOUND(`Documento '${id}' no encontrado.`);
      }
      throw error;
    }
  });

}
