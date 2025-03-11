import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsTable } from "../../../../db/schema";
import { database } from "@renderer/db";
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: () =>
      database
        .insert(projectsTable)
        .values({
          name: "New Project",
        })
        .run(),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      }),
  });
};
