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

export const seedMovies = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const movies = [
      {
        title: "Incendies",
        year: 2010,
        rating: 8.3,
        imageUrl: "https://example.com/incendies.jpg",
        description: "A mother's last wishes send twins Jeanne and Simon on a journey to Middle East in search of their tangled roots.",
        genres: ["Drama", "Mystery", "War"],
        duration: 131
      },
      {
        title: "Anora",
        year: 2024,
        rating: 7.6,
        imageUrl: "https://example.com/anora.jpg",
        description: "A young escort from Brooklyn meets and impulsively marries the son of a Russian immigrant.",
        genres: ["Drama"],
        duration: 120
      },
      {
        title: "The Devil's Advocate",
        year: 1997,
        rating: 7.5,
        imageUrl: "https://example.com/devils-advocate.jpg",
        description: "Aspiring Florida defense lawyer Kevin Lomax accepts a job at a New York law firm.",
        genres: ["Drama", "Mystery", "Thriller"],
        duration: 144
      },
      {
        title: "Bonnie and Clyde",
        year: 1967,
        rating: 7.7,
        imageUrl: "https://example.com/bonnie-and-clyde.jpg",
        description: "In the 1930s, bored waitress Bonnie Parker falls in love with an ex-con named Clyde Barrow.",
        genres: ["Biography", "Crime", "Drama"],
        duration: 111
      },
      {
        title: "Saving Private Ryan",
        year: 1998,
        rating: 8.6,
        imageUrl: "https://example.com/saving-private-ryan.jpg",
        description: "As U.S. troops storm the beaches of Normandy, three brothers lie dead on the battlefield, with a fourth trapped behind enemy lines.",
        genres: ["Drama", "War"],
        duration: 169
      },
      {
        title: "Kingdom of Heaven",
        year: 2005,
        rating: 7.3,
        imageUrl: "https://example.com/kingdom-of-heaven.jpg",
        description: "After his wife dies, a blacksmith named Balian is thrust into royalty, political intrigue and bloody holy wars during the Crusades.",
        genres: ["Action", "Drama", "History"],
        duration: 144
      },
      {
        title: "Good Will Hunting",
        year: 1997,
        rating: 8.3,
        imageUrl: "https://example.com/good-will-hunting.jpg",
        description: "Headstrong yet aimless, Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT.",
        genres: ["Drama", "Romance"],
        duration: 126
      },
      {
        title: "Midsommar",
        year: 2019,
        rating: 7.1,
        imageUrl: "https://example.com/midsommar.jpg",
        description: "Several friends travel to Sweden to study as anthropologists a summer festival that is held every 90 years.",
        genres: ["Drama", "Horror", "Mystery"],
        duration: 148
      },
      {
        title: "Three Billboards Outside Ebbing, Missouri",
        year: 2017,
        rating: 8.1,
        imageUrl: "https://example.com/three-billboards.jpg",
        description: "After seven months have passed without a culprit in her daughter's murder case, Mildred Hayes makes a bold move.",
        genres: ["Comedy", "Crime", "Drama"],
        duration: 115
      },
      {
        title: "Titane",
        year: 2021,
        rating: 6.5,
        imageUrl: "https://example.com/titane.jpg",
        description: "A woman with a metal plate in her head from a childhood car accident embarks on a bizarre journey.",
        genres: ["Drama", "Horror", "Sci-Fi"],
        duration: 108
      },
      {
        title: "Gone Girl",
        year: 2014,
        rating: 8.1,
        imageUrl: "https://example.com/gone-girl.jpg",
        description: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.",
        genres: ["Drama", "Mystery", "Thriller"],
        duration: 149
      },
      {
        title: "Perfume: The Story of a Murderer",
        year: 2006,
        rating: 7.5,
        imageUrl: "https://example.com/perfume.jpg",
        description: "Jean-Baptiste Grenouille, born in the stench of 18th century Paris, develops a superior olfactory sense.",
        genres: ["Crime", "Drama", "Fantasy"],
        duration: 147
      }
    ];

    // Insert movies and create user associations
    for (const movie of movies) {
      // Check if movie already exists
      const existingMovie = await ctx.db
        .query("movies")
        .filter((q) => q.eq(q.field("title"), movie.title))
        .first();

      let movieId: Id<"movies">;

      if (!existingMovie) {
        // Insert new movie
        movieId = await ctx.db.insert("movies", movie);
      } else {
        movieId = existingMovie._id;
      }

      // Create user movie association if it doesn't exist
      const existingUserMovie = await ctx.db
        .query("userMovies")
        .filter((q) => q.and(q.eq(q.field("userId"), args.userId), q.eq(q.field("movieId"), movieId)))
        .first();

      if (!existingUserMovie) {
        const now = Date.now();
        await ctx.db.insert("userMovies", {
          userId: args.userId,
          movieId,
          status: "want_to_watch",
          createdAt: now,
          updatedAt: now
        });
      }
    }

    return { success: true };
  }
});

export const addMovieFromTMDB = mutation({
  args: {
    tmdbId: v.number(),
    title: v.string(),
    year: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    rating: v.number(),
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
        year: args.year,
        description: args.description,
        imageUrl: args.imageUrl,
        rating: args.rating,
        genres: [], // We could fetch genres from TMDB if needed
        duration: 0 // We could fetch duration from TMDB if needed
      });
    } else {
      // Update existing movie with TMDB data if it doesn't have tmdbId
      if (!existingMovie.tmdbId) {
        await ctx.db.patch(existingMovie._id, {
          tmdbId: args.tmdbId,
          description: args.description,
          imageUrl: args.imageUrl,
          rating: args.rating
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
    year: v.number(),
    genres: v.array(v.string()),
    duration: v.number(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number()),
    tmdbId: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("movies", args);
  }
});

export const updateMovie = mutation({
  args: {
    id: v.id("movies"),
    title: v.string(),
    year: v.number(),
    genres: v.array(v.string()),
    duration: v.number(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number()),
    tmdbId: v.optional(v.number())
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
