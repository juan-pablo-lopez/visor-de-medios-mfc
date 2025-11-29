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
    <div className="w-full flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-extrabold text-[#5C462B] drop-shadow-sm mb-2">
        Videos
      </h1>
      <p className="text-gray-600 mb-10">
        Selecciona un video para reproducirlo.
      </p>
      <div className="grid max-w-6xl w-full gap-8 grid-cols-3">
        {videos.map(v => (
          <div
            key={v.id}
            onClick={() => setSelectedVideo(v)}
            className="
              group cursor-pointer select-none
              rounded-2xl overflow-hidden
              shadow-lg hover:shadow-2xl
              transition-all duration-300 
              bg-white/60 backdrop-blur-sm
              border border-white/20
            "
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-52 xl:h-56 overflow-hidden">
              <img
                src={v.thumbnail || '/images/video-thumbnail.png'}
                alt={v.name}
                className="
                  w-full h-full object-cover 
                  group-hover:scale-105 
                  transition-transform duration-500
                "
              />
              <div
                className="
                  absolute inset-0 bg-black/40 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300
                "
              ></div>
              <div
                className="
                  absolute inset-0 
                  flex items-center justify-center
                  opacity-0 group-hover:opacity-100 
                  transition-all duration-300
                "
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='#fff'
                  className='w-14 h-14 drop-shadow-lg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5.25 5.653v12.694c0 1.385 1.5 2.243 
                      2.694 1.553L18.07 13.73c1.094-.63 
                      1.094-2.205 0-2.835L7.944 4.1C6.75 
                      3.41 5.25 4.268 5.25 5.653z'
                  />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#00594C] line-clamp-2 text-center">
                {v.name}
              </h3>
            </div>
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
