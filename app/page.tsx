"use client";

import { useState, useMemo } from "react";
import { SwipeableCard } from "@/components/SwipeableCard";
import { toast } from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Generate random angle between -8 and 8 degrees
const getRandomAngle = () => Math.random() * 16 - 8;

function HomePage() {
  const activities = useQuery(api.activities.getRandomActivities, { limit: 10 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Generate random angles for each card and memoize them
  const cardAngles = useMemo(() => activities?.map(() => getRandomAngle()) ?? [], [activities]);

  if (!activities) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Yükleniyor...</h1>
      </div>
    );
  }

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "up") {
      setWatchlist((prev) => [...prev, activities[currentIndex].name]);
      toast.success("Listenize eklendi!");
    } else if (direction === "right") {
      toast.success("İyi eğlenceler!");
    }

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= activities.length) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Tüm aktiviteleri gördünüz!</h1>
        <p className="text-muted-foreground">Daha fazla aktivite için keşfet sayfasını ziyaret edin.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-[320px]">
        <div className="relative h-[500px]">
          {activities.slice(currentIndex, currentIndex + 3).map((activity, index) => {
            const angle = cardAngles[currentIndex + index];
            const xOffset = Math.sin(angle * (Math.PI / 180)) * 5;

            return (
              <div
                key={activity.name}
                className="absolute inset-x-0"
                style={{
                  zIndex: activities.length - index,
                  transform: `
                    scale(${1 - index * 0.03}) 
                    translateY(${index * 4}px)
                    translateX(${xOffset}px)
                    rotate(${angle}deg)
                  `,
                  opacity: 1 - index * 0.15,
                  transition: "transform 0.3s ease-out"
                }}
              >
                <SwipeableCard title={activity.name} iconName={activity.iconName} onSwipe={handleSwipe} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
