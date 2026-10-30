CREATE TABLE `portal_login_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`window` integer NOT NULL,
	`hits` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`method` text NOT NULL,
	`created` integer NOT NULL,
	`last_seen` integer NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `portal_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `portal_sessions_expiry` ON `portal_sessions` (`expires`);--> statement-breakpoint
CREATE INDEX `portal_sessions_user` ON `portal_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `portal_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`password_hash` text,
	`role` text NOT NULL,
	`must_change` integer DEFAULT 1 NOT NULL,
	`disabled` integer DEFAULT 0 NOT NULL,
	`created` integer NOT NULL,
	CONSTRAINT "portal_role" CHECK("portal_users"."role" IN ('owner','viewer'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_users_username_unique` ON `portal_users` (`username`);