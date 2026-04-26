import {
  applyHourlyReset,
  isSafetyPaused,
  normalizeSafetyState,
  type SafetyPolicy,
  type SafetyState,
} from "src/safety";

const SAFETY_STATE_KEY = "likesfm_safety_state";
const SAFETY_STATUS_KEY = "likesfm_safety_status";

export async function persistSafetyState(state: SafetyState): Promise<void> {
  await chrome.storage.session.set({ [SAFETY_STATE_KEY]: state });
}

export async function loadSafetyState(now: number): Promise<SafetyState> {
  const stored = await chrome.storage.session.get([SAFETY_STATE_KEY]);
  const normalized = applyHourlyReset(normalizeSafetyState(stored[SAFETY_STATE_KEY], now), now);
  await persistSafetyState(normalized);
  return normalized;
}

export async function syncSafetyStatusForPopup(
  state: SafetyState,
  policy: SafetyPolicy,
  now: number
): Promise<void> {
  await chrome.storage.session.set({
    [SAFETY_STATUS_KEY]: {
      paused: isSafetyPaused(state, policy, now),
      pausedUntil: state.pausedUntil,
      actionsThisHour: state.actionsThisHour,
    },
  });
}

export function isPausedBySafety(state: SafetyState, policy: SafetyPolicy, now: number): boolean {
  return isSafetyPaused(state, policy, now);
}
