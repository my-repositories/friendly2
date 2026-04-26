import type { VkTaskRunResult } from "src/automation/contracts/tasks";
import { humanClick } from "src/utils";
import { vkSelectors } from "src/sites/vk/selectors";

export async function runSubTask(): Promise<VkTaskRunResult> {
  const followBtn = document.querySelector(vkSelectors.sub.followButton) as HTMLElement | null;
  if (followBtn && (followBtn.innerText.includes("Добавить") || followBtn.innerText.includes("Подписаться"))) {
    await humanClick(followBtn);
  }

  return {
    status: "success",
    eventType: "info",
    details: "vkcom apply sub",
  };
}
