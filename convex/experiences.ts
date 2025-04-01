import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("experiences").collect();
  }
});

export const getByType = query({
  args: { type: v.string() },
  handler: async (ctx, { type }) => {
    return await ctx.db
      .query("experiences")
      .withIndex("by_type", (q) => q.eq("type", type))
      .collect();
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    type: v.string(),
    location: v.string(),
    price: v.number(),
    rating: v.number(),
    reviewCount: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("experiences", {
      ...args,
      isActive: true
    });
  }
});

export const update = mutation({
  args: {
    id: v.id("experiences"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    type: v.optional(v.string()),
    location: v.optional(v.string()),
    price: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    isActive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    return await ctx.db.patch(id, rest);
  }
});

export const remove = mutation({
  args: { id: v.id("experiences") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  }
});
