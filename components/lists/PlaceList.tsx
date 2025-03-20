"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { PlaceSearchDialog } from "./PlaceSearchDialog";
import { PlaceCard } from "./PlaceCard";

interface PlaceListProps {
  userId: string;
}


export function PlaceList({ userId }: PlaceListProps) {
  const userPlaces = useQuery(api.places.getUserPlaces, { userId });

  if (!userId) {
    return <EmptyState message="Mekanları görmek için giriş yapın" />;
  }

  if (!userPlaces?.length) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Mekanlar</h2>
          <PlaceSearchDialog userId={userId} />
        </div>
        <EmptyState message="Henüz mekan eklenmemiş" />
      </div>
    );
  }

  const wantToVisit = userPlaces.filter((p) => p.status === "want_to_visit" && p.place);
  const visiting = userPlaces.filter((p) => p.status === "visiting" && p.place);
  const visited = userPlaces.filter((p) => p.status === "visited" && p.place);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mekanlar</h2>
        <PlaceSearchDialog userId={userId} />
      </div>

      <Tabs defaultValue="want_to_visit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="want_to_visit">Gidilecek ({wantToVisit.length})</TabsTrigger>
          <TabsTrigger value="visiting">Gidiliyor ({visiting.length})</TabsTrigger>
          <TabsTrigger value="visited">Gidildi ({visited.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="want_to_visit">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wantToVisit.map((userPlace) => (
              <PlaceCard key={userPlace._id} place={userPlace.place!} userPlace={userPlace} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visiting">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visiting.map((userPlace) => (
              <PlaceCard key={userPlace._id} place={userPlace.place!} userPlace={userPlace} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="visited">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visited.map((userPlace) => (
              <PlaceCard key={userPlace._id} place={userPlace.place!} userPlace={userPlace} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
