import type {
  UniversitySuggestion,
  ScholarshipSuggestion,
} from "@/components/target-overview/AddUniversityModal";

/**
 * Dummy catalog data used as a fallback inside AddUniversityModal
 * whenever the parent doesn't pass real suggestions yet.
 *
 * NOTE: adjust the import path above if `AddUniversityModal` doesn't
 * live at components/target-overview — match your actual alias.
 */

export const DUMMY_UNIVERSITY_SUGGESTIONS: UniversitySuggestion[] = [
  { id: "u1", name: "Chiba Institute of Technology", country: "Japan" },
  { id: "u2", name: "Hiroshima University", country: "Japan" },
  { id: "u3", name: "Hokkaido University", country: "Japan" },
  { id: "u4", name: "Kyoto University", country: "Japan" },
  { id: "u5", name: "Chiba University", country: "Japan" },
  { id: "u6", name: "University of Tokyo", country: "Japan" },
];

export const DUMMY_PROGRAM_SUGGESTIONS: string[] = [
  "Computer Science",
  "Advanced Robotics",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Data Science",
  "International Relations",
];

export const DUMMY_SCHOLARSHIP_SUGGESTIONS: ScholarshipSuggestion[] = [
  {
    id: "s1",
    universityId: "u1",
    name: "MEXT Technology Scholarship",
    fundingType: "Fully Funded",
    coverage: "Tuition, Living allowance",
    deadline: "2026-11-30",
  },
  {
    id: "s2",
    universityId: "u1",
    name: "International Student Support Grant",
    fundingType: "Partially Funded",
    coverage: "Partial Tuition",
    deadline: "2026-12-15",
  },
  {
    id: "s3",
    universityId: "u2",
    name: "Hiroshima Merit Award",
    fundingType: "Not Funded",
    coverage: "Full Tuition",
    deadline: "2027-01-10",
  },
  {
    id: "s4",
    universityId: "u4",
    name: "Kyoto Global Leaders Scholarship",
    fundingType: "Fully Funded",
    coverage: "Tuition, Living allowance, Flight",
    deadline: "2026-10-20",
  },
];