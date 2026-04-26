export type SafetyPolicy = {
  maxActionsPerHour: number;
  pauseAfterConsecutiveErrors: number;
  pauseDurationMs: number;
};

export type SafetyState = {
  actionsThisHour: number;
  consecutiveErrors: number;
  pausedUntil?: number;
  bucketStartedAt: number;
};

export function createInitialSafetyState(now = Date.now()): SafetyState {
  return {
    actionsThisHour: 0,
    consecutiveErrors: 0,
    bucketStartedAt: now,
  };
}

export function normalizeSafetyState(input: unknown, now = Date.now()): SafetyState {
  const source = (typeof input === "object" && input !== null ? input : {}) as Partial<SafetyState>;
  return {
    actionsThisHour: typeof source.actionsThisHour === "number" ? source.actionsThisHour : 0,
    consecutiveErrors: typeof source.consecutiveErrors === "number" ? source.consecutiveErrors : 0,
    pausedUntil: typeof source.pausedUntil === "number" ? source.pausedUntil : undefined,
    bucketStartedAt: typeof source.bucketStartedAt === "number" ? source.bucketStartedAt : now,
  };
}

export function applyHourlyReset(state: SafetyState, now = Date.now()): SafetyState {
  if (now - state.bucketStartedAt < 60 * 60 * 1000) {
    return state;
  }

  return {
    ...state,
    actionsThisHour: 0,
    bucketStartedAt: now,
  };
}

export function isSafetyPaused(state: SafetyState, policy: SafetyPolicy, now = Date.now()): boolean {
  if (state.pausedUntil && now < state.pausedUntil) return true;
  if (state.actionsThisHour >= policy.maxActionsPerHour) return true;
  return false;
}
