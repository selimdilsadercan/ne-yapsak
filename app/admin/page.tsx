"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gamepad2, ListChecks, Trophy } from "lucide-react";

function StatsCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  // TODO: Replace with real data from your API
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "Active users this month"
    },
    {
      title: "Total Games",
      value: "12,345",
      icon: <Gamepad2 className="h-4 w-4 text-muted-foreground" />,
      description: "Games in database"
    },
    {
      title: "Lists Created",
      value: "3,456",
      icon: <ListChecks className="h-4 w-4 text-muted-foreground" />,
      description: "User game lists"
    },
    {
      title: "Completed Games",
      value: "2,345",
      icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
      description: "Games marked as completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your platform&apos;s statistics and performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} description={stat.description} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Activity chart will be implemented here</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Popular Games</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Popular games list will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
