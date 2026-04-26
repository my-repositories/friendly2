import type { AutomationEvent, AutomationEventType } from "src/history";

export function statusBadgeClass(status: AutomationEvent["status"]): string {
  if (status === "success") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/20";
  if (status === "error") return "bg-rose-500/20 text-rose-300 border-rose-500/20";
  return "bg-amber-500/20 text-amber-300 border-amber-500/20";
}

export function eventTypeBadgeClass(eventType: AutomationEventType): string {
  if (eventType === "info") return "bg-cyan-500/20 text-cyan-300 border-cyan-500/20";
  if (eventType === "warn") return "bg-amber-500/20 text-amber-300 border-amber-500/20";
  if (eventType === "error") return "bg-rose-500/20 text-rose-300 border-rose-500/20";
  return "bg-violet-500/20 text-violet-300 border-violet-500/20";
}
