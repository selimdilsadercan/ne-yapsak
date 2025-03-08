import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const plans = await ctx.db
      .query("plans")
      .withIndex("by_creator", (q) => q.eq("creatorId", user._id))
      .order("desc")
      .collect();
    return plans;
  }
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const plans = await ctx.db
      .query("plans")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();
    return plans;
  }
});

export const listFriendsActivity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get user's friends
    const friends = await ctx.db
      .query("friendships")
      .filter((q) => q.or(q.eq(q.field("userId1"), user._id), q.eq(q.field("userId2"), user._id)))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const friendIds = friends.map((f) => (f.userId1 === user._id ? f.userId2 : f.userId1));

    // Get all plans
    const allPlans = await ctx.db
      .query("plans")
      .filter((q) => q.or(q.eq(q.field("isPublic"), true), q.eq(q.field("creatorId"), user._id)))
      .order("desc")
      .collect();

    // Filter plans that are either public from friends or shared with the user
    return allPlans.filter((plan) => (plan.isPublic && friendIds.includes(plan.creatorId)) || plan.sharedWith.includes(user._id));
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const planId = await ctx.db.insert("plans", {
      title: args.title,
      description: args.description,
      createdAt: Date.now(),
      creatorId: user._id,
      isPublic: false,
      sharedWith: []
    });
    return planId;
  }
});

export const togglePublic = mutation({
  args: { id: v.id("plans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await ctx.db.get(args.id);
    if (!plan) {
      throw new Error("Plan not found");
    }

    if (plan.creatorId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.id, {
      isPublic: !plan.isPublic
    });
  }
});

export const remove = mutation({
  args: { id: v.id("plans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const plan = await ctx.db.get(args.id);
    if (!plan) {
      throw new Error("Plan not found");
    }

    if (plan.creatorId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  }
});
