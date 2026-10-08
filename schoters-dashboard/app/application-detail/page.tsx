import { redirect } from "next/navigation";

// Visiting /application-detail with no id redirects to a real target.
// In normal use, always link to /application-detail/[targetId] directly
// from Documents or Application Tracker's "View details" buttons.
export default function ApplicationDetailIndexPage() {
  redirect("/application-detail/u1");
}

