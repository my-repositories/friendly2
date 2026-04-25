import { habr_careerSettingsKey, habrCareerOptions } from "src/options/habr_careerSettings";

window.onload = async () => {
  console.log('as');
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  if (!extensionEnabled) return;

  const settings = await chrome.storage.local.get([habr_careerSettingsKey]);
  const userSettings = settings[habr_careerSettingsKey];
  if (userSettings[habrCareerOptions.FRIENDS]) {
    console.log("Модуль Friends на Habr активирован");
  }
;}