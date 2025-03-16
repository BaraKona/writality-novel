import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { notesTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateNote = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: typeof notesTable) => {
      await database
        .update(notesTable)
        .set({
          ...note,
          title: note.title,
          content: serialize(note.content),
        })
        .where(eq(notesTable.id, note.id))
        .run();
      return note;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", note.chapter_id],
      });
    },

    mutationKey: ["updateFolder"],
  });
};
