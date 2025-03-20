"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Film, Search, Plus, Star } from "lucide-react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export default function MoviesPage() {
  const movies = useQuery(api.movies.getAllMovies);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
          <p className="text-muted-foreground">Manage movies in your database.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Movie
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Movie List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search movies..." className="pl-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {movies?.map((movie: Doc<"movies">) => (
              <Card key={movie._id} className="overflow-hidden">
                <div className="relative aspect-[2/3]">
                  <Image src={movie.imageUrl || "/placeholder.png"} alt={movie.title} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                      <span className="text-sm text-muted-foreground">{movie.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{movie.rating?.toFixed(1) || "N/A"}</span>
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
