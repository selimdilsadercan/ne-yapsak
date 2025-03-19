import { Card } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { MoreHorizontal, Star, Film } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "react-hot-toast";

interface MovieCardProps {
  movie: Doc<"movies">;
  userMovie: Doc<"userMovies">;
}

function MovieCard({ movie, userMovie }: MovieCardProps) {
  const updateStatus = useMutation(api.movies.updateUserMovieStatus);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({
        userMovieId: userMovie._id,
        status,
        watchedAt: status === "watched" ? Date.now() : undefined
      });
      toast.success("Durum güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  };

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-[2/3]">
        {movie.imageUrl ? (
          <img src={movie.imageUrl} alt={movie.title} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Film className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange("want_to_watch")}>İzleneceklere Ekle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("watching")}>İzliyorum</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("watched")}>İzledim</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-medium line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{movie.year}</span>
          {movie.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{movie.rating}</span>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(userMovie.addedAt, {
            addSuffix: true,
            locale: tr
          })}
        </div>
      </div>
    </Card>
  );
}

export { MovieCard };
