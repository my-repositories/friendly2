import React from "react";
import type { AutomationEvent } from "src/history";

type OptionsHistoryPanelProps = {
  events: AutomationEvent[];
  onClear: () => void;
};

function statusBadgeClass(status: AutomationEvent["status"]): string {
  if (status === "success") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/20";
  if (status === "error") return "bg-rose-500/20 text-rose-300 border-rose-500/20";
  return "bg-amber-500/20 text-amber-300 border-amber-500/20";
}

export function OptionsHistoryPanel({ events, onClear }: OptionsHistoryPanelProps) {
  return (
    <div className="px-2 pb-8 min-h-[350px]">
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">История автоматизации</h2>
        <button
          onClick={onClear}
          className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Очистить
        </button>
      </div>

      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-10 border border-dashed border-white/10 rounded-2xl">
            История пока пуста
          </div>
        ) : (
          events.map((event, index) => (
            <div key={`${event.timestamp}-${event.moduleId}-${index}`} className="p-3 rounded-2xl bg-[#1e2230] border border-white/5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm text-slate-200 font-semibold">{event.serviceId}.{event.moduleId}</span>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadgeClass(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              {event.details ? (
                <div className="text-[11px] text-slate-500 mt-1 break-words">{event.details}</div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
