"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Award,
  Check,
  GraduationCap,
  Landmark,
  Search,
  X,
} from "lucide-react";

import type {
  ScholarshipFundingType,
} from "@/lib/target-overview-types";

import {
  FUNDING_BADGE,
} from "./constants";

import {
  DUMMY_UNIVERSITY_SUGGESTIONS,
  DUMMY_PROGRAM_SUGGESTIONS,
  DUMMY_SCHOLARSHIP_SUGGESTIONS,
} from "@/lib/dummy-data-add-university-target";

/**
 * A university the person can pick from while typing.
 * This is your catalog of known universities — not the
 * ones already added as targets.
 */
export interface UniversitySuggestion {
  id: string;
  name: string;
  country: string;
}

/**
 * A scholarship the person can optionally attach to the
 * new target. `coverage` / `deadline` are optional — pass
 * them in if you have them so the checklist shows detail.
 */
export interface ScholarshipSuggestion {
  id: string;
  universityId: string;
  name: string;
  fundingType: ScholarshipFundingType;
  coverage?: string;
  deadline?: string;
}

export interface NewUniversityTarget {
  universityId?: string;
  universityName: string;
  program?: string;
  scholarshipIds: string[];
}

interface AddUniversityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: NewUniversityTarget) => void;
  universitySuggestions?: UniversitySuggestion[];
  programSuggestions?: string[];
  scholarshipSuggestions?: ScholarshipSuggestion[];
}

