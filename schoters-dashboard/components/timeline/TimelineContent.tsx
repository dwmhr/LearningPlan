"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Flag,
  FileText,
  Globe,
  Lightbulb,
  LucideIcon,
  PenLine,
  Rocket,
  Sparkles,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import {
  journeySubtitle,
  planDuration,
  timelineMonths,
  timelinePhases,
  upcomingItems,
} from "@/lib/timeline-data";

/* ------------------------------------------------------------------ */
/* UI-only visual mappings — icon & accent color are presentation      */
/* concerns, not data, so they live here keyed by phase id instead of  */
/* being stored on the phase/strategy objects themselves.              */
/* ------------------------------------------------------------------ */

type AccentColor = "blue" | "violet" | "emerald" | "orange";

const DEFAULT_ACCENT: AccentColor = "blue";
const DEFAULT_ICON: LucideIcon = Flag;

const PHASE_ICONS: Record<string, LucideIcon> = {
  foundation: Flag,
  "portfolio-building": FileText,
  "ielts-preparation": PenLine,
  "sat-preparation": Globe,
  "university-scholarships": Rocket,
};

const PHASE_ACCENTS: Record<string, AccentColor> = {
  foundation: "blue",
  "portfolio-building": "violet",
  "ielts-preparation": "emerald",
  "sat-preparation": "orange",
  "university-scholarships": "blue",
};

function phaseIcon(id: string): LucideIcon {
  return PHASE_ICONS[id] ?? DEFAULT_ICON;
}

function phaseAccent(id: string): AccentColor {
  return PHASE_ACCENTS[id] ?? DEFAULT_ACCENT;
}

/* ------------------------------------------------------------------ */
/* Accent color tokens                                                  */
/* ------------------------------------------------------------------ */

const ACCENT_STYLES: Record<
  AccentColor,
  { bar: string; softBg: string; text: string; dot: string; rowBg: string; gradient: string; ring: string }
> = {
  blue: {
    bar: "bg-blue-600",
    softBg: "bg-blue-50",
    text: "text-blue-600",
    dot: "bg-blue-600",
    rowBg: "bg-blue-50/60",
    gradient: "from-blue-500 to-sky-500",
    ring: "hover:ring-blue-100",
  },
  violet: {
    bar: "bg-violet-500",
    softBg: "bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-500",
    rowBg: "bg-violet-50/60",
    gradient: "from-violet-500 to-fuchsia-500",
    ring: "hover:ring-violet-100",
  },
  emerald: {
    bar: "bg-emerald-500",
    softBg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    rowBg: "bg-emerald-50/60",
    gradient: "from-emerald-500 to-teal-500",
    ring: "hover:ring-emerald-100",
  },
  orange: {
    bar: "bg-orange-500",
    softBg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-500",
    rowBg: "bg-orange-50/60",
    gradient: "from-orange-500 to-amber-500",
    ring: "hover:ring-orange-100",
  },
};

const TOTAL_MONTHS = timelineMonths.length;

// Group consecutive months by year for the header row, e.g. [{year:2026,span:6},{year:2027,span:7}]
const YEAR_GROUPS = timelineMonths.reduce<{ year: number; span: number }[]>((groups, month) => {
  const last = groups[groups.length - 1];
  if (last && last.year === month.year) {
    last.span += 1;
  } else {
    groups.push({ year: month.year, span: 1 });
  }
  return groups;
}, []);

const gridTemplateColumns = `220px repeat(${TOTAL_MONTHS}, minmax(0, 1fr))`;

// Month indices where a new year starts (used to draw a stronger divider line)
const YEAR_BOUNDARY_INDICES = (() => {
  const boundaries: number[] = [];
  let cursor = 0;
  YEAR_GROUPS.slice(0, -1).forEach((group) => {
    cursor += group.span;
    boundaries.push(cursor);
  });
  return boundaries;
})();

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

interface TimelineContentProps {
  notifications: AppNotification[];
}

