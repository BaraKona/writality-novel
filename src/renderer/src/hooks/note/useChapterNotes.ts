import { useQuery } from "@tanstack/react-query";
import { notesTable } from "../../../../db/schema";
import { database, deserialize } from "@renderer/db";
import { eq } from "drizzle-orm";
export const useChapterNotes = (chapterId: number) => {
  return useQuery({
    queryKey: ["notes", chapterId],
    queryFn: async () => {
      const result = await database
        .select()
        .from(notesTable)
        .where(eq(notesTable.chapter_id, chapterId))
        .all();

      return result.map((note) => ({
        ...note,
        content: deserialize(note.content),
      }));
    },

    enabled: !!chapterId,
  });
};
