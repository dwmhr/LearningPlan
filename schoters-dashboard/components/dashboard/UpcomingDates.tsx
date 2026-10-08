"use client";

import { CalendarClock } from "lucide-react";
import { ScheduleEvent, Deadline, ScheduleEventCategory, DeadlineType } from "@/lib/types";

// Mapping kategori event -> warna dot-nya. Ini murni keputusan tampilan,
// makanya taruh di UI, bukan di data. `event.category` dari lib cuma nunjukin
// JENIS event-nya (ielts, saa, sat, lainnya), bukan warnanya.
const EVENT_DOT: Record<ScheduleEventCategory, string> = {
  ielts: "bg-purple-500",
  saa: "bg-blue-500",
  sat: "bg-orange-500",
  other: "bg-blue-500",
};

// Sama halnya dengan dot warna deadline, diturunkan dari `deadline.type`.
const DEADLINE_DOT: Record<DeadlineType, string> = {
  document: "bg-red-500",
  scholarship: "bg-orange-500",
  university: "bg-rose-500",
};

// Fallback biar tidak crash kalau ada kategori baru dari API yang belum dipetakan di atas.
const DEFAULT_DOT = "bg-slate-400";

// Badge deadline disederhanakan: cuma label tetap "Deadline" warna merah,
// tidak lagi menghitung "X days left" — sesuai revisi desain.
const DEADLINE_BADGE = "bg-red-50 text-red-600";

// Referensi "hari ini" buat filter item yang tanggalnya udah lewat.
// Selalu ambil tanggal device/browser saat ini (local time, bukan UTC),
// jadi otomatis ngikutin tanggal beneran dan berubah tiap hari.
function getTodayIso(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthDay(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return {
    month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    day: date.getDate(),
  };
}

type UpcomingItem = {
  kind: "event" | "deadline";
  id: string;
  date: string;
  dot: string;
  title: string;
  line?: string;
};

// Gabungan Schedule + Deadlines jadi satu list "Upcoming Events", diurutkan dari
// tanggal terdekat. Read-only — tidak ada tambah/edit jadwal karena input data
// hanya dilakukan oleh admin, siswa hanya melihat.
export default function UpcomingDates({
  events,
  deadlines,
}: {
  events: ScheduleEvent[];
  deadlines: Deadline[];
}) {
  const todayIso = getTodayIso();

  const items: UpcomingItem[] = [
    ...events.map((ev): UpcomingItem => ({
      kind: "event",
      id: ev.id,
      date: ev.date,
      dot: EVENT_DOT[ev.category] ?? DEFAULT_DOT,
      title: ev.title,
      line: `${ev.startTime} – ${ev.endTime}`,
    })),
    ...deadlines.map((d): UpcomingItem => ({
      kind: "deadline",
      id: d.id,
      date: d.date,
      dot: DEADLINE_DOT[d.type] ?? DEFAULT_DOT,
      title: d.title,
    })),
  ]
    // Cuma tampilin yang tanggalnya hari ini atau ke depan — biar bener-bener "upcoming",
    // bukan ikut nampilin event/deadline yang udah lewat.
    .filter((item) => item.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Tetep 5 item, gabungan event + deadline (gak dipisah kuota masing-masing).
  const visibleItems = items.slice(0, 5);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <CalendarClock className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Upcoming Events</h2>
          <p className="text-xs text-slate-400">Important dates and schedules ahead.</p>
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <p className="py-8 text-center text-xs text-slate-400">No upcoming events.</p>
      ) : (
        <ul>
          {visibleItems.map((item, idx) => {
            const { month, day } = formatMonthDay(item.date);
            return (
              <li key={`${item.kind}-${item.id}`} className="relative flex gap-3 pb-6 last:pb-0">
                {idx !== visibleItems.length - 1 && (
                  <span className="absolute left-[18px] top-11 h-[calc(100%-1.75rem)] w-px bg-slate-200" />
                )}

                <div className="flex w-9 shrink-0 flex-col items-center leading-tight">
                  <span className="text-[10px] font-semibold text-slate-400">{month}</span>
                  <span className="text-base font-bold text-slate-800">{day}</span>
                </div>

                <span className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`} />

                <div className="min-w-0 flex-1 pb-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
                  {item.kind === "event" ? (
                    <p className="text-xs text-slate-400">{item.line}</p>
                  ) : (
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${DEADLINE_BADGE}`}
                    >
                      Deadline
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}