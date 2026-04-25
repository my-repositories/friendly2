window.onload = async () => {
  const githubSettingsKey = "github";
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  if (!extensionEnabled) return;

  const settings = await chrome.storage.local.get([githubSettingsKey]);
  const userSettings = settings[githubSettingsKey];

  if (userSettings.Followers) {
    console.log("Модуль FOLLOWERS на Github активирован");
  }
;}