"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  FileText,
  Lightbulb,
  Star,
} from "lucide-react";

import type {
  TargetScholarship,
  TargetUniversity,
} from "@/lib/target-overview-types";

import {
  FUNDING_BADGE,
  MENTOR_STATUS_BADGE,
  MENTOR_STATUS_LABEL,
  SCHOLARSHIP_ICON,
  SCHOLARSHIPS_PER_PAGE,
} from "./constants";

interface ScholarshipsListProps {
  selectedUniversity: TargetUniversity | null;
  scholarships: TargetScholarship[];
  paginatedScholarships: TargetScholarship[];
  query?: string;
  onSeeAllScholarships?: () => void;
}

export default function ScholarshipsList({
  selectedUniversity,
  scholarships,
  paginatedScholarships,
  query = "",
  onSeeAllScholarships,
}: ScholarshipsListProps) {
  const router = useRouter();
  const normalizedQuery = query.trim().toLowerCase();

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
      {selectedUniversity ? (
        <>
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Scholarships for
              </p>

              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                {selectedUniversity.name}
              </h2>

              <p className="text-sm text-slate-500">
                {selectedUniversity.program}
              </p>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <span
                className="
                  flex h-6 w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                "
              >
                <Star className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
              </span>

              {scholarships.length} Available Scholarships
            </div>
          </div>

          <div className="flex flex-1 flex-col space-y-3">
            {paginatedScholarships.map((scholarship) => {
              const badge = SCHOLARSHIP_ICON[scholarship.fundingType];
              const BadgeIcon = badge.icon;

              const isMatch =
                normalizedQuery.length > 0 &&
                scholarship.name.toLowerCase().includes(normalizedQuery);

              return (
                <div
                  key={scholarship.id}
                  className={`
                    flex
                    flex-col
                    gap-4
                    rounded-xl
                    border
                    px-5 py-[18px]
                    transition-colors

                    ${
                      isMatch
                        ? "border-blue-300 bg-blue-50/60 ring-1 ring-blue-200"
                        : "border-slate-100 hover:border-slate-200"
                    }
                  `}
                >
                  {/* Icon + name + badge */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span
                        className={`
                          flex h-11 w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full

                          ${badge.iconBg}
                        `}
                      >
                        <BadgeIcon
                          className={`h-5 w-5 ${badge.iconColor}`}
                          strokeWidth={2}
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {scholarship.name}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                          <span
                            className={`
                              rounded-full
                              px-2
                              py-0.5
                              text-[11px]
                              font-semibold

                              ${FUNDING_BADGE[scholarship.fundingType]}
                            `}
                          >
                            {scholarship.fundingType}
                          </span>

                          <span
                            className={`
                              shrink-0
                              rounded-full
                              px-2
                              py-0.5
                              text-[11px]
                              font-semibold

                              ${MENTOR_STATUS_BADGE[scholarship.mentorStatus]}
                            `}
                          >
                            {MENTOR_STATUS_LABEL[scholarship.mentorStatus]}
                          </span>

                          {isMatch && (
                            <span
                              className="
                                rounded-full
                                bg-blue-600
                                px-2
                                py-0.5
                                text-[11px]
                                font-semibold
                                text-white
                              "
                            >
                              Matches search
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" strokeWidth={2} />

                            <div>
                              <p className="text-[11px] text-slate-400">
                                Deadline
                              </p>

                              <p className="font-medium text-slate-700">
                                {scholarship.deadline}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />

                            <div>
                              <p className="text-[11px] text-slate-400">
                                Coverage
                              </p>

                              <p className="font-medium text-slate-700">
                                {scholarship.coverage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons: View Details (navigates to the detail page) + Daftar Sekarang */}

                  <div className="flex items-center justify-end gap-2">
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
              When this page has fewer scholarships than a full page
              (e.g. the last page only has 1 scholarship left), these
              keep the box the same height as a full page instead of
              shrinking to fit just the visible cards.
            */}
            {paginatedScholarships.length > 0 &&
              paginatedScholarships.length < SCHOLARSHIPS_PER_PAGE &&
              Array.from({
                length: SCHOLARSHIPS_PER_PAGE - paginatedScholarships.length,
              }).map((_, index) => (
                <div
                  key={`scholarship-placeholder-${index}`}
                  aria-hidden="true"
                  className="
                    invisible
                    flex
                    flex-1
                    flex-col
                    gap-4
                    rounded-xl
                    border
                    border-slate-100
                    px-5 py-[18px]
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            placeholder
                          </p>

                          <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold">
                            placeholder
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" strokeWidth={2} />

                            <div>
                              <p className="text-[11px] text-slate-400">
                                Deadline
                              </p>
                              <p className="font-medium text-slate-700">
                                placeholder
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" strokeWidth={2} />

                            <div>
                              <p className="text-[11px] text-slate-400">
                                Coverage
                              </p>
                              <p className="font-medium text-slate-700">
                                placeholder
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      placeholder
                    </span>
                    <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">
                      placeholder
                    </span>
                  </div>
                </div>
              ))}

            {scholarships.length === 0 && (
              <p
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-200
                  px-4 py-8
                  text-center
                  text-sm
                  text-slate-400
                "
              >
                No scholarships added for this university yet.
              </p>
            )}
          </div>

          <div
            className="
              mt-4
              flex
              flex-col
              gap-3
              rounded-xl
              bg-slate-50
              p-4

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-3">
              <span
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                "
              >
                <Lightbulb className="h-5 w-5 text-blue-600" strokeWidth={2} />
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Can&apos;t find the right scholarship?
                </p>

                <p className="text-xs text-slate-500">
                  Explore more scholarships that might fit this university.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onSeeAllScholarships}
              className="
                shrink-0
                rounded-xl
                bg-blue-600
                px-3.5 py-2
                text-xs
                font-semibold
                text-white
                hover:bg-blue-700
              "
            >
              See All Scholarships
            </button>
          </div>
        </>
      ) : (
        <p className="py-16 text-center text-sm text-slate-400">
          Select a university to see matching scholarships.
        </p>
      )}
    </div>
  );
}