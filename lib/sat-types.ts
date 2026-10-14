export interface SatOverview {
  packageName: string;
  hours: number;
  targetScore: number;
  currentSessionNumber: number;
  currentSessionTitle: string;
  currentSessionSubtitle: string;
  currentSessionDurationLabel: string;
  completedSessions: number;
  totalSessions: number;
  progressPercent: number; // 0-100
  currentPhaseNumber: number;
  currentPhaseTitle: string;
  currentPhaseSubtitle: string;
  currentPhaseTags: string[];
}

export type SatTestStatus = "completed" | "not-yet-taken";

export interface SatDiagnosticRow {
  id: string;
  test: string;
  subtitle?: string; // deskripsi singkat di bawah nama test (FE punya cadangan per id)
  overallLow: number | null;
  overallHigh: number | null;
  rwLow: number | null;
  rwHigh: number | null;
  mathLow: number | null;
  mathHigh: number | null;
  status: SatTestStatus;

  // --- Optional tutor-review fields, added for the accordion/table view
  // on the Assessments card. All optional so existing rows (and any test
  // that hasn't been reviewed yet) still type-check without them — the
  // UI falls back to "No tutor summary/next action available yet."
  overallSummary?: string | null;
  rwModulePoints?: string | null;
  rwSummary?: string | null;
  rwNextAction?: string | null;
  mathModulePoints?: string | null;
  mathSummary?: string | null;
  mathNextAction?: string | null;
}

// Not yet rendered by SatDashboardContent — reserved for an upcoming score
// progress chart. Keeping the shape here (rather than deleting it) since the
// "taken" flag / dashed-projection-line design is already deliberate.
export interface SatScoreProgressPoint {
  label: string; // Pretest, Progress Test 1, Final Test
  overallLow: number;
  overallHigh: number;
  rwLow: number;
  rwHigh: number;
  mathLow: number;
  mathHigh: number;
  taken: boolean;
}

export type SatFocusKey = "rw" | "math";

// Trimmed `label`, `scoreLow`, `scoreHigh` — SatFocusBanner only ever reads
// `key` (to look up its own icon/color), `topics`, and `badgeLabel` as a
// fallback. Add them back only once a component actually renders them.
export interface SatFocusArea {
  key: SatFocusKey;
  badgeLabel: string;
  topics: string[];
}

// Not yet rendered by SatDashboardContent — reserved for an upcoming
// quick-actions section. `kind` is a semantic category, not a UI reference —
// it carries no icon/color itself. The eventual component owns a
// `Record<SatQuickActionKind, LucideIcon>` lookup, the same way
// `statusBadge()` maps a plain `status` string to badge classes.
export type SatQuickActionKind = "practice" | "review" | "error" | "mock";

export interface SatQuickAction {
  id: string;
  label: string;
  kind: SatQuickActionKind;
  href: string;
}

// Content for the "Student Journey" stat card. This used to be hardcoded
// inside the component (JOURNEY_STEPS) — moved here since it's copy/content,
// not UI. The component keeps only the icon-per-step mapping (JOURNEY_ICONS).
export interface SatJourneyStep {
  number: string;
  title: string;
  description: string;
}

// "All Sections" is used for cross-section sessions (orientation, mock test
// review, final test); the other two map 1:1 to SatFocusKey ("rw" / "math").
export type SatSyllabusSection = "All Sections" | "Reading & Writing" | "Math";

// One row in the Syllabus. Table column mapping:
//   session            -> "Session" (number for regular sessions, or a
//                         label like "Post 20" for the final test row)
//   section            -> "Section"
//   domain             -> "Domain"
//   title              -> "Topic"
//   details            -> "Session Details"
//   asyncReinforcement -> "Async Reinforcement"
//   done               -> "Done" checkbox (initial value from backend)
export interface SatSyllabusRow {
  session: number | string;
  section: SatSyllabusSection;
  domain: string;
  title: string;
  details: string;
  asyncReinforcement: string;
  done: boolean;
}

export interface SatSyllabus {
  title: string;
  description: string;
  sessionLabel: string; // e.g. "1 hour = 1 session"
  rows: SatSyllabusRow[];
}

export interface SatDashboardData {
  overview: SatOverview;
  diagnosticRows: SatDiagnosticRow[];
  scoreProgress: SatScoreProgressPoint[];
  focusAreas: SatFocusArea[];
  quickActions: SatQuickAction[];
  journeySteps: SatJourneyStep[];
  syllabus: SatSyllabus;
}