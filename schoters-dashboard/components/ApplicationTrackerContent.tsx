"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Search,
  Filter,
  ArrowUpDown,
  List,
  LayoutGrid,
  Landmark,
  Gift,
  Target as TargetIcon,
  Hourglass,
  Send,
  ShieldCheck,
  XCircle,
  PauseCircle,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Inbox,
  LucideIcon,
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import {
  ApplicationCategory,
  ApplicationEntry,
  ApplicationStatus,
} from "@/lib/application-tracker-types";
import { getApplicationTrackerData } from "@/lib/application-tracker-data";
import { Target } from "@/lib/target-overview-types";
import { getTargetOverviewData } from "@/lib/target-overview-data";
import { getLogoInitial, getLogoColor } from "@/lib/logo-utils";

/* ------------------------------------------------------------------ */
/* Joined view type                                                      */
/* ------------------------------------------------------------------ */
// ApplicationEntry cuma {id, targetId, status, lastUpdatedDate}.
// Semua field institusi/program diambil dari Target lewat targetId.
// `targetId` sendiri tetap disimpan di sini (bukan cuma dipakai buat lookup)
// karena dibutuhkan oleh "View details" untuk link ke
// /application-detail/[targetId], DAN dipakai sebagai seed warna logo
// (lihat InstitutionLogo di bawah) supaya warnanya konsisten tiap render
// tanpa perlu disimpan di data.
interface ApplicationEntryView {
  id: string;
  targetId: string;
  status: ApplicationStatus;
  lastUpdatedDate: string;
  category: ApplicationCategory;
  institutionName: string;
  programName: string;
  country: string;
  deadlineDate: string;
}

/* ------------------------------------------------------------------ */
/* Static config                                                        */
/* ------------------------------------------------------------------ */

const TABS: { id: ApplicationCategory; label: string; icon: LucideIcon }[] = [
  { id: "university", label: "University", icon: Landmark },
  { id: "scholarship", label: "Scholarship", icon: Gift },
];

const STATUS_ORDER: ApplicationStatus[] = [
  "not-started",
  "in-progress",
  "submitted",
  "accepted",
  "rejected",
  "withdrawn",
];

const FILTER_STATUS_ORDER: ApplicationStatus[] = ["pending-approval", ...STATUS_ORDER];

type StatCardMeta = {
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  unit: string;
};

