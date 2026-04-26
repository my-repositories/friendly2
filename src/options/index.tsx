import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SUPPORTED_SERVICES } from "src/config";
import type { ServiceSettings } from "src/types/services";

type AllSettings = Record<string, ServiceSettings>;

const OptionsPage = () => {
  const [allSettings, setAllSettings] = useState<AllSettings>({});
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const keys = SUPPORTED_SERVICES.map(s => s.id);
    chrome.storage.local.get(keys, (res) => setAllSettings(res as AllSettings));

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleOption = (serviceId: string, moduleId: string) => {
    setAllSettings((prev) => {
      const currentServiceSettings = prev[serviceId] ?? {};
      const newSettings: ServiceSettings = {
        ...currentServiceSettings,
        [moduleId]: !currentServiceSettings[moduleId],
      };
      chrome.storage.local.set({ [serviceId]: newSettings });
      return { ...prev, [serviceId]: newSettings };
    });
  };

  const currentService = SUPPORTED_SERVICES[activeTab];

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 font-sans">
      <div className={`w-[420px] bg-[#1a1d29] rounded-[40px] shadow-2xl border border-white/5 overflow-hidden transition-all duration-700 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-8 pb-14 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2 text-white/60 relative z-10">
            <span className="text-[10px] font-black tracking-[3px] uppercase">friendly2</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full border border-white/10">v2.1.0</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight relative z-10">Настройки</h1>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 -mt-10 bg-[#1a1d29] rounded-t-[40px] relative">
          
          {/* Tabs with Icons */}
          <div className="flex bg-[#0f111a]/50 p-1.5 rounded-2xl mb-8 border border-white/5">
            {SUPPORTED_SERVICES.map((section, i) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === i 
                    ? 'bg-[#242938] text-white shadow-lg border border-white/10' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <img 
                  src={section.icon} 
                  alt={section.name} 
                  className={`w-4 h-4 object-contain transition-all ${activeTab === i ? 'grayscale-0 scale-110' : 'grayscale opacity-50'}`} 
                />
                <span className="text-[11px] font-bold uppercase tracking-wider">{section.name}</span>
              </button>
            ))}
          </div>

          <div className="px-8 pb-10 min-h-[350px]">
          <div className="space-y-3">
            {currentService.modules.map((mod) => {
              const isActive = allSettings[currentService.id]?.[mod.id];

              return (
                <div key={mod.id} onClick={() => toggleOption(currentService.id, mod.id)} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? 'bg-[#242938] border-indigo-500/20' : 'bg-[#1e2230] border-transparent'}`}>
                  <div className="flex items-center gap-4" title={mod.title}>
                    <mod.renderIcon size={18} />
                    <span className="font-semibold text-slate-200 text-sm">{mod.name}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? 'bg-indigo-500' : 'bg-[#33394d]'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all transform ${isActive ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Настройки сохраняются автоматически
              </span>
            </div>
            
            <button 
              onClick={() => window.close()}
              className="mt-2 text-[11px] text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors"
            >
              Закрыть настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<OptionsPage />);
}
