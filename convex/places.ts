import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserPlaces = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userPlaces = await ctx.db
      .query("userPlaces")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const places = await Promise.all(
      userPlaces.map(async (userPlace) => {
        const place = await ctx.db.get(userPlace.placeId);
        return {
          ...userPlace,
          place
        };
      })
    );

    return places;
  }
});

export const updateUserPlaceStatus = mutation({
  args: {
    userPlaceId: v.id("userPlaces"),
    status: v.string(),
    visitedAt: v.optional(v.number()),
    rating: v.optional(v.number()),
    review: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userPlaceId, status, visitedAt, rating, review } = args;
    await ctx.db.patch(userPlaceId, {
      status,
      ...(visitedAt && { visitedAt }),
      ...(rating && { rating }),
      ...(review && { review })
    });
  }
});
