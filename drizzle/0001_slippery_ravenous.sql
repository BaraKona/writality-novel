PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`parent_folder_id` integer,
	`name` text NOT NULL,
	`description` text,
	`emoji` text NOT NULL,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_folders`("id", "project_id", "parent_folder_id", "name", "description", "emoji", "position", "created_at", "updated_at") SELECT "id", "project_id", "parent_folder_id", "name", "description", "emoji", "position", "created_at", "updated_at" FROM `folders`;--> statement-breakpoint
DROP TABLE `folders`;--> statement-breakpoint
ALTER TABLE `__new_folders` RENAME TO `folders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;