"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Gamepad2, Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface GameCardProps {
  userGame: Doc<"userGames"> & {
    game: Doc<"games">;
  };
  onUpdate: () => void;
}

export function GameCard({ userGame, onUpdate }: GameCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateStatus = useMutation(api.games.updateUserGameStatus);
  const removeGame = useMutation(api.games.removeUserGame);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({
        userGameId: userGame._id,
        status,
        playedAt: status === "completed" ? Date.now() : undefined
      });
      toast.success("Oyun durumu güncellendi");
      onUpdate();
    } catch (error) {
      toast.error(`Failed to update game status: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  const handleDelete = async () => {
    try {
      await removeGame({ userGameId: userGame._id });
      toast.success("Oyun listenizden kaldırıldı");
      onUpdate();
    } catch (error) {
      toast.error(`Failed to remove game: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  return (
    <div className="group relative h-[280px] rounded-lg overflow-hidden">
      {/* Game Cover */}
      <div className="absolute inset-0">
        <Image
          src={userGame.game.imageUrl || "/placeholder.png"}
          alt={userGame.game.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Game Icon */}
      <div className="absolute top-2 left-2 z-10">
        <Gamepad2 className="w-5 h-5 text-primary" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white line-clamp-1">{userGame.game.title}</h3>
            <span className="text-sm text-white/80">({userGame.game.year})</span>
          </div>

          <div className="flex items-center gap-2">
            {typeof userGame.game.rating === "number" && userGame.game.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{userGame.game.rating.toFixed(1)}</span>
              </div>
            )}
            {userGame.game.metacritic && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  userGame.game.metacritic >= 75 ? "bg-green-500" : userGame.game.metacritic >= 50 ? "bg-yellow-500" : "bg-red-500"
                }`}
              >
                {userGame.game.metacritic}
              </span>
            )}
          </div>
        </div>

        {/* Status Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange("want_to_play")}
              className={`text-xs px-2 py-1 rounded ${
                userGame.status === "want_to_play" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Oynanacak
            </button>
            <button
              onClick={() => handleStatusChange("playing")}
              className={`text-xs px-2 py-1 rounded ${userGame.status === "playing" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              Oynanıyor
            </button>
            <button
              onClick={() => handleStatusChange("completed")}
              className={`text-xs px-2 py-1 rounded ${userGame.status === "completed" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              Tamamlandı
            </button>
          </div>

          {/* Delete Button */}
          <div className="flex justify-end">
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <button className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Oyunu listeden kaldır</AlertDialogTitle>
                  <AlertDialogDescription>Bu oyunu listenizden kaldırmak istediğinize emin misiniz?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Kaldır</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
