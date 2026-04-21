import {
  sqliteTable,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';

export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  source: text('source'),
  urlPath: text('url_path'),
  metadata: text('metadata'),
  timestamp: integer('timestamp', { mode: 'timestamp' }),
});

export const trafficMetrics = sqliteTable('traffic_metrics', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  views: integer('views').default(0),
  uniqueVisitors: integer('unique_visitors').default(0),
  bounceRate: real('bounce_rate'),
  avgSessionDuration: integer('avg_session_duration'),
  topSources: text('top_sources'),
  topPages: text('top_pages'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const campaignMetrics = sqliteTable('campaign_metrics', {
  id: text('id').primaryKey(),
  postId: text('post_id'),
  platform: text('platform'),
  impressions: integer('impressions').default(0),
  engagements: integer('engagements').default(0),
  clicks: integer('clicks').default(0),
  reach: integer('reach').default(0),
  recordedAt: text('recorded_at'),
});

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  content: text('content'),
  platform: text('platform'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

export const socialAccounts = sqliteTable('social_accounts', {
  id: text('id').primaryKey(),
  platform: text('platform').notNull(),
  accessToken: text('access_token'),
  accountName: text('account_name'),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type TrafficMetric = typeof trafficMetrics.$inferSelect;
export type CampaignMetric = typeof campaignMetrics.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type SocialAccount = typeof socialAccounts.$inferSelect;