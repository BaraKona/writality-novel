-- First create the new table structure
CREATE TABLE IF NOT EXISTS `parent_relationships` (
	`child_type` text NOT NULL,
	`child_id` integer NOT NULL,
	`parent_type` text NOT NULL,
	`parent_id` integer NOT NULL,
	`parent_project_id` integer,
	`parent_folder_id` integer,
	FOREIGN KEY (`parent_project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

-- Copy data from chapter_parents if it exists
INSERT INTO `parent_relationships`("child_type", "child_id", "parent_type", "parent_id") 
SELECT "child_type", "chapter_id", "parent_type", "parent_id" 
FROM `chapter_parents`;
--> statement-breakpoint

-- Drop the old table if it exists
DROP TABLE IF EXISTS `chapter_parents`;
--> statement-breakpoint

CREATE TABLE `character_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subject_character_id` integer NOT NULL,
	`object_character_id` integer NOT NULL,
	`relationship_type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`subject_character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`object_character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `fractal_character_relationships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fractal_id` integer NOT NULL,
	`subject_character_id` integer NOT NULL,
	`object_character_id` integer NOT NULL,
	`relationship_type` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`fractal_id`) REFERENCES `fractals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subject_character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`object_character_id`) REFERENCES `characters`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `fractals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`order` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);