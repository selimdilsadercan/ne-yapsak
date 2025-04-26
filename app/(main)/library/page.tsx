"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "@/components/EmptyState";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

// Define types for the data we're working with
type UserMovie = Doc<"userMovies"> & {
  movie: Doc<"movies"> | null;
};

type UserSeries = Doc<"userSeries"> & {
  series: Doc<"series"> | null;
};

type UserGame = Doc<"userGames"> & {
  game: Doc<"games"> | null;
};

type UserPlace = Doc<"userPlaces"> & {
  place: Doc<"places"> | null;
};

type ItemType = "movie" | "series" | "game" | "place" | "event" | "standup" | "board game" | "activity" | "video";

// Define the unified item type
type UnifiedItem = {
  _id: string;
  title: string;
  imageUrl: string;
  year?: number;
  rating?: number;
  type: ItemType;
  description?: string;
};

// Sample data for popular items
const popularItems = {
  movies: [
    {
      _id: "movie1",
      title: "Inception",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
      year: 2010,
      rating: 8.8,
      type: "movie" as const,
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
      _id: "movie2",
      title: "The Shawshank Redemption",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
      year: 1994,
      rating: 9.3,
      type: "movie" as const,
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
    }
  ],
  series: [
    {
      _id: "series1",
      title: "Breaking Bad",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
      year: 2008,
      rating: 9.5,
      type: "series" as const,
      description: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student to secure his family's financial future."
    },
    {
      _id: "series2",
      title: "The Crown",
      imageUrl: "https://m.media-amazon.com/images/M/MV5BZmY0MzBlNjctNTRmNy00Njk3LWFjMzctMWQwZDAwMGJmY2MyXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
      year: 2016,
      rating: 8.7,
      type: "series" as const,
      description:
        "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century."
    }
  ],
  games: [
    {
      _id: "game1",
      title: "The Legend of Zelda: Breath of the Wild",
      imageUrl:
        "https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58",
      year: 2017,
      rating: 9.7,
      type: "game" as const,
      description: "Step into a world of discovery, exploration, and adventure in this open-air adventure game."
    },
    {
      _id: "game2",
      title: "Red Dead Redemption 2",
      imageUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202202/2816/mYn2ETBKFct26V9mJnZi4aSS.png",
      year: 2018,
      rating: 9.6,
      type: "game" as const,
      description: "An epic tale of life in America's unforgiving heartland."
    },
    {
      _id: "game3",
      title: "Bubble Trouble",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQEtQBGYK3NqY5YonpQFoPKAu7Ewcke4YbIA&s", // örnek görsel
      year: 2002,
      rating: 8.3,
      type: "game" as const,
      description: "Classic arcade-style web game where you pop bubbles with a harpoon while avoiding being hit."
    }
  ],
  places: [
    {
      _id: "place1",
      title: "Kronotrop Coffee Bar & Roastery",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
      type: "place" as const,
      rating: 4.8,
      description: "Specialty coffee roastery ve kahve barı. El yapımı tatlılar ve brunch menüsü ile modern bir mekan."
    },
    {
      _id: "place2",
      title: "Arcade İstanbul",
      imageUrl: "https://images.unsplash.com/photo-1511882150382-421056c89033",
      type: "place" as const,
      rating: 4.6,
      description: "Retro arcade oyunları, pinball makineleri ve modern konsol oyunlarıyla eğlenceli vakit geçirebileceğiniz mekan."
    },
    {
      _id: "place3",
      title: "Climb Time",
      imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851",
      type: "place" as const,
      rating: 4.7,
      description: "Profesyonel tırmanış duvarları ve boulder alanları ile her seviyeye uygun tırmanış deneyimi."
    },
    {
      _id: "place4",
      title: "Board & Brew",
      imageUrl: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09",
      type: "place" as const,
      rating: 4.5,
      description: "Yüzlerce kutu oyunu, özel kahve çeşitleri ve atıştırmalıklarla keyifli bir kafe deneyimi."
    },
    {
      _id: "place5",
      title: "VR Lab",
      imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac",
      type: "place" as const,
      rating: 4.4,
      description: "En son teknoloji VR ekipmanları ile sanal gerçeklik deneyimi yaşayabileceğiniz eğlence merkezi."
    }
  ],
  events: [
    {
      _id: "event2",
      title: "Fazıl Say - İstanbul Recitali",
      imageUrl: "https://media.timeout.com/images/105951721/750/422/image.jpg",
      year: 2024,
      type: "event" as const,
      rating: 4.9,
      description: "Dünyaca ünlü piyanist Fazıl Say'ın İstanbul'da vereceği özel konser, klasik müzik ve kendi bestelerinden oluşan repertuar."
    },
    {
      _id: "event3",
      title: "Hamlet - Devlet Tiyatroları",
      imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf",
      year: 2024,
      type: "event" as const,
      rating: 4.7,
      description: "Shakespeare'in ölümsüz eseri, modern bir yorumla Devlet Tiyatroları sahnesinde. Yönetmen: Can Yücel."
    },
    {
      _id: "event4",
      title: "La Traviata - DOB",
      imageUrl: "https://images.unsplash.com/photo-1580809361436-42a7ec204889",
      year: 2024,
      type: "event" as const,
      rating: 4.8,
      description: "Verdi'nin ünlü operası, Devlet Opera ve Balesi tarafından sahneleniyor. Muhteşem kostümler ve etkileyici performanslar."
    }
  ],
  videos: [
    {
      _id: "video1",
      title: "BATIL ROYALE #2 - YOUTUBERLAR SAVAŞI",
      imageUrl: "https://i.ytimg.com/vi/vVOXZI9Tg_Q/maxresdefault.jpg",
      year: 2024,
      rating: 4.8,
      type: "video" as const,
      description: "Soğuk Savaş'ın sunumuyla, Berkcan Güven ve 3Y1T'nin katılımıyla gerçekleşen eğlenceli bir YouTube şovu."
    }
  ],
  standups: [
    {
      _id: "standup2",
      title: "Deniz Göktaş - Selam Selam",
      imageUrl: "https://i.ytimg.com/vi/MLORi76oq4k/maxresdefault.jpg",
      year: 2023,
      rating: 4.7,
      type: "standup" as const,
      description: "Deniz Göktaş'ın ilk stand-up gösterisi. Günlük hayattan, ilişkilerden ve sosyal medyadan beslenen özgün bir performans."
    }
  ],
  boardGames: [
    {
      _id: "boardgame1",
      title: "Wingspan",
      imageUrl:
        "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/uIjeoKgHMcRtzRSR4MoUYl3nXxs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg",
      year: 2019,
      rating: 8.5,
      type: "board game" as const,
      description: "1-5 oyuncu için rekabetçi bir kuş koleksiyonu ve motor inşa etme oyunu."
    }
  ],
  activities: [
    {
      _id: "activity1",
      title: "Rock Climbing",
      imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851",
      type: "activity" as const,
      description: "Doğal veya yapay tırmanış duvarlarında kendinizi fiziksel ve zihinsel olarak zorlayın."
    }
  ]
};

