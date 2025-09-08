export default function ExerciseList({ items = [] }) {
  return (
    <div className="grid gap-2">
      {items.map((ex) => (
        <div key={ex.id} className="border border-white/10 rounded p-3">
          <div className="text-sm font-medium">{ex.name}</div>
          <div className="text-xs text-white/70">{ex.tags?.join(", ")}</div>
        </div>
      ))}
    </div>
  );
}
