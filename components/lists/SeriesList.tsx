"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { Doc } from "@/convex/_generated/dataModel";

interface SeriesListProps {
  userId?: string;
}

type UserSeriesWithSeries = Doc<"userSeries"> & {
  series: Doc<"series">;
};

function SeriesList({ userId }: SeriesListProps) {
  const userSeries = useQuery(api.series.getUserSeries, {
    userId: userId ?? ""
  }) as UserSeriesWithSeries[] | undefined;

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userSeries) {
    return <div className="h-[200px] flex items-center justify-center">Yükleniyor...</div>;
  }

  const watchlist = userSeries.filter((s: UserSeriesWithSeries) => s.status === "want_to_watch");
  const watching = userSeries.filter((s: UserSeriesWithSeries) => s.status === "watching");
  const watched = userSeries.filter((s: UserSeriesWithSeries) => s.status === "watched");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="watchlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="watchlist">İzlenecekler ({watchlist.length})</TabsTrigger>
          <TabsTrigger value="watching">İzleniyor ({watching.length})</TabsTrigger>
          <TabsTrigger value="watched">İzlenenler ({watched.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          {watchlist.length === 0 ? (
            <EmptyState message="İzlemek istediğin dizileri buraya ekleyebilirsin" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlist.map((item: UserSeriesWithSeries) => (
                <div key={item._id}>Series Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="watching">
          {watching.length === 0 ? (
            <EmptyState message="Şu anda izlediğin dizi yok" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watching.map((item: UserSeriesWithSeries) => (
                <div key={item._id}>Series Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="watched">
          {watched.length === 0 ? (
            <EmptyState message="İzlediğin diziler burada görünecek" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watched.map((item: UserSeriesWithSeries) => (
                <div key={item._id}>Series Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { SeriesList };
