import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { charactersTable } from "../../../../db/schema";
import { database, deserialize } from "@renderer/db";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useCharacter = (
  id: number,
): UseQueryResult<
  typeof charactersTable.$inferSelect & {
    description: Value;
  },
  Error
> => {
  return useQuery({
    queryKey: ["character", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(charactersTable)
        .where(eq(charactersTable.id, id))
        .get();

      if (!result || !result.id) {
        throw new Error(`Character with id ${id} not found`);
      }

      return {
        ...result,
        description: deserialize(result.description),
      };
    },
    enabled: !!id,
  });
};
