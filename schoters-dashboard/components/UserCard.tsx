"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { User } from "@/lib/types";

export default function UserCard({ user }: { user: User }) {
  return (
    <Link
      href="/profile"
      className="group relative flex w-full flex-col items-center rounded-lg px-4 py-2 text-center transition-colors hover:bg-slate-50"
    >
      <ChevronRight
        className="absolute right-2 top-2 h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-400"
        strokeWidth={2}
      />

      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-lg font-semibold text-white ring-2 ring-transparent ring-offset-2 transition-all group-hover:ring-blue-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl ?? "/Mike.jpg"}
          alt={user.name}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-3 truncate text-sm font-bold text-slate-900">{user.name}</p>

      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600">
        🏅 {user.memberTier}
      </span>

      {/* Selalu terlihat — sebelumnya disembunyikan dengan opacity-0 dan baru
         muncul saat hover. Sekarang hover hanya menggelapkan warnanya. */}
      <span className="mt-1.5 text-[11px] font-medium text-slate-400 transition-colors group-hover:text-slate-600">
        View profile
      </span>
    </Link>
  );
}