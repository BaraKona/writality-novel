import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  foldersTable,
  chapterParentsTable,
  chaptersTable,
} from "../../../../db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const useFolderTree = (id: number) => {
  type FolderTreeResult = {
    chapters: {
      id: number;
      name: string;
      parent_id: number;
      parent_type: string;
    }[];
    folders: (typeof foldersTable.$inferSelect & { type: "folder" })[];
  };

  return useQuery<FolderTreeResult>({
    queryKey: ["folder", "tree", id],
    queryFn: async () => {
      // Get top-level chapters in this folder
      const chapters = await database
        .select({
          id: chaptersTable.id,
          name: chaptersTable.name,
        })
        .from(chaptersTable)
        .innerJoin(
          chapterParentsTable,
          eq(chaptersTable.id, chapterParentsTable.chapter_id),
        )
        .where(
          and(
            eq(chapterParentsTable.parent_type, "folder"),
            eq(chapterParentsTable.parent_id, id),
            isNull(chaptersTable.deleted_at),
          ),
        )
        .orderBy(chaptersTable.position);

      // Get subfolders within this folder
      const folders = await database
        .select()
        .from(foldersTable)
        .where(eq(foldersTable.parent_folder_id, id))
        .orderBy(foldersTable.position);

      return {
        chapters: chapters.map((chapter) => ({
          ...chapter,
          parent_id: id,
          parent_type: "folder",
        })),
        folders: folders.map((folder) => ({
          ...folder,
          type: "folder",
        })),
      };
    },
  });
};
