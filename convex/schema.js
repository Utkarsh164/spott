import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    hasCompletedOnBoarding: v.boolean(),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
      })
    ),
    interest: v.optional(v.array(v.string())),
    freeEventsCreated: v.number(),
    createdAt:v.number(),
    updatedAt:v.number(),
  }).index("by_token",["tokenIdentifier"]),
});
