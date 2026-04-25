class LikesFm
{
  private id = "likesfm";
  private currentTask: any;
  private hasProcessingTask: boolean = false;
  private userSettings: any;

  private getNextTask(): void {
  }

  public async init(): Promise<LikesFm> {
    const settings = await chrome.storage.local.get([this.id]);
    this.userSettings = settings[this.id];

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes[this.id]) {
        this.userSettings = changes[this.id].newValue;
      }
    });

    return this;
  }

  public async run(): Promise<void> {
    console.log("GO", this.userSettings);
  }
}

window.onload = async () => {
  const { extensionEnabled } = await chrome.storage.local.get(["extensionEnabled"]);
  
  if (!extensionEnabled) {
    console.log("friendly2: расширение отключено пользователем.");
    return;
  }

  const app = await new LikesFm().init();
  await app.run();
};
