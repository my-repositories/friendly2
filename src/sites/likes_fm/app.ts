import { appendHistoryEvent } from "src/history";
import {
  applyHourlyReset,
  createInitialSafetyState,
  type SafetyPolicy,
  type SafetyState,
} from "src/safety";
import { getNextTask } from "src/sites/likes_fm/domain/taskSelector";
import { processTask } from "src/sites/likes_fm/usecases/processTask";
import { EMPTY_LIKES_FM_SETTINGS, toLikesFmSettings } from "src/sites/likes_fm/state/settings";
import {
  isPausedBySafety,
  loadSafetyState,
  persistSafetyState,
  syncSafetyStatusForPopup,
} from "src/sites/likes_fm/state/safetyStore";
import type { LikesFmSettings, TaskResult } from "src/sites/likes_fm/types";
import { LIKES_FM_TASKS } from "src/tasks";
import { getRandomDelay, waitFor } from "src/utils";

export class LikesFmApp {
  private safetyPolicy: SafetyPolicy = {
    maxActionsPerHour: 120,
    pauseAfterConsecutiveErrors: 3,
    pauseDurationMs: 5 * 60 * 1000,
  };

  private readonly id = "likesfm";
  private readonly taskOrder: LIKES_FM_TASKS[] = [
    LIKES_FM_TASKS.REPOST,
    LIKES_FM_TASKS.LIKE,
    LIKES_FM_TASKS.SUB,
    LIKES_FM_TASKS.GROUP,
    LIKES_FM_TASKS.COMMENT,
    LIKES_FM_TASKS.POLL,
  ];

  private currentTask: LIKES_FM_TASKS = LIKES_FM_TASKS.POLL;
  private hasProcessingTask = false;
  private userSettings: LikesFmSettings = EMPTY_LIKES_FM_SETTINGS;
  private lastTaskResult: TaskResult = "success";
  private safetyState: SafetyState = createInitialSafetyState();

  public async init(): Promise<LikesFmApp> {
    const settings = await chrome.storage.local.get([this.id]);
    this.userSettings = toLikesFmSettings(settings[this.id]);
    this.safetyState = await loadSafetyState(Date.now());
    await syncSafetyStatusForPopup(this.safetyState, this.safetyPolicy, Date.now());

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes[this.id]) {
        this.userSettings = toLikesFmSettings(changes[this.id].newValue);
      }
    });

    return this;
  }

  private async scheduleNextRun(nextDelay: number): Promise<void> {
    await waitFor(nextDelay);
    await this.run();
  }

  public async run(): Promise<void> {
    if (this.hasProcessingTask) {
      return;
    }

    this.hasProcessingTask = true;
    try {
      const now = Date.now();
      this.safetyState = applyHourlyReset(this.safetyState, now);

      if (isPausedBySafety(this.safetyState, this.safetyPolicy, now)) {
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

      this.currentTask = getNextTask(this.taskOrder, this.currentTask, this.userSettings);
      this.lastTaskResult = await processTask(this.id, this.currentTask);
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
      await persistSafetyState(this.safetyState);
      await syncSafetyStatusForPopup(this.safetyState, this.safetyPolicy, Date.now());
      const nextDelay = this.lastTaskResult === "retryable_fail"
        ? getRandomDelay(15000, 22000)
        : getRandomDelay(8000, 14000);
      void this.scheduleNextRun(nextDelay);
    }
  }
}
