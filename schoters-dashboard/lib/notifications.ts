export type NotificationType = "reminder" | "deadline" | "match" | "document";

export interface AppNotification {
  id: number;
  text: string;
  type?: NotificationType;
  time?: string; // short relative label e.g. "2h left", "1d ago"
  read?: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    text: "Your IELTS Writing Practice starts in 2 hours.",
    type: "reminder",
    time: "2h left",
    read: false,
  },
  {
    id: 2,
    text: "Akita University document deadline is in 7 days.",
    type: "deadline",
    time: "7d left",
    read: false,
  },
  {
    id: 3,
    text: "New scholarship match: Fast Retailing Foundation.",
    type: "match",
    time: "1d ago",
    read: false,
  },
  {
    id: 4,
    text: "Recommendation Letter is still not ready — 4 targets need it.",
    type: "document",
    time: "2d ago",
    read: true,
  },
  {
    id: 5,
    text: "IELTS Certificate is in progress, don't forget to finish it.",
    type: "document",
    time: "3d ago",
    read: true,
  },
];