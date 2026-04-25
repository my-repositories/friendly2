import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Settings2, Briefcase 
} from "lucide-react";
import {
  defaultLikesFmSettings, likes_fmSettingsKey, LikesFmOptions, type LikesFmSettings
} from "src/options/likes_fmSettings";
import {
  defaulthabrCareerSettings, habr_careerSettingsKey, habrCareerOptions, type habrCareerSettings
} from "src/options/habr_careerSettings";

const OptionsPage = () => {
  const [likesFmSettings, updateLikesFmSettings] = useState<LikesFmSettings>(defaultLikesFmSettings);
  const [habrSettings, updateHabrSettings] = useState<habrCareerSettings>(defaulthabrCareerSettings);
  const [isVisible, setIsVisible] = useState(false);

  // Конфигурация секций для рендеринга
  const sections = [
    {
      title: "Likes.FM",
      key: likes_fmSettingsKey,
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
      state: habrSettings,
      update: updateHabrSettings,
      options: [
        { id: habrCareerOptions.FRIENDS, icon: <Briefcase size={18} className="text-orange-400" /> },
      ]
    }
  ];

  useEffect(() => {
    // Загружаем настройки для всех ключей
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
      <div className={`w-[400px] bg-[#1a1d29] rounded-[32px] shadow-2xl border border-white/5 overflow-hidden transition-all duration-700 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-8 pb-10 relative">
          <div className="flex justify-between items-center mb-2 text-white/60">
            <span className="text-[10px] font-black tracking-[3px] uppercase">friendly2</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full border border-white/10">v2.1.0</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Настройки</h1>
        </div>

        <div className="px-6 py-8 -mt-6 bg-[#1a1d29] rounded-t-[30px] relative max-h-[70vh] overflow-y-auto custom-scrollbar">
          {sections.map((section, sIndex) => (
            <div key={section.key} className={sIndex > 0 ? "mt-8" : ""}>
              <div className="flex items-center gap-2 mb-4 px-1 text-slate-500">
                <Settings2 size={12} />
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#4e5569]">{section.title}</p>
              </div>
              
              <div className="space-y-2.5">
                {section.options.map((opt, oIndex) => {
                  const isActive = (section.state as any)[opt.id];
                  // Глобальный индекс для задержки анимации
                  const globalIndex = sIndex * 3 + oIndex; 

                  return (
                    <div 
                      key={opt.id}
                      onClick={() => toggleOption(section.key, opt.id)}
                      style={{ transitionDelay: `${(globalIndex + 1) * 70}ms` }}
                      className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-500 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      } ${isActive ? 'bg-[#242938] border-white/10 shadow-lg' : 'bg-[#1e2230] border-transparent hover:border-white/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
                          {opt.icon}
                        </div>
                        <span className="font-semibold text-slate-200 text-[14px]">{opt.id}</span>
                      </div>
                      
                      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-[#33394d]'}`}>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button className="w-full mt-10 py-4 bg-[#5d5fef] hover:bg-[#4a4ce0] text-white rounded-2xl font-bold text-[13px] uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20">
            Сохранить всё
          </button>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<OptionsPage />);
}
