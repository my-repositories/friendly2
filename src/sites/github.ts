import { githubSettingsKey, GithubOptions } from "src/options/githubSettings";

window.onload = async () => {
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  if (!extensionEnabled) return;

  const settings = await chrome.storage.local.get([githubSettingsKey]);
  const userSettings = settings[githubSettingsKey];
  if (userSettings[GithubOptions.FOLLOWERS]) {
    console.log("Модуль FOLLOWERS на Github активирован");
  }
;}