import React from "react";

type HistoryHeaderProps = {
  onClear: () => void;
};

export function HistoryHeader({ onClear }: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 px-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">История автоматизации</h2>
      <button
        onClick={onClear}
        className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hover:text-indigo-400 transition-colors"
      >
        Очистить
      </button>
    </div>
  );
}
