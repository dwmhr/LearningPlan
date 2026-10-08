"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
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
  UNIVERSITIES_PER_PAGE,
} from "./constants";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

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

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
      {label}
    </div>
  );
}

/** "View Details" + "Apply Now" buttons, used by all four views. */
function ActionButtons({
  id,
  registrationLink,
  className = "",
}: {
  id: string;
  registrationLink?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={`flex items-center gap-2 sm:justify-end ${className}`}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          router.push(`/application-detail/${id}`);
        }}
        className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg sm:flex-none border border-slate-200 bg-white px-3 py-2 text-xs font-semibold sm:py-1.5 text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        View Details
      </button>

      <a
        href={registrationLink || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg sm:flex-none bg-blue-600 px-3 py-2 text-xs font-semibold sm:py-1.5 text-white transition-colors hover:bg-blue-700"
      >
        Apply Now
        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
      </a>
    </div>
  );
}

function MentorBadge({
  status,
  className = "px-2.5 py-1 text-xs",
}: {
  status: TargetUniversity["mentorStatus"];
  className?: string;
}) {
  return (
    <span
      className={`w-fit shrink-0 rounded-full font-semibold ${className} ${MENTOR_STATUS_BADGE[status]}`}
    >
      {MENTOR_STATUS_LABEL[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// University list (left column, "All" tab)
// ---------------------------------------------------------------------------

interface UniversityListProps {
  universities: TargetUniversity[];
  selectedUniversity: TargetUniversity | null;
  totalUniversities: number;
  onSelect: (universityId: string) => void;
}

export function UniversityList({
  universities,
  selectedUniversity,
  totalUniversities,
  onSelect,
}: UniversityListProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Landmark className="h-5 w-5 text-slate-600" strokeWidth={2} />
        </span>

        <h2 className="text-lg font-bold text-slate-900">
          Universities ({totalUniversities})
        </h2>
      </div>

      <div className="flex flex-1 flex-col gap-4 sm:gap-6">
        {universities.map((university) => {
          const isActive = selectedUniversity?.id === university.id;

          return (
            <div
              key={university.id}
              onClick={() => onSelect(university.id)}
              className={`cursor-pointer rounded-xl border px-4 py-4 text-left shadow-sm sm:px-5 transition-colors ${
                isActive
                  ? "border-blue-200 bg-blue-50/60"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                    isActive
                      ? "border-blue-200 bg-blue-100"
                      : "border-slate-100 bg-slate-100"
                  }`}
                >
                  <Landmark
                    className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-slate-500"}`}
                    strokeWidth={2}
                  />
                </span>

                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-base font-bold text-slate-900">
                      {university.name}
                    </p>
                    <MentorBadge status={university.mentorStatus} />
                  </div>

                  <p className="truncate text-sm text-slate-500">
                    {university.program}
                  </p>

                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400" strokeWidth={2} />
                    <span className="font-medium text-slate-700">
                      Deadline: {formatDeadline(university.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              <ActionButtons
                id={university.id}
                registrationLink={university.registrationLink}
                className="mt-3"
              />
            </div>
          );
        })}

        {/* Invisible placeholders keep the box the same height on the last page. */}
        {universities.length > 0 &&
          universities.length < UNIVERSITIES_PER_PAGE &&
          Array.from({
            length: UNIVERSITIES_PER_PAGE - universities.length,
          }).map((_, index) => (
            <div
              key={`university-placeholder-${index}`}
              aria-hidden="true"
              className="invisible rounded-xl border border-slate-100 px-5 py-4"
            >
              <div className="flex items-start gap-3">
                <span className="h-10 w-10 shrink-0 rounded-lg" />
                <div className="flex flex-col gap-1.5">
                  <p className="text-base font-bold">placeholder</p>
                  <p className="text-sm">placeholder</p>
                  <p className="text-sm">placeholder</p>
                </div>
              </div>
              <div className="mt-3 h-[30px]" />
            </div>
          ))}

        {totalUniversities === 0 && (
          <p className="px-2 py-8 text-center text-sm text-slate-400">
            No universities match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// University cards grid ("University" tab)
// ---------------------------------------------------------------------------

export function UniversityCardsGrid({
  universities,
  onSelect,
  emptyLabel = "No universities match your filters.",
}: {
  universities: TargetUniversity[];
  onSelect?: (universityId: string) => void;
  emptyLabel?: string;
}) {
  if (universities.length === 0) return <EmptyBox label={emptyLabel} />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {universities.map((university) => (
        <div
          key={university.id}
          onClick={() => onSelect?.(university.id)}
          className="flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-100">
              <Landmark className="h-4.5 w-4.5 text-slate-500" strokeWidth={2} />
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

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            <span className="font-medium text-slate-700">
              Deadline: {formatDeadline(university.deadline)}
            </span>
          </div>

          <MentorBadge status={university.mentorStatus} />

          <ActionButtons
            id={university.id}
            registrationLink={university.registrationLink}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scholarships of the selected university (right column, "All" tab)
// ---------------------------------------------------------------------------

interface ScholarshipsListProps {
  selectedUniversity: TargetUniversity | null;
  scholarships: TargetScholarship[];
  paginatedScholarships: TargetScholarship[];
  query?: string;
  onSeeAllScholarships?: () => void;
}

export function ScholarshipsList({
  selectedUniversity,
  scholarships,
  paginatedScholarships,
  query = "",
  onSeeAllScholarships,
}: ScholarshipsListProps) {
  const normalizedQuery = query.trim().toLowerCase();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      {selectedUniversity ? (
        <>
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-400">Scholarships for</p>
            <h2 className="mt-0.5 text-lg font-bold text-slate-900">
              {selectedUniversity.name}
            </h2>
            <p className="text-sm text-slate-500">{selectedUniversity.program}</p>
          </div>

          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Star className="h-3.5 w-3.5 text-blue-600" strokeWidth={2} />
            </span>
            {scholarships.length} Available Scholarships
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
                  className={`flex flex-col gap-4 rounded-xl border px-4 py-[18px] transition-colors sm:px-5 ${
                    isMatch
                      ? "border-blue-300 bg-blue-50/60 ring-1 ring-blue-200"
                      : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${badge.iconBg}`}
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
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${FUNDING_BADGE[scholarship.fundingType]}`}
                        >
                          {scholarship.fundingType}
                        </span>

                        <MentorBadge
                          status={scholarship.mentorStatus}
                          className="px-2 py-0.5 text-[11px]"
                        />

                        {isMatch && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                            Matches search
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                          <div>
                            <p className="text-[11px] text-slate-400">Deadline</p>
                            <p className="font-medium text-slate-700">
                              {scholarship.deadline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                          <div>
                            <p className="text-[11px] text-slate-400">Coverage</p>
                            <p className="font-medium text-slate-700">
                              {scholarship.coverage}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ActionButtons
                    id={scholarship.id}
                    registrationLink={scholarship.registrationLink}
                  />
                </div>
              );
            })}

            {/* Invisible placeholders keep the box the same height on the last page. */}
            {paginatedScholarships.length > 0 &&
              paginatedScholarships.length < SCHOLARSHIPS_PER_PAGE &&
              Array.from({
                length: SCHOLARSHIPS_PER_PAGE - paginatedScholarships.length,
              }).map((_, index) => (
                <div
                  key={`scholarship-placeholder-${index}`}
                  aria-hidden="true"
                  className="invisible flex flex-1 flex-col gap-4 rounded-xl border border-slate-100 px-5 py-[18px]"
                >
                  <div className="flex items-start gap-3">
                    <span className="h-11 w-11 shrink-0 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-bold">placeholder</p>
                      <div className="mt-3 text-xs">
                        <p className="text-[11px]">Deadline</p>
                        <p>placeholder</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-[30px]" />
                </div>
              ))}

            {scholarships.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-400">
                No scholarships added for this university yet.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
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
              className="w-full shrink-0 rounded-xl bg-blue-600 px-3.5 py-2 sm:w-auto text-xs font-semibold text-white hover:bg-blue-700"
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

// ---------------------------------------------------------------------------
// Scholarship cards grid ("Scholarship" tab)
// ---------------------------------------------------------------------------

export function ScholarshipCardsGrid({
  scholarships,
  onSelect,
  emptyLabel = "No scholarships match your filters.",
}: {
  scholarships: TargetScholarship[];
  onSelect?: (scholarshipId: string) => void;
  emptyLabel?: string;
}) {
  if (scholarships.length === 0) return <EmptyBox label={emptyLabel} />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {scholarships.map((scholarship) => {
        const badge = SCHOLARSHIP_ICON[scholarship.fundingType];
        const BadgeIcon = badge.icon;

        return (
          <div
            key={scholarship.id}
            onClick={() => onSelect?.(scholarship.id)}
            className="flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${badge.iconBg}`}
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

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
              <span className="font-medium text-slate-700">
                Deadline: {scholarship.deadline}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${FUNDING_BADGE[scholarship.fundingType]}`}
              >
                {scholarship.fundingType}
              </span>
              <MentorBadge status={scholarship.mentorStatus} />
            </div>

            <ActionButtons
              id={scholarship.id}
              registrationLink={scholarship.registrationLink}
              className="mt-1"
            />
          </div>
        );
      })}
    </div>
  );
}