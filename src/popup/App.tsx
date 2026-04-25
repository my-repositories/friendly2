import React, { useState, useEffect } from "react";
import { AppFooter } from "src/popup/AppFooter";
import { AppHeader } from "src/popup/AppHeader";
import { AppSiteItem } from "src/popup/AppSiteItem";
import { SUPPORTED_SERVICES } from "src/config";

export function App() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["extensionEnabled"], (res) => {
      if (res.extensionEnabled !== undefined) {
        setIsActive(res.extensionEnabled);
      }
    });
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
    <div className="w-72 bg-[#0f111a] text-slate-200 overflow-hidden font-sans border border-white/5 shadow-2xl">
      <AppHeader 
        isActive={isActive} 
        onToggle={toggleExtension} 
        onOpenOptions={openOptions} 
      />
      <div className="p-4 pt-5 space-y-3">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-1">Доступные сервисы</p>
        {SUPPORTED_SERVICES.map((service) => (
          <AppSiteItem 
            key={service.id}
            name={service.name}
            iconUrl={service.icon}
            onClick={() => handleNavigate(service.url, service.pattern)}
          />
        ))}
      </div>
      <AppFooter />
    </div>
  );
}