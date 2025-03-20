"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gamepad2, Search, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export default function GamesPage() {
  const games = useQuery(api.games.getAll);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Games</h2>
          <p className="text-muted-foreground">Manage games in your database.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Game
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search games..." className="pl-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {games?.map((game: Doc<"games">) => (
              <Card key={game._id} className="overflow-hidden">
                <div className="relative aspect-[2/3]">
                  <Image src={game.imageUrl} alt={game.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold line-clamp-1">{game.title}</h3>
                      <span className="text-sm text-muted-foreground">{game.year}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{game.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                      {game.metacritic && (
                        <span
                          className={`px-1.5 py-0.5 rounded ${game.metacritic >= 75 ? "bg-green-500" : game.metacritic >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        >
                          {game.metacritic}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
