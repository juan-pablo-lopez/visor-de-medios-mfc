import { describe, it, expect, vi } from "vitest";
import { getSequentialOrder, getRandomOrder, getCard, listTopics, listCards } from "../../src/services/flashcards.js";

const TOPIC = "test";
const TOPICS = ["sample-topic", "test"];
const REAL_DIRECTORY_CONTENT = ['t01', 't02', 't03'];

vi.mock("fs/promises", async () => {
    const actual = await vi.importActual("fs/promises");
    return actual;
});

async function processContent() { 
  for (const elemento of REAL_DIRECTORY_CONTENT) {
    const card = await getCard(TOPIC, elemento);
    expect(card).toEqual(
      expect.objectContaining({
        front: expect.any(String), 
        back: expect.any(String), 
      })
    );
  }
}

describe("flashcards service", () => {
  it("should read flashcard directory and return list of topics", async () => {
    const topics = await listTopics();
    expect(topics).toEqual(TOPICS);
    processContent();
  });

  it("should read topic's directory and return list of flashcards", async () => {
    const cards = await listCards(TOPIC);
    expect(cards).toEqual(REAL_DIRECTORY_CONTENT);
    processContent();
  });

  it("should return empty array if folder empty or does not exist", async () => {
    const cards = await listCards("emptytopic");
    expect(cards).toEqual([]);
  });

  it("should read directory and return list of flashcards", async () => {
    const cards = await getSequentialOrder(TOPIC);
    expect(cards).toEqual(REAL_DIRECTORY_CONTENT);
    processContent();
  });

  it("should return empty array if folder empty or does not exist", async () => {
    const cards = await getSequentialOrder("emptytopic");
    expect(cards).toEqual([]);
  });

  it("should read directory and return list of flashcards in random order", async () => {
    const cards = await getRandomOrder(TOPIC);
    expect(cards).toEqual(expect.arrayContaining(REAL_DIRECTORY_CONTENT));
    processContent();
  });

  it("should return empty array if folder empty or does not exist", async () => {
    const cards = await getRandomOrder("emptytopic");
    expect(cards).toEqual([]);
  });
});
