class LikesFm
{
  private hasProcessingTask: boolean = false;
  private userSettings: string[] = [];

  private getNextTask(): void {
  }

  public async run(): Promise<void> {
    const { likes_fm: userSettings } = await chrome.storage.local.get({ likes_fm: [] });
    
    if (!userSettings) return;

    console.log("Активные модули friendly2:", userSettings);

    if (userSettings.includes("likes")) {
      console.log("Модуль Likes активирован");
    }

    if (userSettings.includes("comments")) {
      console.log("Модуль Comments активирован");
    }

    chrome.storage.onChanged.addListener((changes, area) => {
      console.log({changes, area});
      if (area === 'local' && changes.likes_fm) {
        const newSettings = changes.likes_fm.newValue;
        console.log("Настройки обновились на лету:", newSettings);
        
        // Здесь можно включить или выключить функции динамически
      }
    });
  }
}

new LikesFm().run();
