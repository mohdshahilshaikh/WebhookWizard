import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the original one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Webhook schema
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  method: text("method").notNull().default("POST"),
  headers: jsonb("headers").default({}),
  enabled: boolean("enabled").notNull().default(true),
  retryLimit: integer("retry_limit").notNull().default(3),
  retryInterval: integer("retry_interval").notNull().default(60), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebhookSchema = createInsertSchema(webhooks).pick({
  name: true,
  url: true,
  description: true,
  method: true,
  headers: true,
  enabled: true,
  retryLimit: true,
  retryInterval: true,
});

// Event schema
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id").notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull(), // pending, delivered, failed, retrying
  attempts: integer("attempts").notNull().default(0),
  statusCode: integer("status_code"),
  responseBody: text("response_body"),
  errorMessage: text("error_message"),
  duration: integer("duration"), // in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
  lastAttemptAt: timestamp("last_attempt_at"),
  nextRetryAt: timestamp("next_retry_at"),
});

export const insertEventSchema = createInsertSchema(events).pick({
  webhookId: true,
  eventType: true,
  payload: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// Enums
export enum EventStatus {
  PENDING = "pending",
  DELIVERED = "delivered",
  FAILED = "failed",
  RETRYING = "retrying",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

// Extended schemas with validation
export const webhookFormSchema = insertWebhookSchema.extend({
  url: z.string().url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  retryLimit: z.number().min(0).max(10),
  retryInterval: z.number().min(5).max(3600),
});

export const eventTypeSchema = z.object({
  type: z.string().min(1, "Event type is required"),
  payload: z.record(z.any()),
});
