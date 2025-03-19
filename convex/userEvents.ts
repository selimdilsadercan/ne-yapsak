import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserEvents = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userEvents = await ctx.db
      .query("userEvents")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const activities = await Promise.all(userEvents.map((userEvent) => ctx.db.get(userEvent.activityId)));

    return userEvents.map((userEvent, index) => ({
      ...userEvent,
      activity: activities[index]
    }));
  }
});

export const addToList = mutation({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
    status: v.string(),
    date: v.optional(v.number()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userEvents")
      .withIndex("by_user_and_activity", (q) => q.eq("userId", args.userId).eq("activityId", args.activityId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        status: args.status,
        date: args.date,
        notes: args.notes,
        updatedAt: Date.now()
      });
    }

    return await ctx.db.insert("userEvents", {
      userId: args.userId,
      activityId: args.activityId,
      status: args.status,
      date: args.date,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const updateStatus = mutation({
  args: {
    userEventId: v.id("userEvents"),
    status: v.string(),
    date: v.optional(v.number()),
    userRating: v.optional(v.number()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userEventId, {
      status: args.status,
      date: args.date,
      userRating: args.userRating,
      notes: args.notes,
      updatedAt: Date.now()
    });
  }
});

export const remove = mutation({
  args: { userEventId: v.id("userEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userEventId);
  }
});
