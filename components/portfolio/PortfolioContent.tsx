"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef, type ReactNode } from "react";
import {
  Award,
  BarChart2,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Heart,
  Laptop,
  Lightbulb,
  LucideIcon,
  Search,
  Star,
  Target,
  Trophy,
  User,
  Users,
  Wallet,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import {
  portfolioItems,
  portfolioRecommendations,
  recommendationFocuses,
} from "@/lib/portfolio-data";
import {
  FocusIcon,
  ParticipationType,
  PortfolioItemCategory,
  PortfolioRecommendation,
} from "@/lib/portfolio-types";

/* ------------------------------------------------------------------ */
/* Icon + color lookups                                                */
/* NOTE: the keys below (e.g. "Semua", "Pengalaman Kerja") are the     */
/* values stored in the data layer, so they stay as-is. Only the text  */
/* shown to the user is translated, via the *_LABELS maps.             */
/* ------------------------------------------------------------------ */

const FOCUS_ICONS: Record<FocusIcon, { icon: LucideIcon; bg: string; color: string }> = {
  "bar-chart": { icon: BarChart2, bg: "bg-blue-50",    color: "text-blue-600"    },
  "file-text": { icon: FileText,  bg: "bg-violet-50",  color: "text-violet-600"  },
  users:       { icon: Users,     bg: "bg-emerald-50", color: "text-emerald-600" },
  award:       { icon: Award,     bg: "bg-amber-50",   color: "text-amber-600"   },
};

const ITEM_CATEGORY_COLORS: Record<PortfolioItemCategory, { bg: string; color: string }> = {
  Semua:              { bg: "bg-slate-100",   color: "text-slate-600"   },
  "Pengalaman Kerja": { bg: "bg-blue-50",     color: "text-blue-600"    },
  Sertifikat:         { bg: "bg-amber-50",    color: "text-amber-600"   },
  "Publikasi / Riset":{ bg: "bg-violet-50",   color: "text-violet-600"  },
  Proyek:             { bg: "bg-rose-50",     color: "text-rose-500"    },
  Organisasi:         { bg: "bg-emerald-50",  color: "text-emerald-600" },
  Volunteer:          { bg: "bg-orange-50",   color: "text-orange-500"  },
};

const ITEM_CATEGORY_ICONS: Record<PortfolioItemCategory, LucideIcon> = {
  Semua:              FileText,
  "Pengalaman Kerja": Briefcase,
  Sertifikat:         Star,
  "Publikasi / Riset":FileSearch,
  Proyek:             Laptop,
  Organisasi:         Users,
  Volunteer:          Heart,
};

/* English display labels for the data-layer category keys. */
const ITEM_CATEGORY_LABELS: Record<PortfolioItemCategory, string> = {
  Semua:              "All",
  "Pengalaman Kerja": "Work Experience",
  Sertifikat:         "Certificates",
  "Publikasi / Riset":"Publications / Research",
  Proyek:             "Projects",
  Organisasi:         "Organizations",
  Volunteer:          "Volunteer",
};

const RELEVANCE_COLOR: Record<string, string> = {
  "Sangat relevan": "text-blue-600",
  Relevan:          "text-emerald-600",
  "Cukup relevan":  "text-amber-500",
};

const RELEVANCE_LABELS: Record<string, string> = {
  "Sangat relevan": "Highly relevant",
  Relevan:          "Relevant",
  "Cukup relevan":  "Fairly relevant",
};

/* Recommendations = competitions. Domain is an open-ended string from the data,
   so the colors are a lookup with a neutral fallback for any domain not listed. */
const DOMAIN_STYLES: Record<string, { bg: string; color: string }> = {
  Olimpiade:  { bg: "bg-blue-50",    color: "text-blue-600"    },
  Penelitian: { bg: "bg-violet-50",  color: "text-violet-600"  },
  Esai:       { bg: "bg-emerald-50", color: "text-emerald-600" },
  Bisnis:     { bg: "bg-amber-50",   color: "text-amber-600"   },
  Desain:     { bg: "bg-rose-50",    color: "text-rose-500"    },
  Debat:      { bg: "bg-orange-50",  color: "text-orange-500"  },
};

const DOMAIN_LABELS: Record<string, string> = {
  Olimpiade:  "Olympiad",
  Penelitian: "Research",
  Esai:       "Essay",
  Bisnis:     "Business",
  Desain:     "Design",
  Debat:      "Debate",
};

const DEFAULT_DOMAIN_STYLE = { bg: "bg-slate-100", color: "text-slate-600" };

function domainLabel(domain: string): string {
  return DOMAIN_LABELS[domain] ?? domain;
}

const PARTICIPATION_META: Record<ParticipationType, { label: string; icon: LucideIcon }> = {
  individual: { label: "Individual", icon: User  },
  team:       { label: "Team",       icon: Users },
};

const REC_ITEMS_PER_PAGE = 5;

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                   */
/* ------------------------------------------------------------------ */

// timeZone "UTC" so an ISO date like "2026-04-12" never shifts a day
// depending on the viewer's timezone (and server/client render the same).
function formatDate(iso: string, withYear: boolean): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  };
  if (withYear) options.year = "numeric";
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(iso));
}

