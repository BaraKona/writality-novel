import { useQuery } from "@tanstack/react-query";
import { notesTable, chaptersTable } from "../../../db/schema";
import { database } from "@renderer/db";
import { eq } from "drizzle-orm";
import type { UseQueryResult } from "@tanstack/react-query";
import type { InferSelectModel } from "drizzle-orm";

export function useProjectNotes(projectId: number): UseQueryResult<
  (InferSelectModel<typeof notesTable> & {
    chapter?: { id: number; name: string } | null;
  })[]
> {
  return useQuery({
    queryKey: ["notes", "project", projectId],
    queryFn: async () => {
      const notes = await database
        .select({
          id: notesTable.id,
          project_id: notesTable.project_id,
          chapter_id: notesTable.chapter_id,
          title: notesTable.title,
          content: notesTable.content,
          position: notesTable.position,
          deleted_at: notesTable.deleted_at,
          status: notesTable.status,
          pinned_to_project: notesTable.pinned_to_project,
          pinned_to_chapter: notesTable.pinned_to_chapter,
          created_at: notesTable.created_at,
          updated_at: notesTable.updated_at,
          chapter_name: chaptersTable.name,
        })
        .from(notesTable)
        .leftJoin(chaptersTable, eq(notesTable.chapter_id, chaptersTable.id))
        .where(eq(notesTable.project_id, projectId))
        .all();

      return notes;
    },
  });
}
