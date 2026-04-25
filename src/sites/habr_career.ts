import { habr_careerSettingsKey, HabrCareerOptions } from "src/options/habr_careerSettings";

window.onload = async () => {
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  if (!extensionEnabled) return;

  const settings = await chrome.storage.local.get([habr_careerSettingsKey]);
  const userSettings = settings[habr_careerSettingsKey];
  if (userSettings[HabrCareerOptions.FRIENDS]) {
    console.log("Модуль Friends на Habr активирован");
  }
;}