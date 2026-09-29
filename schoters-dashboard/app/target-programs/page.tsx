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

      <main className="relative flex-1 overflow-hidden">
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
            bg-[position:right_60px_top_-50px]
            bg-no-repeat
            opacity-70
          "
        />

        {/* Main Content */}
        <div className="relative z-10 px-6 pb-6 pt-14 md:px-10 md:pb-8 md:pt-16">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
                <Target
                  className="h-7 w-7 text-white"
                  strokeWidth={2}
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  My Targets
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your university and scholarship targets in one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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