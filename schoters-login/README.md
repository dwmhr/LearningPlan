# Schoters Login Page

Halaman login bergaya Schoters, dibangun dengan **Next.js 14 (App Router)**, **TypeScript**, dan **Tailwind CSS**.

## Struktur folder

```
schoters-login/
├─ app/
│  ├─ layout.tsx        # root layout + font
│  ├─ page.tsx           # halaman login (menggabungkan 2 komponen di bawah)
│  └─ globals.css        # tailwind base styles
├─ components/
│  ├─ IllustrationPanel.tsx  # panel kiri: logo, headline, ilustrasi SVG, badge fitur
│  └─ LoginCard.tsx          # panel kanan: form email/password, tombol sosial
├─ public/
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ next.config.mjs
```

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

**Cara 1 — via CLI**
```bash
npm i -g vercel
vercel
```
Ikuti prompt-nya (login, pilih scope, konfirmasi folder project). Vercel otomatis mendeteksi ini sebagai project Next.js.

**Cara 2 — via GitHub**
1. Push folder ini ke repo GitHub baru.
2. Buka https://vercel.com/new, import repo tersebut.
3. Framework preset otomatis terdeteksi "Next.js" — klik **Deploy**.

Tidak ada environment variable yang wajib untuk versi awal ini.

## Menyambungkan ke backend auth

Form login di `components/LoginCard.tsx` (fungsi `handleSubmit`) saat ini hanya simulasi delay. Ganti bagian `// TODO: hubungkan ke endpoint auth kamu di sini` dengan pemanggilan API/auth provider kamu (mis. NextAuth, Supabase, Firebase Auth, atau REST API sendiri).

## Catatan desain

Ilustrasi karakter & scene di panel kiri adalah SVG orisinal yang terinspirasi dari layout referensi (posisi buku bertumpuk, karakter dengan laptop, tanaman, mug, dsb) — bukan hasil trace langsung dari gambar aslinya. Warna, tipografi, dan struktur form dibuat semirip mungkin dengan referensi.
