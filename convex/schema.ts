import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number()
  }),

  plans: defineTable({
    creatorId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    status: v.union(v.literal("draft"), v.literal("shared"))
  }),

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
