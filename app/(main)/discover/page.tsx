"use client";

import { DiscoverCard } from "@/components/DiscoverCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Define the order of categories
const categoryOrder = ["Yeni Bir Şey Denemek", "Bir Şey İzlemek", "Bir Şey Oynamak", "Bir Yere Gitmek", "Bir Etkinliğe Gitmek", "Bir Aktivite Yapmak"];

function DiscoverPage() {
  const activities = useQuery(api.activities.getAll);

  if (!activities) {
    return (
      <div className="container py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Keşfet</h1>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Group activities by category
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  // Sort categories based on the defined order
  const sortedCategories = Object.entries(groupedActivities).sort(([a], [b]) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return indexA - indexB;
  });

  return (
    <div className="container py-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Keşfet</h1>
        <p className="text-muted-foreground">Yapabileceğin birbirinden farklı aktiviteleri keşfet</p>
      </div>

      <div className="space-y-8">
        {sortedCategories.map(([category, activities]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="relative">
              <div className="flex overflow-x-auto pb-4 no-scrollbar">
                <div className="flex gap-4 min-w-full">
                  {activities.map((activity) => (
                    <div key={activity._id} className="w-[140px] shrink-0">
                      <DiscoverCard title={activity.name} category={activity.category} iconName={activity.iconName as keyof typeof import("lucide-react")} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default DiscoverPage;
