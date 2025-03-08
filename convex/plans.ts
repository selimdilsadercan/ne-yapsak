import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db.query("plans").order("desc").collect();
    return plans;
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

    const planId = await ctx.db.insert("plans", {
      title: args.title,
      description: args.description,
      createdAt: Date.now(),
      status: "draft" as const,
      creatorId: identity.subject as any // TODO: Replace with proper user ID once auth is set up
    });
    return planId;
  }
});

export const remove = mutation({
  args: { id: v.id("plans") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const plan = await ctx.db.get(args.id);
    if (!plan) {
      throw new Error("Plan not found");
    }

    if (plan.creatorId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  }
});
