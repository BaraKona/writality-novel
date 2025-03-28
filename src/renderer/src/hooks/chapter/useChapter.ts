import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { chaptersTable, parentRelationshipsTable } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useChapter = (
  id: number,
): UseQueryResult<
  typeof chaptersTable.$inferSelect & {
    parent: typeof parentRelationshipsTable.$inferSelect | null;
    description: Value;
  },
  Error
> => {
  return useQuery({
    queryKey: ["chapter", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(chaptersTable)
        .where(eq(chaptersTable.id, id))
        .get();

      const parent = await database
        .select()
        .from(parentRelationshipsTable)
        .where(
          and(
            eq(parentRelationshipsTable.child_id, id),
            eq(parentRelationshipsTable.child_type, "chapter"),
          ),
        )
        .get();

      if (!result) {
        throw new Error(`Chapter with id ${id} not found`);
      }
      return {
        ...result,
        parent: parent ? parent : null,
        description: deserialize(result.description),
      };
    },
  });
};
