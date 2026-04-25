import {  defaultLikesFmSettings, likes_fmSettingsKey } from "src/options/likes_fmSettings";
import { defaulthabrCareerSettings, habr_careerSettingsKey } from "src/options/habr_careerSettings";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await chrome.storage.local.set({
      extensionEnabled: false,
      [likes_fmSettingsKey]: defaultLikesFmSettings,
      [habr_careerSettingsKey]: defaulthabrCareerSettings
    });

    console.log("friendly2: Настройки успешно инициализированы при установке.");

    chrome.tabs.create({
      url: 'options/index.html',
    });
  }
});

