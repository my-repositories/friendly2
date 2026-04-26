import type { LikesFmSettings } from "src/sites/likes_fm/types";
import { LIKES_FM_TASKS } from "src/tasks";

export const EMPTY_LIKES_FM_SETTINGS: LikesFmSettings = {
  [LIKES_FM_TASKS.REPOST]: false,
  [LIKES_FM_TASKS.LIKE]: false,
  [LIKES_FM_TASKS.SUB]: false,
  [LIKES_FM_TASKS.GROUP]: false,
  [LIKES_FM_TASKS.COMMENT]: false,
  [LIKES_FM_TASKS.POLL]: false,
};

export function toLikesFmSettings(input: unknown): LikesFmSettings {
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
