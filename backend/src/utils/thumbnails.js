import { exec } from "child_process";

export function generateThumbnail(videoPath, thumbPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -ss 00:00:02 -i "${videoPath}" -frames:v 1 -q:v 2 "${thumbPath}" -y`;

    exec(cmd, (error) => {
      if (error) {
        console.error("Error generando thumbnail:", error);
        reject(error);
      } else {
        console.log("Thumbnail generado:", thumbPath);
        resolve(true);
      }
    });
  });
}
