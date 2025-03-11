import { useMutation, useQueryClient } from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: typeof projectsTable) => {
      try {
        await database
          .update(projectsTable)
          .set({
            name: project.name,
            emoji: project.emoji,
            description: serialize(project.description),
          })
          .where(eq(projectsTable.id, project.id))
          .run();
        return project;
      } catch (error: any) {
        throw new Error("Failed to update project", error);
      }
    },
    mutationKey: ["updateProject"],
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["projects", data.id],
        (prevData: typeof projectsTable) => {
          return { ...prevData, name: data.name, emoji: data.emoji };
        },
      );
    },
  });
};
