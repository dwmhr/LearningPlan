"use client";

import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";

interface ProgramCardProps {
  image: string;
  icon: string;
  title: string;
  description: string;
  href?: string;
  color?: string;
  locked?: boolean;
  iconSize?: number;
  /** Progres belajar dalam persen (0-100). Kalau diisi, progress bar akan tampil. */
  progress?: number;
  /** Teks tombol aksi utama (kartu yang tidak terkunci). */
  ctaLabel?: string;
}

export default function ProgramCard({
  image,
  icon,
  title,
  description,
  href = "#",
  color = "#0e53e4",
  locked = false,
  iconSize = 26,
  progress,
  ctaLabel,
}: ProgramCardProps) {
  const showProgress = !locked && typeof progress === "number";
  // Label tombol otomatis: belum mulai (0% / belum ada data) -> "Mulai Belajar",
  // sudah jalan (progress > 0%) -> "Lanjutkan Program". Bisa di-override manual lewat prop ctaLabel.
  const resolvedCtaLabel =
    ctaLabel ?? (progress && progress > 0 ? "Lanjutkan Program" : "Mulai Belajar");

  return (
    <div className="flex h-full w-72 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      {/* GAMBAR ATAS - full di belakang, dikasih tint warna sesuai warna
          kartu (biru/oranye). Tingginya sengaja dibikin lebih dari area
          yang bakal keliatan, karena card putih di bawah bakal naik dan
          nutupin sebagian bawahnya (overlap). */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover ${locked ? "grayscale" : ""}`}
        />
        {/* TINT WARNA - cuma nempel di gambar, sesuai warna masing-masing kartu */}
        {!locked && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color"
            style={{ backgroundColor: color, opacity: 0.55 }}
          />
        )}

        {/* BADGE POJOK KANAN ATAS */}
        {locked && (
          <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Terkunci
          </div>
        )}
      </div>

      {/* CARD PUTIH - ditarik naik (-mt-6) supaya nutupin bagian bawah
          gambar, sudut atasnya dibulatin (rounded-t-2xl) biar keliatan
          "naik menutupi" foto, bukan cuma nempel rapi di bawahnya. */}
      <div className="relative z-10 -mt-6 flex flex-1 flex-col rounded-t-2xl bg-white">
        {/* IKON - ngambang di persimpangan gambar & card putih, absolute
            ditarik ke atas dari tepi card ini supaya separuh nutup foto,
            separuh nutup putih. Ring putih biar keliatan bersih/floating. */}
        <div className="relative px-5">
          <div
            className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-xl ring-4 ring-white"
            style={{ backgroundColor: locked ? "#EEF0F4" : color }}
          >
            {locked ? (
              <Lock className="h-6 w-6 text-slate-400" />
            ) : (
              <Image
                src={icon}
                alt=""
                width={iconSize}
                height={iconSize}
                className="object-contain"
                style={{ width: iconSize, height: iconSize }}
              />
            )}
          </div>
        </div>

        {/* KONTEN - teks rata kiri, dikasih jarak atas ekstra (pt) supaya
            nggak ketimpa ikon yang ngambang di atasnya */}
        <div className="flex flex-1 flex-col justify-between px-5 pb-4 pt-7 text-left">
          <div>
            <h3
              className={`text-base font-extrabold leading-snug ${
                locked ? "text-slate-400" : "text-[#0B3FA8]"
              }`}
            >
              {title}
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                locked ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {description}
            </p>
          </div>

          {locked ? (
            <div className="mt-4">
              {/* KOTAK "Program premium" - pengganti pill "Terkunci" polos */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3">
                <Lock className="h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Program premium
                  </p>
                  <p className="text-xs text-slate-400">
                    Berlangganan untuk lihat
                  </p>
                </div>
              </div>

              {/* TOMBOL "Buka Akses" - baru, mengarahkan ke halaman berlangganan */}
              <a
                href={href}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#EDEBFB] px-4 py-2.5 text-sm font-semibold text-[#5B4FE0] transition hover:bg-[#e2ddfa]"
              >
                Buka Akses
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <div className="mt-4">
              {/* PROGRESS BAR - hanya tampil kalau prop `progress` diisi */}
              {showProgress && (
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">Progress Kamu</span>
                    <span style={{ color }}>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, progress ?? 0))}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              )}

              <a
                href={href}
                className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: color }}
              >
                {resolvedCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}