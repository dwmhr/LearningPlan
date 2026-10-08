"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Target,
  BookOpen,
  TrendingUp,
  Flag,
  ClipboardList,
  Clock,
  ArrowRight,
  ChevronDown,
  LucideIcon,
  BarChart2,
  Lock,
  GraduationCap,
  ListChecks,
  Check,
  LayoutGrid,
  List as ListIcon,
  Table as TableIcon,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import {
  SatDashboardData,
  SatFocusKey,
  SatJourneyStep,
  SatSyllabus as SatSyllabusData,
  SatSyllabusRow,
  SatSyllabusSection,
} from "@/lib/sat-types";

/* ------------------------------------------------------------------ */
/* Root                                                                  */
/* ------------------------------------------------------------------ */

export default function SatDashboardContent({
  data,
  notifications,
}: {
  data: SatDashboardData;
  notifications: AppNotification[];
}) {
  return (
    // min-w-0 lets this column shrink instead of being pushed wider by the
    // 1000px table; pt-16 on phones leaves room for the sidebar's hamburger button.
    <main className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-8 md:py-6">
      <SatHeader
        packageName={data.overview.packageName}
        hours={data.overview.hours}
        notifications={notifications}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SatHeroStatCard
          icon={Target}
          title="Target Score"
          value={String(data.overview.targetScore)}
          caption="Your goal"
        />
        <SatStatCard
          icon={BookOpen}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          title="Current Session"
          value={data.overview.currentSessionTitle}
          caption={data.overview.currentSessionSubtitle}
          footer={data.overview.currentSessionDurationLabel}
        />
        <SatProgressStatCard
          completed={data.overview.completedSessions}
          total={data.overview.totalSessions}
          percent={data.overview.progressPercent}
        />
        <SatJourneyStatCard
          currentPhaseTitle={data.overview.currentPhaseTitle}
          steps={data.journeySteps}
        />
      </div>

      {/* Focus banner right after stat cards */}
      <SatFocusBanner areas={data.focusAreas} />

      {/* Assessments directly under the focus banner */}
      <div className="mt-6">
        <SatAssessments rows={data.diagnosticRows} targetScore={data.overview.targetScore} />
      </div>

      {/* Syllabus: full width, the table view has 7 columns */}
      <div className="mt-6">
        <SatSyllabus syllabus={data.syllabus} />
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                                */
/* ------------------------------------------------------------------ */

function SatHeader({
  packageName,
  hours,
  notifications,
}: {
  packageName: string;
  hours: number;
  notifications: AppNotification[];
}) {
  return (
    <div>
      {/* Icon + title on the left, button + bell pinned to the top-right */}
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20 sm:h-14 sm:w-14">
            <ClipboardCheck className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">SAT Dashboard</h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              {packageName} · {hours} hours
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {/* Tablet/desktop: button sits to the left of the bell */}
          <button
            type="button"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-sky-600 sm:flex"
          >
            Continue Learning
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>

          <NotificationBell notifications={notifications} />
        </div>
      </div>

      {/* Phones: button moves below the header, full width */}
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-sky-600 sm:hidden"
      >
        Continue Learning
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top stat cards                                                       */
/* ------------------------------------------------------------------ */

function SatHeroStatCard({
  icon: Icon,
  title,
  value,
  caption,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="relative flex h-44 flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 shadow-md shadow-blue-600/20">
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="relative ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div className="relative mt-auto">
        <p className="text-base text-blue-100">{title}</p>
        <p className="mt-1 truncate text-5xl font-bold text-white">{value}</p>
        {caption && <p className="mt-1.5 truncate text-base text-blue-100">{caption}</p>}
      </div>
    </div>
  );
}

function SatStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  valueColor = "text-slate-900",
  caption,
  footer,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  valueColor?: string;
  caption?: string;
  footer?: string;
}) {
  return (
    <div className="flex h-44 flex-col rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className={`ml-auto flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
      </div>
      <div className="mt-auto min-w-0">
        <p className="text-sm text-slate-500">{title}</p>
        <p className={`mt-1 truncate text-2xl font-bold ${valueColor}`} title={value}>
          {value}
        </p>
        {caption && (
          <p className="mt-1 truncate text-sm text-slate-500" title={caption}>
            {caption}
          </p>
        )}
        {footer && (
          <p className="mt-1.5 flex items-center gap-1.5 truncate text-sm text-slate-400">
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">{footer}</span>
          </p>
        )}
      </div>
    </div>
  );
}

function SatProgressStatCard({
  completed,
  total,
  percent,
}: {
  completed: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="flex h-44 flex-col rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
        <TrendingUp className="h-5 w-5 text-emerald-600" strokeWidth={2} />
      </div>
      <div className="mt-auto">
        <p className="text-sm text-slate-500">Progress</p>
        <p className="mt-1 truncate text-2xl font-bold text-slate-900">
          {completed} <span className="text-base font-medium text-slate-400">of</span> {total}{" "}
          <span className="text-base font-medium text-slate-400">sessions</span>
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-1.5 text-sm text-slate-500">{percent}% completed</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Student Journey (compact stat card). Step content comes from data    */
/* (SatDashboardData.journeySteps); only the icon mapping lives here.   */
/* ------------------------------------------------------------------ */

const JOURNEY_ICONS: LucideIcon[] = [ClipboardCheck, Target, BookOpen, Flag, TrendingUp];

function SatJourneyStatCard({
  currentPhaseTitle,
  steps,
}: {
  currentPhaseTitle: string;
  steps: SatJourneyStep[];
}) {
  const activeIndex = steps.findIndex((step) =>
    currentPhaseTitle.toLowerCase().includes(step.title.toLowerCase())
  );

  const current = activeIndex >= 0 ? activeIndex : 0;
  const step = steps[current];
  const StepIcon = JOURNEY_ICONS[current % JOURNEY_ICONS.length];

  return (
    <div className="flex h-44 flex-col rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
        <StepIcon className="h-5 w-5 text-blue-600" strokeWidth={2} />
      </div>
      <div className="mt-auto">
        <p className="text-sm text-slate-500">Student Journey · Step {step.number}</p>
        <p className="mt-1 truncate text-2xl font-bold text-slate-900" title={step.title}>
          {step.title}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{step.description}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Focus banner                                                         */
/* ------------------------------------------------------------------ */

type FocusBannerStyle = {
  icon: LucideIcon;
  iconColor: string;
  linkLabel: string;
};

const FOCUS_BANNER_STYLE: Record<SatDashboardData["focusAreas"][number]["key"], FocusBannerStyle> = {
  rw: {
    icon: BookOpen,
    iconColor: "text-blue-600",
    linkLabel: "Practice RW",
  },
  math: {
    icon: ClipboardList,
    iconColor: "text-orange-600",
    linkLabel: "Practice Math",
  },
};

function SatFocusBanner({ areas }: { areas: SatDashboardData["focusAreas"] }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex shrink-0 items-center gap-2 pl-1 text-sm font-semibold text-slate-500">
        <Target className="h-4 w-4 text-slate-400" strokeWidth={2} />
        Focus next
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap">
        {areas.map((area) => {
          const style = FOCUS_BANNER_STYLE[area.key];
          const Icon = style.icon;
          const topic = area.topics[0] ?? area.badgeLabel;

          return (
            <button
              key={area.key}
              type="button"
              className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-slate-100 px-3.5 py-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50 sm:min-w-[220px]"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${style.iconColor}`} strokeWidth={2} />
                <span className="truncate text-sm text-slate-700">{topic}</span>
              </span>
              <span className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${style.iconColor}`}>
                {style.linkLabel}
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Assessments                                                          */
/* ------------------------------------------------------------------ */

function rangeLabel(low: number | null, high: number | null) {
  if (low === null || high === null) return "–";
  return `${low} - ${high}`;
}

// Score as a 0-800 percent for the progress bar (SAT max per section = 800)
function scorePercent(low: number | null, high: number | null): number {
  if (low === null || high === null) return 0;
  return Math.round(((low + high) / 2 / 800) * 100);
}

type AssessmentRow = SatDashboardData["diagnosticRows"][number];

type TestMeta = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  subtitle: string;
};

const TEST_META: Record<string, TestMeta> = {
  pretest: {
    icon: ClipboardCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    subtitle: "Baseline assessment to identify your current level",
  },
  "progress-test-1": {
    icon: BarChart2,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    subtitle: "Track your improvement after learning",
  },
  "final-test": {
    icon: Target,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    subtitle: "Comprehensive assessment of your learning",
  },
};

const DEFAULT_META: TestMeta = {
  icon: ClipboardCheck,
  iconBg: "bg-slate-100",
  iconColor: "text-slate-600",
  subtitle: "",
};

function assessmentSections(row: AssessmentRow) {
  return [
    {
      key: "rw",
      name: "Reading & Writing",
      subtitle: "Understanding text, grammar, and written expression",
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      barColor: "bg-blue-500",
      scoreLow: row.rwLow,
      scoreHigh: row.rwHigh,
      modulePoints: row.rwModulePoints,
      summary: row.rwSummary,
      nextAction: row.rwNextAction,
    },
    {
      key: "math",
      name: "Math",
      subtitle: "Numbers, algebra, geometry, and problem solving",
      icon: ClipboardList,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      barColor: "bg-violet-500",
      scoreLow: row.mathLow,
      scoreHigh: row.mathHigh,
      modulePoints: row.mathModulePoints,
      summary: row.mathSummary,
      nextAction: row.mathNextAction,
    },
  ];
}

type BadgeVariant = "completed" | "not-started" | "not-available";

function statusBadge(row: AssessmentRow): { label: string; variant: BadgeVariant } {
  if (row.overallLow !== null) return { label: "Completed", variant: "completed" };
  if (row.status === "not-yet-taken") {
    if (row.id === "final-test") return { label: "Not Available", variant: "not-available" };
    return { label: "Not Started", variant: "not-started" };
  }
  return { label: "Not Started", variant: "not-started" };
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  "not-started": "bg-amber-100 text-amber-700",
  "not-available": "bg-slate-100 text-slate-500",
};

// 3-column layout (Section | Score | Next Step) only on wide screens;
// below that each section becomes a stacked card.
const ASSESSMENT_GRID = "xl:grid xl:grid-cols-[1.2fr_160px_1.2fr] xl:gap-x-8";

function SatAssessments({
  rows,
  targetScore,
}: {
  rows: AssessmentRow[];
  targetScore: number;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());
  const [detailIds, setDetailIds] = useState<Set<string>>(() => new Set());

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleDetail = (id: string) =>
    setDetailIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
          <ClipboardCheck className="h-4 w-4 text-blue-600" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">Assessments</h2>
          <p className="truncate text-sm text-slate-500">
            Your diagnostic, practice, and final test results
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {rows.map((row) => {
          const hasData = row.overallLow !== null && row.overallHigh !== null;
          const isOpen = openIds.has(row.id);
          const showDetail = detailIds.has(row.id);
          const sections = assessmentSections(row);
          const meta = TEST_META[row.id] ?? DEFAULT_META;
          const TestIcon = meta.icon;
          const badge = statusBadge(row);
          const isLocked = row.id === "final-test" && !hasData;

          // Shown beside the title on >= sm, and under the subtitle on phones.
          const resultChip = hasData ? (
            <span className="flex flex-wrap items-center gap-1.5 text-sm">
              <BarChart2 className="h-4 w-4 text-slate-400" strokeWidth={2} />
              <span className="text-xs text-slate-400">Overall Score</span>
              <span className="font-bold text-blue-600">
                {rangeLabel(row.overallLow, row.overallHigh)}
              </span>
              <span className="text-xs text-slate-400">/ {targetScore}</span>
            </span>
          ) : isLocked ? (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" strokeWidth={2} />
              Result not available yet
            </span>
          ) : null;

          return (
            <div key={row.id} className="overflow-hidden rounded-2xl border border-slate-200">
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => toggle(row.id)}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 sm:gap-4 sm:px-5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}
                >
                  <TestIcon className={`h-5 w-5 ${meta.iconColor}`} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{row.test}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${BADGE_CLASSES[badge.variant]}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{meta.subtitle}</p>

                  {resultChip && <div className="mt-1.5 sm:hidden">{resultChip}</div>}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {resultChip && <div className="hidden sm:block">{resultChip}</div>}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                </div>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-5 pt-4 sm:px-5">
                  {hasData ? (
                    <>
                      {/* Column header (only meaningful in the 3-column layout) */}
                      <div
                        className={`mb-3 hidden text-xs font-semibold text-slate-400 ${ASSESSMENT_GRID}`}
                      >
                        <span>Section</span>
                        <span>Score</span>
                        <span>Next Step</span>
                      </div>

                      <div className="flex flex-col gap-4">
                        {sections.map((section) => {
                          const SectionIcon = section.icon;
                          const pct = scorePercent(section.scoreLow, section.scoreHigh);

                          return (
                            <div
                              key={section.key}
                              className={`flex flex-col gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 xl:items-start xl:border-b-0 xl:pb-0 ${ASSESSMENT_GRID}`}
                            >
                              {/* Section name + subtitle */}
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${section.iconBg}`}
                                >
                                  <SectionIcon
                                    className={`h-4 w-4 ${section.iconColor}`}
                                    strokeWidth={2}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-900">{section.name}</p>
                                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                                    {section.subtitle}
                                  </p>
                                </div>
                              </div>

                              {/* Score + progress bar + module points */}
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {rangeLabel(section.scoreLow, section.scoreHigh)}
                                </p>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${section.barColor}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                {section.modulePoints && (
                                  <p className="mt-1 text-xs text-slate-400">
                                    {section.modulePoints} pss
                                  </p>
                                )}
                              </div>

                              {/* Next step card */}
                              <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 xl:self-start">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600">
                                  {section.nextAction ?? "No next action available yet."}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tutor summary toggle */}
                      <button
                        type="button"
                        onClick={() => toggleDetail(row.id)}
                        className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600"
                      >
                        {showDetail ? "Hide tutor summary" : "Show tutor summary"}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            showDetail ? "rotate-180" : ""
                          }`}
                          strokeWidth={2}
                        />
                      </button>

                      {showDetail && (
                        <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-500">
                          <p>
                            <span className="font-semibold text-slate-700">Overall — </span>
                            {row.overallSummary ?? "No tutor summary available yet."}
                          </p>
                          {sections.map((section) => (
                            <p key={section.key}>
                              <span className="font-semibold text-slate-700">{section.name} — </span>
                              {section.summary ?? "No tutor summary available yet."}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="py-2 text-sm text-slate-400">Result not available yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Syllabus — one component, two views (List / Table) behind an         */
/* icon-only toggle. Done state, section filter and progress are shared */
/* so switching views never loses anything.                             */
/* ------------------------------------------------------------------ */

type SessionId = SatSyllabusRow["session"];

type SectionStyle = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  textColor: string;
  // null = cross-section row ("All Sections"), only visible under the "All" tab
  filterKey: SatFocusKey | null;
};

// Section colors follow the Assessments card (RW = blue, Math = violet).
const SAT_SECTION_STYLE: Record<SatSyllabusSection, SectionStyle> = {
  "All Sections": {
    icon: LayoutGrid,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    textColor: "text-slate-600",
    filterKey: null,
  },
  "Reading & Writing": {
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-600",
    filterKey: "rw",
  },
  Math: {
    icon: ClipboardList,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    textColor: "text-violet-600",
    filterKey: "math",
  },
};

type SatSyllabusFilter = "all" | SatFocusKey;
type SatSyllabusView = "list" | "table";

const SAT_SYLLABUS_TABS: { key: SatSyllabusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "rw", label: "Reading & Writing" },
  { key: "math", label: "Math" },
];

const SAT_SYLLABUS_VIEWS: {
  key: SatSyllabusView;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: "list", label: "List", icon: ListIcon },
  { key: "table", label: "Table", icon: TableIcon },
];

function matchesSyllabusFilter(row: SatSyllabusRow, filter: SatSyllabusFilter) {
  return filter === "all" || SAT_SECTION_STYLE[row.section].filterKey === filter;
}

function toggleInSet<T>(prev: Set<T>, value: T): Set<T> {
  const next = new Set(prev);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/* ---------------------------- List view ---------------------------- */

function SatSyllabusListView({
  rows,
  doneSessions,
  openSessions,
  nextSession,
  onToggleDone,
  onToggleOpen,
}: {
  rows: SatSyllabusRow[];
  doneSessions: Set<SessionId>;
  openSessions: Set<SessionId>;
  nextSession: SessionId | undefined;
  onToggleDone: (session: SessionId) => void;
  onToggleOpen: (session: SessionId) => void;
}) {
  return (
    <ol className="flex flex-col gap-3">
      {rows.map((row, index) => {
        const style = SAT_SECTION_STYLE[row.section];
        const SectionIcon = style.icon;
        const isDone = doneSessions.has(row.session);
        const isOpen = openSessions.has(row.session);
        const isNext = row.session === nextSession;
        const isNumbered = typeof row.session === "number";
        const isLast = index === rows.length - 1;

        const nodeClass = isDone
          ? "bg-blue-600 text-white"
          : isNext
            ? "border-2 border-blue-600 bg-white text-blue-600"
            : "border-2 border-slate-200 bg-white text-slate-400";

        return (
          <li key={String(row.session)} className="relative flex items-start gap-2 sm:gap-3">
            {/* Rail segment: runs from this node down to the next one */}
            {!isLast && (
              <span
                aria-hidden
                className={`absolute -bottom-6 left-4 top-11 w-px -translate-x-1/2 ${
                  isDone ? "bg-blue-300" : "bg-slate-200"
                }`}
              />
            )}

            {/* Timeline node */}
            <div
              className={`z-10 mt-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-4 ring-white ${nodeClass}`}
            >
              {isDone ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : isNumbered ? (
                row.session
              ) : (
                <ClipboardCheck className="h-4 w-4" strokeWidth={2} />
              )}
            </div>

            {/* Accordion card */}
            <div
              className={`min-w-0 flex-1 overflow-hidden rounded-2xl border transition-colors ${
                isNext ? "border-blue-200" : "border-slate-200"
              }`}
            >
              {/* Header: on phones the "Done" checkbox drops below the title row */}
              <div className="flex flex-col gap-1 px-3 py-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-start sm:gap-3 sm:px-4">
                <button
                  type="button"
                  onClick={() => onToggleOpen(row.session)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
                  >
                    <SectionIcon className={`h-4 w-4 ${style.iconColor}`} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-semibold ${style.textColor}`}>
                        {row.section}
                      </span>
                      {/* Domain badge moves up here on phones */}
                      <span className="max-w-full rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-snug text-slate-600 sm:hidden">
                        {row.domain}
                      </span>
                      {isNext && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                          Up next
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm font-bold leading-snug text-slate-900">
                      {row.title}
                    </p>
                  </div>

                  {/* Domain names can be long, so this badge is allowed to wrap. */}
                  <span className="mt-0.5 hidden max-w-[11rem] shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-center text-xs font-semibold leading-snug text-slate-600 sm:block">
                    {row.domain}
                  </span>

                  <ChevronDown
                    className={`mt-1.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                </button>

                {/* Kept outside the toggle button so the checkbox isn't nested
                    inside another interactive element. */}
                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 self-end py-1 text-xs font-semibold text-slate-500 sm:self-auto sm:pt-1.5">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleDone(row.session)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                  />
                  Done
                </label>
              </div>

              {isOpen && (
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-3 pb-4 pt-3 sm:px-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">Session details</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{row.details}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">Async reinforcement</p>
                    <div className="mt-1 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {row.asyncReinforcement}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------- Table view --------------------------- */

// Wide table: scrolls sideways inside its own box on small screens.
function SatSyllabusTableView({
  rows,
  doneSessions,
  onToggleDone,
}: {
  rows: SatSyllabusRow[];
  doneSessions: Set<SessionId>;
  onToggleDone: (session: SessionId) => void;
}) {
  return (
    <div className="max-h-[70vh] max-w-full overflow-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[1000px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
          <tr className="text-xs font-semibold text-slate-500">
            <th className="w-24 px-4 py-3 text-center">Session</th>
            <th className="w-44 px-4 py-3">Section</th>
            <th className="w-40 px-4 py-3">Domain</th>
            <th className="w-48 px-4 py-3">Topic</th>
            <th className="px-4 py-3">Session Details</th>
            <th className="px-4 py-3">Async Reinforcement</th>
            <th className="w-20 px-4 py-3 text-center">Done</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const style = SAT_SECTION_STYLE[row.section];
            const SectionIcon = style.icon;
            const isDone = doneSessions.has(row.session);
            const isCombined = row.section === "All Sections";

            return (
              <tr
                key={String(row.session)}
                className={`align-top transition-colors ${
                  isCombined ? "bg-slate-50/70 hover:bg-slate-100/60" : "hover:bg-slate-50"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-4 text-center text-sm font-semibold text-slate-400">
                  {row.session}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
                    >
                      <SectionIcon className={`h-4 w-4 ${style.iconColor}`} strokeWidth={2} />
                    </div>
                    <span className={`text-sm font-bold ${style.textColor}`}>{row.section}</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold leading-snug text-slate-600">
                    {row.domain}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-semibold leading-snug text-slate-900">
                  {row.title}
                </td>

                <td className="px-4 py-4 text-xs leading-relaxed text-slate-500">{row.details}</td>

                <td className="px-4 py-4">
                  <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
                    {row.asyncReinforcement}
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleDone(row.session)}
                    aria-label={`Mark session ${row.session} as done`}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------ Section ---------------------------- */

function SatSyllabus({ syllabus }: { syllabus: SatSyllabusData }) {
  // Done is local only for now — swap for a backend call once the endpoint exists.
  const [doneSessions, setDoneSessions] = useState<Set<SessionId>>(
    () => new Set(syllabus.rows.filter((r) => r.done).map((r) => r.session))
  );
  const [openSessions, setOpenSessions] = useState<Set<SessionId>>(() => new Set());
  const [filter, setFilter] = useState<SatSyllabusFilter>("all");
  const [view, setView] = useState<SatSyllabusView>("list");

  const total = syllabus.rows.length;
  const doneCount = doneSessions.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // First session not yet done across the whole syllabus (not just the
  // filtered view), so "Up next" stays stable when switching tabs.
  const nextSession = syllabus.rows.find((r) => !doneSessions.has(r.session))?.session;

  const visibleRows = syllabus.rows.filter((r) => matchesSyllabusFilter(r, filter));

  const handleToggleDone = (session: SessionId) =>
    setDoneSessions((prev) => toggleInSet(prev, session));
  const handleToggleOpen = (session: SessionId) =>
    setOpenSessions((prev) => toggleInSet(prev, session));

  return (
    <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <ListChecks className="h-4 w-4 text-blue-600" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">{syllabus.title}</h2>
            <p className="text-sm text-slate-500">{syllabus.description}</p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {syllabus.sessionLabel}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {doneCount} of {total} sessions done
          </span>
          <span className="text-slate-400">{pct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Controls: section filter (left) + icon-only view toggle (right) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {SAT_SYLLABUS_TABS.map((tab) => {
            const active = filter === tab.key;
            const count = syllabus.rows.filter((r) => matchesSyllabusFilter(r, tab.key)).length;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {tab.label}
                <span className={active ? "text-blue-100" : "text-slate-400"}>{count}</span>
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Syllabus view"
          className="inline-flex shrink-0 gap-0.5 rounded-xl border border-slate-200 bg-white p-0.5"
        >
          {SAT_SYLLABUS_VIEWS.map((option) => {
            const active = view === option.key;
            const OptionIcon = option.icon;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setView(option.key)}
                aria-pressed={active}
                aria-label={`${option.label} view`}
                title={`${option.label} view`}
                className={`flex h-8 w-9 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <OptionIcon className="h-4 w-4" strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {visibleRows.length === 0 ? (
          <p className="py-2 text-sm text-slate-400">No sessions for this section yet.</p>
        ) : view === "list" ? (
          <SatSyllabusListView
            rows={visibleRows}
            doneSessions={doneSessions}
            openSessions={openSessions}
            nextSession={nextSession}
            onToggleDone={handleToggleDone}
            onToggleOpen={handleToggleOpen}
          />
        ) : (
          <SatSyllabusTableView
            rows={visibleRows}
            doneSessions={doneSessions}
            onToggleDone={handleToggleDone}
          />
        )}
      </div>
    </section>
  );
}