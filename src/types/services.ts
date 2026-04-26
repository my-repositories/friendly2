export type ModuleConfig = {
  id: string;
  name: string;
  title: string;
  default: boolean;
};

export type ServiceConfig = {
  id: string;
  name: string;
  url: string;
  pattern: string;
  icon: string;
  modules: readonly ModuleConfig[];
};

export type ServiceSettings = Record<string, boolean>;

export type ExtensionSettings = {
  extensionEnabled: boolean;
  [serviceId: string]: ServiceSettings | boolean;
};
