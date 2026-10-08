import Sidebar from "@/components/Sidebar";
import TimelineContent from "@/components/timeline/TimelineContent";
import { getDashboardData } from "@/lib/data";
// TODO: if notifications aren't part of getDashboardData(), point this at
// wherever your notifications list actually comes from.
import { NOTIFICATIONS } from "@/lib/notifications";

export default async function TimelinePage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={data.user} />
      <TimelineContent notifications={NOTIFICATIONS} />
    </div>
  );
}