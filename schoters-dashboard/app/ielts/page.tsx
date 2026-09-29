import Sidebar from "@/components/Sidebar";
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

      <main className="flex-1 space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <IeltsHeader overview={ieltsOverview} />

        <IeltsProgressOverview overview={ieltsOverview} />

        {/* Full width, standalone — this is the "what to do next" section,
            it should not share a row or a stretched height with anything else. */}
        <IeltsFocusAreas focusAreas={ieltsFocusAreas} />

        {/* Assessments on its own row below Focus Areas. */}
        <IeltsAssessments assessments={ieltsAssessments} />

        {/* Syllabus: full width, since the table has 7 columns and needs the
            room. Replaces the old Learning Plan + Learning Sessions row. */}
        <IeltsSyllabus syllabus={ieltsSyllabus} />
      </main>
    </div>
  );
}