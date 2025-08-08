import React from "react";
import { Card } from "./Card";

export function List({ title, cards }: { title: string; cards: string[] }): JSX.Element
{
  if (title === "__ADD__")
  {
    return (
      <button type="button" className="w-72 shrink-0 glass rounded-xl p-3 border elevate grid place-items-center text-slate-500 hover:text-slate-700 hover:bg-white/70">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border">+</span>
          <span>Add list</span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-72 shrink-0 glass rounded-xl p-3 border elevate">
      <div className="font-medium mb-2 text-slate-800 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs text-slate-400">{cards.length}</span>
      </div>
      <div className="space-y-2">
        {cards.map((c, i) => (
          <Card key={i} title={c} />
        ))}
      </div>
    </div>
  );
} 