import React from "react";
import { Settings, ExternalLink, Zap, Heart } from "lucide-react";

export function App() {
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
      <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-5 relative">
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-white fill-white" />
            <h1 className="text-lg font-bold tracking-tight text-white">friendly 2</h1>
          </div>
          <button 
            onClick={openOptions}
            className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-90 text-white/80 hover:text-white"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Карточка-кнопка */}
        <button 
          onClick={navigateToLikesFm}
          className="bg-[#1a1d29] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner w-full group hover:bg-[#222635] transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
               <img 
                src="https://likes.fm/static/images/durov.ico" 
                alt="L" 
                className="w-full h-full object-contain group-hover:rotate-12 transition-transform"
              />
            </div>
            <span className="text-[15px] font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-left">
              Likes.FM
            </span>
          </div>
          <ExternalLink size={14} className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Статус */}
        <div className="flex items-center justify-center gap-2 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest text-center">Система активна</span>
        </div>
      </div>

      {/* Footer */}
      <div className="py-3 bg-[#0a0c14] flex flex-col items-center gap-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-[1.5px]">
          made with <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" /> for friendly2
        </div>
        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">
          v2.0 • stable
        </span>
      </div>
    </div>
  );
}
