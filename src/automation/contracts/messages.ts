import type { VkTaskFinishedPayload, VkTaskStatus, VkTaskType } from "src/automation/contracts/tasks";

export type StartTaskMessage = {
  type: "START_TASK";
  taskId: string;
  source: "likesfm";
  taskType: VkTaskType;
  taskUrl: string;
  startedAt: number;
  timeoutMs: number;
};

export type WaitTaskResultMessage = {
  type: "WAIT_TASK_RESULT";
  taskId: string;
};

export type VkTabReadyMessage = {
  type: "VK_TAB_READY";
  url: string;
};

export type DispatchTaskToVkMessage = {
  type: "DISPATCH_TASK_TO_VK";
  taskId: string;
  taskType: VkTaskType;
  taskUrl: string;
};

export type VkActionDoneMessage = {
  type: "VK_ACTION_DONE";
  taskId: string;
  status: VkTaskStatus;
  details?: string;
  data?: unknown;
  reason?: string;
};

export type TaskFinishedMessage = {
  type: "TASK_FINISHED";
} & VkTaskFinishedPayload;

export type CloseCurrentTabMessage = {
  action: "close_current_tab";
};

export type RuntimeInboundMessage =
  | StartTaskMessage
  | WaitTaskResultMessage
  | VkTabReadyMessage
  | VkActionDoneMessage
  | CloseCurrentTabMessage;
