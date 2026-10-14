import Sidebar from "@/components/sidebar/Sidebar";
import SatDashboardContent from "@/components/sat/SatDashboardContent";
import { getDashboardData } from "@/lib/data";
import { getSatDashboardData } from "@/lib/sat-data";

export default async function SatPage() {
  const data = await getDashboardData();
  const satData = await getSatDashboardData();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={data.user} />
      <SatDashboardContent data={satData} notifications={data.notifications} />
    </div>
  );
}