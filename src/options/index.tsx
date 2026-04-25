import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Settings2, UserCheck 
} from "lucide-react";
import {
  defaultLikesFmSettings, likes_fmSettingsKey, LikesFmOptions, type LikesFmSettings
} from "src/options/likes_fmSettings";
import {
  defaulthabrCareerSettings, habr_careerSettingsKey, habrCareerOptions, type habrCareerSettings
} from "src/options/habr_careerSettings";
import { SUPPORTED_SERVICES } from "src/config";

const OptionsPage = () => {
  const [likesFmSettings, updateLikesFmSettings] = useState<LikesFmSettings>(defaultLikesFmSettings);
  const [habrSettings, updateHabrSettings] = useState<habrCareerSettings>(defaulthabrCareerSettings);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    {
      title: "Likes.FM",
      key: likes_fmSettingsKey,
      icon: SUPPORTED_SERVICES.find(x => x.id === 'likesfm')?.icon,
      state: likesFmSettings,
      update: updateLikesFmSettings,
      options: [
        { id: LikesFmOptions.REPOSTS, icon: <Repeat2 size={18} className="text-blue-400" /> },
        { id: LikesFmOptions.LIKES, icon: <Heart size={18} className="text-pink-500" /> },
        { id: LikesFmOptions.SUBSCRIBERS, icon: <UserPlus size={18} className="text-purple-400" /> },
        { id: LikesFmOptions.MEMBERS, icon: <Users size={18} className="text-indigo-400" /> },
        { id: LikesFmOptions.COMMENTS, icon: <MessageSquare size={18} className="text-slate-400" /> },
        { id: LikesFmOptions.VOTINGS, icon: <BarChart3 size={18} className="text-emerald-400" /> },
      ]
    },
    {
      title: "Habr Career",
      key: habr_careerSettingsKey,
      icon: SUPPORTED_SERVICES.find(x => x.id === 'habrcareer')?.icon,
      state: habrSettings,
      update: updateHabrSettings,
      options: [
        { id: habrCareerOptions.FRIENDS, icon: <UserCheck size={18} className="text-orange-400" /> },
      ]
    }
  ];

  useEffect(() => {
    const keys = [likes_fmSettingsKey, habr_careerSettingsKey];
    chrome.storage.local.get(keys, (result) => {
      if (result[likes_fmSettingsKey]) updateLikesFmSettings(result[likes_fmSettingsKey]);
      if (result[habr_careerSettingsKey]) updateHabrSettings(result[habr_careerSettingsKey]);
    });

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleOption = (sectionKey: string, optionId: string) => {
    const section = sections.find(s => s.key === sectionKey);
    if (!section) return;

    const newSettings = {
      ...section.state,
      [optionId]: !section.state[optionId as keyof typeof section.state]
    };

    section.update(newSettings as any);
    chrome.storage.local.set({ [sectionKey]: newSettings });
  };

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
            {sections.map((section, i) => (
              <button
                key={section.key}
                onClick={() => setActiveTab(i)}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === i 
                    ? 'bg-[#242938] text-white shadow-lg border border-white/10' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <img 
                  src={section.icon} 
                  alt="" 
                  className={`w-4 h-4 object-contain transition-all ${activeTab === i ? 'grayscale-0 scale-110' : 'grayscale opacity-50'}`} 
                />
                <span className="text-[11px] font-bold uppercase tracking-wider">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" 
              style={{ transform: `translateX(-${activeTab * 100}%)` }}
            >
              {sections.map((section, sIndex) => (
                <div key={section.key} className="w-full flex-shrink-0 px-1">
                  <div className="flex items-center gap-2 mb-6 text-slate-500 ml-1">
                    <Settings2 size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-[2px]">Модули сервиса</p>
                  </div>
                  
                  <div className="space-y-2.5 min-h-[340px]">
                    {section.options.map((opt) => {
                      const isActive = (section.state as any)[opt.id];
                      return (
                        <div 
                          key={opt.id}
                          onClick={() => toggleOption(section.key, opt.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                            isActive ? 'bg-[#242938] border-indigo-500/20 shadow-lg' : 'bg-[#1e2230] border-transparent hover:border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 bg-slate-800/40'}`}>
                                {opt.icon}
                            </div>
                            <span className="font-semibold text-slate-200 text-[14px]">{opt.id}</span>
                          </div>
                          
                          {/* Toggle */}
                          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-[#33394d]'}`}>
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
