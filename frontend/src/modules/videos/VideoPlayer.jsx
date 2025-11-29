import { useRef, useEffect, useState } from "react";

export default function VideoPlayer({ url, title, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      console.error("Video error:", video.error);
      setError(true);
    };

    video.addEventListener("error", handleError);
    return () => video.removeEventListener("error", handleError);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="
          relative z-10
          bg-white rounded-2xl shadow-2xl
          w-[95vw] max-w-6xl
          h-[80vh] 
          flex flex-col overflow-hidden
        "
      >
        <div
          className="
            flex items-center justify-between
            px-6 py-4 border-b
            bg-white/80 backdrop-blur-sm
          "
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#00594C]">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="
              inline-flex items-center justify-center
              w-9 h-9 rounded-full
              text-white bg-black/50 hover:bg-black/70
              transition
            "
          >
            ✕
          </button>
        </div>
        <div className="flex-1 bg-white flex items-center justify-center p-2">
          {error ? (
            <div className="text-red-400 text-center">
              <p>No se pudo reproducir este formato.</p>
              <p className="text-sm mt-2">
                Convierte a MP4 (H.264 + AAC) para compatibilidad total.
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full object-contain rounded-xl"
            >
              <source src={url} type="video/mp4" />
              <source src={url} type="video/webm" />
              <source src={url} type="video/ogg" />
              <source src={url} />
              Tu navegador no soporta video HTML5.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