const STAT_CARD_META: Record<ApplicationStatus, StatCardMeta> = {
  "pending-approval": { label: "Pending Approval", icon: Hourglass, iconBg: "bg-slate-100", iconColor: "text-slate-500", unit: "Applications" },
  "not-started": { label: "Not Started", icon: TargetIcon, iconBg: "bg-blue-50", iconColor: "text-blue-600", unit: "Applications" },
  "in-progress": { label: "In Progress", icon: Hourglass, iconBg: "bg-amber-50", iconColor: "text-amber-600", unit: "Applications" },
  submitted: { label: "Submitted", icon: Send, iconBg: "bg-sky-50", iconColor: "text-sky-600", unit: "Application" },
  accepted: { label: "Accepted", icon: ShieldCheck, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", unit: "Applications" },
  rejected: { label: "Rejected", icon: XCircle, iconBg: "bg-rose-50", iconColor: "text-rose-600", unit: "Applications" },
  withdrawn: { label: "Withdrawn", icon: PauseCircle, iconBg: "bg-violet-50", iconColor: "text-violet-600", unit: "Applications" },
};

type StatusBadgeMeta = { label: string; dot: string; bg: string; text: string };

const STATUS_BADGE_META: Record<ApplicationStatus, StatusBadgeMeta> = {
  "pending-approval": { label: "Pending Approval", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600" },
  "not-started": { label: "Not Started", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  "in-progress": { label: "In Progress", dot: "bg-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  submitted: { label: "Submitted", dot: "bg-sky-500", bg: "bg-sky-50", text: "text-sky-700" },
  accepted: { label: "Accepted", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  rejected: { label: "Rejected", dot: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
  withdrawn: { label: "Withdrawn", dot: "bg-violet-500", bg: "bg-violet-50", text: "text-violet-700" },
};

type SortKey = "deadline-asc" | "deadline-desc" | "updated-desc" | "updated-asc" | "name-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "deadline-asc", label: "Deadline (Soonest)" },
  { value: "deadline-desc", label: "Deadline (Latest)" },
  { value: "updated-desc", label: "Last Updated (Newest)" },
  { value: "updated-asc", label: "Last Updated (Oldest)" },
  { value: "name-asc", label: "Name (A–Z)" },
];

const PAGE_SIZE = 5;

/* ------------------------------------------------------------------ */
/* Date helpers (SAMA PERSIS, gak berubah)                              */
/* ------------------------------------------------------------------ */

function daysFromToday(dateIso: string) {
  const target = new Date(`${dateIso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function deadlineLabel(days: number) {
  if (days > 1) return `In ${days} days`;
  if (days === 1) return "Tomorrow";
  if (days === 0) return "Today";
  if (days === -1) return "1 day overdue";
  return `${Math.abs(days)} days overdue`;
}

function relativeLabel(dateIso: string) {
  const daysAgo = -daysFromToday(dateIso);
  if (daysAgo <= 0) return "Today";
  if (daysAgo === 1) return "1 day ago";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  const weeks = Math.round(daysAgo / 7);
  if (weeks < 5) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  const months = Math.round(daysAgo / 30);
  return months <= 1 ? "1 month ago" : `${months} months ago`;
}

function formatDate(dateIso: string) {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Root                                                                  */
/* ------------------------------------------------------------------ */

export default function ApplicationTrackerContent({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  // MIGRASI API: applications & targets sekarang di-fetch lewat
  // getApplicationTrackerData() & getTargetOverviewData(), bukan lagi baca
  // dummyApplications/dummyTargets langsung. Keduanya di-fetch paralel di
  // satu useEffect karena joinedEntries butuh dua-duanya sekaligus.
  const [applications, setApplications] = useState<ApplicationEntry[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getApplicationTrackerData(), getTargetOverviewData()])
      .then(([applicationsData, targetData]) => {
        if (!isMounted) return;
        setApplications(applicationsData);
        // getTargetOverviewData() balikin { universities, scholarships }
        // terpisah — di-flatten jadi satu array Target[] karena
        // joinedEntries di bawah lookup by targetId lintas keduanya.
        setTargets([...targetData.universities, ...targetData.scholarships]);
        setLoadError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("Failed to load applications. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Join applications + targets jadi satu bentuk flat yang dipakai
  // sama seluruh komponen di bawah, biar strukturnya gak berubah.
  const joinedEntries = useMemo<ApplicationEntryView[]>(() => {
    return applications
      .map((app) => {
        const target = targets.find((t) => t.id === app.targetId);
        if (!target) return null;

        return {
          id: app.id,
          targetId: app.targetId,
          status: app.status,
          lastUpdatedDate: app.lastUpdatedDate,
          category: target.category,
          institutionName: target.name,
          programName: target.program,
          country: target.country,
          deadlineDate: target.deadline,
        };
      })
      .filter((entry): entry is ApplicationEntryView => entry !== null);
  }, [applications, targets]);

  const [tab, setTab] = useState<ApplicationCategory>("university");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicationStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("deadline-asc");
  const [view, setView] = useState<"list" | "grid">("list");

  // Page number is persisted to sessionStorage (not the URL) so that
  // clicking "View details" then using the browser/back-button to return
  // lands back on the same page. Relying on the URL's ?page= query plus
  // router.back() is unreliable here because Next.js's client-side router
  // cache can restore a stale render captured before the query changed.
  // sessionStorage sidesteps that entirely: we just read it fresh on mount.
  const PAGE_STORAGE_KEY = "application-tracker:page";
  const [page, setPageState] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = Number(window.sessionStorage.getItem(PAGE_STORAGE_KEY));
    if (stored > 0) setPageState(stored);
  }, []);

  function setPage(update: number | ((prev: number) => number)) {
    setPageState((prev) => {
      const next = typeof update === "function" ? (update as (p: number) => number)(prev) : update;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(PAGE_STORAGE_KEY, String(next));
      }
      return next;
    });
  }

  const entriesInTab = useMemo(
    () => joinedEntries.filter((entry) => entry.category === tab),
    [joinedEntries, tab]
  );

  const statCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      "pending-approval": 0,
      "not-started": 0,
      "in-progress": 0,
      submitted: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
    };
    entriesInTab.forEach((entry) => {
      counts[entry.status] += 1;
    });
    return counts;
  }, [entriesInTab]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    let result = entriesInTab.filter((entry) => {
      const matchesQuery =
        query.length === 0 ||
        entry.institutionName.toLowerCase().includes(query) ||
        entry.programName.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case "deadline-asc":
          return a.deadlineDate.localeCompare(b.deadlineDate);
        case "deadline-desc":
          return b.deadlineDate.localeCompare(a.deadlineDate);
        case "updated-desc":
          return b.lastUpdatedDate.localeCompare(a.lastUpdatedDate);
        case "updated-asc":
          return a.lastUpdatedDate.localeCompare(b.lastUpdatedDate);
        case "name-asc":
          return a.institutionName.localeCompare(b.institutionName);
        default:
          return 0;
      }
    });

    return result;
  }, [entriesInTab, search, statusFilter, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedEntries = filteredEntries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function resetToFirstPage() {
    setPage(1);
  }

  return (
    <main className="flex-1 px-8 py-6">
      <ApplicationTrackerHeader notifications={notifications} />

      {isLoading && applications.length === 0 ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-16 text-sm font-medium text-slate-400 shadow-sm">
          Loading applications...
        </div>
      ) : loadError && applications.length === 0 ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 p-16 text-sm font-medium text-rose-500 shadow-sm">
          {loadError}
        </div>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm shadow-slate-100/50 sm:inline-flex">
            <div className="inline-flex">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = t.id === tab;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTab(t.id);
                      setStatusFilter("all");
                      resetToFirstPage();
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {STATUS_ORDER.map((status) => (
              <ApplicationStatCard
                key={status}
                status={status}
                count={statCounts[status]}
                active={statusFilter === status}
                onClick={() => {
                  setStatusFilter((current) => (current === status ? "all" : status));
                  resetToFirstPage();
                }}
              />
            ))}
          </div>

          <ApplicationTrackerToolbar
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              resetToFirstPage();
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => {
              setStatusFilter(value);
              resetToFirstPage();
            }}
            sortKey={sortKey}
            onSortKeyChange={setSortKey}
            view={view}
            onViewChange={setView}
          />

          {pagedEntries.length === 0 ? (
            <ApplicationEmptyState />
          ) : view === "list" ? (
            <ApplicationTable entries={pagedEntries} />
          ) : (
            <ApplicationGrid entries={pagedEntries} />
          )}

          {filteredEntries.length > 0 && (
            <ApplicationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={filteredEntries.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                                */
/* ------------------------------------------------------------------ */

function ApplicationTrackerHeader({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20">
          <ClipboardCheck
            className="h-7 w-7 text-white"
            strokeWidth={2}
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Application Tracker
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage your university and scholarship applications.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell notifications={notifications} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status stat cards                                                    */
/* ------------------------------------------------------------------ */

function ApplicationStatCard({
  status,
  count,
  active,
  onClick,
}: {
  status: ApplicationStatus;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const meta = STAT_CARD_META[status];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition-shadow hover:shadow-sm ${
        active ? "border-blue-200 bg-blue-50/40 ring-1 ring-blue-100" : "border-slate-100 bg-white"
      }`}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${meta.iconBg}`}>
        <Icon className={`h-5 w-5 ${meta.iconColor}`} strokeWidth={2} />
      </div>
      <p className="mt-3 truncate text-sm text-slate-500">{meta.label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
      <p className="mt-0.5 truncate text-xs text-slate-400">{count === 1 ? meta.unit.replace(/s$/, "") : meta.unit}</p>
    </button>
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
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300"
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
        <span>{selected?.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-20 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg shadow-slate-200/60">
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

/* ------------------------------------------------------------------ */
/* Toolbar: search, filter, sort, view toggle                           */
/* ------------------------------------------------------------------ */

function ApplicationTrackerToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortKey,
  onSortKeyChange,
  view,
  onViewChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | ApplicationStatus;
  onStatusFilterChange: (value: "all" | ApplicationStatus) => void;
  sortKey: SortKey;
  onSortKeyChange: (value: SortKey) => void;
  view: "list" | "grid";
  onViewChange: (value: "list" | "grid") => void;
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search university or program..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CustomDropdown
          icon={Filter}
          value={statusFilter}
          options={[
            { value: "all" as const, label: "All Statuses" },
            ...FILTER_STATUS_ORDER.map((status) => ({
              value: status as ApplicationStatus,
              label: STATUS_BADGE_META[status].label,
            })),
          ]}
          onChange={onStatusFilterChange}
        />

        <CustomDropdown icon={ArrowUpDown} value={sortKey} options={SORT_OPTIONS} onChange={onSortKeyChange} />

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            aria-label="List view"
            onClick={() => onViewChange("list")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              view === "list" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <List className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => onViewChange("grid")}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              view === "grid" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits: logo badge, status badge, deadline, actions menu         */
/* ------------------------------------------------------------------ */

// Logo initial & warna sekarang di-generate di sini (bukan dibaca dari
// data) lewat lib/logo-utils.ts. `entry.targetId` dipakai sebagai seed
// warna supaya konsisten tiap render, sama kayak dulu tapi tanpa perlu
// disimpan sebagai field terpisah di data.
function InstitutionLogo({ entry }: { entry: ApplicationEntryView }) {
  const initial = getLogoInitial(entry.institutionName);
  const { bg, text } = getLogoColor(entry.targetId);

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${bg} ${text}`}
    >
      {initial}
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_BADGE_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function DeadlineCell({ dateIso }: { dateIso: string }) {
  const days = daysFromToday(dateIso);
  return (
    <div className="flex items-start gap-2">
      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" strokeWidth={2} />
      <div className="min-w-0">
        <p className="whitespace-nowrap text-sm font-medium text-slate-700">{formatDate(dateIso)}</p>
        <p className={`whitespace-nowrap text-xs font-medium ${days < 0 ? "text-rose-500" : "text-blue-500"}`}>
          {deadlineLabel(days)}
        </p>
      </div>
    </div>
  );
}

function ViewDetailsButton({ targetId, full }: { targetId: string; full?: boolean }) {
  return (
    <Link
      href={`/application-detail/${targetId}`}
      className={`flex items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 ${
        full ? "w-full" : ""
      }`}
    >
      View details
      <ChevronRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* List (table) view                                                    */
/* ------------------------------------------------------------------ */

function ApplicationTable({ entries }: { entries: ApplicationEntryView[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="px-6 py-3.5 font-semibold">University &amp; Program</th>
            <th className="px-6 py-3.5 font-semibold">Deadline</th>
            <th className="px-6 py-3.5 font-semibold">Status</th>
            <th className="px-6 py-3.5 font-semibold">Last Updated</th>
            <th className="px-6 py-3.5 text-right font-semibold" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <InstitutionLogo entry={entry} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900" title={entry.institutionName}>
                      {entry.institutionName}
                    </p>
                    <p className="truncate text-xs text-slate-500" title={entry.programName}>
                      {entry.programName}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
                      {entry.country}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <DeadlineCell dateIso={entry.deadlineDate} />
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={entry.status} />
              </td>
              <td className="px-6 py-4">
                <p className="whitespace-nowrap text-sm text-slate-600">{formatDate(entry.lastUpdatedDate)}</p>
                <p className="whitespace-nowrap text-xs text-slate-400">{relativeLabel(entry.lastUpdatedDate)}</p>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <ViewDetailsButton targetId={entry.targetId} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grid (card) view                                                     */
/* ------------------------------------------------------------------ */

function ApplicationGrid({ entries }: { entries: ApplicationEntryView[] }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <InstitutionLogo entry={entry} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900" title={entry.institutionName}>
                {entry.institutionName}
              </p>
              <p className="truncate text-xs text-slate-500" title={entry.programName}>
                {entry.programName}
              </p>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
            {entry.country}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
            <DeadlineCell dateIso={entry.deadlineDate} />
            <StatusBadge status={entry.status} />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Updated {relativeLabel(entry.lastUpdatedDate)} · {formatDate(entry.lastUpdatedDate)}
          </p>

          <div className="mt-4 border-t border-slate-50 pt-4">
            <ViewDetailsButton targetId={entry.targetId} full />
          </div>
        </div>
      ))}
    </div>
  );
}
/* ------------------------------------------------------------------ */
/* Empty state                                                          */
/* ------------------------------------------------------------------ */

function ApplicationEmptyState() {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
        <Inbox className="h-5 w-5 text-slate-300" strokeWidth={2} />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">No applications match your filters</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400">
        Try a different search term, or clear the status filter to see everything in this tab.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination                                                            */
/* ------------------------------------------------------------------ */

function ApplicationPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {rangeStart} to {rangeEnd} of {totalCount} applications
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 enabled:hover:bg-slate-50 enabled:hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
              p === currentPage
                ? "border border-blue-200 bg-blue-50 text-blue-600"
                : "border border-transparent text-slate-500 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 disabled:opacity-40 enabled:hover:bg-slate-50 enabled:hover:text-slate-600"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}