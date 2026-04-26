import type { VkTaskRunResult } from "src/automation/contracts/tasks";
import { humanClick } from "src/utils";
import { vkSelectors } from "src/sites/vk/selectors";

export async function runGroupTask(): Promise<VkTaskRunResult> {
  const joinBtn = document.querySelector(vkSelectors.group.joinButton) as HTMLElement | null;
  if (joinBtn && (joinBtn.innerText.includes("Вступить") || joinBtn.innerText.includes("Подписаться"))) {
    await humanClick(joinBtn);
  }

  return {
    status: "success",
    eventType: "info",
    details: "vkcom apply group",
  };
}
