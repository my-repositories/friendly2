import { appendHistoryEvent, type AutomationEventType, type AutomationStatus } from "src/history";
import { LIKES_FM_TASKS } from "src/tasks";
import { startSiteAutomation } from "src/sites/runner";
import { getRandomDelay, humanClick } from "src/utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type TaskRunResult = {
  status?: AutomationStatus;
  eventType?: AutomationEventType;
  details?: string;
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
      
      return new Promise((resolve) => {
        setTimeout(async () => {
          const shareMy = document.querySelector('#like_share_my') as HTMLElement;
          if (shareMy) {
            await humanClick(shareMy);
            const shareSend = document.querySelector('#like_share_send') as HTMLElement;
            await humanClick(shareSend);
          }
            
          resolve({
            status: "success",
            eventType: "info",
            details: `vkcom apply share`,
          });
        }, 1000);
      });
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

      await new Promise((resolve) => {
        setTimeout(async () => {
          const heart = document.querySelector('[data-testid=reaction-bar-item-0]') as HTMLElement;
          if (heart) {
            await humanClick(heart);
          }
            
          resolve(null);
        }, 1000);
      });
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

async function run() {
  const { vk_currentAutomation } = await chrome.storage.session.get("vk_currentAutomation");

  if (!vk_currentAutomation) {
    return;
  }

  const tasks = getTasks();
  const task = tasks[vk_currentAutomation.type as LIKES_FM_TASKS];
  
  try {
    if (!task) {
      await appendHistoryEvent({
        serviceId: "likesfm",
        moduleId: vk_currentAutomation.type,
        status: "skipped",
        eventType: "warn",
        timestamp: Date.now(),
        details: "vkcom task handler is missing - skipping",
        url: vk_currentAutomation.url ?? window.location.href,
      });
      return;
    }
    const result = await task();
    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: vk_currentAutomation.type,
      status: result?.status ?? "success",
      eventType: result?.eventType,
      timestamp: Date.now(),
      details: result?.details,
      url: vk_currentAutomation.url ?? window.location.href,
    });
  } catch (e) {
    alert(e);
    await appendHistoryEvent({
      serviceId: "likesfm",
      moduleId: vk_currentAutomation.type,
      status: "error",
      eventType: "critical",
      timestamp: Date.now(),
      details: `vkcom task failed critically: ${String(e)}`,
      url: vk_currentAutomation.url ?? window.location.href,
    });
  } finally {
    await chrome.storage.session.remove("vk_currentAutomation");
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "close_current_tab" });
    }, getRandomDelay(2000, 4000));
  }
};

window.onload = () =>
  startSiteAutomation({
    serviceId: "likesfm",
    run: async () => {
      await delay(3000);
      await run();
    },
  });
