import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string()
  }).index("by_clerk_id", ["clerkId"]),

  activities: defineTable({
    name: v.string(),
    category: v.string(),
    iconName: v.string(),
    contentType: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }).index("by_category", ["category"]),

  movies: defineTable({
    title: v.string(),
    year: v.number(),
    genres: v.array(v.string()),
    duration: v.number(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    rating: v.optional(v.number())
  }),

  userMovies: defineTable({
    userId: v.id("users"),
    movieId: v.id("movies"),
    status: v.string(),
    userRating: v.optional(v.number()),
    watchedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_movie", ["movieId"])
    .index("by_user_and_movie", ["userId", "movieId"]),

  series: defineTable({
    title: v.string(),
    startYear: v.number(),
    endYear: v.optional(v.number()),
    genres: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.string(),
    totalSeasons: v.number()
  }),

  userSeries: defineTable({
    userId: v.id("users"),
    seriesId: v.id("series"),
    status: v.string(),
    currentSeason: v.optional(v.number()),
    currentEpisode: v.optional(v.number()),
    userRating: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_series", ["seriesId"])
    .index("by_user_and_series", ["userId", "seriesId"]),

  games: defineTable({
    title: v.string(),
    platform: v.string(),
    genres: v.array(v.string()),
    releaseYear: v.number(),
    developer: v.string(),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string())
  }),

  userGames: defineTable({
    userId: v.id("users"),
    gameId: v.id("games"),
    status: v.string(),
    playtime: v.optional(v.number()),
    userRating: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_game", ["gameId"])
    .index("by_user_and_game", ["userId", "gameId"]),

  places: defineTable({
    name: v.string(),
    type: v.string(),
    address: v.string(),
    city: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    imageUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    priceRange: v.optional(v.string())
  }),

  userPlaces: defineTable({
    userId: v.id("users"),
    placeId: v.id("places"),
    status: v.string(),
    visitedAt: v.optional(v.number()),
    userRating: v.optional(v.number()),
    review: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_place", ["placeId"])
    .index("by_user_and_place", ["userId", "placeId"]),

  userEvents: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    status: v.string(),
    userRating: v.optional(v.number()),
    date: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_activity", ["activityId"])
    .index("by_user_and_activity", ["userId", "activityId"]),

  userActivities: defineTable({
    userId: v.id("users"),
    activityId: v.id("activities"),
    status: v.string(),
    userRating: v.optional(v.number()),
    lastDoneAt: v.optional(v.number()),
    frequency: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_activity", ["activityId"])
    .index("by_user_and_activity", ["userId", "activityId"])
});
