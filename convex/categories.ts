import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_CATEGORIES = ["Games", "Movies & TV Shows", "Sports", "Events", "Food & Drinks", "Travel", "Shopping", "Other"];

export const initialize = mutation({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    if (categories.length > 0) return;

    await Promise.all(
      DEFAULT_CATEGORIES.map((name) =>
        ctx.db.insert("categories", {
          name
        })
      )
    );
  }
});

export const list = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  }
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const { name } = args;

    // Check if category already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", name))
      .first();

    if (existing) {
      throw new Error("Category already exists");
    }

    return await ctx.db.insert("categories", {
      name
    });
  }
});
