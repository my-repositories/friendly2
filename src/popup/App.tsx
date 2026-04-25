import React, { useState, useEffect } from "react";
import { AppFooter } from "src/popup/AppFooter";
import { AppHeader } from "src/popup/AppHeader";
import { AppSiteItem } from "src/popup/AppSiteItem";
import { SUPPORTED_SERVICES } from "src/config";

export function App() {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["extensionEnabled"], (res) => {
      if (res.extensionEnabled !== undefined) {
        setIsActive(res.extensionEnabled);
      }
    });

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsVisible(true), 40);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleExtension = async () => {
    const newState = !isActive;
    setIsActive(newState);
    await chrome.storage.local.set({ extensionEnabled: newState });

    const allPatterns = SUPPORTED_SERVICES.map(s => s.pattern);
    const tabs = await chrome.tabs.query({ url: allPatterns });
    tabs.forEach(tab => tab.id && chrome.tabs.reload(tab.id));
  };

  const handleNavigate = (url: string, searchPattern: string) => {
    chrome.tabs.query({ url: searchPattern }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id!, { active: true });
        chrome.windows.update(tabs[0].windowId, { focused: true });
      } else {
        chrome.tabs.create({ url });
      }
      window.close();
    });
  };

  const openOptions = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  };

  return (
    <div className="w-72 bg-[#0f111a] text-slate-200 overflow-hidden font-sans border border-white/5 shadow-2xl transition-opacity duration-500">
      <AppHeader 
        isActive={isActive} 
        onToggle={toggleExtension} 
        onOpenOptions={openOptions} 
      />
      
      <div className="p-4 pt-5 space-y-3">
        <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
        }`}>
          Доступные сервисы
        </p>

        {SUPPORTED_SERVICES.map((service, index) => (
          <div
            key={service.id}
            style={{ 
              transitionDelay: `${(index + 1) * 80}ms`,
            }}
            className={`transition-all duration-500 transform ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <AppSiteItem 
              name={service.name}
              iconUrl={service.icon}
              onClick={() => handleNavigate(service.url, service.pattern)}
            />
          </div>
        ))}
      </div>

      <div className={`transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <AppFooter />
      </div>
    </div>
  );
}