export default function TimelineContent({ notifications }: TimelineContentProps) {
  const defaultPhase = timelinePhases.find((phase) => phase.status === "current") ?? timelinePhases[0];
  const [selectedPhaseId, setSelectedPhaseId] = useState(defaultPhase.id);

  const selectedPhase = timelinePhases.find((phase) => phase.id === selectedPhaseId) ?? defaultPhase;
  const selectedIndex = timelinePhases.findIndex((phase) => phase.id === selectedPhase.id);
  const SelectedIcon = phaseIcon(selectedPhase.id);
  const selectedAccent = ACCENT_STYLES[phaseAccent(selectedPhase.id)];

  const nextPhases = upcomingItems.filter((item) => item.id !== selectedPhase.id).slice(0, 3);

  return (
    <div className="flex-1 px-6 py-6 md:px-10 md:py-8">
      {/* Icon + title on the left, notifications + plan selector on the right */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20">
            <CalendarRange className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Preparation Timeline</h1>
            <p className="text-sm text-slate-500">
              Dynamic milestones based on your selected degree pathway.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell notifications={notifications} />

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
          >
            <Calendar className="h-4 w-4" strokeWidth={2} />
            {planDuration}
          </button>
        </div>
      </div>

      {/* Overall preparation schedule (Gantt-style, clickable) */}
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Preparation Timeline</h2>
            <p className="mt-1 text-sm text-slate-500">Click a phase on the timeline to view its schedule and strategic plan.</p>
          </div>
        </div>

        <div className="min-w-[720px] overflow-x-auto">
          <div className="relative">
            {/* Vertical gridlines behind the header + rows */}
            <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns }}>
              <div />
              {timelineMonths.map((_, idx) => (
                <div
                  key={idx}
                  className={
                    YEAR_BOUNDARY_INDICES.includes(idx)
                      ? "border-l border-slate-300"
                      : "border-l border-slate-100"
                  }
                />
              ))}
            </div>

            {/* Year header */}
            <div className="relative grid" style={{ gridTemplateColumns }}>
              <div />
              {YEAR_GROUPS.map((group, idx) => (
                <div
                  key={`${group.year}-${idx}`}
                  className="pb-1 pl-2 text-xs font-semibold text-blue-500"
                  style={{ gridColumn: `span ${group.span} / span ${group.span}` }}
                >
                  {group.year}
                </div>
              ))}
            </div>

            {/* Month header */}
            <div className="relative grid border-b border-slate-200 pb-2" style={{ gridTemplateColumns }}>
              <div />
              {timelineMonths.map((month, idx) => (
                <div key={idx} className="pl-2 text-xs font-medium text-slate-400">
                  {month.label}
                </div>
              ))}
            </div>

            {/* Phase rows */}
            <div className="relative mt-2 flex flex-col gap-1">
              {timelinePhases.map((phase) => {
                const Icon = phaseIcon(phase.id);
                const accent = ACCENT_STYLES[phaseAccent(phase.id)];
                const isSelected = phase.id === selectedPhaseId;

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    className={`grid items-center rounded-xl py-2 text-left transition-colors ${
                      isSelected ? accent.rowBg : "hover:bg-slate-50"
                    }`}
                    style={{ gridTemplateColumns }}
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent.softBg}`}>
                        <Icon className={`h-4 w-4 ${accent.text}`} strokeWidth={2} />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{phase.label}</span>
                    </div>

                    <div
                      className={`flex h-9 items-center justify-center rounded-lg px-2 text-xs font-semibold text-white shadow-sm ${accent.bar}`}
                      style={{ gridColumn: `${phase.startMonthIndex + 2} / span ${phase.durationMonths}` }}
                    >
                      {phase.dateRange}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected phase header */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm mb-6">
        <div className="relative overflow-hidden rounded-t-2xl">
          <span className={`absolute inset-y-0 left-0 w-1.5 ${selectedAccent.bar}`} />

          <div className="p-6 pl-8 md:p-8 md:pl-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm ${selectedAccent.gradient}`}
                >
                  <SelectedIcon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedAccent.dot}`} />
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Selected Phase &middot; {selectedIndex + 1} of {timelinePhases.length}
                    </span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedPhase.label}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedAccent.softBg} ${selectedAccent.text}`}
                >
                  {selectedPhase.meta}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                  {selectedPhase.dateRange}
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">{selectedPhase.description}</p>

            {/* Clickable phase-progress stepper */}
            <div className="mt-6 flex items-center gap-1.5">
              {timelinePhases.map((phase) => {
                const isActive = phase.id === selectedPhase.id;
                const stepAccent = ACCENT_STYLES[phaseAccent(phase.id)];

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setSelectedPhaseId(phase.id)}
                    title={phase.label}
                    className="group flex-1"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-200 ${
                        isActive ? `${stepAccent.bar}` : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>{timelinePhases[0]?.label}</span>
              <span>{timelinePhases[timelinePhases.length - 1]?.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Planning + What's next side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Strategic Planning */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
          <h4 className="text-sm font-bold text-slate-900">Strategic Planning</h4>
          <p className="mt-1 text-xs text-slate-400">Personalized strategies for your success in this phase.</p>

          <div className="mt-5 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm ${selectedAccent.gradient}`}
              >
                <SelectedIcon className="h-5 w-5 text-white" strokeWidth={2} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h5 className="text-sm font-bold text-slate-900">{selectedPhase.label}</h5>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${selectedAccent.softBg} ${selectedAccent.text}`}>
                    {selectedPhase.strategySteps.length} steps
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Key priorities to focus on during this phase.
                </p>

                <ul className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  {selectedPhase.strategySteps.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${selectedAccent.text}`} strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* What's next */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">What&apos;s next?</h3>
          <p className="mt-1 text-xs text-slate-400">Upcoming phases in your journey.</p>

          <ul className="mt-3 divide-y divide-slate-50">
            {nextPhases.map((item) => {
              const Icon = phaseIcon(item.id);
              const accent = ACCENT_STYLES[phaseAccent(item.id)];

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPhaseId(item.id)}
                    className="flex w-full items-center gap-3 py-3 text-left hover:opacity-80"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.softBg}`}>
                      <Icon className={`h-5 w-5 ${accent.text}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.dateRange}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 border-t border-slate-50 pt-3 text-right">
            <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all phases
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}