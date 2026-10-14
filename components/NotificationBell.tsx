"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  Bell,
  Clock,
  CalendarClock,
  Sparkles,
  FileText,
  CheckCheck,
  LucideIcon,
} from "lucide-react";
import { AppNotification, NotificationType } from "@/lib/notifications";
import {
  getServerSnapshot,
  getSnapshot,
  markNotificationsRead,
  subscribe,
} from "@/lib/notification-read-store";

/* ------------------------------------------------------------------ */
/* Type -> icon / color mapping                                         */
/* ------------------------------------------------------------------ */

type TypeMeta = { icon: LucideIcon; bg: string; color: string };

const TYPE_META: Record<NotificationType, TypeMeta> = {
  reminder: { icon: Clock, bg: "bg-blue-50", color: "text-blue-600" },
  deadline: { icon: CalendarClock, bg: "bg-rose-50", color: "text-rose-600" },
  match: { icon: Sparkles, bg: "bg-amber-50", color: "text-amber-600" },
  document: { icon: FileText, bg: "bg-emerald-50", color: "text-emerald-600" },
};

const DEFAULT_META: TypeMeta = { icon: Bell, bg: "bg-slate-100", color: "text-slate-500" };

export default function NotificationBell({
  notifications,
}: {
  notifications: AppNotification[];
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Read state lives in a shared store (persisted to localStorage), so every
  // page's bell shows the same thing instead of resetting on navigation.
  const storedReadIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isRead = (n: AppNotification) => n.read || storedReadIds.has(n.id);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !(n.read || storedReadIds.has(n.id))).length,
    [notifications, storedReadIds]
  );

  function markAllAsRead() {
    markNotificationsRead(notifications.map((n) => n.id));
  }

  function markAsRead(id: number) {
    markNotificationsRead([id]);
  }

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 transition-colors ${
          open ? "ring-blue-200 text-blue-600" : "ring-slate-100 hover:bg-slate-50"
        }`}
      >
        <Bell className="h-5 w-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2.5 w-[calc(100vw-2rem)] max-w-[22rem] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2">
              <p className="text-sm font-bold text-slate-900">Notifications</p>
              {unreadCount > 0 && (
                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-slate-400 hover:text-blue-600"
              >
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
                Mark all read
              </button>
            )}
          </div>

          <ul className="notif-scroll max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                  <Bell className="h-5 w-5 text-slate-300" strokeWidth={2} />
                </div>
                <p className="text-sm text-slate-400">You&apos;re all caught up.</p>
              </li>
            ) : (
              notifications.map((n) => {
                const meta = n.type ? TYPE_META[n.type] : DEFAULT_META;
                const Icon = meta.icon;
                const read = isRead(n);

                return (
                  <li key={n.id} className="border-b border-slate-50 last:border-0">
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50 ${
                        read ? "bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.bg}`}>
                        <Icon className={`h-4 w-4 ${meta.color}`} strokeWidth={2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm leading-snug ${read ? "text-slate-500" : "font-semibold text-slate-800"}`}>
                          {n.text}
                        </p>
                        {n.time && (
                          <p className="mt-1 text-xs text-slate-400">{n.time}</p>
                        )}
                      </div>

                      {!read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .notif-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .notif-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .notif-scroll::-webkit-scrollbar-track {
          background: transparent;
          margin-block: 4px;
        }
        .notif-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 9999px;
        }
        .notif-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}