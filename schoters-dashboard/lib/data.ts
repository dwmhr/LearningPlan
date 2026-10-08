import {
  DashboardData,
  ProfileData,
} from "./types";
import { NOTIFICATIONS } from "./notifications";

/* ------------------- Dashboard dummy data ------------------- */

const dummyData: DashboardData = {
  user: {
    name: "Mikael A. Marwastu",
    studentId: "12345678",
    memberTier: "Silver Member",
    avatarUrl: "/Mike.jpg",
    memberSince: "May 2024",
  },

  notifications: NOTIFICATIONS,

  progressStats: [
    { id: "overall", label: "Overall Progress", value: 42, monthlyDelta: 9 },
    { id: "ielts", label: "IELTS Progress", value: 60 },
    { id: "sat", label: "SAT Progress", value: 28 },
    { id: "document", label: "Document Progress", value: 35 },
  ],

  // TODO(backend): update this whenever admin edits a student's progress record
  progressUpdatedAt: "2026-09-10T10:30:00Z",

    nextActions: [
    {
      id: "na1",
      label: "Upload Akita University documents",
      category: "document",
      description: "Complete and upload required documents",
      dueDate: "2026-09-15",
      priority: "High",
    },
    {
      id: "na2",
      label: "Complete IELTS Diagnostic",
      category: "language-test",
      description: "Take the diagnostic test to assess your level",
      dueDate: "2026-09-16",
      priority: "Medium",
    },
    {
      id: "na3",
      label: "Practice SAT Reading",
      category: "academic-practice",
      description: "Practice reading and timing strategies",
      dueDate: "2026-09-19",
      priority: "Low",
    },
    {
      id: "na4",
      label: "Submit Fast Retailing Scholarship Essay",
      category: "scholarship",
      description: "Finish and submit your scholarship application essay",
      dueDate: "2026-09-20",
      priority: "Medium",
    },
  ],

  scheduleEvents: [
    { id: "ev1", 
      date: "2026-09-11", 
      startTime: "14.00", 
      endTime: "15.00", 
      title: "IELTS Writing Practice", 
      category: "ielts" },

    { id: "ev2", 
      date: "2026-09-11", 
      startTime: "16.00", 
      endTime: "17.00", 
      title: "SAA Session 3", 
      category: "saa" },

    { id: "ev3", 
      date: "2026-09-15", 
      startTime: "10.00", 
      endTime: "11.00", 
      title: "SAT Reading Practice", 
      category: "sat" },

    { id: "ev4", 
      date: "2026-09-18", 
      startTime: "09.00", 
      endTime: "10.30", 
      title: "University Document Review", 
      category: "other" },
  ],

  deadlines: [
    { id: "dl1", title: "Akita University - Document Deadline", date: "2026-09-13", type: "document" },
    { id: "dl2", title: "Fast Retailing Foundation Scholarship for Indonesian Students", date: "2026-09-20", type: "scholarship" },
    { id: "dl3", title: "MEXT University Recommendation Scholarship", date: "2026-09-20", type: "scholarship" },
    { id: "dl4", title: "Kyoto University - Graduate School of Informatics", date: "2026-09-25", type: "university" },
    { id: "dl5", title: "JASSO International Student Scholarship", date: "2026-10-01", type: "scholarship" },
    ],

  targetPrograms: [
    { id: "tp1", 
      category: "UNIVERSITY", 
      title: "Akita University - Graduate School", 
      country: "Japan", 
      semester: "S2", status: "In Progress", 
      deadline: "2026-09-28", readiness: 68 },
    { id: "tp2", category: "SCHOLARSHIP", title: "Fast Retailing Foundation Scholarship for Indonesian Students", country: "Japan", semester: "S1", status: "In Progress", deadline: "2026-10-01", readiness: 32 },
    { id: "tp3", category: "SCHOLARSHIP", title: "MEXT University Recommendation Scholarship", country: "Japan", semester: "S2", status: "In Progress", deadline: "2026-09-21", readiness: 55 },
    { id: "tp4", category: "UNIVERSITY", title: "Kyoto University - Graduate School of Informatics", country: "Japan", semester: "S2", status: "In Progress", deadline: "2026-09-20", readiness: 25 },
    { id: "tp5", category: "SCHOLARSHIP", title: "JASSO International Student Scholarship", country: "Japan", semester: "S1", status: "In Progress", deadline: "2026-09-15", readiness: 80 },
    { id: "tp6", category: "UNIVERSITY", title: "Osaka University - Graduate School of Engineering", country: "Japan", semester: "S2", status: "In Progress", deadline: "2026-09-20", readiness: 40 },
  ],
};

export async function getDashboardData(): Promise<DashboardData> {
  return dummyData;
}

/* ------------------- Profile dummy data ------------------- */

const dummyProfileData: ProfileData = {
  user: dummyData.user, // reuse the same user so it stays in sync

  profileStats: [
    { id: "destination", icon: "mapPin", label: "Preferred Destination", value: ["Malaysia", "Japan"] },
    { id: "major", icon: "grid", label: "Major Interest", value: ["Teknik Mesin", "Pertambangan"] },
    { id: "programLevel", icon: "book", label: "Program Level", value: "Grade X - Semester 1" },
    { id: "startingGrade", icon: "graduation", label: "Program Starting Grade", value: "Grade X" },
  ],

  profileSections: [
    { id: "personal", label: "Personal Information", description: "Add your basic personal details", weight: 10, completed: true, icon: "userCircle" },
    { id: "study-preferences", label: "Study Preferences", description: "Tell us where and what you'd like to study", weight: 20, completed: true, icon: "userCircle" },
    { id: "academic-background", label: "Academic Background", description: "Add your curriculum and academic record", weight: 20, completed: true, icon: "graduation" },
    { id: "language-test-scores", label: "Language & Test Scores", description: "Add your test scores (IELTS, TOEFL, SAT, etc.)", weight: 15, completed: false, icon: "shield" },
    { id: "achievements", label: "Achievements", description: "Add your awards, certificates, and honors", weight: 10, completed: false, icon: "award" },
    { id: "extracurricular", label: "Extracurricular Activities", description: "Add your organization, volunteer, and activities", weight: 10, completed: false, icon: "users" },
    { id: "portfolio", label: "Portfolio / Projects", description: "Add your portfolio, projects, or research", weight: 15, completed: false, icon: "folder" },
  ],

  faqItems: [
    { id: "faq1", question: "Why should I complete my profile?", answer: "Learn the benefits of a complete profile.", icon: "lightbulb" },
    { id: "faq2", question: "How do I get better university matches?", answer: "Understand how recommendations work.", icon: "compass" },
    { id: "faq3", question: "What information improves my recommendations?", answer: "Find out what details make a difference.", icon: "messageQuestion" },
  ],

  academicBackground: {
    curriculum: "Indonesia Kurikulum Nasional (Kurnas)",
    average: "85",
    achievementLevel: "Intermediate",
  },

  languageTestScores: [
    { id: "ielts", icon: "fileText", title: "IELTS", subtitle: "English Proficiency Test", status: "Not Taken Yet" },
    { id: "sat", icon: "fileText", title: "SAT", subtitle: "Scholastic Assessment Test", status: "Not Taken Yet" },
  ],
};

export async function getProfileData(): Promise<ProfileData> {
  return dummyProfileData;
}