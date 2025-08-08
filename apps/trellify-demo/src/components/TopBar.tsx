import React from "react";

export function TopBar(): JSX.Element
{
  return (
    <div className="glass elevate sticky top-0 z-20 flex items-center justify-between px-5 py-3 rounded-b-xl border-b">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/90 flex items-center justify-center text-white font-semibold">T</div>
        <div>
          <div className="font-semibold text-slate-900 leading-tight">Trellify</div>
          <div className="text-xs text-slate-500 -mt-0.5">Voice Tour Demo</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" id="filters" className="px-3 py-1.5 text-sm rounded-lg bg-white/70 hover:bg-white text-slate-700 border">
          Filters
        </button>
        <button type="button" id="board-settings" className="px-3 py-1.5 text-sm rounded-lg bg-white/70 hover:bg-white text-slate-700 border">
          Board Settings
        </button>
      </div>
    </div>
  );
} 