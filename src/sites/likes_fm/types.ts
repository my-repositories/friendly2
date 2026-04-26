import type { LIKES_FM_TASKS } from "src/tasks";

export type TaskResult = "success" | "empty" | "retryable_fail";
export type VkTaskStatus = "success" | "skipped" | "error";

export type VkTaskFinishedMessage = {
  type: "TASK_FINISHED";
  taskId: string;
  status: VkTaskStatus;
  details?: string;
  data?: unknown;
  reason?: string;
  finishedAt: number;
};

export type LikesFmSettings = Record<LIKES_FM_TASKS, boolean>;
