import React from "react";
import type { AutomationEventType } from "src/history";
import { EVENT_TYPES, type EventTypeFilterState } from "src/options/history/types";

type HistoryFiltersProps = {
  enabledTypes: EventTypeFilterState;
  onToggleType: (type: AutomationEventType) => void;
};

export function HistoryFilters({ enabledTypes, onToggleType }: HistoryFiltersProps) {
  return (
    <div className="px-2 mb-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-slate-400">
      {EVENT_TYPES.map((type) => (
        <label key={type} className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={enabledTypes[type]}
            onChange={() => onToggleType(type)}
            className="accent-indigo-400 size-3"
          />
          {type}
        </label>
      ))}
    </div>
  );
}
