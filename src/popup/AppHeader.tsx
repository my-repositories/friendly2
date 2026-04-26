import React from "react";
import { Zap, Power, Settings } from "lucide-react";

interface StatusHeaderProps {
  isActive: boolean;
  isSafetyPaused: boolean;
  onToggle: () => void;
  onOpenOptions: () => void;
}

export function AppHeader({ isActive, isSafetyPaused, onToggle, onOpenOptions }: StatusHeaderProps) {
  const isRunning = isActive && !isSafetyPaused;
  return (
    <div className={`p-5 pb-6 relative transition-colors duration-500 ${
      isRunning ? 'bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9]' : 'bg-slate-800'
    }`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className={`${isActive ? 'text-white fill-white' : 'text-slate-400'}`} />
            <h1 className="text-lg font-bold tracking-tight text-white">friendly 2</h1>
          </div>
          
          <div className="flex items-center gap-1.5 ml-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]' : isSafetyPaused ? 'bg-amber-400' : 'bg-rose-400'
            }`}></div>
            <span className={`text-[9px] font-black uppercase tracking-[1px] ${
              isRunning ? 'text-emerald-300/90' : isSafetyPaused ? 'text-amber-300/90' : 'text-rose-300/90'
            }`}>
              {isSafetyPaused ? 'Пауза безопасности' : isActive ? 'Система активна' : 'Система отключена'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={onToggle}
            className={`p-2 rounded-xl transition-all active:scale-90 border border-white/10 ${
              isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-700 text-slate-400'
            }`}
            title={isActive ? "Выключить" : "Включить"}
          >
            <Power size={16} />
          </button>
          <button 
            onClick={onOpenOptions} 
            className="p-2 hover:bg-white/10 rounded-xl text-white/80 transition-colors"
            title="Настройки"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
    </div>
  );
}
