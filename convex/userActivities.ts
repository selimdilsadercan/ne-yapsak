import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserActivities = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userActivities = await ctx.db
      .query("userActivities")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const activities = await Promise.all(userActivities.map((userActivity) => ctx.db.get(userActivity.activityId)));

    return userActivities.map((userActivity, index) => ({
      ...userActivity,
      activity: activities[index]
    }));
  }
});

export const addToList = mutation({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities"),
    status: v.string(),
    frequency: v.optional(v.string()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userActivities")
      .withIndex("by_user_and_activity", (q) => q.eq("userId", args.userId).eq("activityId", args.activityId))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        status: args.status,
        frequency: args.frequency,
        notes: args.notes,
        updatedAt: Date.now()
      });
    }

    return await ctx.db.insert("userActivities", {
      userId: args.userId,
      activityId: args.activityId,
      status: args.status,
      frequency: args.frequency,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

export const updateStatus = mutation({
  args: {
    userActivityId: v.id("userActivities"),
    status: v.string(),
    lastDoneAt: v.optional(v.number()),
    userRating: v.optional(v.number()),
    frequency: v.optional(v.string()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.userActivityId, {
      status: args.status,
      lastDoneAt: args.lastDoneAt,
      userRating: args.userRating,
      frequency: args.frequency,
      notes: args.notes,
      updatedAt: Date.now()
    });
  }
});

export const remove = mutation({
  args: { userActivityId: v.id("userActivities") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userActivityId);
  }
});
