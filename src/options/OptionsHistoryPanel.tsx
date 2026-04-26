import React, { useMemo, useState } from "react";
import type { AutomationEvent, AutomationEventType } from "src/history";

type OptionsHistoryPanelProps = {
  events: AutomationEvent[];
  onClear: () => void;
};

function statusBadgeClass(status: AutomationEvent["status"]): string {
  if (status === "success") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/20";
  if (status === "error") return "bg-rose-500/20 text-rose-300 border-rose-500/20";
  return "bg-amber-500/20 text-amber-300 border-amber-500/20";
}

function eventTypeBadgeClass(eventType: AutomationEventType): string {
  if (eventType === "info") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/20";
  if (eventType === "warn") return "bg-amber-500/20 text-amber-300 border-amber-500/20";
  if (eventType === "error") return "bg-rose-500/20 text-rose-300 border-rose-500/20";
  return "bg-violet-500/20 text-violet-300 border-violet-500/20";
}

function getEventType(event: AutomationEvent): AutomationEventType {
  if (event.eventType) {
    return event.eventType;
  }
  if (event.status === "error") {
    return "error";
  }
  if (event.status === "skipped") {
    return "warn";
  }
  return "info";
}

export function OptionsHistoryPanel({ events, onClear }: OptionsHistoryPanelProps) {
  const [enabledTypes, setEnabledTypes] = useState<Record<AutomationEventType, boolean>>({
    info: true,
    warn: true,
    error: true,
    critical: true,
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => enabledTypes[getEventType(event)]);
  }, [enabledTypes, events]);

  const toggleType = (type: AutomationEventType) => {
    setEnabledTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="px-2 pb-2 h-full min-h-0 flex flex-col">
      <div className="flex items-center justify-between mb-3 px-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">История автоматизации</h2>
        <button
          onClick={onClear}
          className="text-[10px] uppercase tracking-wider font-bold text-slate-500 hover:text-indigo-400 transition-colors"
        >
          Очистить
        </button>
      </div>

      <div className="px-2 mb-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-slate-400">
        {(["info", "warn", "error", "critical"] as AutomationEventType[]).map((type) => (
          <label key={type} className="inline-flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enabledTypes[type]}
              onChange={() => toggleType(type)}
              className="accent-indigo-400 size-3"
            />
            {type}
          </label>
        ))}
      </div>

      <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-10 border border-dashed border-white/10 rounded-2xl">
            История по выбранным фильтрам пуста
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <div key={`${event.timestamp}-${event.moduleId}-${index}`} className="p-3 rounded-2xl bg-[#1e2230] border border-white/5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm text-slate-200 font-semibold">{event.serviceId}.{event.moduleId}</span>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${eventTypeBadgeClass(getEventType(event))}`}>
                    {getEventType(event)}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusBadgeClass(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>
              {event.details ? (
                <div className="text-[12px] text-slate-300 mt-1 break-words">
                  {event.details}
                </div>
              ) : null}
              <div className="text-[11px] text-slate-400">
                {new Date(event.timestamp).toLocaleString()}
              </div>
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[11px] text-indigo-300/90 hover:text-indigo-200 truncate mt-1"
                  title={event.url}
                >
                  {event.url}
                </a>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
