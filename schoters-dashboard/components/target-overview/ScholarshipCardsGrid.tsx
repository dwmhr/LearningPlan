"use client";

import { useRouter } from "next/navigation";
import { Calendar, ExternalLink } from "lucide-react";

import type { TargetScholarship } from "@/lib/target-overview-types";

import {
  FUNDING_BADGE,
  MENTOR_STATUS_BADGE,
  MENTOR_STATUS_LABEL,
  SCHOLARSHIP_ICON,
} from "./constants";

interface ScholarshipCardsGridProps {
  scholarships: TargetScholarship[];
  onSelect?: (scholarshipId: string) => void;
  emptyLabel?: string;
}

export default function ScholarshipCardsGrid({
  scholarships,
  onSelect,
  emptyLabel = "No scholarships match your filters.",
}: ScholarshipCardsGridProps) {
  const router = useRouter();

  if (scholarships.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-100
          bg-white
          p-10
          text-center
          text-sm
          text-slate-400
          shadow-sm
        "
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4

        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {scholarships.map((scholarship) => {
        const badge = SCHOLARSHIP_ICON[scholarship.fundingType];
        const BadgeIcon = badge.icon;

        return (
          <div
            key={scholarship.id}
            onClick={() => onSelect?.(scholarship.id)}
            className="
              flex
              cursor-pointer
              flex-col
              gap-3
              rounded-xl
              border
              border-slate-100
              bg-white
              p-4
              text-left
              shadow-sm
              transition-shadow

              hover:shadow-md
            "
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`
                    flex h-10 w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full

                    ${badge.iconBg}
                  `}
                >
                  <BadgeIcon
                    className={`h-4.5 w-4.5 ${badge.iconColor}`}
                    strokeWidth={2}
                  />
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {scholarship.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {scholarship.coverage}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar
                className="h-3.5 w-3.5 text-slate-400"
                strokeWidth={2}
              />

              <span className="font-medium text-slate-700">
                Deadline: {scholarship.deadline}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`
                  w-fit
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-semibold

                  ${FUNDING_BADGE[scholarship.fundingType]}
                `}
              >
                {scholarship.fundingType}
              </span>

              <span
                className={`
                  w-fit
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-semibold

                  ${MENTOR_STATUS_BADGE[scholarship.mentorStatus]}
                `}
              >
                {MENTOR_STATUS_LABEL[scholarship.mentorStatus]}
              </span>
            </div>

            {/* Action buttons: View Details (navigates to the detail page) + Daftar Sekarang */}

            <div className="mt-1 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  router.push(`/application-detail/${scholarship.id}`);
                }}
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-slate-700
                  transition-colors

                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-600
                "
              >
                View Details
              </button>

              <a
                href={scholarship.registrationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-white
                  transition-colors

                  hover:bg-blue-700
                "
              >
                Apply Now
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}