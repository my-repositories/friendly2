import React from "react";
import { Heart } from "lucide-react";

export function AppFooter() {
  return (
      <div className="py-3 bg-[#0a0c14] flex flex-col items-center gap-1 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-[1.5px]">
          made with <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" /> for friendly2
        </div>
        <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">
          v2.1.0 • stable
        </span>
      </div>
  );
}