"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Film, Tv, Gamepad2, MapPin } from "lucide-react";
import { MovieList } from "@/components/lists/MovieList";
import { SeriesList } from "@/components/lists/SeriesList";
import { GameList } from "@/components/lists/GameList";
import { PlaceList } from "@/components/lists/PlaceList";
import { useUser } from "@clerk/nextjs";

function ListsPage() {
  const { user } = useUser();

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Listelerim</h1>
        <p className="text-muted-foreground">Kaydettiğin ve planladığın aktiviteleri görüntüle</p>
      </div>

      <Tabs defaultValue="movies" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
          <TabsTrigger value="movies" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Filmler</span>
          </TabsTrigger>
          <TabsTrigger value="series" className="flex items-center gap-2">
            <Tv className="h-4 w-4" />
            <span className="hidden sm:inline">Diziler</span>
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Oyunlar</span>
          </TabsTrigger>
          <TabsTrigger value="places" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Mekanlar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <MovieList userId={user?.id} />
        </TabsContent>
        <TabsContent value="series">
          <SeriesList userId={user?.id} />
        </TabsContent>
        <TabsContent value="games">
          <GameList userId={user?.id} />
        </TabsContent>
        <TabsContent value="places">
          <PlaceList userId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ListsPage;
