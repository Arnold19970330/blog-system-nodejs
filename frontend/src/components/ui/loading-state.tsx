type LoadingStateProps = {
  label?: string;
  compact?: boolean;
};

export function LoadingState({ label = 'Betöltés...', compact = false }: LoadingStateProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${
        compact ? 'p-5' : 'p-8'
      } shadow-2xl`}
    >
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur-sm animate-pulse" />
          <div className="absolute inset-[3px] rounded-full border-2 border-white/20" />
          <div className="absolute inset-[3px] rounded-full border-t-2 border-r-2 border-purple-400 animate-spin" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-gray-400">Kis türelmet, készítjük az oldalt...</p>
        </div>
      </div>
    </div>
  );
}
