import { startSiteAutomation } from "src/sites/runner";
import { appendHistoryEvent } from "src/history";

window.onload = () =>
  startSiteAutomation({
    serviceId: "github",
    run: async (userSettings) => {
      if (userSettings.Followers) {
        await appendHistoryEvent({
          serviceId: "github",
          moduleId: "Followers",
          status: "success",
          timestamp: Date.now(),
          details: "Модуль FOLLOWERS активирован",
          url: window.location.href,
        });
      }
    },
  });