import { startSiteAutomation } from "src/sites/runner";

window.onload = () =>
  startSiteAutomation({
    serviceId: "github",
    run: async (userSettings) => {
      if (userSettings.Followers) {
        console.log("Модуль FOLLOWERS на Github активирован");
      }
    },
  });