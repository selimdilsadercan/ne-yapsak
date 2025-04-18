import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    rating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    type: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("places", args);
  }
});

export const getByGooglePlaceId = query({
  args: { googlePlaceId: v.string() },
  handler: async (ctx, args) => {
    const place = await ctx.db
      .query("places")
      .filter((q) => q.eq(q.field("type"), args.googlePlaceId))
      .first();
    return place;
  }
});

export const update = mutation({
  args: {
    id: v.id("places"),
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    rating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    website: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    type: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    return await ctx.db.patch(id, data);
  }
});

export const getUserPlaces = query({
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

    const userPlaces = await ctx.db
      .query("userPlaces")
      .filter((q) => q.eq(q.field("userId"), user._id))
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
    visitDate: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { userPlaceId, status, visitDate } = args;

    // Verify that the userPlace exists
    const userPlace = await ctx.db.get(userPlaceId);
    if (!userPlace) {
      throw new Error("User place not found");
    }

    // Update the status and visitDate
    await ctx.db.patch(userPlaceId, {
      status,
      visitDate,
      updatedAt: Date.now()
    });

    return true;
  }
});

export const addPlaceFromGoogle = mutation({
  args: {
    googlePlaceId: v.string(),
    name: v.string(),
    address: v.string(),
    city: v.string(),
    country: v.string(),
    type: v.string(),
    rating: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const { googlePlaceId, name, address, city, country, type, rating, imageUrl, latitude, longitude, userId } = args;

    // Get the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if place already exists
    const existingPlace = await ctx.db
      .query("places")
      .filter((q) => q.eq(q.field("type"), googlePlaceId))
      .first();

    let placeId;
    if (existingPlace) {
      placeId = existingPlace._id;
    } else {
      // Create new place
      placeId = await ctx.db.insert("places", {
        name,
        address,
        city,
        country,
        type,
        rating,
        imageUrl,
        latitude,
        longitude
      });
    }

    // Check if user already has this place
    const existingUserPlace = await ctx.db
      .query("userPlaces")
      .filter((q) => q.and(q.eq(q.field("userId"), user._id), q.eq(q.field("placeId"), placeId)))
      .first();

    if (!existingUserPlace) {
      // Add place to user's list
      await ctx.db.insert("userPlaces", {
        userId: user._id,
        placeId,
        status: "want_to_visit",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    return placeId;
  }
});
