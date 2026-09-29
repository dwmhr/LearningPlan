import { DashboardData } from "./types";
import { NOTIFICATIONS } from "./notifications";

// ---------------------------------------------------------------------------
// DUMMY DATA LAYER
// ---------------------------------------------------------------------------
// Everything below is hardcoded placeholder data so the UI is fully
// interactive out of the box. When you're ready to connect a real backend:
//
//   1. Replace the body of `getDashboardData()` with a real fetch, e.g.
//        export async function getDashboardData(): Promise<DashboardData> {
//          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`);
//          return res.json();
//        }
//   2. The shape of DashboardData (lib/types.ts) is the contract your API
//      needs to satisfy. Keep it, or adjust it and the components together.
//   3. Any mutating actions (add schedule event, mark task done, etc.) are
//      marked with TODO(backend) comments in the components that call them.
// ---------------------------------------------------------------------------

const dummyData: DashboardData = {
  user: {
    name: "Mikael A. Marwastu",
    studentId: "12345678",
    memberTier: "Silver Member",
  },
  notifications: NOTIFICATIONS,
  progressStats: [
    { id: "overall", label: "Overall Progress", value: 42, icon: "target", color: "blue" },
    { id: "ielts", label: "IELTS Progress", value: 60, icon: "graduation", color: "purple" },
    { id: "saa", label: "SAA Progress", value: 35, icon: "shield", color: "green" },
    { id: "sat", label: "SAT Progress", value: 28, icon: "sat", color: "orange" },
  ],
  nextActions: [
    { id: "na1", label: "Upload Akita University documents", icon: "document", color: "blue" },
    { id: "na2", label: "Complete IELTS Diagnostic", icon: "book", color: "purple" },
    { id: "na3", label: "Practice SAT Reading", icon: "building", color: "orange" },
  ],
  scheduleEvents: [
    {
      id: "ev1",
      date: "2026-08-21",
      startTime: "14.00",
      endTime: "15.00",
      title: "IELTS Writing Practice",
      location: "Zoom",
      mode: "Online - Zoom",
      icon: "ielts",
    },
    {
      id: "ev2",
      date: "2026-08-21",
      startTime: "16.00",
      endTime: "17.00",
      title: "SAA Session 3",
      location: "Schoters Office",
      mode: "Offline - Schoters Office",
      icon: "saa",
    },
    {
      id: "ev3",
      date: "2026-08-11",
      startTime: "10.00",
      endTime: "11.00",
      title: "SAT Reading Practice",
      location: "Zoom",
      mode: "Online - Zoom",
      icon: "sat",
    },
    {
      id: "ev4",
      date: "2026-08-28",
      startTime: "09.00",
      endTime: "10.30",
      title: "University Document Review",
      location: "Schoters Office",
      mode: "Offline - Schoters Office",
      icon: "other",
    },
  ],
  deadlines: [
    {
      id: "dl1",
      title: "NEXT University Recommendation - Akita University - Graduate School",
      subtitle: "Document deadline",
      date: "2026-08-28",
      daysLeft: 7,
      type: "document",
    },
    {
      id: "dl2",
      title: "Fast Retailing Foundation Scholarship for Indonesian Students",
      subtitle: "Scholarship deadline",
      date: "2026-09-01",
      daysLeft: 11,
      type: "scholarship",
    },
    {
      id: "dl3",
      title: "Fast Retailing Foundation Scholarship for Vietnamese Students",
      subtitle: "Scholarship deadline",
      date: "2026-09-01",
      daysLeft: 11,
      type: "scholarship",
    },
    {
      id: "dl4",
      title: "NEXT University Recommendation - Akita University - Graduate School",
      subtitle: "Document deadline",
      date: "2026-09-18",
      daysLeft: 28,
      type: "recommendation",
    },
  ],
  targetPrograms: [
    {
      id: "tp1",
      category: "SCHOLARSHIP",
      title: "Fast Retailing Foundation Scholarship for Indonesian Students",
      country: "Japan",
      semester: "S1",
      status: "Preparing",
      deadline: "1 Sep 2026",
      readiness: 32,
    },
    {
      id: "tp2",
      category: "SCHOLARSHIP",
      title: "Fast Retailing Foundation Scholarship for Vietnamese Students",
      country: "Japan",
      semester: "S1",
      status: "Preparing",
      deadline: "1 Sep 2026",
      readiness: 32,
    },
    {
      id: "tp3",
      category: "RECOMMENDATION",
      title: "NEXT University Recommendation - Akita University - Graduate School",
      country: "Japan",
      semester: "S2",
      status: "In Progress",
      deadline: "28 Aug 2026",
      readiness: 68,
    },
  ],
};

// Simulated async "API" call. Swap the internals for a real fetch whenever
// the backend is ready — every component already calls this function.
export async function getDashboardData(): Promise<DashboardData> {
  return dummyData;
}