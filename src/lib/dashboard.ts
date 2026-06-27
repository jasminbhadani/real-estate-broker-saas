import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [
    { count: propertiesCount },
    { count: requirementsCount },
    { count: followUpsTodayCount },
  ] = await Promise.all([
    supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("status", "available")
    .is("deleted_at", null),

    supabase
      .from("requirements")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("follow_ups")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .is("deleted_at", null)
      .gte("due_date", startOfDay.toISOString())
      .lte("due_date", endOfDay.toISOString())
      ]);

  return {
    properties: propertiesCount ?? 0,
    requirements: requirementsCount ?? 0,
    followUps: followUpsTodayCount ?? 0,
  };
}