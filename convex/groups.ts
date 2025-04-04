import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { getUser } from "./users";

type Context = QueryCtx | MutationCtx;

// Helper function to get current user ID
async function getCurrentUserId(ctx: Context) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const user = await getUser(ctx, { clerkId: identity.subject });
  if (!user) {
    throw new Error("User not found");
  }
  return user._id;
}

// Create a new group
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    const group = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      memberCount: 1
    });

    // Add creator as admin
    await ctx.db.insert("groupMembers", {
      userId,
      groupId: group,
      role: "admin",
      joinedAt: Date.now()
    });

    return group;
  }
});

// Get all groups where user is a member
export const listMyGroups = query({
  async handler(ctx) {
    const userId = await getCurrentUserId(ctx);

    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const groupIds = memberships.map((m) => m.groupId);
    const groups = await Promise.all(groupIds.map((id) => ctx.db.get(id)));

    return groups.filter(Boolean);
  }
});

// Get group details including members
export const getGroupDetails = query({
  args: { groupId: v.id("groups") },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const group = await ctx.db.get(args.groupId);
    if (!group) return null;

    const members = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const memberDetails = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user
        };
      })
    );

    return {
      ...group,
      members: memberDetails,
      currentUser
    };
  }
});

// Join a group
export const joinGroup = mutation({
  args: { groupId: v.id("groups") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    // Check if already a member
    const existingMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (existingMembership) {
      throw new Error("Already a member of this group");
    }

    // Add as member
    await ctx.db.insert("groupMembers", {
      userId,
      groupId: args.groupId,
      role: "member",
      joinedAt: Date.now()
    });

    // Increment member count
    const group = await ctx.db.get(args.groupId);
    await ctx.db.patch(args.groupId, {
      memberCount: (group?.memberCount ?? 0) + 1
    });
  }
});

// Leave a group
export const leaveGroup = mutation({
  args: { groupId: v.id("groups") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (!membership) {
      throw new Error("Not a member of this group");
    }

    // Check if last admin
    if (membership.role === "admin") {
      const adminCount = await ctx.db
        .query("groupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
        .filter((q) => q.eq(q.field("role"), "admin"))
        .collect();

      if (adminCount.length === 1) {
        throw new Error("Cannot leave group as last admin");
      }
    }

    await ctx.db.delete(membership._id);

    // Decrement member count
    const group = await ctx.db.get(args.groupId);
    await ctx.db.patch(args.groupId, {
      memberCount: Math.max(0, (group?.memberCount ?? 1) - 1)
    });
  }
});

// Delete a group (admin only)
export const deleteGroup = mutation({
  args: { groupId: v.id("groups") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Not authorized to delete this group");
    }

    // Delete all memberships
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // Delete group
    await ctx.db.delete(args.groupId);
  }
});

// Remove a member from group (admin only)
export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    memberId: v.id("groupMembers")
  },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    // Check if user is admin of the group
    const adminMembership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (!adminMembership || adminMembership.role !== "admin") {
      throw new Error("Not authorized to remove members");
    }

    // Get the member to be removed
    const memberToRemove = await ctx.db.get(args.memberId);
    if (!memberToRemove) {
      throw new Error("Member not found");
    }

    // Check if trying to remove the last admin
    if (memberToRemove.role === "admin") {
      const adminCount = await ctx.db
        .query("groupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
        .filter((q) => q.eq(q.field("role"), "admin"))
        .collect();

      if (adminCount.length === 1) {
        throw new Error("Cannot remove the last admin");
      }
    }

    // Remove the member
    await ctx.db.delete(args.memberId);

    // Update group member count
    const group = await ctx.db.get(args.groupId);
    await ctx.db.patch(args.groupId, {
      memberCount: Math.max(0, (group?.memberCount ?? 1) - 1)
    });
  }
});
