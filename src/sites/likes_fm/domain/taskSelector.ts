import type { LikesFmSettings } from "src/sites/likes_fm/types";
import type { LIKES_FM_TASKS } from "src/tasks";

export function getNextTask(
  taskOrder: LIKES_FM_TASKS[],
  currentTask: LIKES_FM_TASKS,
  settings: LikesFmSettings
): LIKES_FM_TASKS {
  const currentIndex = taskOrder.indexOf(currentTask);

  for (let i = 1; i <= taskOrder.length; i++) {
    const nextIndex = (currentIndex + i) % taskOrder.length;
    const candidateTask = taskOrder[nextIndex];
    if (settings[candidateTask]) {
      return candidateTask;
    }
  }

  throw new Error("Не могу получить ни одного задания, потому что все модули отключены!");
}
