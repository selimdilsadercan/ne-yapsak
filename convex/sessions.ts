import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new session
export const createSession = mutation({
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

    // Create the session
    const sessionId = await ctx.db.insert("sessions", {
      listId: args.listId,
      createdBy: user._id,
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      currentItemIndex: 0,
      totalVotes: 0
    });

    // Add creator as first member
    await ctx.db.insert("sessionMembers", {
      sessionId,
      userId: user._id,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      votesCount: 0,
      isReady: false
    });

    return sessionId;
  }
});

// Get session details
export const getSession = query({
  args: {
    sessionId: v.id("sessions")
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Get members with user details
    const members = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
                name: user.name,
                image: user.image
              }
            : null
        };
      })
    );

    const list = await ctx.db.get(session.listId);
    if (!list) {
      throw new Error("List not found");
    }

    // Get list items with details
    const listItems = await ctx.db
      .query("listItems")
      .withIndex("by_list", (q) => q.eq("listId", session.listId))
      .collect();

    // Get details for each item based on its type
    const itemsWithDetails = await Promise.all(
      listItems.map(async (item) => {
        let details: { name?: string; title?: string; imageUrl?: string; posterUrl?: string } | null = null;

        switch (item.itemType) {
          case "movie": {
            const movie = await ctx.db.get(item.itemId as Id<"movies">);
            if (movie) details = { name: movie.title, imageUrl: movie.imageUrl };
            break;
          }
          case "series": {
            const series = await ctx.db.get(item.itemId as Id<"series">);
            if (series) details = { name: series.name, imageUrl: series.posterUrl };
            break;
          }
          case "game": {
            const game = await ctx.db.get(item.itemId as Id<"games">);
            if (game) details = { name: game.title, imageUrl: game.imageUrl };
            break;
          }
          case "place": {
            const place = await ctx.db.get(item.itemId as Id<"places">);
            if (place) details = { name: place.name, imageUrl: place.imageUrl };
            break;
          }
          case "activity": {
            const activity = await ctx.db.get(item.itemId as Id<"activities">);
            if (activity) details = { name: activity.name, imageUrl: activity.imageUrl };
            break;
          }
        }

        return {
          ...item,
          name: details?.name || details?.title || item.itemId,
          imageUrl: details?.imageUrl || details?.posterUrl
        };
      })
    );

    return {
      ...session,
      members: membersWithUsers,
      list: {
        ...list,
        items: itemsWithDetails
      }
    };
  }
});

// Join a session
export const joinSession = mutation({
  args: {
    sessionId: v.id("sessions")
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

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "active") {
      throw new Error("Session is not active");
    }

    // Check if user is already a member
    const existingMember = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session_and_user", (q) => q.eq("sessionId", args.sessionId).eq("userId", user._id))
      .first();

    if (existingMember) {
      throw new Error("Already joined this session");
    }

    // Add user as member
    await ctx.db.insert("sessionMembers", {
      sessionId: args.sessionId,
      userId: user._id,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      votesCount: 0,
      isReady: false
    });

    return true;
  }
});

// Cast a vote in a session
export const castVote = mutation({
  args: {
    sessionId: v.id("sessions"),
    itemId: v.union(v.id("listItems"), v.id("sessionItems")),
    vote: v.string()
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

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    if (session.status !== "active") {
      throw new Error("Session is not active");
    }

    // Record the vote
    await ctx.db.insert("sessionVotes", {
      sessionId: args.sessionId,
      userId: user._id,
      itemId: args.itemId,
      vote: args.vote,
      votedAt: Date.now()
    });

    // Update session
    await ctx.db.patch(args.sessionId, {
      totalVotes: session.totalVotes + 1,
      updatedAt: Date.now()
    });

    // Update member's vote count
    const member = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session_and_user", (q) => q.eq("sessionId", args.sessionId).eq("userId", user._id))
      .first();

    if (member) {
      await ctx.db.patch(member._id, {
        votesCount: member.votesCount + 1,
        lastActiveAt: Date.now()
      });
    }

    return true;
  }
});

