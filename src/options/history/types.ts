import type { AutomationEvent, AutomationEventType } from "src/history";

export type EventTypeFilterState = Record<AutomationEventType, boolean>;

export const EVENT_TYPES: AutomationEventType[] = ["info", "warn", "error", "critical"];

export const DEFAULT_EVENT_FILTERS: EventTypeFilterState = {
  info: true,
  warn: true,
  error: true,
  critical: true,
};

export function getEventType(event: AutomationEvent): AutomationEventType {
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
