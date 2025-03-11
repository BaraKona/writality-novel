import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Users Table
export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});

// Projects Table
export const projectsTable = sqliteTable("projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  emoji: text(),
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Folders Table
export const foldersTable = sqliteTable("folders", {
  id: int().primaryKey({ autoIncrement: true }),
  project_id: int()
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }), // Foreign key to projects
  parent_folder_id: int().references(() => foldersTable.id, {
    onDelete: "cascade",
  }), // Self-referencing foreign key for folder hierarchy
  name: text().notNull(),
  description: text().notNull(),
  emoji: text().notNull(),
  position: int().notNull(), // Position within the folder hierarchy
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Chapters Table
export const chaptersTable = sqliteTable("chapters", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  position: int().notNull(),
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Chapter Parents Table (For polymorphic parent relationships)
export const chapterParentsTable = sqliteTable("chapter_parents", {
  chapter_id: int()
    .notNull()
    .references(() => chaptersTable.id, { onDelete: "cascade" }), // Foreign key to chapters
  parent_type: text() // 'project' or 'folder'
    .notNull(),
  parent_id: int().notNull(), // ID of the parent (could be a project or folder)
});
