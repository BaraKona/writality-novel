import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fractalsTable, parentRelationshipsTable } from "../../../../db/schema";
import { database } from "@renderer/db";
import { useNavigate } from "@tanstack/react-router";
import { and, eq } from "drizzle-orm";
export const useCreateFractal = (
  parentId: number,
  parentType: "project" | "folder" = "project",
  navigate = false,
): ReturnType<typeof useMutation> => {
  const queryClient = useQueryClient();
  const navigateTo = useNavigate();

  return useMutation({
    mutationKey: ["createFractal", parentId, parentType],
    mutationFn: async () => {
      return database.transaction(async (tx) => {
        // Get the current max order for fractals in this parent
        const maxOrderResult = await tx
          .select({ maxOrder: fractalsTable.order })
          .from(fractalsTable)
          .innerJoin(
            parentRelationshipsTable,
            and(
              eq(fractalsTable.id, parentRelationshipsTable.child_id),
              eq(parentRelationshipsTable.child_type, "fractal"),
              eq(parentRelationshipsTable.parent_type, parentType),
              eq(parentRelationshipsTable.parent_id, parentId),
            ),
          )
          .get();

        const nextOrder = (maxOrderResult?.maxOrder ?? 0) + 1;

        const fractalResult = await tx
          .insert(fractalsTable)
          .values({
            name: "New Fractal",
            order: nextOrder,
          })
          .returning({ id: fractalsTable.id })
          .get();

        await tx
          .insert(parentRelationshipsTable)
          .values({
            parent_id: parentId,
            parent_type: parentType,
            child_id: fractalResult.id,
            child_type: "fractal",
          })
          .run();

        return fractalResult;
      });
    },
    onSuccess: (fractal: typeof fractalsTable.$inferSelect) => {
      if (parentType === "project") {
        queryClient.invalidateQueries({
          queryKey: ["projects", "files", parentId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["folder", "tree", parentId],
        });
      }
      if (navigate) {
        navigateTo({
          to: `/fractals/$fractalId`,
          params: { fractalId: fractal.id?.toString() },
        });
      }
    },
  });
};
