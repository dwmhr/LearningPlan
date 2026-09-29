"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Headphones,
  BookOpen,
  PenLine,
  Mic,
  Repeat,
  ArrowRight,
  GraduationCap,
  LayoutGrid,
  ClipboardCheck,
  ClipboardList,
  FileClock,
  TrendingUp,
  Target,
  ListChecks,
  Check,
  List as ListIcon,
  Table as TableIcon,
  ChevronDown,
  Lock,
  BarChart2,
  Layers,
  LucideIcon,
} from "lucide-react";
import {
  SkillKey,
  IeltsOverview,
  IeltsFocusArea,
  IeltsSyllabus as IeltsSyllabusData,
  IeltsAssessment,
  IeltsSkillAssessmentDetail,
  AssessmentStatus,
  SyllabusSkill,
  IeltsSyllabusRow,
} from "@/lib/ielts-types";
import NotificationBell from "@/components/NotificationBell";
import { NOTIFICATIONS } from "@/lib/notifications";

/* ------------------------------------------------------------------ */
/* Shared skill color / icon mapping                                   */
/* ------------------------------------------------------------------ */

interface SkillStyle {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  linkColor: string;
}

// Blue is the identity color for the page chrome (headers, links, primary
// stat). Each skill keeps its own accent so the four are easy to tell apart
// at a glance, but "Speaking" moved off purple to rose so purple isn't
// competing with the primary blue anywhere on the page.
export const SKILL_STYLES: Record<SkillKey, SkillStyle> = {
  listening: {
    icon: Headphones,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-600",
    barColor: "bg-blue-500",
    linkColor: "text-blue-600 hover:text-blue-700",
  },
  reading: {
    icon: BookOpen,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-600",
    barColor: "bg-emerald-500",
    linkColor: "text-emerald-600 hover:text-emerald-700",
  },
  writing: {
    icon: PenLine,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-600",
    barColor: "bg-amber-500",
    linkColor: "text-amber-600 hover:text-amber-700",
  },
  speaking: {
    icon: Mic,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-600",
    barColor: "bg-rose-500",
    linkColor: "text-rose-600 hover:text-rose-700",
  },
};

/* Small icon badge used next to every section title, always in the
   primary blue so it reads as one consistent page identity. */
function SectionIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
      <Icon className="h-4 w-4 text-blue-600" strokeWidth={2} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                               */
/* ------------------------------------------------------------------ */

