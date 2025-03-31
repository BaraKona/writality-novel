import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { database, deserialize } from "@renderer/db";
import {
  charactersTable,
  fractalCharacterRelationshipsTable,
  chaptersTable,
} from "../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { Value } from "@udecode/plate";
import { useAtomValue } from "jotai";
import { currentProjectIdAtom } from "@renderer/routes/__root";

export const useChapterCharactersFromFractal = (
  chapter: typeof chaptersTable.$inferSelect,
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
    queryKey: ["chapterCharactersFromFractal", chapter?.id],
    queryFn: async () => {
      // First get the chapter to find its fractal_id
      if (!chapter?.fractal_id) {
        return [];
      }

      if (!chapter) {
        throw new Error("Chapter not found");
      }

      // If there's no fractal, return empty array

      // Get characters with their fractal relationships using a left join
      const result = await database
        .select({
          characters: charactersTable,
          fractal_character_relationships: fractalCharacterRelationshipsTable,
          character_id: charactersTable.id,
        })
        .from(charactersTable)
        .leftJoin(
          fractalCharacterRelationshipsTable,
          and(
            eq(
              charactersTable.id,
              fractalCharacterRelationshipsTable.subject_character_id,
            ),
            eq(
              fractalCharacterRelationshipsTable.fractal_id,
              chapter.fractal_id,
            ),
          ),
        )
        .where(eq(charactersTable.project_id, currentProjectId!));

      return result.map((item) => ({
        characters: {
          ...item.characters,
          description: deserialize(item.characters.description),
        },
        fractal_character_relationships: item.fractal_character_relationships,
      }));
    },
    enabled: !!chapter?.id,
  });
};
