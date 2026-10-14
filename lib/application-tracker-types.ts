import type { TargetCategory } from "./target-overview-types";

export type ApplicationStatus =
  | "pending-approval"
  | "not-started"
  | "in-progress"
  | "submitted"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface ApplicationEntry {
  id: string;
  targetId: string; // ref ke Target.id — semua data institusi/program/deadline diambil dari Target ini
  status: ApplicationStatus;
  lastUpdatedDate: string;
}

export interface ApplicationTrackerData {
  entries: ApplicationEntry[];
}

// Re-export biar ApplicationTrackerContent.tsx gak perlu import dari 2 file beda
export type { TargetCategory as ApplicationCategory };