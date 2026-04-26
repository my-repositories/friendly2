import React from "react";

export function OptionsFooter() {
  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Настройки сохраняются автоматически
        </span>
      </div>

      <button
        onClick={() => window.close()}
        className="mt-2 text-[11px] text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors"
      >
        Закрыть настройки
      </button>
    </div>
  );
}
