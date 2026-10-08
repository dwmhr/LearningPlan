import { TargetOverviewData, Target } from "./target-overview-types";
import { DocumentItem, DocumentRequirement, DocumentRequirementCategory } from "./documents-types";

// ---------------------------------------------------------------------------
// DUMMY DATA LAYER
// ---------------------------------------------------------------------------
// Data asli kamu, dipertahankan persis (readiness, deadline, mentorStatus,
// description, coverage, dll), plus registrationLink (link resmi
// pendaftaran, dipakai tombol "Daftar Sekarang").
//
// CATATAN: field logoInitial/logoBg/logoText yang dulu ada di sini SUDAH
// DIHAPUS. Warna dan inisial logo sekarang di-generate murni di UI lewat
// lib/logo-utils.ts (getLogoInitial(name), getLogoColor(id)) — jadi data
// di bawah ini gak perlu, dan gak seharusnya, tau apa-apa soal Tailwind.
//
// Saat siap connect backend:
//   export async function getTargetOverviewData(): Promise<TargetOverviewData> {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/targets`);
//     return res.json();
//   }
// ---------------------------------------------------------------------------

const dummyData: TargetOverviewData = {
  universities: [
    {
      id: "u1",
      category: "university",
      name: "Chiba Institute of Technology",
      program: "BEng in Advanced Robotics",
      country: "Japan",
      readiness: 32,
      deadline: "2026-11-30",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.it-chiba.ac.jp/english/admissions/",
    },
    {
      id: "u2",
      category: "university",
      name: "Hiroshima University",
      program: "Mechanical Systems Engineering",
      country: "Japan",
      readiness: 28,
      deadline: "2026-10-15",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.hiroshima-u.ac.jp/en/admissions",
    },
    {
      id: "u3",
      category: "university",
      name: "Hokkaido University",
      program: "Graduate School of Engineering",
      country: "Japan",
      readiness: 25,
      deadline: "2026-09-30",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.oia.hokudai.ac.jp/admission/",
    },
    {
      id: "u4",
      category: "university",
      name: "Kyoto University",
      program: "International Undergraduate Program",
      country: "Japan",
      readiness: 18,
      deadline: "2026-12-01",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.kyoto-u.ac.jp/en/prospective-students/admissions",
    },
    {
      id: "u5",
      category: "university",
      name: "Chiba University - 千葉大学",
      program: "Mechanical Engineering",
      country: "Japan",
      readiness: 15,
      deadline: "2027-01-15",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.chiba-u.ac.jp/e/admission/",
    },
    {
      id: "u6",
      category: "university",
      name: "Kindai University",
      program: "Robotics Design",
      country: "Japan",
      readiness: 10,
      deadline: "2027-02-28",
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.kindai.ac.jp/english/admissions/",
    },
  ],
  scholarships: [
    {
      id: "s1",
      category: "scholarship",
      universityId: "u1",
      name: "Chiba Institute of Technology Scholarship",
      program: "BEng in Advanced Robotics",
      country: "Japan",
      fundingType: "Fully Funded",
      description: "Merit-based scholarship for outstanding international students.",
      deadline: "2026-11-30",
      coverage: "Tuition, Living allowance",
      readiness: 32,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.it-chiba.ac.jp/english/scholarship/",
    },
    {
      id: "s2",
      category: "scholarship",
      universityId: "u1",
      name: "CIT International Student Support Grant",
      program: "BEng in Advanced Robotics",
      country: "Japan",
      fundingType: "Partially Funded",
      description: "Support grant for international students with financial need.",
      deadline: "2026-11-30",
      coverage: "Partial Tuition",
      readiness: 20,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.it-chiba.ac.jp/english/scholarship/support-grant/",
    },
    {
      id: "s6",
      category: "scholarship",
      universityId: "u1",
      name: "CIT Robotics Excellence Award",
      program: "BEng in Advanced Robotics",
      country: "Japan",
      fundingType: "Partially Funded",
      description:
        "Awarded to applicants with a strong background in robotics or automation projects.",
      deadline: "2026-10-31",
      coverage: "Partial Tuition, Research allowance",
      readiness: 24,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.it-chiba.ac.jp/english/scholarship/robotics-award/",
    },
    {
      id: "s3",
      category: "scholarship",
      universityId: "u2",
      name: "Hiroshima University Global Leader Scholarship",
      program: "Mechanical Systems Engineering",
      country: "Japan",
      fundingType: "Partially Funded",
      description: "Awarded to students with strong academic and leadership records.",
      deadline: "2026-10-15",
      coverage: "Partial Tuition",
      readiness: 28,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.hiroshima-u.ac.jp/en/scholarship/global-leader",
    },
    {
      id: "s7",
      category: "scholarship",
      universityId: "u2",
      name: "CIT International Student Support Grant",
      program: "Mechanical Systems Engineering",
      country: "Japan",
      fundingType: "Partially Funded",
      description: "Support grant for international students with financial need.",
      deadline: "2026-11-30",
      coverage: "Partial Tuition",
      readiness: 20,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.hiroshima-u.ac.jp/en/scholarship/support-grant",
    },
    {
      id: "s4",
      category: "scholarship",
      universityId: "u3",
      name: "Hokkaido University MEXT Recommendation",
      program: "Graduate School of Engineering",
      country: "Japan",
      fundingType: "Fully Funded",
      description: "University-recommended MEXT scholarship for engineering applicants.",
      deadline: "2026-09-30",
      coverage: "Tuition, Living allowance, Airfare",
      readiness: 25,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.oia.hokudai.ac.jp/scholarship/mext/",
    },
    {
      id: "s5",
      category: "scholarship",
      universityId: "u4",
      name: "Kyoto University International Undergraduate Grant",
      program: "International Undergraduate Program",
      country: "Japan",
      fundingType: "Partially Funded",
      description: "Need-based grant for the International Undergraduate Program.",
      deadline: "2026-12-01",
      coverage: "Partial Tuition",
      readiness: 18,
      mentorStatus: "recommended-by-mentor",
      registrationLink: "https://www.kyoto-u.ac.jp/en/prospective-students/scholarship",
    },
    // u5 dan u6 sengaja belum punya scholarship, untuk demo empty state.
  ],
};

