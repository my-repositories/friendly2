import { startSiteAutomation } from "src/sites/runner";

window.onload = () =>
  startSiteAutomation({
    serviceId: "habrcareer",
    run: async (userSettings) => {
      if (userSettings.Friends) {
        console.log("Модуль Friends на Habr активирован");
      }
    },
  });