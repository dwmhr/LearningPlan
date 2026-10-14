import { TimelineMonth, TimelinePhase, UpcomingItem } from "./timeline-types";

export const planDuration = "18-month plan";
export const journeySubtitle = "18-month personalized roadmap";

/* ------------------------------------------------------------------ */
/* Timeline months (Jul 2026 - Jul 2027)                               */
/* ------------------------------------------------------------------ */

export const timelineMonths: TimelineMonth[] = [
  { label: "Jul", year: 2026 },
  { label: "Aug", year: 2026 },
  { label: "Sep", year: 2026 },
  { label: "Oct", year: 2026 },
  { label: "Nov", year: 2026 },
  { label: "Dec", year: 2026 },
  { label: "Jan", year: 2027 },
  { label: "Feb", year: 2027 },
  { label: "Mar", year: 2027 },
  { label: "Apr", year: 2027 },
  { label: "May", year: 2027 },
  { label: "Jun", year: 2027 },
  { label: "Jul", year: 2027 },
];

/* ------------------------------------------------------------------ */
/* Phases                                                               */
/* ------------------------------------------------------------------ */

export const timelinePhases: TimelinePhase[] = [
  {
    id: "foundation",
    label: "Foundation",
    status: "current",
    dateRange: "Jul – Sep 2026",
    startMonthIndex: 0,
    durationMonths: 3,
    meta: "Grade X • Semester 1",
    description: "Build a strong academic foundation and explore opportunities.",
    monthlySchedule: [
      {
        month: "July 2026",
        activities: ["Academic assessment & goal setting", "Subject mapping and planning", "Build study routine"],
      },
      {
        month: "August 2026",
        activities: ["Strengthen core subjects", "Explore study abroad opportunities", "Begin university research"],
      },
      {
        month: "September 2026",
        activities: ["Portfolio planning & brainstorming", "IELTS diagnostic test", "Track progress & reflect"],
      },
    ],
    strategySteps: [
      "Strengthen Math & Science",
      "Build effective study habits",
      "Complete key assignments",
      "Regular progress review",
      "Research target universities",
      "Understand admission req.",
    ],
  },
  {
    id: "portfolio-building",
    label: "Portfolio Building",
    status: "upcoming",
    dateRange: "Sep – Dec 2026",
    startMonthIndex: 2,
    durationMonths: 4,
    meta: "Grade X • Semester 1",
    description: "Shape a portfolio that reflects your strengths and interests.",
    monthlySchedule: [
      { month: "September 2026", activities: ["Brainstorm portfolio themes", "Collect past work samples", "Set portfolio milestones"] },
      { month: "October 2026", activities: ["Draft key portfolio pieces", "Get feedback from mentors", "Refine personal statement ideas"] },
      { month: "November 2026", activities: ["Polish top portfolio pieces", "Organize supporting documents", "Start recommendation letter requests"] },
      { month: "December 2026", activities: ["Finalize portfolio layout", "Proofread & format everything", "Prepare submission checklist"] },
    ],
    strategySteps: [
      "Select strongest work samples",
      "Write reflective captions",
      "Balance breadth and depth",
      "Review with a mentor",
      "Draft personal statement",
    
    ],
  },
  {
    id: "ielts-preparation",
    label: "IELTS Preparation",
    status: "upcoming",
    dateRange: "Jan – Mar 2027",
    startMonthIndex: 6,
    durationMonths: 3,
    meta: "Grade X • Semester 2",
    description: "Sharpen English proficiency and hit your target IELTS score.",
    monthlySchedule: [
      { month: "January 2027", activities: ["Baseline practice test", "Build a study schedule", "Focus on listening & reading"] },
      { month: "February 2027", activities: ["Targeted speaking practice", "Writing task feedback sessions", "Weekly mock tests"] },
      { month: "March 2027", activities: ["Full-length mock exams", "Review weak areas", "Register & sit the IELTS exam"] },
    ],
    strategySteps: [
      "Daily listening practice",
      "Timed reading passages",
      "Track common mistakes",
      "Expand academic vocabulary",
      "Weekly speaking practice",
      "Writing task templates",
    ],
  },
  {
    id: "sat-preparation",
    label: "SAT Preparation",
    status: "upcoming",
    dateRange: "Mar – May 2027",
    startMonthIndex: 8,
    durationMonths: 3,
    meta: "Grade X • Semester 2",
    description: "Prepare thoroughly for the SAT to strengthen your applications.",
    monthlySchedule: [
      { month: "March 2027", activities: ["Diagnostic SAT test", "Identify focus areas", "Build a prep schedule"] },
      { month: "April 2027", activities: ["Targeted math & reading drills", "Weekly timed sections", "Track score improvements"] },
      { month: "May 2027", activities: ["Full-length practice tests", "Final review sessions", "Sit the SAT exam"] },
    ],
    strategySteps: [
      "Review key formulas",
      "Timed practice sets",
      "Track error patterns",
      "Focus on weak topics",
      "Daily reading passages",
      "Grammar rule review",
    ],
  },
  {
    id: "university-scholarships",
    label: "University & Scholarships",
    status: "upcoming",
    dateRange: "May – Jul 2027",
    startMonthIndex: 10,
    durationMonths: 3,
    meta: "Grade X • Semester 2",
    description: "Finalize university choices and pursue scholarship opportunities.",
    monthlySchedule: [
      { month: "May 2027", activities: ["Finalize university shortlist", "Confirm application requirements", "Draft scholarship essays"] },
      { month: "June 2027", activities: ["Submit university applications", "Apply to scholarships", "Prepare for interviews"] },
      { month: "July 2027", activities: ["Attend admission interviews", "Compare offers & financial aid", "Confirm final enrollment"] },
    ],
    strategySteps: [
      "Compare programs & rankings",
      "Check admission requirements",
      "Visit or attend info sessions",
      "Finalize target list",
      "Research scholarship options",
      "Track application deadlines",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Derived "What's next" list                                          */
/* ------------------------------------------------------------------ */

export const upcomingItems: UpcomingItem[] = timelinePhases
  .filter((phase) => phase.status !== "completed")
  .slice(0, 3)
  .map((phase) => ({
    id: phase.id,
    title: phase.label,
    dateRange: phase.dateRange,
  }));