import React from "react";
import { ExternalLink } from "lucide-react";

interface ServiceCardProps {
  name: string;
  iconUrl: string;
  onClick: () => void;
}

export function AppSiteItem({ name, iconUrl, onClick }: ServiceCardProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#1a1d29] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner w-full group hover:bg-[#222635] hover:border-white/10 transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 flex items-center justify-center">
           <img 
            src={iconUrl} 
            alt={name} 
            className="w-full h-full object-contain group-hover:rotate-12 transition-transform"
          />
        </div>
        <span className="text-[15px] font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
          {name}
        </span>
      </div>
      <ExternalLink size={14} className="text-slate-500 opacity-40 group-hover:opacity-100 group-hover:text-indigo-400 transition-all" />
    </button>
  );
}
