"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPin, Star } from "lucide-react";
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

interface PlaceCardProps {
  place: Doc<"places">;
  userPlace: Doc<"userPlaces">;
}

export function PlaceCard({ place, userPlace }: PlaceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateStatus = useMutation(api.places.updateUserPlaceStatus);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({
        userPlaceId: userPlace._id,
        status,
        visitDate: status === "visited" ? Date.now() : undefined
      });
      toast.success("Mekan durumu güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <div className="group relative aspect-video rounded-lg overflow-hidden">
      {/* Place Image */}
      <div className="absolute inset-0">
        {place.imageUrl ? (
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="space-y-1">
          <h3 className="font-semibold text-white line-clamp-1">{place.name}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{place.address}</p>

          {place.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-white">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Status Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-gradient-to-t from-black to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange("want_to_visit")}
              className={`text-xs px-2 py-1 rounded ${
                userPlace.status === "want_to_visit" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Gidilecek
            </button>
            <button
              onClick={() => handleStatusChange("visiting")}
              className={`text-xs px-2 py-1 rounded ${userPlace.status === "visiting" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              Gidiliyor
            </button>
            <button
              onClick={() => handleStatusChange("visited")}
              className={`text-xs px-2 py-1 rounded ${userPlace.status === "visited" ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              Gidildi
            </button>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mekanı listeden kaldır</AlertDialogTitle>
            <AlertDialogDescription>Bu mekanı listenizden kaldırmak istediğinize emin misiniz?</AlertDialogDescription>
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
