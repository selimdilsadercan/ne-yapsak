"use client";

import { useState, useMemo } from "react";
import { SwipeableCard } from "@/components/SwipeableCard";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft, Users } from "lucide-react";
import * as Icons from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";

// Generate random angle between -8 and 8 degrees
const getRandomAngle = () => Math.random() * 16 - 8;

function ListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const listId = params.id as Id<"lists">;

  const listDetails = useQuery(api.lists.getList, { listId });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "tinder">("grid");
  const createSession = useMutation(api.sessions.createSession);

  // Generate random angles for each card and memoize them
  const cardAngles = useMemo(() => listDetails?.items?.map(() => getRandomAngle()) ?? [], [listDetails?.items]);

  if (!listDetails) {
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

  const handleStartSession = async () => {
    try {
      const sessionId = await createSession({ listId });
      toast.success("Swipe oturumu başlatıldı!");
      router.push(`/session/${sessionId}`);
    } catch (error) {
      toast.error("Oturum başlatılırken bir hata oluştu");
    }
  };

  // Grid view component
  const GridView = () => {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{listDetails.name}</h1>
              {listDetails.description && <p className="text-sm text-muted-foreground">{listDetails.description}</p>}
            </div>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listDetails.items.map((item) => {
              return (
                <Card key={item._id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-[3/4] w-full bg-muted">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icons.HelpCircle className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.itemType}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-purple-500 to-indigo-600"
              onClick={() => setViewMode("tinder")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Bireysel Swipe
            </Button>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 bg-gradient-to-r from-blue-500 to-cyan-500"
              onClick={handleStartSession}
            >
              <Users className="mr-2 h-5 w-5" />
              Swipe Session Başlat
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Tinder view component
  const TinderView = () => {
    if (currentIndex >= listDetails.items.length) {
      return (
        <div className="container flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Tüm önerileri gördünüz!</h1>
          <p className="text-muted-foreground">Daha fazla öneri için keşfet sayfasını ziyaret edin.</p>
          <Button variant="outline" className="mt-4" onClick={() => setViewMode("grid")}>
            Grid Görünümüne Dön
          </Button>
        </div>
      );
    }

    return (
      <div className="container py-6">
        <div className="mb-6 flex justify-start">
          <Button variant="ghost" size="sm" onClick={() => setViewMode("grid")} className="text-muted-foreground">
            ← Liste Görünümü
          </Button>
        </div>
        <div className="mx-auto max-w-[320px]">
          <div className="relative h-[500px]">
            {listDetails.items.slice(currentIndex, currentIndex + 3).map((item, index) => {
              const angle = cardAngles[currentIndex + index];
              const xOffset = Math.sin(angle * (Math.PI / 180)) * 5;

              return (
                <div
                  key={item._id}
                  className="absolute inset-x-0"
                  style={{
                    zIndex: listDetails.items.length - index,
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
                  <SwipeableCard title={item.name} imageUrl={item.imageUrl} iconName="HelpCircle" onSwipe={handleSwipe} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return viewMode === "grid" ? <GridView /> : <TinderView />;
}

export default ListDetailPage;
