import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  platforms: text("platforms").notNull(),
  status: text("status").notNull().default("draft"),
  imageUrl: text("image_url"),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const socialAccounts = sqliteTable("social_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull(),
  accountId: text("account_id").notNull(),
  accountName: text("account_name").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }),
  connected: integer("connected", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const analyticsEvents = sqliteTable("analytics_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(), // page_view, click, share, etc.
  source: text("source"),
  urlPath: text("url_path"),
  sessionId: text("session_id"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  metadata: text("metadata"), // JSON
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
