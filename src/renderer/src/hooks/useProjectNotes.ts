import { useQuery } from "@tanstack/react-query";
import { notesTable } from "../../../db/schema";
import { database } from "@renderer/db";
import { eq } from "drizzle-orm";
import type { UseQueryResult } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";

export function useProjectNotes(
  projectId: number,
): UseQueryResult<InferSelectModel<typeof notesTable>[]> {
  return useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: () =>
      database
        .select()
        .from(notesTable)
        .where(eq(notesTable.project_id, projectId))
        .all(),
  });
}
