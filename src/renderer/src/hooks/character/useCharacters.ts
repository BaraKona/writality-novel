import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { charactersTable } from "../../../../db/schema";
import { deserialize } from "@renderer/db";
import { Value } from "@udecode/plate";
import { useAtomValue } from "jotai";
import { eq } from "drizzle-orm";
import { currentProjectIdAtom } from "@renderer/routes/__root";
export const useCharacters = (): UseQueryResult<
  (typeof charactersTable.$inferSelect & {
    description: Value;
  })[],
  Error
> => {
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  return useQuery({
    queryKey: ["characters", currentProjectId],
    queryFn: async () => {
      const result = await database
        .select()
        .from(charactersTable)
        .where(eq(charactersTable.project_id, currentProjectId!));

      return result.map((character) => ({
        ...character,
        description: deserialize(character.description),
      }));
    },
  });
};
