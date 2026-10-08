"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TargetProgram, ProgramCategory } from "@/lib/types";

const TABS = ["All", "University", "Scholarship"] as const;

const CATEGORY_BADGE: Record<ProgramCategory, string> = {
  SCHOLARSHIP: "bg-orange-50 text-orange-600",
  UNIVERSITY: "bg-blue-50 text-blue-600",
};

const STATUS_BADGE: Record<string, string> = {
  Preparing: "bg-blue-50 text-blue-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-slate-100 text-slate-600",
};

// fallback biar badge tetap kebentuk walau status dari API belum ke-mapping
const DEFAULT_STATUS_BADGE = "bg-slate-100 text-slate-600";

export default function TargetPrograms({
  programs,
}: {
  programs: TargetProgram[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");

  const tabPrograms = useMemo(() => {
    if (tab === "Scholarship") {
      return programs.filter((p) => p.category === "SCHOLARSHIP");
    }

    if (tab === "University") {
      return programs.filter((p) => p.category === "UNIVERSITY");
    }

    return programs;
  }, [tab, programs]);

  const filtered = useMemo(() => {
    const now = new Date(); // hari ini beneran, real-time

    return [...tabPrograms]
      // Buang program yang deadline-nya udah lewat — summary ini cuma
      // buat nunjukin yang masih butuh perhatian sekarang.
      .filter((p) => new Date(p.deadline).getTime() >= now.getTime())
      .sort((a, b) => {
        const deadlineA = new Date(a.deadline).getTime();
        const deadlineB = new Date(b.deadline).getTime();

        if (deadlineA !== deadlineB) {
          return deadlineA - deadlineB;
        }

        return a.readiness - b.readiness;
      })
      .slice(0, 3);
  }, [tabPrograms]);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            My target Summary
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your university and scholarship goals, and how ready you are.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-slate-50 p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  tab === t
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Link
            href="/target-programs"
            scroll={true}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View All Target
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400">
          No programs in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              className="group flex flex-col rounded-xl border border-slate-100 p-4 text-left transition-shadow hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                    CATEGORY_BADGE[p.category]
                  }`}
                >
                  {p.category}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5" />
              </div>

              <p className="mb-2 text-sm font-semibold leading-snug text-slate-800">
                {p.title}
              </p>

              <p className="mb-3 text-xs text-slate-400">
                {p.country} - {p.semester}
              </p>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    STATUS_BADGE[p.status] ?? DEFAULT_STATUS_BADGE
                  }`}
                >
                  {p.status}
                </span>

                <span className="text-[11px] font-medium text-slate-400">
                  Deadline:{" "}
                  {new Date(p.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mt-auto flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-400">
                  Readiness
                </span>

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-700"
                    style={{ width: `${p.readiness}%` }}
                  />
                </div>

                <span className="text-[11px] font-semibold text-slate-600">
                  {p.readiness}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}