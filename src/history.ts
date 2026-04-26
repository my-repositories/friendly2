export type AutomationStatus = "success" | "skipped" | "error";

export type AutomationEvent = {
  serviceId: string;
  moduleId: string;
  status: AutomationStatus;
  timestamp: number;
  details?: string;
};

export const AUTOMATION_HISTORY_KEY = "automation_history";
const MAX_EVENTS = 200;

export async function appendHistoryEvent(event: AutomationEvent): Promise<void> {
  const storage = await chrome.storage.local.get([AUTOMATION_HISTORY_KEY]);
  const events = (storage[AUTOMATION_HISTORY_KEY] ?? []) as AutomationEvent[];
  const nextEvents = [...events, event].slice(-MAX_EVENTS);
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: nextEvents });
}

export async function clearAutomationHistory(): Promise<void> {
  await chrome.storage.local.set({ [AUTOMATION_HISTORY_KEY]: [] });
}
