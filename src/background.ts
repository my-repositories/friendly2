import {  defaultLikesFmSettings, likes_fmSettingsKey } from "src/options/likes_fmSettings";
import { defaultHabrCareerSettings, habr_careerSettingsKey } from "src/options/habr_careerSettings";
import { defaultGithubSettings, githubSettingsKey } from "src/options/githubSettings";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await chrome.storage.local.set({
      extensionEnabled: false,
      [likes_fmSettingsKey]: defaultLikesFmSettings,
      [habr_careerSettingsKey]: defaultHabrCareerSettings,
      [githubSettingsKey]: defaultGithubSettings,
    });

    console.log("friendly2: Настройки успешно инициализированы при установке.");

    chrome.tabs.create({
      url: 'options/index.html',
    });
  }
});

