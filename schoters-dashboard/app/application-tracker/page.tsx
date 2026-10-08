import Sidebar from "@/components/Sidebar";
import ApplicationTrackerContent from "@/components/ApplicationTrackerContent";
import { getDashboardData } from "@/lib/data";

export default async function ApplicationTrackerPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={data.user} />
      <ApplicationTrackerContent notifications={data.notifications} />
    </div>
  );
}