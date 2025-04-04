"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/nextjs";
import { Film, Gamepad2, MapPin, Calendar, Star, Sparkles } from "lucide-react";
import { MovieList } from "@/components/lists/MovieList";
import { SeriesList } from "@/components/lists/SeriesList";
import { GameList } from "@/components/lists/GameList";
import { PlaceList } from "@/components/lists/PlaceList";
import { EventList } from "@/components/EventList";
import { ActivityList } from "@/components/ActivityList";
import { ExperienceList } from "@/components/lists/ExperienceList";

function ListsPage() {
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
        <h1 className="text-3xl font-bold">Kitaplığın</h1>
      </div>

      <Tabs defaultValue="experiences" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full sm:w-[720px]">
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Deneyimler</span>
          </TabsTrigger>
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

        <TabsContent value="experiences">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Deneyimler</h2>
          </div>
          <ExperienceList />
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">İzlenecekler</h2>
          </div>
          <Tabs defaultValue="movies" className="space-y-4">
            <TabsList>
              <TabsTrigger value="movies">Filmler</TabsTrigger>
              <TabsTrigger value="series">Diziler</TabsTrigger>
            </TabsList>
            <TabsContent value="movies">
              <MovieList userId={user.id} />
            </TabsContent>
            <TabsContent value="series">
              <SeriesList userId={user.id} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="games">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Oyunlar</h2>
          </div>
          <GameList userId={user.id} />
        </TabsContent>

        <TabsContent value="places">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Mekanlar</h2>
          </div>
          <PlaceList userId={user.id} />
        </TabsContent>

        <TabsContent value="events">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Etkinlikler</h2>
          </div>
          <EventList userId={user.id} />
        </TabsContent>

        <TabsContent value="activities">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Aktiviteler</h2>
          </div>
          <ActivityList userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ListsPage;
