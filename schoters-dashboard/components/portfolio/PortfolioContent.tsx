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

const RELEVANCE_COLOR: Record<string, string> = {
  "Sangat relevan": "text-blue-600",
  Relevan:          "text-emerald-600",
  "Cukup relevan":  "text-amber-500",
};

/* Rekomendasi = lomba. Domain is an open-ended string from the data, so the
   colors are a lookup with a neutral fallback for any domain not listed. */
const DOMAIN_STYLES: Record<string, { bg: string; color: string }> = {
  Olimpiade:  { bg: "bg-blue-50",    color: "text-blue-600"    },
  Penelitian: { bg: "bg-violet-50",  color: "text-violet-600"  },
  Esai:       { bg: "bg-emerald-50", color: "text-emerald-600" },
  Bisnis:     { bg: "bg-amber-50",   color: "text-amber-600"   },
  Desain:     { bg: "bg-rose-50",    color: "text-rose-500"    },
  Debat:      { bg: "bg-orange-50",  color: "text-orange-500"  },
};

const DEFAULT_DOMAIN_STYLE = { bg: "bg-slate-100", color: "text-slate-600" };

const PARTICIPATION_META: Record<ParticipationType, { label: string; icon: LucideIcon }> = {
  individual: { label: "Individu", icon: User  },
  team:       { label: "Tim",      icon: Users },
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
  return new Intl.DateTimeFormat("id-ID", options).format(new Date(iso));
}

