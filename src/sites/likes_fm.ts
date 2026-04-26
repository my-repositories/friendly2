import { appendHistoryEvent } from "src/history";
import {
  applyHourlyReset,
  createInitialSafetyState,
  isSafetyPaused,
  normalizeSafetyState,
  type SafetyPolicy,
  type SafetyState,
} from "src/safety";
import { LIKES_FM_TASKS } from "src/tasks";
import { startSiteAutomation } from "src/sites/runner";
import { getRandomDelay, humanClick, waitForElement } from "src/utils";
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
type TaskResult = "success" | "empty" | "retryable_fail";

type LikesFmSettings = Record<LIKES_FM_TASKS, boolean>;

const EMPTY_LIKES_FM_SETTINGS: LikesFmSettings = {
  [LIKES_FM_TASKS.REPOST]: false,
  [LIKES_FM_TASKS.LIKE]: false,
  [LIKES_FM_TASKS.SUB]: false,
  [LIKES_FM_TASKS.GROUP]: false,
  [LIKES_FM_TASKS.COMMENT]: false,
  [LIKES_FM_TASKS.POLL]: false,
};

function toLikesFmSettings(input: unknown): LikesFmSettings {
  const source = (typeof input === "object" && input !== null
    ? (input as Record<string, unknown>)
    : {}) as Record<string, unknown>;

  return {
    [LIKES_FM_TASKS.REPOST]: Boolean(source[LIKES_FM_TASKS.REPOST] ?? EMPTY_LIKES_FM_SETTINGS.repost),
    [LIKES_FM_TASKS.LIKE]: Boolean(source[LIKES_FM_TASKS.LIKE] ?? EMPTY_LIKES_FM_SETTINGS.like),
    [LIKES_FM_TASKS.SUB]: Boolean(source[LIKES_FM_TASKS.SUB] ?? EMPTY_LIKES_FM_SETTINGS.sub),
    [LIKES_FM_TASKS.GROUP]: Boolean(source[LIKES_FM_TASKS.GROUP] ?? EMPTY_LIKES_FM_SETTINGS.group),
    [LIKES_FM_TASKS.COMMENT]: Boolean(source[LIKES_FM_TASKS.COMMENT] ?? EMPTY_LIKES_FM_SETTINGS.comment),
    [LIKES_FM_TASKS.POLL]: Boolean(source[LIKES_FM_TASKS.POLL] ?? EMPTY_LIKES_FM_SETTINGS.poll),
  };
}

class LikesFm
{
  private static SAFETY_STATE_KEY = "likesfm_safety_state";
  private safetyPolicy: SafetyPolicy = {
    maxActionsPerHour: 120,
    pauseAfterConsecutiveErrors: 3,
    pauseDurationMs: 5 * 60 * 1000,
  };
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
  private userSettings: LikesFmSettings = EMPTY_LIKES_FM_SETTINGS;
  private lastTaskResult: TaskResult = "success";
  private safetyState: SafetyState = createInitialSafetyState();

  private async persistSafetyState(): Promise<void> {
    await chrome.storage.session.set({
      [LikesFm.SAFETY_STATE_KEY]: this.safetyState,
    });
  }

  private async loadSafetyState(): Promise<void> {
    const now = Date.now();
    const state = await chrome.storage.session.get([LikesFm.SAFETY_STATE_KEY]);
    this.safetyState = applyHourlyReset(normalizeSafetyState(state[LikesFm.SAFETY_STATE_KEY], now), now);
    await this.persistSafetyState();
  }

  private async syncSafetyStatusForPopup(): Promise<void> {
    const now = Date.now();
    await chrome.storage.session.set({
      likesfm_safety_status: {
        paused: isSafetyPaused(this.safetyState, this.safetyPolicy, now),
        pausedUntil: this.safetyState.pausedUntil,
        actionsThisHour: this.safetyState.actionsThisHour,
      },
    });
  }

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

