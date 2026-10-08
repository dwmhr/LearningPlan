export type SkillKey = "listening" | "reading" | "writing" | "speaking";

export interface IeltsSkillScore {
  key: SkillKey;
  label: string;
  score: number;
  target: number;
}

export interface IeltsOverview {
  packageName: string;
  hours: number;
  bandLow: number;
  bandHigh: number;
  targetBand: number;
  skills: IeltsSkillScore[];
}

// Trimmed to what IeltsFocusAreas actually renders. `label`, `fromBand`,
// `toBand`, and `description` were unused (leftover from an earlier card
// layout) — drop them here so the backend contract matches the UI 1:1.
// If a future design shows the band delta or a longer blurb, add the
// field back then.
export interface IeltsFocusArea {
  key: SkillKey;
  title: string;
  ctaLabel: string;
  href: string;
}

// "All Skills" is used for cross-skill sessions (e.g. the orientation),
// "Drilling" is used for mixed-skill consolidation sessions; everything
// else maps 1:1 to a SkillKey.
export type SyllabusSkill =
  | "All Skills"
  | "Drilling"
  | "Listening"
  | "Reading"
  | "Writing"
  | "Speaking";

// One row in the Syllabus table. Column mapping:
//   session            -> "Session" (number for regular sessions, or a
//                         label like "Post 15" for the final test row)
//   skill              -> "Skills"
//   block              -> which hour-package cluster this session belongs
//                         to (1-indexed). Not shown as a raw column — the
//                         UI uses it to group rows into collapsible
//                         "block" cards (Block 1, Block 2, ...), one per
//                         ~15-hour chunk of the package.
//   bandLane           -> "Band Lane"
//   title              -> "Activity Display Title"
//   details            -> "Session Details"
//   asyncReinforcement -> "Async Reinforcement"
//   done               -> "Done" checkbox (initial value from backend)
export interface IeltsSyllabusRow {
  session: number | string;
  skill: SyllabusSkill;
  block: number;
  bandLane: string;
  title: string;
  details: string;
  asyncReinforcement: string;
  done: boolean;
}

// Metadata for one syllabus "block" card (a ~15-hour cluster of sessions).
// `hours` is the cumulative package length through the end of this block
// (Block 1 -> 15, Block 2 -> 30, Block 3 -> 45, ...), which is what the UI
// shows as the "15 hours" / "30 hours" / "45 hours" badge on the block
// header. Lives here (backend-provided) rather than being computed in the
// component so the hour count per block isn't hardcoded in the UI.
export interface IeltsSyllabusBlockMeta {
  block: number;
  hours: number;
}

export interface IeltsSyllabus {
  title: string;
  description: string;
  blocks: IeltsSyllabusBlockMeta[];
  rows: IeltsSyllabusRow[];
}

export type AssessmentStatus = "completed" | "upcoming" | "not-started";

// Per-skill band breakdown for a single assessment, e.g. the Listening
// result inside the Diagnostic Test. All fields optional so an assessment
// that hasn't been taken (or hasn't been tutor-reviewed) yet still
// type-checks without them — the UI falls back to "Result/summary not
// available yet."
export interface IeltsSkillAssessmentDetail {
  low: number | null;
  high: number | null;
  summary?: string | null;
  nextAction?: string | null;
}

// Trimmed `resultLabel`, `ctaLabel`, `href` — those belonged to an older
// link-card version of Assessments. The current accordion (IeltsAssessments)
// derives its own labels from overallLow/High and never reads those fields.
export interface IeltsAssessment {
  key: string;
  title: string;
  status: AssessmentStatus;
  statusLabel: string;

  overallLow?: number | null;
  overallHigh?: number | null;
  overallSummary?: string | null;
  listening?: IeltsSkillAssessmentDetail;
  reading?: IeltsSkillAssessmentDetail;
  writing?: IeltsSkillAssessmentDetail;
  speaking?: IeltsSkillAssessmentDetail;
}