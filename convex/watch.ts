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

export const getWatches = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.union(v.literal("movie"), v.literal("series")))
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const items: WatchItem[] = [];

    // Get movies if type is not specified or is "movie"
    if (!args.type || args.type === "movie") {
      const movies = await ctx.db.query("movies").order("desc").take(limit);

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
    }

    // Get series if type is not specified or is "series"
    if (!args.type || args.type === "series") {
      const series = await ctx.db.query("series").order("desc").take(limit);

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
    }

    // Shuffle and limit the combined results
    const shuffled = items.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }
});
