import type { TargetCategory } from "./target-overview-types";

export type DocumentStatus = "ready" | "in-progress" | "not-ready" | "not-required";

/**
 * Which group a document requirement belongs to on the Application
 * Detail > Documents tab:
 *  - "personal": reusable documents from the user's personal library
 *    (Passport, Academic Transcript, etc) — uploaded once, used across
 *    many applications.
 *  - "program": one-off documents specific to this particular
 *    university/scholarship application (Motivation Letter, Financial
 *    Statement, Research Proposal, Portfolio, etc).
 */
export type DocumentRequirementCategory = "personal" | "program";

/**
 * A personal document in the user's library ("My Documents").
 * Independent of any target — uploaded once, reused across multiple
 * university/scholarship applications. This exists from the start,
 * even before the user has any application targets.
 */
export interface DocumentItem {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconText: string;
  status: DocumentStatus;
  /** How many targets currently require a document with this name. Computed. */
  usedByCount: number;
  lastUpdatedDate: string | null;
}

export interface DocumentsData {
  documents: DocumentItem[];
}

/**
 * A single document requirement belonging to one target
 * (university/scholarship). Its `status` and `lastUpdatedDate` are
 * resolved automatically by matching `documentName` against the user's
 * personal document library (DocumentItem) — they are never set directly.
 * If no matching library document exists yet, the requirement is
 * "not-ready".
 */
export interface DocumentRequirement {
  id: string;
  targetId: string;
  documentName: string;
  /** Short helper text shown under the document name (Documents tab table). */
  description: string;
  /** Personal-library doc vs one-off required by this specific program. */
  category: DocumentRequirementCategory;
  icon: string;
  iconBg: string;
  iconText: string;
  status: DocumentStatus;
  lastUpdatedDate: string | null;
}

export interface TargetDocumentSummary {
  id: string;
  targetId: string;
  name: string;
  category: TargetCategory;
  badgeLabel: "University" | "Scholarship";
  totalDocuments: number;
  readyDocuments: number;
  readyCount: number;
  inProgressCount: number;
  notReadyCount: number;
  notRequiredCount: number;
}

export type { TargetCategory };