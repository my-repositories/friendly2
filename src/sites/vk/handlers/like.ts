import type { VkTaskRunResult } from "src/automation/contracts/tasks";
import { humanClick, waitFor } from "src/utils";
import { vkSelectors } from "src/sites/vk/selectors";

export async function runLikeTask(): Promise<VkTaskRunResult> {
  const likeBtn = document.querySelector(vkSelectors.like.likeButton) as HTMLElement | null;
  if (!likeBtn) {
    const alreadyLiked = document.querySelector(vkSelectors.like.alreadyLiked);
    if (alreadyLiked) {
      return {
        status: "skipped",
        eventType: "warn",
        details: "vkcom already have like - skipping",
      };
    }
    return {
      status: "skipped",
      eventType: "warn",
      details: "vkcom cannot find like button - skipping",
    };
  }

  await humanClick(likeBtn);
  await waitFor(1000);

  const heart = document.querySelector(vkSelectors.like.firstReaction) as HTMLElement | null;
  if (heart) {
    await humanClick(heart);
  }

  return {
    status: "success",
    eventType: "info",
    details: "vkcom apply like",
  };
}
