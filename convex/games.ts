import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserGames = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userGames = await ctx.db
      .query("userGames")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const games = await Promise.all(
      userGames.map(async (userGame) => {
        const game = await ctx.db.get(userGame.gameId);
        return {
          ...userGame,
          game
        };
      })
    );

    return games;
  }
});

export const updateUserGameStatus = mutation({
  args: {
    userGameId: v.id("userGames"),
    status: v.string(),
    completedAt: v.optional(v.number()),
    playtime: v.optional(v.number()),
    rating: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userGameId, status, completedAt, playtime, rating } = args;
    await ctx.db.patch(userGameId, {
      status,
      ...(completedAt && { completedAt }),
      ...(playtime && { playtime }),
      ...(rating && { rating })
    });
  }
});
