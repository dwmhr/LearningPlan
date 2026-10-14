import { redirect } from "next/navigation";
import { getDashboardData } from "./data";
import { hasAccess, getHomePath } from "./access";
import { Product } from "./types";

// Panggil di layout/page (server component). Kalau user tidak punya produk
// yang dibutuhkan, langsung diarahkan ke halaman default miliknya.
export async function requireAccess(required: Product) {
  const { user } = await getDashboardData();

  if (!hasAccess(user.subscriptions, required)) {
    redirect(getHomePath(user.subscriptions));
  }

  return user;
}