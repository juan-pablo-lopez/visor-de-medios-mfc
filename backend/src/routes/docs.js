import Fastify from "fastify";
import { listDocs, getDocument } from "../services/docs.js";

export default async function routes(fastify) {

  fastify.get("/", async () => listDocs());

  fastify.get("/:id", async (req) => {
    const id = req.params.id;
    try {
      const content = await getDocument(id);
      return {
        id: id,
        content: content,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Fastify.errorCodes.FST_ERR_NOT_FOUND(`Documento con id '${id}' no encontrado.`);
      }
      throw error;
    }
  });
}
