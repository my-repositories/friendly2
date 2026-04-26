import { startSiteAutomation } from "src/sites/runner";
import { appendHistoryEvent } from "src/history";

window.onload = () =>
  startSiteAutomation({
    serviceId: "habrcareer",
    run: async (userSettings) => {
      if (userSettings.Friends) {
        await appendHistoryEvent({
          serviceId: "habrcareer",
          moduleId: "Friends",
          status: "success",
          timestamp: Date.now(),
          details: "Модуль Friends активирован",
          url: window.location.href,
        });
      }
    },
  });