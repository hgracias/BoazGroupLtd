import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getAdminById, getDriverById } from "@/lib/data";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/**
 * Server-side guard for /driver pages. Middleware already blocks anonymous
 * traffic; this second check means a page can never render without a driver.
 */
export async function requireDriver() {
  const user = await getCurrentUser();
  if (!user) redirect("/driver/login");
  if (user.role !== "DRIVER") redirect("/admin");

  const driver = await getDriverById(user.id);
  if (!driver) redirect("/driver/login");
  return driver;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") redirect("/driver");

  const admin = await getAdminById(user.id);
  if (!admin) redirect("/admin/login");
  return admin;
}
