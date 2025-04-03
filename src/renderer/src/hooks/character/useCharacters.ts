import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  charactersTable,
  fractalCharacterRelationshipsTable,
} from "../../../../db/schema";
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

export const useCharactersWithFractalRelationships = (
  fractal_id: number | null,
): UseQueryResult<
  {
    character: typeof charactersTable.$inferSelect & {
      description: Value;
    };
    fractal_character_relationships: (typeof fractalCharacterRelationshipsTable.$inferSelect)[];
  }[],
  Error
> => {
  const currentProjectId = useAtomValue(currentProjectIdAtom);

  return useQuery({
    queryKey: [
      "charactersWithFractalRelationships",
      currentProjectId,
      fractal_id,
    ],
    queryFn: async () => {
      if (!fractal_id) {
        return [];
      }

      // First request: Get all characters for the current project
      const characters = await database
        .select()
        .from(charactersTable)
        .where(eq(charactersTable.project_id, currentProjectId!));

      // Second request: Get all relationships for the given fractal
      const relationships = await database
        .select()
        .from(fractalCharacterRelationshipsTable)
        .where(eq(fractalCharacterRelationshipsTable.fractal_id, fractal_id));

      // Map characters and match them with their relationships (both as subject and object)
      return characters.map((character) => {
        const subjectRelationships = relationships.filter(
          (rel) => rel.subject_character_id === character.id,
        );

        const objectRelationships = relationships.filter(
          (rel) => rel.object_character_id === character.id,
        );

        return {
          character: {
            ...character,
            description: deserialize(character.description),
          },
          fractal_character_relationships: [
            ...subjectRelationships,
            ...objectRelationships,
          ],
        };
      });
    },
  });
};
