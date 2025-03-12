import { useQuery } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { foldersTable, chaptersTable } from "../../../../db/schema";
import { eq, isNull, and } from "drizzle-orm";

export const useProjectFiles = (id) => {
  return useQuery({
    queryKey: ["projects", "files", id],
    queryFn: async () => {
      // Fetch top-level folders and chapters
      const topLevelFolders = await database
        .select()
        .from(foldersTable)
        .where(
          and(
            eq(foldersTable.project_id, id),
            isNull(foldersTable.parent_folder_id),
          ),
        )
        .all();

      const topLevelChapters = await database
        .select()
        .from(chaptersTable)
        // .where(eq(chaptersTable.parentId, id)) // Assuming chapters have a parentId
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
      };
    },
    enabled: !!id,
  });
};
