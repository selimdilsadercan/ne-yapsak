import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserSeries = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userSeries = await ctx.db
      .query("userSeries")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const series = await Promise.all(
      userSeries.map(async (userSerie) => {
        const serie = await ctx.db.get(userSerie.seriesId);
        return {
          ...userSerie,
          series: serie
        };
      })
    );

    return series;
  }
});

export const updateUserSeriesStatus = mutation({
  args: {
    userSeriesId: v.id("userSeries"),
    status: v.string(),
    watchedAt: v.optional(v.number()),
    currentSeason: v.optional(v.number()),
    currentEpisode: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userSeriesId, status, watchedAt, currentSeason, currentEpisode } = args;
    await ctx.db.patch(userSeriesId, {
      status,
      ...(watchedAt && { watchedAt }),
      ...(currentSeason && { currentSeason }),
      ...(currentEpisode && { currentEpisode })
    });
  }
});

// Admin functions
export const getAllSeries = query({
  handler: async (ctx) => {
    return await ctx.db.query("series").collect();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    backdropUrl: v.optional(v.string()),
    imdbId: v.optional(v.string()),
    tmdbId: v.number(),
    rating: v.optional(v.number()),
    voteCount: v.optional(v.number()),
    genres: v.array(v.string()),
    status: v.string(),
    firstAirDate: v.number(),
    numberOfSeasons: v.number(),
    totalSeasons: v.number(),
    numberOfEpisodes: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("series", args);
  }
});

export const update = mutation({
  args: {
    id: v.id("series"),
    name: v.string(),
    description: v.optional(v.string()),
    posterUrl: v.optional(v.string()),
    backdropUrl: v.optional(v.string()),
    imdbId: v.optional(v.string()),
    tmdbId: v.number(),
    rating: v.optional(v.number()),
    voteCount: v.optional(v.number()),
    genres: v.array(v.string()),
    status: v.string(),
    firstAirDate: v.number(),
    numberOfSeasons: v.number(),
    totalSeasons: v.number(),
    numberOfEpisodes: v.number()
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const deleteSeries = mutation({
  args: {
    id: v.id("series")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("series").collect();
  }
});

export const getById = query({
  args: { id: v.id("series") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

export const getByTmdbId = query({
  args: { tmdbId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("series")
      .filter((q) => q.eq(q.field("tmdbId"), args.tmdbId))
      .first();
  }
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const series = await ctx.db
      .query("series")
      .filter((q) => q.or(q.eq(q.field("name"), args.query), q.eq(q.field("description"), args.query)))
      .take(10);
    return series;
  }
});
