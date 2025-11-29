import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("/app/content/docs");

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
  const mdPath = path.join(BASE_PATH, `${id}.md`);
  const pdfPath = path.join(BASE_PATH, `${id}.pdf`);

  if (await fs.pathExists(mdPath)) {
    const content = await fs.readFile(mdPath, "utf-8");
    return { type: "md", content };
  }

  if (await fs.pathExists(pdfPath)) {
    const pdfBuffer = await fs.readFile(pdfPath);
    return { type: "pdf", content: pdfBuffer };
  }

  const err = new Error("Documento no encontrado");
  err.code = "ENOENT";
  throw err;
}
