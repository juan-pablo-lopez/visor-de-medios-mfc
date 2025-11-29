import { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

function MarkdownHTML({ source, className }) {
  const rawHtml = marked.parse(source ?? "");
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div
      className={`p-2 text-center prose prose-sm sm:prose-base lg:prose-lg ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export default function FlashcardCarousel({ order = [], next, prev, card }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(null); // "next" | "prev" para animación

  const hasOrder = order && order.length > 0;

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [order]);

  async function goNext() {
    setFlipped(false);
    setDirection("next");
    if (!hasOrder) return;
    if (next) {
      const newIndex = await next(index);
      setIndex(newIndex);
    } else {
      setIndex((prev) => (prev + 1) % order.length);
    }
  }

  async function goPrev() {
    setFlipped(false);
    setDirection("prev");
    if (!hasOrder) return;
    if (prev) {
      const newIndex = await prev(index);
      setIndex(newIndex);
    } else {
      setIndex((prev) => (prev - 1 + order.length) % order.length);
    }
  }

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      {hasOrder && (
        <div
          onClick={goPrev}
          className="
            absolute left-1/2 top-1/2 -translate-x-[80%] -translate-y-1/2
            w-80 h-60 sm:w-96 sm:h-72
            scale-[0.8] opacity-60
            rounded-xl shadow-md
            bg-[#E6EEED]
            z-0 cursor-pointer
            transition-transform duration-300
            hover:opacity-80 hover:scale-[0.82]
          "
          style={{ transformStyle: "preserve-3d" }}
          title="Anterior"
        >
          <div className="absolute left-7 top-1/2 -translate-y-1/2">
            <img src="/src/assets/prev.svg" className="w-10 h-10" alt="Anterior" title="Anterior" />
          </div>
        </div>
      )}
      <div
        className="
          relative w-80 h-60 sm:w-96 sm:h-72
          cursor-pointer overflow-hidden z-10
        "
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`
            absolute inset-0 transition-transform duration-500 transform
            ${flipped ? "rotate-y-180" : ""}
            ${direction === "next" ? "animate-slide-next" : ""}
            ${direction === "prev" ? "animate-slide-prev" : ""}
          `}
          style={{ transformStyle: "preserve-3d" }}
          onAnimationEnd={() => setDirection(null)}
        >
          <div
            className="
              absolute inset-0 rounded-xl shadow-lg p-4
              flex items-center justify-center overflow-auto
              bg-[#D9E6E4]
            "
            style={{ backfaceVisibility: "hidden" }}
          >
            {card ? <MarkdownHTML source={card.card.front} /> : "Sin tarjetas"}
          </div>
          <div
            className="
              absolute inset-0 rounded-xl shadow-lg p-4
              flex items-center justify-center overflow-auto
              bg-[#00594C] text-white rotate-y-180
            "
            style={{ backfaceVisibility: "hidden" }}
          >
            {card ? (
              <MarkdownHTML source={card.card.back} className="text-white" />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {hasOrder && (
        <div
          onClick={goNext}
          className="
            absolute left-1/2 top-1/2 -translate-x-[20%] -translate-y-1/2
            w-80 h-60 sm:w-96 sm:h-72
            scale-[0.8] opacity-60
            rounded-xl shadow-md
            bg-[#E6EEED]
            z-0 cursor-pointer
            transition-transform duration-300
            hover:opacity-80 hover:scale-[0.82]
          "
          style={{ transformStyle: "preserve-3d" }}
          title="Siguiente"
        >
          <div className="absolute right-7 top-1/2 -translate-y-1/2">
            <img src="/src/assets/next.svg" className="w-10 h-10" alt="Siguiente" title="Siguiente" />
          </div>
        </div>
      )}
    </div>
  );
}
