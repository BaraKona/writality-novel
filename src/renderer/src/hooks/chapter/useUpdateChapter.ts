import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { chaptersTable, chapterParentsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateChapter = (
  chapterParent?: typeof chapterParentsTable.$inferSelect,
): ReturnType<typeof useMutation> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chapter: typeof chaptersTable) => {
      await database
        .update(chaptersTable)
        .set({
          ...chapter,
          name: chapter.name,
          description: serialize(chapter.description),
        })
        .where(eq(chaptersTable.id, chapter.id))
        .run();

      return chapter;
    },
    mutationKey: ["updateProject"],
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["chapter", data.id],
        (prevData: typeof chaptersTable) => {
          return { ...prevData, name: data.name };
        },
      );
      if (chapterParent.parent_type === "project") {
        queryClient.setQueryData(
          ["projects", "files", chapterParent.parent_id],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prevData: any) => {
            return {
              ...prevData,
              chapters: prevData.chapters.map((chapter) => {
                if (chapter.id === data.id) {
                  return { ...chapter, name: data.name };
                }
                return chapter;
              }),
            };
          },
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", chapterParent.parent_id],
        });
      }
    },
  });
};
