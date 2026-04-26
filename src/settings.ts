import { SERVICES } from "src/config.data";
import type { ExtensionSettings, ServiceSettings } from "src/types/services";

export function createDefaultSettings(): ExtensionSettings {
  const settings: ExtensionSettings = {
    extensionEnabled: true,
  };

  for (const service of SERVICES) {
    const serviceDefaults: ServiceSettings = {};

    for (const module of service.modules) {
      serviceDefaults[module.id] = module.default;
    }

    settings[service.id] = serviceDefaults;
  }

  return settings;
}
