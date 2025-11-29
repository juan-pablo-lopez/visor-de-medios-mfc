import { Link } from "react-router-dom";
import ModuleCard from "../components/ModuleCard";
import {
  PlayCircleIcon,
  DocumentTextIcon,
  RectangleStackIcon
} from "@heroicons/react/24/outline";

const modules = [
  {
    id: "docs",
    title: "Visor de Documentos",
    description: "Revisa documentos PDF y MD",
    path: "/docs",
    icon: DocumentTextIcon,
    color: "#5C462B",
  },
  {
    id: "videos",
    title: "Reproductor de Videos",
    description: "Como plataforma de streaming",
    path: "/videos",
    icon: PlayCircleIcon,
    color: "#00594C",
  },
  {
    id: "flashcards",
    title: "Tarjetas de Preguntas",
    description: "Práctica lo aprendido con tarjetas",
    path: "/flashcards",
    icon: RectangleStackIcon,
    color: "#FFB511",
  },
];

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl my-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Bienvenido al Visor de Medios MFC
        </h1>
        <p className="text-gray-600 text-lg">
          Explora los distintos módulos disponibles.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6 pb-12">
        {modules.map((m) => (
          <Link key={m.id} to={m.path} className="block">
            <ModuleCard
              title={m.title}
              description={m.description}
              Icon={m.icon}
              color={m.color}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
