import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import { charactersTable } from "../../../../db/schema";
import { deserialize } from "@renderer/db";
import { Value } from "@udecode/plate";

export const useCharacters = (): UseQueryResult<
  (typeof charactersTable.$inferSelect & {
    description: Value;
  })[],
  Error
> => {
  return useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const result = await database.select().from(charactersTable).all();

      return result.map((character) => ({
        ...character,
        description: deserialize(character.description),
      }));
    },
  });
};
