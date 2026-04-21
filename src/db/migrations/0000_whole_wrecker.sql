CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL,
	`platforms` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`image_url` text,
	`created_at` integer,
	`updated_at` integer
);
