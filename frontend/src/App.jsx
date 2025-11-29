import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import VideosPage from "./modules/videos/VideosPage";
import DocsPage from "./modules/docs/DocsPage";
import FlashcardsPage from "./modules/flashcards/FlashcardsPage";

import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
