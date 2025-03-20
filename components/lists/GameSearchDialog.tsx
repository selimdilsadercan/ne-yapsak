"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchGames, getRAWGImageUrl, RAWGGame } from "@/lib/rawg";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { PlusIcon, Gamepad2 } from "lucide-react";
import Image from "next/image";

function GameSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RAWGGame[]>([]);
  const addGame = useMutation(api.games.addGameFromRAWG);
  const { user } = useUser();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchGames(query);
      setSearchResults(results.results);
    } catch (error) {
      toast.error("Failed to search games");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddGame = async (game: RAWGGame) => {
    if (!user?.id) {
      toast.error("Please log in to add games");
      return;
    }

    try {
      await addGame({
        rawgId: game.id,
        title: game.name,
        year: new Date(game.released).getFullYear(),
        description: game.description || "",
        imageUrl: getRAWGImageUrl(game.background_image),
        rating: game.rating,
        metacritic: game.metacritic || null,
        userId: user.id
      });
      toast.success("Game added to your list!");
    } catch (error) {
      toast.error("Failed to add game");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Gamepad2 className="w-4 h-4 mr-2" />
          Search Games
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Games</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((game) => (
            <div key={game.id} className="group bg-card hover:bg-accent rounded-lg overflow-hidden transition-colors">
              {/* Game Cover */}
              <div className="relative w-full aspect-video">
                <Image
                  src={getRAWGImageUrl(game.background_image)}
                  alt={game.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* Game Info */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">{game.name}</h3>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {game.released && <p className="text-sm">{new Date(game.released).getFullYear()}</p>}
                    {game.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-yellow-400">★</span>
                        <span className="text-sm">{game.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {game.metacritic && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          game.metacritic >= 75 ? "bg-green-500" : game.metacritic >= 50 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      >
                        {game.metacritic}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add Button */}
                <Button size="sm" onClick={() => handleAddGame(game)} variant="secondary" className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add to List
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default GameSearchDialog;
