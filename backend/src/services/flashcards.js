import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("../content/flashcards");

export async function listTopics() {
  try {
    const items = await fs.readdir(BASE_PATH, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Advertencia: La ruta de tarjetas '${BASE_PATH}' no existe.`);
      return []; 
    }
    throw error;
  }
}


export async function listCards(topic) {
  const topicPath = path.join(BASE_PATH, topic);
  try {
    const files = await fs.readdir(topicPath);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Advertencia: La ruta del tema '${topicPath}' no existe.`);
      return []; 
    }
    throw error;
  }
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
