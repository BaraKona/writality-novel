// This should soft delete -> Mark for deletion 30 days from now

import { currentProjectIdAtom } from "@renderer/routes/__root";
import { chaptersTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

export const useDeleteChapter = () => {
  const queryClient = useQueryClient();
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  return useMutation({
    mutationKey: ["deleteChapter"],
    mutationFn: (chapter: typeof chaptersTable.$inferSelect) => {
      database
        .update(chaptersTable)
        .set({ deleted_at: new Date() })
        .where(eq(chaptersTable.id, chapter.id))
        .limit(1)
        .run();

      return chapter;
    },
    onSuccess: (chapter) => {
      console.log({ chapter });
      if (chapter.parent_type === "folder") {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", chapter.parent_id],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["projects", "files", currentProjectId],
        });
      }
      toast.success("Chapter deleted successfully");
    },
  });
};
