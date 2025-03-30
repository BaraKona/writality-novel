import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database } from "@renderer/db";
import {
  charactersTable,
  fractalCharacterRelationshipsTable,
} from "../../../../db/schema";
import { deserialize } from "@renderer/db";
import { Value } from "@udecode/plate";
import { useAtomValue } from "jotai";
import { and, eq } from "drizzle-orm";
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
    characters: typeof charactersTable.$inferSelect & {
      description: Value;
    };
    fractal_character_relationships: typeof fractalCharacterRelationshipsTable.$inferSelect;
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

      const result = await database
        .select({
          characters: charactersTable,
          fractal_character_relationships: fractalCharacterRelationshipsTable,
          character_id: charactersTable.id,
        })
        .from(charactersTable)
        .leftJoin(
          fractalCharacterRelationshipsTable,
          eq(
            charactersTable.id,
            fractalCharacterRelationshipsTable.subject_character_id,
          ),
        )
        .where(
          and(
            eq(charactersTable.project_id, currentProjectId!),
            eq(fractalCharacterRelationshipsTable.fractal_id, fractal_id),
          ),
        );

      return result.map((item) => ({
        characters: {
          ...item.characters,
          description: deserialize(item.characters.description),
        },
        fractal_character_relationships: item.fractal_character_relationships,
      }));
    },
  });
};
