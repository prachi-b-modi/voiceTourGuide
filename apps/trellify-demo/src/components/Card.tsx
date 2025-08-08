import React from "react";

export function Card({ title }: { title: string }): JSX.Element
{
  return (
    <div className="p-2 bg-white rounded-lg shadow-sm border text-sm hover:shadow transition-shadow">{title}</div>
  );
} 