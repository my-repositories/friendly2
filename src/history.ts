import { normalizeEventType as normalizeHistoryEventType } from "src/history/eventFactories";

export type AutomationStatus = "success" | "skipped" | "error";
export type AutomationEventType = "info" | "warn" | "error" | "critical";

export type AutomationEvent = {
  serviceId: string;
  moduleId: string;
  status: AutomationStatus;
  eventType?: AutomationEventType;
  timestamp: number;
  details?: string;
  url?: string;
};

export const AUTOMATION_HISTORY_KEY = "automation_history";
const MAX_EVENTS = 200;

function normalizeStatus(status: unknown): AutomationStatus {
  if (status === "success" || status === "skipped" || status === "error") {
    return status;
  }
  return "success";
}

function normalizeEventType(eventType: unknown, status: AutomationStatus): AutomationEventType {
  return normalizeHistoryEventType(
    typeof eventType === "string" ? (eventType as AutomationEventType) : undefined,
    status
  );
}

export async function appendHistoryEvent(event: AutomationEvent): Promise<void> {
  const storage = await chrome.storage.local.get([AUTOMATION_HISTORY_KEY]);
  const events = (storage[AUTOMATION_HISTORY_KEY] ?? []) as AutomationEvent[];
  const status = normalizeStatus(event.status);
  const normalizedEvent: AutomationEvent = {
    ...event,
    status,
    eventType: normalizeEventType(event.eventType, status),
  };
  const nextEvents = [...events, normalizedEvent].slice(-MAX_EVENTS);
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: nextEvents });
}

export async function clearAutomationHistory(): Promise<void> {
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: [] });
}
