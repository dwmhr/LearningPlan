import Sidebar from "@/components/sidebar/Sidebar";
import DocumentsContent from "@/components/documents/DocumentsContent";
import { getDashboardData } from "@/lib/data";
import { NOTIFICATIONS } from "@/lib/notifications";

export default async function DocumentsPage() {
  const { user } = await getDashboardData();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <DocumentsContent notifications={NOTIFICATIONS} />
    </div>
  );
}