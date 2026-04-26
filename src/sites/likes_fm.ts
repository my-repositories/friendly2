import { LikesFmApp } from "src/sites/likes_fm/app";
import { startSiteAutomation } from "src/sites/runner";
window.onload = () =>
  startSiteAutomation({
    serviceId: "likesfm",
    run: async () => {
      const app = await new LikesFmApp().init();
      await app.run();
    },
  });
