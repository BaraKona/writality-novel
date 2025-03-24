import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { fractalsTable, parentRelationshipsTable } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useFractal = (
  id: number,
): UseQueryResult<
  typeof fractalsTable.$inferSelect & {
    parent: typeof parentRelationshipsTable.$inferSelect | null;
    description: Value;
  },
  Error
> => {
  return useQuery({
    queryKey: ["fractal", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(fractalsTable)
        .where(eq(fractalsTable.id, id))
        .get();

      const parent = await database
        .select()
        .from(parentRelationshipsTable)
        .where(
          and(
            eq(parentRelationshipsTable.child_id, id),
            eq(parentRelationshipsTable.child_type, "fractal"),
          ),
        )
        .get();

      if (!result) {
        throw new Error(`Fractal with id ${id} not found`);
      }

      return {
        ...result,
        parent: parent ? parent : null,
        description: deserialize(result.description),
      };
    },
  });
};
