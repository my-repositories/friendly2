window.onload = async () => {
  const habr_careerSettingsKey = "habrcareer";
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  if (!extensionEnabled) return;

  const settings = await chrome.storage.local.get([habr_careerSettingsKey]);
  const userSettings = settings[habr_careerSettingsKey];
  if (userSettings.Friends) {
    console.log("Модуль Friends на Habr активирован");
  }
;}