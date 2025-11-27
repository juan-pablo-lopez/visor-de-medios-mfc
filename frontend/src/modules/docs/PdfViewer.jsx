import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import { useState } from "react";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  return (
    <div className="flex h-full">
      
      {/* Sidebar con thumbnails */}
      <div className="w-32 overflow-y-auto border-r p-2 flex flex-col gap-2">
        {numPages && (
          <Document file={url}>
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                className={`cursor-pointer border rounded ${
                  page === i + 1 ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setPage(i + 1)}
              >
                <Page
                  pageNumber={i + 1}
                  width={100}
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Vista principal */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Document
          file={url}
          onLoadSuccess={(p) => {
            setNumPages(p.numPages);
            setPage(1);
          }}
        >
          <Page pageNumber={page} />
        </Document>

        {/* Paginador */}
        {numPages && (
          <div className="flex items-center gap-4 mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(p => p - 1)}
              disabled={page <= 1}
            >
              Anterior
            </button>

            <span>
              Página {page} / {numPages}
            </span>

            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= numPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
