"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  MapPin,
  BookOpen,
  GraduationCap,
  Grid2x2,
  Pencil,
  BadgeCheck,
  ChevronRight,
  ShieldCheck,
  ClipboardList,
  FolderClosed,
  Award,
  Users,
  HelpCircle,
  X,
  UploadCloud,
  ImagePlus,
  Trash2,
  Check,
  UserCircle2,
  FileText,
  Lightbulb,
  Compass,
  MessageCircleQuestion,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { ProfileData } from "@/lib/types";
import NotificationBell from "@/components/NotificationBell";
import { AppNotification } from "@/lib/notifications";
import { useUserProfile } from "@/components/UserProvider";

/* ------------------------------------------------------------------ */
/* Icon key -> component lookup. Data layer only stores string keys   */
/* (API-friendly); this map resolves them to actual Lucide icons.     */
/* ------------------------------------------------------------------ */
const ICON_MAP: Record<string, React.ElementType> = {
  userCircle: UserCircle2,
  graduation: GraduationCap,
  shield: ShieldCheck,
  award: Award,
  users: Users,
  folder: FolderClosed,
  lightbulb: Lightbulb,
  compass: Compass,
  messageQuestion: MessageCircleQuestion,
  mapPin: MapPin,
  grid: Grid2x2,
  book: BookOpen,
  fileText: FileText,
  clipboard: ClipboardList,
};

function resolveIcon(key: string): React.ElementType {
  return ICON_MAP[key] ?? UserCircle2;
}

/* ------------------------------------------------------------------ */
/* Color key -> tailwind classes. UI-side only — data layer/API only  */
/* sends stable ids/icon keys, never presentation colors.             */
/* ------------------------------------------------------------------ */
const COLOR_STYLES: Record<string, { bg: string; color: string }> = {
  blue: { bg: "bg-blue-50", color: "text-blue-600" },
  purple: { bg: "bg-purple-50", color: "text-purple-600" },
  emerald: { bg: "bg-emerald-50", color: "text-emerald-600" },
  amber: { bg: "bg-amber-50", color: "text-amber-600" },
  rose: { bg: "bg-rose-50", color: "text-rose-600" },
  indigo: { bg: "bg-indigo-50", color: "text-indigo-600" },
};

// Map per-item id -> nama warna. Ini "sumber kebenaran" tampilan di sisi UI.
// Tambah entry baru di sini kalau ada id baru dari profileSections / faqItems /
// languageTestScores.
const ID_COLOR_MAP: Record<string, keyof typeof COLOR_STYLES> = {
  // profile sections
  personal: "blue",
  "study-preferences": "blue",
  "academic-background": "purple",
  "language-test-scores": "emerald",
  achievements: "amber",
  extracurricular: "rose",
  portfolio: "indigo",
  // faq
  faq1: "amber",
  faq2: "blue",
  faq3: "emerald",
  // language test scores
  ielts: "emerald",
  sat: "indigo",
};

function resolveColor(id: string): { bg: string; color: string } {
  const key = ID_COLOR_MAP[id] ?? "blue";
  return COLOR_STYLES[key];
}

