import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get user's games
export const getUserGames = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userGames = await ctx.db
      .query("userGames")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
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

// Add a game from RAWG
export const addGameFromRAWG = mutation({
  args: {
    rawgId: v.number(),
    title: v.string(),
    year: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    rating: v.number(),
    metacritic: v.union(v.number(), v.null()),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    // Check if game already exists
    const existingGame = await ctx.db
      .query("games")
      .withIndex("by_rawg_id", (q) => q.eq("rawgId", args.rawgId))
      .first();

    let gameId: Id<"games">;

    if (existingGame) {
      gameId = existingGame._id;
    } else {
      // Create new game
      gameId = await ctx.db.insert("games", {
        rawgId: args.rawgId,
        title: args.title,
        year: args.year,
        description: args.description,
        imageUrl: args.imageUrl,
        rating: args.rating,
        metacritic: args.metacritic
      });
    }

    // Check if user already has this game
    const existingUserGame = await ctx.db
      .query("userGames")
      .withIndex("by_user_and_game", (q) => q.eq("userId", args.userId).eq("gameId", gameId))
      .first();

    if (existingUserGame) {
      throw new Error("Game already in your list");
    }

    // Add to user's games
    return await ctx.db.insert("userGames", {
      userId: args.userId,
      gameId,
      status: "want_to_play",
      addedAt: Date.now()
    });
  }
});

// Update user game status
export const updateUserGameStatus = mutation({
  args: {
    userGameId: v.id("userGames"),
    status: v.string(),
    playedAt: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userGameId, status, playedAt } = args;
    await ctx.db.patch(userGameId, {
      status,
      ...(playedAt && { playedAt })
    });
  }
});

// Remove game from user's list
export const removeUserGame = mutation({
  args: {
    userGameId: v.id("userGames")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userGameId);
  }
});

// Admin functions
export const getAllGames = query({
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  }
});

export const createGame = mutation({
  args: {
    rawgId: v.number(),
    title: v.string(),
    year: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    rating: v.number(),
    metacritic: v.union(v.number(), v.null())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("games", args);
  }
});

export const updateGame = mutation({
  args: {
    id: v.id("games"),
    rawgId: v.number(),
    title: v.string(),
    year: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    rating: v.number(),
    metacritic: v.union(v.number(), v.null())
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const deleteGame = mutation({
  args: {
    id: v.id("games")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});
