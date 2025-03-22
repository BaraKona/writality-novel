import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { chaptersTable, chapterParentsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useChapter = (
  id: number,
): UseQueryResult<
  typeof chaptersTable.$inferSelect & {
    parent: typeof chapterParentsTable.$inferSelect | null;
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
        .from(chapterParentsTable)
        .where(eq(chapterParentsTable.chapter_id, id))
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
