import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { getCard } from "../../api/flashcards";

function MarkdownHTML({ source, className }) {
  const rawHtml = marked.parse(source ?? "");
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div
      className={`p-2 text-center prose prose-sm sm:prose-base lg:prose-lg ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export default function FlashcardGrid({ order = [], topic }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAllCards() {
      if (!order.length || !topic) {
        setCards([]);
        setFlipped([]);
        return;
      }

      try {
        const result = [];

        for (const idx of order) {
          const c = await getCard(topic, idx);
          if (cancelled) return;
          result.push(c);
        }

        if (!cancelled) {
          setCards(result);
          setFlipped(new Array(result.length).fill(false));
        }
      } catch (err) {
        console.error("Error loading grid cards:", err);
      }
    }

    loadAllCards();
    return () => { cancelled = true; };
  }, [order, topic]);

  function toggleFlip(i) {
    setFlipped(prev => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  }

  if (!cards.length) {
    return <p className="text-gray-500 text-center">Cargando tarjetas…</p>;
  }

  return (
    <div className="
      grid 
      grid-cols-1 sm:grid-cols-2 md:grid-cols-3
      gap-6 p-2
    ">
      {cards.map((c, i) => {
        const isFlipped = flipped[i];

        return (
          <div
            key={i}
            onClick={() => toggleFlip(i)}
            className="
              relative w-full aspect-[3/2]
              cursor-pointer select-none
            "
            style={{ perspective: "1200px" }}
          >
            <div
              className={`
                absolute inset-0 
                transition-transform duration-500 
                transform 
                ${isFlipped ? "rotate-y-180" : ""}
              `}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="
                  absolute inset-0 
                  bg-[#D9E6E4] backdrop-blur-sm 
                  border border-white/30 
                  shadow-md rounded-xl 
                  flex items-center justify-center p-4 
                  overflow-auto
                "
                style={{ 
                  backfaceVisibility: "hidden"
                }}
              >
                <MarkdownHTML source={c.front} />
              </div>
              <div
                className="
                  absolute inset-0 
                  bg-[#00594C] text-white 
                  border border-white/20
                  shadow-xl rounded-xl 
                  flex items-center justify-center p-4 
                  overflow-auto rotate-y-180
                "
                style={{ 
                  backfaceVisibility: "hidden"
                }}
              >
                <MarkdownHTML source={c.back} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
