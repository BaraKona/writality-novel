import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { Project } from "@shared/models";
import { database } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateProject = (): UseMutationResult<
  Project,
  Error,
  Project,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      await database
        .update(projectsTable)
        .set({
          name: project.name,
          emoji: project.emoji,
          description: project.description,
        })
        .where(eq(projectsTable.id, project.id))
        .run();
      return project;
    },
    mutationKey: ["updateProject"],
    onSuccess: (data: Project) => {
      queryClient.setQueryData(["projects", data.id], (prevData: Project) => {
        return { ...prevData, name: data.name, emoji: data.emoji };
      });
    },
  });
};
