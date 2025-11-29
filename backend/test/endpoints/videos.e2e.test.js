import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { Readable } from 'stream';
import * as serverModule from "../../src/server.js";

const buildServer = serverModule.buildServer;
const TEST_VIDEO = "test.mp4";
const REAL_DIR_CONTENT = [{description: "Video de Prueba", id: "test-01", tags: ["test", "unit-test"], title: "Video de Prueba", file: "test.mp4"}];

vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal();
  
  return {
    ...actual,
    createReadStream: vi.fn((filePath) => {
      if (filePath.includes('unknown')) {
        const errorStream = new Readable();
        errorStream._read = () => {};
        process.nextTick(() => {
          const error = new Error(`ENOENT: no such file or directory, open '${filePath}'`);
          error.code = 'ENOENT';
          errorStream.emit('error', error);
        });
        return errorStream;
      } 
      
      if (filePath.includes(TEST_VIDEO)) {
        const contentStream = new Readable();
        contentStream._read = () => {};
        process.nextTick(() => {
          contentStream.push('Stream content data');
          contentStream.push(null);
        });
        return contentStream;
      }
      
      return actual.createReadStream(filePath);
    }),
  };
});

describe("Videos API", () => {
  let app;

  beforeEach(async () => {
    app = buildServer();
    await app.ready();
  });

  afterEach(async () => {
    await app.close(); 
  });

  it("GET /api/videos should return list of videos", async () => {
    const res = await request(app.server).get("/api/videos");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(REAL_DIR_CONTENT);
  });

  it("GET /api/videos/stream/:filename should return a 200 response", async () => {
    const res = await request(app.server).get(`/api/videos/stream/${TEST_VIDEO}`);
    expect(res.status).toBe(200);
  });

  it("GET /api/videos/stream/:filename should return a 404 response", async () => {
    const res = await request(app.server).get(`/api/videos/stream/unknown`);
    expect(res.status).toBe(404);
  });
});
