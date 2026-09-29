import { AppNotification } from "./notifications";

export interface User {
  name: string;
  studentId: string;
  memberTier: string;
  avatarUrl?: string;
}

export interface ProgressStat {
  id: string;
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface NextAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface ScheduleEvent {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  mode: string;
  icon: string;
}

export interface Deadline {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  daysLeft: number;
  type: string;
}

export interface TargetProgram {
  id: string;
  category: string;
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
  nextActions: NextAction[];
  scheduleEvents: ScheduleEvent[];
  deadlines: Deadline[];
  targetPrograms: TargetProgram[];
}