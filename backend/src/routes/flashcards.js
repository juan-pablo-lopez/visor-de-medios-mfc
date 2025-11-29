import {
  listTopics,
  listCards,
  getCard,
  getSequentialOrder,
  getRandomOrder,
} from "../services/flashcards.js";

const topicOrderSequential = {};
const topicOrderRandom = {};

export default async function routes(fastify) {

  fastify.get("/", async () => ({
    topics: await listTopics(),
  }));

  fastify.get("/:topic", async (req, reply) => {
    const { topic } = req.params;
    return {
      topic,
      cards: await listCards(topic),
    };
  });

  fastify.get("/:topic/card/:id", async (req) => {
    const { topic, id } = req.params;
    return await getCard(topic, id);
  });

  fastify.get("/:topic/sequence/start", async (req, reply) => {
    const { topic } = req.params;

    const order = await getSequentialOrder(topic);

    if (order.length === 0) {
      return reply.code(404).send({ error: "No hay más tarjetas en este tema." });
    }

    topicOrderSequential[topic] = order;

    return { topic, order };
  });

  fastify.get("/:topic/sequence/next/:index", async (req, reply) => {
    const { topic, index } = req.params;
    const idx = parseInt(index);

    const order = topicOrderSequential[topic];
    if (!order) {
      return reply.code(400).send({ error: "Debes iniciar con /start primero." });
    }

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

  fastify.get("/:topic/random/start", async (req, reply) => {
    const { topic } = req.params;

    const order = await getRandomOrder(topic);

    if (order.length === 0) {
      return reply.code(404).send({ error: "No hay más tarjetas en este tema." });
    }

    topicOrderRandom[topic] = order;

    return { topic, order };
  });

  fastify.get("/:topic/random/next/:index", async (req, reply) => {
    const { topic, index } = req.params;
    const idx = parseInt(index);

    const order = topicOrderRandom[topic];
    if (!order) {
      return reply.code(400).send({ error: "Debes iniciar con /start primero." });
    }

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
}
