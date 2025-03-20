const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || "";
const RAWG_BASE_URL = "https://api.rawg.io/api";

export interface RAWGGame {
  id: number;
  name: string;
  background_image: string;
  released: string;
  rating: number;
  ratings_count: number;
  description: string;
  metacritic: number;
}

export interface RAWGSearchResponse {
  count: number;
  results: RAWGGame[];
}

export async function searchGames(query: string): Promise<RAWGSearchResponse> {
  const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=9`);

  if (!response.ok) {
    throw new Error("Failed to search games");
  }

  return response.json();
}

export function getRAWGImageUrl(url: string | null): string {
  if (!url) return "/placeholder-game.jpg";
  return url;
}
