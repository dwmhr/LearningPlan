"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  ClipboardList,
  FolderClosed,
  ClipboardCheck,
  Award,
  CalendarRange,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { User } from "@/lib/types";
import UserCard from "./UserCard";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
      { id: "target-programs", label: "My Targets", icon: Target, href: "/target-programs" },
      { id: "timeline", label: "Timeline", icon: CalendarRange, href: "/timeline" },
    ],
  },
  {
    id: "preparation",
    label: "Preparation",
    items: [
      { id: "ielts", label: "IELTS", icon: GraduationCap, href: "/ielts" },
      { id: "sat", label: "SAT", icon: ClipboardList, href: "/sat" },
      {
        id: "portfolio-recommendations",
        label: "Portfolio",
        icon: Award,
        href: "/portfolio-recommendations",
      },
    ],
  },
  {
    id: "application",
    label: "Application",
    items: [
      {
        id: "application-tracker",
        label: "Application Tracker",
        icon: ClipboardCheck,
        href: "/application-tracker",
      },
      { id: "documents", label: "Documents", icon: FolderClosed, href: "/documents" },
    ],
  },
];

// Key used to persist the sidebar nav's scroll position across route changes
// (and across remounts, in case Sidebar isn't hoisted into a shared layout).
const SIDEBAR_SCROLL_KEY = "sidebar-nav-scroll-top";

export default function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Restore the saved scroll position as soon as this component mounts,
  // before the browser paints — avoids a visible "jump" back down.
  useEffect(() => {
    const savedTop = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
    if (savedTop && navRef.current) {
      navRef.current.scrollTop = parseInt(savedTop, 10);
    }
  }, []);

  // Keep the saved position up to date while the user scrolls the nav list.
  function handleNavScroll(event: React.UIEvent<HTMLElement>) {
    sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(event.currentTarget.scrollTop));
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white md:flex">
      {/* Header: logo + profile (fixed, never scrolls) */}
      <div className="shrink-0 px-4 pt-6">
        {/* Schoters Logo */}
        <div className="flex items-center justify-center px-2 pb-6">
          <img
            src="/logo-schoters.png"
            alt="Schoters by Ruangguru"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Profile */}
        <div className="border-b border-slate-100 pb-1">
          <UserCard user={user} />
        </div>
      </div>

      {/* Navigation (scrolls independently when the menu list is long) */}
      <nav
        ref={navRef}
        onScroll={handleNavScroll}
        className="sidebar-scroll min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-5 pt-4"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {group.label}
            </p>

            <div className="mt-1.5 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                // Exact match for routes, but also treat nested/child routes
                // (e.g. "/portfolio-recommendations/all") as active for their
                // parent nav item. The root "/" is kept as an exact match only,
                // otherwise it would match every route.
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    scroll={false}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Help & Support (fixed at the bottom, always visible) */}
      <div className="shrink-0 border-t border-slate-100 px-4 pb-6 pt-4">
        <div className="rounded-xl bg-blue-600 px-4 py-4 text-white">
          <p className="text-sm font-semibold">Having troubles?</p>

          <button
            type="button"
            className="mt-1 flex items-center gap-1.5 text-sm font-medium text-blue-50 hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            Contact us
          </button>
        </div>
      </div>
    </aside>
  );
}