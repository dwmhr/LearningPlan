"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Briefcase, Globe2, Sparkles, ArrowRight } from "lucide-react";

// Logo partner/program yang tampil di header.
// Semua file harus ada di folder /public.
// NB: "WA - biru.png" dan "AGS - biru.png" mengandung spasi di nama filenya.
// Ini tetap jalan di Next.js, tapi kalau mau lebih aman, rename tanpa spasi
// (mis. "WA-biru.png", "AGS-biru.png") lalu update src di bawah ini.
//
// Ukuran & posisi logo di sini SENGAJA fixed (bukan clamp/vw) — disamakan
// persis dengan header WelcomeScreen, karena header total tingginya dikunci
// 88px di semua ukuran layar. Kalau logo dibikin scale mengikuti layar,
// beberapa ukuran bisa jadi lebih tinggi dari 88px dan bikin header numpuk.
const partnerLogos = [
  { src: "/Style_biru.png", alt: "Style Edutrip by Schoters", className: "h-24 w-auto object-contain -translate-x-24" },
  { src: "/SA_biru.png", alt: "Study Abroad Academy by Schoters", className: "h-12 w-auto object-contain -translate-x-14" },
  { src: "/AGS - biru.png", alt: "Alta Global School by Schoters", className: "h-12 w-auto object-contain" },
  { src: "/WA - biru.png", alt: "Work Abroad Academy by Schoters", className: "h-10 w-auto object-contain translate-x-12" },
];

const features = [
  { icon: GraduationCap, label: "Kuliah & Beasiswa luar negri", bg: "#0e53e4", big: true },
  { icon: Briefcase, label: "Persiapan Karir Global", bg: "#1d8840" },
  { icon: Globe2, label: "Akademik & Portofolio", bg: "#6a53e6" },
  { icon: Sparkles, label: "Experience & Personal Growth", bg: "#fc7f05" },
];

