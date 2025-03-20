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
