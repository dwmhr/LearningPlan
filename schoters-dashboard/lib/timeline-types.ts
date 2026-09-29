export type PhaseStatus = "completed" | "current" | "upcoming";

export interface TimelineMonth {
  label: string; // e.g. "Jul"
  year: number; // e.g. 2026
}

export interface MonthlyScheduleItem {
  month: string; // e.g. "July 2026"
  activities: string[];
}

export interface TimelinePhase {
  id: string;
  label: string;
  status: PhaseStatus;
  dateRange: string; // e.g. "Jul – Sep 2026"
  /** 0-based index into TIMELINE_MONTHS marking when this phase starts */
  startMonthIndex: number;
  /** how many months (columns) this phase spans on the schedule */
  durationMonths: number;
  meta: string; // e.g. "Grade X • Semester 1"
  description: string;
  monthlySchedule: MonthlyScheduleItem[];
  /** Key priorities/action items for this phase, shown in Strategic Planning. */
  strategySteps: string[];
}

export interface UpcomingItem {
  id: string;
  title: string;
  dateRange: string;
}