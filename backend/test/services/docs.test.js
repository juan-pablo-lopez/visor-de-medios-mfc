import { describe, it, expect, vi } from "vitest";
import { getDocument, listDocs } from "../../src/services/docs.js";

const TEST_DOCUMENT = "test";
const REAL_FILE_CONTENT = "# Documento de Pruebas\nEste es un documento usado para pruebas unitarias.";
const REAL_DIR_CONTENT = [{description: "Pruebas Unitarias", id: "test", tags: ["test"], title: "Pruebas Unitarias"}];

vi.mock("fs/promises", async () => {
    const actual = await vi.importActual("fs/promises");
    return actual;
});

describe("docs service", () => {
  
  it("should read metafile from files in directory", async() => {
    const dir = await listDocs();
    expect(dir).toEqual(REAL_DIR_CONTENT);
  });

  it("should load a REAL markdown file and return its contents", async () => {
    const doc = await getDocument(TEST_DOCUMENT);
    expect(doc).toBe(REAL_FILE_CONTENT);
  });

  it("should throw if file not found (mocked)", async () => {
    await expect(getDocument("bad")).rejects.toThrow();
  });
});
