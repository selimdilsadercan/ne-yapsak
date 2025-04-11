"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchMovies, getTMDBImageUrl, TMDBMovie } from "@/lib/tmdb";
import { Film, PlusIcon, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface MovieSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMovieSelect: (movie: TMDBMovie) => void;
}

export function MovieSearchDialog({ open, onOpenChange, onMovieSelect }: MovieSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results.results);
    } catch (error) {
      toast.error("Film arama başarısız oldu");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Film Ara</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input placeholder="Film ara..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <Button onClick={handleSearch} disabled={isSearching}>
            Ara
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((movie) => (
            <div key={movie.id} className="group bg-card hover:bg-accent rounded-lg overflow-hidden transition-colors">
              {/* Movie Poster */}
              <div className="relative aspect-[2/3]">
                <Image
                  src={getTMDBImageUrl(movie.poster_path) || "/placeholder.png"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* Movie Info */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">{movie.title}</h3>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {movie.release_date && <p className="text-sm">{new Date(movie.release_date).getFullYear()}</p>}
                    {movie.vote_average > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-yellow-400">★</span>
                        <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {movie.overview && <p className="text-sm text-muted-foreground line-clamp-2">{movie.overview}</p>}
                </div>

                {/* Add Button */}
                <Button size="sm" onClick={() => onMovieSelect(movie)} variant="secondary" className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Oturuma Ekle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
