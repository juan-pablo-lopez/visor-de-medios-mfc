import { Link, useLocation } from "react-router-dom";

export default function TopBar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded hover:bg-blue-200 ${
      pathname === path ? "bg-blue-300 font-bold" : ""
    }`;

  return (
    <div className="w-full flex gap-4 p-3 bg-gray-100 border-b shadow-sm">
      <Link to="/" className={linkClass("/")}>Inicio</Link>
      <Link to="/videos" className={linkClass("/videos")}>Videos</Link>
      <Link to="/docs" className={linkClass("/docs")}>Docs</Link>
      <Link to="/flashcards" className={linkClass("/flashcards")}>Flashcards</Link>
    </div>
  );
}