// "2 Mar – 12 Apr 2026" when both dates share a year, full dates otherwise.
function formatPeriod(start: string, end: string): string {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${formatDate(start, !sameYear)} – ${formatDate(end, true)}`;
}

// Fees are in Indonesian Rupiah, so the id-ID currency format (Rp 1.000.000) is kept on purpose.
function formatFee(fee: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(fee);
}

/* ------------------------------------------------------------------ */
/* Recommendation card                                                  */
/* ------------------------------------------------------------------ */

function RecommendationMeta({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm font-semibold text-slate-700">{children}</dd>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: PortfolioRecommendation }) {
  const domainStyle    = DOMAIN_STYLES[rec.domain] ?? DEFAULT_DOMAIN_STYLE;
  const relevanceColor = RELEVANCE_COLOR[rec.relevance] ?? "text-slate-500";
  const relevanceLabel = RELEVANCE_LABELS[rec.relevance] ?? rec.relevance;
  const participation  = PARTICIPATION_META[rec.participation];

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
      {/* Top: name, organizer, domain › subdomain, relevance, CTA */}
      <div className="flex flex-wrap items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${domainStyle.bg}`}>
          <Trophy className={`h-5 w-5 ${domainStyle.color}`} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 basis-32 sm:basis-64">
          <h3 className="text-sm font-bold leading-snug text-slate-900">{rec.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="min-w-0">{rec.organizer}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${domainStyle.bg} ${domainStyle.color}`}>
              {domainLabel(rec.domain)}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {rec.subdomain}
            </span>
          </div>
        </div>

        {/* Phones: own row, full width. sm and up: top-right like before */}
        <div className="flex w-full items-center gap-3 sm:ml-auto sm:w-auto sm:shrink-0">
          <span className={`flex items-center gap-1 text-xs font-semibold ${relevanceColor}`}>
            <BarChart2 className="h-3.5 w-3.5" strokeWidth={2} />
            {relevanceLabel}
          </span>
          <a
            href={rec.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-none sm:py-1.5"
          >
            Register
          </a>
        </div>
      </div>

      {/* Details: education level, level, period, participants, fee */}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 px-4 py-3 sm:grid-cols-3 xl:grid-cols-5">
        <RecommendationMeta icon={GraduationCap} label="Education Level">
          {rec.educationLevels.join(", ")}
        </RecommendationMeta>
        <RecommendationMeta icon={Globe} label="Level">
          {rec.level}
        </RecommendationMeta>
        <RecommendationMeta icon={CalendarDays} label="Period">
          {formatPeriod(rec.startDate, rec.endDate)}
        </RecommendationMeta>
        <RecommendationMeta icon={participation.icon} label="Participants">
          {participation.label}
        </RecommendationMeta>
        <RecommendationMeta icon={Wallet} label="Fee">
          {rec.fee === 0 ? (
            <span className="text-emerald-600">Free</span>
          ) : (
            formatFee(rec.fee)
          )}
        </RecommendationMeta>
      </dl>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

interface PortfolioContentProps {
  notifications: AppNotification[];
}

export default function PortfolioContent({ notifications }: PortfolioContentProps) {
  /* portfolio items */
  const [itemSearch, setItemSearch]   = useState("");

  /* recommendations ("Semua" is the internal "no filter" value, shown as "All Domains") */
  const [recDomain, setRecDomain]       = useState("Semua");
  const [recSearch, setRecSearch]       = useState("");
  const [recPage, setRecPage]           = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  /* close filter dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* filtered portfolio items */
  const filteredItems = useMemo(() => {
    return portfolioItems.filter((item) => {
      return (
        itemSearch.trim().length === 0 ||
        item.title.toLowerCase().includes(itemSearch.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(itemSearch.toLowerCase())
      );
    });
  }, [itemSearch]);

  const displayedItems = filteredItems.slice(0, 4);

  /* domain categories are built from the data, so a new domain in the
     backend shows up in the filter dropdown without touching this component */
  const domainTabs = useMemo(
    () => ["Semua", ...Array.from(new Set(portfolioRecommendations.map((rec) => rec.domain)))],
    []
  );

  /* filtered recommendations (search matches both the stored and the English domain name) */
  const filteredRecs = useMemo(() => {
    const query = recSearch.trim().toLowerCase();
    return portfolioRecommendations.filter((rec) => {
      const matchesDomain = recDomain === "Semua" || rec.domain === recDomain;
      const matchesSearch =
        query.length === 0 ||
        [rec.name, rec.organizer, rec.domain, domainLabel(rec.domain), rec.subdomain].some((field) =>
          field.toLowerCase().includes(query)
        );
      return matchesDomain && matchesSearch;
    });
  }, [recDomain, recSearch]);

  /* reset to page 1 whenever the filter/search changes */
  useEffect(() => {
    setRecPage(1);
  }, [recDomain, recSearch]);

  const recTotalPages = Math.max(1, Math.ceil(filteredRecs.length / REC_ITEMS_PER_PAGE));
  const paginatedRecs = filteredRecs.slice(
    (recPage - 1) * REC_ITEMS_PER_PAGE,
    recPage * REC_ITEMS_PER_PAGE
  );

  return (
    <div className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-10 md:py-8">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="order-1 flex min-w-0 flex-1 items-start gap-4 xl:flex-none">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20 sm:h-14 sm:w-14">
            <Award className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">Portfolio</h1>
            <p className="mt-1 text-sm text-slate-500 xl:whitespace-nowrap">
              Store, manage, and discover portfolio recommendations that fit your profile.
            </p>
          </div>
        </div>

        <div className="contents">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("portfolio-recommendations")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="order-3 flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left shadow-sm transition-colors hover:bg-slate-50 sm:px-5 sm:py-3.5 xl:order-2 xl:ml-auto xl:w-auto"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Lightbulb className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Need guidance?</p>
              <p className="max-w-[200px] text-xs text-slate-500">
                See portfolio recommendations that match your interests and goals.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
          </button>
          <div className="order-2 shrink-0 xl:order-3">
            <NotificationBell notifications={notifications} />
          </div>
        </div>
      </div>

      {/* ── Main grid: 1 column (phone/tablet), 3 columns x 2 rows on xl ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:grid-rows-[auto_1fr]">

        {/* My Portfolio — xl: row 1, columns 1-2 */}
        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2 xl:row-start-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900">My Portfolio</h2>
                <p className="text-xs text-slate-400">
                  Everything you&apos;ve already accomplished is saved here. Manage and review it anytime.
                </p>
              </div>
            </div>
            <Link
              href="/portfolio-recommendations/all"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              View all my portfolio
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Search portfolio..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Items */}
          <div className="mt-3 divide-y divide-slate-100">
            {displayedItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                No matching portfolio found.
              </p>
            ) : (
              displayedItems.map((item) => {
                const catStyle = ITEM_CATEGORY_COLORS[item.category] ?? ITEM_CATEGORY_COLORS["Semua"];
                const CatIcon  = ITEM_CATEGORY_ICONS[item.category]  ?? FileText;
                const catLabel = ITEM_CATEGORY_LABELS[item.category] ?? item.category;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-4 text-left transition-colors hover:bg-slate-50 sm:gap-4"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catStyle.bg}`}>
                      <CatIcon className={`h-5 w-5 ${catStyle.color}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{item.subtitle}</p>
                      {/* Phones: category + date move below the title */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${catStyle.bg} ${catStyle.color}`}>
                          {catLabel}
                        </span>
                        <span className="text-xs text-slate-400 tabular-nums">{item.date}</span>
                      </div>
                    </div>
                    <span className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-block ${catStyle.bg} ${catStyle.color}`}>
                      {catLabel}
                    </span>
                    <span className="hidden shrink-0 text-sm text-slate-400 tabular-nums sm:block">{item.date}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Focus Recommendations — xl: row 1, column 3 (height follows My Portfolio) */}
        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-start-3 xl:row-start-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900">Focus Recommendations</h3>
              <p className="text-xs text-slate-400">Prioritize the following to strengthen your profile.</p>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            {recommendationFocuses.map((focus) => {
              const meta = FOCUS_ICONS[focus.icon];
              const Icon = meta.icon;
              return (
                <button
                  key={focus.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${meta.color}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{focus.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{focus.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Recommendations — xl: row 2, full width (3 columns) */}
        <div
          id="portfolio-recommendations"
          className="min-w-0 scroll-mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:col-span-3 xl:row-start-2"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Trophy className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900">Portfolio Recommendations</h2>
                <p className="text-xs text-slate-400">
                  Recommendations that match your interests and profile. Pick the most relevant ones to work on.
                </p>
              </div>
            </div>
          </div>

          {/* Filter dropdown + search: stacked full-width on phones, side by side from sm up */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto sm:shrink-0" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className={`flex h-[42px] w-full items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors sm:w-auto ${
                  isFilterOpen
                    ? "border-slate-900"
                    : "border-slate-200 hover:bg-slate-50"
                } text-slate-700`}
              >
                <Filter className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
                <span className="whitespace-nowrap">{recDomain === "Semua" ? "All Domains" : domainLabel(recDomain)}</span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition-transform sm:ml-0 ${isFilterOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg sm:right-auto sm:w-56">
                  {domainTabs.map((domain) => {
                    const label = domain === "Semua" ? "All Domains" : domainLabel(domain);
                    const isSelected = recDomain === domain;
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => {
                          setRecDomain(domain);
                          setIsFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-blue-50 font-semibold text-blue-600"
                            : "font-medium text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                        {isSelected && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex w-full min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
              <input
                type="text"
                value={recSearch}
                onChange={(e) => setRecSearch(e.target.value)}
                placeholder="Search competitions or organizers..."
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Recommendation cards */}
          <div className="mt-4 flex flex-col gap-3">
            {paginatedRecs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">No matching recommendations found.</p>
            ) : (
              paginatedRecs.map((rec) => <RecommendationCard key={rec.id} rec={rec} />)
            )}
          </div>
        </div>

        {/* Pagination — outside the Portfolio Recommendations box */}
        {filteredRecs.length > 0 && (
          <div className="flex min-w-0 flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between xl:col-span-3">
            <p className="text-sm text-slate-500">
              Showing {(recPage - 1) * REC_ITEMS_PER_PAGE + 1} - {Math.min(recPage * REC_ITEMS_PER_PAGE, filteredRecs.length)} of {filteredRecs.length} recommendations
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setRecPage((p) => Math.max(1, p - 1))}
                disabled={recPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
              {Array.from({ length: recTotalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setRecPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    recPage === page
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setRecPage((p) => Math.min(recTotalPages, p + 1))}
                disabled={recPage === recTotalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}