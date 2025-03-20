"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchMovies, getTMDBImageUrl, TMDBMovie } from "@/lib/tmdb";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { PlusIcon } from "lucide-react";
import Image from "next/image";

function MovieSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const addMovie = useMutation(api.movies.addMovieFromTMDB);
  const { user } = useUser();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results.results);
    } catch (error) {
      toast.error("Failed to search movies");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = async (movie: TMDBMovie) => {
    if (!user?.id) {
      toast.error("Please log in to add movies");
      return;
    }

    try {
      await addMovie({
        tmdbId: movie.id,
        title: movie.title,
        year: new Date(movie.release_date).getFullYear(),
        description: movie.overview,
        imageUrl: getTMDBImageUrl(movie.poster_path),
        rating: movie.vote_average,
        userId: user.id
      });
      toast.success("Movie added to your list!");
    } catch (error) {
      toast.error("Failed to add movie");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Search Movies</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Movies</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            Search
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {searchResults.map((movie) => (
            <div key={movie.id} className="relative group">
              <Image src={getTMDBImageUrl(movie.poster_path)} alt={movie.title} className="w-full h-auto rounded-lg" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white">
                <h3 className="font-semibold text-center mb-2">{movie.title}</h3>
                <p className="text-sm mb-2">{new Date(movie.release_date).getFullYear()}</p>
                <p className="text-sm mb-4">Rating: {movie.vote_average.toFixed(1)}</p>
                <Button size="sm" onClick={() => handleAddMovie(movie)} className="w-full">
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

export default MovieSearchDialog;
