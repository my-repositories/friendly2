import type { ServiceSettings } from "src/types/services";
import { appendHistoryEvent } from "src/history";

type SiteAutomationAdapter = {
  serviceId: string;
  run: (settings: ServiceSettings) => Promise<void> | void;
};

export async function startSiteAutomation(adapter: SiteAutomationAdapter): Promise<void> {
  try {
    const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);

    if (!extensionEnabled) {
      return;
    }

    const storageState = await chrome.storage.local.get([adapter.serviceId]);
    const settings = (storageState[adapter.serviceId] ?? {}) as ServiceSettings;
    await adapter.run(settings);
  } catch (error) {
    await appendHistoryEvent({
      serviceId: adapter.serviceId,
      moduleId: "runner",
      status: "error",
      timestamp: Date.now(),
      details: String(error),
      url: window.location.href,
    });
  }
}
