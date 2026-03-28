CREATE TABLE `social_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`platform` text NOT NULL,
	`account_id` text NOT NULL,
	`account_name` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`token_expires_at` integer,
	`connected` integer DEFAULT false NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
ALTER TABLE `posts` ADD `scheduled_at` integer;