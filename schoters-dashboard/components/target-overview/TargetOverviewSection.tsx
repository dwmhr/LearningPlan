"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowUpDown,
  Gift,
  GraduationCap,
  Globe,
  Landmark,
  LayoutGrid,
  Search,
} from "lucide-react";

import {
  Target,
  isScholarship,
  isUniversity,
} from "@/lib/target-overview-types";
import { getTargetOverviewData } from "@/lib/target-overview-data";

import CustomDropdown from "./CustomDropdown";
import PaginationBar from "./PaginationBar";
import ScholarshipCardsGrid from "./ScholarshipCardsGrid";
import ScholarshipsList from "./ScholarshipsList";
import UniversityCardsGrid from "./UniversityCardsGrid";
import UniversityList from "./UniversityList";

import {
  SCHOLARSHIPS_PER_PAGE,
  SORT_OPTIONS,
  UNIVERSITIES_PER_PAGE,
  type SortOption,
} from "./constants";

const TABS = ["All", "University", "Scholarship"] as const;

const TAB_ICON: Record<(typeof TABS)[number], typeof LayoutGrid> = {
  All: LayoutGrid,
  University: Landmark,
  Scholarship: Gift,
};

// ---------------------------------------------------------------------------
// Catatan migrasi:
// Komponen ini sekarang fetch data dari getTargetOverviewData() lewat
// useState + useEffect, bukan lagi baca dummyTargets langsung. Selama
// fetch berjalan, `targets` tetap array kosong (isLoading = true) supaya
// semua derived value (universities/scholarships/dst) tetap aman jalan
// tanpa perlu null-check di banyak tempat.
//
// Tombol "Add Target", serta aksi edit/delete dan "Start Application" sudah
// dihapus — setiap university/scholarship sekarang cuma punya satu tombol
// "Daftar Sekarang" yang langsung membuka `registrationLink` milik item itu
// di tab baru.
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
        // getTargetOverviewData() balikin { universities, scholarships }
        // terpisah — di-flatten jadi satu array Target[] karena semua
        // logic di bawah (filter isUniversity/isScholarship, dst) masih
        // mengasumsikan satu array gabungan seperti dummyTargets dulu.
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

  const universities = useMemo(
    () => targets.filter(isUniversity),
    [targets],
  );

  const scholarships = useMemo(
    () => targets.filter(isScholarship),
    [targets],
  );

  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("all");
  const [major, setMajor] = useState("all");

  const [sort, setSort] =
    useState<SortOption>("readiness-desc");

  const [selectedId, setSelectedId] = useState("");

  // Begitu data universities datang dari fetch, pilih yang pertama sebagai
  // default kalau belum ada yang dipilih. Pakai ini menggantikan
  // `useState(universities[0]?.id ?? "")` yang cuma jalan sekali di initial
  // render, karena sekarang universities kosong di render pertama.
  useEffect(() => {
    if (!selectedId && universities.length > 0) {
      setSelectedId(universities[0].id);
    }
  }, [universities, selectedId]);

  const [currentPage, setCurrentPage] = useState(1);
  const [scholarshipPage, setScholarshipPage] =
    useState(1);

  const normalizedQuery = query.trim().toLowerCase();

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          universities.map(
            (university) => university.country,
          ),
        ),
      ),
    [universities],
  );

  const majors = useMemo(
    () =>
      Array.from(
        new Set(
          universities.map(
            (university) => university.program,
          ),
        ),
      ),
    [universities],
  );

  const filteredUniversities = useMemo(() => {
    const filtered = universities.filter(
      (university) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          university.name
            .toLowerCase()
            .includes(normalizedQuery) ||
          university.program
            .toLowerCase()
            .includes(normalizedQuery) ||
          scholarships.some(
            (scholarship) =>
              scholarship.universityId === university.id &&
              scholarship.name
                .toLowerCase()
                .includes(normalizedQuery),
          );

        const matchesCountry =
          country === "all" ||
          university.country === country;

        const matchesMajor =
          major === "all" ||
          university.program === major;

        return (
          matchesQuery &&
          matchesCountry &&
          matchesMajor
        );
      },
    );

    return [...filtered].sort((a, b) => {
      if (sort === "readiness-desc") {
        return b.readiness - a.readiness;
      }

      if (sort === "readiness-asc") {
        return a.readiness - b.readiness;
      }

      if (sort === "deadline-asc") {
        return (
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      if (sort === "deadline-desc") {
        return (
          new Date(b.deadline).getTime() -
          new Date(a.deadline).getTime()
        );
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    universities,
    scholarships,
    normalizedQuery,
    country,
    major,
    sort,
  ]);

  // Flat list of ALL scholarships (across every university), filtered by the
  // same search/country/major controls, used by the "Scholarship" grid tab.
  const filteredScholarships = useMemo(() => {
    const filtered = scholarships.filter((scholarship) => {
      const parentUniversity = universities.find(
        (university) => university.id === scholarship.universityId,
      );

      const matchesQuery =
        normalizedQuery.length === 0 ||
        scholarship.name.toLowerCase().includes(normalizedQuery) ||
        parentUniversity?.name.toLowerCase().includes(normalizedQuery);

      const matchesCountry =
        country === "all" ||
        parentUniversity?.country === country;

      const matchesMajor =
        major === "all" ||
        parentUniversity?.program === major;

      return matchesQuery && matchesCountry && matchesMajor;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "readiness-desc") {
        return b.readiness - a.readiness;
      }

      if (sort === "readiness-asc") {
        return a.readiness - b.readiness;
      }

      if (sort === "deadline-asc") {
        return (
          new Date(a.deadline).getTime() -
          new Date(b.deadline).getTime()
        );
      }

      if (sort === "deadline-desc") {
        return (
          new Date(b.deadline).getTime() -
          new Date(a.deadline).getTime()
        );
      }

      return a.name.localeCompare(b.name);
    });
  }, [
    scholarships,
    universities,
    normalizedQuery,
    country,
    major,
    sort,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    query,
    country,
    major,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUniversities.length /
        UNIVERSITIES_PER_PAGE,
    ),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginatedUniversities = useMemo(() => {
    const start =
      (currentPage - 1) *
      UNIVERSITIES_PER_PAGE;

    return filteredUniversities.slice(
      start,
      start + UNIVERSITIES_PER_PAGE,
    );
  }, [
    filteredUniversities,
    currentPage,
  ]);

  const selectedUniversity =
    filteredUniversities.find(
      (university) =>
        university.id === selectedId,
    ) ??
    filteredUniversities[0] ??
    null;

  const universityScholarships = useMemo(() => {
    if (!selectedUniversity) {
      return [];
    }

    return scholarships.filter(
      (scholarship) =>
        scholarship.universityId ===
        selectedUniversity.id,
    );
  }, [
    scholarships,
    selectedUniversity,
  ]);

  // Reset to page 1 when switching university. If the search query matches
  // a scholarship that lives on a later page, jump straight to that page
  // instead so the user doesn't have to hunt for it manually.
  useEffect(() => {
    if (normalizedQuery.length === 0) {
      setScholarshipPage(1);
      return;
    }

    const matchIndex = universityScholarships.findIndex(
      (scholarship) =>
        scholarship.name
          .toLowerCase()
          .includes(normalizedQuery),
    );

    if (matchIndex !== -1) {
      const matchPage =
        Math.floor(matchIndex / SCHOLARSHIPS_PER_PAGE) + 1;
      setScholarshipPage(matchPage);
    } else {
      setScholarshipPage(1);
    }
  }, [
    selectedUniversity?.id,
    universityScholarships,
    normalizedQuery,
  ]);

  const scholarshipTotalPages = Math.max(
    1,
    Math.ceil(
      universityScholarships.length /
        SCHOLARSHIPS_PER_PAGE,
    ),
  );

  useEffect(() => {
    if (
      scholarshipPage >
      scholarshipTotalPages
    ) {
      setScholarshipPage(
        scholarshipTotalPages,
      );
    }
  }, [
    scholarshipPage,
    scholarshipTotalPages,
  ]);

  const paginatedScholarships = useMemo(() => {
    const start =
      (scholarshipPage - 1) *
      SCHOLARSHIPS_PER_PAGE;

    return universityScholarships.slice(
      start,
      start + SCHOLARSHIPS_PER_PAGE,
    );
  }, [
    universityScholarships,
    scholarshipPage,
  ]);

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

      <div
        className="
          mb-4
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-slate-100
          bg-white
          p-3
          shadow-sm

          lg:flex-row
          lg:items-center
        "
      >
        <div className="flex w-fit shrink-0 items-center gap-1 rounded-2xl bg-slate-50 p-1.5">
          {TABS.map((t) => {
            const Icon = TAB_ICON[t];
            const isActive = tab === t;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
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
          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              h-4
              w-4
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search targets..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              py-2.5
              pl-10
              pr-3.5
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
              focus:border-blue-300
              focus:ring-2
              focus:ring-blue-100
            "
          />
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <CustomDropdown
            icon={Globe}
            value={country}
            options={[
              {
                value: "all",
                label: "All Countries",
              },
              ...countries.map(
                (countryName) => ({
                  value: countryName,
                  label: countryName,
                }),
              ),
            ]}
            onChange={setCountry}
          />

          <CustomDropdown
            icon={GraduationCap}
            value={major}
            options={[
              {
                value: "all",
                label: "All Majors",
              },
              ...majors.map(
                (majorName) => ({
                  value: majorName,
                  label: majorName,
                }),
              ),
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
        <div
          className="
            grid
            grid-cols-1
            gap-x-6
            gap-y-4

            lg:grid-cols-2
            lg:grid-rows-[auto_auto]
            lg:items-stretch
          "
        >
          {/* Universities */}

          <div
            className="
              lg:col-start-1
              lg:row-start-1
              lg:h-full
            "
          >
            <UniversityList
              universities={paginatedUniversities}
              selectedUniversity={selectedUniversity}
              totalUniversities={filteredUniversities.length}
              onSelect={setSelectedId}
            />
          </div>

          {/* University Pagination */}

          <div
            className="
              lg:col-start-1
              lg:row-start-2
            "
          >
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUniversities.length}
              pageSize={UNIVERSITIES_PER_PAGE}
              onPageChange={setCurrentPage}
              itemLabel="universities"
            />
          </div>

          {/* Scholarships */}

          <div
            className="
              lg:col-start-2
              lg:row-start-1
              lg:h-full
            "
          >
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

          {/* Scholarship Pagination */}

          <div
            className="
              lg:col-start-2
              lg:row-start-2
            "
          >
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

      {/* University: flat grid of every university, same card style as the
          "All" tab's university list, using the same filtered data. */}

      {tab === "University" && (
        <UniversityCardsGrid
          universities={filteredUniversities}
          onSelect={(universityId) => {
            setSelectedId(universityId);
            setTab("All");
          }}
          emptyLabel="No universities match your filters."
        />
      )}

      {/* Scholarship: flat grid of every scholarship, across all universities */}

      {tab === "Scholarship" && (
        <ScholarshipCardsGrid
          scholarships={filteredScholarships}
          onSelect={(scholarshipId: string) => {
            const parentUniversity = universities.find((university) =>
              scholarships.some(
                (scholarship) =>
                  scholarship.id === scholarshipId &&
                  scholarship.universityId === university.id,
              ),
            );

            if (parentUniversity) {
              setSelectedId(parentUniversity.id);
            }

            setTab("All");
          }}
          emptyLabel="No scholarships match your filters."
        />
      )}

      {/* Tip: only relevant to the master-detail ("All") view */}

      {tab === "All" && (
        <div
          className="
            mt-6
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[#AFCBFF]
            bg-[#EAF3FF]
            px-4
            py-3.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-sm
              font-bold
              text-blue-600
              shadow-sm
            "
          >
            i
          </span>

          Tip: Click on a university to see scholarships that match your target!
        </div>
      )}
    </div>
  );
}