export default function WorkoutCard({ title, type, duration, intensity }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900/70 transition-colors">
      <div className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
        {type}
      </div>
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-zinc-400">
        {duration} min · Intensité {intensity}
      </div>
    </div>
  );
}
