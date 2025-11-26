import { describe, it, expect, vi } from "vitest";
import { listVideos } from "../../src/services/videos.js";

const expected_object = [
  {
    description: "Video de Prueba",
    id: "test-01",
    tags: ["test","unit-test"],
    title: "Video de Prueba",
    file: "test.mp4"
  }
]

vi.mock("fs/promises", async () => {
    const actual = await vi.importActual("fs/promises");
    return actual;
});

describe("videos service", () => {
  it("should read directory and return list of videos", async () => {
    const videos = await listVideos();
    expect(videos).toEqual(expected_object);
  });
});
