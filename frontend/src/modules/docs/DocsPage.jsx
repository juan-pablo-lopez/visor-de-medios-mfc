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

  return (
    <div className="p-6 flex">
      <div className="w-1/3">
        <h1 className="text-3xl mb-4">Documentos</h1>
        <ul>
          {docs.map(doc => (
            <li
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className="cursor-pointer mb-2 hover:underline"
            >
              {doc.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 ml-6">
        {activeDoc ? (
          activeDoc.ext === "pdf" ? (
            <PdfViewer url={activeDoc.url} />
          ) : (
            <MarkdownViewer url={activeDoc.url} />
          )
        ) : (
          <p>Selecciona un documento</p>
        )}
      </div>
    </div>
  );
}
