import { appendHistoryEvent } from "src/history";
import { startVkTask, waitForVkTaskResult } from "src/sites/likes_fm/infra/bridgeClient";
import type { TaskResult } from "src/sites/likes_fm/types";
import {
  closePopup,
  getTaskLinkForType,
  isTaskStillPresent,
  skipTask,
  verifyTask,
} from "src/sites/likes_fm/ui/taskDom";
import type { LIKES_FM_TASKS } from "src/tasks";
import { getRandomDelay, waitFor } from "src/utils";

export async function processTask(serviceId: string, type: LIKES_FM_TASKS): Promise<TaskResult> {
  const { selector, taskLink } = await getTaskLinkForType(type);

  if (!taskLink) {
    await appendHistoryEvent({
      serviceId,
      moduleId: type,
      status: "skipped",
      timestamp: Date.now(),
      details: "Очередь пуста",
      url: window.location.href,
    });
    return "empty";
  }

  const taskHref = taskLink.href;
  const taskId = await startVkTask(type, taskLink);
  const vkResult = await waitForVkTaskResult(taskId);
  if (vkResult.status === "error") {
    await appendHistoryEvent({
      serviceId,
      moduleId: type,
      status: "error",
      timestamp: Date.now(),
      details: vkResult.details ?? "VK task failed",
      url: taskHref,
    });
    return "retryable_fail";
  }

  await waitFor(getRandomDelay(1000, 2500));
  closePopup();

  if (!isTaskStillPresent(selector, taskHref)) {
    await appendHistoryEvent({
      serviceId,
      moduleId: type,
      status: "success",
      timestamp: Date.now(),
      url: taskHref,
    });
    return "success";
  }

  await verifyTask(selector);

  if (isTaskStillPresent(selector, taskHref)) {
    skipTask(selector);
    await appendHistoryEvent({
      serviceId,
      moduleId: type,
      status: "error",
      timestamp: Date.now(),
      details: "Задача застряла после проверки",
      url: taskHref,
    });
    return "retryable_fail";
  }

  await appendHistoryEvent({
    serviceId,
    moduleId: type,
    status: "success",
    timestamp: Date.now(),
    details: "Успешно после повторной проверки",
    url: taskHref,
  });
  return "success";
}
