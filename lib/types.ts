import { AppNotification } from "./notifications";

/* ------------------- Shared / User ------------------- */

export type Product = "SAA" | "IELTS" | "SAT";

export interface User {
  name: string;
  studentId: string;
  memberTier: string;
  avatarUrl?: string;
  memberSince: string;
  subscriptions: Product[]; // contoh: ["SAA", "IELTS"]. Bundling = ketiganya
}

/* ------------------- Dashboard ------------------- */

export interface ProgressStat {
  id: string; // "overall" | "ielts" | "sat" | "document" — icon & color are derived from this in the UI
  label: string;
  value: number;
  monthlyDelta?: number; // optional, only "Overall Progress" uses this for now
}

export type PriorityLevel = "High" | "Medium" | "Low";
export type ActionCategory = "document" | "language-test" | "academic-practice" | "scholarship";

export interface NextAction {
  id: string;
  label: string;
  category: ActionCategory; // JENIS aksinya — ikon & warna sepenuhnya ditentukan di UI
  description: string; // e.g. "Complete and upload required documents"
  dueDate: string; // ISO date string, e.g. "2026-09-13"
  priority: PriorityLevel; // raw value only — UI decides the color/badge styling
}

export type ScheduleEventCategory = "ielts" | "saa" | "sat" | "other";

export interface ScheduleEvent {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  category: ScheduleEventCategory;
}

export type DeadlineType = "document" | "scholarship" | "university";

export interface Deadline {
  id: string;
  title: string;
  date: string;
  type: DeadlineType;
}

export type ProgramCategory = "UNIVERSITY" | "SCHOLARSHIP";

export interface TargetProgram {
  id: string;
  category: ProgramCategory;
  title: string;
  country: string;
  semester: string;
  status: string;
  deadline: string;
  readiness: number;
}

export interface DashboardData {
  user: User;
  notifications: AppNotification[];
  progressStats: ProgressStat[];
  progressUpdatedAt: string; // ISO date string, e.g. "2026-09-08T10:30:00Z"
  nextActions: NextAction[];
  scheduleEvents: ScheduleEvent[];
  deadlines: Deadline[];
  targetPrograms: TargetProgram[];
}

/* ------------------- Profile page ------------------- */

export interface ProfileStat {
  id: string;
  icon: string;
  label: string;
  value: string | string[];
}

export interface ProfileSection {
  id: string;
  label: string;
  description: string;
  weight: number;
  completed: boolean;
  icon: string;
  // bg & color sudah dipindah ke UI (lihat ID_COLOR_MAP di ProfileContent.tsx)
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  // bg & color sudah dipindah ke UI
}

export interface AcademicBackground {
  curriculum: string;
  average: string;
  achievementLevel: string;
}

export interface LanguageTestScore {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  status: string;
  // bg & color sudah dipindah ke UI
}

export interface ProfileData {
  user: User;
  profileStats: ProfileStat[];
  profileSections: ProfileSection[];
  faqItems: FaqItem[];
  academicBackground: AcademicBackground;
  languageTestScores: LanguageTestScore[];
}