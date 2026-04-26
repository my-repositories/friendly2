import { createDefaultSettings } from "src/settings";
import { appendHistoryEvent } from "src/history";

chrome.storage.session.setAccessLevel({ 
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' 
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

  await chrome.storage.local.set(createDefaultSettings());

  await appendHistoryEvent({
    serviceId: "system",
    moduleId: "install",
    status: "success",
    timestamp: Date.now(),
    details: "Настройки успешно инициализированы при установке",
  });

  chrome.tabs.create({
    url: 'options/index.html',
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "close_current_tab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
