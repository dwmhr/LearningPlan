import {
  GraduationCap,
  HandHeart,
  FileText,
  type LucideIcon,
} from "lucide-react";

import type {
  MentorRecommendationStatus,
  ScholarshipFundingType,
} from "@/lib/target-overview-types";

export const COUNTRY_DOT_COLOR: Record<string, string> = {
  Japan: "bg-red-500",
};

export const FUNDING_BADGE: Record<ScholarshipFundingType, string> = {
  "Fully Funded": "bg-emerald-50 text-emerald-600",
  "Partially Funded": "bg-amber-50 text-amber-600",
  "Not Funded": "bg-slate-100 text-slate-500",
};

export const SCHOLARSHIP_ICON: Record<
  ScholarshipFundingType,
  {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
  }
> = {
  "Fully Funded": {
    icon: GraduationCap,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  "Partially Funded": {
    icon: HandHeart,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  "Not Funded": {
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
};

// Label + badge color shown next to a university's (or scholarship's) name.
export const MENTOR_STATUS_LABEL: Record<MentorRecommendationStatus, string> = {
  "recommended-by-mentor": "Recommended by Mentor",
  approved: "Approved",
  "awaiting-review": "Awaiting Review",
  "under-review": "Under Review",
  "not-recommended": "Not Recommended",
};

export const MENTOR_STATUS_BADGE: Record<MentorRecommendationStatus, string> = {
  "recommended-by-mentor": "bg-blue-50 text-blue-600",
  approved: "bg-emerald-50 text-emerald-600",
  "awaiting-review": "bg-amber-50 text-amber-600",
  "under-review": "bg-indigo-50 text-indigo-600",
  "not-recommended": "bg-slate-100 text-slate-500",
};

export type SortOption =
  | "readiness-desc"
  | "readiness-asc"
  | "name-asc"
  | "deadline-asc"
  | "deadline-desc";

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "name-asc",
    label: "Name (A-Z)",
  },
  {
    value: "readiness-desc",
    label: "High to Low",
  },
  {
    value: "readiness-asc",
    label: "Low to High",
  },
  {
    value: "deadline-asc",
    label: "Soonest First",
  },
  {
    value: "deadline-desc",
    label: "Furthest First",
  },
];

export const UNIVERSITIES_PER_PAGE = 4;

export const SCHOLARSHIPS_PER_PAGE = 3;