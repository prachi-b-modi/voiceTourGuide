import React, { useState } from "react";
import { List } from "./List";

export function Board(): JSX.Element
{
  const [lists, setLists] = useState([
    { title: "To Do", cards: ["Set up project", "Write docs"] },
    { title: "In Progress", cards: ["Build SDK"] },
    { title: "Done", cards: ["Decisions"] }
  ]);

  function addCard(): void
  {
    const title = prompt("New card title?")?.trim();
    if (!title)
    {
      return;
    }
    setLists((prev) =>
    {
      const next = [...prev];
      next[0] = { ...next[0], cards: [title, ...next[0].cards] };
      return next;
    });
  }

  return (
    <div className="px-6 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Your workspace</div>
        <div className="flex items-center gap-2">
          <button id="new-card-btn" onClick={addCard} className="px-3 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
            New Card
          </button>
        </div>
      </div>
      <div className="h-px bg-slate-200/80" />
      <div id="board" className="flex gap-4 overflow-x-auto py-1 pr-2">
        {lists.map((l, i) => (
          <List key={i} title={l.title} cards={l.cards} />
        ))}
        <List key="__add__" title="__ADD__" cards={[]} />
      </div>
    </div>
  );
} 