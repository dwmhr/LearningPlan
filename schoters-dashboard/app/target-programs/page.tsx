import { Target } from "lucide-react";
import { getDashboardData } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import NotificationBell from "@/components/NotificationBell";
import TargetOverviewSection from "@/components/target-overview/TargetOverviewSection";

export default async function TargetProgramsPage() {
  const { user, notifications } = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <Sidebar user={user} />

      {/* min-w-0 lets this column shrink instead of overflowing the screen */}
      <main className="relative min-w-0 flex-1 overflow-hidden">
        {/* Background Illustration */}
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-0
            h-[250px]
            w-full
            bg-[url('/bgTarget.png')]
            bg-[length:auto_270px]
            bg-[position:right_-40px_top_-50px]
            bg-no-repeat
            opacity-40
            sm:bg-[position:right_60px_top_-50px]
            sm:opacity-70
          "
        />

        {/* Main Content */}
        <div className="relative z-10 px-4 pb-6 pt-14 sm:px-6 md:px-10 md:pb-8 md:pt-16">
          {/* Header: tidak wrap, supaya lonceng selalu di pojok kanan atas */}
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-sm sm:h-14 sm:w-14">
                <Target
                  className="h-6 w-6 text-white sm:h-7 sm:w-7"
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
                  My Targets
                </h1>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Manage your university and scholarship targets in one place.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <NotificationBell notifications={notifications} />
            </div>
          </div>

          {/* Target Overview */}
          <TargetOverviewSection />
        </div>
      </main>
    </div>
  );
}