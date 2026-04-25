import { LIKES_FM_TASKS } from "src/tasks";
import { getRandomDelay, humanClick } from "src/utils";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const selector = `.module.page_list_module[type="${type}"]:not(.empty)`;
    const taskLink = document.querySelector(`${selector} a.open_offer`) as HTMLAnchorElement;

    if (!taskLink) {
      console.log(`[friendly2] Очередь ${type} пуста.`);
      return;
    }

    const taskHref = taskLink.href;
    await this.startTask(type, taskLink);
    await delay(getRandomDelay(6000, 12000));
    this.closePopup();

    if (!this.isTaskStillPresent(selector, taskHref)) {
      console.log(`[friendly2] Задача ${type} успешно выполнена.`);
      return;
    }

    await this.verifyTask(selector);

    if (this.isTaskStillPresent(selector, taskHref)) {
      this.skipTask(selector);
    } else {
      console.log(`[friendly2] Задачу ${type} успешно протолкали.`);
    }
  }

  private async startTask(type: LIKES_FM_TASKS, link: HTMLAnchorElement): Promise<void> {
    console.log(`[friendly2] Кликаю по задаче ${type}: ${link.href}`);
    await chrome.storage.session.set({
      vk_currentAutomation: { type, url: link.href }
    });
    await humanClick(link);
  }

  private async verifyTask(selector: string): Promise<void> {
    console.log(`[friendly2] Задача не исчезла, запускаю проверку.`);
    (document.querySelector(`${selector} span.do_offer`) as HTMLElement)?.click();
    await delay(getRandomDelay(2000, 4000));
    this.closePopup();
  }

  private skipTask(selector: string): void {
    console.log(`[friendly2] Задача застряла, нажимаю крестик.`);
    (document.querySelector(`${selector} div.x_button`) as HTMLElement)?.click();
  }

  private closePopup(): void {
    (document.querySelector('.popup_box_container .close') as HTMLElement)?.click();
  }

  private isTaskStillPresent(selector: string, href: string): boolean {
    const block = document.querySelector(selector);
    return !!block?.querySelector(`a.open_offer[href="${href}"]`);
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
