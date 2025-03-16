import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { chaptersTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateChapter = (): ReturnType<typeof useMutation> => {
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
    },
  });
};
