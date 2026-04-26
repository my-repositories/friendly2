import type { AutomationEvent, AutomationEventType, AutomationStatus } from "src/history";

export type EventTypeFilterState = Record<AutomationEventType, boolean>;

export const EVENT_TYPES: AutomationEventType[] = ["info", "warn", "error", "critical"];

export const DEFAULT_EVENT_FILTERS: EventTypeFilterState = {
  info: true,
  warn: true,
  error: true,
  critical: true,
};

export function getEventType(event: AutomationEvent): AutomationEventType {
  if (event.eventType === "info" || event.eventType === "warn" || event.eventType === "error" || event.eventType === "critical") {
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

export function getEventStatus(event: AutomationEvent): AutomationStatus {
  if (event.status === "success" || event.status === "skipped" || event.status === "error") {
    return event.status;
  }
  const eventType = getEventType(event);
  if (eventType === "error" || eventType === "critical") {
    return "error";
  }
  if (eventType === "warn") {
    return "skipped";
  }
  return "success";
}
