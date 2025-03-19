"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { Film, Tv, Gamepad2, MapPin, Calendar, Star, Youtube } from "lucide-react";
import { MovieList } from "@/components/lists/MovieList";
import { SeriesList } from "@/components/lists/SeriesList";
import { GameList } from "@/components/lists/GameList";
import { PlaceList } from "@/components/lists/PlaceList";
import { EventList } from "@/components/EventList";
import { ActivityList } from "@/components/ActivityList";
import { EmptyState } from "@/components/EmptyState";

export default function ListsPage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">Please sign in</h3>
          <p className="text-sm text-muted-foreground">You need to sign in to view your lists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Listelerim</h1>
        <p className="text-muted-foreground">Kaydettiğin ve planladığın aktiviteleri görüntüle</p>
      </div>

      <Tabs defaultValue="watchlist" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full sm:w-[600px]">
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">İzlenecekler</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Oyunlar</span>
          </TabsTrigger>
          <TabsTrigger value="places" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Mekanlar</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Etkinlikler</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Aktiviteler</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <div className="space-y-2">
            <Tabs defaultValue="movies">
              <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-full sm:w-[400px]">
                <TabsTrigger
                  value="movies"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                  <Film className="h-4 w-4 mr-2" />
                  Filmler
                </TabsTrigger>
                <TabsTrigger
                  value="series"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                  <Tv className="h-4 w-4 mr-2" />
                  Diziler
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                  <Youtube className="h-4 w-4 mr-2" />
                  Videolar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="movies" className="mt-2">
                <MovieList userId={user.id} />
              </TabsContent>
              <TabsContent value="series" className="mt-2">
                <SeriesList userId={user.id} />
              </TabsContent>
              <TabsContent value="videos" className="mt-2">
                <EmptyState message="Video listesi yakında eklenecek" />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="games">
          <GameList userId={user.id} />
        </TabsContent>
        <TabsContent value="places">
          <PlaceList userId={user.id} />
        </TabsContent>
        <TabsContent value="events">
          <EventList userId={user.id} />
        </TabsContent>
        <TabsContent value="activities">
          <ActivityList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
