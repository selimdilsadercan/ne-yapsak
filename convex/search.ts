import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchMovies = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.or(q.eq(q.field("title"), args.query), q.eq(q.field("description"), args.query), q.eq(q.field("year"), parseInt(args.query))))
      .take(10);

    return movies;
  }
});

export const searchSeries = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const series = await ctx.db
      .query("series")
      .filter((q) => q.or(q.eq(q.field("name"), args.query), q.eq(q.field("description"), args.query)))
      .take(10);

    return series;
  }
});

export const searchGames = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const games = await ctx.db
      .query("games")
      .withIndex("by_rawg_id")
      .filter((q) => q.or(q.eq(q.field("title"), args.query), q.eq(q.field("description"), args.query)))
      .take(10);

    // Sort games by metacritic score in memory
    return [...games].sort((a, b) => {
      const metacriticA = typeof a.metacritic === "number" ? a.metacritic : 0;
      const metacriticB = typeof b.metacritic === "number" ? b.metacritic : 0;
      return metacriticB - metacriticA;
    });
  }
});

export const searchPlaces = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const places = await ctx.db
      .query("places")
      .filter((q) =>
        q.or(
          q.eq(q.field("name"), args.query),
          q.eq(q.field("description"), args.query),
          q.eq(q.field("address"), args.query),
          q.eq(q.field("city"), args.query)
        )
      )
      .take(10);

    return places;
  }
});

export const searchActivities = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.or(q.eq(q.field("name"), args.query), q.eq(q.field("description"), args.query), q.eq(q.field("category"), args.query)))
      .take(10);

    return activities;
  }
});
