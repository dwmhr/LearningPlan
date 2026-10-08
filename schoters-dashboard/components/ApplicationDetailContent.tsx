"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  FileText,
  ListChecks,
  ExternalLink,
  Landmark,
  Gift,
  StickyNote,
  GraduationCap,
  User,
  IdCard,
  Mail,
  Hourglass,
  CheckCircle2,
  CircleDot,
  XCircle,
  MinusCircle,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Globe,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { isUniversity } from "@/lib/target-overview-types";
import { DocumentRequirementCategory, DocumentStatus } from "@/lib/documents-types";
import { ApplicationStatus } from "@/lib/application-tracker-types";
import {
  ApplicationDetailView,
} from "@/lib/application-detail";
import { getLogoInitial, getLogoColor } from "@/lib/logo-utils";

type Tab = "overview" | "documents";

/* ------------------------------------------------------------------ */
/* Static config — mirrors STATUS_BADGE_META in ApplicationTrackerContent
   and DocumentsContent so the same status reads the same everywhere. */
/* ------------------------------------------------------------------ */

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

type DocStatusMeta = { label: string; bg: string; text: string; dot: string; icon: LucideIcon };

const DOCUMENT_STATUS_META: Record<DocumentStatus, DocStatusMeta> = {
  ready: { label: "Ready", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", icon: CircleDot },
  "not-ready": { label: "Not Ready", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", icon: XCircle },
  "not-required": { label: "Not Required", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400", icon: MinusCircle },
};

function formatDate(dateIso: string) {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

// Slightly more compact card wrapper used by Overview & Documents tabs
// (was p-5 / gap-3 / icon 40px+20px — trimmed down a notch).
function SectionCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  action,
  children,
  className,
}: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/50 ${className ?? ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={iconColor} size={18} strokeWidth={2} />
          </span>
          <h3 className="min-w-0 text-base font-semibold text-slate-900">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function ApplicationDetailContent({
  data,
}: {
  data: ApplicationDetailView;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Lets links like `/application-detail/{id}?tab=documents` (used from
  // the Documents page's "View details" button) open straight into the
  // Documents tab instead of always defaulting to Overview.
  const initialTab: Tab = searchParams.get("tab") === "documents" ? "documents" : "overview";
  const [tab, setTab] = useState<Tab>(initialTab);
  const { target } = data;
  const statusMeta = STATUS_BADGE_META[data.status];
  const docsPercent =
    data.documentsTotalCount === 0
      ? 0
      : Math.round((data.documentsReadyCount / data.documentsTotalCount) * 100);
  const days = daysFromToday(target.deadline);

  // Logo initial & warna di-generate di sini (bukan dibaca dari data) lewat
  // lib/logo-utils.ts — `target.id` dipakai sebagai seed warna supaya
  // konsisten tiap render tanpa perlu field terpisah di data.
  const logoInitial = getLogoInitial(target.name);
  const logoColor = getLogoColor(target.id);

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-8 md:py-6">
      {/* Page header — matches the other dashboard pages' header pattern */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {/* Back button now uses browser history instead of a hardcoded
              href, so it always returns to whichever page the user came
              from (Documents, Application Tracker, etc). */}
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20 transition hover:bg-blue-700 sm:h-14 sm:w-14"
          >
            <ChevronLeft className="h-6 w-6 text-white" strokeWidth={2.5} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">Application Detail</h1>
            <p className="mt-1 text-sm text-slate-500">
              View your university and scholarship application details.
            </p>
          </div>
        </div>
      </div>

      {/* Summary bar: bertumpuk di bawah xl, sejajar di xl ke atas */}
      <div className="mt-6 flex min-w-0 flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-6 xl:flex-row xl:items-center xl:gap-10">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5 xl:flex-1">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold sm:h-16 sm:w-16 ${logoColor.bg} ${logoColor.text}`}
          >
            {logoInitial}
          </span>
          <div className="min-w-0">
            <h2
              className="line-clamp-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
              title={target.name}
            >
              {target.name}
            </h2>
            <p className="text-base text-slate-500">{target.program}</p>
            <p className="flex items-center gap-1 text-sm text-slate-400">{target.country}</p>
          </div>
        </div>

        {/* Bigger text/icons/gaps here (instead of stretching with flex-1)
            so the row fills the width naturally without leftover empty
            space, while staying readable and not cramped.
            Di bawah xl: grid 1 kolom (HP) / 2 kolom (sm), tanpa garis pemisah.
            Di xl: baris dengan garis pemisah seperti semula. */}
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:ml-auto xl:flex xl:shrink-0 xl:flex-wrap xl:items-center xl:gap-y-4 xl:divide-x xl:divide-slate-300">
          <div className="flex items-start gap-2.5 xl:border-l xl:border-slate-300 xl:pl-8 xl:pr-8">
            <Calendar size={22} className="mt-0.5 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-base text-slate-500">Deadline</p>
              <p className="text-lg font-semibold text-slate-900">{formatDate(target.deadline)}</p>
              <p className={`text-sm font-medium ${days < 0 ? "text-rose-500" : "text-blue-600"}`}>
                {deadlineLabel(days)}
              </p>
            </div>
          </div>

          {data.lastUpdatedDate && (
            <div className="flex items-start gap-2.5 xl:px-8">
              <Clock size={22} className="mt-0.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-base text-slate-500">Last updated</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatDate(data.lastUpdatedDate)}
                </p>
              </div>
            </div>
          )}

          <div className="xl:px-8">
            <span
              className={`flex w-fit items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-base font-semibold ${statusMeta.bg} ${statusMeta.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
          </div>

          {data.documentsTotalCount > 0 && (
            <div className="flex items-start gap-2.5 xl:px-8 xl:last:pr-0">
              <FileText size={22} className="mt-0.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-base text-slate-500">Documents Ready</p>
                <p className="text-lg font-semibold text-slate-900">
                  {data.documentsReadyCount}/{data.documentsTotalCount}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${docsPercent}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400">{docsPercent}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex w-full gap-1 rounded-xl border border-slate-100 bg-white p-1 shadow-sm shadow-slate-100/50 sm:w-fit">
        <button
          type="button"
          onClick={() => setTab("overview")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
            tab === "overview" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ListChecks size={16} />
          Overview
        </button>
        <button
          type="button"
          onClick={() => setTab("documents")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition sm:flex-none ${
            tab === "documents" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText size={16} />
          Documents
        </button>
      </div>

      <div className="mt-6 min-w-0">
        {tab === "overview" ? <OverviewTab data={data} /> : <DocumentsTab data={data} />}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Overview tab                                                         */
/* ------------------------------------------------------------------ */

// TODO: once `Target` in lib/target-overview-types.ts gains real
// `websiteUrl` / `admissionGuideUrl` / `scholarshipInfoUrl` fields, this
// cast can be removed and `target.websiteUrl` etc. can be used directly.
type TargetWithLinks = ApplicationDetailView["target"] & {
  websiteUrl?: string;
  admissionGuideUrl?: string;
  scholarshipInfoUrl?: string;
};

function OverviewTab({ data }: { data: ApplicationDetailView }) {
  const target = data.target as TargetWithLinks;

  // Collect whichever links exist. Anything not yet present on the data
  // model is simply skipped, so this won't break until you add the
  // fields — but to match the target design exactly, add:
  //   websiteUrl, registrationLink (already exists), admissionGuideUrl,
  //   scholarshipInfoUrl to Target in target-overview-types.ts + data.
  const links = (
    [
      target.websiteUrl && {
        icon: Globe,
        label: "University Website",
        desc: "Visit the official university website",
        href: target.websiteUrl,
      },
      target.registrationLink && {
        icon: ExternalLink,
        label: "Application Portal",
        desc: "Access the application portal",
        href: target.registrationLink,
      },
      target.admissionGuideUrl && {
        icon: FileText,
        label: "Admission Guide",
        desc: "View admission requirements and guide",
        href: target.admissionGuideUrl,
      },
      target.scholarshipInfoUrl && {
        icon: BookOpen,
        label: "Scholarship Information",
        desc: "Learn about available scholarships",
        href: target.scholarshipInfoUrl,
      },
    ] as const
  ).filter(Boolean) as {
    icon: LucideIcon;
    label: string;
    desc: string;
    href: string;
  }[];

  return (
    <div className="min-w-0 space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Important Links (was: Registration) */}
        <SectionCard icon={ExternalLink} iconBg="bg-blue-50" iconColor="text-blue-600" title="Important Links">
          {links.length === 0 ? (
            <p className="text-sm text-slate-400">No links available yet.</p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <link.icon size={18} className="shrink-0 text-slate-400" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-800">{link.label}</span>
                      <span className="block text-xs text-slate-400">{link.desc}</span>
                    </span>
                  </span>
                  <ExternalLink size={14} className="shrink-0 text-slate-400" />
                </a>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Program Information */}
        <SectionCard icon={Landmark} iconBg="bg-indigo-50" iconColor="text-indigo-600" title="Program Information">
          <dl className="divide-y divide-slate-100 text-sm">
            {(
              [
                ["Name", target.name],
                ["Program", target.program],
                ["Country", target.country],
                ["Deadline", formatDate(target.deadline)],
                ["Readiness", `${target.readiness}%`],
              ] as [string, string][]
            ).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                <dt className="shrink-0 text-slate-400">{label}</dt>
                <dd className="min-w-0 break-words text-right font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </SectionCard>

        {/* Notes — moved here, next to Program Information (was its own
            full-width section below; Application Status has been removed). */}
        <SectionCard icon={StickyNote} iconBg="bg-rose-50" iconColor="text-rose-600" title="Notes">
          {data.notes.length === 0 ? (
            <p className="text-sm text-slate-400">No notes for this target yet.</p>
          ) : (
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
              {data.notes.map((note) => (
                <li key={note} className="break-words">{note}</li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Scholarship Details — only rendered when the target itself IS a
          scholarship. Application Status and Document Readiness sections
          have been removed entirely per request. */}
      {!isUniversity(target) && (
        <div className="grid grid-cols-1 gap-5">
          <SectionCard icon={Gift} iconBg="bg-purple-50" iconColor="text-purple-600" title="Scholarship Details">
            <dl className="divide-y divide-slate-100 text-sm">
              {(
                [
                  ["Funding type", target.fundingType],
                  ["Coverage", target.coverage],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2">
                  <dt className="shrink-0 text-slate-400">{label}</dt>
                  <dd className="min-w-0 break-words text-right font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documents tab                                                        */
/* ------------------------------------------------------------------ */

type DocumentRequirementRow = ApplicationDetailView["documentRequirements"][number];

// `DocumentRequirement.category` ("personal" | "program") is now set
// explicitly at the source (buildRequirementTemplate in
// lib/target-overview-data.ts), so no more name-matching/guessing here.
type DocCategoryKey = DocumentRequirementCategory;

// TODO: `DocumentRequirement.icon` / `DocumentItem.icon` are string keys
// rather than components. Map the ones seen in target-overview-data.ts to
// Lucide icons, falling back to FileText for anything unrecognized.
const DOCUMENT_ICON_MAP: Record<string, LucideIcon> = {
  "id-card": IdCard,
  "file-text": FileText,
  mail: Mail,
};

function resolveDocIcon(iconKey: string): LucideIcon {
  return DOCUMENT_ICON_MAP[iconKey] ?? FileText;
}

// TODO: `DocumentRequirement` has no real file/filename field yet — only
// `lastUpdatedDate`. Until an actual `fileName` exists on the model, we
// fabricate a plausible one from the document name so the FILE column
// isn't empty for documents that already have a date. Swap this for
// `doc.fileName` once it's added to the type.
function fabricateFileName(documentName: string): string {
  const slug = documentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${slug}.pdf`;
}

const DOC_CATEGORY_META: Record<
  DocCategoryKey,
  { title: string; subtitle: string; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  personal: {
    title: "Personal Documents",
    subtitle: "Basic documents required for most applications.",
    icon: User,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  program: {
    title: "Program Specific Documents",
    subtitle: "Additional documents required by this program.",
    icon: GraduationCap,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
};

function DocumentCategorySection({
  categoryKey,
  docs,
}: {
  categoryKey: DocCategoryKey;
  docs: DocumentRequirementRow[];
}) {
  const [open, setOpen] = useState(true);
  const meta = DOC_CATEGORY_META[categoryKey];
  const readyCount = docs.filter((d) => d.status === "ready").length;

  return (
    <div className="min-w-0 rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-100/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}>
            <meta.icon className={meta.iconColor} size={20} strokeWidth={2} />
          </span>
          <div className="min-w-0 text-left">
            <h3 className="text-base font-semibold text-slate-900">{meta.title}</h3>
            <p className="text-xs text-slate-400">{meta.subtitle}</p>
            {/* HP: jumlah selesai pindah ke bawah subtitle */}
            <p className="mt-1 text-xs font-medium text-slate-500 sm:hidden">
              {readyCount} of {docs.length} completed
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-sm font-medium text-slate-500 sm:inline">
            {readyCount} of {docs.length} completed
          </span>
          {open ? (
            <ChevronUp size={18} className="text-slate-400" />
          ) : (
            <ChevronDown size={18} className="text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="max-w-full overflow-x-auto border-t border-slate-100">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Document Name</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">File (if available)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((doc) => {
                const statusMeta = DOCUMENT_STATUS_META[doc.status];
                const DocIcon = resolveDocIcon(doc.icon);
                const showFile = doc.lastUpdatedDate !== null;
                return (
                  <tr key={doc.id}>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${doc.iconBg}`}>
                          <DocIcon size={16} className={doc.iconText} />
                        </span>
                        <span className="text-sm font-medium text-slate-800">{doc.documentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="text-xs text-slate-500">{doc.description}</span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {showFile ? (
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="shrink-0 text-blue-500" />
                          <span className="text-xs text-blue-600">{fabricateFileName(doc.documentName)}</span>
                          <span className="whitespace-nowrap text-xs text-slate-400">
                            {formatDate(doc.lastUpdatedDate as string)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Document Readiness summary — ring progress + status counts + guide */
/* ------------------------------------------------------------------ */

// TODO: `Target` doesn't have `admissionGuideUrl` yet (see the
// TargetWithLinks TODO in OverviewTab above) — reusing the same cast here
// so "View Guide" has somewhere real to point once that field exists.
type TargetWithGuide = ApplicationDetailView["target"] & {
  admissionGuideUrl?: string;
};

function ReadinessRing({ percent }: { percent: number }) {
  const size = 88;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563eb"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-slate-900">{percent}%</span>
      </div>
    </div>
  );
}

function DocumentReadinessSummary({ data }: { data: ApplicationDetailView }) {
  const docs = data.documentRequirements;
  const total = docs.length;
  const readyCount = docs.filter((d) => d.status === "ready").length;
  const inProgressCount = docs.filter((d) => d.status === "in-progress").length;
  const notReadyCount = docs.filter((d) => d.status === "not-ready").length;
  const percent = total === 0 ? 0 : Math.round((readyCount / total) * 100);

  const target = data.target as TargetWithGuide;
  const guideHref = target.admissionGuideUrl;

  return (
    <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5 xl:flex-row xl:items-center xl:gap-0 xl:overflow-hidden">
      <div className="xl:border-r xl:border-slate-100 xl:pr-6">
        <h3 className="whitespace-nowrap text-base font-semibold text-slate-900">Document Readiness</h3>
        <p className="text-xs text-slate-400">Overall progress for this application.</p>
      </div>

      <div className="flex items-center gap-4 pt-3 xl:border-r xl:border-slate-100 xl:px-6 xl:pt-0">
        <ReadinessRing percent={percent} />
        <div>
          <p className="whitespace-nowrap text-2xl font-bold text-slate-900">
            {readyCount} of {total}
          </p>
          <p className="whitespace-nowrap text-sm text-slate-400">documents ready</p>
        </div>
      </div>

      {/* Di bawah xl: kotak status bertumpuk (HP) / 3 kolom (sm).
          Di xl: baris sejajar dengan lebar tetap, rata kanan seperti semula
          (flex-1 mengisi sisa ruang sehingga box Document Guidelines
          menempel rapi ke ujung kanan card). */}
      <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3 xl:flex xl:flex-1 xl:items-center xl:justify-end xl:gap-5 xl:px-6 xl:pt-0">
        <div className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl bg-emerald-50 px-3.5 py-2 xl:w-32 xl:shrink-0">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <div>
            <p className="text-lg font-bold leading-tight text-slate-900">{readyCount}</p>
            <p className="text-xs text-slate-500">Ready</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl bg-amber-50 px-3.5 py-2 xl:w-32 xl:shrink-0">
          <Hourglass size={20} className="shrink-0 text-amber-600" />
          <div>
            <p className="text-lg font-bold leading-tight text-slate-900">{inProgressCount}</p>
            <p className="text-xs text-slate-500">In Progress</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl bg-rose-50 px-3.5 py-2 xl:w-32 xl:shrink-0">
          <XCircle size={20} className="shrink-0 text-rose-600" />
          <div>
            <p className="text-lg font-bold leading-tight text-slate-900">{notReadyCount}</p>
            <p className="text-xs text-slate-500">Not Ready</p>
          </div>
        </div>
      </div>

      {/* xl:ml-5 memberi jarak tetap dari kotak-kotak status di sebelah
          kiri. Di bawah xl, box ini full-width di bawah. */}
      <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-blue-50/60 p-3.5 xl:ml-5 xl:w-64 xl:shrink-0">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <FileText size={16} className="text-blue-600" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-900">Document Guidelines</p>
          <p className="mt-0.5 text-xs text-slate-500">
            View the official document requirements from the university.
          </p>
          <a
            href={guideHref ?? "#"}
            target={guideHref ? "_blank" : undefined}
            rel={guideHref ? "noopener noreferrer" : undefined}
            className={`mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${
              guideHref ? "text-blue-600 hover:text-blue-700" : "cursor-not-allowed text-slate-300"
            }`}
            onClick={(e) => {
              if (!guideHref) e.preventDefault();
            }}
          >
            View Guide
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ data }: { data: ApplicationDetailView }) {
  if (data.documentRequirements.length === 0) {
    return (
      <div className="min-w-0 space-y-5">
        <DocumentReadinessSummary data={data} />
        <SectionCard icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-600" title="Document Requirements">
          <p className="text-sm text-slate-400">No document requirements defined for this target.</p>
        </SectionCard>
      </div>
    );
  }

  const docs = data.documentRequirements;

  // Group by category — `doc.category` is set explicitly in
  // buildRequirementTemplate (lib/target-overview-data.ts), no more
  // guessing/matching needed here.
  const grouped: Record<DocCategoryKey, DocumentRequirementRow[]> = {
    personal: [],
    program: [],
  };
  for (const doc of docs) {
    grouped[doc.category].push(doc);
  }

  return (
    <div className="min-w-0 space-y-5">
      <DocumentReadinessSummary data={data} />
      {(Object.keys(grouped) as DocCategoryKey[])
        .filter((key) => grouped[key].length > 0)
        .map((key) => (
          <DocumentCategorySection key={key} categoryKey={key} docs={grouped[key]} />
        ))}
    </div>
  );
}