// Simulated async "API" call, sama seperti sebelumnya.
export async function getTargetOverviewData(): Promise<TargetOverviewData> {
  return dummyData;
}

// ---------------------------------------------------------------------------
// Flattened array — dipakai sebagai satu-satunya sumber data target buat
// semua halaman (Target Overview, Documents, dst). Gak ada lagi zustand di
// tengah-tengah.
// ---------------------------------------------------------------------------
export function getAllTargets(): Target[] {
  return [...dummyData.universities, ...dummyData.scholarships];
}

export const dummyTargets: Target[] = getAllTargets();

// ---------------------------------------------------------------------------
// DOCUMENTS DATA LAYER
// ---------------------------------------------------------------------------
// Dipindah dari lib/store.ts biar "My Documents" juga satu sumber sama
// kayak targets. Ini data awal user punya (personal document library),
// independen dari target manapun.
// ---------------------------------------------------------------------------

export const dummyDocuments: DocumentItem[] = [
  {
    id: "doc-passport",
    name: "Passport",
    icon: "id-card",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    status: "ready",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-12",
  },
  {
    id: "doc-cv",
    name: "Academic CV / Resume",
    icon: "file-text",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    status: "ready",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-20",
  },
  {
    id: "doc-ielts",
    name: "IELTS Certificate",
    icon: "file-text",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    status: "in-progress",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-18",
  },
  {
    id: "doc-recommendation-letter",
    name: "Recommendation Letter",
    icon: "mail",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    status: "not-ready",
    usedByCount: 0,
    lastUpdatedDate: null,
  },
  {
    id: "doc-ijazah",
    name: "Ijazah / Graduation Certificate",
    icon: "file-text",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    status: "ready",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-10",
  },
  {
    id: "doc-transcript",
    name: "Academic Transcript",
    icon: "file-text",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    status: "in-progress",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-05",
  },
  {
    id: "doc-motivation-letter",
    name: "Motivation Letter / Essay",
    icon: "file-text",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    status: "not-ready",
    usedByCount: 0,
    lastUpdatedDate: null,
  },
  {
    id: "doc-ktp",
    name: "KTP",
    icon: "id-card",
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    status: "ready",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-14",
  },
  {
    id: "doc-kk",
    name: "Kartu Keluarga",
    icon: "id-card",
    iconBg: "bg-teal-100",
    iconText: "text-teal-600",
    status: "ready",
    usedByCount: 0,
    lastUpdatedDate: "2026-08-14",
  },
  {
    id: "doc-akte-kelahiran",
    name: "Akte Kelahiran",
    icon: "file-text",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
    status: "not-ready",
    usedByCount: 0,
    lastUpdatedDate: null,
  },
];

