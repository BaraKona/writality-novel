import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chaptersTable, chapterParentsTable } from "../../../../db/schema";
import { database } from "@renderer/db";

export const useCreateChapter = (
  parentId: number,
  parentType: "project" | "folder",
): ReturnType<typeof useMutation<{ id: number }, Error>> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createChapter", parentId, parentType],
    mutationFn: async () => {
      return database.transaction(async (tx) => {
        const chapterResult = await tx
          .insert(chaptersTable)
          .values({
            name: "New Chapter",
          })
          .returning({ id: chaptersTable.id })
          .get();

        await tx
          .insert(chapterParentsTable)
          .values({
            chapter_id: chapterResult.id,
            parent_type: parentType,
            parent_id: parentId,
          })
          .run();

        return chapterResult;
      });
    },
    onSuccess: () => {
      if (parentType === "project") {
        queryClient.invalidateQueries({
          queryKey: ["projects", "files", parentId],
        });
      }
    },
  });
};
