import type {
  CloseCurrentTabMessage,
  DispatchTaskToVkMessage,
  VkActionDoneMessage,
  VkTabReadyMessage,
} from "src/automation/contracts/messages";
import { appendHistoryEvent } from "src/history";
import { normalizeEventType } from "src/history/eventFactories";
import { executeVkTask } from "src/sites/vk/executor";
import { getRandomDelay, waitFor } from "src/utils";

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

async function reportVkActionDone(message: VkActionDoneMessage): Promise<void> {
  await sendRuntimeMessage(message);
}

async function closeCurrentTabWithDelay(): Promise<void> {
  await waitFor(getRandomDelay(2000, 4000));
  const closeMessage: CloseCurrentTabMessage = { action: "close_current_tab" };
  chrome.runtime.sendMessage(closeMessage);
}

async function executeTaskAndReport(taskMessage: DispatchTaskToVkMessage): Promise<void> {
  try {
    const result = await executeVkTask(taskMessage);
    const resultStatus = result.status ?? "success";
    const resultEventType = normalizeEventType(result.eventType, resultStatus);
    const resultDetails = result.details ?? "vkcom apply action";

    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: taskMessage.taskType,
      status: resultStatus,
      eventType: resultEventType,
      timestamp: Date.now(),
      details: resultDetails,
      url: taskMessage.taskUrl ?? window.location.href,
    });

    await reportVkActionDone({
      type: "VK_ACTION_DONE",
      taskId: taskMessage.taskId,
      status: resultStatus,
      details: resultDetails,
      data: { url: window.location.href },
    });
  } catch (error) {
    const details = `vkcom task failed critically: ${String(error)}`;
    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: taskMessage.taskType,
      status: "error",
      eventType: "critical",
      timestamp: Date.now(),
      details,
      url: taskMessage.taskUrl ?? window.location.href,
    });
    try {
      await reportVkActionDone({
        type: "VK_ACTION_DONE",
        taskId: taskMessage.taskId,
        status: "error",
        details,
        reason: "execution_exception",
        data: { url: window.location.href },
      });
    } catch {
      // If VK cannot report back, likes.fm has timeout fallback.
    }
  } finally {
    await closeCurrentTabWithDelay();
  }
}

function isDispatchTaskToVkMessage(message: unknown): message is DispatchTaskToVkMessage {
  return Boolean(message && typeof message === "object" && (message as { type?: unknown }).type === "DISPATCH_TASK_TO_VK");
}

function registerTaskListener(): void {
  chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if (!isDispatchTaskToVkMessage(message)) {
      return false;
    }
    void executeTaskAndReport(message)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  });
}

export async function runVkRuntime(): Promise<void> {
  registerTaskListener();
  const readyMessage: VkTabReadyMessage = {
    type: "VK_TAB_READY",
    url: window.location.href,
  };
  try {
    await sendRuntimeMessage(readyMessage);
  } catch {
    // likes.fm timeout fallback handles coordinator failures.
  }
}
