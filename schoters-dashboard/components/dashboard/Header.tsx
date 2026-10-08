"use client";

import { LayoutDashboard } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import { NOTIFICATIONS } from "@/lib/notifications";

export default function Header({ name }: { name: string }) {
  const firstName = name.split(" ")[0];

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {/* Dashboard Logo */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600">
          <LayoutDashboard
            className="h-7 w-7 text-white"
            strokeWidth={2}
          />
        </div>

        {/* Greeting */}
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Hello, {firstName}!
            <span className="inline-block animate-[wave_1.6s_ease-in-out_infinite]">
              👋
            </span>
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Let&apos;s stay on track and reach your dream university.
          </p>
        </div>
      </div>

      <NotificationBell notifications={NOTIFICATIONS} />
    </div>
  );
}