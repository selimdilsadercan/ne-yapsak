import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const createSeries = mutation({
  args: {
    title: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    genres: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.string(),
    totalSeasons: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("series", args);
  }
});

export const updateSeries = mutation({
  args: {
    id: v.id("series"),
    title: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    genres: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.string(),
    totalSeasons: v.number()
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
