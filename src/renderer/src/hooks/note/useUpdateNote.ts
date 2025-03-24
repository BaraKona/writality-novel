import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { notesTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";
import { toast } from "sonner";

type NoteUpdate = Omit<typeof notesTable.$inferSelect, "content"> & {
  content: Value;
};

export const useUpdateNote = (): UseMutationResult<
  NoteUpdate,
  unknown,
  NoteUpdate
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: NoteUpdate) => {
      await database.transaction(async (tx) => {
        await tx
          .update(notesTable)
          .set({
            ...note,
            title: note.title,
            content: serialize(note.content),
          })
          .where(eq(notesTable.id, note.id))
          .run();
      });
      return note;
    },
    onSuccess: (note) => {
      queryClient.setQueryData(
        ["notes"],
        (oldData: NoteUpdate[] | undefined) => {
          if (!oldData) return oldData;
          return oldData.map((n) =>
            n.id === note.id ? { ...n, title: note.title } : n,
          );
        },
      );
      toast.success("Note updated");
    },

    mutationKey: ["updateNote"],
  });
};
