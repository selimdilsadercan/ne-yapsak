import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: {
    categoryId: v.optional(v.id("categories"))
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

    let plansQuery = ctx.db.query("plans").withIndex("by_creator", (q) => q.eq("creatorId", user._id));

    if (args.categoryId) {
      plansQuery = plansQuery.filter((q) => q.eq(q.field("categoryId"), args.categoryId));
    }

    return await plansQuery.collect();
  }
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // First get the user's ID
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all friendships where the user is either userId1 or userId2
    const friendships1 = await ctx.db
      .query("friendships")
      .withIndex("by_user1", (q) => q.eq("userId1", user._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const friendships2 = await ctx.db
      .query("friendships")
      .withIndex("by_user2", (q) => q.eq("userId2", user._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Get friend user documents
    const friendUserIds = [...friendships1.map((f) => f.userId2), ...friendships2.map((f) => f.userId1)];

    const friendUsers = await Promise.all(friendUserIds.map((id) => ctx.db.get(id)));

    // Get public plans from friends
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_creator")
      .filter((q) =>
        q.and(
          q.eq(q.field("isPublic"), true),
          q.or(...friendUsers.filter((user): user is NonNullable<typeof user> => user !== null).map((user) => q.eq(q.field("creatorId"), user._id)))
        )
      )
      .order("desc")
      .collect();

    return plans;
  }
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories"))
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

    const { title, description, categoryId } = args;
    const now = Date.now();

    return await ctx.db.insert("plans", {
      title,
      ...(description ? { description } : {}),
      categoryId,
      creatorId: user._id,
      isPublic: false,
      createdAt: now,
      updatedAt: now
    });
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
