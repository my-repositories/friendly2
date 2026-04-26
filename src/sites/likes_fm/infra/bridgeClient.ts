import type { StartTaskMessage, TaskFinishedMessage, WaitTaskResultMessage } from "src/automation/contracts/messages";
import type { LIKES_FM_TASKS } from "src/tasks";
import { humanClick, waitFor } from "src/utils";

const VK_TASK_TIMEOUT_MS = 30_000;

function generateTaskId(type: LIKES_FM_TASKS): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `likesfm-${type}-${Date.now()}-${randomPart}`;
}

function sendRuntimeMessage<TResponse = unknown>(message: unknown): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: TResponse) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

export async function startVkTask(type: LIKES_FM_TASKS, link: HTMLAnchorElement): Promise<string> {
  const taskId = generateTaskId(type);
  const message: StartTaskMessage = {
    type: "START_TASK",
    taskId,
    source: "likesfm",
    taskType: type,
    taskUrl: link.href,
    startedAt: Date.now(),
    timeoutMs: VK_TASK_TIMEOUT_MS,
  };
  const response = await sendRuntimeMessage<{ ok: boolean; error?: string }>(message);
  if (!response?.ok) {
    throw new Error(response?.error ?? "Failed to register task in background");
  }
  await humanClick(link);
  return taskId;
}

async function waitForTaskFinishedMessage(taskId: string): Promise<TaskFinishedMessage> {
  const message: WaitTaskResultMessage = {
    type: "WAIT_TASK_RESULT",
    taskId,
  };
  return sendRuntimeMessage<TaskFinishedMessage>(message);
}

export async function waitForVkTaskResult(taskId: string): Promise<TaskFinishedMessage> {
  const timeoutPromise = (async (): Promise<TaskFinishedMessage> => {
    await waitFor(VK_TASK_TIMEOUT_MS + 1000);
    return {
      type: "TASK_FINISHED",
      taskId,
      status: "error",
      details: "VK task timeout after 30 seconds",
      reason: "timeout",
      finishedAt: Date.now(),
    };
  })();

  try {
    return await Promise.race([waitForTaskFinishedMessage(taskId), timeoutPromise]);
  } catch (error) {
    return {
      type: "TASK_FINISHED",
      taskId,
      status: "error",
      details: `Background messaging failed: ${String(error)}`,
      reason: "messaging_error",
      finishedAt: Date.now(),
    };
  }
}
