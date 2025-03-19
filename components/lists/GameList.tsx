"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { Doc } from "@/convex/_generated/dataModel";

interface GameListProps {
  userId?: string;
}

type UserGameWithGame = Doc<"userGames"> & {
  game: Doc<"games">;
};

function GameList({ userId }: GameListProps) {
  const userGames = useQuery(api.games.getUserGames, {
    userId: userId ?? ""
  }) as UserGameWithGame[] | undefined;

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userGames) {
    return <div className="h-[200px] flex items-center justify-center">Yükleniyor...</div>;
  }

  const playlist = userGames.filter((g: UserGameWithGame) => g.status === "want_to_play");
  const playing = userGames.filter((g: UserGameWithGame) => g.status === "playing");
  const completed = userGames.filter((g: UserGameWithGame) => g.status === "completed");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="playlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="playlist">Oynanacaklar ({playlist.length})</TabsTrigger>
          <TabsTrigger value="playing">Oynanıyor ({playing.length})</TabsTrigger>
          <TabsTrigger value="completed">Tamamlananlar ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="playlist">
          {playlist.length === 0 ? (
            <EmptyState message="Oynamak istediğin oyunları buraya ekleyebilirsin" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {playlist.map((item: UserGameWithGame) => (
                <div key={item._id}>Game Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="playing">
          {playing.length === 0 ? (
            <EmptyState message="Şu anda oynadığın oyun yok" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {playing.map((item: UserGameWithGame) => (
                <div key={item._id}>Game Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completed.length === 0 ? (
            <EmptyState message="Tamamladığın oyunlar burada görünecek" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {completed.map((item: UserGameWithGame) => (
                <div key={item._id}>Game Card Component</div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export { GameList };
