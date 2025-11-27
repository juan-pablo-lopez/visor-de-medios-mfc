import { useEffect, useState } from "react";
import { listTopics, startRandomOrder, getRandomNext } from "../../api/flashcards";
import FlashcardCarousel from "./FlashcardCarousel";
import FlashcardGrid from "./FlashcardGrid";

export default function FlashcardsPage() {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [order, setOrder] = useState([]);
  const [mode, setMode] = useState("carousel");
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    listTopics().then(setTopics);
  }, []);

  useEffect(() => {
    if (!activeTopic) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await startRandomOrder(activeTopic);
        const order = data?.order ?? data;
        setOrder(order);

        const firstCard = await getRandomNext(activeTopic, 0);
        if (!cancelled) {
          setCurrentCard(firstCard);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTopic]);


  if (!topics.length) return <p>Cargando...</p>;

  return (
    <div className="flex h-full">
      <div className="w-48 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-semibold mb-3">Temas</h2>

        <ul className="flex flex-col gap-2">
          {topics.map(t => (
            <li
              key={t.id}
              className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                activeTopic === t.id ? "bg-blue-200 font-bold" : ""
              }`}
              onClick={() => setActiveTopic(t.id)}
            >
              {t.display}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-6">
        {!activeTopic && (
          <p className="text-gray-500">Selecciona un tema para comenzar</p>
        )}
        {activeTopic && order.length > 0 && (
          <>
            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-semibold">
                {topics.find(x => x.id === activeTopic)?.display}
              </h1>

              <button
                onClick={() => setMode(m => (m === "carousel" ? "grid" : "carousel"))}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Cambiar a {mode === "carousel" ? "Grid" : "Carrusel"}
              </button>
            </div>
            {mode === "carousel" && currentCard ? (
              <FlashcardCarousel
                card={currentCard}
                order={order}
                next={async (currentIndex) => {
                  if (!order.length) return 0;

                  const nextIndex = (currentIndex + 1) % order.length;

                  try {
                    const newCard = await getRandomNext(activeTopic, nextIndex);
                    setCurrentCard(newCard);
                  } catch (e) {
                    console.error("getRandomNext failed:", e);
                  }

                  return nextIndex;
                }}
                prev={async (currentIndex) => {
                  if (!order.length) return 0;

                  const prevIndex = (currentIndex - 1 + order.length) % order.length;

                  try {
                    const newCard = await getRandomNext(activeTopic, prevIndex);
                    setCurrentCard(newCard);
                  } catch (e) {
                    console.error("getRandomNext failed:", e);
                  }

                  return prevIndex;
                }}
              />
            ) : (
              <FlashcardGrid order={order} topic={activeTopic} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
