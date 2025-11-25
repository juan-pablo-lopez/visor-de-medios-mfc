import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("content/flashcards");

export async function listTopics() {
  return await fs.readdir(BASE_PATH);
}

export async function listCards(topic) {
  const topicPath = path.join(BASE_PATH, topic);
  const files = await fs.readdir(topicPath);

  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export async function getCard(topic, cardId) {
  const cardPath = path.join(BASE_PATH, topic, `${cardId}.json`);
  return await fs.readJson(cardPath);
}

/**
 * Devuelve las tarjetas de un topic en orden alfabético.
 */
export async function getSequentialOrder(topic) {
  const cards = await listCards(topic);
  return cards.sort();
}

/**
 * Devuelve las tarjetas de un topic en orden aleatorio, sin repetición.
 */
export async function getRandomOrder(topic) {
  const cards = await listCards(topic);
  const shuffled = cards.sort(() => Math.random() - 0.5);
  return shuffled;
}
