import { useQuery } from "@tanstack/react-query";
import { foldersTable } from "../../../../db/schema";
import { database } from "@renderer/db";

export const useProjectFolders = (projectId: number) => {
  return useQuery({
    queryKey: ["project", "folders", projectId],
    queryFn: () =>
      database
        .select()
        .from(foldersTable)
        .where(foldersTable.project_id.eq(projectId))
        .all(),
  });
};