// Update user activity in session
export const updateUserActivity = mutation({
  args: {
    sessionId: v.id("sessions")
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

    const member = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session_and_user", (q) => q.eq("sessionId", args.sessionId).eq("userId", user._id))
      .first();

    if (!member) {
      throw new Error("Not a member of this session");
    }

    // Update member's last active time
    await ctx.db.patch(member._id, {
      lastActiveAt: Date.now()
    });

    return true;
  }
});

// Leave a session
export const leaveSession = mutation({
  args: {
    sessionId: v.id("sessions")
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

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Find and delete the member record
    const member = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session_and_user", (q) => q.eq("sessionId", args.sessionId).eq("userId", user._id))
      .first();

    if (!member) {
      throw new Error("Not a member of this session");
    }

    await ctx.db.delete(member._id);

    // Check if this was the last member
    const remainingMembers = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // If this was the last member, clean up all session data
    if (remainingMembers.length === 0) {
      // Delete all session votes
      const sessionVotes = await ctx.db
        .query("sessionVotes")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();

      for (const vote of sessionVotes) {
        await ctx.db.delete(vote._id);
      }

      // Delete the session itself
      await ctx.db.delete(args.sessionId);
    }

    return true;
  }
});

// Set user ready state
export const setUserReadyState = mutation({
  args: {
    sessionId: v.id("sessions"),
    isReady: v.boolean()
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

    const member = await ctx.db
      .query("sessionMembers")
      .withIndex("by_session_and_user", (q) => q.eq("sessionId", args.sessionId).eq("userId", user._id))
      .first();

    if (!member) {
      throw new Error("Not a member of this session");
    }

    // Update member's ready state
    await ctx.db.patch(member._id, {
      isReady: args.isReady,
      lastActiveAt: Date.now()
    });

    return true;
  }
});

// Get all votes for a session
export const getSessionVotes = query({
  args: {
    sessionId: v.id("sessions")
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Get all votes for this session
    const votes = await ctx.db
      .query("sessionVotes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Group votes by itemId and count by vote type
    const voteCounts: { [key: string]: { up: number; right: number; left: number } } = {};

    for (const vote of votes) {
      // Check if it's a list item first
      const listItem = await ctx.db.get(vote.itemId as Id<"listItems">);

      // If it's not a list item, check if it's a session item
      if (!listItem) {
        const sessionItem = await ctx.db.get(vote.itemId as Id<"sessionItems">);
        if (sessionItem) {
          // It's a session item
          const itemId = `session_${vote.itemId}`;
          if (!voteCounts[itemId]) {
            voteCounts[itemId] = { up: 0, right: 0, left: 0 };
          }
          voteCounts[itemId][vote.vote as "up" | "right" | "left"]++;
        }
      } else {
        // It's a list item
        const itemId = vote.itemId;
        if (!voteCounts[itemId]) {
          voteCounts[itemId] = { up: 0, right: 0, left: 0 };
        }
        voteCounts[itemId][vote.vote as "up" | "right" | "left"]++;
      }
    }

    return voteCounts;
  }
});

// Add item to session
export const addSessionItem = mutation({
  args: {
    sessionId: v.id("sessions"),
    itemType: v.string(),
    itemId: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string())
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

    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    // Add the item to session items
    const sessionItem = await ctx.db.insert("sessionItems", {
      sessionId: args.sessionId,
      itemType: args.itemType,
      itemId: args.itemId,
      name: args.name,
      imageUrl: args.imageUrl,
      addedBy: user._id,
      addedAt: Date.now()
    });

    return sessionItem;
  }
});

// Get session items
export const getSessionItems = query({
  args: {
    sessionId: v.id("sessions")
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("sessionItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    return items;
  }
});
