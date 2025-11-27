import TopBar from "../components/TopBar";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
