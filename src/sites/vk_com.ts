import { startSiteAutomation } from "src/sites/runner";
import { runVkRuntime } from "src/sites/vk/runtime";
import { waitFor } from "src/utils";

window.onload = () =>
  startSiteAutomation({
    serviceId: "likesfm",
    run: async () => {
      await waitFor(3000);
      await runVkRuntime();
    },
  });
