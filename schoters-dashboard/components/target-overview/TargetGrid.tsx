"use client";

import TargetGridCard, { type TargetGridItem } from "./TargetGridCard";

interface TargetGridProps {
  items: TargetGridItem[];
  emptyLabel: string;
}

export default function TargetGrid({ items, emptyLabel }: TargetGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <TargetGridCard key={item.id} item={item} />
      ))}
    </div>
  );
}