// "2 Mar – 12 Apr 2026" when both dates share a year, full dates otherwise.
function formatPeriod(start: string, end: string): string {
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${formatDate(start, !sameYear)} – ${formatDate(end, true)}`;
}

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
      <dd className="mt-0.5 text-sm font-semibold text-slate-700">{children}</dd>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: PortfolioRecommendation }) {
  const domainStyle    = DOMAIN_STYLES[rec.domain] ?? DEFAULT_DOMAIN_STYLE;
  const relevanceColor = RELEVANCE_COLOR[rec.relevance] ?? "text-slate-500";
  const participation  = PARTICIPATION_META[rec.participation];

  return (
    <article className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300">
      {/* Top: name, organizer, domain › subdomain, relevance, CTA */}
      <div className="flex flex-wrap items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${domainStyle.bg}`}>
          <Trophy className={`h-5 w-5 ${domainStyle.color}`} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 basis-64">
          <h3 className="text-sm font-bold leading-snug text-slate-900">{rec.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
            <Building2 className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="min-w-0">{rec.organizer}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${domainStyle.bg} ${domainStyle.color}`}>
              {rec.domain}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {rec.subdomain}
            </span>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className={`flex items-center gap-1 text-xs font-semibold ${relevanceColor}`}>
            <BarChart2 className="h-3.5 w-3.5" strokeWidth={2} />
            {rec.relevance}
          </span>
          <a
            href={rec.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Daftar
          </a>
        </div>
      </div>

      {/* Details: jenjang, level, periode, peserta, biaya */}
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-slate-50 px-4 py-3 sm:grid-cols-3 lg:grid-cols-5">
        <RecommendationMeta icon={GraduationCap} label="Jenjang">
          {rec.educationLevels.join(", ")}
        </RecommendationMeta>
        <RecommendationMeta icon={Globe} label="Level">
          {rec.level}
        </RecommendationMeta>
        <RecommendationMeta icon={CalendarDays} label="Periode">
          {formatPeriod(rec.startDate, rec.endDate)}
        </RecommendationMeta>
        <RecommendationMeta icon={participation.icon} label="Peserta">
          {participation.label}
        </RecommendationMeta>
        <RecommendationMeta icon={Wallet} label="Biaya">
          {rec.fee === 0 ? (
            <span className="text-emerald-600">Gratis</span>
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

  /* recommendations */
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

  /* filtered recommendations */
  const filteredRecs = useMemo(() => {
    const query = recSearch.trim().toLowerCase();
    return portfolioRecommendations.filter((rec) => {
      const matchesDomain = recDomain === "Semua" || rec.domain === recDomain;
      const matchesSearch =
        query.length === 0 ||
        [rec.name, rec.organizer, rec.domain, rec.subdomain].some((field) =>
          field.toLowerCase().includes(query)
        );
      return matchesDomain && matchesSearch;
    });
  }, [recDomain, recSearch]);

  /* reset ke halaman 1 tiap kali filter/search berubah */
  useEffect(() => {
    setRecPage(1);
  }, [recDomain, recSearch]);

  const recTotalPages = Math.max(1, Math.ceil(filteredRecs.length / REC_ITEMS_PER_PAGE));
  const paginatedRecs = filteredRecs.slice(
    (recPage - 1) * REC_ITEMS_PER_PAGE,
    recPage * REC_ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 px-6 py-6 md:px-10 md:py-8">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20">
            <Award className="h-7 w-7 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Portfolio</h1>
            <p className="mt-1 text-sm text-slate-500 whitespace-nowrap">
              Store, manage, and discover portfolio recommendations that fit your profile.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("rekomendasi-portofolio")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 text-left shadow-sm transition-colors hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Lightbulb className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Butuh bimbingan?</p>
              <p className="max-w-[200px] text-xs text-slate-500">
                Lihat rekomendasi portofolio yang sesuai dengan minat dan tujuanmu.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
          </button>
          <NotificationBell notifications={notifications} />
        </div>
      </div>

      {/* ── Grid utama: 3 kolom, 2 baris ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">

        {/* Portofolio Saya — baris 1, kolom 1-2 */}
        <div className="lg:col-span-2 lg:row-start-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Portofolio Saya</h2>
                <p className="text-xs text-slate-400">
                  Semua portofolio yang sudah kamu miliki tersimpan di sini. Kelola dan tinjau kapan saja.
                </p>
              </div>
            </div>
            <Link
              href="/portfolio-recommendations/all"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all my portfolio
            </Link>
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder="Cari portofolio..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Items */}
          <div className="mt-3 divide-y divide-slate-100">
            {displayedItems.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">
                Tidak ada portofolio yang sesuai.
              </p>
            ) : (
              displayedItems.map((item) => {
                const catStyle = ITEM_CATEGORY_COLORS[item.category] ?? ITEM_CATEGORY_COLORS["Semua"];
                const CatIcon  = ITEM_CATEGORY_ICONS[item.category]  ?? FileText;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-slate-50 px-2 rounded-xl"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catStyle.bg}`}>
                      <CatIcon className={`h-5 w-5 ${catStyle.color}`} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="truncate text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${catStyle.bg} ${catStyle.color}`}>
                      {item.category}
                    </span>
                    <span className="shrink-0 text-sm text-slate-400 tabular-nums">{item.date}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Rekomendasi Fokus — baris 1, kolom 3 (tinggi mengikuti Portofolio Saya) */}
        <div className="lg:col-start-3 lg:row-start-1 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Target className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Rekomendasi Fokus</h3>
              <p className="text-xs text-slate-400">Prioritaskan hal berikut untuk memperkuat profilmu.</p>
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

        {/* Rekomendasi Portofolio — baris 2, full width (3 kolom) */}
        <div
          id="rekomendasi-portofolio"
          className="lg:col-span-3 lg:row-start-2 scroll-mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Trophy className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Rekomendasi Portofolio</h2>
                <p className="text-xs text-slate-400">
                  Rekomendasi yang sesuai dengan minat dan profilmu. Pilih yang paling relevan untuk kamu kembangkan.
                </p>
              </div>
            </div>
          </div>

          {/* Filter dropdown + search, full row */}
          <div className="mt-4 flex items-center gap-2">
            <div className="relative shrink-0" ref={filterRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen((v) => !v)}
                className={`flex h-[42px] items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                  isFilterOpen
                    ? "border-slate-900"
                    : "border-slate-200 hover:bg-slate-50"
                } text-slate-700`}
              >
                <Filter className="h-4 w-4 text-slate-400" strokeWidth={2} />
                <span className="whitespace-nowrap">{recDomain === "Semua" ? "Semua Domain" : recDomain}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                  {domainTabs.map((domain) => {
                    const label = domain === "Semua" ? "Semua Domain" : domain;
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

            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
              <input
                type="text"
                value={recSearch}
                onChange={(e) => setRecSearch(e.target.value)}
                placeholder="Cari lomba atau penyelenggara..."
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Recommendation cards */}
          <div className="mt-4 flex flex-col gap-3">
            {paginatedRecs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">Tidak ada rekomendasi yang sesuai.</p>
            ) : (
              paginatedRecs.map((rec) => <RecommendationCard key={rec.id} rec={rec} />)
            )}
          </div>
        </div>

        {/* Pagination — di luar kotak Rekomendasi Portofolio */}
        {filteredRecs.length > 0 && (
          <div className="lg:col-span-3 flex items-center justify-between px-1">
            <p className="text-sm text-slate-500">
              Showing {(recPage - 1) * REC_ITEMS_PER_PAGE + 1} - {Math.min(recPage * REC_ITEMS_PER_PAGE, filteredRecs.length)} of {filteredRecs.length} recommendations
            </p>
            <div className="flex items-center gap-1">
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