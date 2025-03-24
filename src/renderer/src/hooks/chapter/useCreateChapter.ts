import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chaptersTable, parentRelationshipsTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useNavigate } from "@tanstack/react-router";

export const useCreateChapter = (
  parentId: number,
  parentType: "project" | "folder" = "project",
  navigate = false,
): ReturnType<typeof useMutation> => {
  const queryClient = useQueryClient();
  const navigateTo = useNavigate();

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
          .insert(parentRelationshipsTable)
          .values({
            parent_id: parentId,
            parent_type: parentType,
            child_id: chapterResult.id,
            child_type: "chapter",
          })
          .run();

        return chapterResult;
      });
    },
    onSuccess: (chapter) => {
      if (parentType === "project") {
        queryClient.invalidateQueries({
          queryKey: ["projects", "files", parentId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", parentId],
        });
      }
      if (navigate) {
        navigateTo({
          to: `/chapters/$chapterId`,
          params: { chapterId: chapter.id?.toString() },
        });
      }
    },
  });
};
