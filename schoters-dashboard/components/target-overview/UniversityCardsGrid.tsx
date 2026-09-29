"use client";

import { useRouter } from "next/navigation";
import { Calendar, ExternalLink, Landmark } from "lucide-react";

import type { TargetUniversity } from "@/lib/target-overview-types";

import { MENTOR_STATUS_BADGE, MENTOR_STATUS_LABEL } from "./constants";

interface UniversityCardsGridProps {
  universities: TargetUniversity[];
  onSelect?: (universityId: string) => void;
  emptyLabel?: string;
}

function formatDeadline(deadline?: string) {
  if (!deadline) return "-";
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UniversityCardsGrid({
  universities,
  onSelect,
  emptyLabel = "No universities match your filters.",
}: UniversityCardsGridProps) {
  const router = useRouter();

  if (universities.length === 0) {
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
      {universities.map((university) => (
        <div
          key={university.id}
          onClick={() => onSelect?.(university.id)}
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
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-100
                  bg-slate-100
                "
              >
                <Landmark
                  className="h-4.5 w-4.5 text-slate-500"
                  strokeWidth={2}
                />
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {university.name}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {university.program}
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
              Deadline: {formatDeadline(university.deadline)}
            </span>
          </div>

          <span
            className={`
              w-fit
              rounded-full
              px-2.5
              py-1
              text-xs
              font-semibold

              ${MENTOR_STATUS_BADGE[university.mentorStatus]}
            `}
          >
            {MENTOR_STATUS_LABEL[university.mentorStatus]}
          </span>

          {/* Action buttons: View Details (navigates to the detail page) + Daftar Sekarang */}

          <div className="mt-1 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                router.push(`/application-detail/${university.id}`);
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
              href={university.registrationLink || "#"}
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
      ))}
    </div>
  );
}