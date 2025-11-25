import fs from "fs-extra";
import path from "path";

const BASE_PATH = path.resolve("content/videos");

export async function listVideos() {
  const items = await fs.readdir(BASE_PATH);
  const videos = [];

  for (const file of items) {
    if (file.endsWith(".json")) {
      const meta = await fs.readJson(path.join(BASE_PATH, file));
      videos.push(meta);
    }
  }
  return videos;
}

export function getVideoStream(filename) {
  const filePath = path.join(BASE_PATH, filename);
  return fs.createReadStream(filePath);
}
