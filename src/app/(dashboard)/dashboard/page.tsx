import { StatsCards } from "@/components/dashboard/stats-cards";
import { getDashboardStats } from "@/lib/dashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="pb-24">
      <StatsCards
        propertiesCount={stats.properties}
        requirementsCount={stats.requirements}
        followUpsTodayCount={stats.followUps}
      />
    </div>
  );
}