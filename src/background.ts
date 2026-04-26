import type {
  CloseCurrentTabMessage,
  DispatchTaskToVkMessage,
  RuntimeInboundMessage,
  StartTaskMessage,
  TaskFinishedMessage,
  VkActionDoneMessage,
  VkTabReadyMessage,
  WaitTaskResultMessage,
} from "src/automation/contracts/messages";
import type { VkTaskStatus, VkTaskType } from "src/automation/contracts/tasks";
import { createDefaultSettings } from "src/settings";
import { appendHistoryEvent } from "src/history";

chrome.storage.session.setAccessLevel({ 
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' 
});

const VK_TASK_TIMEOUT_DEFAULT_MS = 30_000;
const COMPLETED_TASK_TTL_MS = 2 * 60_000;

type TaskStatus = "pending" | "success" | "skipped" | "error";

type BridgeTask = {
  taskId: string;
  taskType: VkTaskType;
  taskUrl: string;
  likesTabId: number;
  vkTabId?: number;
  startedAt: number;
  timeoutAt: number;
  status: TaskStatus;
  details?: string;
  data?: unknown;
  finishedAt?: number;
  finishReason?: string;
};

type BridgeResponse = TaskFinishedMessage;

const tasksById = new Map<string, BridgeTask>();
const waitersByTaskId = new Map<string, Array<(response?: unknown) => void>>();

function makeTaskResponse(task: BridgeTask): BridgeResponse {
  return {
    type: "TASK_FINISHED",
    taskId: task.taskId,
    status: (task.status === "pending" ? "error" : task.status) as VkTaskStatus,
    details: task.details,
    data: task.data,
    finishedAt: task.finishedAt ?? Date.now(),
    reason: task.finishReason,
  };
}

function notifyWaiters(task: BridgeTask): void {
  const waiters = waitersByTaskId.get(task.taskId) ?? [];
  waitersByTaskId.delete(task.taskId);
  const response = makeTaskResponse(task);
  for (const sendResponse of waiters) {
    try {
      sendResponse(response);
    } catch {
      // If receiver was refreshed/closed, sendResponse can throw.
    }
  }
}

function cleanupOldCompletedTasks(now = Date.now()): void {
  for (const [taskId, task] of tasksById.entries()) {
    if (task.status !== "pending" && task.finishedAt && now - task.finishedAt > COMPLETED_TASK_TTL_MS) {
      tasksById.delete(taskId);
      waitersByTaskId.delete(taskId);
    }
  }
}

function finalizeTask(
  taskId: string,
  status: Exclude<TaskStatus, "pending">,
  payload?: { details?: string; data?: unknown; reason?: string }
): BridgeTask | undefined {
  const task = tasksById.get(taskId);
  if (!task || task.status !== "pending") {
    return task;
  }
  task.status = status;
  task.details = payload?.details;
  task.data = payload?.data;
  task.finishReason = payload?.reason;
  task.finishedAt = Date.now();
  notifyWaiters(task);
  return task;
}

function expirePendingTasks(now = Date.now()): void {
  for (const task of tasksById.values()) {
    if (task.status === "pending" && task.timeoutAt <= now) {
      finalizeTask(task.taskId, "error", {
        details: "VK did not respond within timeout",
        reason: "timeout",
      });
    }
  }
}

function tryDispatchTaskToVk(task: BridgeTask, vkTabId: number): void {
  task.vkTabId = vkTabId;
  const message: DispatchTaskToVkMessage = {
    type: "DISPATCH_TASK_TO_VK",
    taskId: task.taskId,
    taskType: task.taskType,
    taskUrl: task.taskUrl,
  };
  chrome.tabs.sendMessage(
    vkTabId,
    message,
    () => {
      if (chrome.runtime.lastError) {
        finalizeTask(task.taskId, "error", {
          details: `Failed to dispatch task to VK tab: ${chrome.runtime.lastError.message}`,
          reason: "dispatch_failed",
        });
      }
    }
  );
}

function urlsLikelyMatch(taskUrl: string, vkUrl: string): boolean {
  if (!taskUrl || !vkUrl) {
    return false;
  }
  if (taskUrl === vkUrl) {
    return true;
  }
  try {
    const taskParsed = new URL(taskUrl);
    const vkParsed = new URL(vkUrl);
    const sameHost = taskParsed.hostname === vkParsed.hostname;
    const samePath = taskParsed.pathname === vkParsed.pathname;
    return (
      sameHost &&
      samePath
    );
  } catch {
    return taskUrl === vkUrl;
  }
}

