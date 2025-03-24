import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  foldersTable,
  chaptersTable,
  parentRelationshipsTable,
  fractalsTable,
} from "../../../../db/schema";
import { eq, isNull, and } from "drizzle-orm";

export const useProjectFiles = (id) => {
  return useQuery({
    queryKey: ["projects", "files", id],
    queryFn: async () => {
      // Fetch top-level folders and chapters
      const topLevelFolders = await database
        .select({
          id: foldersTable.id,
          name: foldersTable.name,
          project_id: foldersTable.project_id,
        })
        .from(foldersTable)
        .where(
          and(
            eq(foldersTable.project_id, id),
            isNull(foldersTable.parent_folder_id),
          ),
        )
        .all();

      const topLevelChapters = await database
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
            eq(parentRelationshipsTable.parent_type, "project"),
            eq(parentRelationshipsTable.parent_id, id),
            isNull(chaptersTable.deleted_at),
          ),
        );

      const topLevelFractals = await database
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
            eq(parentRelationshipsTable.parent_type, "project"),
            eq(parentRelationshipsTable.parent_id, id),
          ),
        )
        .all();

      // Fetch top-level children for each folder
      const result = await Promise.all(
        topLevelFolders.map(async (folder) => {
          const children = await database
            .select()
            .from(foldersTable)
            .where(eq(foldersTable.parent_folder_id, folder.id))
            .all();

          return {
            ...folder,
            children,
          };
        }),
      );

      // Combine folders with children and chapters
      return {
        folders: result,
        chapters: topLevelChapters,
        fractals: topLevelFractals,
      };
    },
    enabled: !!id,
  });
};
