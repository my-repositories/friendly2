import React, { useMemo, useState } from "react";
import type { AutomationEvent, AutomationEventType } from "src/history";
import { HistoryEmptyState } from "src/options/history/HistoryEmptyState";
import { HistoryEventItem } from "src/options/history/HistoryEventItem";
import { HistoryFilters } from "src/options/history/HistoryFilters";
import { HistoryHeader } from "src/options/history/HistoryHeader";
import { DEFAULT_EVENT_FILTERS, getEventType } from "src/options/history/types";

type OptionsHistoryPanelProps = {
  events: AutomationEvent[];
  onClear: () => void;
};

export function OptionsHistoryPanel({ events, onClear }: OptionsHistoryPanelProps) {
  const [enabledTypes, setEnabledTypes] = useState(DEFAULT_EVENT_FILTERS);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => enabledTypes[getEventType(event)]);
  }, [enabledTypes, events]);

  const toggleType = (type: AutomationEventType) => {
    setEnabledTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="px-2 pb-2 h-full min-h-0 flex flex-col">
      <HistoryHeader onClear={onClear} />
      <HistoryFilters enabledTypes={enabledTypes} onToggleType={toggleType} />

      <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
        {filteredEvents.length === 0 ? (
          <HistoryEmptyState />
        ) : (
          filteredEvents.map((event, index) => (
            <HistoryEventItem key={`${event.timestamp}-${event.moduleId}-${index}`} event={event} />
          ))
        )}
      </div>
    </div>
  );
}
