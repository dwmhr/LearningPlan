"use client";

import { Target, FileText, GraduationCap, BookOpen, Award } from "lucide-react";
import { NextAction, PriorityLevel, ActionCategory } from "@/lib/types";

// Mapping kategori aksi -> ikon + warna background/text-nya.
// Ini murni keputusan tampilan, makanya taruh di UI, bukan di data.
// `action.category` dari lib cuma nunjukin JENIS aksinya (dokumen, tes bahasa,
// latihan akademik, beasiswa), bukan nama komponen ikon atau warnanya.
interface IconStyle {
  Icon: typeof FileText;
  classes: string;
}

const ICON_STYLES: Record<ActionCategory, IconStyle> = {
  document: { Icon: FileText, classes: "bg-blue-50 text-blue-600" },
  "language-test": { Icon: GraduationCap, classes: "bg-purple-50 text-purple-600" },
  "academic-practice": { Icon: BookOpen, classes: "bg-emerald-50 text-emerald-600" },
  scholarship: { Icon: Award, classes: "bg-orange-50 text-orange-600" },
};

// Data (`action.priority`) cuma berupa string "High" | "Medium" | "Low" dari lib.
// Semua keputusan warna — nomor urut, badge, background row, teks "Due ..." —
// murni ditentukan di sini, bukan dari data.
interface PriorityStyle {
  row: string;
  rankBg: string;
  rankText: string;
  badge: string;
  due: string;
  label: string;
}

const PRIORITY_COLORS: Record<PriorityLevel, PriorityStyle> = {
  High: {
    row: "bg-red-50/60",
    rankBg: "bg-red-100",
    rankText: "text-red-600",
    badge: "bg-red-100 text-red-600",
    due: "text-red-600",
    label: "High Priority",
  },
  Medium: {
    row: "bg-orange-50/60",
    rankBg: "bg-orange-100",
    rankText: "text-orange-600",
    badge: "bg-orange-100 text-orange-600",
    due: "text-orange-600",
    label: "Medium Priority",
  },
  Low: {
    row: "bg-amber-50/60",
    rankBg: "bg-amber-100",
    rankText: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
    due: "text-amber-700",
    label: "Low Priority",
  },
};

// Urutan prioritas buat sorting tampilan — High duluan, baru Medium, baru Low.
// Ini murni keputusan UI: data di lib gak perlu diurutkan, urutan aslinya bebas.
const PRIORITY_ORDER: Record<PriorityLevel, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

// Referensi "hari ini" buat hitung "Due today" / "Due in X days".
// Selalu ambil tanggal device/browser saat ini (local time, bukan UTC),
// jadi otomatis ngikutin tanggal beneran dan berubah tiap hari.
function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(dateIso: string, fromIso: string) {
  const date = new Date(`${dateIso}T00:00:00`);
  const from = new Date(`${fromIso}T00:00:00`);
  return Math.round((date.getTime() - from.getTime()) / 86400000);
}

function dueLabel(daysLeft: number) {
  if (daysLeft <= 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";
  return `Due in ${daysLeft} days`;
}

// Read-only priority list — siswa cuma bisa melihat, semua aksi (mark as done, dll)
// dihapus karena input data hanya dilakukan oleh admin.
export default function NextActions({ actions }: { actions: NextAction[] }) {
  const todayIso = getTodayIso();
  const visibleActions = [...actions]
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 4);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <Target className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Priority Tasks</h2>
          <p className="text-xs text-slate-400">Focus on these action items to keep moving forward.</p>
        </div>
      </div>

      <div className="space-y-3">
        {visibleActions.map((action, index) => {
          const iconStyle = ICON_STYLES[action.category];
          const colors = PRIORITY_COLORS[action.priority];
          const daysLeft = daysBetween(action.dueDate, todayIso);

          return (
            <div
              key={action.id}
              className={`flex items-center gap-3 rounded-xl p-3.5 ${colors.row}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colors.rankBg} ${colors.rankText}`}
              >
                {index + 1}
              </span>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle.classes}`}
              >
                <iconStyle.Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{action.label}</p>
                <p className="truncate text-xs text-slate-400">{action.description}</p>
              </div>

              <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colors.badge}`}>
                  {colors.label}
                </span>
                <span className={`text-[11px] font-medium ${colors.due}`}>{dueLabel(daysLeft)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}