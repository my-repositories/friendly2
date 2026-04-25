import { SUPPORTED_SERVICES } from "src/config";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const data: any = { extensionEnabled: false };
    SUPPORTED_SERVICES.forEach(s => {
      data[s.id] = s.modules.reduce((acc, mod) => ({ ...acc, [mod.id]: mod.default }), {});
    });
    await chrome.storage.local.set(data);

    console.log("friendly2: Настройки успешно инициализированы при установке.");

    chrome.tabs.create({
      url: 'options/index.html',
    });
  }
});
