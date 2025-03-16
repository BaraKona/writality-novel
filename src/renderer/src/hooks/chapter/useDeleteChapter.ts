// This should soft delete -> Mark for deletion 30 days from now

import { chaptersTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

export const useDeleteChapter = (projectId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteChapter"],
    mutationFn: (id: number) =>
      database
        .update(chaptersTable)
        .set({ deleted_at: new Date() })
        .where(eq(chaptersTable.id, id))
        .limit(1)
        .run(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", "files", projectId],
      }),
        toast.success("Chapter deleted successfully");
    },
  });
};
