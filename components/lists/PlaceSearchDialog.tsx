"use client";

import { useState, useRef } from "react";
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
  const mapRef = useRef<HTMLDivElement>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"]
  });

  const handleSearch = async () => {
    if (!isLoaded || !query.trim()) return;

    setSearching(true);
    try {
      if (!mapRef.current) {
        throw new Error("Map reference not found");
      }

      const service = new google.maps.places.PlacesService(mapRef.current);

      service.textSearch(
        {
          query: query.trim()
        },
        (results, status) => {
          setSearching(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setResults(results);
          } else {
            toast.error("Failed to search places");
          }
        }
      );
    } catch (error) {
      setSearching(false);
      toast.error("Failed to initialize search");
      console.error(error);
    }
  };

  const handleAddPlace = async (place: google.maps.places.PlaceResult) => {
    if (!place.place_id) {
      toast.error("Invalid place selected");
      return;
    }

    try {
      if (!mapRef.current) {
        throw new Error("Map reference not found");
      }

      const service = new google.maps.places.PlacesService(mapRef.current);

      // Get detailed place information
      service.getDetails(
        {
          placeId: place.place_id,
          fields: ["name", "formatted_address", "rating", "photos", "types", "geometry", "address_components"]
        },
        async (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            try {
              // Extract city and country from address components
              const addressComponents = result.address_components || [];
              let city = "";
              let country = "";

              for (const component of addressComponents) {
                const typedComponent = component as google.maps.GeocoderAddressComponent;
                if (typedComponent.types.includes("locality") || typedComponent.types.includes("administrative_area_level_1")) {
                  city = typedComponent.long_name ?? "";
                }
                if (typedComponent.types.includes("country")) {
                  country = typedComponent.long_name ?? "";
                }
              }
              await addPlace({
                googlePlaceId: place.place_id!,
                name: result.name || "",
                address: result.formatted_address || "",
                rating: result.rating || 0,
                imageUrl: result.photos?.[0]?.getUrl() || "",
                type: result.types?.[0] || "other",
                userId,
                city,
                country,
                latitude: result.geometry?.location?.lat() || 0,
                longitude: result.geometry?.location?.lng() || 0
              });
              toast.success("Place added successfully");
              setOpen(false);
            } catch (error) {
              toast.error(`Failed to add place: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
            }
          } else {
            toast.error("Failed to get place details");
          }
        }
      );
    } catch (error) {
      toast.error("Failed to initialize place service");
      console.error(error);
    }
  };

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load Google Maps. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!isLoaded}>
          <Search className="w-4 h-4 mr-2" />
          Search Places
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Places</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search for places..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching || !isLoaded}>
              Search
            </Button>
          </div>
          {!isLoaded && (
            <Alert>
              <AlertDescription>Loading Google Maps...</AlertDescription>
            </Alert>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((place) => (
              <div key={place.place_id} className="flex items-start justify-between p-3 hover:bg-muted rounded-lg group">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{place.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{place.formatted_address}</p>
                  {place.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-yellow-500">{place.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({place.user_ratings_total} ratings)</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => handleAddPlace(place)}>
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Hidden div for Google Maps service */}
        <div ref={mapRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
