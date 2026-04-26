import type { ServiceSettings } from "src/types/services";

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
    console.error(`[friendly2:${adapter.serviceId}] Ошибка выполнения автоматизации:`, error);
  }
}
