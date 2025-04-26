import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
    role: v.optional(v.string())
  }).index("by_clerk_id", ["clerkId"]),

  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    memberCount: v.number()
  })
    .index("by_creator", ["createdBy"])
    .index("by_name", ["name"]),

  groupMembers: defineTable({
    userId: v.id("users"),
    groupId: v.id("groups"),
    role: v.string(), // "admin" or "member"
    joinedAt: v.number()
  })
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_user_and_group", ["userId", "groupId"]),

  groupInvites: defineTable({
    groupId: v.id("groups"),
    email: v.string(),
    name: v.string(),
    role: v.string(), // "admin" or "member"
    status: v.string(), // "pending" or "accepted"
    invitedBy: v.id("users"),
    invitedAt: v.number(),
    acceptedAt: v.optional(v.number()),
    acceptedBy: v.optional(v.id("users")),
    expiresAt: v.number() // 7 days from creation
  })
    .index("by_group", ["groupId"])
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

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
    duration: v.number(),
    genres: v.array(v.string()),
    imageUrl: v.string(),
    rating: v.number(),
    tmdbId: v.number(),
    year: v.number(),
    description: v.optional(v.string())
  })
    .index("by_title", ["title"])
    .index("by_tmdbId", ["tmdbId"]),

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
    name: v.string(),
    description: v.optional(v.string()),
    firstAirDate: v.number(),
    posterUrl: v.optional(v.string()),
    backdropUrl: v.optional(v.string()),
    tmdbId: v.number(),
    imdbId: v.optional(v.string()),
    numberOfSeasons: v.number(),
    numberOfEpisodes: v.number(),
    genres: v.array(v.string()),
    rating: v.optional(v.number()),
    voteCount: v.optional(v.number()),
    popularity: v.optional(v.number()),
    status: v.string(),
    tagline: v.optional(v.string()),
    trailerUrl: v.optional(v.string())
  }).index("by_tmdb_id", ["tmdbId"]),

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
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    metacritic: v.union(v.number(), v.null()),
    rating: v.optional(v.number()),
    rawgId: v.number(),
    year: v.number()
  }).index("by_rawg_id", ["rawgId"]),

  userGames: defineTable({
    userId: v.string(),
    gameId: v.id("games"),
    status: v.string(),
    addedAt: v.number(),
    playedAt: v.optional(v.number()),
    rating: v.optional(v.number()),
    notes: v.optional(v.string())
  })
    .index("by_user", ["userId"])
    .index("by_user_and_game", ["userId", "gameId"]),

  places: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    type: v.string(),
    rating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    openingHours: v.optional(v.string()),
    priceLevel: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
  }),

  userPlaces: defineTable({
    userId: v.id("users"),
    placeId: v.id("places"),
    status: v.string(),
    notes: v.optional(v.string()),
    visitDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_user_and_place", ["userId", "placeId"]),

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
    .index("by_user_and_activity", ["userId", "activityId"]),

  lists: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    tags: v.optional(v.array(v.string())),
    itemCount: v.number(),
    followerCount: v.number()
  })
    .index("by_creator", ["createdBy"])
    .index("by_follower_count", ["followerCount"]),

  listItems: defineTable({
    listId: v.id("lists"),
    itemId: v.string(),
    itemType: v.string(),
    order: v.number(),
    notes: v.optional(v.string()),
    addedBy: v.string(),
    addedAt: v.number()
  })
    .index("by_list", ["listId"])
    .index("by_item", ["itemId"])
    .index("by_list_and_order", ["listId", "order"]),

  listFollowers: defineTable({
    listId: v.id("lists"),
    userId: v.string(),
    followedAt: v.number()
  })
    .index("by_list", ["listId"])
    .index("by_list_and_user", ["listId", "userId"]),

  experiences: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    type: v.string(),
    location: v.string(),
    price: v.number(),
    rating: v.number(),
    reviewCount: v.number(),
    isActive: v.boolean()
  }).index("by_type", ["type"]),

  sessions: defineTable({
    listId: v.id("lists"),
    createdBy: v.id("users"),
    status: v.string(), // "active", "completed", "cancelled"
    createdAt: v.number(),
    updatedAt: v.number(),
    expiresAt: v.number(), // Session expiry time
    currentItemIndex: v.number(), // Current item being voted on
    totalVotes: v.number() // Total number of votes cast
  })
    .index("by_list", ["listId"])
    .index("by_creator", ["createdBy"])
    .index("by_status", ["status"]),

  sessionMembers: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    joinedAt: v.number(),
    lastActiveAt: v.number(),
    votesCount: v.number(), // Number of votes cast by this user
    isReady: v.boolean() // Whether the user is ready to start
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_session_and_user", ["sessionId", "userId"]),

  sessionVotes: defineTable({
    sessionId: v.id("sessions"),
    userId: v.id("users"),
    itemId: v.union(v.id("listItems"), v.id("sessionItems")), // Allow both types of IDs
    vote: v.string(), // "left", "right", "up"
    votedAt: v.number()
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_session_and_item", ["sessionId", "itemId"]),

  sessionItems: defineTable({
    sessionId: v.id("sessions"),
    itemType: v.string(), // "movie", "series", "game", etc.
    itemId: v.string(), // TMDB ID or other external ID
    name: v.string(),
    imageUrl: v.optional(v.string()),
    addedBy: v.id("users"),
    addedAt: v.number()
  })
    .index("by_session", ["sessionId"])
    .index("by_added_by", ["addedBy"]),

  activityNodes: defineTable({
    activityId: v.id("activities"),
    userId: v.id("users"),
    groupId: v.optional(v.id("groups")),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_activity", ["activityId"])
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_user_and_activity", ["userId", "activityId"])
    .index("by_group_and_activity", ["groupId", "activityId"])
});
