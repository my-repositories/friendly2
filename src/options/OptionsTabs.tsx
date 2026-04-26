import React from "react";
import { SUPPORTED_SERVICES } from "src/config";

type OptionsTabsProps = {
  activeTab: number;
  onSelectTab: (tabIndex: number) => void;
  historyCount: number;
};

export function OptionsTabs({ activeTab, onSelectTab, historyCount }: OptionsTabsProps) {
  return (
    <div className="flex bg-[#0f111a]/50 p-1.5 rounded-2xl mb-8 border border-white/5">
      {SUPPORTED_SERVICES.map((section, i) => (
        <button
          key={section.id}
          onClick={() => onSelectTab(i)}
          className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 ${
            activeTab === i
              ? "bg-[#242938] text-white shadow-lg border border-white/10"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <img
            src={section.icon}
            alt={section.name}
            className={`w-4 h-4 object-contain transition-all ${activeTab === i ? "grayscale-0 scale-110" : "grayscale opacity-50"}`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider">{section.name}</span>
        </button>
      ))}
      <button
        key="history"
        onClick={() => onSelectTab(SUPPORTED_SERVICES.length)}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
          activeTab === SUPPORTED_SERVICES.length
            ? "bg-[#242938] text-white shadow-lg border border-white/10"
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider">History</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10">
          {historyCount}
        </span>
      </button>
    </div>
  );
}
