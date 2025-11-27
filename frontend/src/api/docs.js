import request from "./client.js";
import { API_BASE } from "../config/api.js";

export async function listDocs() {
  const docs = await request("/docs");

  return docs.map(d => ({
    id: d.id,
    name: d.title ?? d.id,
    description: d.description ?? "",
    url: `${API_BASE}/docs/${d.id}`,
    ext: d.ext
  }));
}

export async function getDocById(id) {
  if (!id) throw new Error("getDocById: id required");
  return request(`/docs/${encodeURIComponent(id)}`, { method: "GET" });
}
