import { useEffect, useState } from "react";
import { marked } from "marked";

export default function MarkdownViewer({ url }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(url)
      .then(async r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.text();
      })
      .then(data => setHtml(marked(data ?? "")))
      .catch(err => setHtml(`<p>Error al cargar documento: ${err.message}</p>`));
  }, [url]);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
