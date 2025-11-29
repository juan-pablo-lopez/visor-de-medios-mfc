import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function MarkdownViewer({ url }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then(async r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.text();
      })
      .then(md => {
        const rawHtml = marked.parse(md ?? "", { breaks: true, gfm: true });
        const safeHtml = DOMPurify.sanitize(rawHtml);
        if (!cancelled) setHtml(safeHtml);
      })
      .catch(err => {
        if (!cancelled) {
          setHtml(`<p>Error al cargar documento: ${err.message}</p>`);
        }
      });

    return () => { cancelled = true; };
  }, [url]);

  return (
    <div className="w-full h-full overflow-y-auto">
    <div
      className="
        prose prose-sm max-w-none 
        prose-pre:overflow-x-auto 
        prose-pre:overflow-y-auto
        break-words
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
    </div>
  );
}
