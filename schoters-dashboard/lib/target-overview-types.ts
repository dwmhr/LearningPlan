// ---------------------------------------------------------------------------
// SHARED TARGET TYPES
// ---------------------------------------------------------------------------
// Ini adalah "source of truth" untuk data university & scholarship.
// Halaman Application Tracker dan Documents TIDAK menyimpan copy dari data
// ini lagi — mereka cukup menyimpan `targetId` dan melakukan lookup ke sini.
// ---------------------------------------------------------------------------

export type TargetCategory = "university" | "scholarship";

export type MentorRecommendationStatus =
  | "recommended-by-mentor"
  | "approved"
  | "awaiting-review"
  | "under-review"
  | "not-recommended";

export type ScholarshipFundingType =
  | "Fully Funded"
  | "Partially Funded"
  | "Not Funded";

// -- Base fields yang dipakai bersama oleh University & Scholarship --------
interface TargetBase {
  id: string;
  category: TargetCategory;
  name: string; // nama university ATAU nama scholarship
  program: string;
  country: string;
  deadline: string; // ISO date, e.g. "2026-11-30"
  readiness: number; // 0 - 100
  mentorStatus: MentorRecommendationStatus;

  // Sengaja TIDAK ada logoInitial/logoBg/logoText di sini. Itu murni
  // urusan tampilan (avatar bulat berwarna), jadi di-generate on-the-fly
  // di komponen lewat lib/logo-utils.ts (getLogoInitial(name),
  // getLogoColor(id)) — bukan disimpan sebagai data. Ini penting supaya
  // API nanti cukup ngirim id + name, gak perlu tau apa-apa soal Tailwind.

  // Link resmi pendaftaran untuk target ini. Dipakai oleh tombol
  // "Daftar Sekarang" di semua grid/list — beda-beda per item.
  registrationLink?: string;
}

export interface TargetUniversity extends TargetBase {
  category: "university";
}

export interface TargetScholarship extends TargetBase {
  category: "scholarship";
  universityId: string; // scholarship ini nempel ke university mana
  fundingType: ScholarshipFundingType;
  description: string;
  coverage: string; // e.g. "Tuition, Living allowance"
}

export type Target = TargetUniversity | TargetScholarship;

export interface TargetOverviewData {
  universities: TargetUniversity[];
  scholarships: TargetScholarship[];
}

// ---------------------------------------------------------------------------
// Helper type guards, dipakai di komponen kalau perlu narrow type
// ---------------------------------------------------------------------------
export function isUniversity(target: Target): target is TargetUniversity {
  return target.category === "university";
}

export function isScholarship(target: Target): target is TargetScholarship {
  return target.category === "scholarship";
}