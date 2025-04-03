import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { charactersTable } from "../../../../db/schema";
import { database, deserialize } from "@renderer/db";
import { eq, or, and } from "drizzle-orm";
import { Value } from "@udecode/plate";
import {
  fractalCharacterRelationshipsTable,
  fractalsTable,
} from "../../../../db/schema";

type SelectedCharacter = {
  id: number;
  age: number | null;
  sex: string | null;
  name: string;
};

type Relationship = {
  relationship: typeof fractalCharacterRelationshipsTable.$inferSelect;
  relatedCharacter: SelectedCharacter;
  fractal: typeof fractalsTable.$inferSelect;
};

type CharacterWithRelationships = typeof charactersTable.$inferSelect & {
  description: Value;
  relationships: Relationship[];
};

export const useCharacterWithRelationships = (
  id: number,
): UseQueryResult<CharacterWithRelationships, Error> => {
  return useQuery({
    queryKey: ["character", id, "with-relationships"],
    queryFn: async () => {
      // Get character data
      const characterResult = await database
        .select()
        .from(charactersTable)
        .where(eq(charactersTable.id, id))
        .get();

      if (!characterResult || !characterResult.id) {
        throw new Error(`Character with id ${id} not found`);
      }

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
            // Case 1: Character is the subject
            and(
              eq(fractalCharacterRelationshipsTable.subject_character_id, id),
              eq(
                fractalCharacterRelationshipsTable.object_character_id,
                charactersTable.id,
              ),
            ),
            // Case 2: Character is the object
            and(
              eq(fractalCharacterRelationshipsTable.object_character_id, id),
              eq(
                fractalCharacterRelationshipsTable.subject_character_id,
                charactersTable.id,
              ),
            ),
          ),
        )
        .innerJoin(
          fractalsTable,
          eq(fractalCharacterRelationshipsTable.fractal_id, fractalsTable.id),
        );

      return {
        ...characterResult,
        description: deserialize(characterResult.description),
        relationships,
      };
    },
    enabled: !!id,
  });
};
