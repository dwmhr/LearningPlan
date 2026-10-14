import { ApplicationEntry } from "./application-tracker-types";

// ---------------------------------------------------------------------------
// DUMMY DATA LAYER — Application Tracker
// ---------------------------------------------------------------------------
// Sama kayak lib/target-overview-data.ts: ini satu-satunya sumber data buat
// halaman Application Tracker, gak lewat zustand lagi. Setiap entry cuma
// nyimpen status + lastUpdatedDate + ref ke Target lewat targetId — semua
// info institusi/program/deadline/logo diambil dari dummyTargets pas di-join
// di ApplicationTrackerContent.tsx (lib/target-overview-data.ts).
//
// Saat siap connect backend:
//   export async function getApplicationTrackerData(): Promise<ApplicationEntry[]> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`);
//     return res.json();
//   }
// ---------------------------------------------------------------------------

export const dummyApplications: ApplicationEntry[] = [
  // Universities
  {
    id: "app-u1",
    targetId: "u1", // Chiba Institute of Technology
    status: "in-progress",
    lastUpdatedDate: "2026-09-05",
  },
  {
    id: "app-u2",
    targetId: "u2", // Hiroshima University
    status: "submitted",
    lastUpdatedDate: "2026-09-02",
  },
  {
    id: "app-u3",
    targetId: "u3", // Hokkaido University
    status: "not-started",
    lastUpdatedDate: "2026-08-22",
  },
  {
    id: "app-u4",
    targetId: "u4", // Kyoto University
    status: "accepted",
    lastUpdatedDate: "2026-08-30",
  },
  {
    id: "app-u5",
    targetId: "u5", // Chiba University
    status: "pending-approval",
    lastUpdatedDate: "2026-09-08",
  },
  {
    id: "app-u6",
    targetId: "u6", // Kindai University
    status: "rejected",
    lastUpdatedDate: "2026-08-15",
  },

  // Scholarships
  {
    id: "app-s1",
    targetId: "s1", // CIT Scholarship
    status: "submitted",
    lastUpdatedDate: "2026-09-01",
  },
  {
    id: "app-s2",
    targetId: "s2", // CIT International Student Support Grant
    status: "in-progress",
    lastUpdatedDate: "2026-09-06",
  },
  {
    id: "app-s6",
    targetId: "s6", // CIT Robotics Excellence Award
    status: "pending-approval",
    lastUpdatedDate: "2026-09-09",
  },
  {
    id: "app-s3",
    targetId: "s3", // Hiroshima Global Leader Scholarship
    status: "withdrawn",
    lastUpdatedDate: "2026-08-18",
  },
  {
    id: "app-s7",
    targetId: "s7", // Hiroshima CIT International Student Support Grant
    status: "rejected",
    lastUpdatedDate: "2026-08-10",
  },
  {
    id: "app-s4",
    targetId: "s4", // Hokkaido MEXT Recommendation
    status: "not-started",
    lastUpdatedDate: "2026-08-20",
  },
  {
    id: "app-s5",
    targetId: "s5", // Kyoto International Undergraduate Grant
    status: "accepted",
    lastUpdatedDate: "2026-08-28",
  },
];

// Simulated async "API" call, konsisten sama getTargetOverviewData().
export async function getApplicationTrackerData(): Promise<ApplicationEntry[]> {
  return dummyApplications;
}