export default function ProfileContent({
  profileData,
  notifications,
}: {
  profileData: ProfileData;
  notifications: AppNotification[];
}) {
  const { user, profileStats, profileSections, faqItems, academicBackground, languageTestScores } =
    profileData;

  // Avatar disimpan di context bersama (UserProvider) supaya Sidebar ikut berubah.
  const { avatarUrl: savedAvatarUrl, updateUser } = useUserProfile();
  const avatarUrl = savedAvatarUrl ?? user.avatarUrl ?? "/Mike.jpg";
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Academic Background — read-only display. Editing via pencil button has been removed.
  const [academicData] = useState(academicBackground);

  // Language & Test Scores — read-only for now; values are expected to sync
  // automatically once test-score integration is wired up.
  const [languageData] = useState(languageTestScores);

  const completedSections = profileSections.filter((section) => section.completed);
  const remainingSections = profileSections.filter((section) => !section.completed);
  const completionPercent = completedSections.reduce((sum, section) => sum + section.weight, 0);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (completionPercent / 100) * circumference;

  return (
    // min-w-0 stops this column from being pushed wider than the screen (no sideways scroll);
    // pt-16 on phones leaves room for the fixed hamburger button of the sidebar drawer.
    <main className="min-w-0 flex-1 px-4 pb-6 pt-16 sm:px-6 md:px-8 md:py-6">
      {/* Header + Notification bell (bell stays pinned to the top-right) */}
      <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-600/20 sm:h-14 sm:w-14">
            <UserCircle2 className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">My Profile</h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:mt-1 sm:text-sm">
              Manage your academic profile and preferences.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <NotificationBell notifications={notifications} />
        </div>
      </div>

      {/* Profile hero: avatar + name + tier, stats grid on the right */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Left: avatar + name + tier + member since */}
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <div className="relative h-24 w-24 shrink-0 sm:ml-3 sm:h-32 sm:w-32">
              <div className="h-full w-full overflow-hidden rounded-full">
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white transition-transform hover:scale-110"
                aria-label="Change profile photo"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0 sm:ml-2">
              <div className="flex items-center gap-2">
                <h2 className="min-w-0 break-words text-lg font-bold text-slate-900 sm:text-xl">
                  {user.name}
                </h2>
                <BadgeCheck className="h-5 w-5 shrink-0 text-blue-600 sm:h-6 sm:w-6" />
              </div>
              <span className="mt-2 inline-flex max-w-full items-center gap-1 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-600">
                🏅 {user.memberTier}
              </span>

              <div className="mt-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Member since</p>
                  <p className="text-sm font-bold text-slate-900">{user.memberSince}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider between the profile info and the stats grid */}
          <div className="hidden h-32 w-px shrink-0 bg-slate-100 lg:block" />

          {/* Right: stats grid, now data-driven */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            {profileStats.map((stat) => (
              <div key={stat.id} className="min-w-0 rounded-xl border border-slate-100 p-4">
                <ProfileStat icon={resolveIcon(stat.icon)} label={stat.label} value={stat.value} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Two-column body: left = Academic / Language / FAQ, right = Profile Strength */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          {/* Academic Background */}
          <CompactCard icon={GraduationCap} title="Academic Background" editable={false}>
            <div>
              <CompactInfoRow label="Curriculum" value={academicData.curriculum} />
              <CompactInfoRow
                label="Academic Average (Scale 100)"
                value={academicData.average}
              />
              <CompactInfoRow
                label="Achievement Level"
                value={academicData.achievementLevel}
                last
              />
            </div>
          </CompactCard>

          {/* Language & Test Scores */}
          <CompactCard icon={ShieldCheck} title="Language & Test Scores" editable={false}>
            <div>
              {languageData.map((score, i) => {
                const { bg, color } = resolveColor(score.id);
                return (
                  <TestScoreRow
                    key={score.id}
                    icon={resolveIcon(score.icon)}
                    bg={bg}
                    color={color}
                    title={score.title}
                    subtitle={score.subtitle}
                    status={score.status}
                    statusColor={score.status === "Not Taken Yet" ? "text-orange-500" : "text-emerald-600"}
                    last={i === languageData.length - 1}
                  />
                );
              })}
            </div>
          </CompactCard>

          {/* FAQ */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900">FAQ</h3>
                <p className="text-xs text-slate-400">Find quick answers about your profile.</p>
              </div>
            </div>

            <div className="mt-3">
              {faqItems.map((item, i) => {
                const Icon = resolveIcon(item.icon);
                const { bg, color } = resolveColor(item.id);
                return (
                  <button
                    key={item.id}
                    className={`flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50 ${
                      i !== faqItems.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.question}</p>
                      <p className="text-xs text-slate-400">{item.answer}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                );
              })}
            </div>

            <button className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all FAQs →
            </button>
          </div>
        </div>

        {/* Right column: Profile Strength */}
        <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
          <div className="flex items-center gap-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Profile Strength</h3>
            <HelpCircle className="h-4 w-4 shrink-0 text-slate-400" />
          </div>

          <div className="mt-4 flex flex-col items-center text-center">
            <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#EFF6FF" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-blue-600">{completionPercent}%</span>
                <span className="text-xs font-medium text-slate-500">Complete</span>
              </div>
            </div>

            <p className="mt-3 text-sm font-bold text-slate-900">Complete your profile</p>
            <p className="mt-1 text-xs text-slate-400">
              {completedSections.length} of {profileSections.length} sections completed
            </p>
            <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-1 flex-col">
            <div className="divide-y divide-slate-100">
              {remainingSections.map((section) => {
                const { bg, color } = resolveColor(section.id);
                return (
                  <RemainingItem
                    key={section.id}
                    icon={resolveIcon(section.icon)}
                    bg={bg}
                    color={color}
                    label={section.label}
                    description={section.description}
                  />
                );
              })}
            </div>

            {/* Filler tip banner — absorbs leftover vertical space with a
               colorful illustrative card instead of leaving a dead gap. */}
            <div className="relative mt-4 flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-500 to-sky-400 p-6 text-center">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                  color: "#ffffff",
                }}
              />
              <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-sky-300/30 blur-2xl" />
              <Sparkles className="pointer-events-none absolute right-6 top-5 h-4 w-4 text-white/60" />
              <Sparkles className="pointer-events-none absolute bottom-8 left-8 h-3 w-3 text-white/40" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <p className="relative text-sm font-bold text-white">
                Complete profiles get matched 3x faster
              </p>
              <p className="relative max-w-[16rem] text-xs text-white/80">
                Finish the sections above to unlock more accurate university and
                scholarship recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete your profile banner */}
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-blue-100/60 bg-gradient-to-r from-blue-50 via-blue-50 to-sky-50 p-4 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-blue-200/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-sky-200/30 blur-2xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-blue-100 sm:h-14 sm:w-14">
              <GraduationCap className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <p className="font-bold leading-snug text-slate-900">
                Complete Your Profile,{" "}
                <span className="block text-blue-600">Unlock Better Matches!</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Complete your profile and discover university or scholarship recommendations
                <br className="hidden lg:block" />{" "}
                that truly fit you.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1.5 sm:mt-3">
            <Link
              href="/target-programs"
              className="group flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-md sm:w-auto"
            >
              Go to My Target
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="text-xs text-slate-500">Find your perfect match</span>
          </div>
        </div>
      </div>

      {/* Avatar upload modal */}
      {isAvatarModalOpen && (
        <AvatarUploadModal
          currentAvatarUrl={avatarUrl}
          onClose={() => setIsAvatarModalOpen(false)}
          onSave={(newUrl) => {
            updateUser({ avatarUrl: newUrl });
            setIsAvatarModalOpen(false);
          }}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar upload modal — unchanged                                     */
/* ------------------------------------------------------------------ */

function AvatarUploadModal({
  currentAvatarUrl,
  onClose,
  onSave,
}: {
  currentAvatarUrl: string;
  onClose: () => void;
  onSave: (url: string) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 5;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const displayUrl = previewUrl ?? currentAvatarUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Update Profile Photo</h3>
            <p className="mt-0.5 text-xs text-slate-400">Choose a clear, recent photo of yourself.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-blue-50">
              <img src={displayUrl} alt="Preview" className="h-full w-full object-cover" />
              {previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40">
                  <Check className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            {previewUrl && (
              <button
                onClick={() => setPreviewUrl(null)}
                className="mt-2 flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3 w-3" />
                Remove selection
              </button>
            )}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              {isDragging ? <UploadCloud className="h-5 w-5" /> : <ImagePlus className="h-5 w-5" />}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {isDragging ? "Drop your photo here" : "Drag & drop a photo, or click to browse"}
            </p>
            <p className="text-xs text-slate-400">JPG, PNG, or WEBP · max {MAX_SIZE_MB}MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            disabled={!previewUrl}
            onClick={() => previewUrl && onSave(previewUrl)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

function ProfileStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | string[];
}) {
  const values = Array.isArray(value) ? value : null;

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-400">{label}</p>
        {values ? (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {values.slice(0, 2).map((v) => (
              <span
                key={v}
                className="max-w-full break-words rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600"
              >
                {v}
              </span>
            ))}
            {values.length > 2 && (
              <span
                title={values.slice(2).join(", ")}
                className="cursor-default rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500"
              >
                +{values.length - 2}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <span className="max-w-full break-words rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">
              {value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CompactCard({
  icon: Icon,
  title,
  children,
  isEditing = false,
  editable = true,
  onEdit,
  onSave,
  onCancel,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  isEditing?: boolean;
  editable?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="min-w-0 text-base font-bold text-slate-900">{title}</h3>
        </div>

        {editable && (
          isEditing ? (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={onCancel}
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={`Edit ${title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )
        )}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

function CompactInfoRow({
  label,
  value,
  last = false,
  isEditing = false,
  onChange,
}: {
  label: string;
  value: string;
  last?: boolean;
  isEditing?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 py-3 sm:gap-4 ${last ? "" : "border-b border-slate-100"}`}>
      <p className="min-w-0 text-sm text-slate-400">{label}</p>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-right text-sm font-bold text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <p className="shrink-0 text-right text-sm font-bold text-slate-900">{value}</p>
      )}
    </div>
  );
}

function TestScoreRow({
  icon: Icon,
  bg,
  color,
  title,
  subtitle,
  status,
  statusColor,
  last = false,
  isEditing = false,
  onChange,
}: {
  icon: React.ElementType;
  bg: string;
  color: string;
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  last?: boolean;
  isEditing?: boolean;
  onChange?: (value: string) => void;
}) {
  const Wrapper = isEditing ? "div" : "button";
  return (
    <Wrapper
      className={`flex w-full items-center gap-3 py-3 text-left transition-colors ${
        isEditing ? "" : "hover:bg-slate-50"
      } ${last ? "" : "border-b border-slate-100"}`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={status}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="e.g. 7.0 or Not Taken Yet"
          className="w-36 shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-right text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <span className={`flex shrink-0 items-center gap-1 text-sm font-semibold ${statusColor}`}>
          {status}
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        </span>
      )}
    </Wrapper>
  );
}

function RemainingItem({
  icon: Icon,
  bg,
  color,
  label,
  description,
}: {
  icon: React.ElementType;
  bg: string;
  color: string;
  label: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg px-2 py-4 text-left transition-colors hover:bg-slate-50 sm:px-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  );
}