import request from "./client.js";
import { API_BASE } from "../config/api.js";
import { Thumbnail } from "react-pdf";

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

/**
 * Para casos donde quieres controlar el fetch y sacar el body (stream),
 * puedes usar request() directamente — devuelve el Response cuando no es JSON.
 *
 * Ej:
 * const res = await request(`/videos/stream/${filename}`);
 * // res es Response; en React puedes setear <video src={`/api/videos/stream/${filename}`} />
 */
