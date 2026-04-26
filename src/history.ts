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

export async function appendHistoryEvent(event: AutomationEvent): Promise<void> {
  const storage = await chrome.storage.local.get([AUTOMATION_HISTORY_KEY]);
  const events = (storage[AUTOMATION_HISTORY_KEY] ?? []) as AutomationEvent[];
  const normalizedEvent: AutomationEvent = {
    ...event,
    eventType: event.eventType ?? (event.status === "error" ? "error" : event.status === "skipped" ? "warn" : "info"),
  };
  const nextEvents = [...events, normalizedEvent].slice(-MAX_EVENTS);
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: nextEvents });
}

export async function clearAutomationHistory(): Promise<void> {
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: [] });
}
