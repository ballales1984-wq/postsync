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

export const analyticsEvents = sqliteTable('analytics_events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  eventType: text('event_type').notNull(),
  source: text('source'),
  urlPath: text('url_path'),
  metadata: text('metadata'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const trafficMetrics = sqliteTable('traffic_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  bounceRate: integer('bounce_rate'),
  avgSessionDuration: integer('avg_session_duration'),
  topSources: text('top_sources'),
  topPages: text('top_pages'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const campaignMetrics = sqliteTable('campaign_metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => posts.id),
  platform: text('platform'),
  impressions: integer('impressions').default(0),
  engagements: integer('engagements').default(0),
  clicks: integer('clicks').default(0),
  reach: integer('reach').default(0),
  recordedAt: text('recorded_at'),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type TrafficMetric = typeof trafficMetrics.$inferSelect;
export type CampaignMetric = typeof campaignMetrics.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;