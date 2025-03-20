"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "@/components/EmptyState";
import GameSearchDialog from "@/components/lists/GameSearchDialog";
import { GameCard } from "@/components/lists/GameCard";
import { Doc } from "@/convex/_generated/dataModel";

interface GameListProps {
  userId?: string;
}

type UserGameWithGame = Doc<"userGames"> & {
  game: Doc<"games">;
};

export function GameList({ userId }: GameListProps) {
  const userGames = useQuery(api.games.getUserGames, userId ? { userId } : "skip");

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Oyunlar</h2>
        <GameSearchDialog />
      </div>

      {!userGames?.length ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">No games found</h3>
          <p className="text-sm text-muted-foreground">You haven&apos;t added any games to your list yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userGames.map((userGame) => (
            <GameCard key={userGame._id} userGame={userGame as UserGameWithGame} onUpdate={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
