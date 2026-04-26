import { appendHistoryEvent, type AutomationEventType, type AutomationStatus } from "src/history";
import { LIKES_FM_TASKS } from "src/tasks";
import { startSiteAutomation } from "src/sites/runner";
import { getRandomDelay, humanClick, waitFor } from "src/utils";
type TaskRunResult = {
  status?: AutomationStatus;
  eventType?: AutomationEventType;
  details?: string;
};
type VkDispatchMessage = {
  type: "DISPATCH_TASK_TO_VK";
  taskId: string;
  taskType: LIKES_FM_TASKS;
  taskUrl: string;
};

function getTasks() {
  return {
    [LIKES_FM_TASKS.REPOST]: async (): Promise<TaskRunResult> => {
      const shareBtn = document.querySelector('[data-testid=post_footer_action_share], .like_btns .like_btn.share._share') as HTMLElement;
      if (!shareBtn) {
        return {
          status: "skipped",
          eventType: "warn",
          details: `vkcom cannot find share button - skipping`,
        };
      }

      await humanClick(shareBtn);

      await waitFor(1000);
      const shareMy = document.querySelector('#like_share_my') as HTMLElement;
      if (shareMy) {
        await humanClick(shareMy);
        const shareSend = document.querySelector('#like_share_send') as HTMLElement;
        await humanClick(shareSend);
      }

      return {
        status: "success",
        eventType: "info",
        details: `vkcom apply share`,
      };
    },
    [LIKES_FM_TASKS.LIKE]: async (): Promise<TaskRunResult> => {
      const likeBtn = document.querySelector('[data-testid=post_footer_action_like]:not([data-user-likes=true]), .like_btns .like_btn.like._like:not(.active)') as HTMLElement;
      if (!likeBtn) {
        const alreadyLiked = document.querySelector('[data-testid=post_footer_action_like][data-user-likes=true], .like_btns .like_btn.like._like.active');
        if (alreadyLiked) {
          return {
            status: "skipped",
            eventType: "warn",
            details: `vkcom already have like - skipping`,
          };
        }
        return {
          status: "skipped",
          eventType: "warn",
          details: `vkcom cannot find like button - skipping`,
        };
      }
      
      await humanClick(likeBtn);
      await waitFor(1000);
      const heart = document.querySelector('[data-testid=reaction-bar-item-0]') as HTMLElement;
      if (heart) {
        await humanClick(heart);
      }
      return {
        status: "success",
        eventType: "info",
        details: `vkcom apply like`,
      };
    },
    [LIKES_FM_TASKS.SUB]: async (): Promise<TaskRunResult> => {
      const followBtn = document.querySelector('.ProfileHeaderButton button.vkuiClickable__realClickable') as HTMLElement;
      if (followBtn && (followBtn.innerText.includes("Добавить") || followBtn.innerText.includes("Подписаться"))) {
        await humanClick(followBtn);
      }
      return {
        status: "success",
        eventType: "info",
        details: `vkcom apply sub`,
      };
    },
    [LIKES_FM_TASKS.GROUP]: async (): Promise<TaskRunResult> => {
      const joinBtn = document.querySelector('.vkuiButtonGroup__host button.vkuiClickable__realClickable') as HTMLElement;
      if (joinBtn && (joinBtn.innerText.includes("Вступить") || joinBtn.innerText.includes("Подписаться"))) {
        await humanClick(joinBtn);
      }
      return {
        status: "success",
        eventType: "info",
        details: `vkcom apply group`,
      };
    },
    [LIKES_FM_TASKS.COMMENT]: async (): Promise<TaskRunResult> => {
      throw 'Not implemented yet'
    },
    [LIKES_FM_TASKS.POLL]: async (): Promise<TaskRunResult> => {
      throw 'Not implemented yet'
    },
  };
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

async function executeTask(taskMessage: VkDispatchMessage): Promise<void> {
  const tasks = getTasks();
  const task = tasks[taskMessage.taskType as LIKES_FM_TASKS];
  let resultStatus: AutomationStatus = "success";
  let resultDetails = "vkcom apply action";
  
  try {
    if (!task) {
      resultStatus = "skipped";
      resultDetails = "vkcom task handler is missing - skipping";
    } else {
      const result = await task();
      resultStatus = result?.status ?? "success";
      resultDetails = result?.details ?? "vkcom apply action";
    }

    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: taskMessage.taskType,
      status: resultStatus,
      eventType: resultStatus === "error" ? "error" : "info",
      timestamp: Date.now(),
      details: resultDetails,
      url: taskMessage.taskUrl ?? window.location.href,
    });

    await sendRuntimeMessage({
      type: "VK_ACTION_DONE",
      taskId: taskMessage.taskId,
      status: resultStatus,
      details: resultDetails,
      data: {
        url: window.location.href,
      },
    });
  } catch (e) {
    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: taskMessage.taskType,
      status: "error",
      eventType: "critical",
      timestamp: Date.now(),
      details: `vkcom task failed critically: ${String(e)}`,
      url: taskMessage.taskUrl ?? window.location.href,
    });
    try {
      await sendRuntimeMessage({
        type: "VK_ACTION_DONE",
        taskId: taskMessage.taskId,
        status: "error",
        details: `vkcom task failed critically: ${String(e)}`,
        reason: "execution_exception",
        data: {
          url: window.location.href,
        },
      });
    } catch {
      // If VK cannot report back, likes.fm has timeout fallback.
    }
  } finally {
    await waitFor(getRandomDelay(2000, 4000));
    chrome.runtime.sendMessage({ action: "close_current_tab" });
  }
}

function registerTaskListener(): void {
  chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
    if ((message as VkDispatchMessage)?.type !== "DISPATCH_TASK_TO_VK") {
      return false;
    }

    void executeTask(message as VkDispatchMessage)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));

    return true;
  });
}

async function run() {
  registerTaskListener();
  try {
    await sendRuntimeMessage({
      type: "VK_TAB_READY",
      url: window.location.href,
    });
  } catch {
    // likes.fm timeout fallback handles coordinator failures.
  }
}

window.onload = () =>
  startSiteAutomation({
    serviceId: "likesfm",
    run: async () => {
      await waitFor(3000);
      await run();
    },
  });
