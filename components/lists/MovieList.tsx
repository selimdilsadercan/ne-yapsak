"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from "./MovieCard";
import { EmptyState } from "@/components/EmptyState";
import { Doc } from "@/convex/_generated/dataModel";

interface MovieListProps {
  userId: string;
}

type UserMovieWithMovie = Doc<"userMovies"> & {
  movie: Doc<"movies">;
};

export function MovieList({ userId }: MovieListProps) {
  const userMovies = useQuery(api.movies.getUserMovies, { userId });

  if (!userId) {
    return <EmptyState message="Filmleri görmek için giriş yapın" />;
  }

  if (!userMovies?.length) {
    return <EmptyState message="Henüz film eklenmemiş" />;
  }

  const watchlist = userMovies.filter((m) => m.status === "want_to_watch" && m.movie);
  const watching = userMovies.filter((m) => m.status === "watching" && m.movie);
  const watched = userMovies.filter((m) => m.status === "watched" && m.movie);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="watchlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="watchlist">İzlenecek ({watchlist.length})</TabsTrigger>
          <TabsTrigger value="watching">İzleniyor ({watching.length})</TabsTrigger>
          <TabsTrigger value="watched">İzlendi ({watched.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="watchlist">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {watchlist.map((userMovie) => (
              <MovieCard key={userMovie._id} movie={userMovie.movie!} userMovie={userMovie} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="watching">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {watching.map((userMovie) => (
              <MovieCard key={userMovie._id} movie={userMovie.movie!} userMovie={userMovie} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="watched">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {watched.map((userMovie) => (
              <MovieCard key={userMovie._id} movie={userMovie.movie!} userMovie={userMovie} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
