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
    console.log("GO");
  }
}

window.onload = async () => {
  const runExtension = async () => {
    const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);

    console.warn({extensionEnabled});
    
    if (!extensionEnabled) {
      console.log("friendly2: расширение отключено пользователем.");
      return;
    }

    const app = await new LikesFm().init();
    await app.run();
  };

  runExtension();
  console.log('runExtension();');
};
