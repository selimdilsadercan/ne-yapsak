"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { Doc } from "@/convex/_generated/dataModel";

interface PlaceListProps {
  userId?: string;
}

type UserPlaceWithPlace = Doc<"userPlaces"> & {
  place: Doc<"places">;
};

function PlaceList({ userId }: PlaceListProps) {
  const userPlaces = useQuery(api.places.getUserPlaces, {
    userId: userId ?? ""
  }) as UserPlaceWithPlace[] | undefined;

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userPlaces) {
    return <div className="h-[200px] flex items-center justify-center">Yükleniyor...</div>;
  }

  const visitlist = userPlaces.filter((p: UserPlaceWithPlace) => p.status === "want_to_visit");
  const visited = userPlaces.filter((p: UserPlaceWithPlace) => p.status === "visited");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="visitlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitlist">Ziyaret Edilecekler ({visitlist.length})</TabsTrigger>
          <TabsTrigger value="visited">Ziyaret Edilenler ({visited.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="visitlist">
          {visitlist.length === 0 ? (
            <EmptyState message="Ziyaret etmek istediğin mekanları buraya ekleyebilirsin" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visitlist.map((item: UserPlaceWithPlace) => (
                <div key={item._id}>Place Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="visited">
          {visited.length === 0 ? (
            <EmptyState message="Ziyaret ettiğin mekanlar burada görünecek" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visited.map((item: UserPlaceWithPlace) => (
                <div key={item._id}>Place Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { PlaceList };
