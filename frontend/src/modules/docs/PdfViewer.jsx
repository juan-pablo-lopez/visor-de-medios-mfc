import { useEffect, useRef, useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import PrevIcon from "@/assets/prev.svg";
import NextIcon from "@/assets/next.svg";

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  const handlePdfLoad = (pdf) => {
    setNumPages(pdf.numPages);
    setPage(1);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="basis-[16%] min-w-[162] border-r p-2 h-full">
        <div className="overflow-y-auto h-full">
          <Document
            file={url}
            loading={<div className="text-gray-500 p-2">Cargando documento…</div>}
            error={<div className="text-red-600 p-2">Error al cargar PDF</div>}
            onLoadSuccess={handlePdfLoad}
          >
            {numPages &&
              Array.from({ length: numPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`
                    block w-full cursor-pointer overflow-hidden rounded border
                    mb-2
                    ${page === i + 1 ? "border-[#00594C]" : "border-gray-300"}
                    hover:border-[#FFB511] transition
                  `}
                  style={{ minWidth: 162, width: 162 }}
                  aria-label={`Ir a página ${i + 1}`}
                >
                  <Page
                    pageNumber={i + 1}
                    width={162}
                    renderMode="canvas"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </button>
              ))}
          </Document>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-4 flex flex-col items-center">
        <Document
          file={url}
          loading={<div className="text-gray-500">Cargando página…</div>}
          error={<div className="text-red-600">Error al renderizar página</div>}
        >
          <Page
            pageNumber={page}
            width="1500"
            renderMode="canvas"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
        {numPages && (
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              aria-label="Página anterior"
              className="
                w-10 h-10 flex items-center justify-center rounded-xl
                bg-black/30 hover:bg-black/50 transition
                disabled:opacity-40 disabled:hover:bg-black/30
              "
            >
              <img src={PrevIcon} alt="Anterior" className="w-6 h-6" />
            </button>
            <span className="text-sm text-gray-700">
              Página <span className="font-black text-[#00594C]">{page}</span> / {numPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= numPages}
              aria-label="Página siguiente"
              className="
                w-10 h-10 flex items-center justify-center rounded-xl
                bg-black/30 hover:bg-black/50 transition
                disabled:opacity-40 disabled:hover:bg-black/30
              "
            >
              <img src={NextIcon} alt="Siguiente" className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
