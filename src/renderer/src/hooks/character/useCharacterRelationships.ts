import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  fractalCharacterRelationshipsTable,
  charactersTable,
  fractalsTable,
} from "../../../../db/schema";
import { eq, or, and } from "drizzle-orm";

export const useCharacterRelationships = (
  characterId: number,
): UseQueryResult<
  {
    relationship: typeof fractalCharacterRelationshipsTable.$inferSelect;
    relatedCharacter: typeof charactersTable.$inferSelect;
    fractal: typeof fractalsTable.$inferSelect;
  }[],
  Error
> => {
  return useQuery({
    queryKey: ["character", characterId, "relationships"],
    queryFn: async () => {
      // Get relationships where this character is either the subject or object
      const relationships = await database
        .select({
          relationship: fractalCharacterRelationshipsTable,
          relatedCharacter: {
            id: charactersTable.id,
            age: charactersTable.age,
            sex: charactersTable.sex,
            name: charactersTable.name,
          },
          fractal: fractalsTable,
        })
        .from(fractalCharacterRelationshipsTable)
        .innerJoin(
          charactersTable,
          or(
            and(
              eq(
                fractalCharacterRelationshipsTable.object_character_id,
                charactersTable.id,
              ),
              eq(
                fractalCharacterRelationshipsTable.subject_character_id,
                characterId,
              ),
            ),
            and(
              eq(
                fractalCharacterRelationshipsTable.subject_character_id,
                charactersTable.id,
              ),
              eq(
                fractalCharacterRelationshipsTable.object_character_id,
                characterId,
              ),
            ),
          ),
        )
        .innerJoin(
          fractalsTable,
          eq(fractalCharacterRelationshipsTable.fractal_id, fractalsTable.id),
        );

      return relationships;
    },
    enabled: !!characterId,
  });
};
