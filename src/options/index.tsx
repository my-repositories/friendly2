import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { SUPPORTED_SERVICES } from "src/config";
import { AUTOMATION_HISTORY_KEY, clearAutomationHistory, type AutomationEvent } from "src/history";
import { OptionsFooter } from "src/options/OptionsFooter";
import { OptionsHeader } from "src/options/OptionsHeader";
import { OptionsHistoryPanel } from "src/options/OptionsHistoryPanel";
import { OptionsModulesList } from "src/options/OptionsModulesList";
import { OptionsTabs } from "src/options/OptionsTabs";
import type { ServiceSettings } from "src/types/services";

type AllSettings = Record<string, ServiceSettings>;
const SAVE_DEBOUNCE_MS = 2500;

const OptionsPage = () => {
  const [allSettings, setAllSettings] = useState<AllSettings>({});
  const [historyEvents, setHistoryEvents] = useState<AutomationEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const saveTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const keys = SUPPORTED_SERVICES.map(s => s.id);
    chrome.storage.local.get(keys, (res) => setAllSettings(res as AllSettings));
    chrome.storage.local.get([AUTOMATION_HISTORY_KEY], (res) => {
      setHistoryEvents(((res[AUTOMATION_HISTORY_KEY] ?? []) as AutomationEvent[]).slice().reverse());
    });

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    });

    const onStorageChanged: Parameters<typeof chrome.storage.onChanged.addListener>[0] = (changes, areaName) => {
      if (areaName !== "local" || !changes[AUTOMATION_HISTORY_KEY]) {
        return;
      }
      const next = (changes[AUTOMATION_HISTORY_KEY].newValue ?? []) as AutomationEvent[];
      setHistoryEvents(next.slice().reverse());
    };
    chrome.storage.onChanged.addListener(onStorageChanged);

    return () => {
      cancelAnimationFrame(frame);
      chrome.storage.onChanged.removeListener(onStorageChanged);
      for (const timer of Object.values(saveTimersRef.current)) {
        clearTimeout(timer);
      }
      saveTimersRef.current = {};
    };
  }, []);

  const toggleOption = useCallback((serviceId: string, moduleId: string) => {
    setAllSettings((prev) => {
      const currentServiceSettings = prev[serviceId] ?? {};
      const newSettings: ServiceSettings = {
        ...currentServiceSettings,
        [moduleId]: !currentServiceSettings[moduleId],
      };

      const existingTimer = saveTimersRef.current[serviceId];
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      saveTimersRef.current[serviceId] = setTimeout(() => {
        chrome.storage.local.set({ [serviceId]: newSettings });
        delete saveTimersRef.current[serviceId];
      }, SAVE_DEBOUNCE_MS);

      return { ...prev, [serviceId]: newSettings };
    });
  }, []);

  const currentService = useMemo(() => SUPPORTED_SERVICES[activeTab], [activeTab]);
  const handleClearHistory = useCallback(async () => {
    await clearAutomationHistory();
    setHistoryEvents([]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 font-sans">
      <div className={`w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 transition-all duration-700 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
      }`}>
        <div className="bg-[#1a1d29] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden">
          <OptionsHeader />

          <div className="px-6 py-8 -mt-10 bg-[#1a1d29] rounded-t-[40px] relative">
            <OptionsTabs activeTab={activeTab} onSelectTab={setActiveTab} />
            <OptionsModulesList
              currentService={currentService}
              allSettings={allSettings}
              onToggleOption={toggleOption}
            />
            <OptionsFooter />
          </div>
        </div>

        <div className="bg-[#1a1d29] rounded-[28px] shadow-2xl border border-white/5 p-4 lg:max-h-[760px] min-h-[350px]">
          <OptionsHistoryPanel events={historyEvents} onClear={handleClearHistory} />
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<OptionsPage />);
}
