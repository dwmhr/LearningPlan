"use client";

import { useRouter } from "next/navigation";
import { Calendar, ExternalLink, Landmark } from "lucide-react";

import type { TargetUniversity } from "@/lib/target-overview-types";

import {
  MENTOR_STATUS_BADGE,
  MENTOR_STATUS_LABEL,
  UNIVERSITIES_PER_PAGE,
} from "./constants";

interface UniversityListProps {
  universities: TargetUniversity[];
  selectedUniversity: TargetUniversity | null;
  totalUniversities: number;
  onSelect: (universityId: string) => void;
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

export default function UniversityList({
  universities,
  selectedUniversity,
  totalUniversities,
  onSelect,
}: UniversityListProps) {
  const router = useRouter();

  return (
    <div
      className="
        flex h-full
        flex-col
        rounded-2xl
        border border-slate-100
        bg-white
        p-5
        shadow-sm
      "
    >
      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <div className="flex items-center gap-2.5">
          <span
            className="
              flex h-9 w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-slate-100
            "
          >
            <Landmark
              className="h-5 w-5 text-slate-600"
              strokeWidth={2}
            />
          </span>

          <h2 className="text-lg font-bold text-slate-900">
            Universities ({totalUniversities})
          </h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {universities.map((university) => {
          const isActive = selectedUniversity?.id === university.id;

          return (
            <div
              key={university.id}
              onClick={() => onSelect(university.id)}
              className={`
                cursor-pointer
                rounded-xl
                border
                px-5 py-4
                text-left
                shadow-sm
                transition-colors

                ${
                  isActive
                    ? "border-blue-200 bg-blue-50/60"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              {/* Icon + name + badge + program + deadline */}

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`
                      flex h-10 w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border

                      ${
                        isActive
                          ? "border-blue-200 bg-blue-100"
                          : "border-slate-100 bg-slate-100"
                      }
                    `}
                  >
                    <Landmark
                      className={`
                        h-5 w-5

                        ${isActive ? "text-blue-600" : "text-slate-500"}
                      `}
                      strokeWidth={2}
                    />
                  </span>

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-bold text-slate-900">
                        {university.name}
                      </p>

                      <span
                        className={`
                          shrink-0
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
                    </div>

                    <p className="truncate text-sm text-slate-500">
                      {university.program}
                    </p>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar
                        className="h-4 w-4 text-slate-400"
                        strokeWidth={2}
                      />

                      <span className="font-medium text-slate-700">
                        Deadline: {formatDeadline(university.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons: View Details (navigates to the detail page) + Daftar Sekarang */}

              <div className="mt-3 flex items-center justify-end gap-2">
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
          );
        })}

        {/*
          Invisible placeholder cards.
          When this page has fewer items than a full page (e.g. the
          last page only has 1 university), these keep the box the
          same height as a full page instead of shrinking to fit
          just the visible cards.
        */}
        {universities.length > 0 &&
          universities.length < UNIVERSITIES_PER_PAGE &&
          Array.from({
            length: UNIVERSITIES_PER_PAGE - universities.length,
          }).map((_, index) => (
            <div
              key={`university-placeholder-${index}`}
              aria-hidden="true"
              className="
                invisible
                rounded-xl
                border
                border-slate-100
                px-5 py-4
              "
            >
              <div className="flex items-start justify-between gap-3">
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
                  />

                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-base font-bold text-slate-900">
                        placeholder
                      </p>

                      <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold">
                        placeholder
                      </span>
                    </div>

                    <p className="truncate text-sm text-slate-500">
                      placeholder
                    </p>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar
                        className="h-4 w-4 text-slate-400"
                        strokeWidth={2}
                      />

                      <span className="font-medium text-slate-700">
                        placeholder
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  placeholder
                </span>
                <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                  placeholder
                </span>
              </div>
            </div>
          ))}

        {totalUniversities === 0 && (
          <p
            className="
              px-2 py-8
              text-center
              text-sm
              text-slate-400
            "
          >
            No universities match your filters.
          </p>
        )}
      </div>
    </div>
  );
}