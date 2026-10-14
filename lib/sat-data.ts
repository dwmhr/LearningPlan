import { SatDashboardData } from "./sat-types";

// ---------------------------------------------------------------------------
// DUMMY DATA LAYER — SAT DASHBOARD
// ---------------------------------------------------------------------------
// Same pattern as lib/data.ts: hardcoded placeholder data so the UI works
// out of the box. Swap `getSatDashboardData()`'s body for a real fetch when
// the backend is ready — the shape of SatDashboardData (lib/sat-types.ts) is
// the contract your API needs to satisfy.
// ---------------------------------------------------------------------------

const dummySatData: SatDashboardData = {
  overview: {
    packageName: "Standard Package",
    hours: 20,
    targetScore: 1570,
    currentSessionNumber: 12,
    currentSessionTitle: "Session 12",
    currentSessionSubtitle: "Math: Phase 4 – Advanced Math",
    currentSessionDurationLabel: "1 hour",
    completedSessions: 12,
    totalSessions: 20,
    progressPercent: 60,
    currentPhaseNumber: 4,
    currentPhaseTitle: "Phase 4",
    currentPhaseSubtitle: "Advanced SAT Mastery",
    currentPhaseTags: ["RW 1", "Math 4"],
  },

  diagnosticRows: [
    {
      id: "diagnostic-test",
      test: "Diagnostic Test",
      subtitle: "Initial check of your strengths and gaps",
      overallLow: 1050,
      overallHigh: 1300,
      rwLow: 500,
      rwHigh: 590,
      mathLow: 550,
      mathHigh: 710,
      status: "completed",
      overallSummary:
        "Kemampuan awal sudah cukup baik, namun masih ada beberapa domain yang perlu diperkuat",
      rwModulePoints: "17.0 + 16.0",
      rwSummary: "Pemahaman dasar sudah ada, perlu penguatan pada grammar dan struktur kalimat",
      rwNextAction: "Pemberian materi dasar yang belum dikuasai dan latihan soal",
      mathModulePoints: "18.0 + 17.0",
      mathSummary: "Konsep dasar sudah baik, perlu penguatan pada aljabar dan pertidaksamaan",
      mathNextAction: "Pemberian materi yang belum dikuasai dan latihan soal",
    },
    {
      id: "pretest",
      test: "Pretest",
      subtitle: "Baseline assessment to identify your current level",
      overallLow: 1120,
      overallHigh: 1380,
      rwLow: 530,
      rwHigh: 620,
      mathLow: 590,
      mathHigh: 760,
      status: "completed",
      overallSummary: "Progress sudah bagus, namun masih ada ruang untuk improvement",
      rwModulePoints: "19.0 + 18.0",
      rwSummary: "Progress sudah bagus, namun masih ada ruang untuk improvement",
      rwNextAction: "Pemberian materi yang belum dikuasai dan latihan soal",
      mathModulePoints: "20.0 + 19.0",
      mathSummary: "Progress sudah bagus, namun masih ada ruang untuk improvement",
      mathNextAction: "Pemberian materi yang belum dikuasai dan latihan soal",
    },
    {
      id: "progress-test-1",
      test: "Progress Test 1",
      subtitle: "Track your improvement after learning",
      overallLow: 1100,
      overallHigh: 1370,
      rwLow: 600,
      rwHigh: 760,
      mathLow: 500,
      mathHigh: 610,
      status: "completed",
      // Scores are already in, but the tutor hasn't reviewed this one
      // yet — leave the review fields out (or null) and the UI shows
      // "No tutor summary / next action available yet." automatically.
      overallSummary: null,
      rwModulePoints: "23.0 + 21.0",
      rwSummary: null,
      rwNextAction: null,
      mathModulePoints: "14.0 + 16.0",
      mathSummary: null,
      mathNextAction: null,
    },
    {
      id: "final-test",
      test: "Final Test",
      subtitle: "Comprehensive assessment of your learning",
      overallLow: null,
      overallHigh: null,
      rwLow: null,
      rwHigh: null,
      mathLow: null,
      mathHigh: null,
      status: "not-yet-taken",
    },
  ],

  scoreProgress: [
    {
      label: "Pretest",
      overallLow: 1120,
      overallHigh: 1380,
      rwLow: 530,
      rwHigh: 620,
      mathLow: 590,
      mathHigh: 760,
      taken: true,
    },
    {
      label: "Progress Test 1",
      overallLow: 1100,
      overallHigh: 1370,
      rwLow: 600,
      rwHigh: 760,
      mathLow: 500,
      mathHigh: 610,
      taken: true,
    },
    {
      // Not taken yet — values carried forward only to anchor the dashed
      // projection line; the UI never renders a label for an untaken point.
      label: "Final Test",
      overallLow: 1100,
      overallHigh: 1370,
      rwLow: 600,
      rwHigh: 760,
      mathLow: 500,
      mathHigh: 610,
      taken: false,
    },
  ],

  focusAreas: [
    {
      key: "rw",
      badgeLabel: "Needs Improvement",
      topics: ["Standard English Conventions", "Form, Structure & Sense"],
    },
    {
      key: "math",
      badgeLabel: "Needs Improvement",
      topics: ["Algebra", "Inequalities"],
    },
  ],

  quickActions: [
    { id: "qa1", label: "Practice Questions", kind: "practice", href: "/sat/practice" },
    { id: "qa2", label: "Review Materials", kind: "review", href: "/sat/materials" },
    { id: "qa3", label: "Error Log", kind: "error", href: "/sat/error-log" },
    { id: "qa4", label: "Mock Test", kind: "mock", href: "/sat/mock-test" },
  ],

  // Content moved out of the component (was the hardcoded JOURNEY_STEPS
  // const inside SatDashboardContent.tsx). The component now only owns the
  // icon-per-step mapping (JOURNEY_ICONS), which is genuinely UI.
  journeySteps: [
    {
      number: "01",
      title: "Diagnostic Test",
      description: "Baseline Reading & Writing, Math, pacing, and confidence.",
    },
    {
      number: "02",
      title: "Weakness Map",
      description: "Domain accuracy and root cause are prioritized into learning needs.",
    },
    {
      number: "03",
      title: "Personal Syllabus",
      description:
        "Student enters a syllabus built around target score and SAT domains based on need.",
    },
    {
      number: "04",
      title: "Intervention",
      description: "Tutor-led sessions plus asynchronous materials for practice routine.",
    },
    {
      number: "05",
      title: "Simulation",
      description: "Timed practice, full mock, error log, and target score review.",
    },
  ],

  // Sessions 9–14 (title/domain) come from the old learningActivity /
  // recentSessions data. Everything else — including all details and
  // asyncReinforcement text — is placeholder until the real syllabus exists.
  syllabus: {
    title: "Syllabus",
    description:
      "Sequence is generated from the pretest score, weakness map, and target score.",
    sessionLabel: "1 hour = 1 session",
    rows: [
      {
        session: 1,
        section: "All Sections",
        domain: "SAT Orientation",
        title: "Introduction to the Digital SAT",
        details:
          "This session introduces the digital SAT format, the Reading & Writing and Math modules, adaptive scoring, and the learning pathway so students understand how each session connects to their target score.",
        asyncReinforcement:
          "Students review the SAT test overview from tutor OR complete the SAT Orientation Quiz on LMS.",
        done: true,
      },
      {
        session: 2,
        section: "Math",
        domain: "Algebra",
        title: "Linear Equations in One Variable",
        details:
          "This session helps students practice Linear Equations in One Variable problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Linear Equations in One Variable from tutor OR complete the Math Quiz on LMS.",
        done: true,
      },
      {
        session: 3,
        section: "Reading & Writing",
        domain: "Craft and Structure",
        title: "Words in Context",
        details:
          "This session helps students practice Words in Context questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Words in Context from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: true,
      },
      {
        session: 4,
        section: "Math",
        domain: "Algebra",
        title: "Linear Equations in Two Variables",
        details:
          "This session helps students practice Linear Equations in Two Variables problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Linear Equations in Two Variables from tutor OR complete the Math Quiz on LMS.",
        done: true,
      },
      {
        session: 5,
        section: "Reading & Writing",
        domain: "Information and Ideas",
        title: "Central Ideas and Details",
        details:
          "This session helps students practice Central Ideas and Details questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Central Ideas and Details from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: true,
      },
      {
        session: 6,
        section: "Math",
        domain: "Problem-Solving and Data Analysis",
        title: "Ratios, Rates, and Percentages",
        details:
          "This session helps students practice Ratios, Rates, and Percentages problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Ratios, Rates, and Percentages from tutor OR complete the Math Quiz on LMS.",
        done: true,
      },
      {
        session: 7,
        section: "Reading & Writing",
        domain: "Craft and Structure",
        title: "Text Structure and Purpose",
        details:
          "This session helps students practice Text Structure and Purpose questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Text Structure and Purpose from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: true,
      },
      {
        session: 8,
        section: "Math",
        domain: "Algebra",
        title: "Linear Functions",
        details:
          "This session helps students practice Linear Functions problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Linear Functions from tutor OR complete the Math Quiz on LMS.",
        done: true,
      },
      {
        session: 9,
        section: "Reading & Writing",
        domain: "English Conventions",
        title: "Boundaries",
        details:
          "This session helps students practice Boundaries questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Boundaries from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: true,
      },
      {
        session: 10,
        section: "Math",
        domain: "Advanced Math",
        title: "Systems of Equations",
        details:
          "This session helps students practice Systems of Equations problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Systems of Equations from tutor OR complete the Math Quiz on LMS.",
        done: true,
      },
      {
        session: 11,
        section: "Reading & Writing",
        domain: "English Conventions",
        title: "Transitions and Logical Connections",
        details:
          "This session helps students practice Transitions and Logical Connections questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Transitions and Logical Connections from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: true,
      },
      {
        session: 12,
        section: "Math",
        domain: "Advanced Math",
        title: "Inequalities",
        details:
          "This session helps students practice Inequalities problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Inequalities from tutor OR complete the Math Quiz on LMS.",
        done: false,
      },
      {
        session: 13,
        section: "Reading & Writing",
        domain: "English Conventions",
        title: "Form, Structure & Sense",
        details:
          "This session helps students practice Form, Structure & Sense questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Form, Structure & Sense from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: false,
      },
      {
        session: 14,
        section: "Math",
        domain: "Advanced Math",
        title: "Functions",
        details:
          "This session helps students practice Functions problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Functions from tutor OR complete the Math Quiz on LMS.",
        done: false,
      },
      {
        session: 15,
        section: "Reading & Writing",
        domain: "Information and Ideas",
        title: "Command of Evidence",
        details:
          "This session helps students practice Command of Evidence questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Command of Evidence from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: false,
      },
      {
        session: 16,
        section: "Math",
        domain: "Problem-Solving and Data Analysis",
        title: "Statistics and Probability",
        details:
          "This session helps students practice Statistics and Probability problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Statistics and Probability from tutor OR complete the Math Quiz on LMS.",
        done: false,
      },
      {
        session: 17,
        section: "Reading & Writing",
        domain: "Craft and Structure",
        title: "Cross-Text Connections",
        details:
          "This session helps students practice Cross-Text Connections questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Cross-Text Connections from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: false,
      },
      {
        session: 18,
        section: "Math",
        domain: "Geometry and Trigonometry",
        title: "Lines, Angles, and Triangles",
        details:
          "This session helps students practice Lines, Angles, and Triangles problems in SAT Math, focusing on setting up the problem, choosing an efficient method, and checking the answer against what the question asks.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Lines, Angles, and Triangles from tutor OR complete the Math Quiz on LMS.",
        done: false,
      },
      {
        session: 19,
        section: "Reading & Writing",
        domain: "Information and Ideas",
        title: "Inferences",
        details:
          "This session helps students practice Inferences questions in SAT Reading & Writing, focusing on spotting the question pattern, eliminating distractors, and choosing answers backed by the text.",
        asyncReinforcement:
          "Students complete and submit independent SAT-style practice on Inferences from tutor OR complete the Reading & Writing Quiz on LMS.",
        done: false,
      },
      {
        session: 20,
        section: "All Sections",
        domain: "Simulation",
        title: "Full-Length Mock Test Review",
        details:
          "This session reviews a timed full-length mock test, walks through the error log, and turns recurring mistakes into a final practice plan before the Final Test.",
        asyncReinforcement:
          "Students complete the timed mock section from tutor and update their error log on LMS.",
        done: false,
      },
      {
        session: "Post 20",
        section: "All Sections",
        domain: "Assessment",
        title: "Final Test",
        details:
          "Run the final SAT-style assessment and summarize score growth against the target score, remaining gaps, and recommended next steps.",
        asyncReinforcement:
          "Upload score evidence, error log, and tutor notes before the next scheduled learning session.",
        done: false,
      },
    ],
  },
};

// Simulated async "API" call — mirrors getDashboardData() in lib/data.ts.
export async function getSatDashboardData(): Promise<SatDashboardData> {
  return dummySatData;
}