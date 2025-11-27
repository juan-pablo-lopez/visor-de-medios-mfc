import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

function MarkdownHTML({ source, flipped }) {
  const rawHtml = marked.parse(source ?? "");
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return <div className={`p-4 text-center ${flipped ? "rotate-y-180" : ""}`} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}


export default function FlashcardCarousel({ order = [], next, prev, card }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [order]);

  const hasOrder = order && order.length > 0;

  async function goNext() {
    setFlipped(false);
    if (!hasOrder) return;
    if (next) {
      const newIndex = await next(index);
      setIndex(newIndex);
    } else {
      setIndex(prev => (prev + 1) % order.length);
    }
  }

  async function goPrev() {
    setFlipped(false);
    if (!hasOrder) return;
    if (prev) {
      const newIndex = await prev(index);
      setIndex(newIndex);
    } else {
      setIndex(prev => (prev - 1 + order.length) % order.length);
    }    
  }

  return (
    <div className="flex flex-col items-center">

      {/* TARJETA ESTILO GRID */}
      <div
        className="relative w-96 h-60 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Contenedor giratorio */}
        <div
          className={`absolute inset-0 transition-transform duration-500 transform ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 bg-gray-200 shadow-lg p-6 rounded-xl backface-hidden flex items-center justify-center overflow-auto"
            style={{ backfaceVisibility: "hidden" }}
          >
            {card ? <MarkdownHTML source={card.card.front} /> : "Sin tarjetas"}
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 bg-black text-white shadow-lg p-6 rounded-xl flex items-center justify-center overflow-auto rotate-y-180"
            style={{ backfaceVisibility: "hidden" }}
          >
            {card ? <MarkdownHTML source={card.card.back} /> : ""}
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-3 mt-5">
        <button onClick={goPrev} className="px-4 py-2 rounded bg-gray-300">Anterior</button>
        <button onClick={goNext} className="px-4 py-2 rounded bg-gray-300">Siguiente</button>
      </div>
    </div>
  );
}
