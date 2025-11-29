import { useEffect, useState } from "react";
import { listDocs } from "../../api/docs";
import PdfViewer from "./PdfViewer";
import MarkdownViewer from "./MarkdownViewer";

export default function DocsPage() {
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);

  useEffect(() => {
    listDocs().then(setDocs);
  }, []);
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveDoc(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-extrabold text-[#5C462B] drop-shadow-sm mb-2">
        Documentos
      </h1>
      <p className="text-gray-600 mb-10">
        Selecciona un documento para visualizarlo.
      </p>
      <div className="grid max-w-5xl w-full gap-8 grid-cols-3">
        {docs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setActiveDoc(doc)}
            className="
              group cursor-pointer select-none
              rounded-2xl overflow-hidden
              shadow-lg hover:shadow-2xl
              transition-all duration-300 
              bg-white/60 backdrop-blur-sm
              border border-white/20
            "
          >
            <div className="relative w-full h-48 flex items-center justify-center bg-gradient-to-br from-white/70 to-white/40">
              {doc.ext === "pdf" ? (
                <img
                  src="/src/assets/pdf.svg"
                  alt="PDF icon"
                  className="
                    w-30 h-30
                    group-hover:scale-105 
                    transition-transform duration-300
                  "
                />
              ) : (
                <img
                  src="/src/assets/md.svg"
                  alt="Markdown icon"
                  className="
                    w-30 h-30
                    group-hover:scale-105 
                    transition-transform duration-300
                  "
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#00594C] line-clamp-2 text-center">
                {doc.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {activeDoc && (
        <div
          className="
            fixed inset-0 bg-black/50 backdrop-blur-sm
            flex items-center justify-center 
            z-50 p-6
          "
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="
              relative bg-white rounded-xl shadow-xl
              w-[90vw] max-w-6xl
              max-h-[95vh]
              overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="
                sticky top-0 z-10
                flex items-center justify-between
                px-4 py-3
                bg-white/95 backdrop-blur-sm
                border-b border-gray-200
              "
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[#00594C]">
                {activeDoc.name}
              </h2>
              <button
                onClick={() => setActiveDoc(null)}
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
            <div
              className={`
                p-2 sm:p-4
                ${activeDoc.ext === "pdf" ? "flex-1 overflow-hidden flex min-h-0 h-[calc(70vh-3.5rem)]" : "overflow-y-auto max-h-[calc(80vh-3.5rem)]"}
              `}
            >
              {activeDoc.ext === "pdf" ? (
                <PdfViewer url={activeDoc.url} />
              ) : (
                <div className="w-full h-full">
                  <MarkdownViewer url={activeDoc.url} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
