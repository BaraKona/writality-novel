import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { chaptersTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
export const useChapter = (
  id: number,
): UseQueryResult<typeof chaptersTable.$inferInsert> => {
  return useQuery({
    queryKey: ["chapter", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(chaptersTable)
        .where(eq(chaptersTable.id, id))
        .get();
      if (!result) {
        throw new Error(`Chapter with id ${id} not found`);
      }
      return {
        ...result,
        description: deserialize(result.description),
      };
    },
  });
};
