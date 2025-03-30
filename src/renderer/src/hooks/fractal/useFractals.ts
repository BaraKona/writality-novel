// Gets all the fractals for a project

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  fractalsTable,
  parentRelationshipsTable,
  foldersTable,
} from "../../../../db/schema";
import { eq, and, or, inArray } from "drizzle-orm";
import { currentProjectIdAtom } from "@renderer/routes/__root";
import { useAtomValue } from "jotai";

export const useFractals = (): UseQueryResult<
  (typeof fractalsTable.$inferSelect)[],
  Error
> => {
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  return useQuery({
    queryKey: ["fractals", currentProjectId],
    queryFn: async () => {
      if (!currentProjectId) {
        throw new Error("No project ID provided");
      }

      // First get all folder IDs that belong to this project
      const projectFolders = await database
        .select({ id: foldersTable.id })
        .from(foldersTable)
        .where(eq(foldersTable.project_id, currentProjectId));

      const folderIds = projectFolders.map((folder) => folder.id);

      // Get all fractals that belong to this project either directly or through any folder
      const result = await database
        .select({
          fractals: fractalsTable,
        })
        .from(fractalsTable)
        .innerJoin(
          parentRelationshipsTable,
          and(
            eq(parentRelationshipsTable.child_id, fractalsTable.id),
            eq(parentRelationshipsTable.child_type, "fractal"),
            or(
              // Direct project relationship
              and(
                eq(parentRelationshipsTable.parent_type, "project"),
                eq(parentRelationshipsTable.parent_id, currentProjectId),
              ),
              // Folder relationship - check if the parent folder is in our list of project folders
              and(
                eq(parentRelationshipsTable.parent_type, "folder"),
                inArray(parentRelationshipsTable.parent_id, folderIds),
              ),
            ),
          ),
        )
        .orderBy(fractalsTable.order);

      return result.map((row) => row.fractals);
    },
    enabled: !!currentProjectId,
  });
};
