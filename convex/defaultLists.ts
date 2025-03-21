import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

interface WatchItem {
  id: Id<any>;
  title: string;
  description?: string;
  imageUrl: string;
  type: "movie" | "series";
  rating?: number;
  year?: number;
}

interface GameItem {
  id: Id<any>;
  title: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  year: number;
}

interface PlaceItem {
  id: Id<any>;
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  city: string;
  country: string;
}

interface EventItem {
  id: Id<any>;
  name: string;
  description?: string;
  iconName: string;
  contentType: string;
  imageUrl?: string;
}

interface ActivityItem {
  id: Id<any>;
  name: string;
  description?: string;
  iconName: string;
  contentType: string;
  imageUrl?: string;
  category: string;
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

export const getSuggestedWatches = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const items: WatchItem[] = [];

    // Get all movies and series
    const [movies, series] = await Promise.all([ctx.db.query("movies").collect(), ctx.db.query("series").collect()]);

    // Transform movies and series to WatchItem format
    items.push(
      ...movies.map((movie) => ({
        id: movie._id,
        title: movie.title,
        description: movie.description,
        imageUrl: movie.imageUrl,
        type: "movie" as const,
        rating: movie.rating,
        year: movie.year
      }))
    );

    items.push(
      ...series.map((show) => ({
        id: show._id,
        title: show.name,
        description: show.description,
        imageUrl: show.posterUrl || "",
        type: "series" as const,
        rating: show.rating,
        year: show.firstAirDate
      }))
    );

    // Shuffle and limit the results
    return shuffleArray(items).slice(0, limit);
  }
});

export const getSuggestedGames = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const games = await ctx.db.query("games").collect();

    // Shuffle and transform games
    return shuffleArray(games)
      .slice(0, limit)
      .map((game) => ({
        id: game._id,
        title: game.title,
        description: game.description,
        imageUrl: game.imageUrl,
        rating: game.rating,
        year: game.year
      }));
  }
});

export const getSuggestedPlaces = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const places = await ctx.db.query("places").collect();

    // Shuffle and transform places
    return shuffleArray(places)
      .slice(0, limit)
      .map((place) => ({
        id: place._id,
        name: place.name,
        description: place.description,
        imageUrl: place.imageUrl,
        rating: place.rating,
        city: place.city,
        country: place.country
      }));
  }
});

export const getSuggestedEvents = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_category", (q) => q.eq("category", "Bir Etkinliğe Gitmek"))
      .collect();

    // Shuffle and transform events
    return shuffleArray(activities)
      .slice(0, limit)
      .map((activity) => ({
        id: activity._id,
        name: activity.name,
        description: activity.description,
        iconName: activity.iconName,
        contentType: activity.contentType,
        imageUrl: activity.imageUrl
      }));
  }
});

export const getSuggestedActivities = query({
  args: {
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const activities = await ctx.db.query("activities").collect();

    // Shuffle and transform activities
    return shuffleArray(activities)
      .slice(0, limit)
      .map((activity) => ({
        id: activity._id,
        name: activity.name,
        description: activity.description,
        iconName: activity.iconName,
        contentType: activity.contentType,
        imageUrl: activity.imageUrl,
        category: activity.category
      }));
  }
});
