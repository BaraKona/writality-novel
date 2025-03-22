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
  description: text(),
  emoji: text(),
  position: int(), // Position within the folder hierarchy
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
  emoji: text(),
  description: text(),
  word_count: int(),
  position: int(),
  deleted_at: int("deleted_at", { mode: "timestamp" }), // Soft delete timestamp
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Daily Word Counts Table - This is used to store the word count for each day
export const dailyWordCountsTable = sqliteTable("daily_word_counts", {
  id: int().primaryKey({ autoIncrement: true }),
  chapter_id: int()
    .notNull()
    .references(() => chaptersTable.id, { onDelete: "cascade" }), // Foreign key to chapters
  date: text().notNull(), // Date in YYYY-MM-DD format
  word_count: int().notNull(), // Word count for the day
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Versions Table
export const versionsTable = sqliteTable("versions", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().default("untitled"),
  chapter_id: int()
    .notNull()
    .references(() => chaptersTable.id, { onDelete: "cascade" }), // Foreign key to chapters
  description: text().notNull(), // The content of this version
  word_count: int().notNull(), // Word count at this version
  is_major_version: int().default(0), // Boolean flag for major versions (0 or 1)
  created_at: int("created_at", { mode: "timestamp" })
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

// Notes Table
export const notesTable = sqliteTable("notes", {
  id: int().primaryKey({ autoIncrement: true }),
  project_id: int()
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }), // Foreign key to projects
  chapter_id: int().references(() => chaptersTable.id, {
    onDelete: "set null",
  }), // Optional foreign key to chapters
  title: text().notNull(),
  content: text(), // The main content of the note
  position: int(),
  deleted_at: int("deleted_at", { mode: "timestamp" }), // Soft delete timestamp
  status: text().default("active"), // Could be 'active', 'archived', 'deleted', etc.
  pinned_to_project: int().default(0), // Boolean flag for notes pinned to project (0 or 1)
  pinned_to_chapter: int().default(0), // Boolean flag for notes pinned to chapter (0 or 1)
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
