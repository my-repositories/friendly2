import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Settings2 
} from "lucide-react";
import {
  defaultLikesFmSettings, likes_fmSettingsKey, LikesFmOptions, type LikesFmSettings
} from "src/options/likes_fmSettings";

const OptionsPage = () => {
  const [likesFmSettings, updateLikesFmSettings] = useState<LikesFmSettings>(defaultLikesFmSettings);
  const [isVisible, setIsVisible] = useState(false);

  const options = [
    { id: LikesFmOptions.REPOSTS, icon: <Repeat2 size={18} className="text-blue-400" /> },
    { id: LikesFmOptions.LIKES, icon: <Heart size={18} className="text-pink-500" /> },
    { id: LikesFmOptions.SUBSCRIBERS, icon: <UserPlus size={18} className="text-purple-400" /> },
    { id: LikesFmOptions.MEMBERS, icon: <Users size={18} className="text-indigo-400" /> },
    { id: LikesFmOptions.COMMENTS, icon: <MessageSquare size={18} className="text-slate-400" /> },
    { id: LikesFmOptions.VOTINGS, icon: <BarChart3 size={18} className="text-emerald-400" /> },
  ];

  useEffect(() => {
    chrome.storage.local.get([likes_fmSettingsKey], (result) => {
      if (result[likes_fmSettingsKey]) {
        updateLikesFmSettings(result[likes_fmSettingsKey]);
      }
    });

    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleOption = (id: LikesFmOptions) => {
    const newSettings = {
      ...likesFmSettings,
      [id]: !likesFmSettings[id]
    };

    updateLikesFmSettings(newSettings);
    chrome.storage.local.set({ [likes_fmSettingsKey]: newSettings });
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 font-sans">
      <div className={`w-[380px] bg-[#1a1d29] rounded-[32px] shadow-2xl border border-white/5 overflow-hidden transition-all duration-700 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-8 pb-10 relative">
          <div className="flex justify-between items-center mb-2 text-white/60">
            <span className="text-[10px] font-black tracking-[3px] uppercase">friendly2</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full border border-white/10">v2.0</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Likes.FM</h1>
        </div>

        <div className="px-6 py-8 -mt-6 bg-[#1a1d29] rounded-t-[30px] relative">
          <div className="flex items-center gap-2 mb-6 px-1 text-slate-500">
            <Settings2 size={14} />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#4e5569]">Настройка модулей</p>
          </div>
          
          <div className="space-y-2.5">
            {options.map((opt, index) => {
              const isActive = likesFmSettings[opt.id];
              return (
                <div 
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-500 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  } ${isActive ? 'bg-[#242938] border-white/10 shadow-lg' : 'bg-[#1e2230] border-transparent hover:border-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/5' : 'bg-transparent'}`}>
                      {opt.icon}
                    </div>
                    <span className="font-semibold text-slate-200 text-[15px]">{opt.id}</span>
                  </div>
                  
                  {/* Switch */}
                  <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-[#33394d]'}`}>
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full mt-8 py-4 bg-[#5d5fef] hover:bg-[#4a4ce0] text-white rounded-2xl font-bold text-[13px] uppercase tracking-wider transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20">
            Применить изменения
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
