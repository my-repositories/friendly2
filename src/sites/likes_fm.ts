import { LIKES_FM_TASKS } from "src/tasks";
import { getRandomDelay, humanClick } from "src/utils";

class LikesFm
{
  private id = "likesfm";
  private taskOrder = [
      LIKES_FM_TASKS.REPOST,
      LIKES_FM_TASKS.LIKE,
      LIKES_FM_TASKS.SUB,
      LIKES_FM_TASKS.GROUP,
      LIKES_FM_TASKS.COMMENT,
      LIKES_FM_TASKS.POLL
  ];
  private currentTask: LIKES_FM_TASKS = LIKES_FM_TASKS.POLL;
  private hasProcessingTask: boolean = false;
  private userSettings: any;

  private getNextTask(): LIKES_FM_TASKS {
    let currentIndex = this.taskOrder.indexOf(this.currentTask);

    for (let i = 1; i <= this.taskOrder.length; i++) {
      const nextIndex = (currentIndex + i) % this.taskOrder.length;
      const candidateTask = this.taskOrder[nextIndex];

      if (this.userSettings[candidateTask]) {
        return candidateTask;
      }
    }

    throw "Не могу получить ни одного задания, потому что все модули отключены!";
  }

  private async processTask(type: LIKES_FM_TASKS): Promise<void> {
    const moduleSelector = `.module.page_list_module[type="${type}"]:not(.empty)`;
    const offerBlock = document.querySelector(moduleSelector) as HTMLElement;

    if (!offerBlock) {
      console.log(`[friendly2] Очередь ${type} пуста.`);
      return;
    }

    const taskLink = offerBlock.querySelector('a.open_offer') as HTMLAnchorElement;

    if (taskLink) {
      const currentHref = taskLink.href;
      console.log(`[friendly2] Кликаю по задаче ${type}: ${currentHref}`);
      await chrome.storage.session.set({
        vk_currentAutomation: {
          type: type,
          url: currentHref 
        }
      });
      await humanClick(taskLink);

      return new Promise((resolve) => {
        setTimeout(() => {
          (document.querySelector('.popup_box_container .close') as HTMLElement)?.click();
          const freshBlock = document.querySelector(moduleSelector);
          const stillExists = freshBlock?.querySelector(`a.open_offer[href="${currentHref}"]`);
          
          if (!stillExists) {
            console.log(`[friendly2] Задача ${type} успешно ушла из списка.`);
            resolve();
            return;
          }

          console.log(`[friendly2] Задача ${type} не исчезла, запускаю принудительную проверку.`);
          const checkButton = freshBlock?.querySelector('span.do_offer') as HTMLElement;
          checkButton?.click();

          setTimeout(() => {
            (document.querySelector('.popup_box_container .close') as HTMLElement)?.click();
            const freshBlock2 = document.querySelector(moduleSelector);
            const stillExists2 = freshBlock2?.querySelector(`a.open_offer[href="${currentHref}"]`);
            
            if (stillExists2) {
              console.log(`[friendly2] Задача ${type} не исчезла, нажимаю на крестик.`);
              const freshSkipButton = offerBlock.querySelector('div.x_button') as HTMLElement;
              freshSkipButton?.click();
            } else {
              console.log(`[friendly2] Задача ${type} успешно ушла из списка.`);
            }          
          }, getRandomDelay(2000, 4000));
          
          resolve();
        }, getRandomDelay(6000, 12000));
      });
    }
  }

  public async init(): Promise<LikesFm> {
    const settings = await chrome.storage.local.get([this.id]);
    this.userSettings = settings[this.id];

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[this.id]) {
        this.userSettings = changes[this.id].newValue;
      }
    });

    return this;
  }

  public async run(): Promise<void> {
    if (this.hasProcessingTask) {
      return;
    }

    this.hasProcessingTask = true;
    try {
      this.currentTask = this.getNextTask();
      await this.processTask(this.currentTask);
    } catch (error) {
      console.error("Ошибка при выполнении шага:", error);
    } finally {
      this.hasProcessingTask = false;
      setTimeout(() => this.run(), getRandomDelay(8000, 14000));
    }
  }
}

window.onload = async () => {
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  
  if (!extensionEnabled) {
    console.log("friendly2: расширение отключено пользователем.");
    return;
  }

  const app = await new LikesFm().init();
  await app.run();
};