function findPendingTaskForVkUrl(vkUrl: string): BridgeTask | undefined {
  let firstPendingTask: BridgeTask | undefined;
  for (const task of tasksById.values()) {
    if (task.status !== "pending" || task.vkTabId) {
      continue;
    }
    if (!firstPendingTask) {
      firstPendingTask = task;
    }
    if (!task.taskUrl || urlsLikelyMatch(task.taskUrl, vkUrl)) {
      return task;
    }
  }
  return firstPendingTask;
}

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

  await chrome.storage.local.set(createDefaultSettings());

  await appendHistoryEvent({
    serviceId: "system",
    moduleId: "install",
    status: "success",
    timestamp: Date.now(),
    details: "Настройки успешно инициализированы при установке",
  });

  chrome.tabs.create({
    url: 'options/index.html',
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  for (const task of tasksById.values()) {
    if (task.status !== "pending") {
      continue;
    }
    if (task.vkTabId === tabId) {
      finalizeTask(task.taskId, "error", {
        details: "VK tab was closed before task completion",
        reason: "vk_tab_closed",
      });
    }
    if (task.likesTabId === tabId) {
      finalizeTask(task.taskId, "error", {
        details: "likes.fm tab was closed before task completion",
        reason: "likes_tab_closed",
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const inbound = message as RuntimeInboundMessage;
  const messageType = typeof (message as { type?: unknown })?.type === "string"
    ? (message as { type: string }).type
    : undefined;
  expirePendingTasks();
  cleanupOldCompletedTasks();

  if (messageType === "START_TASK") {
    const startMessage = inbound as StartTaskMessage;
    if (!sender.tab?.id) {
      sendResponse({ ok: false, error: "likes.fm tab id is missing" });
      return false;
    }
    const timeoutMs = Number(startMessage.timeoutMs ?? VK_TASK_TIMEOUT_DEFAULT_MS);
    const taskId = String(startMessage.taskId ?? "");
    const taskType = startMessage.taskType;
    const taskUrl = String(startMessage.taskUrl ?? "");

    if (!taskId || !taskType || !taskUrl) {
      sendResponse({ ok: false, error: "invalid START_TASK payload" });
      return false;
    }

    tasksById.set(taskId, {
      taskId,
      taskType,
      taskUrl,
      likesTabId: sender.tab.id,
      startedAt: Date.now(),
      timeoutAt: Date.now() + Math.max(1_000, timeoutMs),
      status: "pending",
    });
    sendResponse({ ok: true });
    return false;
  }

  if (messageType === "WAIT_TASK_RESULT") {
    const waitMessage = inbound as WaitTaskResultMessage;
    const taskId = String(waitMessage.taskId ?? "");
    const task = tasksById.get(taskId);
    if (!task) {
      sendResponse({
        type: "TASK_FINISHED",
        taskId,
        status: "error",
        details: "Task not found in coordinator",
        reason: "task_not_found",
        finishedAt: Date.now(),
      } satisfies BridgeResponse);
      return false;
    }
    if (task.status !== "pending") {
      sendResponse(makeTaskResponse(task));
      return false;
    }
    const waiters = waitersByTaskId.get(taskId) ?? [];
    waiters.push(sendResponse);
    waitersByTaskId.set(taskId, waiters);
    return true;
  }

  if (messageType === "VK_TAB_READY") {
    const readyMessage = inbound as VkTabReadyMessage;
    if (!sender.tab?.id) {
      sendResponse({ ok: false, error: "vk tab id is missing" });
      return false;
    }
    const vkUrl = String(readyMessage.url ?? "");
    const task = findPendingTaskForVkUrl(vkUrl);
    if (!task) {
      sendResponse({ ok: true, dispatched: false });
      return false;
    }
    tryDispatchTaskToVk(task, sender.tab.id);
    sendResponse({ ok: true, dispatched: true, taskId: task.taskId });
    return false;
  }

  if (messageType === "VK_ACTION_DONE") {
    const actionDoneMessage = inbound as VkActionDoneMessage;
    const taskId = String(actionDoneMessage.taskId ?? "");
    const status = String(actionDoneMessage.status ?? "error");
    if (status !== "success" && status !== "skipped" && status !== "error") {
      sendResponse({ ok: false, error: "invalid status" });
      return false;
    }
    const task = finalizeTask(taskId, status, {
      details: typeof actionDoneMessage.details === "string" ? actionDoneMessage.details : undefined,
      data: actionDoneMessage.data,
      reason: typeof actionDoneMessage.reason === "string" ? actionDoneMessage.reason : undefined,
    });
    sendResponse({ ok: Boolean(task), taskId });
    return false;
  }

  if ((inbound as CloseCurrentTabMessage).action === "close_current_tab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }

  return false;
});
