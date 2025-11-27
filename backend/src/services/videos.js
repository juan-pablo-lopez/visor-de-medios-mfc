import fs from "fs-extra";
import path from "path";
import { generateThumbnail } from "../utils/thumbnails.js";

const BASE_PATH = path.resolve("../content/videos");

export async function listVideos() {
  const items = await fs.readdir(BASE_PATH);
  const videos = [];

  for (const file of items) {
    if (file.endsWith(".json")) {
      const meta = await fs.readJson(path.join(BASE_PATH, file));
      meta.thumbnail = `${meta.id}.jpg`;

      const videoPath = path.join(BASE_PATH, `${meta.id}.${meta.ext}`);
      const thumbPath = path.join(BASE_PATH, `${meta.id}.jpg`);
      const defaultThumb = path.join(BASE_PATH, `default.jpg`);

      if (!fs.existsSync(thumbPath)) {
        console.log(`Generando thumbnail faltante para ${file}`);
        try {
          await generateThumbnail(videoPath, thumbPath);
        } catch (err) {
          console.error(`Error generando thumbnail para ${file}:`, err);
          try {
            await fs.copy(defaultThumb, thumbPath);
            console.log(`Se usó thumbnail por defecto para ${file}`);
          } catch (copyErr) {
            console.error(`Error copiando thumbnail por defecto:`, copyErr);
          }
        }
      }
      
      videos.push(meta);
    }
  }
  return videos;
}
