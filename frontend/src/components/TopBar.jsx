import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Bars3Icon,
  XMarkIcon,
  HomeModernIcon,
  DocumentTextIcon,
  PlayCircleIcon,
  RectangleStackIcon
} from "@heroicons/react/24/outline";

import logo from "../assets/logo.png";

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Inicio", to: "/", icon: HomeModernIcon },
    { label: "Documentos", to: "/docs", icon: DocumentTextIcon },
    { label: "Videos", to: "/videos", icon: PlayCircleIcon },
    { label: "Tarjetas", to: "/flashcards", icon: RectangleStackIcon },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl px-6 py-3 flex items-center">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="h-10 md:h-12 w-auto"
            />
          </Link>
        </div>
        <div className="w-[30px]" />
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-lg font-medium transition-colors flex items-center gap-2 transition-colors
                ${
                isActive
                ? "text-[#00594C] border-b-2 border-[#FFB511] pb-1"
                : "text-[#5C462B] border-b-2 border-[transparent] pb-1 hover:text-[#00594C]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          className="md:hidden ml-4 text-[#00594C]"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-white/90 backdrop-blur-md shadow-inner pb-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`text-lg font-medium transition-colors flex items-center gap-2 transition-colors
                ${
                    isActive
                    ? "text-[#00594C] bg-[#FFB511]/20"
                    : "text-[#5C462B] hover:bg-[#FFB511]/10"
                }
                `}
              >
                <Icon className="w-5 h-5" />
                <div>{item.label}</div>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
