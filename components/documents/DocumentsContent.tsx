"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderClosed,
  Download,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  MinusCircle,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  List,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  Award,
  Landmark,
  LucideIcon,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import {
  DocumentItem,
  DocumentStatus,
  TargetCategory,
  TargetDocumentSummary,
} from "@/lib/documents-types";
import { isUniversity } from "@/lib/target-overview-types";
import {
  dummyTargets,
  dummyDocuments,
  getAllRequirements,
  recomputeUsedByCount,
} from "@/lib/target-overview-data";

/* ------------------------------------------------------------------ */
/* Static config (SAMA PERSIS, gak berubah)                             */
/* ------------------------------------------------------------------ */

type StatCardMeta = {
  label: string;
  sub: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

const STAT_CARD_META: Record<"total" | DocumentStatus, StatCardMeta> = {
  total: { label: "Total Documents", sub: "Across all targets", icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  ready: { label: "Ready", sub: "Ready to use", icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  "in-progress": { label: "In Progress", sub: "Need your attention", icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  "not-ready": { label: "Not Ready", sub: "Missing or not started", icon: XCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600" },
  "not-required": { label: "Not Required", sub: "Not needed", icon: MinusCircle, iconBg: "bg-slate-100", iconColor: "text-slate-500" },
};

type StatusBadgeMeta = { label: string; bg: string; text: string };

const STATUS_BADGE_META: Record<DocumentStatus, StatusBadgeMeta> = {
  ready: { label: "Ready", bg: "bg-emerald-50", text: "text-emerald-700" },
  "in-progress": { label: "In Progress", bg: "bg-amber-50", text: "text-amber-700" },
  "not-ready": { label: "Not Ready", bg: "bg-rose-50", text: "text-rose-700" },
  "not-required": { label: "Not Required", bg: "bg-slate-100", text: "text-slate-500" },
};

const STATUS_BADGE_ICON: Record<DocumentStatus, LucideIcon> = {
  ready: CheckCircle2,
  "in-progress": Clock,
  "not-ready": XCircle,
  "not-required": MinusCircle,
};

const TARGET_TABS: { id: "all" | TargetCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "university", label: "Universities" },
  { id: "scholarship", label: "Scholarships" },
];

const TARGETS_PER_PAGE = 5;

type TargetStatusFilter = "all" | "needs-attention" | "in-progress" | "all-ready";
type TargetSortOption = "default" | "progress-asc" | "progress-desc" | "deadline-asc";

const TARGET_STATUS_OPTIONS: { value: TargetStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "needs-attention", label: "Needs attention" },
  { value: "in-progress", label: "In progress" },
  { value: "all-ready", label: "All ready" },
];

const TARGET_SORT_OPTIONS: { value: TargetSortOption; label: string }[] = [
  { value: "default", label: "Default order" },
  { value: "progress-asc", label: "Progress: Low to High" },
  { value: "progress-desc", label: "Progress: High to Low" },
  { value: "deadline-asc", label: "Deadline: Soonest" },
];

type TargetWithDeadline = TargetDocumentSummary & { deadlineDate?: string | null };

function getTargetDeadline(target: TargetDocumentSummary): string | null {
  return (target as TargetWithDeadline).deadlineDate ?? null;
}

function getTargetStatus(target: TargetDocumentSummary): Exclude<TargetStatusFilter, "all"> {
  if (target.notReadyCount > 0) return "needs-attention";
  if (target.inProgressCount > 0) return "in-progress";
  return "all-ready";
}

function formatDate(dateIso: string | null) {
  if (!dateIso) return "–";
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Root                                                                  */
/* ------------------------------------------------------------------ */

export default function DocumentsContent({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  const targets = dummyTargets;

  const documents = useMemo(
    () => recomputeUsedByCount(dummyDocuments),
    [],
  );

  const requirements = useMemo(
    () => getAllRequirements(documents),
    [documents],
  );

  const targetSummaries = useMemo(() => {
    return targets
      .map((target) => {
        const reqs = requirements.filter((r) => r.targetId === target.id);
        if (reqs.length === 0) return undefined;

        const readyCount = reqs.filter((r) => r.status === "ready").length;

        const summary: TargetDocumentSummary = {
          id: target.id,
          targetId: target.id,
          name: target.name,
          category: target.category,
          badgeLabel: isUniversity(target) ? "University" : "Scholarship",
          totalDocuments: reqs.length,
          readyDocuments: readyCount,
          readyCount,
          inProgressCount: reqs.filter((r) => r.status === "in-progress").length,
          notReadyCount: reqs.filter((r) => r.status === "not-ready").length,
          notRequiredCount: reqs.filter((r) => r.status === "not-required").length,
        };

        return summary;
      })
      .filter((s): s is TargetDocumentSummary => !!s && s.totalDocuments > 0);
  }, [targets, requirements]);

  const data = { documents, targets: targetSummaries };

  const [documentSearch, setDocumentSearch] = useState("");
  const [targetTab, setTargetTab] = useState<"all" | TargetCategory>("all");
  const [targetSearch, setTargetSearch] = useState("");
  const [targetStatusFilter, setTargetStatusFilter] = useState<TargetStatusFilter>("all");
  const [targetSort, setTargetSort] = useState<TargetSortOption>("default");
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [targetView, setTargetView] = useState<"list" | "grid">("list");

  // Page number is persisted to sessionStorage (not the URL) so that
  // clicking "View details" then using the browser/back-button to return
  // lands back on the same page. Relying on the URL's ?page= query plus
  // router.back() is unreliable here because Next.js's client-side router
  // cache can restore a stale render captured before the query changed.
  // sessionStorage sidesteps that entirely: we just read it fresh on mount.
  const TARGET_PAGE_STORAGE_KEY = "documents:targetPage";
  const [targetPage, setTargetPageState] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = Number(window.sessionStorage.getItem(TARGET_PAGE_STORAGE_KEY));
    if (stored > 0) setTargetPageState(stored);
  }, []);

  function setTargetPage(update: number | ((prev: number) => number)) {
    setTargetPageState((prev) => {
      const next = typeof update === "function" ? (update as (p: number) => number)(prev) : update;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(TARGET_PAGE_STORAGE_KEY, String(next));
      }
      return next;
    });
  }

  const counts = useMemo(() => {
    const base: Record<"total" | DocumentStatus, number> = {
      total: data.documents.length,
      ready: 0,
      "in-progress": 0,
      "not-ready": 0,
      "not-required": 0,
    };
    data.documents.forEach((doc) => {
      base[doc.status] += 1;
    });
    return base;
  }, [data.documents]);

  const filteredDocuments = useMemo(() => {
    const query = documentSearch.trim().toLowerCase();
    const result =
      query.length === 0
        ? data.documents
        : data.documents.filter((doc) => doc.name.toLowerCase().includes(query));
    return showAllDocuments ? result : result.slice(0, 5);
  }, [data.documents, documentSearch, showAllDocuments]);

  const filteredTargets = useMemo(() => {
    const query = targetSearch.trim().toLowerCase();
    return data.targets.filter((target) => {
      const matchesTab = targetTab === "all" || target.category === targetTab;
      const matchesQuery = query.length === 0 || target.name.toLowerCase().includes(query);
      const matchesStatus =
        targetStatusFilter === "all" || getTargetStatus(target) === targetStatusFilter;
      return matchesTab && matchesQuery && matchesStatus;
    });
  }, [data.targets, targetTab, targetSearch, targetStatusFilter]);

  const sortedTargets = useMemo(() => {
    if (targetSort === "default") return filteredTargets;

    const withProgress = (target: TargetDocumentSummary) =>
      target.totalDocuments === 0 ? 0 : target.readyDocuments / target.totalDocuments;

    const result = [...filteredTargets];
    if (targetSort === "progress-asc") {
      result.sort((a, b) => withProgress(a) - withProgress(b));
    } else if (targetSort === "progress-desc") {
      result.sort((a, b) => withProgress(b) - withProgress(a));
    } else if (targetSort === "deadline-asc") {
      result.sort((a, b) => {
        const da = getTargetDeadline(a);
        const db = getTargetDeadline(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return da.localeCompare(db);
      });
    }
    return result;
  }, [filteredTargets, targetSort]);

  const targetTotalPages = Math.max(1, Math.ceil(sortedTargets.length / TARGETS_PER_PAGE));

  const paginatedTargets = useMemo(() => {
    const start = (targetPage - 1) * TARGETS_PER_PAGE;
    return sortedTargets.slice(start, start + TARGETS_PER_PAGE);
  }, [sortedTargets, targetPage]);

  // Skip the very first run of this effect: on mount it would otherwise
  // immediately reset targetPage back to 1, overwriting the page number
  // that was just restored from the URL (?page=n) after navigating back
  // from the detail view.
  const didMountFilterReset = useRef(false);
  useEffect(() => {
    if (!didMountFilterReset.current) {
      didMountFilterReset.current = true;
      return;
    }
    setTargetPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTab, targetSearch, targetStatusFilter, targetSort]);

  useEffect(() => {
    setTargetPage((p) => Math.min(p, targetTotalPages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTotalPages]);

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-8 md:py-6">
      <DocumentsHeader notifications={notifications} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
        <StatCard meta={STAT_CARD_META.total} count={counts.total} />
        <StatCard meta={STAT_CARD_META.ready} count={counts.ready} />
        <StatCard meta={STAT_CARD_META["in-progress"]} count={counts["in-progress"]} />
        <StatCard meta={STAT_CARD_META["not-ready"]} count={counts["not-ready"]} />
        <StatCard meta={STAT_CARD_META["not-required"]} count={counts["not-required"]} />
      </div>

      <section className="mt-6 min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">My Personal Documents</h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload once, reuse for any university or scholarship application.
            </p>
          </div>

          <div className="relative w-full xl:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={documentSearch}
              onChange={(e) => setDocumentSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <DocumentsEmptyState />
        ) : (
          <DocumentsTable documents={filteredDocuments} />
        )}

        {data.documents.length > 5 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllDocuments((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {showAllDocuments ? "Show less" : "View all documents"}
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        )}
      </section>

      <section className="mt-6 min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Document Requirements</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track document progress for each university or scholarship.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full rounded-xl border border-slate-100 bg-slate-50 p-1 sm:inline-flex sm:w-fit">
            {TARGET_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTargetTab(t.id)}
                className={`flex-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors sm:flex-none sm:px-3.5 sm:text-sm ${
                  targetTab === t.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* HP: vertikal full-width, tablet: search 1 baris penuh + 3 kolom
              (filter, sort, toggle), xl: sejajar dalam satu baris */}
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3 xl:flex xl:flex-wrap xl:items-center xl:justify-end">
            <div className="relative w-full sm:col-span-3 xl:w-52">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                placeholder="Search targets..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <CustomDropdown
              icon={Filter}
              value={targetStatusFilter}
              options={TARGET_STATUS_OPTIONS}
              onChange={setTargetStatusFilter}
            />

            <CustomDropdown
              icon={ArrowUpDown}
              value={targetSort}
              options={TARGET_SORT_OPTIONS}
              onChange={setTargetSort}
            />

            <TargetViewToggle view={targetView} onChange={setTargetView} />
          </div>
        </div>

        {sortedTargets.length === 0 ? (
          <TargetsEmptyState />
        ) : targetView === "list" ? (
          <div className="mt-5 space-y-4">
            {paginatedTargets.map((target) => (
              <TargetRow key={target.id} target={target} />
            ))}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedTargets.map((target) => (
              <TargetCard key={target.id} target={target} />
            ))}
          </div>
        )}
      </section>

      {sortedTargets.length > 0 && (
        <TargetsPagination
          page={targetPage}
          totalPages={targetTotalPages}
          total={sortedTargets.length}
          pageSize={TARGETS_PER_PAGE}
          onChange={setTargetPage}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                                */
/* ------------------------------------------------------------------ */

function DocumentsHeader({ notifications }: { notifications: AppNotification[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="order-1 flex min-w-0 flex-1 basis-64 items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20 sm:h-14 sm:w-14">
          <FolderClosed className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">Documents</h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep your application documents organized and track what you need for each target.
          </p>
        </div>
      </div>

      {/* Phones: bell stays top-right next to the title, Export drops below at full width.
          sm and up: Export first, bell pinned at the far right. */}
      <div className="contents">
        <div className="order-2 shrink-0 sm:order-3">
          <NotificationBell notifications={notifications} />
        </div>

        <button
          type="button"
          className="order-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 sm:order-2 sm:w-auto"
        >
          <Download className="h-4 w-4" strokeWidth={2.5} />
          Export
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat card                                                            */
/* ------------------------------------------------------------------ */

function StatCard({ meta, count }: { meta: StatCardMeta; count: number }) {
  const Icon = meta.icon;
  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${meta.iconBg}`}>
        <Icon className={`h-5 w-5 ${meta.iconColor}`} strokeWidth={2} />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{count}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">{meta.label}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">{meta.sub}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status badge                                                         */
/* ------------------------------------------------------------------ */

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const meta = STATUS_BADGE_META[status];
  const Icon = STATUS_BADGE_ICON[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.text}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {meta.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Documents table                                                      */
/* ------------------------------------------------------------------ */

function DocumentIcon({ doc }: { doc: DocumentItem }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${doc.iconBg}`}>
      <FileText className={`h-5 w-5 ${doc.iconText}`} strokeWidth={2} />
    </div>
  );
}

function DocumentsTable({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="mt-5 max-w-full overflow-x-auto rounded-2xl border border-slate-100">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-6 py-3.5 font-semibold">Document</th>
            <th className="px-6 py-3.5 font-semibold">Status</th>
            <th className="px-6 py-3.5 font-semibold">Used by</th>
            <th className="px-6 py-3.5 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <DocumentIcon doc={doc} />
                  <p className="truncate text-sm font-semibold text-slate-900">{doc.name}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <DocumentStatusBadge status={doc.status} />
              </td>
              <td className="px-6 py-4">
                <p className="whitespace-nowrap text-sm text-slate-600">
                  {doc.usedByCount} {doc.usedByCount === 1 ? "target" : "targets"}
                </p>
              </td>
              <td className="px-6 py-4">
                <p className="whitespace-nowrap text-sm text-slate-500">{formatDate(doc.lastUpdatedDate)}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Application targets                                                  */
/* ------------------------------------------------------------------ */

function TargetIcon({ category }: { category: TargetCategory }) {
  const Icon = category === "scholarship" ? Award : Landmark;
  const bg = category === "scholarship" ? "bg-amber-50" : "bg-blue-50";
  const color = category === "scholarship" ? "text-amber-600" : "text-blue-600";
  return (
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
      <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Custom dropdown (replaces native <select>)                           */
/* ------------------------------------------------------------------ */

function CustomDropdown<T extends string>({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 xl:w-auto"
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="min-w-0 flex-1 truncate text-left xl:flex-none">{selected?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60 sm:right-auto sm:w-48">
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
                  isActive ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option.label}
                {isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TargetViewToggle({
  view,
  onChange,
}: {
  view: "list" | "grid";
  onChange: (view: "list" | "grid") => void;
}) {
  return (
    <div className="inline-flex w-fit rounded-xl border border-slate-100 bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-label="List view"
        aria-pressed={view === "list"}
        className={`flex items-center justify-center rounded-lg px-2.5 py-1.5 transition-colors ${
          view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <List className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        className={`flex items-center justify-center rounded-lg px-2.5 py-1.5 transition-colors ${
          view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <LayoutGrid className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function TargetRow({ target }: { target: TargetDocumentSummary }) {
  const progressPct = Math.round((target.readyDocuments / target.totalDocuments) * 100);
  const deadline = getTargetDeadline(target);

  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 p-4 transition-shadow hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3 xl:w-[280px] xl:shrink-0">
          <TargetIcon category={target.category} />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug text-slate-900">{target.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                {target.badgeLabel}
              </span>
              {deadline && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                  <Clock className="h-3 w-3" strokeWidth={2} />
                  Due {formatDate(deadline)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">Documents</span>
            <span className="font-semibold text-slate-700">
              {target.readyDocuments} / {target.totalDocuments} ready
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 xl:shrink-0 xl:justify-start">
          <TargetMiniStat color="bg-emerald-500" count={target.readyCount} label="Ready" />
          <TargetMiniStat color="bg-amber-500" count={target.inProgressCount} label="In Progress" />
          <TargetMiniStat color="bg-rose-500" count={target.notReadyCount} label="Not Ready" />
        </div>

        {/* ?tab=documents so this deep-links straight into the Documents
            tab on the detail page, instead of always landing on Overview. */}
        <Link
          href={`/application-detail/${target.targetId}?tab=documents`}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 xl:w-auto xl:shrink-0"
        >
          View details
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}

function TargetCard({ target }: { target: TargetDocumentSummary }) {
  const progressPct = Math.round((target.readyDocuments / target.totalDocuments) * 100);
  const deadline = getTargetDeadline(target);

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 p-4 transition-shadow hover:shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <TargetIcon category={target.category} />
        <div className="min-w-0 flex-1">
          {/* line-clamp-2 + min-h keeps this block the same height across
              cards regardless of how long the target name is, so the
              Documents/stats/button sections below line up in a grid row. */}
          <p
            className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900"
            title={target.name}
          >
            {target.name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
              {target.badgeLabel}
            </span>
            {deadline && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-600">
                <Clock className="h-3 w-3" strokeWidth={2} />
                Due {formatDate(deadline)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">Documents</span>
          <span className="font-semibold text-slate-700">
            {target.readyDocuments} / {target.totalDocuments} ready
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-slate-50 pt-4">
        <TargetMiniStat color="bg-emerald-500" count={target.readyCount} label="Ready" />
        <TargetMiniStat color="bg-amber-500" count={target.inProgressCount} label="In Progress" />
        <TargetMiniStat color="bg-rose-500" count={target.notReadyCount} label="Not Ready" />
      </div>

      {/* ?tab=documents so this deep-links straight into the Documents
          tab on the detail page, instead of always landing on Overview. */}
      <Link
        href={`/application-detail/${target.targetId}?tab=documents`}
        className="mt-4 flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
      >
        View details
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

function TargetMiniStat({ color, count, label }: { color: string; count: number; label: string }) {
  return (
    <div className="text-center">
      <p className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-900">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {count}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-xs text-slate-400">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination                                                            */
/* ------------------------------------------------------------------ */

function TargetsPagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {start} to {end} of {total} targets
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(Math.max(1, page - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 enabled:hover:bg-slate-50 enabled:hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              n === page
                ? "border border-blue-200 bg-blue-50 text-blue-600"
                : "border border-transparent text-slate-500 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 enabled:hover:bg-slate-50 enabled:hover:text-slate-600"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty states                                                         */
/* ------------------------------------------------------------------ */

function DocumentsEmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
        <FileText className="h-5 w-5 text-slate-300" strokeWidth={2} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">No documents found</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400">Try a different search term, or add a new document.</p>
    </div>
  );
}

function TargetsEmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
        <Landmark className="h-5 w-5 text-slate-300" strokeWidth={2} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">No targets match your filters</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400">Try a different tab or search term.</p>
    </div>
  );
}