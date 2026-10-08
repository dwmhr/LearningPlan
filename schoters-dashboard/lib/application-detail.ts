import {
  Target,
  TargetUniversity,
  TargetScholarship,
  isUniversity,
  isScholarship,
} from "./target-overview-types";
import { DocumentRequirement, DocumentStatus } from "./documents-types";
import { ApplicationStatus } from "./application-tracker-types";
import {
  getTargetOverviewData,
  dummyDocuments,
  recomputeUsedByCount,
  getRequirementsForTarget,
} from "./target-overview-data";
import { getApplicationTrackerData } from "./application-tracker-data";

// ---------------------------------------------------------------------------
// APPLICATION DETAIL — derived / joined data layer
// ---------------------------------------------------------------------------
// This page (Application Detail) doesn't own any data of its own. It shows
// one Target (university or scholarship) in full, by joining:
//   - lib/target-overview-data.ts  -> the target itself (name, program, deadline...)
//   - lib/application-tracker-data.ts -> the application's status/lastUpdatedDate
//   - lib/target-overview-data.ts (documents) -> resolved document requirements
//
// This mirrors exactly how DocumentsContent and ApplicationTrackerContent
// already join Target + Application/Documents. "View details" on either of
// those pages links to /application-detail/[targetId], which calls
// getApplicationDetail(targetId) below.
//
// MIGRASI API: getApplicationDetail() sekarang async, karena dia manggil
// getTargetOverviewData() dan getApplicationTrackerData() — dua-duanya
// sudah async (fetch ke API). dummyDocuments/recomputeUsedByCount/
// getRequirementsForTarget masih dipakai apa adanya; kalau nanti dokumen
// juga sudah ada endpoint-nya sendiri, tinggal ganti dummyDocuments di sini
// jadi hasil fetch juga.
//
// PENTING buat pemanggil: karena fungsi ini sekarang async, halaman yang
// manggil getApplicationDetail(targetId) harus di-`await`, atau kalau
// dipanggil dari client component, dibungkus di useEffect + useState
// (sama polanya kayak TargetOverviewSection / ApplicationTrackerContent).
// ---------------------------------------------------------------------------

export const applicationStatusOrder: ApplicationStatus[] = [
  "pending-approval",
  "not-started",
  "in-progress",
  "submitted",
  "accepted",
  "rejected",
  "withdrawn",
];

export interface ApplicationDetailView {
  target: Target;

  // Resolved application status. Falls back to "not-started" if this target
  // doesn't have an ApplicationEntry yet (e.g. user hasn't started it).
  status: ApplicationStatus;
  lastUpdatedDate: string | null;

  // Document requirements for this target, resolved live against the
  // user's document library (same resolution used on the Documents page).
  documentRequirements: DocumentRequirement[];
  documentsReadyCount: number;
  documentsTotalCount: number;

  // Only populated when target is a university: scholarships tied to it.
  relatedScholarships: TargetScholarship[];

  // Only populated when target is a scholarship: the university it belongs to.
  parentUniversity?: TargetUniversity;

  // Computed, data-driven notes (not free-text stored anywhere) — surfaces
  // mentor recommendation, missing documents, and upcoming deadlines.
  notes: string[];
}

export async function getApplicationDetail(
  targetId: string
): Promise<ApplicationDetailView | undefined> {
  // Target & Application sekarang datang dari dua endpoint berbeda —
  // di-fetch paralel biar gak nunggu bergantian. getTargetOverviewData()
  // balikin { universities, scholarships } terpisah, jadi di-flatten dulu
  // jadi satu array Target[] biar sama kayak sebelumnya (dummyTargets).
  const [targetData, applications] = await Promise.all([
    getTargetOverviewData(),
    getApplicationTrackerData(),
  ]);
  const targets: Target[] = [...targetData.universities, ...targetData.scholarships];

  const target = targets.find((t) => t.id === targetId);
  if (!target) return undefined;

  const application = applications.find((a) => a.targetId === targetId);
  const status: ApplicationStatus = application?.status ?? "not-started";

  const documents = recomputeUsedByCount(dummyDocuments);
  const documentRequirements = getRequirementsForTarget(target, documents);
  const documentsReadyCount = documentRequirements.filter(
    (r) => r.status === "ready"
  ).length;

  const relatedScholarships = isUniversity(target)
    ? targets.filter(
        (t): t is TargetScholarship =>
          isScholarship(t) && t.universityId === target.id
      )
    : [];

  const parentUniversity = isScholarship(target)
    ? targets.find(
        (t): t is TargetUniversity =>
          isUniversity(t) && t.id === target.universityId
      )
    : undefined;

  const notes = buildNotes({
    target,
    status,
    documentRequirements,
    documentsReadyCount,
  });

  return {
    target,
    status,
    lastUpdatedDate: application?.lastUpdatedDate ?? null,
    documentRequirements,
    documentsReadyCount,
    documentsTotalCount: documentRequirements.length,
    relatedScholarships,
    parentUniversity,
    notes,
  };
}

function buildNotes({
  target,
  status,
  documentRequirements,
  documentsReadyCount,
}: {
  target: Target;
  status: ApplicationStatus;
  documentRequirements: DocumentRequirement[];
  documentsReadyCount: number;
}): string[] {
  const notes: string[] = [];

  if (target.mentorStatus === "recommended-by-mentor") {
    notes.push(`Recommended by mentor for this ${target.category === "university" ? "program" : "scholarship"}.`);
  }

  const missing = documentRequirements.filter((r) => r.status !== "ready");
  if (missing.length > 0 && status !== "accepted" && status !== "rejected" && status !== "withdrawn") {
    const names = missing.map((r) => r.documentName).join(", ");
    notes.push(`Complete ${missing.length} remaining document${missing.length > 1 ? "s" : ""}: ${names}.`);
  } else if (documentRequirements.length > 0 && documentsReadyCount === documentRequirements.length) {
    notes.push("All required documents are ready.");
  }

  const days = daysFromToday(target.deadline);
  if (status !== "accepted" && status !== "rejected" && status !== "withdrawn" && status !== "submitted") {
    if (days < 0) {
      notes.push(`Deadline passed ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""} ago.`);
    } else if (days <= 30) {
      notes.push(`Deadline is in ${days} day${days !== 1 ? "s" : ""} — check requirements soon.`);
    }
  }

  return notes;
}

function daysFromToday(dateIso: string) {
  const target = new Date(`${dateIso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// Used by DocumentStatus badges on this page — kept local so this file
// stays self-contained for the detail page's needs.
export type { DocumentStatus };