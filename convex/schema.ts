import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.string(),
    createdAt: v.number()
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    title: v.string(),
    description: v.string(),
    createdAt: v.number(),
    creatorId: v.id("users"),
    isPublic: v.boolean(),
    sharedWith: v.array(v.id("users"))
  }).index("by_creator", ["creatorId"]),

  friendships: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted")),
    createdAt: v.number()
  })
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"])
    .index("by_users", ["userId1", "userId2"]),

  groups: defineTable({
    name: v.string(),
    createdAt: v.number()
  }),

  group_members: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    joinedAt: v.number(),
    role: v.union(v.literal("member"), v.literal("admin"))
  })
});
