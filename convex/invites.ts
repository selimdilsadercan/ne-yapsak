import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";

type Context = QueryCtx | MutationCtx;

// Helper function to get current user ID
async function getCurrentUserId(ctx: Context) {
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

  return user._id;
}

// Create a new invite
export const createInvite = mutation({
  args: {
    groupId: v.id("groups"),
    email: v.string(),
    name: v.string(),
    role: v.string()
  },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    // Check if user is admin of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Not authorized to invite members");
    }

    // Check if invite already exists
    const existingInvite = await ctx.db
      .query("groupInvites")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingInvite && existingInvite.status === "pending") {
      throw new Error("Invite already exists for this email");
    }

    // Create new invite
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    return await ctx.db.insert("groupInvites", {
      groupId: args.groupId,
      email: args.email,
      name: args.name,
      role: args.role,
      status: "pending",
      invitedBy: userId,
      invitedAt: Date.now(),
      expiresAt
    });
  }
});

// Get pending invites for a group
export const getPendingInvites = query({
  args: { groupId: v.id("groups") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);

    // Check if user is member of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", args.groupId))
      .first();

    if (!membership) {
      throw new Error("Not authorized to view invites");
    }

    const invites = await ctx.db
      .query("groupInvites")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return invites;
  }
});

// Accept an invite
export const acceptInvite = mutation({
  args: { inviteId: v.id("groupInvites") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);
    const invite = await ctx.db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status !== "pending") {
      throw new Error("Invite is no longer pending");
    }

    if (invite.expiresAt < Date.now()) {
      throw new Error("Invite has expired");
    }

    // Update invite status
    await ctx.db.patch(args.inviteId, {
      status: "accepted",
      acceptedAt: Date.now(),
      acceptedBy: userId
    });

    // Add user to group
    await ctx.db.insert("groupMembers", {
      userId,
      groupId: invite.groupId,
      role: invite.role,
      joinedAt: Date.now()
    });

    // Update group member count
    const group = await ctx.db.get(invite.groupId);
    if (group) {
      await ctx.db.patch(invite.groupId, {
        memberCount: group.memberCount + 1
      });
    }
  }
});

// Delete an invite
export const deleteInvite = mutation({
  args: { inviteId: v.id("groupInvites") },
  async handler(ctx, args) {
    const userId = await getCurrentUserId(ctx);
    const invite = await ctx.db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    // Check if user is admin of the group
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_user_and_group", (q) => q.eq("userId", userId).eq("groupId", invite.groupId))
      .first();

    if (!membership || membership.role !== "admin") {
      throw new Error("Not authorized to delete invites");
    }

    await ctx.db.delete(args.inviteId);
  }
});