export default function LoginPage() {
  return (
    // h-dvh (bukan min-h-dvh) + overflow-hidden = tinggi halaman dikunci pas
    // setinggi layar, gak bisa melebihi -> gak akan pernah muncul scrollbar.
    <main className="h-dvh w-full flex flex-col overflow-hidden">
      {/* ================= HEADER ================= */}
      {/* Tinggi TETAP 88px di semua ukuran layar (disamakan dengan WelcomeScreen).
          Jangan diubah jadi responsif per-breakpoint, karena section di bawah
          menghitung sisa tinggi berdasarkan header ini konsisten 88px. */}
      <header className="w-full h-[88px] shrink-0 bg-white flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6 lg:px-10 py-0 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
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
            <Image key={logo.alt} src={logo.src} alt={logo.alt} width={130} height={44} className={logo.className} />
          ))}
        </div>

        <div className="flex items-center gap-2 lg:gap-3 shrink-0 lg:-translate-x-6">
          <span className="hidden sm:inline text-sm lg:text-base text-slate-500">Belum punya akun?</span>
          <a
            href="#"
            className="rounded-full border border-[#0B3FA8] px-4 lg:px-5 py-1.5 lg:py-2 text-sm lg:text-base font-semibold text-[#0B3FA8] transition hover:bg-[#0B3FA8]/5 whitespace-nowrap"
          >
            Sign Up
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      {/* flex-1 -> otomatis dapet SISA tinggi layar (100dvh - 88px header).
          overflow-hidden -> kalau konten sedikit kepanjangan, dipotong halus
          alih-alih munculin scrollbar. Semua ukuran di dalam pakai vh (bukan
          cuma vw) supaya ikut ngecil kalau tinggi layar mepet, bukan cuma
          lebar layar — ini yang bikin dulu kepotong/scroll di laptop pendek. */}
      <section className="flex-1 min-h-0 overflow-hidden bg-[#052e67] flex items-center">
        <div className="mx-auto w-full lg:h-full max-w-[1400px] px-4 sm:px-8 lg:px-12">
          <div
            className="flex flex-col lg:flex-row lg:h-full items-center gap-[min(4vh,2.5rem)] lg:gap-10"
            style={{ transform: "translateX(clamp(0px, 2.5vw, 2.75rem))" }}
          >
            {/* Ilustrasi */}
            {/* Dulu box-nya dipaksa aspect-square (1:1), padahal gambar aslinya
                lebih landscape -> banyak ruang kotak yang kebuang jadi spasi
                kosong (letterboxing) alih-alih dipakai gambar. Sekarang box
                desktop nggak dipaksa 1:1 lagi: tingginya = 100% tinggi section
                (dijamin gak overflow), lebar dikasih plafon, dan object-contain
                yang menjaga rasio gambar asli supaya mengisi box semaksimal
                mungkin tanpa gepeng. */}
            <div className="relative w-full lg:h-full lg:w-auto lg:shrink-0 flex justify-center lg:justify-start lg:-ml-16 xl:-ml-28">
              <div className="lg:hidden relative w-full aspect-square" style={{ maxWidth: "min(88vh, 52vw, 48rem)" }}>
                <Image src="/layar1Background.png" alt="Ilustrasi Schoters" fill className="object-contain" priority />
              </div>
              <div className="hidden lg:block relative h-full" style={{ width: "min(58vw, 54rem)" }}>
                <Image src="/layar1Background.png" alt="Ilustrasi Schoters" fill className="object-contain object-left" priority />
              </div>
            </div>

            {/* Teks & CTA */}
            <div className="w-full lg:flex-1 text-center lg:text-left">
              <h1
                className="font-extrabold leading-snug text-white"
                style={{ fontSize: "clamp(1.78rem, 4.85vh, 3.78rem)" }}
              >
                Wujudkan Impian Globalmu
                <span className="block mt-1 text-[#129cfc]">Bersama Schoters</span>
              </h1>

              <p
                className="mt-[min(2vh,1.25rem)] text-slate-200 mx-auto lg:mx-0"
                style={{ fontSize: "clamp(1rem, 2.54vh, 1.32rem)", maxWidth: "40rem" }}
              >
                Akses berbagai program Schoters yang mendukung perjalanan kuliah,
                karier, akademik, dan pengembangan dirimu.
              </p>

              <div
                className="flex flex-wrap justify-center lg:justify-start mx-auto lg:mx-0"
                style={{ marginTop: "min(3.35vh, 2.35rem)", gap: "min(2.3vh, 1.65rem)", maxWidth: "40rem" }}
              >
                {features.map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-2" style={{ width: "6.75rem" }}>
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        backgroundColor: f.bg,
                        width: "clamp(3.35rem, 7.9vh, 6rem)",
                        height: "clamp(3.35rem, 7.9vh, 6rem)",
                      }}
                    >
                      <f.icon
                        className="text-white"
                        style={{
                          width: f.big ? "clamp(1.72rem, 4.2vh, 2.98rem)" : "clamp(1.35rem, 3.35vh, 2.4rem)",
                          height: f.big ? "clamp(1.72rem, 4.2vh, 2.98rem)" : "clamp(1.35rem, 3.35vh, 2.4rem)",
                        }}
                      />
                    </div>
                    <p className="text-center text-white leading-snug" style={{ fontSize: "clamp(0.78rem, 1.97vh, 1.03rem)" }}>
                      {f.label}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-3 rounded-full font-bold text-white transition hover:brightness-105"
                style={{
                  backgroundColor: "#ff7d2c",
                  marginTop: "min(4vh, 3.25rem)",
                  padding: "min(1.8vh, 1.25rem) clamp(1.75rem, 3.6vh, 2.5rem)",
                  fontSize: "clamp(1.1rem, 3vh, 1.5rem)",
                }}
              >
                Login to My Account
                <ArrowRight style={{ width: "clamp(1.4rem, 3.5vh, 2rem)", height: "clamp(1.4rem, 3.5vh, 2rem)" }} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}