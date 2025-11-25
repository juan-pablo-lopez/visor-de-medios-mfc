import { listDocs, getDocument } from "../services/docs.js";

export default async function routes(fastify) {

  fastify.get("/", async () => listDocs());

  fastify.get("/:id", async (req) => {
    return {
      id: req.params.id,
      content: await getDocument(req.params.id),
    };
  });
}
