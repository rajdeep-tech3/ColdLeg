export function DemoBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
      </span>
      Demo Data
    </div>
  );
}
