import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new activity node
export const create = mutation({
  args: {
    activityId: v.id("activities"),
    userId: v.id("users"),
    groupId: v.optional(v.id("groups"))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("activityNodes", {
      ...args,
      createdAt: now,
      updatedAt: now
    });
  }
});

// Get an activity node by ID
export const getById = query({
  args: { id: v.id("activityNodes") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// Get activity nodes by user ID
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityNodes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  }
});

// Get activity nodes by group ID
export const getByGroup = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityNodes")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
  }
});

// Get activity nodes by activity ID
export const getByActivity = query({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityNodes")
      .withIndex("by_activity", (q) => q.eq("activityId", args.activityId))
      .collect();
  }
});

// Get activity node by user and activity
export const getByUserAndActivity = query({
  args: {
    userId: v.id("users"),
    activityId: v.id("activities")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityNodes")
      .withIndex("by_user_and_activity", (q) => q.eq("userId", args.userId).eq("activityId", args.activityId))
      .first();
  }
});

// Get activity node by group and activity
export const getByGroupAndActivity = query({
  args: {
    groupId: v.id("groups"),
    activityId: v.id("activities")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityNodes")
      .withIndex("by_group_and_activity", (q) => q.eq("groupId", args.groupId).eq("activityId", args.activityId))
      .first();
  }
});

// Update an activity node
export const update = mutation({
  args: {
    id: v.id("activityNodes"),
    activityId: v.optional(v.id("activities")),
    userId: v.optional(v.id("users")),
    groupId: v.optional(v.id("groups"))
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now()
    });
  }
});

// Delete an activity node
export const remove = mutation({
  args: { id: v.id("activityNodes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  }
});
