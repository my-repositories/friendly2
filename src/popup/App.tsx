import React, { useState, useEffect } from "react";
import { Settings, ExternalLink, Zap, Power } from "lucide-react";
import { AppFooter } from "src/popup/AppFooter";
import { AppHeader } from "src/popup/AppHeader";

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
    const tabs = await chrome.tabs.query({ url: "*://*.likes.fm/*" });
    tabs.forEach(tab => tab.id && chrome.tabs.reload(tab.id));
  };

  const navigateToLikesFm = (e: React.MouseEvent) => {
    const url = "https://likes.fm";

    chrome.tabs.query({ url: "*://*.likes.fm/*" }, (tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        chrome.tabs.update(tab.id!, { active: true });
        chrome.windows.update(tab.windowId, { focused: true });
      } else {
        chrome.tabs.create({ url: url });
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
        
        {/* Карточка-кнопка Likes.FM */}
        <button 
          onClick={navigateToLikesFm}
          className="bg-[#1a1d29] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner w-full group hover:bg-[#222635] hover:border-white/10 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
               <img 
                src="https://likes.fm/static/images/durov.ico" 
                alt="L" 
                className="w-full h-full object-contain group-hover:rotate-12 transition-transform"
              />
            </div>
            <span className="text-[15px] font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              Likes.FM
            </span>
          </div>
          <ExternalLink size={14} className="text-slate-500 opacity-40 group-hover:opacity-100 group-hover:text-indigo-400 transition-all" />
        </button>

        {/* Сюда теперь легко добавлять новые кнопки */}
      </div>

        <AppFooter />
    </div>
  );
}