// Which document names each target category typically requires, plus which
// group they belong to on the Documents tab:
//  - "personal": reusable docs from the user's library (Passport, Academic
//    Transcript, Recommendation Letter) — same document works across every
//    application.
//  - "program": one-offs specific to this particular application (a
//    Motivation Letter tailored to this scholarship, its Financial
//    Statement, etc) — even though a draft might live in "My Documents",
//    conceptually it still needs to be redone per program.
// Dulu cuma dipakai saat user "Start Application" — sekarang dipakai buat
// SEMUA target otomatis (gak ada lagi start application), lewat
// getAllRequirements di bawah.
function buildRequirementTemplate(
  target: Target,
): Omit<DocumentRequirement, "status" | "lastUpdatedDate">[] {
  const base: {
    name: string;
    description: string;
    category: DocumentRequirementCategory;
    icon: string;
    iconBg: string;
    iconText: string;
  }[] =
    target.category === "university"
      ? [
          // --- Personal Documents: reusable, match names in dummyDocuments
          // so their status/date resolve from the user's library.
          {
            name: "Academic Transcript",
            description: "Official academic transcript from your university",
            category: "personal",
            icon: "file-text",
            iconBg: "bg-amber-100",
            iconText: "text-amber-600",
          },
          {
            name: "Passport",
            description: "A copy of your valid passport",
            category: "personal",
            icon: "id-card",
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
          },
          {
            name: "Recommendation Letter",
            description: "Academic or professional recommendation letter",
            category: "personal",
            icon: "mail",
            iconBg: "bg-indigo-100",
            iconText: "text-indigo-600",
          },
          {
            name: "Academic CV / Resume",
            description: "Your latest academic CV or resume",
            category: "personal",
            icon: "file-text",
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
          },
          {
            name: "IELTS Certificate",
            description: "IELTS/TOEFL or equivalent English proficiency proof",
            category: "personal",
            icon: "file-text",
            iconBg: "bg-purple-100",
            iconText: "text-purple-600",
          },
          // --- Program Specific: one-offs tailored to this program, no
          // matching library doc yet -> resolve to "not-ready" by default.
          {
            name: "Statement of Purpose",
            description: "Personal statement outlining your goals for this specific program",
            category: "program",
            icon: "file-text",
            iconBg: "bg-rose-100",
            iconText: "text-rose-600",
          },
          {
            name: "Research Proposal",
            description: "Proposed research topic or project relevant to this program",
            category: "program",
            icon: "file-text",
            iconBg: "bg-cyan-100",
            iconText: "text-cyan-600",
          },
          {
            name: "Portfolio",
            description: "Portfolio of relevant projects or work (if applicable)",
            category: "program",
            icon: "file-text",
            iconBg: "bg-orange-100",
            iconText: "text-orange-600",
          },
        ]
      : [
          // --- Personal Documents
          {
            name: "Passport",
            description: "A copy of your valid passport",
            category: "personal",
            icon: "id-card",
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
          },
          {
            name: "Recommendation Letter",
            description: "Academic or professional recommendation letter",
            category: "personal",
            icon: "mail",
            iconBg: "bg-indigo-100",
            iconText: "text-indigo-600",
          },
          {
            name: "Academic CV / Resume",
            description: "Your latest academic CV or resume",
            category: "personal",
            icon: "file-text",
            iconBg: "bg-blue-100",
            iconText: "text-blue-600",
          },
          // --- Program Specific
          {
            name: "Motivation Letter / Essay",
            description: "Statement of purpose explaining why you deserve this scholarship",
            category: "program",
            icon: "file-text",
            iconBg: "bg-rose-100",
            iconText: "text-rose-600",
          },
          {
            name: "Financial Statement",
            description: "Proof of financial need or current financial situation",
            category: "program",
            icon: "file-text",
            iconBg: "bg-pink-100",
            iconText: "text-pink-600",
          },
          {
            name: "Scholarship Essay",
            description: "Additional essay required specifically by this scholarship",
            category: "program",
            icon: "file-text",
            iconBg: "bg-violet-100",
            iconText: "text-violet-600",
          },
        ];

  return base.map((doc, index) => ({
    id: `${target.id}-req-${index + 1}`,
    targetId: target.id,
    documentName: doc.name,
    description: doc.description,
    category: doc.category,
    icon: doc.icon,
    iconBg: doc.iconBg,
    iconText: doc.iconText,
  }));
}

