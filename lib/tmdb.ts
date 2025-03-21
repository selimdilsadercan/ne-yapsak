const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export async function searchMovies(query: string): Promise<TMDBSearchResponse> {
  const response = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  return response.json();
}

export function getTMDBImageUrl(path: string | null, size: "w500" | "original" = "w500"): string {
  if (!path) {
    return "";
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
