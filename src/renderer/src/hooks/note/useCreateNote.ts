import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notesTable } from "../../../../db/schema";
import { database } from "@renderer/db";

export const useCreateNote = (projectId: number, parent_id: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createFolder"],
    mutationFn: ({ title }: { title: string }) =>
      database
        .insert(notesTable)
        .values({
          title,
          project_id: projectId,
          chapter_id: parent_id,
        })
        .run(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["notes", parent_id],
      }),
  });
};
