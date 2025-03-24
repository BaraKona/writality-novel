// This should soft delete -> Mark for deletion 30 days from now

import { currentProjectIdAtom } from "@renderer/routes/__root";
import { fractalsTable, parentRelationshipsTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eq, and } from "drizzle-orm";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

type FractalWithParent = typeof fractalsTable.$inferSelect & {
  parent_type: "project" | "folder";
  parent_id: number;
};

export const useDeleteFractal = (): ReturnType<
  typeof useMutation<
    FractalWithParent,
    unknown,
    typeof fractalsTable.$inferSelect
  >
> => {
  const queryClient = useQueryClient();
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  return useMutation({
    mutationKey: ["deleteFractal"],
    mutationFn: async (fractal: typeof fractalsTable.$inferSelect) => {
      // Get parent information before deletion
      const parent = await database
        .select()
        .from(parentRelationshipsTable)
        .where(
          and(
            eq(parentRelationshipsTable.child_id, fractal.id),
            eq(parentRelationshipsTable.child_type, "fractal"),
          ),
        )
        .get();

      if (!parent) {
        throw new Error("Parent relationship not found");
      }

      // Delete the fractal
      await database
        .delete(fractalsTable)
        .where(eq(fractalsTable.id, fractal.id))
        .limit(1)
        .run();

      return {
        ...fractal,
        parent_type: parent.parent_type as "project" | "folder",
        parent_id: parent.parent_id,
      };
    },
    onSuccess: (fractal: FractalWithParent) => {
      console.log({ fractal });
      if (fractal.parent_type === "folder") {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", fractal.parent_id],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["projects", "files", currentProjectId],
        });
      }
      toast.success("Fractal deleted successfully");
    },
  });
};
