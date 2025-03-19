"use client";

import { ActivityCard } from "@/components/ActivityCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

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

  return (
    <div className="container py-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Keşfet</h1>
        <p className="text-muted-foreground">Yapabileceğin birbirinden farklı aktiviteleri keşfet</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedActivities).map(([category, activities]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="relative">
              <div className="flex overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-3">
                  {activities.map((activity, index) => (
                    <div key={`${activity.name}-${index}`} className="snap-start shrink-0" style={{ width: "140px" }}>
                      <ActivityCard title={activity.name} category={activity.category} iconName={activity.iconName} />
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
