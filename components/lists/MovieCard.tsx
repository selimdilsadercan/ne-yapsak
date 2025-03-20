"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bookmark } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface MovieCardProps {
  movie: Doc<"movies">;
  userMovie: Doc<"userMovies">;
}

export function MovieCard({ movie, userMovie }: MovieCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateStatus = useMutation(api.movies.updateUserMovieStatus);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({
        userMovieId: userMovie._id,
        status,
        watchedAt: status === "watched" ? Date.now() : undefined
      });
      toast.success("Film durumu güncellendi");
    } catch (error) {
      toast.error(`Failed to update movie status: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden">
      {/* Movie Poster */}
      <div className="absolute inset-0">
        <Image
          src={movie.imageUrl || "/placeholder-movie.jpg"}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white line-clamp-1">{movie.title}</h3>
            <span className="text-sm text-white/80">({movie.year})</span>
          </div>

          {movie.rating && (
            <div className="flex items-center gap-1">
              <span className="bg-yellow-400 text-black text-xs font-bold px-1 rounded">IMDb</span>
              <span className="text-sm text-white">{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {movie.description && <p className="text-sm text-white/80 line-clamp-3">{movie.description}</p>}
        </div>

        {/* Status Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-gradient-to-t from-black to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange("want_to_watch")}
              className={`text-xs px-2 py-1 rounded ${
                userMovie.status === "want_to_watch" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              İzlenecek
            </button>
            <button
              onClick={() => handleStatusChange("watching")}
              className={`text-xs px-2 py-1 rounded ${userMovie.status === "watching" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              İzleniyor
            </button>
            <button
              onClick={() => handleStatusChange("watched")}
              className={`text-xs px-2 py-1 rounded ${userMovie.status === "watched" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              İzlendi
            </button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Filmi listeden kaldır</AlertDialogTitle>
            <AlertDialogDescription>Bu filmi listenizden kaldırmak istediğinize emin misiniz?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowDeleteDialog(false)}>Kaldır</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
