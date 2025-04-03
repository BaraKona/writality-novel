import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";
import { Emoji } from "@emoji-mart/data";

export const useProject = (
  id: number,
): UseQueryResult<
  typeof projectsTable.$inferSelect & {
    description: Value;
    emoji: Emoji;
  },
  Error
> => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, id))
        .get();

      console.log({ result });
      if (!result) {
        throw new Error(`Project with id ${id} not found`);
      }
      return {
        ...result,
        description: deserialize(result.description),
        emoji: deserialize(result.emoji),
      };
    },
    enabled: !!id,
  });
};
