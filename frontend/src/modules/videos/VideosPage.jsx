import { useEffect, useState } from "react";
import { listVideos } from "../../api/videos";
import VideoPlayer from "./VideoPlayer";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    listVideos().then(setVideos);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Videos</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {videos.map(v => (
          <div key={v.id} className="group cursor-pointer" onClick={(e) => {
            console.log("Video seleccionado:", v);
            setSelectedVideo(v);
          }}>
            <img
              src={v.thumbnail || "/images/video-thumbnail.png"}
              className="rounded-lg shadow-lg group-hover:opacity-80 transition"
            />
            <h3 className="mt-2 text-sm font-semibold">
              {v.name}
            </h3>
          </div>
        ))}
      </div>
      {selectedVideo && (
        <VideoPlayer
          url={selectedVideo.url}
          title={selectedVideo.name}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
