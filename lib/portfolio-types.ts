export type PriorityLevel = "High" | "Medium" | "Low";

export type CategoryIcon = "competition" | "project" | "leadership" | "volunteering";

export interface PortfolioCategory {
  id: string;
  title: string;
  subtitle: string;
  priority: PriorityLevel;
  icon: CategoryIcon;
  tips: string[];
}

export type CompetitionIcon = "science" | "chemistry" | "atom" | "literature";

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  field: string;
  level: string;
  deadline: string;
  icon: CompetitionIcon;
}

/* ------------------------------------------------------------------ */
/* New types for the improved portfolio page (image 2)                 */
/* ------------------------------------------------------------------ */

export type PortfolioItemCategory =
  | "Semua"
  | "Pengalaman Kerja"
  | "Sertifikat"
  | "Publikasi / Riset"
  | "Proyek"
  | "Organisasi"
  | "Volunteer";

export type RelevanceLevel = "Sangat relevan" | "Relevan" | "Cukup relevan";

export type FocusIcon = "bar-chart" | "file-text" | "users" | "award";

// Was a loose `string` before — tightened to match the other icon/color
// fields in this file (CategoryIcon, CompetitionIcon, FocusIcon). Both are
// still semantic keys, not literal Tailwind classes/components — the
// component that eventually renders PortfolioStat owns the lookup table
// that maps these to an actual LucideIcon + class.
export type PortfolioStatIcon = "fileText" | "briefcase" | "fileSearch" | "star" | "lightbulb";
export type PortfolioStatColor = "blue" | "green" | "purple" | "amber" | "rose";

export interface PortfolioStat {
  id: string;
  count: number;
  label: string;
  sublabel: string;
  icon: PortfolioStatIcon;
  color: PortfolioStatColor;
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  category: PortfolioItemCategory;
  date: string; // e.g. "Jan 2026 – Feb 2026" or "Oct 15, 2025"
}

export interface RecommendationFocus {
  id: string;
  title: string;
  description: string;
  icon: FocusIcon;
}

/* ------------------------------------------------------------------ */
/* Rekomendasi Portofolio — each recommendation is a competition       */
/* ------------------------------------------------------------------ */

// Jenjang pendidikan yang boleh ikut.
export type EducationLevel = "SD" | "SMP" | "SMA" | "SMK" | "Mahasiswa" | "Umum";

// Cakupan / level lomba (bukan tingkat kesulitan).
export type CompetitionScope =
  | "Sekolah"
  | "Kota/Kabupaten"
  | "Provinsi"
  | "Nasional"
  | "Internasional";

// Semantic key, not a display string — the component owns the label + icon.
export type ParticipationType = "individual" | "team";

// Column/field mapping:
//   name             -> nama lomba
//   organizer        -> penyelenggara
//   educationLevels  -> jenjang (bisa lebih dari satu)
//   domain           -> domain, e.g. "Olimpiade", "Penelitian", "Esai".
//                       Open-ended string on purpose: the filter tabs are
//                       built from whatever domains exist in the data.
//   subdomain        -> subdomain, e.g. "Kimia", "Karya Tulis Ilmiah"
//   level            -> level / cakupan lomba
//   startDate        -> start date, ISO "YYYY-MM-DD"
//   endDate          -> end date, ISO "YYYY-MM-DD"
//   participation    -> individual or team
//   fee              -> biaya pendaftaran in IDR, 0 = gratis
//   registrationUrl  -> link pendaftaran
//   relevance        -> how well it fits the student's profile
export interface PortfolioRecommendation {
  id: string;
  name: string;
  organizer: string;
  educationLevels: EducationLevel[];
  domain: string;
  subdomain: string;
  level: CompetitionScope;
  startDate: string;
  endDate: string;
  participation: ParticipationType;
  fee: number;
  registrationUrl: string;
  relevance: RelevanceLevel;
}

export interface QuickTip {
  quote: string;
}