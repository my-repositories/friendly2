import type { DispatchTaskToVkMessage } from "src/automation/contracts/messages";
import type { VkTaskRunResult } from "src/automation/contracts/tasks";
import { LIKES_FM_TASKS } from "src/tasks";
import { runGroupTask } from "src/sites/vk/handlers/group";
import { runLikeTask } from "src/sites/vk/handlers/like";
import { runRepostTask } from "src/sites/vk/handlers/repost";
import { runSubTask } from "src/sites/vk/handlers/sub";

type TaskHandler = () => Promise<VkTaskRunResult>;

const taskHandlers: Record<LIKES_FM_TASKS, TaskHandler> = {
  [LIKES_FM_TASKS.REPOST]: runRepostTask,
  [LIKES_FM_TASKS.LIKE]: runLikeTask,
  [LIKES_FM_TASKS.SUB]: runSubTask,
  [LIKES_FM_TASKS.GROUP]: runGroupTask,
  [LIKES_FM_TASKS.COMMENT]: async () => {
    throw new Error("Not implemented yet");
  },
  [LIKES_FM_TASKS.POLL]: async () => {
    throw new Error("Not implemented yet");
  },
};

export async function executeVkTask(message: DispatchTaskToVkMessage): Promise<VkTaskRunResult> {
  const taskHandler = taskHandlers[message.taskType];
  if (!taskHandler) {
    return {
      status: "skipped",
      eventType: "warn",
      details: "vkcom task handler is missing - skipping",
    };
  }
  return taskHandler();
}
