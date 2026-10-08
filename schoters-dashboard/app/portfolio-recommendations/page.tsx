import Sidebar from "@/components/Sidebar";
import PortfolioContent from "@/components/portfolio/PortfolioContent"; // ⬅️ pastikan ini, bukan PortfolioAllContent
import { getDashboardData } from "@/lib/data";
import { NOTIFICATIONS } from "@/lib/notifications";

export default async function PortfolioRecommendationsPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={data.user} />
      <PortfolioContent notifications={NOTIFICATIONS} />
    </div>
  );
}