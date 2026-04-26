import React from "react";

type IconComponent = (props: { size?: number }) => JSX.Element;

type OptionModuleItemProps = {
  name: string;
  title: string;
  isActive: boolean;
  renderIcon: IconComponent;
  onToggle: () => void;
};

export function OptionModuleItem({
  name,
  title,
  isActive,
  renderIcon: RenderIcon,
  onToggle,
}: OptionModuleItemProps) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? "bg-[#242938] border-indigo-500/20" : "bg-[#1e2230] border-transparent"}`}
    >
      <div className="flex items-center gap-4" title={title}>
        <RenderIcon size={18} />
        <span className="font-semibold text-slate-200 text-sm">{name}</span>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? "bg-indigo-500" : "bg-[#33394d]"}`}>
        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all transform ${isActive ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );
}
