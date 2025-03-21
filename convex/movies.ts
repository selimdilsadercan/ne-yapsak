import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getUserMovies = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // First get the Convex user ID from Clerk ID
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();

    if (!user) {
      return [];
    }

    const userMovies = await ctx.db
      .query("userMovies")
      .filter((q) => q.eq(q.field("userId"), user._id))
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

export const addMovieFromTMDB = mutation({
  args: {
    tmdbId: v.number(),
    title: v.string(),
    year: v.number(),
    duration: v.number(),
    imageUrl: v.string(),
    rating: v.number(),
    genres: v.array(v.string()),
    description: v.optional(v.string()),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    // First get the Convex user ID from Clerk ID
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if movie already exists by TMDB ID or title
    const existingMovie = await ctx.db
      .query("movies")
      .filter((q) => q.or(q.eq(q.field("tmdbId"), args.tmdbId), q.eq(q.field("title"), args.title)))
      .first();

    let movieId: Id<"movies">;

    if (!existingMovie) {
      // Insert new movie
      movieId = await ctx.db.insert("movies", {
        tmdbId: args.tmdbId,
        title: args.title,
        duration: args.duration,
        genres: args.genres,
        imageUrl: args.imageUrl,
        rating: args.rating,
        year: args.year,
        description: args.description
      });
    } else {
      // Update existing movie with TMDB data if it doesn't have tmdbId
      if (!existingMovie.tmdbId) {
        await ctx.db.patch(existingMovie._id, {
          tmdbId: args.tmdbId,
          duration: args.duration,
          imageUrl: args.imageUrl,
          rating: args.rating,
          year: args.year,
          genres: args.genres,
          description: args.description
        });
      }
      movieId = existingMovie._id;
    }

    // Check if user already has this movie
    const existingUserMovie = await ctx.db
      .query("userMovies")
      .filter((q) => q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("movieId"), movieId)))
      .first();

    if (!existingUserMovie) {
      // Add movie to user's list
      const now = Date.now();
      await ctx.db.insert("userMovies", {
        userId: user._id,
        movieId,
        status: "want_to_watch",
        createdAt: now,
        updatedAt: now
      });
    }

    return { success: true };
  }
});

// Admin functions
export const getAllMovies = query({
  handler: async (ctx) => {
    return await ctx.db.query("movies").collect();
  }
});

export const createMovie = mutation({
  args: {
    title: v.string(),
    duration: v.number(),
    genres: v.array(v.string()),
    imageUrl: v.string(),
    rating: v.number(),
    tmdbId: v.number(),
    year: v.number(),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("movies", args);
  }
});

export const updateMovie = mutation({
  args: {
    id: v.id("movies"),
    title: v.string(),
    duration: v.number(),
    genres: v.array(v.string()),
    imageUrl: v.string(),
    rating: v.number(),
    tmdbId: v.number(),
    year: v.number(),
    description: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const deleteMovie = mutation({
  args: {
    id: v.id("movies")
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  }
});

export const search = query({
  args: {
    query: v.string()
  },
  handler: async (ctx, args) => {
    const movies = await ctx.db
      .query("movies")
      .filter((q) => q.eq(q.field("title"), args.query))
      .take(10);

    return movies;
  }
});
