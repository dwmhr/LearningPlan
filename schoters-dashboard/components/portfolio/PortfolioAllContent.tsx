"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
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
    <div className="flex-1 px-6 py-6 md:px-10 md:py-8">

      {/* ── Header ── */}
      <div className="mb-6">
        <Link
          href="/portfolio-recommendations"
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back to Portfolio
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">All My Portfolio</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every portfolio item you&apos;ve added, all in one place.
          </p>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {/* Category tabs + search */}
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {ITEM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 sm:w-64">
            <Search className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari portofolio..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                <th className="py-3 pl-2">Portfolio</th>
                <th className="py-3">Category</th>
                <th className="py-3">Date</th>
                <th className="py-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-slate-400">
                    Tidak ada portofolio yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const catStyle = ITEM_CATEGORY_COLORS[item.category] ?? ITEM_CATEGORY_COLORS["Semua"];
                  const CatIcon  = ITEM_CATEGORY_ICONS[item.category]  ?? FileText;
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
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${catStyle.bg} ${catStyle.color}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500 tabular-nums">{item.date}</td>
                      <td className="py-4 pr-2 text-right">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </td>
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