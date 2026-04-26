import { LIKES_FM_TASKS } from "src/tasks";
import { humanClick } from "src/utils";

function getTasks() {
  return {
    [LIKES_FM_TASKS.REPOST]: async () => {
      const shareBtn = document.querySelector('[data-testid=post_footer_action_share], .like_btns .like_btn.share._share') as HTMLElement;
      if (!shareBtn) {
        return;
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
            
          resolve(null);
        }, 1000);
      });
    },
    [LIKES_FM_TASKS.LIKE]: async () => {
      const likeBtn = document.querySelector('[data-testid=post_footer_action_like]:not([data-user-likes=true]), .like_btns .like_btn.like._like:not(.active)') as HTMLElement;
      if (!likeBtn) {
        return;
      }
      
      await humanClick(likeBtn);

      return new Promise((resolve) => {
        setTimeout(async () => {
          const heart = document.querySelector('[data-testid=reaction-bar-item-0]') as HTMLElement;
          if (heart) {
            await humanClick(heart);
          }
            
          resolve(null);
        }, 1000);
      });

    },
    [LIKES_FM_TASKS.SUB]: async () => {
      const followBtn = document.querySelector('.ProfileHeaderButton button.vkuiClickable__realClickable') as HTMLElement;
      if (followBtn && (followBtn.innerText.includes("Добавить") || followBtn.innerText.includes("Подписаться"))) {
        await humanClick(followBtn);
      }
    },
    [LIKES_FM_TASKS.GROUP]: async () => {
      const joinBtn = document.querySelector('.vkuiButtonGroup__host button.vkuiClickable__realClickable') as HTMLElement;
      if (joinBtn && (joinBtn.innerText.includes("Вступить") || joinBtn.innerText.includes("Подписаться"))) {
        await humanClick(joinBtn);
      }
    },
    [LIKES_FM_TASKS.COMMENT]: async () => {
      throw 'Not implemented yet'
    },
    [LIKES_FM_TASKS.POLL]: async () => {
      throw 'Not implemented yet'
    },
  };
}

async function run() {
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  const { vk_currentAutomation } = await chrome.storage.session.get("vk_currentAutomation");

  if (!extensionEnabled || !vk_currentAutomation) {
    return;
  }

  const tasks = getTasks();
  
  try {
    await tasks[vk_currentAutomation.type as LIKES_FM_TASKS]();
  } catch (e) {
    console.error(e);
    alert(e);
  } finally {
    await chrome.storage.session.remove("vk_currentAutomation");
    setTimeout(() => {
      chrome.runtime.sendMessage({ action: "close_current_tab" });
    }, 3000);
  }
};

window.onload = () => setTimeout(run, 3000);
