import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  fractalCharacterRelationshipsTable,
  charactersTable,
  fractalsTable,
} from "../../../../db/schema";
import { eq, or, and } from "drizzle-orm";

type SelectedCharacter = {
  id: number;
  age: number | null;
  sex: string | null;
  name: string;
};

type RelationshipGroup = {
  fractal: typeof fractalsTable.$inferSelect;
  relationships: {
    relationship: typeof fractalCharacterRelationshipsTable.$inferSelect;
    relatedCharacter: SelectedCharacter;
  }[];
};

export const useCharacterRelationships = (
  characterId: number,
): UseQueryResult<RelationshipGroup[], Error> => {
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
            // Case 1: Character is the subject
            and(
              eq(
                fractalCharacterRelationshipsTable.subject_character_id,
                characterId,
              ),
              eq(
                fractalCharacterRelationshipsTable.object_character_id,
                charactersTable.id,
              ),
            ),
            // Case 2: Character is the object
            and(
              eq(
                fractalCharacterRelationshipsTable.object_character_id,
                characterId,
              ),
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

      // Group relationships by fractal
      const groupedRelationships = relationships.reduce<RelationshipGroup[]>(
        (acc, curr) => {
          const existingGroup = acc.find(
            (group) => group.fractal.id === curr.fractal.id,
          );

          if (existingGroup) {
            existingGroup.relationships.push({
              relationship: curr.relationship,
              relatedCharacter: curr.relatedCharacter,
            });
          } else {
            acc.push({
              fractal: curr.fractal,
              relationships: [
                {
                  relationship: curr.relationship,
                  relatedCharacter: curr.relatedCharacter,
                },
              ],
            });
          }

          return acc;
        },
        [],
      );

      return groupedRelationships;
    },
    enabled: !!characterId,
  });
};
