import type { AutomationEventType, AutomationStatus } from "src/history";
import type { LIKES_FM_TASKS } from "src/tasks";

export type VkTaskType = LIKES_FM_TASKS;
export type VkTaskStatus = AutomationStatus;

export type VkTaskRunResult = {
  status?: VkTaskStatus;
  eventType?: AutomationEventType;
  details?: string;
};

export type VkTaskFinishedPayload = {
  taskId: string;
  status: VkTaskStatus;
  details?: string;
  data?: unknown;
  reason?: string;
  finishedAt: number;
};
