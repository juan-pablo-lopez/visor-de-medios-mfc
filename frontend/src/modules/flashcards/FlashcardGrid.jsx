import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { getCard } from "../../api/flashcards";

function MarkdownHTML({ source }) {
  const rawHtml = marked.parse(source ?? "");
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div
      className="p-2 text-center"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export default function FlashcardGrid({ order = [], topic }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);

  // Cargar tarjetas
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
          setFlipped(new Array(result.length).fill(false)); // inicializa flips
        }
      } catch (err) {
        console.error("Error loading grid cards:", err);
      }
    }

    loadAllCards();

    return () => {
      cancelled = true;
    };
  }, [order, topic]);

  function toggleFlip(i) {
    setFlipped(prev => {
      const copy = [...prev];
      copy[i] = !copy[i];
      return copy;
    });
  }

  if (!cards.length) {
    return <p className="text-gray-500">Cargando tarjetas…</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const isFlipped = flipped[i];

        return (
          <div
            key={i}
            className="relative w-full h-40 cursor-pointer"
            style={{ perspective: "1000px" }}
            onClick={() => toggleFlip(i)}
          >
            {/* Contenedor giratorio */}
            <div
              className={`absolute inset-0 transition-transform duration-500 transform ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* FRONT */}
              <div
                className="absolute inset-0 bg-gray-200 shadow-lg p-4 rounded-xl backface-hidden flex items-center justify-center overflow-auto"
                style={{ backfaceVisibility: "hidden" }}
              >
                <MarkdownHTML source={c.front} />
              </div>

              {/* BACK */}
              <div
                className="absolute inset-0 bg-black text-white shadow-lg p-4 rounded-xl flex items-center justify-center overflow-auto rotate-y-180"
                style={{
                  backfaceVisibility: "hidden",
                }}
              >
                <MarkdownHTML source={c.back} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
