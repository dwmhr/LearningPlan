import { Product } from "./types";

export function hasAccess(subscriptions: Product[], required: Product): boolean {
  return subscriptions.includes(required);
}

// Filter menu berdasarkan langganan. Grup yang kosong ikut disembunyikan.
export function filterNavGroups<T extends { items: { requires: Product }[] }>(
  groups: T[],
  subscriptions: Product[]
): T[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => subscriptions.includes(item.requires)),
    }))
    .filter((group) => group.items.length > 0);
}

// Halaman default per user (dipakai untuk redirect)
export function getHomePath(subscriptions: Product[]): string {
  if (subscriptions.includes("SAA")) return "/";
  if (subscriptions.includes("IELTS")) return "/ielts";
  if (subscriptions.includes("SAT")) return "/sat";
  return "/no-access";
}