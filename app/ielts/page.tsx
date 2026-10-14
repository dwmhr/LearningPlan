import Sidebar from "@/components/sidebar/Sidebar";
import {
  IeltsHeader,
  IeltsProgressOverview,
  IeltsFocusAreas,
  IeltsAssessments,
  IeltsSyllabus,
} from "@/components/ielts/IeltsComponents";
import { getDashboardData } from "@/lib/data";
import {
  ieltsOverview,
  ieltsFocusAreas,
  ieltsSyllabus,
  ieltsAssessments,
} from "@/lib/ielts-data";

export default async function IeltsPage() {
  const data = await getDashboardData();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={data.user} />

      <main className="min-w-0 flex-1 space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <IeltsHeader overview={ieltsOverview} />
        <IeltsProgressOverview overview={ieltsOverview} />
        <IeltsFocusAreas focusAreas={ieltsFocusAreas} />
        <IeltsAssessments assessments={ieltsAssessments} />
        <IeltsSyllabus syllabus={ieltsSyllabus} />
      </main>
    </div>
  );
}