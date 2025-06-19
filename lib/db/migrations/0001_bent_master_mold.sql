ALTER TABLE `location` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
CREATE UNIQUE INDEX `location_name_userId_unique` ON `location` (`name`,`user_id`);--> statement-breakpoint
ALTER TABLE `locationLog` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `locationLogImage` ADD `user_id` text NOT NULL REFERENCES user(id);