// Finds the library document that fulfils a requirement by name (case
// insensitive). Single source of truth linking "My Documents" to
// "Document Requirements".
function findMatchingDocument(
  documentName: string,
  documents: DocumentItem[],
): DocumentItem | undefined {
  return documents.find(
    (d) => d.name.trim().toLowerCase() === documentName.trim().toLowerCase(),
  );
}

// Resolves a requirement's live status/lastUpdatedDate from the library.
// No matching document yet => "not-ready".
export function resolveRequirement(
  template: Omit<DocumentRequirement, "status" | "lastUpdatedDate">,
  documents: DocumentItem[],
): DocumentRequirement {
  const match = findMatchingDocument(template.documentName, documents);
  return {
    ...template,
    status: match?.status ?? "not-ready",
    lastUpdatedDate: match?.lastUpdatedDate ?? null,
  };
}

// Requirements for one target, resolved live against the given documents.
export function getRequirementsForTarget(
  target: Target,
  documents: DocumentItem[],
): DocumentRequirement[] {
  return buildRequirementTemplate(target).map((template) =>
    resolveRequirement(template, documents),
  );
}

// Requirements for EVERY target (semua university + scholarship), resolved
// live against the given documents. Ini yang dipakai halaman Documents
// sekarang, gantiin requirements yang dulu cuma keisi lewat
// "Start Application".
export function getAllRequirements(
  documents: DocumentItem[],
): DocumentRequirement[] {
  return dummyTargets.flatMap((target) =>
    getRequirementsForTarget(target, documents),
  );
}

// Recomputes usedByCount on every library document: how many distinct
// targets currently have a requirement whose name matches it.
export function recomputeUsedByCount(
  documents: DocumentItem[],
): DocumentItem[] {
  const allTemplates = dummyTargets.flatMap((target) =>
    buildRequirementTemplate(target),
  );

  return documents.map((doc) => {
    const targetIds = new Set(
      allTemplates
        .filter((r) => r.documentName.trim().toLowerCase() === doc.name.trim().toLowerCase())
        .map((r) => r.targetId),
    );
    return { ...doc, usedByCount: targetIds.size };
  });
}