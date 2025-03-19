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

  groups: defineTable({
    name: v.string(),
    createdAt: v.number()
  }),

  group_members: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    joinedAt: v.number(),
    role: v.union(v.literal("member"), v.literal("admin"))
  }),

  categories: defineTable({
    name: v.string()
  }).index("by_name", ["name"]),

  activities: defineTable({
    name: v.string(),
    category: v.string(),
    iconName: v.string(),
    // Optional fields for future use
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  }).index("by_category", ["category"])
});
