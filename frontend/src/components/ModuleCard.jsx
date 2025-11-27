export default function ModuleCard({ title, description, image }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:scale-105 transition">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}
