import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/components/UserProvider";

export const metadata: Metadata = {
  title: "Schoters | Student Dashboard",
  description: "Track your readiness and stay on top of deadlines with the Schoters dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#F7F8FA] text-slate-900 font-sans">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}