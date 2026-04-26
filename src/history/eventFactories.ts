import type { AutomationEventType, AutomationStatus } from "src/history";

export function resolveEventTypeFromStatus(status: AutomationStatus): AutomationEventType {
  if (status === "error") {
    return "error";
  }
  if (status === "skipped") {
    return "warn";
  }
  return "info";
}

export function normalizeEventType(
  eventType: AutomationEventType | undefined,
  status: AutomationStatus
): AutomationEventType {
  if (eventType === "info" || eventType === "warn" || eventType === "error" || eventType === "critical") {
    return eventType;
  }
  return resolveEventTypeFromStatus(status);
}
