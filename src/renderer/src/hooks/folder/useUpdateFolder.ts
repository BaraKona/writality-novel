import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { database, serialize } from "@renderer/db";
import { foldersTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useUpdateFolder = (): UseMutationResult => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (folder: typeof foldersTable) => {
      await database
        .update(foldersTable)
        .set({
          ...folder,
          name: folder.name,
          emoji: serialize(folder.emoji),
          description: serialize(folder.description),
        })
        .where(eq(foldersTable.id, folder.id))
        .run();
      return folder;
    },
    mutationKey: ["updateFolder"],
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["folder", "single", data.id],
        (prevData: typeof foldersTable) => {
          return { ...prevData, name: data.name, emoji: data.emoji };
        },
      );
    },
  });
};
