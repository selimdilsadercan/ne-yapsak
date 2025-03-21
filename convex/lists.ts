import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createList = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    isPublic: v.boolean(),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const listId = await ctx.db.insert("lists", {
      name: args.name,
      description: args.description,
      type: args.type,
      isPublic: args.isPublic,
      imageUrl: args.imageUrl,
      tags: args.tags || [],
      createdBy: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      itemCount: 0,
      followerCount: 0
    });

    return listId;
  }
});

export const updateList = mutation({
  args: {
    listId: v.id("lists"),
    name: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    isPublic: v.boolean(),
    imageUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    if (list.createdBy !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.listId, {
      name: args.name,
      description: args.description,
      type: args.type,
      isPublic: args.isPublic,
      imageUrl: args.imageUrl,
      tags: args.tags || [],
      updatedAt: Date.now()
    });
  }
});

export const deleteList = mutation({
  args: {
    listId: v.id("lists")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    if (list.createdBy !== identity.subject) {
      throw new Error("Not authorized");
    }

    // Delete all list items
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    for (const item of listItems) {
      await ctx.db.delete(item._id);
    }

    // Delete all list followers
    const listFollowers = await ctx.db
      .query("listFollowers")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .collect();

    for (const follower of listFollowers) {
      await ctx.db.delete(follower._id);
    }

    await ctx.db.delete(args.listId);
  }
});

export const addItemToList = mutation({
  args: {
    listId: v.id("lists"),
    itemId: v.union(v.id("movies"), v.id("series"), v.id("games"), v.id("places"), v.id("activities")),
    itemType: v.string(),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    // Check if item exists in the specified table
    const item = await ctx.db.get(args.itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Check if item is already in the list
    const existingItem = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId.toString()))
      .first();

    if (existingItem) {
      throw new Error("Item already in list");
    }

    // Get the current highest order
    const lastItem = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .order("desc")
      .first();

    const order = lastItem ? lastItem.order + 1 : 0;

    // Add the item
    await ctx.db.insert("listItems", {
      listId: args.listId,
      itemId: args.itemId.toString(),
      itemType: args.itemType,
      order,
      notes: args.notes || "",
      addedBy: identity.subject,
      addedAt: Date.now()
    });

    // Update list item count
    await ctx.db.patch(args.listId, {
      itemCount: (list.itemCount || 0) + 1,
      updatedAt: Date.now()
    });
  }
});

export const removeItemFromList = mutation({
  args: {
    listId: v.id("lists"),
    itemId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    const item = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .first();

    if (!item) {
      throw new Error("Item not found in list");
    }

    await ctx.db.delete(item._id);

    // Update list item count
    await ctx.db.patch(args.listId, {
      itemCount: Math.max(0, (list.itemCount || 0) - 1),
      updatedAt: Date.now()
    });
  }
});

export const reorderListItems = mutation({
  args: {
    listId: v.id("lists"),
    itemIds: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    // Update order for each item
    for (let i = 0; i < args.itemIds.length; i++) {
      const item = await ctx.db
        .query("listItems")
        .withIndex("by_list", (q) => q.eq("listId", args.listId))
        .filter((q) => q.eq(q.field("itemId"), args.itemIds[i]))
        .first();

      if (item) {
        await ctx.db.patch(item._id, { order: i });
      }
    }
  }
});

export const followList = mutation({
  args: {
    listId: v.id("lists")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    if (!list.isPublic && list.createdBy !== user._id) {
      throw new Error("Cannot follow private list");
    }

    const existing = await ctx.db
      .query("listFollowers")
      .withIndex("by_list_and_user", (q) => q.eq("listId", args.listId).eq("userId", user._id))
      .first();

    if (existing) {
      throw new Error("Already following this list");
    }

    await ctx.db.insert("listFollowers", {
      listId: args.listId,
      userId: user._id,
      followedAt: Date.now()
    });

    // Update follower count
    await ctx.db.patch(args.listId, {
      followerCount: (list.followerCount || 0) + 1,
      updatedAt: Date.now()
    });
  }
});

export const unfollowList = mutation({
  args: {
    listId: v.id("lists")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const list = await ctx.db.get(args.listId);
    if (!list) {
      throw new Error("List not found");
    }

    const follower = await ctx.db
      .query("listFollowers")
      .withIndex("by_list_and_user", (q) => q.eq("listId", args.listId).eq("userId", user._id))
      .first();

    if (!follower) {
      throw new Error("Not following this list");
    }

    await ctx.db.delete(follower._id);

    // Update follower count
    await ctx.db.patch(args.listId, {
      followerCount: Math.max(0, (list.followerCount || 0) - 1),
      updatedAt: Date.now()
    });
  }
});

// Queries
export const getLists = query({
  args: {
    userId: v.optional(v.string()),
    type: v.optional(v.string()),
    includePrivate: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    let lists = await ctx.db.query("lists").collect();

    if (args.userId) {
      lists = lists.filter((list) => list.createdBy === args.userId);
    }

    if (args.type) {
      lists = lists.filter((list) => list.type === args.type);
    }

    if (!args.includePrivate) {
      lists = lists.filter((list) => list.isPublic);
    }

    return lists;
  }
});

export const getList = query({
  args: {
    listId: v.id("lists")
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.listId);
    if (!list) {
      return null;
    }

    // Get all items in the list with their details
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", args.listId))
      .order("asc")
      .collect();

    // Fetch details for each item based on its type
    const items = await Promise.all(
      listItems.map(async (item) => {
        const itemDetails = await ctx.db.get(item.itemId as Id<any>);
        return {
          ...item,
          name: itemDetails?.name,
          description: itemDetails?.description,
          type: item.itemType
        };
      })
    );

    return {
      ...list,
      items
    };
  }
});
