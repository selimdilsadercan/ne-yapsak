"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from "@/components/lists/MovieCard";
import { EmptyState } from "@/components/EmptyState";
import { Doc } from "@/convex/_generated/dataModel";

interface MovieListProps {
  userId?: string;
}

type UserMovieWithMovie = Doc<"userMovies"> & {
  movie: Doc<"movies">;
};

function MovieList({ userId }: MovieListProps) {
  const userMovies = useQuery(api.movies.getUserMovies, {
    userId: userId ?? ""
  }) as UserMovieWithMovie[] | undefined;

  if (!userId) {
    return <EmptyState message="Listelerini görmek için giriş yapmalısın" />;
  }

  if (!userMovies) {
    return <div className="h-[200px] flex items-center justify-center">Yükleniyor...</div>;
  }

  const watchlist = userMovies.filter((m: UserMovieWithMovie) => m.status === "want_to_watch");
  const watching = userMovies.filter((m: UserMovieWithMovie) => m.status === "watching");
  const watched = userMovies.filter((m: UserMovieWithMovie) => m.status === "watched");

  return (
    <div className="space-y-6">
      {watchlist.length === 0 ? (
        <EmptyState message="İzlemek istediğin filmleri buraya ekleyebilirsin" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchlist.map((item: UserMovieWithMovie) => (
            <MovieCard key={item._id} movie={item.movie} userMovie={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export { MovieList };
