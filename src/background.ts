import { createDefaultSettings } from "src/settings";

chrome.storage.session.setAccessLevel({ 
  accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' 
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== chrome.runtime.OnInstalledReason.INSTALL) return;

  await chrome.storage.local.set(createDefaultSettings());

  console.log("friendly2: Настройки успешно инициализированы при установке.");

  chrome.tabs.create({
    url: 'options/index.html',
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "close_current_tab" && sender.tab?.id) {
    chrome.tabs.remove(sender.tab.id);
  }
});
