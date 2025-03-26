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
  fractal_id: int().references(() => fractalsTable.id, {
    onDelete: "set null",
  }),
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
  fractal_id: int().references(() => fractalsTable.id, {
    onDelete: "set null",
  }),
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

// Characters Table
export const charactersTable = sqliteTable("characters", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  status: text().notNull().default("alive"), // Could be 'alive', 'dead', 'unknown'
  sex: text(),
  age: int(),
  traits: text(), // JSON string of traits array
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Character relationships Table
export const characterRelationshipsTable = sqliteTable(
  "character_relationships",
  {
    id: int().primaryKey({ autoIncrement: true }),
    subject_character_id: int()
      .notNull()
      .references(() => charactersTable.id, { onDelete: "cascade" }),
    object_character_id: int()
      .notNull()
      .references(() => charactersTable.id, { onDelete: "cascade" }),
    relationship_type: text().notNull(), // e.g., 'friend', 'enemy', 'parent'
    created_at: int("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updated_at: int("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
);

// Fractal Table
export const fractalsTable = sqliteTable("fractals", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  order: int("order", { mode: "number" }).notNull(), // Order in which events occur should auto increment
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Fractal Character Relationships Table -> Each fractal has relationships
export const fractalCharacterRelationshipsTable = sqliteTable(
  "fractal_character_relationships",
  {
    id: int().primaryKey({ autoIncrement: true }),
    fractal_id: int()
      .notNull()
      .references(() => fractalsTable.id, { onDelete: "cascade" }),
    subject_character_id: int()
      .notNull()
      .references(() => charactersTable.id, { onDelete: "cascade" }),
    object_character_id: int()
      .notNull()
      .references(() => charactersTable.id, { onDelete: "cascade" }),
    relationship_type: text().notNull(), // e.g., 'friend', 'enemy', 'parent'
    created_at: int("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updated_at: int("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
);

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

// Parent Relationships Table (For polymorphic parent relationships for both chapters and fractals)
export const parentRelationshipsTable = sqliteTable("parent_relationships", {
  child_type: text().notNull(), // 'chapter' or 'fractal'
  child_id: int().notNull(), // ID of the child (chapter or fractal)
  parent_type: text().notNull(), // 'project' or 'folder'
  parent_id: int().notNull(), // ID of the parent (project or folder)
  parent_project_id: int().references(() => projectsTable.id, {
    onDelete: "cascade",
  }),
  parent_folder_id: int().references(() => foldersTable.id, {
    onDelete: "cascade",
  }),
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
