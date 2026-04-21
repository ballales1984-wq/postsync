CREATE TABLE `analytics_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_type` text NOT NULL,
	`source` text,
	`url_path` text,
	`session_id` text,
	`user_agent` text,
	`referrer` text,
	`metadata` text,
	`timestamp` integer
);