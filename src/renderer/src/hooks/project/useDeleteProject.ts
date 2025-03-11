import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) =>
      await database
        .delete(projectsTable)
        .where(eq(projectsTable.id, id))
        .run(),

    mutationKey: ["delete-project"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
