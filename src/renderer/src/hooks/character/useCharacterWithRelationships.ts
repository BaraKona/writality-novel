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
  fractalId?: number | null,
): UseQueryResult<CharacterWithRelationships, Error> => {
  return useQuery({
    queryKey: ["character", id, "with-relationships", fractalId],
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
      const relationshipsData = await database
        .select()
        .from(fractalCharacterRelationshipsTable)
        .where(
          fractalId
            ? and(
                or(
                  eq(
                    fractalCharacterRelationshipsTable.subject_character_id,
                    id,
                  ),
                  eq(
                    fractalCharacterRelationshipsTable.object_character_id,
                    id,
                  ),
                ),
                eq(fractalCharacterRelationshipsTable.fractal_id, fractalId),
              )
            : or(
                eq(fractalCharacterRelationshipsTable.subject_character_id, id),
                eq(fractalCharacterRelationshipsTable.object_character_id, id),
              ),
        );

      // Process each relationship to get related character and fractal data
      const relationships: Relationship[] = await Promise.all(
        relationshipsData.map(async (relationship) => {
          // Determine which character ID is the related one (not the current character)
          const relatedCharacterId =
            relationship.subject_character_id === id
              ? relationship.object_character_id
              : relationship.subject_character_id;

          // Get the related character
          const relatedCharacter = await database
            .select({
              id: charactersTable.id,
              age: charactersTable.age,
              sex: charactersTable.sex,
              name: charactersTable.name,
            })
            .from(charactersTable)
            .where(eq(charactersTable.id, relatedCharacterId))
            .get();

          // Get the fractal
          const fractal = await database
            .select()
            .from(fractalsTable)
            .where(eq(fractalsTable.id, relationship.fractal_id))
            .get();

          return {
            relationship,
            relatedCharacter,
            fractal,
          };
        }),
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
