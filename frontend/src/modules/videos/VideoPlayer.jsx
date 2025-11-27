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

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50">
      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✕
      </button>

      <div className="w-full max-w-4xl">
        <h2 className="text-white text-xl mb-4">{title}</h2>

        {error ? (
          <div className="text-red-400 text-center">
            <p>No se pudo reproducir este formato.</p>
            <p className="text-sm mt-2">
              Intenta convertirlo a MP4 (H.264 + AAC) para compatibilidad total.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-full max-h-[80vh] rounded-lg shadow-lg"
          >
            {/* HTML5 solo reconoce el tipo MIME de MP4, pero igual intentamos */}
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />

            {/* Para MKV/AVI/MOV no existe MIME estándar, pero dejamos fallback */}
            <source src={url} />

            Tu navegador no soporta video HTML5.
          </video>
        )}
      </div>
    </div>
  );
}
