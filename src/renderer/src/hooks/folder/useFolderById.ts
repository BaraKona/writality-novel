import { useQuery } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { foldersTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useFolderById = (id: number) => {
  return useQuery({
    queryKey: ["folder", "single", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(foldersTable)
        .where(eq(foldersTable.id, id))
        .get();

      if (!result) {
        throw new Error(`Folder with id ${id} not found`);
      }

      return {
        ...result,
        description: deserialize(result.description),
        emoji: deserialize(result.emoji),
      };
    },
  });
};
