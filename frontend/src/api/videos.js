import request from "./client.js";
import { API_BASE } from "../config/api.js";

export async function listVideos() {
  const videos = await request("/videos", { method: "GET" });

  return videos.map(v => ({
    id: v.id,
    name: v.title ?? v.id,
    description: v.description ?? "",
    url: `${API_BASE}/videos/stream/${v.id}.${v.ext}`,
    thumbnail: `${API_BASE}/videos/thumbnails/${v.thumbnail}`,
    ext: v.ext
  }));
}
