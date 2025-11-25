import {
  listTopics,
  listCards,
  getCard,
  getSequentialOrder,
  getRandomOrder,
} from "../services/flashcards.js";

export default async function routes(fastify) {

  /* ---- LISTAR TOPICS ---- */
  fastify.get("/", async () => ({
    topics: await listTopics(),
  }));

  /* ---- LISTAR TARJETAS DE UN TOPIC ---- */
  fastify.get("/:topic", async (req, reply) => {
    const { topic } = req.params;
    return {
      topic,
      cards: await listCards(topic),
    };
  });

  /* ---- ACCESO DIRECTO A UNA TARJETA ---- */
  fastify.get("/:topic/card/:id", async (req) => {
    const { topic, id } = req.params;
    return await getCard(topic, id);
  });

  /* ====================================================== */
  /*                    SECUENCIAL                          */
  /* ====================================================== */

  fastify.get("/:topic/sequence/start", async (req, reply) => {
    const { topic } = req.params;

    const order = await getSequentialOrder(topic);

    if (order.length === 0) {
      return reply.code(404).send({ error: "No hay más tarjetas en este tema." });
    }

    return { topic, order };
  });

  fastify.get("/:topic/sequence/next/:index", async (req, reply) => {
    const { topic, index } = req.params;

    const order = await getSequentialOrder(topic);

    const idx = parseInt(index);
    if (idx >= order.length) {
      return reply.code(404).send({ error: "No hay más tarjetas en este tema." });
    }

    const cardId = order[idx];
    const data = await getCard(topic, cardId);

    return {
      topic,
      cardId,
      index: idx,
      card: data,
    };
  });

  /* ===================================================== */
  /*                    ALEATORIO                          */
  /* ===================================================== */

  fastify.get("/:topic/random/start", async (req, reply) => {
    const { topic } = req.params;

    const order = await getRandomOrder(topic);

    if (order.length === 0) {
      return reply.code(404).send({ error: "No hay más tarjetas en este tema." });
    }

    return { topic, order };
  });

  fastify.get("/:topic/random/next/:index", async (req, reply) => {
    const { topic, index } = req.params;

    const order = await getRandomOrder(topic);
    const idx = parseInt(index);

    if (idx >= order.length) {
      return reply.code(404).send({ error: "No hay más tarjetas." });
    }

    const cardId = order[idx];
    const data = await getCard(topic, cardId);

    return {
      topic,
      cardId,
      index: idx,
      card: data,
    };
  });
}
