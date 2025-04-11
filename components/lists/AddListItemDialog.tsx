import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Film, Gamepad2, MapPin, Activity, Search } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MovieSearchDialog } from "./MovieSearchDialog";
import Image from "next/image";
import toast from "react-hot-toast";

// Define the item types and their properties
const itemTypes = [
  { id: "movies", label: "Movies", contentType: "movie", icon: Film },
  { id: "series", label: "Series", contentType: "series", icon: Film },
  { id: "games", label: "Games", contentType: "game", icon: Gamepad2 },
  { id: "places", label: "Places", contentType: "place", icon: MapPin },
  { id: "activities", label: "Activities", contentType: "activity", icon: Activity }
];

interface AddListItemDialogProps {
  listId: Id<"lists">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddListItemDialog({ listId, open, onOpenChange }: AddListItemDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(itemTypes[0].id);

  // Query items based on type and search term
  const movies = useQuery(api.movies.getAllMovies) || [];
  const filteredMovies = movies.filter(
    (movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()) || movie.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItemToList = useMutation(api.lists.addItemToList);
  const handleAddItem = async (item: { _id: Id<"movies" | "series" | "games" | "places" | "activities"> }, type: string) => {
    try {
      await addItemToList({
        listId,
        itemId: item._id,
        itemType: type,
        notes: ""
      });
      toast.success("Item added to list");
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to add item to list: ${error}`);
    }
  };

  // Empty state component
  const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
    <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No items found</h3>
      <p className="text-muted-foreground">
        {searchTerm ? `No results found for "${searchTerm}". Try a different search term.` : "No items available in this category yet."}
      </p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[600px] overflow-y-auto sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] w-[95vw]">
        <DialogHeader>
          <DialogTitle>Add Item to List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2 mb-4">
            <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
            <MovieSearchDialog listId={listId} />
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="w-full justify-start">
              {itemTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="movies" className="mt-4">
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredMovies.map((movie) => (
                    <div key={movie._id} className="group bg-card hover:bg-accent rounded-lg overflow-hidden transition-colors">
                      {/* Movie Poster */}
                      <div className="relative aspect-[2/3]">
                        <Image
                          src={movie.imageUrl || "/placeholder.png"}
                          alt={movie.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>

                      {/* Movie Info */}
                      <div className="p-4 space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">{movie.title}</h3>
                          <div className="flex items-center gap-3 text-muted-foreground">
                            <p className="text-sm">{movie.year}</p>
                            {movie.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-yellow-400">★</span>
                                <span className="text-sm">{movie.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          {movie.description && <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>}
                        </div>

                        {/* Add Button */}
                        <Button size="sm" onClick={() => handleAddItem(movie, "movie")} variant="secondary" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add to List
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState searchTerm={searchTerm} />
              )}
            </TabsContent>

            {/* Other tab contents will be added here */}
            <TabsContent value="series" className="mt-4">
              <EmptyState searchTerm={searchTerm} />
            </TabsContent>

            <TabsContent value="games" className="mt-4">
              <EmptyState searchTerm={searchTerm} />
            </TabsContent>

            <TabsContent value="places" className="mt-4">
              <EmptyState searchTerm={searchTerm} />
            </TabsContent>

            <TabsContent value="activities" className="mt-4">
              <EmptyState searchTerm={searchTerm} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
