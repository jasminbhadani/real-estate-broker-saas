type StatsCardsProps = {
  propertiesCount: number;
  requirementsCount: number;
  followUpsTodayCount: number;
};

export function StatsCards({
  propertiesCount,
  requirementsCount,
  followUpsTodayCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Available Properties",
      value: propertiesCount,
      emoji: "🏠",
    },
    {
      label: "Needs",
      value: requirementsCount,
      emoji: "📋",
    },
    {
      label: "Today's Follow-ups",
      value: followUpsTodayCount,
      emoji: "⏰",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border bg-card p-4 text-center shadow-sm"
        >
          <div className="text-2xl">{stat.emoji}</div>

          <div className="mt-2 text-2xl font-bold">
            {stat.value}
          </div>

          <div className="mt-1 text-xs text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}