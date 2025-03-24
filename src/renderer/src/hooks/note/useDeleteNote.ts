// This should soft delete -> Mark for deletion 30 days from now

import { notesTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-note"],
    mutationFn: (id: number) =>
      database.delete(notesTable).where(eq(notesTable.id, id)).limit(1).run(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      }),
        toast.success("Note deleted");
    },
  });
};
