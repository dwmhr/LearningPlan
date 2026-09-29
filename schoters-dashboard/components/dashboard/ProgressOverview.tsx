import Link from "next/link";
import { LucideIcon, Target, GraduationCap, ShieldCheck, BookMarked, TrendingUp, ChevronRight } from "lucide-react";
import { ProgressStat } from "@/lib/types";

interface StatStyle {
  icon: LucideIcon;
  bg: string;
  iconColor: string;
  bar: string;
  ring: string;
}

// Single source of truth for icon + color per stat id.
// Backend/data layer only needs to send `id` — visual styling stays here in the UI.
const STAT_STYLE_MAP: Record<string, StatStyle> = {
  overall: { icon: Target, bg: "bg-blue-50", iconColor: "text-blue-600", bar: "bg-blue-600", ring: "#2563EB" },
  ielts: { icon: GraduationCap, bg: "bg-purple-50", iconColor: "text-purple-600", bar: "bg-purple-600", ring: "#9333EA" },
  sat: { icon: BookMarked, bg: "bg-orange-50", iconColor: "text-orange-500", bar: "bg-orange-500", ring: "#F97316" },
  document: { icon: ShieldCheck, bg: "bg-emerald-50", iconColor: "text-emerald-600", bar: "bg-emerald-600", ring: "#059669" },
};

// Maps each stat id to the page it should link to (mirrors Sidebar's routes)
const DETAIL_HREF_MAP: Record<string, string> = {
  ielts: "/ielts",
  sat: "/sat",
  document: "/documents",
};

// Motivational subtitle copy, per stat id, bucketed by progress value.
// Fully FE-driven — backend only needs to send `id` + `value`, no `subtitle` needed.
// Thresholds: low (<30), mid (30–69), high (>=70). Falls back to a generic
// message if `id` isn't recognized (mirrors STAT_STYLE_MAP's fallback behavior).
const SUBTITLE_COPY: Record<string, { low: string; mid: string; high: string }> = {
  overall: {
    low: "Let's get started, you got this!",
    mid: "You're making good progress!",
    high: "Almost there, keep it up!",
  },
  ielts: {
    low: "Time to start practicing!",
    mid: "Keep practicing!",
    high: "Great score, almost ready!",
  },
  sat: {
    low: "Let's build your foundation!",
    mid: "Keep it going!",
    high: "You're nearly SAT-ready!",
  },
  document: {
    low: "Let's get your documents sorted!",
    mid: "Almost there!",
    high: "Just a few documents left!",
  },
};

const DEFAULT_SUBTITLE_COPY = {
  low: "Let's get started!",
  mid: "You're making good progress!",
  high: "Almost there!",
};

function getSubtitle(id: string, value: number): string {
  const copy = SUBTITLE_COPY[id] ?? DEFAULT_SUBTITLE_COPY;
  if (value >= 70) return copy.high;
  if (value >= 30) return copy.mid;
  return copy.low;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function ProgressOverview({
  stats,
  updatedAt,
}: {
  stats: ProgressStat[];
  updatedAt: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">Your Progress Overview</h2>
        <span className="shrink-0 text-xs text-slate-400">Last Update {formatDate(updatedAt)}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          // Fallback ke style "overall" kalau backend kirim id yang belum ada di map,
          // biar gak crash pas ada kategori baru yang belum di-styling di FE.
          const style = STAT_STYLE_MAP[stat.id] ?? STAT_STYLE_MAP.overall;
          const Icon = style.icon;
          const isOverall = stat.id === "overall";
          const subtitle = getSubtitle(stat.id, stat.value);

          // "Overall Progress" gets a circular donut ring instead of a bar
          if (isOverall) {
            const radius = 38;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (stat.value / 100) * circumference;

            return (
              <div
                key={stat.id}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-md"
              >
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-24 w-24 -rotate-90" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      fill="none"
                      stroke={style.ring}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-slate-800">{stat.value}%</span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                  {stat.monthlyDelta !== undefined && (
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                      <TrendingUp className="h-3 w-3" />
                      {stat.monthlyDelta}% this month
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // Other stats: icon + label + percentage, bar, then subtitle + "View details"
          const detailHref = DETAIL_HREF_MAP[stat.id];

          return (
            <div
              key={stat.id}
              className="flex flex-col rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.bg}`}>
                    <Icon className={`h-5 w-5 ${style.iconColor}`} />
                  </div>
                  <p className="truncate text-sm font-semibold text-slate-800">{stat.label}</p>
                </div>
                <span className="shrink-0 text-base font-bold text-slate-900">{stat.value}%</span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${style.bar} transition-all duration-700`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">{subtitle}</span>
                {detailHref ? (
                  <Link
                    href={detailHref}
                    className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View details
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View details
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}