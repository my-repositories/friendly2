import type { VkTaskRunResult } from "src/automation/contracts/tasks";
import { humanClick, waitFor } from "src/utils";
import { vkSelectors } from "src/sites/vk/selectors";

export async function runRepostTask(): Promise<VkTaskRunResult> {
  const shareBtn = document.querySelector(vkSelectors.repost.shareButton) as HTMLElement | null;
  if (!shareBtn) {
    return {
      status: "skipped",
      eventType: "warn",
      details: "vkcom cannot find share button - skipping",
    };
  }

  await humanClick(shareBtn);
  await waitFor(1000);

  const shareMy = document.querySelector(vkSelectors.repost.shareMy) as HTMLElement | null;
  if (shareMy) {
    await humanClick(shareMy);
    const shareSend = document.querySelector(vkSelectors.repost.shareSend) as HTMLElement | null;
    if (shareSend) {
      await humanClick(shareSend);
    }
  }

  return {
    status: "success",
    eventType: "info",
    details: "vkcom apply share",
  };
}
