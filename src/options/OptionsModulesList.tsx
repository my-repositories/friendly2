import React from "react";
import { OptionModuleItem } from "src/options/OptionModuleItem";
import type { ServiceSettings } from "src/types/services";

type ServiceModule = {
  id: string;
  name: string;
  title: string;
  renderIcon: (props: { size?: number }) => JSX.Element;
};

type CurrentService = {
  id: string;
  modules: ServiceModule[];
};

type OptionsModulesListProps = {
  currentService: CurrentService;
  allSettings: Record<string, ServiceSettings>;
  onToggleOption: (serviceId: string, moduleId: string) => void;
};

export function OptionsModulesList({ currentService, allSettings, onToggleOption }: OptionsModulesListProps) {
  return (
    <div className="px-8 pb-10 min-h-[350px]">
      <div className="space-y-3">
        {currentService.modules.map((mod) => {
          const isActive = allSettings[currentService.id]?.[mod.id] ?? false;

          return (
            <OptionModuleItem
              key={mod.id}
              name={mod.name}
              title={mod.title}
              isActive={isActive}
              renderIcon={mod.renderIcon}
              onToggle={() => onToggleOption(currentService.id, mod.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