export default function AddUniversityModal({
  isOpen,
  onClose,
  onSave,
  universitySuggestions = [],
  programSuggestions = [],
  scholarshipSuggestions = [],
}: AddUniversityModalProps) {
  // Fall back to the dummy catalog (from lib/) whenever the parent
  // didn't supply any suggestions yet — so this always has something
  // to show. Once real data is wired through props, this fallback
  // is simply never triggered.
  const effectiveUniversitySuggestions =
    universitySuggestions.length > 0
      ? universitySuggestions
      : DUMMY_UNIVERSITY_SUGGESTIONS;

  const effectiveProgramSuggestions =
    programSuggestions.length > 0
      ? programSuggestions
      : DUMMY_PROGRAM_SUGGESTIONS;

  const effectiveScholarshipSuggestions =
    scholarshipSuggestions.length > 0
      ? scholarshipSuggestions
      : DUMMY_SCHOLARSHIP_SUGGESTIONS;

  const [universityQuery, setUniversityQuery] =
    useState("");

  const [
    selectedUniversityId,
    setSelectedUniversityId,
  ] = useState<string | undefined>(undefined);

  const [isUniversityOpen, setIsUniversityOpen] =
    useState(false);

  const [program, setProgram] = useState("");
  const [isProgramOpen, setIsProgramOpen] =
    useState(false);

  const [
    selectedScholarshipIds,
    setSelectedScholarshipIds,
  ] = useState<string[]>([]);

  const universityRef = useRef<HTMLDivElement>(null);
  const programRef = useRef<HTMLDivElement>(null);

  // Reset the form every time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setUniversityQuery("");
      setSelectedUniversityId(undefined);
      setProgram("");
      setSelectedScholarshipIds([]);
      setIsUniversityOpen(false);
      setIsProgramOpen(false);
    }
  }, [isOpen]);

  // Close whichever search dropdown is open on an outside click.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        universityRef.current &&
        !universityRef.current.contains(target)
      ) {
        setIsUniversityOpen(false);
      }

      if (
        programRef.current &&
        !programRef.current.contains(target)
      ) {
        setIsProgramOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const filteredUniversities = useMemo(() => {
    const normalized = universityQuery
      .trim()
      .toLowerCase();

    if (normalized.length === 0) {
      return effectiveUniversitySuggestions.slice(0, 6);
    }

    return effectiveUniversitySuggestions
      .filter((university) =>
        university.name
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 6);
  }, [universityQuery, effectiveUniversitySuggestions]);

  const filteredPrograms = useMemo(() => {
    const normalized = program.trim().toLowerCase();

    if (normalized.length === 0) {
      return effectiveProgramSuggestions.slice(0, 6);
    }

    return effectiveProgramSuggestions
      .filter((option) =>
        option.toLowerCase().includes(normalized),
      )
      .slice(0, 6);
  }, [program, effectiveProgramSuggestions]);

  const availableScholarships = useMemo(() => {
    if (!selectedUniversityId) {
      return [];
    }

    return effectiveScholarshipSuggestions.filter(
      (scholarship) =>
        scholarship.universityId === selectedUniversityId,
    );
  }, [effectiveScholarshipSuggestions, selectedUniversityId]);

  const canSave = universityQuery.trim().length > 0;

  function handleSelectUniversity(
    university: UniversitySuggestion,
  ) {
    setUniversityQuery(university.name);
    setSelectedUniversityId(university.id);
    setSelectedScholarshipIds([]);
    setIsUniversityOpen(false);
  }

  function toggleScholarship(scholarshipId: string) {
    setSelectedScholarshipIds((current) =>
      current.includes(scholarshipId)
        ? current.filter((id) => id !== scholarshipId)
        : [...current, scholarshipId],
    );
  }

  function handleSave() {
    if (!canSave) {
      return;
    }

    onSave({
      universityId: selectedUniversityId,
      universityName: universityQuery.trim(),
      program: program.trim() || undefined,
      scholarshipIds: selectedScholarshipIds,
    });

    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-slate-900/40
        px-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex w-full max-w-2xl
          max-h-[88vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-slate-100
          bg-white
          shadow-xl
          shadow-slate-900/10
        "
      >
        {/* Header */}
        <div
          className="
            flex shrink-0 items-start justify-between gap-3
            border-b border-slate-100
            px-6 py-5
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-blue-100
              "
            >
              <Landmark
                className="h-5 w-5 text-blue-600"
                strokeWidth={2}
              />
            </span>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Add University Target
              </h2>

              <p className="text-xs text-slate-500">
                Search a university and set up your target.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-50 hover:text-slate-600
            "
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* University search */}
          <div ref={universityRef} className="relative">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              University
              <span className="ml-0.5 text-blue-600">*</span>
            </label>

            <div className="relative">
              <Search
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={universityQuery}
                onChange={(event) => {
                  setUniversityQuery(event.target.value);
                  setSelectedUniversityId(undefined);
                  setSelectedScholarshipIds([]);
                  setIsUniversityOpen(true);
                }}
                onFocus={() => setIsUniversityOpen(true)}
                placeholder="Search or type a university..."
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-white
                  py-2.5 pl-10 pr-3.5
                  text-sm text-slate-700
                  outline-none
                  placeholder:text-slate-400
                  focus:border-blue-300
                  focus:ring-2 focus:ring-blue-100
                "
              />
            </div>

            {isUniversityOpen &&
              filteredUniversities.length > 0 && (
                <div
                  className="
                    absolute left-0 right-0 top-[calc(100%+6px)]
                    z-20
                    overflow-hidden
                    rounded-xl
                    border border-slate-100
                    bg-white
                    py-1
                    shadow-lg shadow-slate-200/60
                  "
                >
                  {filteredUniversities.map(
                    (university) => (
                      <button
                        key={university.id}
                        type="button"
                        onClick={() =>
                          handleSelectUniversity(
                            university,
                          )
                        }
                        className="
                          flex w-full items-center gap-2.5
                          px-3.5 py-2.5
                          text-left
                          transition-colors
                          hover:bg-slate-50
                        "
                      >
                        <span
                          className="
                            flex h-8 w-8 shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-slate-100
                          "
                        >
                          <Landmark
                            className="h-4 w-4 text-slate-500"
                            strokeWidth={2}
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {university.name}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {university.country}
                          </p>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              )}

            {isUniversityOpen &&
              universityQuery.trim().length > 0 &&
              filteredUniversities.length === 0 && (
                <div
                  className="
                    absolute left-0 right-0 top-[calc(100%+6px)]
                    z-20
                    rounded-xl
                    border border-slate-100
                    bg-white
                    px-3.5 py-3
                    text-xs text-slate-400
                    shadow-lg shadow-slate-200/60
                  "
                >
                  No match found — you can still use &quot;
                  {universityQuery.trim()}&quot; as a custom entry.
                </div>
              )}
          </div>

          {/* Program / major */}
          <div ref={programRef} className="relative">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Program / Major
            </label>

            <div className="relative">
              <GraduationCap
                className="
                  pointer-events-none
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={program}
                onChange={(event) => {
                  setProgram(event.target.value);
                  setIsProgramOpen(true);
                }}
                onFocus={() => setIsProgramOpen(true)}
                placeholder="e.g. Computer Science"
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-white
                  py-2.5 pl-10 pr-3.5
                  text-sm text-slate-700
                  outline-none
                  placeholder:text-slate-400
                  focus:border-blue-300
                  focus:ring-2 focus:ring-blue-100
                "
              />
            </div>

            {isProgramOpen &&
              filteredPrograms.length > 0 && (
                <div
                  className="
                    absolute left-0 right-0 top-[calc(100%+6px)]
                    z-20
                    overflow-hidden
                    rounded-xl
                    border border-slate-100
                    bg-white
                    py-1
                    shadow-lg shadow-slate-200/60
                  "
                >
                  {filteredPrograms.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setProgram(option);
                        setIsProgramOpen(false);
                      }}
                      className="
                        w-full
                        px-3.5 py-2
                        text-left text-sm text-slate-600
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Scholarships — shown once a university is picked */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              Scholarships
              <span className="ml-0.5 text-xs font-normal text-slate-400">
                (optional, pick as many as apply)
              </span>
            </label>

            {!selectedUniversityId ? (
              <div
                className="
                  flex items-center gap-2.5
                  rounded-2xl
                  border border-dashed border-slate-200
                  bg-slate-50/60
                  px-4 py-4
                "
              >
                <Award
                  className="h-4 w-4 shrink-0 text-slate-400"
                  strokeWidth={2}
                />

                <p className="text-xs text-slate-500">
                  Pick a university from the suggestions above
                  to see its available scholarships.
                </p>
              </div>
            ) : (
              <div
                className="
                  max-h-60
                  space-y-1
                  overflow-y-auto
                  rounded-2xl
                  border border-slate-100
                  bg-white
                  p-2
                  shadow-sm
                "
              >
                {availableScholarships.map((scholarship) => {
                  const isChecked =
                    selectedScholarshipIds.includes(
                      scholarship.id,
                    );

                  return (
                    <button
                      key={scholarship.id}
                      type="button"
                      onClick={() =>
                        toggleScholarship(scholarship.id)
                      }
                      className={`
                        flex w-full items-start gap-3
                        rounded-xl
                        px-3 py-2.5
                        text-left
                        transition-colors

                        ${
                          isChecked
                            ? "bg-blue-50"
                            : "hover:bg-slate-50"
                        }
                      `}
                    >
                      <span
                        className={`
                          mt-0.5 flex h-5 w-5 shrink-0
                          items-center justify-center
                          rounded-md border-2
                          transition-colors

                          ${
                            isChecked
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 bg-white"
                          }
                        `}
                      >
                        {isChecked && (
                          <Check
                            className="h-3 w-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-800">
                          {scholarship.name}
                        </span>

                        <span className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`
                              rounded-full
                              px-2 py-0.5
                              text-[10px] font-semibold

                              ${
                                FUNDING_BADGE[
                                  scholarship.fundingType
                                ]
                              }
                            `}
                          >
                            {scholarship.fundingType}
                          </span>

                          {scholarship.coverage && (
                            <span className="text-[11px] text-slate-500">
                              {scholarship.coverage}
                            </span>
                          )}

                          {scholarship.deadline && (
                            <span className="text-[11px] text-slate-400">
                              · Deadline {scholarship.deadline}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}

                {availableScholarships.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-slate-400">
                    No scholarships found for this university yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex shrink-0 items-center justify-end gap-3
            border-t border-slate-100
            bg-slate-50/60
            px-6 py-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border border-slate-200
              px-4 py-2.5
              text-sm font-semibold text-slate-600
              transition-colors
              hover:bg-white
            "
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="
              rounded-xl
              bg-blue-600
              px-4 py-2.5
              text-sm font-semibold text-white
              shadow-sm
              transition-colors
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:bg-slate-200
              disabled:text-slate-400
              disabled:shadow-none
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}