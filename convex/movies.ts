import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserMovies = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userMovies = await ctx.db
      .query("userMovies")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const movies = await Promise.all(
      userMovies.map(async (userMovie) => {
        const movie = await ctx.db.get(userMovie.movieId);
        return {
          ...userMovie,
          movie
        };
      })
    );

    return movies;
  }
});

export const updateUserMovieStatus = mutation({
  args: {
    userMovieId: v.id("userMovies"),
    status: v.string(),
    watchedAt: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userMovieId, status, watchedAt } = args;
    await ctx.db.patch(userMovieId, {
      status,
      ...(watchedAt && { watchedAt })
    });
  }
});
