import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  foldersTable,
  parentRelationshipsTable,
  chaptersTable,
  fractalsTable,
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
    fractals: {
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
          parentRelationshipsTable,
          and(
            eq(chaptersTable.id, parentRelationshipsTable.child_id),
            eq(parentRelationshipsTable.child_type, "chapter"),
          ),
        )
        .where(
          and(
            eq(parentRelationshipsTable.parent_type, "folder"),
            eq(parentRelationshipsTable.parent_id, id),
            isNull(chaptersTable.deleted_at),
          ),
        )
        .orderBy(chaptersTable.position);

      // Get top-level fractals in this folder
      const fractals = await database
        .select({
          id: fractalsTable.id,
          name: fractalsTable.name,
        })
        .from(fractalsTable)
        .innerJoin(
          parentRelationshipsTable,
          and(
            eq(fractalsTable.id, parentRelationshipsTable.child_id),
            eq(parentRelationshipsTable.child_type, "fractal"),
          ),
        )
        .where(
          and(
            eq(parentRelationshipsTable.parent_type, "folder"),
            eq(parentRelationshipsTable.parent_id, id),
          ),
        )
        .orderBy(fractalsTable.order);

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
        fractals: fractals.map((fractal) => ({
          ...fractal,
          parent_id: id,
          parent_type: "folder",
        })),
      };
    },
  });
};
