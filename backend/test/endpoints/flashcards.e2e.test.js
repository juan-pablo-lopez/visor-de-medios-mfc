import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import * as serverModule from "../../src/server.js";

const buildServer = serverModule.buildServer;
const TOPICS = {topics: ["sample-topic", "test"]};
const TOPIC_DIRECTORY = "test";
const CARDS = {cards: ["t01", "t02", "t03"], topic: "test"};
const CARDS_SORTED = {order: ["t01", "t02", "t03"], topic: "test"};
const CARD_CONTENT = [
  { id: "t01", front: "**2 + 2?**", back: "4" },
  { id: "t02", front: "¿Año de la independencia de México?", back: "1810" },
  { id: "t03", front: "_¿Capital de Francia?_", back: "París" }
];
const EMPTY = {cards: [], topic: "unknown"};


vi.mock("fs/promises", async () => {
  const actual = await vi.importActual("fs/promises");
  return actual;
});

describe("Flashcards API", () => {
  let app;

  beforeEach(async () => {
    app = buildServer();
    await app.ready();
  });

  afterEach(async () => {
    await app.close(); 
  });

  it("GET /api/flashcards should return list of flashcard topics", async () => {
    const res = await request(app.server).get("/api/flashcards");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(TOPICS);
  });

  it("GET (default) /api/flashcards/:topic/card/:id should return card content", async () => {
    const res = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}`);
    expect(res.status).toBe(200);
    const cardsResponse = JSON.parse(res.text);
    expect(cardsResponse).toEqual(CARDS);

    await Promise.all(cardsResponse.cards.map(async card => {
      const currentCard = CARD_CONTENT.find(c => c.id === card);
      const response = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/card/${card}`);
      expect(response.status).toBe(200);
      const responseJson = JSON.parse(response.text);
      expect(responseJson.front).toEqual(currentCard.front);
      expect(responseJson.back).toEqual(currentCard.back);
    }));
  });

  it("GET /api/flashcards/:topic/sequence/start should return list of cards sorted by name", async () => {
    const res = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/sequence/start`);
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(CARDS_SORTED);
  });

  it("GET (sorted) /api/flashcards/:topic/sequence/next/:index should return card content", async () => {
    const res = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/sequence/start`);
    expect(res.status).toBe(200);
    const cardsResponse = JSON.parse(res.text);
    expect(cardsResponse).toEqual(CARDS_SORTED);
    let index = 0;

    await Promise.all(cardsResponse.order.map(async card => {
      const currentCard = CARD_CONTENT.find(c => c.id === card);
      const response = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/sequence/next/${index++}`);
      expect(response.status).toBe(200);
      const responseJson = JSON.parse(response.text);
      expect(responseJson.card.front).toEqual(currentCard.front);
      expect(responseJson.card.back).toEqual(currentCard.back);
    }));
  });

  it("GET /api/flashcards/:topic/random/start should return list of cards sorted randomly", async () => {
    const res = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/random/start`);
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(
      expect.objectContaining({
        topic: "test",
        order: expect.arrayContaining(["t01", "t02", "t03"])
      })
    );
  });

  it("GET (random) /api/flashcards/:topic/random/next/:index should return card content", async () => {
    const res = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/random/start`);
    expect(res.status).toBe(200);
    const cardsResponse = JSON.parse(res.text);
    expect(cardsResponse).toEqual(
      expect.objectContaining({
        topic: "test",
        order: expect.arrayContaining(["t01", "t02", "t03"])
      })
    );
    let index = 0;

    await Promise.all(cardsResponse.order.map(async card => {
      const currentCard = CARD_CONTENT.find(c => c.id === card);
      const response = await request(app.server).get(`/api/flashcards/${TOPIC_DIRECTORY}/random/next/${index++}`);
      expect(response.status).toBe(200);
      const responseJson = JSON.parse(response.text);
      expect(responseJson.card.front).toEqual(currentCard.front);
      expect(responseJson.card.back).toEqual(currentCard.back);
    }));
  });

  it("GET /api/flashcards/:topic should return empty list", async () => {
    const res = await request(app.server).get("/api/flashcards/unknown");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(EMPTY);
  });
});
