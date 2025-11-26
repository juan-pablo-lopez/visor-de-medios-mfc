import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import * as serverModule from "../../src/server.js";

const buildServer = serverModule.buildServer;
const TEST_DOCUMENT = "test";
const REAL_FILE_CONTENT = {id: "test", content: "# Documento de Pruebas\nEste es un documento usado para pruebas unitarias."};
const REAL_DIR_CONTENT = [{description: "Pruebas Unitarias", id: "test", tags: ["test"], title: "Pruebas Unitarias"}];

vi.mock("fs/promises", async () => {
  const actual = await vi.importActual("fs/promises");
  return actual;
});

describe("Docs API", () => {
  let app;

  beforeEach(async () => {
    app = buildServer();
    await app.ready();
  });

  afterEach(async () => {
    await app.close(); 
  });

  it("GET /api/docs should return list of documents", async () => {
    const res = await request(app.server).get("/api/docs");
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(REAL_DIR_CONTENT);
  });

  it("GET /api/docs/:id should return markdown content", async () => {
    const res = await request(app.server).get(`/api/docs/${TEST_DOCUMENT}`);
    expect(res.status).toBe(200);
    expect(JSON.parse(res.text)).toEqual(REAL_FILE_CONTENT);
  });

  it("GET /api/docs/:id should return 404 if missing", async () => {
    const res = await request(app.server).get("/api/docs/bad");
    expect(res.status).toBe(404);
  });
});