  private async processTask(type: LIKES_FM_TASKS): Promise<TaskResult> {
    const selector = `.module.page_list_module[type="${type}"]:not(.empty)`;
    const moduleElement = (await waitForElement(selector, { timeout: 3000 })) as HTMLElement | undefined;
    const taskLink = moduleElement?.querySelector("a.open_offer") as HTMLAnchorElement | null;

    if (!taskLink) {
      await appendHistoryEvent({
        serviceId: this.id,
        moduleId: type,
        status: "skipped",
        timestamp: Date.now(),
        details: "Очередь пуста",
        url: window.location.href,
      });
      return "empty";
    }

    const taskHref = taskLink.href;
    await this.startTask(type, taskLink);
    await delay(getRandomDelay(6000, 12000));
    this.closePopup();

    if (!this.isTaskStillPresent(selector, taskHref)) {
      await appendHistoryEvent({
        serviceId: this.id,
        moduleId: type,
        status: "success",
        timestamp: Date.now(),
        url: taskHref,
      });
      return "success";
    }

    await this.verifyTask(selector);

    if (this.isTaskStillPresent(selector, taskHref)) {
      this.skipTask(selector);
      await appendHistoryEvent({
        serviceId: this.id,
        moduleId: type,
        status: "error",
        timestamp: Date.now(),
        details: "Задача застряла после проверки",
        url: taskHref,
      });
      return "retryable_fail";
    } else {
      await appendHistoryEvent({
        serviceId: this.id,
        moduleId: type,
        status: "success",
        timestamp: Date.now(),
        details: "Успешно после повторной проверки",
        url: taskHref,
      });
      return "success";
    }
  }

  private async startTask(type: LIKES_FM_TASKS, link: HTMLAnchorElement): Promise<void> {
    await chrome.storage.session.set({
      vk_currentAutomation: { type, url: link.href }
    });
    await humanClick(link);
  }

  private async verifyTask(selector: string): Promise<void> {
    (document.querySelector(`${selector} span.do_offer`) as HTMLElement)?.click();
    await delay(getRandomDelay(2000, 4000));
    this.closePopup();
  }

  private skipTask(selector: string): void {
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
    this.userSettings = toLikesFmSettings(settings[this.id]);
    await this.loadSafetyState();
    await this.syncSafetyStatusForPopup();

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[this.id]) {
        this.userSettings = toLikesFmSettings(changes[this.id].newValue);
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
      const now = Date.now();
      this.safetyState = applyHourlyReset(this.safetyState, now);

      if (isSafetyPaused(this.safetyState, this.safetyPolicy, now)) {
        await appendHistoryEvent({
          serviceId: this.id,
          moduleId: "safety",
          status: "skipped",
          timestamp: now,
          details: "Safety pause active",
        });
        this.lastTaskResult = "empty";
        return;
      }

      this.currentTask = this.getNextTask();
      this.lastTaskResult = await this.processTask(this.currentTask);
      this.safetyState.actionsThisHour += 1;
      if (this.lastTaskResult === "retryable_fail") {
        this.safetyState.consecutiveErrors += 1;
      } else if (this.lastTaskResult === "success") {
        this.safetyState.consecutiveErrors = 0;
      }

      if (this.safetyState.consecutiveErrors >= this.safetyPolicy.pauseAfterConsecutiveErrors) {
        this.safetyState.pausedUntil = Date.now() + this.safetyPolicy.pauseDurationMs;
      }
    } catch (error) {
      await appendHistoryEvent({
        serviceId: this.id,
        moduleId: this.currentTask,
        status: "error",
        timestamp: Date.now(),
        details: String(error),
        url: window.location.href,
      });
      this.safetyState.consecutiveErrors += 1;
      if (this.safetyState.consecutiveErrors >= this.safetyPolicy.pauseAfterConsecutiveErrors) {
        this.safetyState.pausedUntil = Date.now() + this.safetyPolicy.pauseDurationMs;
      }
      this.lastTaskResult = "retryable_fail";
    } finally {
      this.hasProcessingTask = false;
      await this.persistSafetyState();
      await this.syncSafetyStatusForPopup();
      const nextDelay = this.lastTaskResult === "retryable_fail"
        ? getRandomDelay(15000, 22000)
        : getRandomDelay(8000, 14000);
      setTimeout(() => this.run(), nextDelay);
    }
  }
}

window.onload = () =>
  startSiteAutomation({
    serviceId: "likesfm",
    run: async () => {
      const app = await new LikesFm().init();
      await app.run();
    },
  });
