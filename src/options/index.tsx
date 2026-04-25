import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { 
  Repeat2, Heart, UserPlus, Users, MessageSquare, BarChart3, Settings2 
} from "lucide-react";

const OptionsPage = () => {
  const [enabledOptions, setEnabledOptions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);

    const animationFrame = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const options = [
    { id: "reposts", label: "Reposts", icon: <Repeat2 size={18} className="text-blue-400" /> },
    { id: "likes", label: "Likes", icon: <Heart size={18} className="text-pink-500" /> },
    { id: "subscribers", label: "Subscribers", icon: <UserPlus size={18} className="text-purple-400" /> },
    { id: "members", label: "Members", icon: <Users size={18} className="text-indigo-400" /> },
    { id: "comments", label: "Comments", icon: <MessageSquare size={18} className="text-slate-400" /> },
    { id: "votings", label: "Votings", icon: <BarChart3 size={18} className="text-emerald-400" /> },
  ];

  const toggleOption = (id: string) => {
    setEnabledOptions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 font-sans">
      <div 
        className={`w-[380px] bg-[#1a1d29] rounded-[32px] shadow-2xl border border-white/5 overflow-hidden transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-8 pb-10 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black tracking-[3px] text-white/60 uppercase">friendly2</span>
            <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full text-white/80 border border-white/10">v2.0</span>
          </div>
          <h1 className={`text-3xl font-bold text-white tracking-tight transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}>
            Likes.FM
          </h1>
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 -mt-6 bg-[#1a1d29] rounded-t-[30px] relative">
          <div className="flex items-center gap-2 mb-6 px-1">
            <Settings2 size={14} className="text-slate-500" />
            <p className="text-[#4e5569] text-[11px] font-bold uppercase tracking-widest">Настройка модулей</p>
          </div>
          
          <div className="space-y-2.5">
            {options.map((opt, index) => (
              <div 
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                style={{ 
                  transitionDelay: `${(index + 1) * 100}ms`, // Эффект лесенки
                }}
                className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transform transition-all duration-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${
                  enabledOptions.includes(opt.id) 
                    ? 'bg-[#242938] border-white/10 shadow-lg active:scale-95' 
                    : 'bg-[#1e2230] border-transparent hover:border-white/5 active:scale-95'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${enabledOptions.includes(opt.id) ? 'bg-white/5' : 'bg-transparent'}`}>
                    {opt.icon}
                  </div>
                  <span className="font-semibold text-slate-200 text-[15px]">{opt.label}</span>
                </div>
                
                {/* Switch */}
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabledOptions.includes(opt.id) ? 'bg-indigo-500' : 'bg-[#33394d]'}`}>
                  <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${enabledOptions.includes(opt.id) ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>

          <button className={`w-full mt-8 py-4 bg-[#5d5fef] hover:bg-[#4a4ce0] text-white rounded-2xl font-bold text-[13px] uppercase tracking-wider transition-all duration-700 delay-700 shadow-[0_8px_20px_-6px_rgba(93,95,239,0.5)] active:scale-[0.98] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Применить изменения
          </button>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<OptionsPage />);
}
