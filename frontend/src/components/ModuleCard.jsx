export default function ModuleCard({ title, description, Icon, color }) {
  return (
    <div
      className="rounded-2xl shadow-md p-6 bg-white hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center border"
      style={{ borderColor: `${color}33` }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
        style={{
          backgroundColor: `${color}15`,
        }}
      >
        {Icon && <Icon className="w-10 h-10" style={{ color }} />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p classscri="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