function ListsPage() {
  const { user } = useUser();

  // Fetch all items
  const userMovies = useQuery(api.movies.getUserMovies, { userId: user?.id ?? "" }) as UserMovie[] | undefined;
  const userSeries = useQuery(api.series.getUserSeries, { userId: user?.id ?? "" }) as UserSeries[] | undefined;
  const userGames = useQuery(api.games.getUserGames, { userId: user?.id ?? "" }) as UserGame[] | undefined;
  const userPlaces = useQuery(api.places.getUserPlaces, { userId: user?.id ?? "" }) as UserPlace[] | undefined;

  if (!user) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">Please sign in</h3>
          <p className="text-sm text-muted-foreground">You need to sign in to view your lists.</p>
        </div>
      </div>
    );
  }

  // Transform all items into a unified format
  const allItems: UnifiedItem[] = [];

  // Add movies
  if (userMovies) {
    for (const movie of userMovies) {
      if (movie.movie) {
        allItems.push({
          _id: movie._id.toString(),
          title: movie.movie.title,
          imageUrl: movie.movie.imageUrl || "",
          year: movie.movie.year,
          rating: movie.movie.rating,
          type: "movie",
          description: movie.movie.description
        });
      }
    }
  }

  // Add series
  if (userSeries) {
    for (const series of userSeries) {
      if (series.series) {
        allItems.push({
          _id: series._id.toString(),
          title: series.series.name,
          imageUrl: series.series.posterUrl || "",
          // Series might not have a year property, so we'll omit it
          rating: series.series.rating,
          type: "series",
          description: series.series.description
        });
      }
    }
  }

  // Add games
  if (userGames) {
    for (const game of userGames) {
      if (game.game) {
        allItems.push({
          _id: game._id.toString(),
          title: game.game.title,
          imageUrl: game.game.imageUrl || "",
          year: game.game.year,
          rating: game.game.rating,
          type: "game",
          description: game.game.description
        });
      }
    }
  }

  // Add places
  if (userPlaces) {
    for (const place of userPlaces) {
      if (place.place) {
        allItems.push({
          _id: place._id.toString(),
          title: place.place.name,
          imageUrl: place.place.imageUrl || "",
          type: "place",
          description: place.place.description
        });
      }
    }
  }

  if (!allItems.length) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="text-lg font-medium">Henüz hiçbir şey eklemedin</h3>
          <p className="text-sm text-muted-foreground">Kitaplığına eklemek istediğin şeyleri keşfet sayfasından bulabilirsin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Kitaplığın</h1>
        <p className="text-muted-foreground">Tüm öğelerin ({allItems.length})</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allItems.map((item) => (
          <div key={item._id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function PopularPage() {
  // Get all items in a flat array
  const allItems = useMemo(() => {
    const items = Object.values(popularItems).flat();
    return shuffleArray(items);
  }, []);

  // Get unique types for filter
  const itemTypes = useMemo(() => {
    return Array.from(new Set(allItems.map((item) => item.type)));
  }, [allItems]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Filter items based on selected types
  const filteredItems = useMemo(() => {
    if (selectedTypes.length === 0) return allItems;
    return allItems.filter((item) => selectedTypes.includes(item.type));
  }, [allItems, selectedTypes]);

  const typeLabels: Record<string, string> = {
    "movie": "Filmler",
    "series": "Diziler",
    "game": "Oyunlar",
    "place": "Mekanlar",
    "event": "Etkinlikler",
    "standup": "Stand-up",
    "board game": "Kutu Oyunları",
    "activity": "Aktiviteler",
    "video": "Videolar"
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">My Wedos</h1>
          <p className="text-muted-foreground">İzlemek, oynamak ve keşfetmek istediklerinin listesi</p>
        </div>

        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              {selectedTypes.length === 0 ? "Tümü" : `${selectedTypes.length} filtre`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setSelectedTypes([])} className="justify-between">
              Tümü
              {selectedTypes.length === 0 && <span>✓</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {itemTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => {
                  setSelectedTypes((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)));
                }}
              >
                {typeLabels[type]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div key={item._id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bu filtrelere uygun öğe bulunamadı.</p>
        </div>
      )}
    </div>
  );
}

export default PopularPage;
