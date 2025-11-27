import request from "./client.js";

function formatTopicName(raw) {
  return raw
    .replace(/[-_.]+/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function listTopics() {
  const fcs = await request("/flashcards", { method: "GET" });

  return fcs.topics.map(topic => ({
    id: topic,
    display: formatTopicName(topic)
  }));
}

export async function listCards(topic) {
  if (!topic) throw new Error("listCards: topic required");
  return request(`/flashcards/${encodeURIComponent(topic)}`, { method: "GET" });
}

export async function getCard(topic, id) {
  if (!topic || !id) throw new Error("getCard: topic and id required");
  return request(`/flashcards/${encodeURIComponent(topic)}/card/${encodeURIComponent(id)}`, { method: "GET" });
}

export async function startRandomOrder(topic) {
  if (!topic) throw new Error("startRandomOrder: topic required");
  return request(`/flashcards/${encodeURIComponent(topic)}/random/start`, { method: "GET" });
}

export async function getRandomNext(topic, index) {
  if (!topic || index == null) throw new Error("getRandomNext: topic and index required");
  return request(`/flashcards/${encodeURIComponent(topic)}/random/next/${encodeURIComponent(index)}`, { method: "GET" });
}
