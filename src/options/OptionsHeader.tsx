import React from "react";

export function OptionsHeader() {
  return (
    <div className="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] p-8 pb-14 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 text-white/60 relative z-10">
        <span className="text-[10px] font-black tracking-[3px] uppercase">friendly2</span>
        <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full border border-white/10">v2.1.2</span>
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight relative z-10">Настройки</h1>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}
