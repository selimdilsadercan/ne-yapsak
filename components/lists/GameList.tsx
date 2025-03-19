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
      {playlist.length === 0 ? (
        <EmptyState message="Oynamak istediğin oyunları buraya ekleyebilirsin" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlist.map((item: UserGameWithGame) => (
            <div key={item._id}>Game Card Component</div>
          ))}
        </div>
      )}
    </div>
  );
}

export { GameList };
