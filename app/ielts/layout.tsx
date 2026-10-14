import { requireAccess } from "@/lib/require-access";

export default async function IeltsLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("IELTS");
  return <>{children}</>;
}