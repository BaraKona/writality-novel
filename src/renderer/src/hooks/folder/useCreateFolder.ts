import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersTable } from "../../../../db/schema";
import { database } from "@renderer/db";

export const useCreateFolder = (projectId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createFolder"],
    mutationFn: async (parent_id: number | null) => {
      const result = await database
        .insert(foldersTable)
        .values({
          name: "New Folder",
          project_id: projectId,
          parent_folder_id: parent_id,
        })
        .run();

      return {
        id: result.rows && result.rows[0],
        project_id: projectId,
        name: "New Folder",
        parent_folder_id: parent_id,
      };
    },
    onSuccess: (folder: typeof foldersTable.$inferSelect) => {
      console.log({ folder });
      if (folder.parent_folder_id) {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", folder.parent_folder_id],
        });
      } else {
        queryClient.setQueryData(
          ["projects", "files", folder.project_id],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (prevData: any) => {
            console.log({ prevData });
            return {
              ...prevData,
              folders: [...prevData.folders, folder],
            };
          },
        );
      }
    },
  });
};
