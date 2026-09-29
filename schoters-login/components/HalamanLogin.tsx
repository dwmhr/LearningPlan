"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/transisi");
  };

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-start overflow-hidden pt-3 pb-10">
      {/* BACKGROUND FULL LAYAR */}
      <Image
        src="/layar2Background.png"
        alt="Background Schoters"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay tipis biar form kebaca kalau background terlalu terang/ramai */}
      <div className="absolute inset-0 bg-[#052e67]/40" />

      {/* LOGO SCHOTERS DI LUAR CARD PUTIH - dikecilkan & digeser ke atas */}
      <Image
        src="/logo-schoters2.png"
        alt="Schoters by Ruangguru"
        width={220}
        height={62}
        className="relative z-10 top-2 mb-4 h-12 sm:h-14 w-auto"
        priority
      />

      {/* CARD FORM LOGIN - compact, tidak sampai bawah */}
      <div className="relative z-10 mt-4 w-full max-w-md mx-4 sm:mx-6 rounded-3xl bg-white px-6 py-6 shadow-2xl sm:px-10">
        <div className="mb-5 text-left">
          <a
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#0B3FA8]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#052e67]">
            Welcome back! 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Masuk ke akun Schoters-mu dan lanjutkan perjalananmu.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#0B3FA8] focus:ring-2 focus:ring-[#0B3FA8]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-[#0B3FA8] focus:ring-2 focus:ring-[#0B3FA8]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#0B3FA8] focus:ring-[#0B3FA8]/30"
              />
              Ingat saya
            </label>
            <a href="#" className="font-semibold text-[#0B3FA8] hover:underline">
              Lupa password?
            </a>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-base font-bold text-white transition hover:brightness-105"
            style={{ backgroundColor: "#ff7d2c" }}
          >
            Login
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* DIVIDER "Atau lanjutkan dengan" */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">
            Atau lanjutkan dengan
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* TOMBOL GOOGLE */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          Login dengan Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Belum punya akun?{" "}
          <a href="#" className="font-semibold text-[#0B3FA8] hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}