import { notFound } from "next/navigation";
import ApplicationDetailContent from "@/components/ApplicationDetailContent";
import { getApplicationDetail } from "@/lib/application-detail";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getApplicationDetail(id);

  if (!data) {
    notFound();
  }

  return <ApplicationDetailContent data={data} />;
}