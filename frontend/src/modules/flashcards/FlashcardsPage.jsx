import { useEffect, useState } from "react";
import { listTopics, startRandomOrder, getRandomNext } from "../../api/flashcards";
import FlashcardCarousel from "./FlashcardCarousel";
import FlashcardGrid from "./FlashcardGrid";

import GridIcon from "@/assets/grid.svg";
import CarouselIcon from "@/assets/carousel.svg";

function TopicCard({ topic, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        group cursor-pointer select-none
        rounded-2xl overflow-hidden
        shadow-lg hover:shadow-2xl
        transition-all duration-300 
        bg-white/60 backdrop-blur-sm
        border border-white/20
        w-full aspect-[4/3]
        flex flex-col
      "
    >
      <div className="relative w-full flex-1 overflow-hidden">
        <img
          src={`/flashcards/${topic.id}.svg`}
          alt={topic.display}
          className="
            w-full h-full object-contain p-6
            group-hover:scale-105 
            transition-transform duration-500
          "
        />
        <div
          className="
            absolute inset-0 bg-black/10 opacity-0
            group-hover:opacity-100 transition-opacity
          "
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#00594C] text-center line-clamp-2">
          {topic.display}
        </h3>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  const [topics, setTopics] = useState([]);

  // Modal state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState("carousel");
  const [order, setOrder] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listTopics().then(setTopics);
  }, []);

  useEffect(() => {
    if (!selectedTopic) {
      setOrder([]);
      setCurrentCard(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const data = await startRandomOrder(selectedTopic.id);
        const initialOrder = data?.order ?? data ?? [];
        if (!cancelled) setOrder(initialOrder);

        const firstCard = await getRandomNext(selectedTopic.id, 0);
        if (!cancelled) setCurrentCard(firstCard);
      } catch (e) {
        console.error("Error inicializando flashcards:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const onEsc = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onEsc);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onEsc);
    };
  }, [selectedTopic]);

  function handleClose() {
    setSelectedTopic(null);
    setMode("carousel");
    setOrder([]);
    setCurrentCard(null);
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-extrabold text-[#5C462B] drop-shadow-sm mb-2">
        Tarjetas
      </h1>
      <p className="text-gray-600 mb-10">Selecciona un tema para practicar.</p>
      <div
        className="
          grid max-w-6xl w-full gap-8
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3
        "
      >
        {topics.map((t) => (
          <TopicCard key={t.id} topic={t} onClick={() => setSelectedTopic(t)} />
        ))}
      </div>
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div
            className={`
              relative z-10
              bg-white rounded-2xl shadow-2xl
              overflow-hidden flex flex-col
              transition-all duration-300

              ${mode === "carousel"
                ? "w-[80vw] max-w-xl h-[70vh] max-h-[600px]"
                : "w-[95vw] max-w-6xl h-[90vh] max-h-[900px]"
              }
            `}
          >
            <div className="
              flex items-center justify-between
              px-6 py-4 border-b
              bg-white/80 backdrop-blur-sm
            ">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#00594C]">
                {selectedTopic.display}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode((m) => (m === "carousel" ? "grid" : "carousel"))}
                  className="
                    p-2 rounded-lg
                    bg-transparent
                    hover:bg-black/5
                    transition-colors
                    flex items-center justify-center
                  "
                  aria-label={mode === "carousel" ? "Cambiar a grid" : "Cambiar a carrusel"}
                >
                  <img
                    src={mode === "carousel"
                      ? GridIcon
                      : CarouselIcon
                    }
                    alt={mode === "carousel"
                      ? "Cambiar a Tabla"
                      : "Cambiar a Carrusel"
                    }
                    title={mode === "carousel"
                      ? "Cambiar a Tabla"
                      : "Cambiar a Carrusel"
                    }
                    className="w-8 h-8"
                  />
                </button>
                <button
                  onClick={handleClose}
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
            </div>
            <div className="flex-1 overflow-hidden px-4 py-4">
              {loading && (
                <div className="flex h-full items-center justify-center">
                  <div className="text-gray-500">Cargando tarjetas…</div>
                </div>
              )}
              {!loading && mode === "carousel" && (
                <div className="w-full h-full flex items-center justify-center">
                  <FlashcardCarousel
                    card={currentCard}
                    order={order}
                    next={async (i) => {
                      const ni = (i + 1) % order.length;
                      const nc = await getRandomNext(selectedTopic.id, ni);
                      setCurrentCard(nc);
                      return ni;
                    }}
                    prev={async (i) => {
                      const pi = (i - 1 + order.length) % order.length;
                      const pc = await getRandomNext(selectedTopic.id, pi);
                      setCurrentCard(pc);
                      return pi;
                    }}
                  />
                </div>
              )}
              {!loading && mode === "grid" && (
                <div className="w-full h-full overflow-y-auto">
                  <FlashcardGrid order={order} topic={selectedTopic.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
