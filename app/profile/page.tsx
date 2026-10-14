import Sidebar from "@/components/sidebar/Sidebar";
import ProfileContent from "@/components/profile/ProfileContent";
import { getDashboardData, getProfileData } from "@/lib/data";

export default async function ProfilePage() {
  const [dashboardData, profileData] = await Promise.all([
    getDashboardData(),
    getProfileData(),
  ]);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={profileData.user} />
      <ProfileContent
        profileData={profileData}
        notifications={dashboardData.notifications}
      />
    </div>
  );
}