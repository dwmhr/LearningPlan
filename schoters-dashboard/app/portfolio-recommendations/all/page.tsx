import Sidebar from "@/components/Sidebar";
import PortfolioAllContent from "@/components/portfolio/PortfolioAllContent";
import { getDashboardData } from "@/lib/data";

export default async function PortfolioAllPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={data.user} />
      <PortfolioAllContent />
    </div>
  );
}