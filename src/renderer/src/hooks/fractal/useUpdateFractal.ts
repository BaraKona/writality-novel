import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { database } from "@renderer/db";
import { fractalsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

interface UpdateFractalParams {
  name?: string;
  description?: string;
  order?: number;
}

export const useUpdateFractal = (
  fractalId: number,
): UseMutationResult<void, Error, UpdateFractalParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateFractal", fractalId],
    mutationFn: async (params: UpdateFractalParams) => {
      await database
        .update(fractalsTable)
        .set({
          ...params,
          updated_at: new Date(),
        })
        .where(eq(fractalsTable.id, fractalId))
        .run();
    },
    onSuccess: () => {
      // Invalidate both the fractal query and the folder tree query
      queryClient.invalidateQueries({
        queryKey: ["fractal", fractalId],
      });
      queryClient.invalidateQueries({
        queryKey: ["folderTree"],
      });
    },
  });
};
