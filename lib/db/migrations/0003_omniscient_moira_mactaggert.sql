DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "location_slug_unique";--> statement-breakpoint
DROP INDEX "location_name_userId_unique";--> statement-breakpoint
ALTER TABLE `location` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `location_slug_unique` ON `location` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `location_name_userId_unique` ON `location` (`name`,`user_id`);