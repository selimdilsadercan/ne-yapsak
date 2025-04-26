"use client";

import { useState, useMemo } from "react";
import { SwipeableCard } from "@/components/SwipeableCard";
import { toast } from "react-hot-toast";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams } from "next/navigation";

// Generate random angle between -8 and 8 degrees
const getRandomAngle = () => Math.random() * 16 - 8;

type ListItem = {
  id: string;
  title: string;
  imageUrl?: string;
  type?: "movie" | "series" | "activity";
  iconName?: string;
};

function ListPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // Get items based on type
  const items = useQuery(
    type === "watch"
      ? api.defaultLists.getSuggestedWatches
      : type === "game"
        ? api.defaultLists.getSuggestedGames
        : type === "visit"
          ? api.defaultLists.getSuggestedPlaces
          : type === "event"
            ? api.defaultLists.getSuggestedEvents
            : type === "activity"
              ? api.defaultLists.getSuggestedActivities
              : api.activities.getRandomItems,
    { limit: 10 }
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  // Generate random angles for each card and memoize them
  const cardAngles = useMemo(() => items?.map(() => getRandomAngle()) ?? [], [items]);

  if (!items) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Yükleniyor...</h1>
      </div>
    );
  }

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "up") {
      toast.success("Listenize eklendi!");
    } else if (direction === "right") {
      toast.success("İyi eğlenceler!");
    }

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= items.length) {
    return (
      <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Tüm önerileri gördünüz!</h1>
        <p className="text-muted-foreground">Daha fazla öneri için keşfet sayfasını ziyaret edin.</p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-[320px]">
        <div className="relative h-[500px]">
          {items.slice(currentIndex, currentIndex + 3).map((item, index) => {
            const angle = cardAngles[currentIndex + index];
            const xOffset = Math.sin(angle * (Math.PI / 180)) * 5;

            // Transform item to common format
            const listItem: ListItem = {
              id: "id" in item ? item.id : "name" in item ? item.name : "",
              title: "title" in item ? item.title : "name" in item ? item.name : "",
              imageUrl: "imageUrl" in item ? item.imageUrl : "posterUrl" in item ? item.posterUrl : undefined,
              type:
                "type" in item
                  ? item.type
                  : "contentType" in item
                    ? item.contentType === "movie" || item.contentType === "series"
                      ? item.contentType
                      : "activity"
                    : undefined,
              iconName: "iconName" in item ? item.iconName : undefined
            };

            return (
              <div
                key={listItem.id}
                className="absolute inset-x-0"
                style={{
                  zIndex: items.length - index,
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
                <SwipeableCard
                  title={listItem.title}
                  iconName={listItem.iconName || (listItem.type === "movie" ? "Film" : listItem.type === "series" ? "Tv" : "Activity")}
                  imageUrl={listItem.imageUrl || ""}
                  onSwipe={handleSwipe}
                  rating={0}
                  year={0}
                  duration={0}
                  genres={[]}
                  imdbRank={0}
                  awards={[]}
                  actors={[]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ListPage;
