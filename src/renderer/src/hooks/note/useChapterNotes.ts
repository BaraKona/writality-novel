import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { notesTable } from "../../../../db/schema";
import { database, deserialize } from "@renderer/db";
import { eq, isNull, and } from "drizzle-orm";

export const useChapterNotes = (
  chapterId: number,
): UseQueryResult<(typeof notesTable.$inferSelect)[], Error> => {
  return useQuery({
    queryKey: ["notes", "chapter", chapterId],
    queryFn: async () => {
      const result = await database
        .select()
        .from(notesTable)
        .where(
          and(
            eq(notesTable.chapter_id, chapterId),
            isNull(notesTable.deleted_at),
          ),
        )
        .all();

      return result.map((note) => ({
        ...note,
        content: deserialize(note.content),
      }));
    },

    enabled: !!chapterId,
  });
};
