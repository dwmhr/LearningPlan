import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import Header from "@/components/dashboard/Header";
import ProgressOverview from "@/components/dashboard/ProgressOverview";
import NextActions from "@/components/dashboard/NextActions";
import UpcomingDates from "@/components/dashboard/UpcomingDates";
import TargetPrograms from "@/components/dashboard/TargetPrograms";
import { getDashboardData } from "@/lib/data";
import { hasAccess, getHomePath } from "@/lib/access";

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Dashboard khusus pengguna SAA. Yang lain diarahkan ke halaman default-nya.
  if (!hasAccess(data.user.subscriptions, "SAA")) {
    redirect(getHomePath(data.user.subscriptions));
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={data.user} />

      <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {/* Header dengan background image, dibikin lebih tinggi */}
        <div
          className="relative rounded-2xl bg-cover bg-no-repeat px-4 pt-10 pb-20 sm:px-6"
          style={{
            backgroundImage: "url(/headerbg.png)",
            backgroundPosition: "center 50%",
          }}
        >
          <div className="mt-2">
            <Header name={data.user.name} />
          </div>
        </div>

        {/* Progress Overview ditarik naik nutupin sisa gambar, posisi visual tetap */}
        <div className="relative z-10 -mt-6 flex flex-col gap-5">
          <ProgressOverview stats={data.progressStats} updatedAt={data.progressUpdatedAt} />

          {/* Priority Overview + Upcoming Dates: read-only, siswa cuma bisa lihat */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <NextActions actions={data.nextActions} />
            <UpcomingDates events={data.scheduleEvents} deadlines={data.deadlines} />
          </div>

          <TargetPrograms programs={data.targetPrograms} />
        </div>
      </main>
    </div>
  );
}