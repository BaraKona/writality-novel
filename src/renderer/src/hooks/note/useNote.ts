import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { notesTable } from "../../../../db/schema";
import { database, deserialize } from "@renderer/db";
import { eq } from "drizzle-orm";
import { Value } from "@udecode/plate";

export const useNote = (
  id: number,
): UseQueryResult<
  typeof notesTable.$inferSelect & {
    content: Value;
  },
  Error
> => {
  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(notesTable)
        .where(eq(notesTable.id, id))
        .get();

      if (!result) {
        throw new Error(`Note with id ${id} not found`);
      }

      return {
        ...result,
        content: deserialize(result.content),
      };
    },
    enabled: !!id,
  });
};
