"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoadScript } from "@react-google-maps/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlaceSearchDialogProps {
  userId: string;
}

export function PlaceSearchDialog({ userId }: PlaceSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<google.maps.places.PlaceResult[]>([]);
  const addPlace = useMutation(api.places.addPlaceFromGoogle);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"]
  });

  const handleSearch = async () => {
    if (!isLoaded || !query.trim()) return;

    setSearching(true);
    const service = new google.maps.places.PlacesService(document.createElement("div"));

    service.textSearch(
      {
        query: query.trim()
      },
      (results, status) => {
        setSearching(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setResults(results);
        } else {
          toast.error("Arama sırasında bir hata oluştu");
        }
      }
    );
  };

  const handleAddPlace = async (place: google.maps.places.PlaceResult) => {
    if (!place.place_id) return;

    try {
      await addPlace({
        googlePlaceId: place.place_id,
        name: place.name || "",
        address: place.formatted_address || "",
        rating: place.rating || 0,
        imageUrl: place.photos?.[0]?.getUrl() || "",
        type: place.types?.[0] || "other",
        userId
      });
      toast.success("Mekan başarıyla eklendi");
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to add place: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Google Maps yüklenemedi. Lütfen daha sonra tekrar deneyin.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!isLoaded}>
          <Search className="w-4 h-4 mr-2" />
          Mekan Ara
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mekan Ara</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Mekan adı veya adresi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching || !isLoaded}>
              Ara
            </Button>
          </div>
          {!isLoaded && (
            <Alert>
              <AlertDescription>Google Maps yükleniyor...</AlertDescription>
            </Alert>
          )}
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {results.map((place) => (
              <div key={place.place_id} className="flex items-start justify-between p-2 hover:bg-muted rounded-lg group">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{place.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{place.formatted_address}</p>
                  {place.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-yellow-500">{place.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({place.user_ratings_total} değerlendirme)</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => handleAddPlace(place)}>
                  Ekle
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
