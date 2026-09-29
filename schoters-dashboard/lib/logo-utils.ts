// ---------------------------------------------------------------------------
// LOGO DISPLAY HELPERS (UI layer)
// ---------------------------------------------------------------------------
// Dulu setiap Target (university/scholarship) nyimpen `logoInitial`,
// `logoBg`, `logoText` langsung di data (lib/target-overview-data.ts).
// Itu masalah kalau data nanti datang dari API — API gak seharusnya tau
// atau ngirim class Tailwind.
//
// Sekarang initial & warna logo di-generate di sini, murni dari `name`
// (buat initial) dan `id` (buat warna, biar konsisten tiap render — bukan
// random). Data API cuma perlu kirim `id` dan `name`, titik.
// ---------------------------------------------------------------------------

const LOGO_COLOR_PALETTE: { bg: string; text: string }[] = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
  { bg: "bg-indigo-100", text: "text-indigo-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
];

// Simple deterministic string hash (djb2-ish), cukup buat pilih warna dari
// palette secara konsisten — bukan buat keperluan kriptografi.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // konversi ke 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Ambil 1-2 huruf inisial dari nama, buat ditampilkan di avatar/logo bulat.
 * "Chiba Institute of Technology" -> "CI"
 * "Kyoto University" -> "KU"
 * "Sekolah" -> "SE"
 */
export function getLogoInitial(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Pilih warna bg/text dari palette tetap, berdasarkan hash dari `seed`
 * (biasanya `id` target). Deterministik: id yang sama selalu dapat warna
 * yang sama, tanpa perlu disimpan di data.
 */
export function getLogoColor(seed: string): { bg: string; text: string } {
  const index = hashString(seed) % LOGO_COLOR_PALETTE.length;
  return LOGO_COLOR_PALETTE[index];
}