export function IeltsHeader({ overview }: { overview: IeltsOverview }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20">
          <GraduationCap className="h-7 w-7 text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">IELTS</h1>
          <p className="text-sm text-slate-500">
            {overview.packageName} · {overview.hours} hours
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell notifications={NOTIFICATIONS} />

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:from-blue-700 hover:to-sky-600"
        >
          Continue Learning
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress overview                                                    */
/* ------------------------------------------------------------------ */

export function IeltsProgressOverview({
  overview,
}: {
  overview: IeltsOverview;
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        <SectionIcon icon={TrendingUp} />
        <h2 className="text-base font-semibold text-slate-900">
          IELTS Progress
        </h2>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Overall Band */}
        <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3.5 shadow-md shadow-blue-600/20">
          <div className="pt-2 text-left">
            <p className="text-lg text-blue-100">Overall Band</p>
            <p className="mt-1 text-4xl font-bold text-white">
              {overview.bandLow.toFixed(1)} - {overview.bandHigh.toFixed(1)}
            </p>
            <p className="mt-1 text-lg text-blue-100">
              Target {overview.targetBand.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Skill tiles */}
        {overview.skills.map((skill) => {
          const style = SKILL_STYLES[skill.key];
          const Icon = style.icon;
          const needed = Math.max(skill.target - skill.score, 0);

          return (
            <div
              key={skill.key}
              className="rounded-xl border border-slate-100 p-3 transition-colors hover:border-slate-200"
            >
              <div
                className={`ml-auto flex h-10 w-10 items-center justify-center rounded-full ${style.iconBg}`}
              >
                <Icon
                  className={`h-5 w-5 ${style.iconColor}`}
                  strokeWidth={2}
                />
              </div>

              <p className="text-base text-slate-500">{skill.label}</p>

              <p className="mt-0.5 text-3xl font-bold text-slate-900">
                {skill.score.toFixed(1)}
              </p>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500">
                  Target {skill.target.toFixed(1)}
                </p>

                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${style.badgeBg} ${style.badgeText}`}
                >
                  {needed > 0
                    ? `+${needed.toFixed(1)} needed`
                    : "Target reached"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Focus areas — compact "focus next" banner, now laid out as a 2-row   */
/* grid (2 columns) instead of a single wrapping row.                   */
/* ------------------------------------------------------------------ */

export function IeltsFocusAreas({
  focusAreas,
}: {
  focusAreas: IeltsFocusArea[];
}) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <SectionIcon icon={Target} />
        <h2 className="text-base font-semibold text-slate-900">
          Focus next
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {focusAreas.map((area) => {
          const style = SKILL_STYLES[area.key];
          const Icon = style.icon;

          return (
            <Link
              key={area.key}
              href={area.href}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 px-3.5 py-2.5 text-left transition hover:border-slate-200 hover:bg-slate-50"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${style.iconColor}`} strokeWidth={2} />
                <span className="truncate text-sm text-slate-700">{area.title}</span>
              </span>
              <span
                className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${style.linkColor}`}
              >
                {area.ctaLabel}
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Assessments — accordion with per-skill band breakdown, recommended   */
/* practice, and a tutor-summary toggle (mirrors the SAT Assessments)   */
/* ------------------------------------------------------------------ */

const ASSESSMENT_ICONS: Record<string, LucideIcon> = {
  diagnostic: ClipboardCheck,
  pretest: ClipboardList,
  final: FileClock,
};

const ASSESSMENT_META: Record<string, { subtitle: string }> = {
  diagnostic: { subtitle: "Baseline assessment to identify your current band" },
  pretest: { subtitle: "Track your improvement after learning" },
  final: { subtitle: "Comprehensive assessment of your learning" },
};

interface AssessmentStatusStyle {
  iconBg: string;
  iconColor: string;
}

// "completed" now reads in the primary blue instead of purple; upcoming
// stays amber as a warm "needs attention" signal, not-started stays neutral.
const ASSESSMENT_STATUS_STYLE: Record<AssessmentStatus, AssessmentStatusStyle> = {
  completed: {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  upcoming: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  "not-started": {
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
};

const ASSESSMENT_BADGE_CLASSES: Record<AssessmentStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-amber-100 text-amber-700",
  "not-started": "bg-slate-100 text-slate-500",
};

function bandRangeLabel(low: number | null | undefined, high: number | null | undefined) {
  if (low == null || high == null) return "–";
  return `${low.toFixed(1)} - ${high.toFixed(1)}`;
}

// IELTS bands run 0-9, so the progress bar is scaled against a max of 9.
function bandPercent(low: number | null | undefined, high: number | null | undefined): number {
  if (low == null || high == null) return 0;
  return Math.round(((low + high) / 2 / 9) * 100);
}

interface SkillSectionMeta {
  key: SkillKey;
  name: string;
  subtitle: string;
}

const SKILL_SECTION_META: SkillSectionMeta[] = [
  { key: "listening", name: "Listening", subtitle: "Understanding spoken English in context" },
  { key: "reading", name: "Reading", subtitle: "Comprehension, skimming, and scanning" },
  { key: "writing", name: "Writing", subtitle: "Task achievement and coherent expression" },
  { key: "speaking", name: "Speaking", subtitle: "Fluency, coherence, and pronunciation" },
];

function assessmentSkillSections(assessment: IeltsAssessment) {
  return SKILL_SECTION_META.map((meta) => {
    const style = SKILL_STYLES[meta.key];
    const detail: IeltsSkillAssessmentDetail | undefined = assessment[meta.key];

    return {
      key: meta.key,
      name: meta.name,
      subtitle: meta.subtitle,
      icon: style.icon,
      iconBg: style.iconBg,
      iconColor: style.iconColor,
      barColor: style.barColor,
      low: detail?.low ?? null,
      high: detail?.high ?? null,
      summary: detail?.summary ?? null,
      nextAction: detail?.nextAction ?? null,
    };
  });
}

export function IeltsAssessments({
  assessments,
}: {
  assessments: IeltsAssessment[];
}) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [detailKeys, setDetailKeys] = useState<Set<string>>(() => new Set());

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleDetail = (key: string) =>
    setDetailKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        <SectionIcon icon={ClipboardList} />
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Assessments
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Your diagnostic, pretest, and final test results
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {assessments.map((assessment) => {
          const hasData = assessment.overallLow != null && assessment.overallHigh != null;
          const isOpen = openKeys.has(assessment.key);
          const showDetail = detailKeys.has(assessment.key);
          const sections = assessmentSkillSections(assessment);
          const TestIcon = ASSESSMENT_ICONS[assessment.key] ?? ClipboardList;
          const style = ASSESSMENT_STATUS_STYLE[assessment.status];
          const meta = ASSESSMENT_META[assessment.key] ?? { subtitle: "" };
          const isLocked = assessment.status !== "completed" && !hasData;

          return (
            <div
              key={assessment.key}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              {/* Accordion header */}
              <button
                type="button"
                onClick={() => toggle(assessment.key)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
                >
                  <TestIcon className={`h-5 w-5 ${style.iconColor}`} strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{assessment.title}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ASSESSMENT_BADGE_CLASSES[assessment.status]}`}
                    >
                      {assessment.statusLabel}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{meta.subtitle}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {hasData ? (
                    <span className="flex items-center gap-1.5 text-sm">
                      <BarChart2 className="h-4 w-4 text-slate-400" strokeWidth={2} />
                      <span className="text-xs text-slate-400">Overall Band</span>
                      <span className="font-bold text-blue-600">
                        {bandRangeLabel(assessment.overallLow, assessment.overallHigh)}
                      </span>
                    </span>
                  ) : isLocked ? (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                      Result not available yet
                    </span>
                  ) : null}
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
                <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                  {hasData ? (
                    <>
                      {/* Column header */}
                      <div className="mb-3 grid grid-cols-[1.3fr_140px_1.5fr] gap-x-8 text-xs font-semibold text-slate-400">
                        <span>Skill</span>
                        <span className="text-center">Band</span>
                        <span>Recommended Practice</span>
                      </div>

                      <div className="flex flex-col gap-4">
                        {sections.map((section) => {
                          const SectionSkillIcon = section.icon;
                          const pct = bandPercent(section.low, section.high);

                          return (
                            <div
                              key={section.key}
                              className="grid grid-cols-[1.3fr_140px_1.5fr] gap-x-8 items-start"
                            >
                              {/* Skill name + subtitle */}
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${section.iconBg}`}
                                >
                                  <SectionSkillIcon
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

                              {/* Band + progress bar - centered */}
                              <div className="flex flex-col items-center">
                                <p className="text-sm font-bold text-slate-900">
                                  {bandRangeLabel(section.low, section.high)}
                                </p>
                                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`h-full rounded-full ${section.barColor}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>

                              {/* Recommended practice card */}
                              <div className="flex self-start items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                  <GraduationCap className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
                                </div>
                                <p className="text-xs leading-relaxed text-slate-600">
                                  {section.nextAction ?? "No recommended practice available yet."}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tutor summary toggle */}
                      <button
                        type="button"
                        onClick={() => toggleDetail(assessment.key)}
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
                            {assessment.overallSummary ?? "No tutor summary available yet."}
                          </p>
                          {sections.map((section) => (
                            <p key={section.key}>
                              <span className="font-semibold text-slate-700">
                                {section.name} —{" "}
                              </span>
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
/* Syllabus — grouped into "block" cards (one per ~15h cluster), each   */
/* with its own progress bar; expanding a block reveals the filter tabs, */
/* List/Table toggle, and per-session dropdown that used to be global.   */
/* ------------------------------------------------------------------ */

type SessionId = IeltsSyllabusRow["session"];

// Maps SyllabusSkill to a SkillKey (for SKILL_STYLES lookup).
// "All Skills" and "Drilling" have no SkillKey — they use their own styles.
const SYLLABUS_SKILL_KEY: Record<SyllabusSkill, SkillKey | null> = {
  "All Skills": null,
  Drilling: null,
  Listening: "listening",
  Reading: "reading",
  Writing: "writing",
  Speaking: "speaking",
};

function syllabusSkillStyle(skill: SyllabusSkill) {
  // Drilling gets its own violet accent — distinct from both the primary
  // blue ("All Skills") and the four skill colors.
  if (skill === "Drilling") {
    return {
      icon: Repeat,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      textColor: "text-violet-600",
    };
  }

  const key = SYLLABUS_SKILL_KEY[skill];

  if (!key) {
    // "All Skills" fallback — primary blue
    return {
      icon: LayoutGrid,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
    };
  }

  const style = SKILL_STYLES[key];
  return {
    icon: style.icon,
    iconBg: style.iconBg,
    iconColor: style.iconColor,
    textColor: style.badgeText,
  };
}

// "drilling" is a standalone filter key — it doesn't map to SkillKey since
// Drilling isn't one of the four scored skills.
type SyllabusFilter = "all" | SkillKey | "drilling";
type SyllabusView = "list" | "table";

interface SyllabusTab {
  key: SyllabusFilter;
  label: string;
}

const SYLLABUS_TABS: SyllabusTab[] = [
  { key: "all", label: "All" },
  { key: "listening", label: "Listening" },
  { key: "reading", label: "Reading" },
  { key: "writing", label: "Writing" },
  { key: "speaking", label: "Speaking" },
  { key: "drilling", label: "Drilling" },
];

interface SyllabusViewOption {
  key: SyllabusView;
  label: string;
  icon: LucideIcon;
}

const SYLLABUS_VIEWS: SyllabusViewOption[] = [
  { key: "list", label: "List", icon: ListIcon },
  { key: "table", label: "Table", icon: TableIcon },
];

function matchesSyllabusFilter(row: IeltsSyllabusRow, filter: SyllabusFilter) {
  if (filter === "all") return true;
  if (filter === "drilling") return row.skill === "Drilling";
  return SYLLABUS_SKILL_KEY[row.skill] === filter;
}

function toggleInSet<T>(prev: Set<T>, value: T): Set<T> {
  const next = new Set(prev);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/* ---------------------------- List view ---------------------------- */

function SyllabusListView({
  rows,
  doneSessions,
  openSessions,
  nextSession,
  onToggleDone,
  onToggleOpen,
}: {
  rows: IeltsSyllabusRow[];
  doneSessions: Set<SessionId>;
  openSessions: Set<SessionId>;
  nextSession: SessionId | undefined;
  onToggleDone: (session: SessionId) => void;
  onToggleOpen: (session: SessionId) => void;
}) {
  return (
    <ol className="flex flex-col gap-3">
      {rows.map((row, index) => {
        const style = syllabusSkillStyle(row.skill);
        const SkillIcon = style.icon;
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
          <li
            key={String(row.session)}
            className="relative flex items-start gap-3"
          >
            {/* Rail segment */}
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
              <div className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50">
                <button
                  type="button"
                  onClick={() => onToggleOpen(row.session)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}
                  >
                    <SkillIcon
                      className={`h-4 w-4 ${style.iconColor}`}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${style.textColor}`}
                      >
                        {row.skill}
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

                  <span className="mt-0.5 shrink-0 whitespace-nowrap rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {row.bandLane}
                  </span>

                  <ChevronDown
                    className={`mt-1.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2}
                  />
                </button>

                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 pt-1.5 text-xs font-semibold text-slate-500">
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
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 px-4 pb-4 pt-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Session details
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {row.details}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Async reinforcement
                    </p>
                    <div className="mt-1 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <GraduationCap
                          className="h-3.5 w-3.5 text-blue-600"
                          strokeWidth={2}
                        />
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

function SyllabusTableView({
  rows,
  doneSessions,
  onToggleDone,
}: {
  rows: IeltsSyllabusRow[];
  doneSessions: Set<SessionId>;
  onToggleDone: (session: SessionId) => void;
}) {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
          <tr className="text-xs font-semibold text-slate-500">
            <th className="w-24 px-4 py-3 text-center">Session</th>
            <th className="w-36 px-4 py-3">Skills</th>
            <th className="w-28 px-4 py-3">Band Lane</th>
            <th className="w-52 px-4 py-3">Activity Display Title</th>
            <th className="px-4 py-3">Session Details</th>
            <th className="px-4 py-3">Async Reinforcement</th>
            <th className="w-20 px-4 py-3 text-center">Done</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => {
            const style = syllabusSkillStyle(row.skill);
            const SkillIcon = style.icon;
            const isDone = doneSessions.has(row.session);

            return (
              <tr
                key={String(row.session)}
                className={`align-top transition-colors ${
                  row.skill === "All Skills"
                    ? "bg-blue-50/40 hover:bg-blue-50/70"
                    : row.skill === "Drilling"
                      ? "bg-violet-50/40 hover:bg-violet-50/70"
                      : "hover:bg-slate-50"
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
                      <SkillIcon
                        className={`h-4 w-4 ${style.iconColor}`}
                        strokeWidth={2}
                      />
                    </div>
                    <span className={`text-sm font-bold ${style.textColor}`}>
                      {row.skill}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-block rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {row.bandLane}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm font-semibold leading-snug text-slate-900">
                  {row.title}
                </td>

                <td className="px-4 py-4 text-xs leading-relaxed text-slate-500">
                  {row.details}
                </td>

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

/* ---------------------------- Block card ---------------------------- */

// Purely visual — cycles through a small accent palette so Block 1, 2, 3...
// each read as their own distinct chunk of the course instead of one flat
// gray box repeated three times. Lives here (not in the lib) because it's
// presentation, not data: the lib only ever says which block a session
// belongs to and how many hours a block represents.
interface BlockAccent {
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
}

const BLOCK_ACCENTS: BlockAccent[] = [
  { iconBg: "bg-blue-50", iconColor: "text-blue-600", badgeBg: "bg-blue-50", badgeText: "text-blue-600", barColor: "bg-blue-500" },
  { iconBg: "bg-violet-50", iconColor: "text-violet-600", badgeBg: "bg-violet-50", badgeText: "text-violet-600", barColor: "bg-violet-500" },
  { iconBg: "bg-amber-50", iconColor: "text-amber-600", badgeBg: "bg-amber-50", badgeText: "text-amber-600", barColor: "bg-amber-500" },
  { iconBg: "bg-teal-50", iconColor: "text-teal-600", badgeBg: "bg-teal-50", badgeText: "text-teal-600", barColor: "bg-teal-500" },
  { iconBg: "bg-rose-50", iconColor: "text-rose-600", badgeBg: "bg-rose-50", badgeText: "text-rose-600", barColor: "bg-rose-500" },
];

function blockAccent(blockNumber: number): BlockAccent {
  return BLOCK_ACCENTS[(blockNumber - 1) % BLOCK_ACCENTS.length];
}

// "Sessions 1–15" style label for a block, derived from its numeric
// session ids (the "Post N" final-test row is skipped for range purposes).
function blockRangeLabel(rows: IeltsSyllabusRow[]): string {
  const numeric = rows
    .map((r) => r.session)
    .filter((s): s is number => typeof s === "number");
  if (numeric.length === 0) return "";
  const low = Math.min(...numeric);
  const high = Math.max(...numeric);
  return low === high ? `Session ${low}` : `Sessions ${low}–${high}`;
}

function SyllabusBlockCard({
  blockNumber,
  hours,
  rows,
  doneSessions,
  nextSession,
  defaultOpen,
  onToggleDone,
}: {
  blockNumber: number;
  hours: number | undefined;
  rows: IeltsSyllabusRow[];
  doneSessions: Set<SessionId>;
  nextSession: SessionId | undefined;
  defaultOpen: boolean;
  onToggleDone: (session: SessionId) => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [openSessions, setOpenSessions] = useState<Set<SessionId>>(() => new Set());
  const [filter, setFilter] = useState<SyllabusFilter>("all");
  const [view, setView] = useState<SyllabusView>("list");

  const total = rows.length;
  const doneCount = rows.filter((r) => doneSessions.has(r.session)).length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isBlockDone = total > 0 && doneCount === total;
  const containsNext = rows.some((r) => r.session === nextSession);

  const visibleRows = rows.filter((r) => matchesSyllabusFilter(r, filter));

  const handleToggleOpenSession = (session: SessionId) =>
    setOpenSessions((prev) => toggleInSet(prev, session));

  const accent = blockAccent(blockNumber);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      {/* Block header — click to expand/collapse the whole block */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isBlockDone ? "bg-emerald-50" : accent.iconBg
          }`}
        >
          {isBlockDone ? (
            <Check className="h-5 w-5 text-emerald-600" strokeWidth={2.5} />
          ) : (
            <Layers className={`h-5 w-5 ${accent.iconColor}`} strokeWidth={2} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              Block {blockNumber}
            </span>
            {hours != null && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badgeBg} ${accent.badgeText}`}>
                {hours} hours
              </span>
            )}
            {containsNext && !isBlockDone && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${accent.badgeBg} ${accent.badgeText}`}>
                Up next
              </span>
            )}
            {isBlockDone && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Completed
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {blockRangeLabel(rows)}
          </p>
        </div>

        <div className="hidden w-32 shrink-0 sm:block">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              {doneCount}/{total}
            </span>
            <span className="text-slate-400">{pct}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${accent.barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Progress bar on small screens (hidden inline one above is sm+) */}
      <div className="px-5 pb-3 sm:hidden">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            {doneCount}/{total} sessions
          </span>
          <span className="text-slate-400">{pct}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${accent.barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Block body — filter tabs, List/Table toggle, per-session dropdown */}
      {isOpen && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {SYLLABUS_TABS.map((tab) => {
                const active = filter === tab.key;
                const count = rows.filter((r) => matchesSyllabusFilter(r, tab.key)).length;
                if (count === 0 && tab.key !== "all") return null;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    aria-pressed={active}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                    <span className={active ? "text-blue-100" : "text-slate-400"}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Syllabus view"
              className="inline-flex shrink-0 gap-0.5 rounded-xl border border-slate-200 bg-white p-0.5"
            >
              {SYLLABUS_VIEWS.map((option) => {
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
              <p className="py-2 text-sm text-slate-400">
                No sessions for this skill yet.
              </p>
            ) : view === "list" ? (
              <SyllabusListView
                rows={visibleRows}
                doneSessions={doneSessions}
                openSessions={openSessions}
                nextSession={nextSession}
                onToggleDone={onToggleDone}
                onToggleOpen={handleToggleOpenSession}
              />
            ) : (
              <SyllabusTableView
                rows={visibleRows}
                doneSessions={doneSessions}
                onToggleDone={onToggleDone}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Section ---------------------------- */

export function IeltsSyllabus({ syllabus }: { syllabus: IeltsSyllabusData }) {
  const [doneSessions, setDoneSessions] = useState<Set<SessionId>>(
    () => new Set(syllabus.rows.filter((r) => r.done).map((r) => r.session))
  );

  const total = syllabus.rows.length;
  const doneCount = doneSessions.size;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // First session not yet done — used to auto-open its block and to
  // badge that block "Up next".
  const nextSession = syllabus.rows.find(
    (r) => !doneSessions.has(r.session)
  )?.session;

  const handleToggleDone = (session: SessionId) =>
    setDoneSessions((prev) => toggleInSet(prev, session));

  // Group rows by `block`, preserving first-appearance order of each block.
  const blockMap = new Map<number, IeltsSyllabusRow[]>();
  for (const row of syllabus.rows) {
    const existing = blockMap.get(row.block);
    if (existing) {
      existing.push(row);
    } else {
      blockMap.set(row.block, [row]);
    }
  }
  const blockEntries = Array.from(blockMap.entries()).sort((a, b) => a[0] - b[0]);

  // Cumulative hours per block, as provided by the lib (falls back to
  // "no badge" for a block the lib didn't describe, rather than guessing).
  const blockHoursMap = new Map<number, number>(
    syllabus.blocks.map((b) => [b.block, b.hours])
  );

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        <SectionIcon icon={ListChecks} />
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {syllabus.title}
          </h2>
          <p className="text-xs font-medium text-slate-400">
            {syllabus.description}
          </p>
        </div>
      </div>

      {/* Overall progress across every block */}
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

      {/* One card per block */}
      <div className="mt-5 flex flex-col gap-3">
        {blockEntries.map(([blockNumber, rows]) => (
          <SyllabusBlockCard
            key={blockNumber}
            blockNumber={blockNumber}
            hours={blockHoursMap.get(blockNumber)}
            rows={rows}
            doneSessions={doneSessions}
            nextSession={nextSession}
            defaultOpen={rows.some((r) => r.session === nextSession)}
            onToggleDone={handleToggleDone}
          />
        ))}
      </div>
    </section>
  );
}