import { relations } from "drizzle-orm/relations";
import { chapters, chapterParents, folders, projects } from "./schema";

export const chapterParentsRelations = relations(chapterParents, ({one}) => ({
	chapter: one(chapters, {
		fields: [chapterParents.chapterId],
		references: [chapters.id]
	}),
}));

export const chaptersRelations = relations(chapters, ({many}) => ({
	chapterParents: many(chapterParents),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	folder: one(folders, {
		fields: [folders.parentFolderId],
		references: [folders.id],
		relationName: "folders_parentFolderId_folders_id"
	}),
	folders: many(folders, {
		relationName: "folders_parentFolderId_folders_id"
	}),
	project: one(projects, {
		fields: [folders.projectId],
		references: [projects.id]
	}),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	folders: many(folders),
}));