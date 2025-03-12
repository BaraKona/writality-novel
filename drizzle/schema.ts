import {
  sqliteTable,
  integer,
  text,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const chapters = sqliteTable("chapters", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
  description: text(),
  position: integer().notNull(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const folders = sqliteTable(
  "folders",
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    parentFolderId: integer("parent_folder_id"),
    name: text().notNull(),
    description: text().notNull(),
    emoji: text().notNull(),
    position: integer().notNull(),
    createdAt: integer("created_at")
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer("updated_at")
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [
    foreignKey(() => ({
      columns: [table.parentFolderId],
      foreignColumns: [table.id],
      name: "folders_parent_folder_id_folders_id_fk",
    })).onDelete("cascade"),
  ],
);

export const projects = sqliteTable("projects", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  name: text().notNull(),
  description: text(),
  emoji: text(),
  createdAt: integer("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: integer("updated_at")
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const users = sqliteTable(
  "users",
  {
    id: integer().primaryKey({ autoIncrement: true }).notNull(),
    name: text().notNull(),
    age: integer().notNull(),
    email: text().notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const chapterParents = sqliteTable("chapter_parents", {
  chapterId: integer("chapter_id")
    .notNull()
    .references(() => chapters.id, { onDelete: "cascade" }),
  parentType: text("parent_type").notNull(),
  parentId: integer("parent_id").notNull(),
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {});
