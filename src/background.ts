import { SERVICES } from "src/config.data";

chrome.storage.session.setAccessLevel({ 
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' 
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const data: any = { extensionEnabled: true };
    SERVICES.forEach(s => {
      data[s.id] = s.modules.reduce((acc, mod) => ({ ...acc, [mod.id]: mod.default }), {});
    });
    await chrome.storage.local.set(data);

    console.log("friendly2: Настройки успешно инициализированы при установке.");

    chrome.tabs.create({
      url: 'options/index.html',
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "close_current_tab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
