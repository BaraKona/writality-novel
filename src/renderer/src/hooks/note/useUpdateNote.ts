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
  Value,
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
            content: serialize(note.content),
          })
          .where(eq(notesTable.id, note.id))
          .run();
      });
      return note;
    },
    onSuccess: (note) => {
      queryClient.setQueryData(
        ["note", note.id],
        (oldData: NoteUpdate | undefined) => {
          if (!oldData) return oldData;
          return { ...oldData, title: note.title };
        },
      );
      toast.success("Note updated");
    },
    mutationKey: ["updateNote"],
  });
};
