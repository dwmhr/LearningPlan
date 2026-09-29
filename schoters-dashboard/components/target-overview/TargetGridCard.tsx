"use client";

import { Calendar, ChevronRight, type LucideIcon } from "lucide-react";

export interface TargetGridItem {
  id: string;
  name: string;
  subtitle: string;
  deadline: string;
  readiness: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TargetGridCard({ item }: { item: TargetGridItem }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className="group flex flex-col rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${item.iconColor}`} strokeWidth={2} />
        </span>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
      </div>

      <p className="mb-1 truncate text-sm font-bold text-slate-900">{item.name}</p>
      <p className="mb-3 truncate text-xs text-slate-500">{item.subtitle}</p>

      <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
        <span className="font-medium text-slate-700">{formatDeadline(item.deadline)}</span>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400">Readiness</span>

        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700"
            style={{ width: `${item.readiness}%` }}
          />
        </div>

        <span className="text-[11px] font-semibold text-slate-600">{item.readiness}%</span>
      </div>
    </button>
  );
}