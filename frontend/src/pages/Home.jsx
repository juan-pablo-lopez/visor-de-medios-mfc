import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";

const modules = [
  {
    id: "videos",
    title: "Visor de Videos",
    description: "Explora videos en una vista tipo Netflix.",
    path: "/videos",
    image: "/images/videos.jpg"
  },
  {
    id: "docs",
    title: "Documentos",
    description: "Lee documentos PDF dentro de la aplicación.",
    path: "/docs",
    image: "/images/docs.jpg"
  },
  {
    id: "flashcards",
    title: "Tarjetas",
    description: "Práctica con tarjetas estilo Anki.",
    path: "/flashcards",
    image: "/images/flashcards.jpg"
  }
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {modules.map(m => (
        <Link key={m.id} to={m.path}>
          <ModuleCard title={m.title} description={m.description} image={m.image} />
        </Link>
      ))}
    </div>
  );
}
