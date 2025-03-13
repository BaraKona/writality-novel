import { useQuery } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import { projectsTable } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const useProject = (id: number) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const result = await database
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, id))
        .get();

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
