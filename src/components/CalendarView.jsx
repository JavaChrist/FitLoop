export default function CalendarView({ days = [] }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => (
        <div
          key={d.date}
          className="border border-white/10 rounded p-2 h-20 text-xs"
        >
          <div className="opacity-70">{d.label}</div>
          <div className="mt-2">
            {d.slots?.map((s, i) => (
              <div
                key={i}
                className="border border-white/10 rounded px-1 py-0.5 mb-1 truncate"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
