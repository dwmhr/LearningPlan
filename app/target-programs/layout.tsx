import { requireAccess } from "@/lib/require-access";

export default async function TargetProgramsLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("SAA");
  return <>{children}</>;
}