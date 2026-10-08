"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Gift,
  Globe,
  GraduationCap,
  Landmark,
  LayoutGrid,
  Search,
  type LucideIcon,
} from "lucide-react";

import {
  type Target,
  isScholarship,
  isUniversity,
} from "@/lib/target-overview-types";
import { getTargetOverviewData } from "@/lib/target-overview-data";

import {
  ScholarshipCardsGrid,
  ScholarshipsList,
  UniversityCardsGrid,
  UniversityList,
} from "./TargetLists";

import {
  SCHOLARSHIPS_PER_PAGE,
  SORT_OPTIONS,
  UNIVERSITIES_PER_PAGE,
  type SortOption,
} from "./constants";

const TABS = ["All", "University", "Scholarship"] as const;

const TAB_ICON: Record<(typeof TABS)[number], LucideIcon> = {
  All: LayoutGrid,
  University: Landmark,
  Scholarship: Gift,
};

// ---------------------------------------------------------------------------
// Sorting (shared by universities and scholarships)
// ---------------------------------------------------------------------------

function sortItems<
  T extends { name: string; readiness: number; deadline: string },
>(items: T[], sort: SortOption): T[] {
  return [...items].sort((a, b) => {
    switch (sort) {
      case "readiness-desc":
        return b.readiness - a.readiness;
      case "readiness-asc":
        return a.readiness - b.readiness;
      case "deadline-asc":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "deadline-desc":
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

export default function TargetOverviewSection() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getTargetOverviewData()
      .then((data) => {
        if (!isMounted) return;
        // data = { universities, scholarships } -> flattened into one Target[]
        setTargets([...data.universities, ...data.scholarships]);
        setLoadError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("Failed to load targets. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const universities = useMemo(() => targets.filter(isUniversity), [targets]);
  const scholarships = useMemo(() => targets.filter(isScholarship), [targets]);

  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [major, setMajor] = useState("all");
  const [sort, setSort] = useState<SortOption>("readiness-desc");
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [scholarshipPage, setScholarshipPage] = useState(1);

  // Pick the first university by default once data arrives.
  useEffect(() => {
    if (!selectedId && universities.length > 0) {
      setSelectedId(universities[0].id);
    }
  }, [universities, selectedId]);

  const normalizedQuery = query.trim().toLowerCase();

  const countries = useMemo(
    () => Array.from(new Set(universities.map((u) => u.country))),
    [universities],
  );

  const majors = useMemo(
    () => Array.from(new Set(universities.map((u) => u.program))),
    [universities],
  );

  const filteredUniversities = useMemo(() => {
    const filtered = universities.filter((university) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        university.name.toLowerCase().includes(normalizedQuery) ||
        university.program.toLowerCase().includes(normalizedQuery) ||
        scholarships.some(
          (s) =>
            s.universityId === university.id &&
            s.name.toLowerCase().includes(normalizedQuery),
        );

      return (
        matchesQuery &&
        (country === "all" || university.country === country) &&
        (major === "all" || university.program === major)
      );
    });

    return sortItems(filtered, sort);
  }, [universities, scholarships, normalizedQuery, country, major, sort]);

  // Flat list of ALL scholarships, used by the "Scholarship" tab.
  const filteredScholarships = useMemo(() => {
    const filtered = scholarships.filter((scholarship) => {
      const parent = universities.find((u) => u.id === scholarship.universityId);

      const matchesQuery =
        normalizedQuery.length === 0 ||
        scholarship.name.toLowerCase().includes(normalizedQuery) ||
        parent?.name.toLowerCase().includes(normalizedQuery);

      return (
        matchesQuery &&
        (country === "all" || parent?.country === country) &&
        (major === "all" || parent?.program === major)
      );
    });

    return sortItems(filtered, sort);
  }, [scholarships, universities, normalizedQuery, country, major, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, country, major, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUniversities.length / UNIVERSITIES_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedUniversities = useMemo(() => {
    const start = (currentPage - 1) * UNIVERSITIES_PER_PAGE;
    return filteredUniversities.slice(start, start + UNIVERSITIES_PER_PAGE);
  }, [filteredUniversities, currentPage]);

  const selectedUniversity =
    filteredUniversities.find((u) => u.id === selectedId) ??
    filteredUniversities[0] ??
    null;

  const universityScholarships = useMemo(() => {
    if (!selectedUniversity) return [];
    return scholarships.filter((s) => s.universityId === selectedUniversity.id);
  }, [scholarships, selectedUniversity]);

  // Reset to page 1 when switching university; if the query matches a
  // scholarship on a later page, jump straight to that page.
  useEffect(() => {
    if (normalizedQuery.length === 0) {
      setScholarshipPage(1);
      return;
    }

    const matchIndex = universityScholarships.findIndex((s) =>
      s.name.toLowerCase().includes(normalizedQuery),
    );

    setScholarshipPage(
      matchIndex !== -1
        ? Math.floor(matchIndex / SCHOLARSHIPS_PER_PAGE) + 1
        : 1,
    );
  }, [selectedUniversity?.id, universityScholarships, normalizedQuery]);

  const scholarshipTotalPages = Math.max(
    1,
    Math.ceil(universityScholarships.length / SCHOLARSHIPS_PER_PAGE),
  );

  useEffect(() => {
    if (scholarshipPage > scholarshipTotalPages) {
      setScholarshipPage(scholarshipTotalPages);
    }
  }, [scholarshipPage, scholarshipTotalPages]);

  const paginatedScholarships = useMemo(() => {
    const start = (scholarshipPage - 1) * SCHOLARSHIPS_PER_PAGE;
    return universityScholarships.slice(start, start + SCHOLARSHIPS_PER_PAGE);
  }, [universityScholarships, scholarshipPage]);

  if (isLoading && targets.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16 text-sm font-medium text-slate-400 shadow-sm">
        Loading targets...
      </div>
    );
  }

  if (loadError && targets.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 p-16 text-sm font-medium text-rose-500 shadow-sm">
        {loadError}
      </div>
    );
  }

  return (
    <div>
      {/* Tabs + Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm xl:flex-row xl:items-center">
        <div className="flex w-full shrink-0 items-center gap-1 rounded-2xl bg-slate-50 p-1.5 xl:w-fit">
          {TABS.map((t) => {
            const Icon = TAB_ICON[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-bold sm:px-4 xl:flex-none transition-colors ${
                  tab === t
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {t}
              </button>
            );
          })}
        </div>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search targets..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex xl:flex-wrap xl:items-center">
          <CustomDropdown
            icon={Globe}
            value={country}
            options={[
              { value: "all", label: "All Countries" },
              ...countries.map((c) => ({ value: c, label: c })),
            ]}
            onChange={setCountry}
          />

          <CustomDropdown
            icon={GraduationCap}
            value={major}
            options={[
              { value: "all", label: "All Majors" },
              ...majors.map((m) => ({ value: m, label: m })),
            ]}
            onChange={setMajor}
          />

          <CustomDropdown
            icon={ArrowUpDown}
            value={sort}
            options={SORT_OPTIONS}
            onChange={setSort}
          />
        </div>
      </div>

      {/* All: 2-column master-detail layout */}
      {tab === "All" && (
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 xl:grid-cols-2 xl:grid-rows-[auto_auto] xl:items-stretch">
          <div className="xl:col-start-1 xl:row-start-1 xl:h-full">
            <UniversityList
              universities={paginatedUniversities}
              selectedUniversity={selectedUniversity}
              totalUniversities={filteredUniversities.length}
              onSelect={setSelectedId}
            />
          </div>

          <div className="xl:col-start-1 xl:row-start-2">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUniversities.length}
              pageSize={UNIVERSITIES_PER_PAGE}
              onPageChange={setCurrentPage}
              itemLabel="universities"
            />
          </div>

          <div className="xl:col-start-2 xl:row-start-1 xl:h-full">
            <ScholarshipsList
              selectedUniversity={selectedUniversity}
              scholarships={universityScholarships}
              paginatedScholarships={paginatedScholarships}
              query={query}
              onSeeAllScholarships={() => {
                setTab("Scholarship");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          <div className="xl:col-start-2 xl:row-start-2">
            {selectedUniversity && (
              <PaginationBar
                currentPage={scholarshipPage}
                totalPages={scholarshipTotalPages}
                totalItems={universityScholarships.length}
                pageSize={SCHOLARSHIPS_PER_PAGE}
                onPageChange={setScholarshipPage}
                itemLabel="scholarships"
              />
            )}
          </div>
        </div>
      )}

      {tab === "University" && (
        <UniversityCardsGrid
          universities={filteredUniversities}
          onSelect={(universityId) => {
            setSelectedId(universityId);
            setTab("All");
          }}
        />
      )}

      {tab === "Scholarship" && (
        <ScholarshipCardsGrid
          scholarships={filteredScholarships}
          onSelect={(scholarshipId) => {
            const scholarship = scholarships.find((s) => s.id === scholarshipId);
            if (scholarship) setSelectedId(scholarship.universityId);
            setTab("All");
          }}
        />
      )}

      {tab === "All" && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#AFCBFF] bg-[#EAF3FF] px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-sm">
            i
          </span>
          Tip: Click on a university to see scholarships that match your target!
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CustomDropdown
// ---------------------------------------------------------------------------

interface CustomDropdownProps<T extends string> {
  icon: LucideIcon;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

function CustomDropdown<T extends string>({
  icon: Icon,
  value,
  options,
  onChange,
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={wrapperRef} className="relative w-full xl:w-auto">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 xl:w-auto text-sm font-medium text-slate-600 transition-colors hover:border-slate-300"
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="flex-1 truncate text-left">{selected?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-y-auto xl:right-auto xl:w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60">
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {isActive && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PaginationBar
// ---------------------------------------------------------------------------

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "universities",
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const arrowClass =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex h-full flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {startItem} to {endItem} of {totalItems} {itemLabel}
      </p>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={arrowClass}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                page === currentPage
                  ? "border border-blue-200 bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={arrowClass}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}