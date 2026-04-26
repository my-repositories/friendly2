import React from "react";
import type { AutomationEvent } from "src/history";
import { eventTypeBadgeClass, statusBadgeClass } from "src/options/history/styles";
import { getEventType } from "src/options/history/types";

type HistoryEventItemProps = {
  event: AutomationEvent;
};

export function HistoryEventItem({ event }: HistoryEventItemProps) {
  const eventType = getEventType(event);

  return (
    <div className="p-3 rounded-2xl bg-[#1e2230] border border-white/5">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm text-slate-200 font-semibold">{event.serviceId}.{event.moduleId}</span>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${eventTypeBadgeClass(eventType)}`}>
            {eventType}
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
  );
}
