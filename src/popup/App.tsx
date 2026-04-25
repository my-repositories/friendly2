import React, { useState, useEffect } from "react";
import { Settings, ExternalLink, Zap, Power } from "lucide-react";
import { AppFooter } from "src/popup/AppFooter";

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
      {/* Header */}
      <div className={`p-5 pb-6 relative transition-colors duration-500 ${isActive ? 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]' : 'bg-slate-800'}`}>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className={`${isActive ? 'text-white fill-white' : 'text-slate-400'}`} />
              <h1 className="text-lg font-bold tracking-tight text-white">friendly 2</h1>
            </div>
            
            {/* Глобальный статус переехал сюда */}
            <div className="flex items-center gap-1.5 ml-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-rose-400'}`}></div>
              <span className={`text-[9px] font-black uppercase tracking-[1px] ${isActive ? 'text-emerald-300/90' : 'text-rose-300/90'}`}>
                {isActive ? 'Система активна' : 'Система отключена'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={toggleExtension}
              className={`p-2 rounded-xl transition-all active:scale-90 border border-white/10 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-700 text-slate-400'}`}
              title={isActive ? "Выключить" : "Включить"}
            >
              <Power size={16} />
            </button>
            <button onClick={openOptions} className="p-2 hover:bg-white/10 rounded-xl text-white/80 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
      </div>

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