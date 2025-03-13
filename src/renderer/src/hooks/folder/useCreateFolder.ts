import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersTable } from "../../../../db/schema";
import { database } from "@renderer/db";

export const useCreateFolder = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createFolder"],
    mutationFn: (parent_id: number | null) =>
      database
        .insert(foldersTable)
        .values({
          name: "New Folder",
          project_id: projectId,
          parent_folder_id: parent_id,
        })
        .run(),
    // window.api.createFolder(projectId, parent_id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["projects", "files"],
        // queryKey: ["projects", "files", id],
      }),
  });
};
