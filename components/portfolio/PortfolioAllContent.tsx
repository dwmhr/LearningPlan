"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  FileSearch,
  FileText,
  Heart,
  Laptop,
  LucideIcon,
  Search,
  Star,
  Users,
} from "lucide-react";
import { portfolioItems } from "@/lib/portfolio-data";
import { PortfolioItemCategory } from "@/lib/portfolio-types";

/* ------------------------------------------------------------------ */
/* Icon + color lookups (same styling language as PortfolioContent)    */
/* NOTE: the keys below (e.g. "Semua", "Pengalaman Kerja") are the     */
/* values stored in the data layer, so they stay as-is. Only the text  */
/* shown to the user is translated, via ITEM_CATEGORY_LABELS.          */
/* ------------------------------------------------------------------ */

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

const ITEM_CATEGORIES: PortfolioItemCategory[] = [
  "Semua",
  "Pengalaman Kerja",
  "Sertifikat",
  "Publikasi / Riset",
  "Proyek",
  "Organisasi",
  "Volunteer",
];

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export default function PortfolioAllContent() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState<PortfolioItemCategory>("Semua");

  const filteredItems = useMemo(() => {
    return portfolioItems.filter((item) => {
      const matchesCategory = category === "Semua" || item.category === category;
      const matchesSearch =
        search.trim().length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-10 md:py-8">

      {/* ── Header ── */}
      <div className="mb-6 flex items-center gap-3 sm:gap-4">
        <Link
          href="/portfolio-recommendations"
          aria-label="Back to Portfolio"
          title="Back to Portfolio"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 sm:h-14 sm:w-14"
        >
          <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">All My Portfolio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every portfolio item you&apos;ve added, all in one place.
          </p>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="min-w-0 max-w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        {/* Search (own row, full width) + category tabs (always one line, scrolls inside its own box) */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex w-full items-center gap-2 rounded-full bg-slate-50 px-4 py-2.5 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-blue-500/40">
            <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search portfolio..."
              className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="-mx-1 max-w-full overflow-x-auto px-1 pb-2 pt-1">
            <div className="flex w-max items-center gap-1.5">
              {ITEM_CATEGORIES.map((cat) => {
                const isActive = category === cat;
                const TabIcon = ITEM_CATEGORY_ICONS[cat];
                const tabStyle = ITEM_CATEGORY_COLORS[cat];
                const count =
                  cat === "Semua"
                    ? portfolioItems.length
                    : portfolioItems.filter((item) => item.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    aria-pressed={isActive}
                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1.5 text-[13px] font-semibold transition-all ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                        isActive ? "bg-white/20" : tabStyle.bg
                      }`}
                    >
                      <TabIcon
                        className={`h-3 w-3 ${isActive ? "text-white" : tabStyle.color}`}
                        strokeWidth={2}
                      />
                    </span>
                    {ITEM_CATEGORY_LABELS[cat]}
                    <span
                      className={`rounded-full px-1.5 py-px text-[11px] font-bold tabular-nums ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table (scrolls inside its own box) */}
        <div className="mt-4 max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                <th className="py-3 pl-2">Portfolio</th>
                <th className="py-3">Category</th>
                <th className="py-3 pr-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-sm text-slate-400">
                    No matching portfolio found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const catStyle = ITEM_CATEGORY_COLORS[item.category] ?? ITEM_CATEGORY_COLORS["Semua"];
                  const CatIcon  = ITEM_CATEGORY_ICONS[item.category]  ?? FileText;
                  const catLabel = ITEM_CATEGORY_LABELS[item.category] ?? item.category;
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catStyle.bg}`}>
                            <CatIcon className={`h-5 w-5 ${catStyle.color}`} strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">{item.title}</p>
                            <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${catStyle.bg} ${catStyle.color}`}>
                          {catLabel}
                        </span>
                      </td>
                      <td className="whitespace-nowrap py-4 pr-2 text-slate-500 tabular-nums">{item.date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length > 0 && (
        <p className="mt-4 px-1 text-sm text-slate-500">
          Showing all {filteredItems.length} portfolio items
        </p>
      )}
    </div>
  );
}