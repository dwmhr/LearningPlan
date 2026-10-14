import { requireAccess } from "@/lib/require-access";

export default async function SatLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("SAT");
  return <>{children}</>;
}