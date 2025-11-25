import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("content/docs");

export async function listDocs() {
  const items = await fs.readdir(BASE_PATH);
  const docs = [];

  for (const file of items) {
    if (file.endsWith(".json")) {
      const meta = await fs.readJson(path.join(BASE_PATH, file));
      docs.push(meta);
    }
  }
  return docs;
}

export async function getDocument(id) {
  const markdownPath = path.join(BASE_PATH, `${id}.md`);
  return await fs.readFile(markdownPath, "utf-8");
}
