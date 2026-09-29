"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CircleHelp, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import ProgramCard from "./ProgramCard";

// Logo partner/program yang tampil di header (versi biru, untuk background putih).
// Semua file harus ada di folder /public.
// NB: "WA - biru.png" dan "AGS - biru.png" mengandung spasi di nama filenya.
// Ini tetap jalan di Next.js, tapi kalau mau lebih aman, rename tanpa spasi
// (mis. "WA-biru.png", "AGS-biru.png") lalu update src di bawah ini.
const partnerLogos = [
  {
    src: "/Style_biru.png",
    alt: "Style Edutrip by Schoters",
    className: "h-24 w-auto object-contain -translate-x-24",
  },
  {
    src: "/SA_biru.png",
    alt: "Study Abroad Academy by Schoters",
    className: "h-12 w-auto object-contain -translate-x-14",
  },
  {
    src: "/AGS - biru.png",
    alt: "Alta Global School by Schoters",
    className: "h-12 w-auto object-contain",
  },
  {
    src: "/WA - biru.png",
    alt: "Work Abroad Academy by Schoters",
    className: "h-10 w-auto object-contain translate-x-12",
  },
];

// Ganti sesuai data user yang login (misal dari session/auth context)
const userName = "Rifky";

export default function WelcomeScreen() {
  const programSectionRef = useRef<HTMLElement>(null);

  const handleScrollDown = () => {
    programSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Auto-scroll otomatis ke daftar program 1 detik setelah halaman dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      handleScrollDown();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-dvh w-full flex flex-col overflow-hidden bg-[#f6f8fb]">
      {/* HEADER - tinggi TETAP 88px di semua ukuran layar (sengaja, jangan diubah jadi
          responsif per-breakpoint) karena section banner di bawah pakai -mt-24 yang
          perhitungannya bergantung pada tinggi header ini konsisten. */}
      <header className="relative z-20 w-full h-[88px] shrink-0 bg-white flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-10 py-0 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
        <Image
          src="/logo-schoters.png"
          alt="Schoters by Ruangguru"
          width={220}
          height={62}
          className="h-11 sm:h-14 lg:h-16 w-auto shrink-0 lg:ml-8 xl:ml-12"
          priority
        />

        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {partnerLogos.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={130}
              height={44}
              className={logo.className ?? "h-10 w-auto object-contain"}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 lg:gap-6 shrink-0 lg:-translate-x-6">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-slate-100 px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 lg:-translate-x-4"
          >
            <CircleHelp className="h-4 w-4" />
            <span className="hidden sm:inline">Butuh Bantuan?</span>
          </button>

          <button type="button" className="flex items-center gap-1.5">
            <Image
              src="/Mike.jpg"
              alt="Profil"
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover"
            />
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </header>

      {/* BANNER BIRU - sapaan + judul "Pilih Programmu" */}
      <section className="relative z-10 -mt-24 w-full h-[360px] sm:h-[420px] lg:h-[460px] overflow-hidden">
        <Image
          src="/halaman3KecilAbu.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
        />

        <div className="relative h-full max-w-2xl px-6 sm:px-20 flex flex-col justify-center">
          <p className="text-base sm:text-lg font-medium text-white/85 sm:text-xl">
            Welcome back! 👋
          </p>
          {/* whitespace-nowrap DIHAPUS - dulu ini beresiko bikin teks keluar layar
              di HP kecil karena dipaksa satu baris tanpa peduli lebar layar */}
          <h1 className="mt-1 text-3xl font-extrabold leading-snug text-white sm:text-5xl lg:text-6xl">
            Pilih <span className="text-[#5ec1ff]">Programmu</span>
          </h1>
          <p className="mt-3 max-w-md text-base text-white/80 sm:text-lg lg:text-xl">
            Pilih program yang sesuai dengan tujuanmu dan mulai explore
            sekarang!
          </p>
        </div>

        {/* TOMBOL SCROLL KE BAWAH - di lengkungan banner */}
        <button
          type="button"
          onClick={handleScrollDown}
          aria-label="Scroll ke daftar program"
          className="group absolute bottom-6 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 animate-bounce items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 sm:bottom-8"
        >
          <ChevronDown className="h-7 w-7" />
        </button>
      </section>

      {/* AREA PUTIH - daftar program */}
      <section
        ref={programSectionRef}
        className="relative z-10 flex-1 w-full bg-[#f6f8fb] px-6 pt-2 pb-8 sm:px-20 sm:pt-4 sm:pb-10"
      >
        {/* GRID 3 KARTU PROGRAM - items-stretch supaya tinggi kartu sejajar */}
        <div className="mt-2 mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 items-stretch justify-items-center">
          <ProgramCard
            image="/BG-SA.png"
            icon="/icon1.png"
            title="Study Abroad Academy"
            description="Program bimbingan intensif untuk yang ingin S1/S2/S3 di luar negeri"
            iconSize={44}
            progress={65}
          />
          <ProgramCard
            image="/BG-SA.png"
            icon="/icon2.png"
            title="Work Abroad Academy"
            description="Program bimbingan bahasa dan persiapan dokumen untuk bekerja di luar negeri"
            color="#1d8840"
            locked
          />
          <ProgramCard
            image="/BG-SA.png"
            icon="/icon4.png"
            title="Style Edutrip"
            description="Program EduTrip internasional ke kampus top dan industri ternama luar negeri"
            color="#fc7f05"
            progress={20}
          />
        </div>

        {/* BAR "BELUM MENEMUKAN PROGRAM?" */}
        <div className="relative mt-10 flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b2f8f] via-[#0e53e4] to-[#129cfc] px-6 py-5 shadow-[0_10px_30px_rgba(14,83,228,0.35)] sm:flex-row sm:px-8">
          {/* aksen bulat dekoratif */}
          <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-3 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </span>
            <span>
              <span className="block font-semibold">
                Belum menemukan program yang kamu cari?
              </span>
              <span className="block text-sm text-white/80">
                Jelajahi paket berlangganan kami dan temukan lebih banyak
                pilihan program.
              </span>
            </span>
          </div>
          <button
            type="button"
            className="relative flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0e53e4] transition hover:bg-white/90"
          >
            Jelajahi Paket
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}