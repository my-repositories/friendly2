import {
  defaultLikesFmSettings, likes_fmSettingsKey, LikesFmOptions, type LikesFmSettings
} from "src/options/likes_fmSettings";

class LikesFm
{
  private currentTask?: LikesFmOptions;
  private hasProcessingTask: boolean = false;
  private userSettings: LikesFmSettings = defaultLikesFmSettings;

  private getNextTask(): void {
  }

  public async init(): Promise<LikesFm> {
    const settings = await chrome.storage.local.get([likes_fmSettingsKey]);
    
    this.userSettings = settings[likes_fmSettingsKey];

    chrome.storage.onChanged.addListener((changes, area) => {
      console.log({changes, area});
      if (area === 'local' && changes[likes_fmSettingsKey]) {
        this.userSettings = changes[likes_fmSettingsKey].newValue;
      }
    });

    return this;
  }

  public async run(): Promise<void> {
    
  }
}

window.onload = async () => {
  const app = await new LikesFm().init();
  await app.run();
};
