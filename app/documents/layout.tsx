import { requireAccess } from "@/lib/require-access";

export default async function DocumentsLayout({ children }: { children: React.ReactNode }) {
  await requireAccess("SAA");
  return <>{children}</>;
}