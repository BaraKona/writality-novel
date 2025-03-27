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
import { InferSelectModel } from "drizzle-orm";

export const useUpdateNote = (): UseMutationResult<
  { id: number; title: string; content: Value | string },
  Value,
  { id: number; title: string; content: Value | string }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: { id: number; title: string; content: Value }) => {
      await database.transaction(async (tx) => {
        await tx
          .update(notesTable)
          .set({
            title: note.title,
            content:
              typeof note.content === "string"
                ? note.content
                : serialize(note.content),
          })
          .where(eq(notesTable.id, note.id))
          .run();
      });
      return note;
    },
    onSuccess: (note) => {
      queryClient.setQueryData(
        ["notes"],
        (oldData: InferSelectModel<typeof notesTable>[] | undefined) => {
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
